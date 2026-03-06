import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BlogCTA() {
  return (
    <aside className="bg-[#A8A6FF] border-2 border-black shadow-[4px_4px_0px_#000000] rounded-xl p-8 md:p-10 my-12">
      <h3 className="font-display text-2xl md:text-3xl text-black mb-3">
        STOP PLANNING. START POSTING.
      </h3>
      <p className="text-[#333] text-sm md:text-base mb-6 max-w-xl">
        Orbyt generates a complete content strategy — audience persona, 30-day
        calendar, and production-ready briefs for every post. Free to start.
      </p>
      <Link
        href="/auth"
        className="inline-flex items-center justify-center bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-8 py-3 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-sm"
      >
        Build My Free Strategy
        <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    </aside>
  );
}

export function RelatedPosts({
  posts,
}: {
  posts: { slug: string; title: string; category: string }[];
}) {
  if (posts.length === 0) return null;

  return (
    <nav className="my-12" aria-label="Related articles">
      <h3 className="font-display text-xl text-black mb-4">KEEP READING</h3>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex items-center justify-between bg-white border-2 border-black shadow-[2px_2px_0px_#000000] rounded-xl p-4 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000000] transition-all group"
          >
            <div>
              <span className="text-xs font-bold text-[#918EFA] uppercase tracking-wide">
                {post.category}
              </span>
              <h4 className="text-sm font-bold text-black mt-1 group-hover:text-[#918EFA] transition-colors">
                {post.title}
              </h4>
            </div>
            <ArrowRight className="w-4 h-4 text-[#999] group-hover:text-black transition-colors shrink-0 ml-4" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
