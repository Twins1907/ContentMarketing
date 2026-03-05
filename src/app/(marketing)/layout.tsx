"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Rocket, Mail } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#FFF8F0] border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#89CFF0] border-2 border-foreground rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#272727]">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-2xl font-bold">LaunchMap</span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link href="/pricing">
              <Button variant="ghost" size="sm">
                Pricing
              </Button>
            </Link>
            {session ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button size="sm">Get Started</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-foreground/15 bg-[#FFF8F0]">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left — brand + copyright */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-[#89CFF0] border border-foreground rounded-md flex items-center justify-center">
                  <Rocket className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="font-display text-sm font-bold">LaunchMap</span>
              </Link>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                &copy; {new Date().getFullYear()} LaunchMap
              </span>
            </div>

            {/* Center — links */}
            <nav className="flex items-center gap-4 text-[11px]">
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/pricing#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <a href="mailto:hello@e2partners.co" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Contact
              </a>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </nav>

            {/* Right — E2 Partners */}
            <p className="text-[11px] text-muted-foreground">
              A product by <span className="font-semibold text-foreground">E2 Partners LLC</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
