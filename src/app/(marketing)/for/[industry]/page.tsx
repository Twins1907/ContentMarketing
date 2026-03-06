import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { getIndustryBySlug, getAllIndustrySlugs } from "@/lib/industries";

interface Props {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  return getAllIndustrySlugs().map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  const page = getIndustryBySlug(industry);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title: `${page.metaTitle} | Orbyt`,
      description: page.metaDescription,
    },
    alternates: {
      canonical: `https://getorbyt.io/for/${industry}`,
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { industry } = await params;
  const page = getIndustryBySlug(industry);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://getorbyt.io/for/${industry}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Orbyt",
      url: "https://getorbyt.io",
    },
  };

  return (
    <div className="bg-[#FFF8F0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-block text-black border-2 border-black shadow-[2px_2px_0px_#000000] rounded-full px-4 py-1 text-sm font-bold mb-6"
                style={{ backgroundColor: page.color }}
              >
                For {page.industry}
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-black leading-[0.95] mb-6">
                {page.headline}
              </h1>
              <p className="text-lg text-[#333] max-w-xl mb-8 leading-relaxed">
                {page.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-8 py-4 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                  Build My Strategy — Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center bg-white text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-8 py-4 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            {/* Stat card */}
            <div className="flex justify-center">
              <div
                className="border-2 border-black shadow-[8px_8px_0px_#000000] rounded-xl p-10 text-center"
                style={{ backgroundColor: page.color }}
              >
                <div className="font-display text-6xl md:text-7xl text-black mb-2">
                  {page.stat.value}
                </div>
                <p className="text-sm text-[#333] max-w-[200px] mx-auto">
                  {page.stat.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-black text-center mb-12">
            SOUND FAMILIAR?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {page.painPoints.map((point, i) => {
              const colors = ["#A6FAFF", "#FFA6F6", "#FFF066"];
              return (
                <div
                  key={point.title}
                  className="rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] p-8"
                  style={{ backgroundColor: colors[i % colors.length] }}
                >
                  <h3 className="font-display text-xl text-black mb-3">
                    {point.title.toUpperCase()}
                  </h3>
                  <p className="text-[#333] text-sm leading-relaxed">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample content */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-black text-center mb-4">
            SAMPLE CONTENT ORBYT WOULD GENERATE
          </h2>
          <p className="text-center text-[#333] mb-10">
            Here are example post topics tailored to {page.industry.toLowerCase()}:
          </p>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] rounded-xl p-6 md:p-8">
            <div className="space-y-4">
              {page.sampleTopics.map((topic, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-3 border-b border-black/10 last:border-0"
                >
                  <span className="font-display text-lg text-[#999] w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-[#333] font-medium">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-black text-center mb-12">
            WHAT YOU GET
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Detailed audience persona for your industry",
              "Content pillars tailored to your niche",
              "30-day content calendar with every post mapped",
              "Production-ready briefs (hook, script, caption, hashtags)",
              "Platform-specific tactics (TikTok, Instagram, YouTube, etc.)",
              "Strategic reasoning behind every content decision",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#B8FF9F] border-2 border-black rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                </div>
                <span className="text-[#333] text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28" style={{ backgroundColor: page.color }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-black mb-6">
            YOUR FIRST STRATEGY IS FREE.
          </h2>
          <p className="text-lg text-[#333] max-w-xl mx-auto mb-8">
            Get a complete content strategy for your{" "}
            {page.industry.toLowerCase()} business in under 2 minutes. No credit
            card required.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-10 py-5 text-lg font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            Build My Free Strategy
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
