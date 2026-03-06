import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { plan } = await req.json();

  let priceId: string;
  let mode: "payment" | "subscription";

  if (plan === "starter") {
    priceId = process.env.STRIPE_STARTER_PRICE_ID || "";
    mode = "subscription";
  } else if (plan === "pro") {
    priceId = process.env.STRIPE_PRO_PRICE_ID || "";
    mode = "subscription";
  } else {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  try {
    const checkoutSession = await createCheckoutSession({
      priceId,
      userId: session.user.id,
      customerEmail: session.user.email,
      mode,
    });
    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
