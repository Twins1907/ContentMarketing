import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Content Strategy Tips & Guides",
  description:
    "Learn how to build a content strategy, create content calendars, and grow your social media presence. Practical guides from the Orbyt team.",
  openGraph: {
    title: "Orbyt Blog — Content Strategy Tips & Guides",
    description:
      "Practical guides on content strategy, social media planning, and AI-powered marketing.",
  },
  alternates: {
    canonical: "https://getorbyt.io/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="bg-[#FFF8F0] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-16">
          <h1 className="font-display text-5xl md:text-6xl text-black mb-4">
            THE ORBYT BLOG
          </h1>
          <p className="text-lg text-[#333] max-w-2xl">
            Practical guides on content strategy, social media planning, and
            growing your online presence.
          </p>
        </header>

        <div className="space-y-6">
          {posts.map((post, i) => {
            const colors = ["#A6FAFF", "#FFA6F6", "#FFF066", "#B8FF9F", "#A8A6FF", "#FFC29F"];
            const bg = colors[i % colors.length];

            return (
              <article key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block border-2 border-black shadow-[4px_4px_0px_#000000] rounded-xl p-6 md:p-8 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] transition-all group"
                  style={{ backgroundColor: bg }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-black uppercase tracking-wide">
                      {post.category}
                    </span>
                    <span className="text-xs text-[#666]">·</span>
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs text-[#666]"
                    >
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="text-xs text-[#666]">·</span>
                    <span className="text-xs text-[#666]">
                      {post.readingTime}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl md:text-3xl text-black mb-3 group-hover:underline decoration-2 underline-offset-4">
                    {post.title}
                  </h2>

                  <p className="text-[#333] text-sm leading-relaxed mb-4">
                    {post.description}
                  </p>

                  <span className="inline-flex items-center text-sm font-bold text-black">
                    Read article
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
