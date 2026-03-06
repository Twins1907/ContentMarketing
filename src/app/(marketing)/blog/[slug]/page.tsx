import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllSlugs, getAllPosts } from "@/lib/blog";
import { BlogCTA, RelatedPosts } from "@/components/blog-cta";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://getorbyt.io/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title, category: p.category }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Orbyt",
      url: "https://getorbyt.io",
    },
    mainEntityOfPage: `https://getorbyt.io/blog/${slug}`,
  };

  return (
    <div className="bg-[#FFF8F0] py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-[#666] hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#A8A6FF] text-black border-2 border-black rounded-full px-3 py-0.5 text-xs font-bold">
              {post.category}
            </span>
            <time dateTime={post.publishedAt} className="text-xs text-[#666]">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="text-xs text-[#666]">{post.readingTime}</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-black leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-[#333]">{post.description}</p>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-display prose-headings:text-black prose-headings:mt-10 prose-headings:mb-4
            prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-[#333] prose-p:leading-relaxed prose-p:mb-5
            prose-li:text-[#333] prose-li:leading-relaxed
            prose-strong:text-black prose-strong:font-bold
            prose-a:text-[#918EFA] prose-a:underline prose-a:font-medium
            prose-ul:my-4 prose-ol:my-4
            prose-table:border-2 prose-table:border-black prose-table:rounded-lg prose-table:overflow-hidden
            prose-thead:bg-[#A8A6FF] prose-th:p-3 prose-th:text-left prose-th:text-sm prose-th:font-bold prose-th:text-black
            prose-td:p-3 prose-td:text-sm prose-td:border-t prose-td:border-black/10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <BlogCTA />

        {/* Related posts */}
        <RelatedPosts posts={relatedPosts} />
      </article>
    </div>
  );
}
