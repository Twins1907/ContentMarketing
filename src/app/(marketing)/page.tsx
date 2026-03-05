"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Sparkles,
  Calendar,
  FileText,
  ArrowRight,
  Zap,
  Target,
  Users,
  BarChart3,
} from "lucide-react";
import {
  AnimatedSection,
  StaggeredContainer,
  StaggeredItem,
  AnimatedCounter,
  FloatingElement,
  FloatingShape,
  GradientOrb,
  SparkleField,
  WordReveal,
  PulseRing,
} from "@/components/ui/animated-section";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-2 border-foreground bg-hero-animated min-h-[85vh] flex items-center">
        {/* Animated gradient orbs */}
        <GradientOrb colors={["#C9A7EB", "#A78BFA"]} size={400} className="top-[-10%] left-[-5%]" duration={10} />
        <GradientOrb colors={["#89CFF0", "#60A5FA"]} size={350} className="bottom-[-5%] right-[-5%]" duration={12} delay={2} />
        <GradientOrb colors={["#F5C542", "#FBBF24"]} size={250} className="top-[20%] right-[10%]" duration={9} delay={4} />
        <GradientOrb colors={["#C9A7EB", "#89CFF0"]} size={200} className="bottom-[15%] left-[15%]" duration={11} delay={1} />

        {/* Floating geometric shapes */}
        <FloatingShape shape="ring" color="rgba(255,255,255,0.25)" size={60} className="top-[12%] left-[8%]" delay={0} duration={7} amplitude={20} rotate={180} />
        <FloatingShape shape="square" color="rgba(255,255,255,0.15)" size={24} className="top-[20%] right-[12%]" delay={1} duration={8} amplitude={25} rotate={90} />
        <FloatingShape shape="circle" color="rgba(245,197,66,0.3)" size={16} className="top-[35%] left-[5%]" delay={0.5} duration={6} amplitude={18} rotate={0} />
        <FloatingShape shape="diamond" color="rgba(255,255,255,0.2)" size={32} className="bottom-[25%] right-[8%]" delay={2} duration={9} amplitude={22} rotate={180} />
        <FloatingShape shape="ring" color="rgba(137,207,240,0.3)" size={44} className="bottom-[15%] left-[12%]" delay={1.5} duration={7} amplitude={16} rotate={-180} />
        <FloatingShape shape="dot" color="rgba(255,255,255,0.4)" size={8} className="top-[15%] left-[35%]" delay={0.8} duration={5} amplitude={12} rotate={0} />
        <FloatingShape shape="square" color="rgba(201,167,235,0.25)" size={18} className="top-[60%] right-[18%]" delay={3} duration={8} amplitude={20} rotate={-90} />
        <FloatingShape shape="triangle" color="rgba(255,255,255,0.15)" size={20} className="top-[45%] left-[20%]" delay={2.5} duration={10} amplitude={15} rotate={60} />
        <FloatingShape shape="dot" color="rgba(245,197,66,0.35)" size={6} className="bottom-[30%] right-[30%]" delay={1.2} duration={4} amplitude={10} rotate={0} />
        <FloatingShape shape="ring" color="rgba(255,255,255,0.18)" size={28} className="top-[70%] left-[40%]" delay={3.5} duration={7} amplitude={14} rotate={270} />

        {/* Sparkle field */}
        <SparkleField count={18} colors={["#FFFFFF", "#F5C542", "#FFFFFF", "#89CFF0"]} />

        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center relative z-10">
          <AnimatedSection>
            <Badge className="mb-6 text-sm px-4 py-1.5 bg-white/90 backdrop-blur-sm text-foreground border-foreground shadow-[2px_2px_0px_#272727]">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#C9A7EB]" />
              AI-Powered Strategy
            </Badge>
          </AnimatedSection>

          <div className="mb-6">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
              <WordReveal text="Your Custom Content" delay={0.2} staggerDelay={0.1} />
              <br />
              <WordReveal text="Strategy in Minutes" delay={0.7} staggerDelay={0.1} />
            </h1>
          </div>

          <AnimatedSection delay={0.9}>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-white/90 leading-relaxed">
              Stop guessing what to post. LaunchMap uses AI to create a tailored
              content strategy with detailed briefs — for any timeline, any platform,
              any business.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.1}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <PulseRing color="rgba(255,255,255,0.4)">
                <Link href="/auth">
                  <Button size="lg" className="text-lg px-8 py-6 bg-white text-foreground border-2 border-foreground shadow-[4px_4px_0px_#272727] hover:shadow-[2px_2px_0px_#272727] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    Get Your Strategy
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </PulseRing>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white/50 hover:bg-white/20 hover:border-white transition-all">
                  View Pricing
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={1.3}>
            <p className="text-sm text-white/70 mt-5">
              No credit card required. Your strategy in under 5 minutes.
            </p>
          </AnimatedSection>

        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Agency-Level Strategy,
              <br />
              Without the Agency
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              You don&apos;t need a full marketing team to launch a winning content strategy.
              Get a complete, strategic roadmap in three simple steps.
            </p>
          </AnimatedSection>

          <StaggeredContainer className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: Target,
                title: "Define Your Goals",
                description:
                  "Tell us about your business, audience, and what you want to achieve. No intake call needed — just 2 minutes of your time.",
                color: "#C9A7EB",
              },
              {
                step: 2,
                icon: Sparkles,
                title: "AI Builds Your Strategy",
                description:
                  "Our AI generates a complete content strategy — audience insights, content pillars, platform tactics, and a full posting calendar that would cost thousands from a traditional agency.",
                color: "#89CFF0",
              },
              {
                step: 3,
                icon: FileText,
                title: "Execute With Detailed Briefs",
                description:
                  "Every post comes with production-ready briefs your team can execute immediately — hook, script, visual direction, caption, hashtags, and strategic reasoning.",
                color: "#E8614D",
              },
            ].map(({ step, icon: Icon, title, description, color }) => (
              <StaggeredItem key={step}>
                <Card className="relative overflow-hidden h-full">
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: color }}
                  />
                  <CardContent className="pt-8 pb-6">
                    <div
                      className="w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center mb-4 shadow-[3px_3px_0px_#272727]"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-2">
                      Step {step}: {title}
                    </h3>
                    <p className="text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </StaggeredItem>
            ))}
          </StaggeredContainer>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 bg-white border-y-2 border-foreground">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <br />
              Post With Purpose
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Not just ideas — a complete, strategic content plan you can act on immediately
            </p>
          </AnimatedSection>

          <StaggeredContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: "Custom Content Calendar",
                description:
                  "A strategic posting schedule tailored to your timeline — whether it's 2 weeks or 6 months",
                color: "#89CFF0",
              },
              {
                icon: FileText,
                title: "Per-Post Briefs",
                description:
                  "Hook, script, visuals, caption, hashtags, CTA, and optimal posting time for every single post",
                color: "#C9A7EB",
              },
              {
                icon: Users,
                title: "Audience Persona",
                description:
                  "A detailed profile of your ideal customer — their pain points, preferences, and behavior",
                color: "#F97316",
              },
              {
                icon: Zap,
                title: "Content Pillars",
                description:
                  "Strategic content themes with percentage splits and example topics aligned to your goals",
                color: "#F5C542",
              },
              {
                icon: BarChart3,
                title: "Platform Strategy",
                description:
                  "Tailored tactics, posting frequency, best times, and content formats for each platform",
                color: "#34D399",
              },
              {
                icon: Target,
                title: "Strategic Reasoning",
                description:
                  "Every content decision explained — understand the 'why' behind each post",
                color: "#E8614D",
              },
            ].map(({ icon: Icon, title, description, color }) => (
              <StaggeredItem key={title}>
                <Card className="h-full">
                  <CardContent className="pt-6 pb-6">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-foreground flex items-center justify-center mb-3 shadow-[2px_2px_0px_#272727]"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </StaggeredItem>
            ))}
          </StaggeredContainer>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-16 bg-gradient-to-r from-[#C9A7EB] via-[#89CFF0] to-[#F5C542] border-y-2 border-foreground">
        <div className="max-w-5xl mx-auto px-4">
          <AnimatedSection>
            <div className="grid grid-cols-3 gap-6">
              {[
                { target: 10, suffix: "K+", label: "Strategies Generated" },
                { target: 300, suffix: "K+", label: "Content Briefs Created" },
                { target: 50, suffix: "+", label: "Industries Covered" },
              ].map(({ target, suffix, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-4xl md:text-6xl font-bold text-white">
                    <AnimatedCounter target={target} suffix={suffix} />
                  </p>
                  <p className="text-white/80 text-sm md:text-base mt-1 uppercase tracking-wide font-bold">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-background">
        <AnimatedSection className="max-w-3xl mx-auto px-4 text-center">
          <FloatingElement amplitude={6} duration={3}>
            <div className="w-16 h-16 bg-[#89CFF0] border-2 border-foreground rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#272727] mx-auto mb-6">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </FloatingElement>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Ready to Launch Your
            <br />
            Content Strategy?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of businesses using LaunchMap to create strategic,
            consistent content — on any platform, for any timeline.
          </p>
          <Link href="/auth">
            <Button size="lg" className="text-lg px-10 py-6">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
