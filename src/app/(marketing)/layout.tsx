"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSeeExample(e: React.MouseEvent) {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  }

  function handleHowItWorks(e: React.MouseEvent) {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav aria-label="Main navigation" className="sticky top-0 z-50 bg-[#FFF8F0] border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-3xl tracking-tight text-black">
            ORBYT
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" onClick={handleHowItWorks} className="text-sm font-medium text-black hover:text-black/70 transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-black hover:text-black/70 transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium text-black hover:text-black/70 transition-colors">
              Blog
            </Link>
            <Link href="/#preview" onClick={handleSeeExample} className="text-sm font-medium text-black hover:text-black/70 transition-colors">
              See Example
            </Link>
            <Link
              href="/auth"
              className="bg-[#918EFA] text-black border-2 border-black shadow-[4px_4px_0px_#000] rounded-lg px-6 py-2 text-sm font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              Build My Strategy
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#FFF8F0] border-t-2 border-black px-4 pb-4 space-y-3">
            <Link href="/#how-it-works" onClick={handleHowItWorks} className="block py-2 text-sm font-medium text-black">
              How It Works
            </Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-black">
              Pricing
            </Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-black">
              Blog
            </Link>
            <Link href="/#preview" onClick={handleSeeExample} className="block py-2 text-sm font-medium text-black">
              See Example
            </Link>
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-[#918EFA] text-black border-2 border-black shadow-[4px_4px_0px_#000] rounded-lg px-6 py-3 text-sm font-bold"
            >
              Build My Strategy
            </Link>
          </div>
        )}
      </nav>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#FFF8F0] border-t-2 border-black py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-display text-2xl tracking-tight text-black">
                ORBYT
              </Link>
              <div className="flex items-center gap-4 text-sm text-[#666]">
                <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
                <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
                <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
                <a href="mailto:hello@e2partners.co" className="hover:text-black transition-colors">Contact</a>
              </div>
            </div>
            <p className="text-sm text-[#999]">
              &copy; {new Date().getFullYear()} Orbyt. A product by E2 Partners LLC
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
