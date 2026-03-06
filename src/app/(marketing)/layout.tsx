"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#FFF8F0] border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-3xl tracking-tight text-black">
            ORBYT
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-sm font-medium text-black hover:text-black/70 transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-black hover:text-black/70 transition-colors">
              Pricing
            </Link>
            <Link href="/#preview" className="text-sm font-medium text-black hover:text-black/70 transition-colors">
              See Example
            </Link>
            <Link
              href={session ? "/dashboard" : "/auth"}
              className="bg-[#918EFA] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-6 py-2 text-sm font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              {session ? "Dashboard" : "Build My Strategy"}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center border-2 border-black rounded-lg shadow-[2px_2px_0px_#000000]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#FFF8F0] border-t-2 border-black px-4 pb-4 space-y-3">
            <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-black">
              How It Works
            </Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-black">
              Pricing
            </Link>
            <Link href="/#preview" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-black">
              See Example
            </Link>
            <Link
              href={session ? "/dashboard" : "/auth"}
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-[#918EFA] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-6 py-3 text-sm font-bold"
            >
              {session ? "Dashboard" : "Build My Strategy"}
            </Link>
          </div>
        )}
      </nav>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#FFF8F0] border-t-2 border-black py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <Link href="/" className="font-display text-3xl tracking-tight text-black">
                ORBYT
              </Link>
              <p className="text-sm text-[#666] mt-2">
                AI-powered social media content strategy platform.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-sm mb-3 text-black">Product</h4>
              <div className="space-y-2">
                <Link href="/#how-it-works" className="block text-sm text-[#666] hover:text-black transition-colors">How It Works</Link>
                <Link href="/pricing" className="block text-sm text-[#666] hover:text-black transition-colors">Pricing</Link>
                <Link href="/pricing#faq" className="block text-sm text-[#666] hover:text-black transition-colors">FAQ</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-sm mb-3 text-black">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-sm text-[#666] hover:text-black transition-colors">Privacy</Link>
                <Link href="/terms" className="block text-sm text-[#666] hover:text-black transition-colors">Terms</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm mb-3 text-black">Contact</h4>
              <div className="space-y-2">
                <a href="mailto:hello@e2partners.co" className="block text-sm text-[#666] hover:text-black transition-colors">hello@e2partners.co</a>
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 pt-6 text-center">
            <p className="text-sm text-[#999]">
              &copy; {new Date().getFullYear()} Orbyt. A product by E2 Partners LLC
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
