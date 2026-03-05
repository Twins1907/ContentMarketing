"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { businessSchema } from "@/lib/validations";

export async function createBusiness(data: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const parsed = businessSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Validation errors:", JSON.stringify(parsed.error.issues, null, 2));
    return { error: parsed.error.issues[0]?.message || "Invalid data" };
  }

  try {
    const business = await prisma.business.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
      },
    });

    // Mark onboarding as complete
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingComplete: true },
    });

    return { success: true, businessId: business.id };
  } catch (err) {
    console.error("createBusiness DB error:", err);
    return { error: "Failed to save business. Please try again." };
  }
}

export async function getBusinesses() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.business.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBusiness(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.business.findFirst({
    where: { id, userId: session.user.id },
  });
}

export async function updateBusiness(id: string, data: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const parsed = businessSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid data" };
  }

  const business = await prisma.business.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!business) {
    return { error: "Business not found" };
  }

  await prisma.business.update({
    where: { id },
    data: parsed.data,
  });

  return { success: true };
}
