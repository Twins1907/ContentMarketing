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
      model: "claude-sonnet-4-20250514",
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
  const systemPrompt = `You are an elite social media strategist with 10+ years of experience growing brands on social platforms. You specialize in the ${business.industry} industry.

Your strategies are:
- Data-driven and based on current platform algorithms and best practices
- Tailored to the specific business — never generic templates
- Actionable with specific, detailed guidance for each post
- Focused on genuine audience engagement and measurable business outcomes

Always respond with valid JSON only — no markdown fences, no explanation outside the JSON.`;

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
        `Analyze this business and create a comprehensive strategic overview. Go deep — this should read like a paid strategy document, not a generic template.

Return JSON with this exact structure:
{
  "businessSummary": "2-3 sentence analysis of the business positioning, market opportunity, and competitive landscape",
  "valueProposition": "The core value proposition that should be communicated across all content — specific to this business",
  "toneAndVoice": "Detailed description of the brand voice: how they should sound, words/phrases to use, words to avoid, the personality they should project",
  "differentiators": ["3-5 specific things that make this business unique vs competitors — be specific, not generic"],
  "strategyDirection": {
    "primaryApproach": "The overarching content strategy in 2-3 sentences — what's the big idea that ties everything together?",
    "growthPlaybook": ["3-4 specific, actionable growth tactics tailored to this business and industry"],
    "weeklyRhythm": "Describe the ideal weekly content rhythm — which days for what types of content and why",
    "keyMetrics": "The 3-4 specific metrics this business should track and target numbers where possible",
    "contentMix": "The recommended ratio of content types (educational/entertaining/promotional/community) with reasoning"
  }
}

${bizContext}`
      ),
      callClaude(
        "persona",
        systemPrompt,
        `Create a vivid, detailed audience persona for this business. This should feel like a real person, not a demographic checkbox. Go beyond surface-level demographics.

Return JSON:
{
  "name": "A realistic first name that represents the target demographic",
  "age": "Specific age or narrow range",
  "occupation": "Specific job title, not just industry",
  "interests": ["5-7 specific interests — actual hobbies, brands they follow, activities they do, not generic categories"],
  "painPoints": ["4-6 specific frustrations they experience that this business can solve — be vivid and specific"],
  "platforms": ["Which social platforms they use most and WHY — what do they use each one for?"],
  "contentPreferences": ["What type of content they engage with most — be specific about formats, lengths, styles"],
  "buyingBehavior": "How they discover, evaluate, and decide to purchase — what triggers action? What are their objections?",
  "dayInTheLife": "A brief paragraph describing a typical day and where this business's product/service fits in",
  "contentThatConverts": "What specific content approaches would move this persona from follower to customer"
}

${bizContext}`
      ),
      callClaude(
        "platform-strategy",
        systemPrompt,
        `Create detailed, platform-specific strategies. Each strategy should be highly specific to both the platform AND this business — not generic best practices.

Return JSON array:
[{
  "platform": "platform name",
  "postingFrequency": "Specific frequency with reasoning (e.g., '4-5x/week — TikTok rewards daily posting but quality > quantity for this niche')",
  "bestTimes": ["3-4 specific posting times with reasoning based on the target audience's habits"],
  "contentFormats": ["4-6 specific content formats ranked by expected performance for THIS business on THIS platform"],
  "keyTactics": ["5-7 specific, actionable tactics — not generic advice like 'use hashtags', but specific strategies like 'Create a recurring [format] series called [name idea] that addresses [specific pain point]'"]
}]

Only include strategies for these platforms: ${business.platforms.join(", ")}

${bizContext}`
      ),
      callClaude(
        "pillars",
        systemPrompt,
        `Create 4-5 content pillars for this business. Each pillar should be specific to the business and industry — not generic categories like "educational" or "behind the scenes."

Return JSON array:
[{
  "name": "A catchy, brandable pillar name (not generic — e.g., 'Kitchen Confidentials' instead of 'Behind the Scenes')",
  "description": "2-3 sentences explaining what this pillar covers and why it matters for the audience",
  "percentage": 25,
  "exampleTopics": ["5-6 specific post ideas within this pillar — actual topics, not vague descriptions"]
}]

Rules:
- Percentages must total 100
- Each pillar should serve a different purpose (awareness, trust, conversion, community, etc.)
- Pillar names should be memorable and could work as hashtags or series names
- Example topics should be specific enough that someone could immediately create the content

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
      `Create a ${days}-day content calendar for ${business.businessName}. Return a JSON array of exactly ${days} items.

Each item must have these fields:
{
  "day": 1,
  "platform": "instagram",
  "pillar": "Pillar Name",
  "briefHook": "A compelling 1-sentence hook that captures the post concept — this should be scroll-stopping, not generic",
  "contentFormat": "Reel (30-60s)",
  "weekTheme": "Brand Introduction"
}

Rules for contentFormat — use platform-appropriate formats:
- TikTok: "Short-form Video (15-30s)", "Duet/Stitch", "Photo Carousel", "Talking Head Video"
- Instagram: "Reel (15-30s)", "Reel (30-60s)", "Carousel Post", "Single Image Post", "Story Series"
- YouTube: "YouTube Short", "Long-form Video (8-15 min)", "Community Post"
- X/Twitter: "Text Thread", "Quote Tweet Style", "Poll", "Image Post"
- LinkedIn: "Text Post", "Document Carousel (PDF)", "Short Video", "Article", "Poll"
- Reddit: "Text Post", "Image Post", "AMA"
- Facebook: "Video Post", "Photo Post", "Story", "Live Stream"
- Pinterest: "Standard Pin", "Idea Pin", "Video Pin"
- Threads: "Text Post", "Image Post", "Carousel"

Rules for weekTheme — assign a thematic focus for each week (days 1-7 = Week 1, days 8-14 = Week 2, etc.):
- All days in the same week should share the same weekTheme
- Themes should build on each other progressively (e.g., Week 1: "Brand Introduction", Week 2: "Problem Awareness", Week 3: "Solution Showcase", Week 4: "Social Proof & Trust")

Rules for briefHook — each hook should:
- Be specific to ${business.businessName} and its offerings
- Create curiosity, tension, or promise a clear benefit
- Vary in style (questions, bold statements, stories, statistics, challenges)

Use these platforms (rotate strategically): ${business.platforms.join(", ")}
Content pillars: ${JSON.stringify(pillars)}
Business goals: ${business.goals.join(", ")}
${business.contentTone?.length ? `Content tone: ${business.contentTone.join(", ")}` : ""}
${business.availableAssets?.length ? `Available assets: ${business.availableAssets.join(", ")}` : ""}`,
      days > 30 ? 8192 : 4096
    );
    const calendar = parseJSON(calendarRaw);

    // Save calendar — step 5 still (briefs not done yet)
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { calendar: calendar as object },
    });

    // Step 6: Content briefs — sequential batches for reliability
    const calendarDays = calendar as Array<{ day: number; platform: string; pillar: string; briefHook: string; contentFormat?: string }>;
    const batchSize = 7; // smaller batches = more reliable JSON from Claude
    const batches: Array<{ day: number; platform: string; pillar: string; briefHook: string; contentFormat?: string }>[] = [];
    for (let i = 0; i < calendarDays.length; i += batchSize) {
      batches.push(calendarDays.slice(i, i + batchSize));
    }

    console.log(`[AI] Generating briefs in ${batches.length} batches (sequential)`);
    let briefsWritten = 0;

    for (let i = 0; i < batches.length; i++) {
      const batchDays = batches[i];
      try {
        const briefsRaw = await callClaude(
          `briefs-batch-${i + 1}`,
          systemPrompt,
          `Create detailed, production-ready content briefs for these ${batchDays.length} days. These briefs should be specific to ${business.businessName} — reference actual products, services, and value propositions. A content creator should be able to produce the content directly from these briefs.

Return a JSON array with exactly ${batchDays.length} objects. Each object must have ALL of these fields:
{
  "dayNumber": 1,
  "platform": "instagram",
  "pillar": "Pillar Name",
  "contentFormat": "Reel (30-60s)",
  "goal": "Specific measurable goal for this post (e.g., 'Drive 50+ saves by teaching a useful technique')",
  "hook": "Scroll-stopping opening line — the first thing people see or hear. Must create curiosity, tension, or promise value",
  "script": "Full content script or outline. For video: include shot-by-shot breakdown with timing, transitions, and on-screen text suggestions. For carousels: outline each slide. For text posts: full copy ready to paste. For images: detailed concept description",
  "visualDirection": "Detailed visual direction: specific camera angles, lighting style, color palette, text overlay styling, font suggestions, props needed, location/setting, mood/aesthetic reference",
  "caption": "Platform-optimized caption with strategic line breaks, relevant emoji usage, and natural tone. Include a micro-CTA within the caption",
  "hashtags": ["8-15 hashtags mixing niche-specific, mid-range, and broad reach tags"],
  "cta": "Specific call to action — tell the viewer exactly what to do next and why",
  "postingTime": "HH:MM AM/PM EST",
  "postingTimeRationale": "Why this specific time is optimal for this platform, audience, and content type",
  "strategicReasoning": "How this post fits into the overall strategy — what it achieves, how it builds on previous posts, and what it sets up for future content",
  "aiMediaPrompt": "A detailed prompt for AI image/video generation tools (Midjourney, DALL-E). Describe: subject, composition, lighting, style, color palette, mood, camera angle, and any text overlays",
  "carouselSlides": null
}

IMPORTANT: If contentFormat contains "Carousel" or "slides", set carouselSlides as an array:
[{"slideNumber": 1, "textOverlay": "Bold headline text for this slide", "visualDescription": "Background, imagery, and visual elements"}]
For non-carousel formats, set carouselSlides to null.

Context about the business:
${bizContext}

Days to create briefs for:
${JSON.stringify(batchDays)}`,
          8192
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
          postingTimeRationale: string;
          strategicReasoning: string;
          contentFormat: string;
          aiMediaPrompt: string;
          carouselSlides: Array<{ slideNumber: number; textOverlay: string; visualDescription: string }> | null;
        }>;

        await prisma.contentBrief.createMany({
          data: briefs.map((b, idx) => ({
            strategyId,
            dayNumber: Number(b.dayNumber) || batchDays[idx]?.day || (i * batchSize + idx + 1),
            platform: b.platform ?? batchDays[idx]?.platform ?? "unknown",
            pillar: b.pillar ?? "",
            goal: b.goal ?? "",
            hook: b.hook ?? "",
            script: b.script ?? "",
            visualDirection: b.visualDirection ?? "",
            caption: b.caption ?? "",
            hashtags: Array.isArray(b.hashtags) ? b.hashtags : [],
            cta: b.cta ?? "",
            postingTime: b.postingTime ?? "",
            postingTimeRationale: b.postingTimeRationale ?? "",
            strategicReasoning: b.strategicReasoning ?? "",
            contentFormat: b.contentFormat ?? batchDays[idx]?.contentFormat ?? "Single Image Post",
            aiMediaPrompt: b.aiMediaPrompt ?? "",
            carouselSlides: Array.isArray(b.carouselSlides) ? b.carouselSlides : undefined,
          })),
          skipDuplicates: true,
        });

        briefsWritten += briefs.length;
        console.log(`[AI] Briefs batch ${i + 1}/${batches.length} saved (${briefsWritten} total)`);
      } catch (batchErr) {
        // Log but don't fail entire strategy — partial briefs are better than nothing
        console.error(`[AI] Brief batch ${i + 1} failed, skipping:`, batchErr);
      }
    }

    if (briefsWritten === 0) {
      console.error(`[AI] Strategy ${strategyId} completed with 0 briefs — marking as failed`);
      await prisma.strategy.update({
        where: { id: strategyId },
        data: { status: "failed", generationStep: 6 },
      });
    } else {
      console.log(`[AI] Strategy ${strategyId} completed. Briefs written: ${briefsWritten}/${calendarDays.length}`);
      await prisma.strategy.update({
        where: { id: strategyId },
        data: { status: "ready", generationStep: 6 },
      });
    }
  } catch (error) {
    console.error(`[AI] Strategy ${strategyId} FAILED:`, error);
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { status: "failed" },
    });
  }
}
