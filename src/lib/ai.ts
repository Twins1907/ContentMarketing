import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface BusinessInput {
  businessName: string;
  industry: string;
  description: string;
  website?: string;
  targetAudience: string;
  platforms: string[];
  goals: string[];
  duration?: number;
  contentTone?: string[];
  availableAssets?: string[];
  budget?: string;
  plannedStartDate?: string;
}

async function callClaude(label: string, systemPrompt: string, userPrompt: string, maxTokens = 4096): Promise<string> {
  const start = Date.now();
  console.log(`[AI] Starting: ${label}`);
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });
    console.log(`[AI] Completed: ${label} in ${Date.now() - start}ms`);
    const block = message.content[0];
    if (block.type === "text") return block.text;
    return "";
  } catch (err) {
    console.error(`[AI] FAILED: ${label} after ${Date.now() - start}ms`, err);
    throw err;
  }
}

function parseJSON(text: string): unknown {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

export async function generateStrategy(
  strategyId: string,
  business: BusinessInput
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "placeholder" || apiKey.trim() === "") {
    const { generateMockStrategy } = await import("./mock-generator");
    return generateMockStrategy(strategyId, business);
  }

  const days = business.duration || 7;
  const systemPrompt = `You are an expert social media strategist. You create data-driven content strategies for businesses. Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

  const bizContext = `Business: ${business.businessName}
Industry: ${business.industry}
Description: ${business.description}
Target Audience: ${business.targetAudience}
Goals: ${business.goals.join(", ")}
Platforms: ${business.platforms.join(", ")}${business.contentTone?.length ? `\nTone: ${business.contentTone.join(", ")}` : ""}${business.availableAssets?.length ? `\nAssets: ${business.availableAssets.join(", ")}` : ""}${business.budget ? `\nBudget: ${business.budget}` : ""}`;

  try {
    // Steps 1-4 in parallel — they're independent of each other
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { generationStep: 1 },
    });

    console.log(`[AI] Starting generation for strategy ${strategyId}, duration: ${days} days`);

    const [overviewRaw, personaRaw, platformRaw, pillarsRaw] = await Promise.all([
      callClaude(
        "overview",
        systemPrompt,
        `Analyze this business and create a strategic overview. Return JSON with this exact structure:
{"businessSummary":"...","valueProposition":"...","toneAndVoice":"...","differentiators":["...",".."]}

${bizContext}`
      ),
      callClaude(
        "persona",
        systemPrompt,
        `Based on this business, create a detailed audience persona. Return JSON:
{"name":"...","age":"...","occupation":"...","interests":["..."],"painPoints":["..."],"platforms":["..."],"contentPreferences":["..."],"buyingBehavior":"..."}

${bizContext}`
      ),
      callClaude(
        "platform-strategy",
        systemPrompt,
        `Create platform-specific strategies. Return JSON array:
[{"platform":"...","postingFrequency":"...","bestTimes":["..."],"contentFormats":["..."],"keyTactics":["..."]}]

${bizContext}`
      ),
      callClaude(
        "pillars",
        systemPrompt,
        `Create 4-5 content pillars. Return JSON array:
[{"name":"...","description":"...","percentage":40,"exampleTopics":["...","...","..."]}]
Percentages must total 100.

${bizContext}`
      ),
    ]);

    const overview = parseJSON(overviewRaw);
    const persona = parseJSON(personaRaw);
    const platformStrategy = parseJSON(platformRaw);
    const pillars = parseJSON(pillarsRaw);

    await prisma.strategy.update({
      where: { id: strategyId },
      data: {
        overview: overview as object,
        audiencePersona: persona as object,
        platformStrategy: platformStrategy as object,
        contentPillars: pillars as object,
        generationStep: 5,
      },
    });

    // Step 5: Calendar — depends on pillars
    const calendarRaw = await callClaude(
      `calendar-${days}d`,
      systemPrompt,
      `Create a ${days}-day content calendar. Return JSON array of exactly ${days} items:
[{"day":1,"platform":"tiktok","pillar":"Education","briefHook":"..."}]

Use these platforms: ${business.platforms.join(", ")}
Content pillars: ${JSON.stringify(pillars)}
Rotate platforms and pillars strategically.`,
      days > 30 ? 8192 : 4096
    );
    const calendar = parseJSON(calendarRaw);

    await prisma.strategy.update({
      where: { id: strategyId },
      data: { calendar: calendar as object, generationStep: 6 },
    });

    // Step 6: Content briefs — parallel batches of 10
    const calendarDays = calendar as Array<{ day: number; platform: string; pillar: string; briefHook: string }>;
    const batchSize = 10;
    const batches: Array<{ day: number; platform: string; pillar: string; briefHook: string }>[] = [];
    for (let i = 0; i < calendarDays.length; i += batchSize) {
      batches.push(calendarDays.slice(i, i + batchSize));
    }

    console.log(`[AI] Generating briefs in ${batches.length} parallel batches`);

    const briefResults = await Promise.all(
      batches.map((batchDays, i) =>
        callClaude(
          `briefs-batch-${i + 1}`,
          systemPrompt,
          `Create detailed content briefs for these days. Return JSON array:
[{"dayNumber":1,"platform":"...","pillar":"...","goal":"...","hook":"...","script":"...","visualDirection":"...","caption":"...","hashtags":["..."],"cta":"...","postingTime":"...","strategicReasoning":"..."}]

${bizContext}

Days to create briefs for:
${JSON.stringify(batchDays)}`,
          8192
        )
      )
    );

    for (const briefsRaw of briefResults) {
      const briefs = parseJSON(briefsRaw) as Array<{
        dayNumber: number;
        platform: string;
        pillar: string;
        goal: string;
        hook: string;
        script: string;
        visualDirection: string;
        caption: string;
        hashtags: string[];
        cta: string;
        postingTime: string;
        strategicReasoning: string;
      }>;

      await prisma.contentBrief.createMany({
        data: briefs.map((b) => ({
          strategyId,
          dayNumber: b.dayNumber,
          platform: b.platform,
          pillar: b.pillar,
          goal: b.goal,
          hook: b.hook,
          script: b.script,
          visualDirection: b.visualDirection,
          caption: b.caption,
          hashtags: b.hashtags,
          cta: b.cta,
          postingTime: b.postingTime,
          strategicReasoning: b.strategicReasoning,
        })),
      });
    }

    console.log(`[AI] Strategy ${strategyId} completed successfully`);
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { status: "ready" },
    });
  } catch (error) {
    console.error(`[AI] Strategy ${strategyId} FAILED:`, error);
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { status: "failed" },
    });
  }
}
