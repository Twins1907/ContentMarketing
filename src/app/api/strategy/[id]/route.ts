import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const strategy = await prisma.strategy.findFirst({
    where: { id, userId: session.user.id },
    include: {
      business: true,
      briefs: { orderBy: { dayNumber: "asc" } },
    },
  });

  if (!strategy) {
    return NextResponse.json(
      { error: "Strategy not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(strategy);
}
