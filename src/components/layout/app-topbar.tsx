"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Rocket, User, LogOut, CreditCard, Sparkles } from "lucide-react";

export function AppTopbar() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-foreground">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#89CFF0] border-2 border-foreground rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#272727]">
            <Rocket className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display text-xl font-bold">LaunchMap</span>
        </Link>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 rounded-full border-2 border-foreground px-3 gap-2 shadow-[2px_2px_0px_#272727] hover:shadow-[1px_1px_0px_#272727] hover:translate-x-[1px] hover:translate-y-[1px] transition-all bg-[#C9A7EB]/20"
              >
                <div className="w-6 h-6 rounded-full bg-[#C9A7EB] flex items-center justify-center border border-foreground">
                  <span className="text-[10px] font-bold text-white">{initials}</span>
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {session?.user?.name || "Account"}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-3 py-2">
                <p className="text-sm font-bold">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pricing" className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-[#E8614D]"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
