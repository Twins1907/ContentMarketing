import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Simple, Transparent Plans",
  description:
    "Start free, upgrade when you're ready. Orbyt offers a free plan, Starter at $19/month, and Pro at $39/month for unlimited AI content strategies.",
  openGraph: {
    title: "Orbyt Pricing — Plans Starting at $0",
    description:
      "Get your first AI content strategy free. Upgrade to Starter ($19/mo) or Pro ($39/mo) for unlimited strategies and full content calendars.",
  },
  alternates: {
    canonical: "https://getorbyt.io/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
