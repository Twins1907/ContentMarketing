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

  const brief = await prisma.contentBrief.findFirst({
    where: { id },
    include: {
      strategy: {
        select: {
          userId: true,
          business: { select: { businessName: true } },
        },
      },
    },
  });

  if (!brief || brief.strategy.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Brief not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(brief);
}
