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

async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = message.content[0];
  if (block.type === "text") return block.text;
  return "";
}

function parseJSON(text: string): unknown {
  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

export async function generateStrategy(
  strategyId: string,
  business: BusinessInput
) {
  // Route to mock generator if no real API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "placeholder" || apiKey.trim() === "") {
    const { generateMockStrategy } = await import("./mock-generator");
    return generateMockStrategy(strategyId, business);
  }

  const systemPrompt = `You are an expert social media strategist. You create data-driven content strategies for businesses. Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

  try {
    // Step 1: Business Analysis
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { generationStep: 1 },
    });

    const overviewRaw = await callClaude(
      systemPrompt,
      `Analyze this business and create a strategic overview. Return JSON with this exact structure:
{"businessSummary":"...","valueProposition":"...","toneAndVoice":"...","differentiators":["...",".."]}

Business: ${business.businessName}
Industry: ${business.industry}
Description: ${business.description}
Target Audience: ${business.targetAudience}
Goals: ${business.goals.join(", ")}
Platforms: ${business.platforms.join(", ")}`
    );
    const overview = parseJSON(overviewRaw);

    await prisma.strategy.update({
      where: { id: strategyId },
      data: { overview: overview as object, generationStep: 2 },
    });

    // Step 2: Audience Persona
    const personaRaw = await callClaude(
      systemPrompt,
      `Based on this business, create a detailed audience persona. Return JSON:
{"name":"...","age":"...","occupation":"...","interests":["..."],"painPoints":["..."],"platforms":["..."],"contentPreferences":["..."],"buyingBehavior":"..."}

Business: ${business.businessName} — ${business.description}
Target: ${business.targetAudience}`
    );
    const persona = parseJSON(personaRaw);

    await prisma.strategy.update({
      where: { id: strategyId },
      data: { audiencePersona: persona as object, generationStep: 3 },
    });

    // Step 3: Platform Strategy
    const platformRaw = await callClaude(
      systemPrompt,
      `Create platform-specific strategies. Return JSON array:
[{"platform":"...","postingFrequency":"...","bestTimes":["..."],"contentFormats":["..."],"keyTactics":["..."]}]

Business: ${business.businessName} — ${business.description}
Platforms: ${business.platforms.join(", ")}
Goals: ${business.goals.join(", ")}
Audience: ${business.targetAudience}`
    );
    const platformStrategy = parseJSON(platformRaw);

    await prisma.strategy.update({
      where: { id: strategyId },
      data: { platformStrategy: platformStrategy as object, generationStep: 4 },
    });

    // Step 4: Content Pillars
    const pillarsRaw = await callClaude(
      systemPrompt,
      `Create 4-5 content pillars. Return JSON array:
[{"name":"...","description":"...","percentage":40,"exampleTopics":["...","...","..."]}]
Percentages must total 100.

Business: ${business.businessName} — ${business.description}
Goals: ${business.goals.join(", ")}
Audience: ${business.targetAudience}`
    );
    const pillars = parseJSON(pillarsRaw);

    await prisma.strategy.update({
      where: { id: strategyId },
      data: { contentPillars: pillars as object, generationStep: 5 },
    });

    // Step 5: 30-Day Calendar
    const calendarRaw = await callClaude(
      systemPrompt,
      `Create a 30-day content calendar. Return JSON array of 30 items:
[{"day":1,"platform":"tiktok","pillar":"Education","briefHook":"..."}]

Use these platforms: ${business.platforms.join(", ")}
Content pillars: ${JSON.stringify(pillars)}
Rotate platforms and pillars strategically.`
    );
    const calendar = parseJSON(calendarRaw);

    await prisma.strategy.update({
      where: { id: strategyId },
      data: { calendar: calendar as object, generationStep: 6 },
    });

    // Step 6: Content Briefs (generate in batches of 10)
    const calendarDays = calendar as Array<{ day: number; platform: string; pillar: string; briefHook: string }>;

    for (let batch = 0; batch < 3; batch++) {
      const batchDays = calendarDays.slice(batch * 10, (batch + 1) * 10);

      const briefsRaw = await callClaude(
        systemPrompt,
        `Create detailed content briefs for these days. Return JSON array:
[{"dayNumber":1,"platform":"...","pillar":"...","goal":"...","hook":"...","script":"...","visualDirection":"...","caption":"...","hashtags":["..."],"cta":"...","postingTime":"...","strategicReasoning":"..."}]

Business: ${business.businessName} — ${business.description}
Audience: ${business.targetAudience}

Days to create briefs for:
${JSON.stringify(batchDays)}`
      );

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

    // Mark as ready
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { status: "ready" },
    });
  } catch (error) {
    console.error("Strategy generation failed:", error);
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { status: "failed" },
    });
  }
}
