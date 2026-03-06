import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendAccountDeletionEmail } from "@/lib/email";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // Capture user info before deletion
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  await prisma.contentBrief.deleteMany({ where: { strategy: { userId } } });
  await prisma.strategy.deleteMany({ where: { userId } });
  await prisma.business.deleteMany({ where: { userId } });
  await prisma.session.deleteMany({ where: { userId } });
  await prisma.account.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });

  if (user?.email) {
    sendAccountDeletionEmail({ to: user.email, name: user.name }).catch((err) =>
      console.error("Failed to send account deletion email:", err)
    );
  }

  return NextResponse.json({ success: true });
}
