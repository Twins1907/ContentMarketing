"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Rocket, Sparkles, ChevronDown } from "lucide-react";
import { PLAN_TIERS } from "@/lib/constants";

type PlanKey = "free" | "starter" | "pro";

const PLAN_CARDS: {
  key: PlanKey;
  bg: string;
  subtitle: string;
  priceLabel: string;
  priceSuffix: string;
  cta: string;
  ctaBg: string;
  popular?: boolean;
}[] = [
  {
    key: "free",
    bg: "#A6FAFF",
    subtitle: "No credit card required",
    priceLabel: "$0",
    priceSuffix: "",
    cta: "Get Started Free",
    ctaBg: "bg-white",
  },
  {
    key: "starter",
    bg: "#FFA6F6",
    subtitle: "Cancel anytime",
    priceLabel: `$${PLAN_TIERS.starter.price}`,
    priceSuffix: "/month",
    cta: "Start Starter Plan",
    ctaBg: "bg-[#FFE500]",
    popular: true,
  },
  {
    key: "pro",
    bg: "#FFF066",
    subtitle: "Cancel anytime",
    priceLabel: `$${PLAN_TIERS.pro.price}`,
    priceSuffix: "/month",
    cta: "Start Pro Plan",
    ctaBg: "bg-white",
  },
];

const FAQS = [
  {
    q: "What do I get with the free plan?",
    a: "You get one complete AI-generated content strategy with a 7-day calendar preview and a limited number of content briefs. It's a great way to experience the quality of our strategies before upgrading.",
  },
  {
    q: "What's included in each content brief?",
    a: "Every brief includes the post hook, full script/outline, visual direction, caption, hashtags, CTA, optimal posting time, and strategic reasoning for why this content matters to your audience. It's essentially a production-ready blueprint for each post.",
  },
  {
    q: "Can I use Orbyt for multiple businesses?",
    a: "The Pro plan supports multiple business profiles and unlimited strategy generation. The Starter plan gives you up to 5 strategies per month for a single business.",
  },
  {
    q: "How does the Starter plan work?",
    a: "For $19/month you can generate up to 5 strategies per month, each with a full 30-day calendar and all content briefs. Cancel anytime — your access continues until the end of the billing period.",
  },
  {
    q: "What's the difference between Starter and Pro?",
    a: "Starter gives you 5 strategies/month for one business at $19/month. Pro gives you unlimited strategies, multiple business profiles, and priority AI generation for $39/month — ideal for agencies or power users managing more than one brand.",
  },
  {
    q: "What platforms does Orbyt support?",
    a: "We support TikTok, Instagram, YouTube, X/Twitter, LinkedIn, Reddit, Facebook, Pinterest, and Threads. You can select multiple platforms and get tailored strategies for each one.",
  },
  {
    q: "How is this different from hiring a marketing agency?",
    a: "Traditional agencies charge thousands per month for content strategy. Orbyt delivers a comparable strategic plan in minutes using AI — with audience personas, content pillars, platform tactics, and production-ready briefs at a fraction of the cost. It's built for founders and small teams who want agency-quality strategy without the agency price tag.",
  },
  {
    q: "Can I regenerate or update my strategy?",
    a: "Yes. Starter users can generate up to 5 new strategies each month. Pro users get unlimited regeneration at any time. If your goals or audience change, simply generate a fresh strategy.",
  },
  {
    q: "How long does it take to generate a strategy?",
    a: "Most strategies are generated in under 60 seconds. The AI analyzes your business information, creates an audience persona, defines content pillars, builds platform-specific tactics, and writes individual content briefs for every day of your plan.",
  },
  {
    q: "Can I edit the content briefs after they're generated?",
    a: "Yes! Every content brief has a feedback and notes section where you can add your own thoughts. The briefs are starting points — you should always tailor them to your brand voice.",
  },
  {
    q: "What information do I need to provide?",
    a: "You'll need your business name, industry, a description of what you do, your target audience, which platforms you want to focus on, and your main goals. The more detail you provide, the more tailored and accurate your strategy will be.",
  },
  {
    q: "Is my business data safe?",
    a: "Absolutely. Your business information is encrypted in transit and at rest, and we never sell your data to third parties. Payment processing is handled securely through Stripe. See our Privacy Policy for full details.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes. If you're not satisfied within 7 days of your first payment on any plan, contact us for a full refund. For ongoing subscriptions, you can cancel anytime and your access continues until the end of the current billing period.",
  },
  {
    q: "Can I track my posting progress?",
    a: "Yes! The content calendar includes post status tracking. You can mark each brief as Posted, Pending, or Skipped to keep track of what you've published. Your dashboard shows your overall completion progress at a glance.",
  },
  {
    q: "Who is behind Orbyt?",
    a: "Orbyt is built and operated by E2 Partners LLC. If you have any questions, feedback, or need support, you can reach us at hello@e2partners.co.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b-2 border-black last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left font-semibold text-[15px] hover:opacity-80 transition-opacity"
      >
        <span>{q}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 ml-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-[#333333] text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFF8F0] border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#A8A6FF] border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-2xl">ORBYT</span>
          </Link>
          <Link href="/auth">
            <button className="bg-[#918EFA] text-white font-semibold text-sm px-5 py-2 border-2 border-black rounded-lg shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 mb-4 text-sm font-semibold px-4 py-1.5 bg-[#A8A6FF] text-black border-2 border-black rounded-lg shadow-[4px_4px_0px_#000000]">
            <Sparkles className="w-3.5 h-3.5" />
            Simple Pricing
          </span>
          <h1 className="font-display text-5xl md:text-6xl mt-4">
            SIMPLE, TRANSPARENT PRICING
          </h1>
          <p className="text-[#333333] text-lg max-w-xl mx-auto mt-4">
            Start with a free strategy. Upgrade when you want the full plan.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLAN_CARDS.map(
            ({ key, bg, subtitle, priceLabel, priceSuffix, cta, ctaBg, popular }) => {
              const tier = PLAN_TIERS[key];

              return (
                <div
                  key={key}
                  className="relative border-2 border-black rounded-xl shadow-[4px_4px_0px_#000000] flex flex-col"
                  style={{ backgroundColor: bg }}
                >
                  {popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 text-xs font-bold px-3 py-1 bg-black text-white rounded-full border-2 border-black whitespace-nowrap">
                      Most Popular
                    </span>
                  )}

                  <div className="p-6 pt-8 flex flex-col flex-1">
                    <p className="font-display text-2xl mb-3">
                      {tier.name.toUpperCase()}
                    </p>

                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-bold tracking-tight text-black">
                        {priceLabel}
                      </span>
                      {priceSuffix && (
                        <span className="text-base font-normal text-[#333333]">
                          {priceSuffix}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#333333] mb-6">{subtitle}</p>

                    <div className="w-full h-0.5 bg-black/20 mb-6" />

                    <ul className="space-y-3 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-4 h-4 mt-0.5 shrink-0 text-black" strokeWidth={3} />
                          <span className="text-black">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/auth" className="block mt-8">
                      <button
                        className={`w-full text-sm font-semibold py-3 px-4 border-2 border-black rounded-lg shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] transition-all text-black ${ctaBg}`}
                      >
                        {cta}
                        <ArrowRight className="inline-block ml-2 w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* FAQ */}
        <div id="faq" className="mt-24 max-w-2xl mx-auto scroll-mt-24">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 mb-4 text-sm font-semibold px-4 py-1.5 bg-[#B8FF9F] text-black border-2 border-black rounded-lg shadow-[4px_4px_0px_#000000]">
              FAQ
            </span>
            <h2 className="font-display text-3xl md:text-4xl mt-4">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-[#333333] text-sm mt-2">
              Everything you need to know about Orbyt
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#000000] px-6">
            {FAQS.map(({ q, a }, i) => (
              <FAQItem key={i} q={q} a={a} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <h3 className="font-display text-3xl md:text-4xl mb-2">
            READY TO LAUNCH?
          </h3>
          <p className="text-[#333333] mb-6">
            Start building your content strategy today.
          </p>
          <Link href="/auth">
            <button className="bg-[#FFE500] text-black font-semibold text-lg px-10 py-4 border-2 border-black rounded-lg shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] transition-all">
              Get Started Free
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
