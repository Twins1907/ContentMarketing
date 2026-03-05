import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateStrategy } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId is required" },
        { status: 400 }
      );
    }

    // Verify business belongs to user
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId: session.user.id },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Parse start date safely
    let startDate = new Date();
    if (business.plannedStartDate && business.plannedStartDate.trim() !== "") {
      const parsed = new Date(business.plannedStartDate + "T00:00:00");
      if (!isNaN(parsed.getTime())) {
        startDate = parsed;
      }
    }

    // Create strategy record
    const strategy = await prisma.strategy.create({
      data: {
        userId: session.user.id,
        businessId: business.id,
        status: "generating",
        generationStep: 0,
        startDate,
      },
    });

    // Start generation in background (non-blocking)
    generateStrategy(strategy.id, {
      businessName: business.businessName,
      industry: business.industry,
      description: business.description,
      website: business.website || undefined,
      targetAudience: business.targetAudience,
      platforms: business.platforms,
      goals: business.goals,
      duration: business.duration || 30,
      contentTone: business.contentTone || [],
      availableAssets: business.availableAssets || [],
      budget: business.budget || undefined,
      plannedStartDate: business.plannedStartDate || undefined,
    }).catch((err) => {
      console.error("Background generation failed:", err);
    });

    return NextResponse.json({ strategyId: strategy.id });
  } catch (error) {
    console.error("Generate route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
