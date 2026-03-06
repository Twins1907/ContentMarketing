"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, ArrowRight, Rocket, Sparkles } from "lucide-react";
import { PLAN_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type PlanKey = "free" | "starter" | "pro";

const PLAN_CARDS: {
  key: PlanKey;
  accent: string;
  checkColor: string;
  subtitle: string;
  priceLabel: string;
  priceSuffix: string;
  cta: string;
  popular?: boolean;
}[] = [
  {
    key: "free",
    accent: "#89CFF0",
    checkColor: "#89CFF0",
    subtitle: "No credit card required",
    priceLabel: "$0",
    priceSuffix: "",
    cta: "Get Started Free",
  },
  {
    key: "starter",
    accent: "#C9A7EB",
    checkColor: "#C9A7EB",
    subtitle: "Cancel anytime",
    priceLabel: `$${PLAN_TIERS.starter.price}`,
    priceSuffix: "/month",
    cta: "Start Starter Plan",
    popular: true,
  },
  {
    key: "pro",
    accent: "#F5C542",
    checkColor: "#F5C542",
    subtitle: "Cancel anytime",
    priceLabel: `$${PLAN_TIERS.pro.price}`,
    priceSuffix: "/month",
    cta: "Start Pro Plan",
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
    q: "Can I use LaunchMap for multiple businesses?",
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
    q: "What platforms does LaunchMap support?",
    a: "We support TikTok, Instagram, YouTube, X/Twitter, LinkedIn, Reddit, Facebook, Pinterest, and Threads. You can select multiple platforms and get tailored strategies for each one.",
  },
  {
    q: "How is this different from hiring a marketing agency?",
    a: "Traditional agencies charge thousands per month for content strategy. LaunchMap delivers a comparable strategic plan in minutes using AI — with audience personas, content pillars, platform tactics, and production-ready briefs at a fraction of the cost. It's built for founders and small teams who want agency-quality strategy without the agency price tag.",
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
    q: "Who is behind LaunchMap?",
    a: "LaunchMap is built and operated by E2 Partners LLC. If you have any questions, feedback, or need support, you can reach us at hello@e2partners.co.",
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("starter");

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <header className="bg-background border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#89CFF0] border-2 border-foreground rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#272727]">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-2xl font-bold">LaunchMap</span>
          </Link>
          <Link href="/auth">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Heading */}
        <div className="text-center mb-16">
          <Badge className="mb-4 text-sm px-4 py-1.5 bg-white text-foreground border-foreground shadow-[2px_2px_0px_#272727]">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#C9A7EB]" />
            Simple Pricing
          </Badge>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start with a free strategy. Upgrade when you want the full plan.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLAN_CARDS.map(
            ({
              key,
              accent,
              checkColor,
              subtitle,
              priceLabel,
              priceSuffix,
              cta,
              popular,
            }) => {
              const tier = PLAN_TIERS[key];
              const isSelected = selectedPlan === key;

              return (
                <Card
                  key={key}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPlan(key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedPlan(key);
                    }
                  }}
                  className={cn(
                    "relative cursor-pointer transition-all duration-200 flex flex-col",
                    isSelected
                      ? "ring-2 shadow-[4px_4px_0px_#272727] translate-x-0 translate-y-0"
                      : "shadow-[3px_3px_0px_#272727] hover:shadow-[4px_4px_0px_#272727] hover:-translate-x-[1px] hover:-translate-y-[1px]"
                  )}
                  style={{
                    borderColor: isSelected ? accent : undefined,
                    ...(isSelected
                      ? ({ "--tw-ring-color": accent } as React.CSSProperties)
                      : {}),
                  }}
                >
                  {/* Accent bar */}
                  <div
                    className="h-1.5 w-full rounded-t-xl"
                    style={{ backgroundColor: accent }}
                  />

                  {popular && (
                    <Badge
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-white border-foreground shadow-[2px_2px_0px_#272727]"
                      style={{ backgroundColor: accent }}
                    >
                      Most Popular
                    </Badge>
                  )}

                  <CardContent className="pt-8 pb-6 flex flex-col flex-1">
                    {/* Plan name */}
                    <p className="font-display text-xl font-bold mb-3">
                      {tier.name}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-bold tracking-tight">
                        {priceLabel}
                      </span>
                      {priceSuffix && (
                        <span className="text-base font-normal text-muted-foreground">
                          {priceSuffix}
                        </span>
                      )}
                    </div>

                    {/* Subtitle */}
                    <p className="text-sm text-muted-foreground mb-6">
                      {subtitle}
                    </p>

                    {/* Divider */}
                    <div className="w-full h-px bg-border mb-6" />

                    {/* Features */}
                    <ul className="space-y-3 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2
                            className="w-4.5 h-4.5 mt-0.5 shrink-0"
                            style={{ color: checkColor }}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link href="/auth" className="block mt-8">
                      <Button
                        className={cn(
                          "w-full text-sm font-semibold py-5 transition-all",
                          isSelected
                            ? "text-white border-2 border-foreground shadow-[3px_3px_0px_#272727] hover:shadow-[1px_1px_0px_#272727] hover:translate-x-[2px] hover:translate-y-[2px]"
                            : "border-2 border-foreground bg-white text-foreground hover:bg-gray-50"
                        )}
                        style={
                          isSelected
                            ? { backgroundColor: accent }
                            : undefined
                        }
                      >
                        {cta}
                        {isSelected && (
                          <ArrowRight className="ml-2 w-4 h-4" />
                        )}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>

        {/* FAQ */}
        <div id="faq" className="mt-24 max-w-2xl mx-auto scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm">
              Everything you need to know about LaunchMap
            </p>
          </div>

          <Card className="shadow-[3px_3px_0px_#272727]">
            <CardContent className="pt-2 pb-2 px-6">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map(({ q, a }, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                    <AccordionTrigger className="text-left font-semibold text-[15px] hover:no-underline py-5">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to launch your content strategy?
          </p>
          <Link href="/auth">
            <Button
              size="lg"
              className="text-lg px-10 py-6 shadow-[4px_4px_0px_#272727] hover:shadow-[2px_2px_0px_#272727] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
