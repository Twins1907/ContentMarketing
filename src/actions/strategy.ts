"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getStrategies() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.strategy.findMany({
    where: { userId: session.user.id, deletedAt: null },
    include: { business: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStrategy(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.strategy.findFirst({
    where: { id, userId: session.user.id },
    include: {
      business: true,
      briefs: {
        orderBy: { dayNumber: "asc" },
      },
    },
  });
}

export async function getLatestStrategy() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.strategy.findFirst({
    where: { userId: session.user.id },
    include: {
      business: true,
      briefs: {
        orderBy: { dayNumber: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStrategyStatus(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.strategy.findFirst({
    where: { id, userId: session.user.id },
    select: {
      id: true,
      status: true,
      generationStep: true,
    },
  });
}

export async function getBrief(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const brief = await prisma.contentBrief.findFirst({
    where: { id },
    include: {
      strategy: {
        select: { userId: true, business: { select: { businessName: true } } },
      },
    },
  });

  if (!brief || brief.strategy.userId !== session.user.id) return null;

  return brief;
}

export async function getBriefsByStrategy(strategyId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const strategy = await prisma.strategy.findFirst({
    where: { id: strategyId, userId: session.user.id },
  });

  if (!strategy) return [];

  return prisma.contentBrief.findMany({
    where: { strategyId },
    orderBy: { dayNumber: "asc" },
  });
}

// ============================================
// PROJECT MANAGEMENT
// ============================================

export async function updateProjectStatus(
  id: string,
  status: "active" | "paused" | "archived"
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  const strategy = await prisma.strategy.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!strategy) return { error: "Strategy not found" };

  await prisma.strategy.update({
    where: { id },
    data: { projectStatus: status },
  });

  return { success: true };
}

export async function deleteStrategy(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  const strategy = await prisma.strategy.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!strategy) return { error: "Strategy not found" };

  await prisma.strategy.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return { success: true };
}

// ============================================
// PROJECT COLOR
// ============================================

export async function updateProjectColor(id: string, color: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  const strategy = await prisma.strategy.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!strategy) return { error: "Strategy not found" };

  await prisma.strategy.update({
    where: { id },
    data: { projectColor: color },
  });

  return { success: true };
}

// ============================================
// POST STATUS TRACKING
// ============================================

export async function updatePostStatus(
  briefId: string,
  postStatus: "pending" | "completed" | "skipped"
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  const brief = await prisma.contentBrief.findFirst({
    where: { id: briefId },
    include: { strategy: { select: { userId: true } } },
  });

  if (!brief || brief.strategy.userId !== session.user.id) {
    return { error: "Brief not found" };
  }

  await prisma.contentBrief.update({
    where: { id: briefId },
    data: { postStatus },
  });

  return { success: true };
}

// ============================================
// BRIEF FEEDBACK
// ============================================

export async function addBriefFeedback(
  briefId: string,
  content: string,
  type: "note" | "ai_suggestion" = "note"
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  // Verify the brief belongs to user
  const brief = await prisma.contentBrief.findFirst({
    where: { id: briefId },
    include: { strategy: { select: { userId: true } } },
  });

  if (!brief || brief.strategy.userId !== session.user.id) {
    return { error: "Brief not found" };
  }

  const feedback = await prisma.briefFeedback.create({
    data: {
      briefId,
      userId: session.user.id,
      content,
      type,
    },
  });

  return { success: true, feedback };
}

export async function getBriefFeedback(briefId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const brief = await prisma.contentBrief.findFirst({
    where: { id: briefId },
    include: { strategy: { select: { userId: true } } },
  });

  if (!brief || brief.strategy.userId !== session.user.id) return [];

  return prisma.briefFeedback.findMany({
    where: { briefId },
    orderBy: { createdAt: "desc" },
  });
}

export async function suggestBriefChanges(briefId: string, userFeedback: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  const brief = await prisma.contentBrief.findFirst({
    where: { id: briefId },
    include: { strategy: { select: { userId: true } } },
  });

  if (!brief || brief.strategy.userId !== session.user.id) {
    return { error: "Brief not found" };
  }

  // Generate AI suggestion (mock for now)
  const suggestion = generateMockSuggestion(brief, userFeedback);

  const feedback = await prisma.briefFeedback.create({
    data: {
      briefId,
      userId: session.user.id,
      content: suggestion,
      type: "ai_suggestion",
    },
  });

  return { success: true, feedback };
}

function generateMockSuggestion(
  brief: { hook: string; script: string; visualDirection: string; platform: string; pillar: string },
  userFeedback: string
): string {
  const feedbackLower = userFeedback.toLowerCase();

  let hookSuggestion = `Consider revising the hook to be more attention-grabbing. Instead of "${brief.hook.slice(0, 40)}...", try leading with a bold claim or question that directly addresses your audience's pain point.`;
  let scriptSuggestion = `The script could benefit from a stronger narrative arc. Open with the problem, present your solution mid-way, and close with a clear transformation story.`;
  let visualSuggestion = `For the visual direction, consider using more dynamic compositions — split screens, before/after comparisons, or close-up product shots work well on ${brief.platform}.`;

  if (feedbackLower.includes("hook") || feedbackLower.includes("opening")) {
    hookSuggestion = `Based on your feedback, here's a revised hook approach: Start with a controversial or surprising statement related to "${brief.pillar}" that stops the scroll. Example: "Most people get this completely wrong..."`;
  }
  if (feedbackLower.includes("script") || feedbackLower.includes("content") || feedbackLower.includes("copy")) {
    scriptSuggestion = `Revised script direction: Break the content into 3 clear sections — (1) Hook + Problem Statement, (2) Your Unique Take/Solution, (3) Call to Action. Keep each section punchy and under 30 seconds for ${brief.platform}.`;
  }
  if (feedbackLower.includes("visual") || feedbackLower.includes("image") || feedbackLower.includes("video")) {
    visualSuggestion = `Updated visual direction: Use a mix of talking-head footage and B-roll. Incorporate text overlays for key points and use your brand colors consistently throughout.`;
  }

  return `**AI Suggestion based on your feedback:**\n\n**Hook:** ${hookSuggestion}\n\n**Script:** ${scriptSuggestion}\n\n**Visual Direction:** ${visualSuggestion}\n\nThese changes should better align with your feedback: "${userFeedback}"`;
}
