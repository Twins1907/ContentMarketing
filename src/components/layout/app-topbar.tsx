"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, CreditCard, ChevronDown } from "lucide-react";

export function AppTopbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-[#FFF8F0] border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-display text-2xl text-black">
          ORBYT
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/new-strategy"
            className="hidden sm:inline-flex items-center justify-center bg-[#FFE500] text-black border-2 border-black shadow-[3px_3px_0px_#000000] rounded-lg px-4 py-1.5 text-sm font-bold hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] transition-all"
          >
            + New Strategy
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] rounded-lg px-3 py-1.5 text-sm font-bold hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] transition-all">
                <div className="w-6 h-6 bg-[#A8A6FF] rounded-md flex items-center justify-center border border-black">
                  <span className="text-xs font-bold text-black">
                    {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden sm:inline text-black">
                  {session?.user?.name || session?.user?.email?.split("@")[0] || "Account"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-black" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg bg-white">
              <DropdownMenuItem asChild>
                <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pricing" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Upgrade Plan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-black/10" />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 cursor-pointer text-[#F76363]"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
