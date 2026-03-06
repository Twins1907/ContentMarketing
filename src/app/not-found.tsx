import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="font-display text-[120px] md:text-[180px] text-black leading-none mb-2">
          404
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-black mb-4">
          PAGE NOT FOUND
        </h1>

        <p className="text-[#333] mb-8 text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-8 py-4 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            Back to Home
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center bg-white text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-8 py-4 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            View Pricing
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <Link
            href="/blog"
            className="text-sm text-[#666] hover:text-black transition-colors underline"
          >
            Blog
          </Link>
          <span className="text-[#ccc]">·</span>
          <Link
            href="/auth"
            className="text-sm text-[#666] hover:text-black transition-colors underline"
          >
            Sign Up
          </Link>
          <span className="text-[#ccc]">·</span>
          <Link
            href="/terms"
            className="text-sm text-[#666] hover:text-black transition-colors underline"
          >
            Terms
          </Link>
          <span className="text-[#ccc]">·</span>
          <Link
            href="/privacy"
            className="text-sm text-[#666] hover:text-black transition-colors underline"
          >
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
