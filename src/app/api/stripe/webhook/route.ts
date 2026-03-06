import { NextRequest, NextResponse } from "next/server";
import { getStripeWebhookEvent } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendSubscriptionEmail } from "@/lib/email";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = getStripeWebhookEvent(body, sig);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      // Both starter and pro are now subscriptions
      if (session.mode === "subscription") {
        const priceId = session.metadata?.priceId;
        const plan = priceId === process.env.STRIPE_PRO_PRICE_ID ? "pro" : "starter";
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            stripeCustomerId: session.customer as string,
            stripeSubId: session.subscription as string,
          },
        });

        if (updatedUser.email) {
          sendSubscriptionEmail({
            to: updatedUser.email,
            name: updatedUser.name,
            plan: plan as "starter" | "pro",
          }).catch((err) => console.error("Failed to send subscription email:", err));
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      // Downgrade to free
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { plan: "free", stripeSubId: null },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
