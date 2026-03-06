import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

export async function createCheckoutSession({
  priceId,
  userId,
  customerEmail,
  mode,
}: {
  priceId: string;
  userId: string;
  customerEmail: string;
  mode: "payment" | "subscription";
}) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    customer_email: customerEmail,
    metadata: { userId, priceId },
  });

  return session;
}

export async function createPortalSession(customerId: string) {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
  });

  return session;
}

export function getStripeWebhookEvent(body: string, sig: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(body, sig, webhookSecret);
}
