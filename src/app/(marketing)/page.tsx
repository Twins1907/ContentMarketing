"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Shuffle,
  Wallet,
  Calendar,
  FileText,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  AnimatedSection,
  StaggeredContainer,
  StaggeredItem,
  AnimatedCounter,
} from "@/components/ui/animated-section";

/* ------------------------------------------------------------------ */
/*  Section: Hero                                                      */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="bg-[#FFF8F0] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div>
            <AnimatedSection>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-black leading-[0.95] mb-6">
                YOUR $3,000 CONTENT STRATEGIST — FOR FREE.
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-lg md:text-xl text-[#333] max-w-xl mb-8 leading-relaxed">
                Tell us about your business. In 2 minutes, Orbyt builds a complete
                content plan — every post scripted, captioned, and ready to execute.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-8 py-4 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                  Build My Strategy — Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="#preview"
                  className="inline-flex items-center justify-center bg-white text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-8 py-4 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                  See a Sample Strategy
                </Link>
              </div>
              <p className="text-sm text-[#999] mt-4">
                No credit card needed. Takes 2 minutes.
              </p>
            </AnimatedSection>
          </div>

          {/* Right — product mockup */}
          <AnimatedSection delay={0.4}>
            <div className="border-2 border-black shadow-[8px_8px_0px_#000000] rounded-xl overflow-hidden bg-white">
              <div className="bg-black px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F76363]" />
                <div className="w-3 h-3 rounded-full bg-[#FFE500]" />
                <div className="w-3 h-3 rounded-full bg-[#7DF752]" />
                <span className="ml-2 text-xs text-white/60 font-mono">getorbyt.io/dashboard</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#A8A6FF] border-2 border-black rounded-lg shadow-[2px_2px_0px_#000000]" />
                  <div>
                    <div className="font-bold text-sm">30-Day Content Calendar</div>
                    <div className="text-xs text-[#666]">Fitness coaching business</div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-[#999] pb-1">{d}</div>
                  ))}
                  {Array.from({ length: 14 }, (_, i) => {
                    const colors = ["#A6FAFF", "#FFA6F6", "#FFF066", "#B8FF9F", "#A8A6FF", "#FFC29F"];
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-md border border-black/20 flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: colors[i % colors.length] }}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2 pt-2">
                  {[
                    { platform: "TikTok", hook: "Stop doing cardio wrong...", color: "#A6FAFF" },
                    { platform: "Instagram", hook: "3 meals I prep every Sunday", color: "#FFA6F6" },
                    { platform: "YouTube", hook: "Full morning routine revealed", color: "#FFF066" },
                  ].map((item) => (
                    <div key={item.platform} className="flex items-center gap-2 text-xs">
                      <span
                        className="px-2 py-0.5 rounded border border-black/20 font-bold"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.platform}
                      </span>
                      <span className="text-[#333] truncate">{item.hook}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Pain Points                                               */
/* ------------------------------------------------------------------ */
function PainPoints() {
  const cards = [
    {
      icon: Clock,
      bg: "#A6FAFF",
      title: "I'LL POST TOMORROW...",
      body: "You open Instagram, stare at the blank screen for 10 minutes, and close the app. Repeat daily.",
    },
    {
      icon: Shuffle,
      bg: "#FFA6F6",
      title: "WHAT'S EVEN WORKING?",
      body: "You're posting, but it feels random. No strategy, no pillars, no reason behind any of it.",
    },
    {
      icon: Wallet,
      bg: "#FFF066",
      title: "I CAN'T AFFORD A STRATEGIST",
      body: "Agencies charge $2K–5K/month. Freelancers ghost you. ChatGPT gives you generic lists.",
    },
  ];

  return (
    <section className="bg-[#FFF8F0] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-black">
            YOU KNOW YOU NEED TO POST. YOU JUST DON&apos;T KNOW WHAT.
          </h2>
        </AnimatedSection>

        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <StaggeredItem key={card.title}>
              <div
                className="rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] p-8 h-full"
                style={{ backgroundColor: card.bg }}
              >
                <card.icon className="w-8 h-8 text-black mb-4" />
                <h3 className="font-display text-xl text-black mb-3">{card.title}</h3>
                <p className="text-[#333] text-sm leading-relaxed">{card.body}</p>
              </div>
            </StaggeredItem>
          ))}
        </StaggeredContainer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: How It Works                                              */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      bg: "#FFF066",
      title: "ANSWER 5 QUICK QUESTIONS",
      body: "Your business, your audience, your goals. No intake calls, no onboarding decks — just 2 minutes.",
    },
    {
      num: "02",
      bg: "#A8A6FF",
      title: "AI BUILDS YOUR COMPLETE STRATEGY",
      body: "Audience persona. Content pillars. Platform tactics. A full calendar with every post mapped out — the same deliverable agencies charge thousands for.",
    },
    {
      num: "03",
      bg: "#B8FF9F",
      title: "OPEN ANY DAY. START CREATING.",
      body: "Every post comes with a hook, script, caption, hashtags, visual direction, and CTA. Copy, paste, post.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#FFF8F0] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-black max-w-4xl mx-auto">
            FROM &ldquo;I DON&apos;T KNOW WHAT TO POST&rdquo; TO A FULL CONTENT PLAN. IN 2 MINUTES.
          </h2>
        </AnimatedSection>

        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <StaggeredItem key={step.num}>
              <div
                className="rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] p-8 h-full"
                style={{ backgroundColor: step.bg }}
              >
                <span className="font-display text-6xl text-black leading-none">{step.num}</span>
                <h3 className="font-display text-xl text-black mt-4 mb-3">{step.title}</h3>
                <p className="text-[#333] text-sm leading-relaxed">{step.body}</p>
              </div>
            </StaggeredItem>
          ))}
        </StaggeredContainer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Features                                                  */
/* ------------------------------------------------------------------ */
function Features() {
  const topCards = [
    {
      icon: Calendar,
      bg: "#A6FAFF",
      title: "30-DAY CONTENT CALENDAR",
      body: "Every day mapped out with platform, format, pillar, and posting time — all decided for you.",
    },
    {
      icon: FileText,
      bg: "#FFA6F6",
      title: "PRODUCTION-READY BRIEFS",
      body: "Hook. Script. Caption. Hashtags. Visual direction. CTA. For every single post.",
    },
    {
      icon: Users,
      bg: "#FFF066",
      title: "AUDIENCE PERSONA",
      body: "Know exactly who you're talking to — their pain points, behavior, and what makes them buy.",
    },
  ];

  const pills = [
    "Content Pillars & Weighting",
    "Platform-Specific Tactics",
    "Strategic Reasoning per Post",
    "AI Media Prompts",
  ];

  return (
    <section id="features" className="bg-[#FFF8F0] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-black">
            HERE&apos;S WHAT YOU GET. SERIOUSLY, ALL OF THIS.
          </h2>
        </AnimatedSection>

        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {topCards.map((card) => (
            <StaggeredItem key={card.title}>
              <div
                className="rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] p-8 h-full"
                style={{ backgroundColor: card.bg }}
              >
                <card.icon className="w-8 h-8 text-black mb-4" />
                <h3 className="font-display text-xl text-black mb-3">{card.title}</h3>
                <p className="text-[#333] text-sm leading-relaxed">{card.body}</p>
              </div>
            </StaggeredItem>
          ))}
        </StaggeredContainer>

        <StaggeredContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pills.map((pill) => (
            <StaggeredItem key={pill}>
              <div className="bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] p-4 text-center text-sm font-medium text-black">
                {pill}
              </div>
            </StaggeredItem>
          ))}
        </StaggeredContainer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Value Stats                                               */
/* ------------------------------------------------------------------ */
function ValueStats() {
  const stats = [
    { value: "$3,000+", label: "What agencies charge for this" },
    { value: "2 MIN", label: "To generate your strategy" },
    { value: "30 DAYS", label: "Of content, fully scripted" },
  ];

  return (
    <section className="bg-[#FFF8F0] py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center py-8 md:py-0 ${
                  i < 2 ? "md:border-r-2 md:border-black" : ""
                } ${i > 0 ? "border-t-2 md:border-t-0 border-black" : ""}`}
              >
                <p className="font-display text-5xl md:text-5xl text-black">{stat.value}</p>
                <p className="text-sm text-[#666] mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Sample Output Preview                                     */
/* ------------------------------------------------------------------ */
function SamplePreview() {
  return (
    <section id="preview" className="bg-[#FFF8F0] py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-black mb-4">
            SEE WHAT ORBYT CREATES.
          </h2>
          <p className="text-lg text-[#333]">
            Here&apos;s a sample strategy generated for a fitness coaching business.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <PreviewTabs />
        </AnimatedSection>
      </div>
    </section>
  );
}

function PreviewTabs() {
  const tabs = ["Audience Persona", "Content Calendar", "Content Brief"] as const;
  const [active, setActive] = useState<(typeof tabs)[number]>("Audience Persona");

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`border-2 border-black rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              active === tab
                ? "bg-[#918EFA] shadow-[2px_2px_0px_#000000]"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] rounded-xl p-6 md:p-8">
        {active === "Audience Persona" && <PersonaTab />}
        {active === "Content Calendar" && <CalendarTab />}
        {active === "Content Brief" && <BriefTab />}
      </div>

      {/* CTA below */}
      <div className="text-center mt-8">
        <Link
          href="/auth"
          className="inline-flex items-center justify-center bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-8 py-4 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        >
          Generate Your Own — Free
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

function PersonaTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-[#FFA6F6] border-2 border-black rounded-xl shadow-[2px_2px_0px_#000000] flex items-center justify-center font-display text-2xl">
          DD
        </div>
        <div>
          <h3 className="font-display text-xl text-black">DRIVEN DANA</h3>
          <p className="text-sm text-[#666]">Age 28–35 · Busy Professional</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Pain Points" items={["No time to plan meals", "Starts programs but can't stay consistent", "Overwhelmed by conflicting fitness advice"]} />
        <Field label="Content Preferences" items={["Quick actionable tips (<60s)", "Before/after transformations", "Meal prep walkthroughs"]} />
        <Field label="Platforms" items={["Instagram Reels", "TikTok", "YouTube Shorts"]} />
        <Field label="Buying Behavior" items={["Tries free content first", "Values social proof", "Decides within 1 week of discovery"]} />
      </div>
    </div>
  );
}

function Field({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="bg-[#FFF8F0] border border-black/10 rounded-lg p-4">
      <h4 className="text-xs font-bold text-black uppercase tracking-wide mb-2">{label}</h4>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm text-[#333]">• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function CalendarTab() {
  const days = [
    { day: "Mon", platform: "TikTok", title: "Stop doing cardio wrong", pillar: "Education", color: "#A6FAFF" },
    { day: "Tue", platform: "Instagram", title: "3 meals I prep every Sunday", pillar: "Behind the Scenes", color: "#FFA6F6" },
    { day: "Wed", platform: "YouTube", title: "Full morning routine", pillar: "Social Proof", color: "#FFF066" },
    { day: "Thu", platform: "TikTok", title: "This protein myth needs to die", pillar: "Education", color: "#A6FAFF" },
    { day: "Fri", platform: "Instagram", title: "Client went from 0 to 5K", pillar: "Social Proof", color: "#B8FF9F" },
    { day: "Sat", platform: "TikTok", title: "Reacting to fitness trends", pillar: "Trends", color: "#FFC29F" },
    { day: "Sun", platform: "Instagram", title: "Weekly Q&A: your questions", pillar: "Community", color: "#A8A6FF" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-[#999] uppercase tracking-wide mb-4">Week 1 of 4</p>
      {days.map((d) => (
        <div key={d.day} className="flex items-center gap-3 py-2 border-b border-black/5 last:border-0">
          <span className="w-10 text-xs font-bold text-black">{d.day}</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded border border-black/20"
            style={{ backgroundColor: d.color }}
          >
            {d.platform}
          </span>
          <span className="text-sm text-[#333] flex-1 truncate">{d.title}</span>
          <span className="hidden sm:inline text-[10px] font-medium px-2 py-0.5 bg-white border border-black/10 rounded-full text-[#666]">
            {d.pillar}
          </span>
        </div>
      ))}
    </div>
  );
}

function BriefTab() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold text-[#999] uppercase tracking-wide mb-1">Day 1 · TikTok · Education</p>
        <h3 className="font-display text-lg text-black">STOP DOING CARDIO WRONG — HERE&apos;S WHY YOU&apos;RE NOT LOSING FAT</h3>
      </div>

      <div>
        <h4 className="text-xs font-bold text-black uppercase tracking-wide mb-2">Script</h4>
        <div className="bg-[#FFF8F0] border border-black/10 rounded-lg p-4 text-sm text-[#333] space-y-2">
          <p><strong>Hook (0–3s):</strong> &ldquo;If you&apos;re doing 45 min of cardio and not losing weight, stop. Here&apos;s why.&rdquo;</p>
          <p><strong>Body (3–25s):</strong> Explain the science of EPOC and why strength training burns more calories over 24 hours. Use a split-screen comparison showing cardio vs. weights calorie burn timeline.</p>
          <p><strong>Close (25–35s):</strong> &ldquo;Swap 2 cardio sessions for strength this week. Follow for more fat-loss science.&rdquo;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-bold text-black uppercase tracking-wide mb-2">Caption</h4>
          <p className="text-sm text-[#333]">Cardio isn&apos;t the enemy — but it&apos;s not the whole answer either. Here&apos;s the science your gym bro won&apos;t tell you.</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-black uppercase tracking-wide mb-2">Visual Direction</h4>
          <p className="text-sm text-[#333]">Talking head in gym setting, split-screen calorie comparison graphic, text overlay for key stats.</p>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-black uppercase tracking-wide mb-2">Hashtags</h4>
        <div className="flex flex-wrap gap-2">
          {["#FatLoss", "#FitnessScience", "#StrengthTraining", "#CardioMyths", "#FitTok"].map((tag) => (
            <span key={tag} className="bg-[#FFF8F0] border border-black/10 rounded-full px-3 py-1 text-xs font-medium text-[#333]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-black uppercase tracking-wide mb-2">CTA</h4>
        <p className="text-sm text-[#333]">Follow for more fat-loss science that actually works.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Final CTA                                                 */
/* ------------------------------------------------------------------ */
function FinalCTA() {
  return (
    <section className="bg-[#A8A6FF] py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <AnimatedSection>
          <h2 className="font-display text-4xl md:text-5xl text-black mb-6">
            YOUR FIRST STRATEGY IS FREE. YOUR FIRST POST COULD GO LIVE TONIGHT.
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <p className="text-lg text-[#333] max-w-xl mx-auto mb-8">
            No credit card. No catch. A complete content plan built for your business in 2 minutes.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-10 py-5 text-lg font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            Build My Free Strategy
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  JSON-LD Structured Data                                            */
/* ------------------------------------------------------------------ */
function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Orbyt",
    url: "https://getorbyt.io",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI-powered social media content strategy generator. Get audience personas, content calendars, and production-ready briefs for every post.",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
      { "@type": "Offer", price: "19", priceCurrency: "USD", name: "Starter" },
      { "@type": "Offer", price: "39", priceCurrency: "USD", name: "Pro" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

import { useState } from "react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <JsonLd />
      <Hero />
      <PainPoints />
      <HowItWorks />
      <Features />
      <ValueStats />
      <SamplePreview />
      <FinalCTA />
    </div>
  );
}
