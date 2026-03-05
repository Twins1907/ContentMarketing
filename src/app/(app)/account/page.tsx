"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  CreditCard,
  Building2,
  History,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { getBusinesses } from "@/actions/business";
import { getStrategies } from "@/actions/strategy";
import { PLAN_TIERS, type PlanTier } from "@/lib/constants";
import Link from "next/link";
import type { Business, Strategy } from "@prisma/client";

export default function AccountPage() {
  const { data: session } = useSession();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [strategies, setStrategies] = useState<(Strategy & { business: Business })[]>([]);

  useEffect(() => {
    async function load() {
      const [biz, strats] = await Promise.all([getBusinesses(), getStrategies()]);
      setBusinesses(biz);
      setStrategies(strats as typeof strategies);
    }
    load();
  }, []);

  const plan = (session?.user?.plan || "free") as PlanTier;
  const tier = PLAN_TIERS[plan] || PLAN_TIERS.free;

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display text-3xl font-bold">Account</h1>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-foreground">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="text-lg bg-[#89CFF0]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg">{session?.user?.name || "User"}</p>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="w-5 h-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl">{tier.name}</h3>
                <Badge
                  className={
                    plan === "pro"
                      ? "bg-[#E8614D] text-foreground border-foreground"
                      : plan === "starter"
                      ? "bg-[#89CFF0] text-foreground border-foreground"
                      : ""
                  }
                >
                  {plan === "free" ? "Free" : "Active"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {tier.calendarDays} calendar days &bull; {tier.briefLimit} briefs
                &bull;{" "}
                {tier.strategies === -1
                  ? "Unlimited strategies"
                  : `${tier.strategies} strategy`}
              </p>
            </div>
            {plan === "free" && (
              <Link href="/pricing">
                <Button size="sm">
                  Upgrade
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Businesses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5" />
            Businesses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {businesses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No businesses yet.</p>
          ) : (
            <div className="space-y-3">
              {businesses.map((biz) => (
                <div
                  key={biz.id}
                  className="p-3 rounded-xl border-2 border-foreground bg-background"
                >
                  <p className="font-bold">{biz.businessName}</p>
                  <p className="text-xs text-muted-foreground">{biz.industry}</p>
                  <div className="flex gap-1.5 mt-2">
                    {biz.platforms.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategy History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="w-5 h-5" />
            Strategy History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {strategies.length === 0 ? (
            <p className="text-sm text-muted-foreground">No strategies yet.</p>
          ) : (
            <div className="space-y-3">
              {strategies.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/project/${s.id}`}
                  className="block p-3 rounded-xl border-2 border-foreground bg-background hover:shadow-[3px_3px_0px_#272727] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{s.business.businessName}</p>
                      <p className="text-xs text-muted-foreground">
                        Created{" "}
                        {new Date(s.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      className={
                        s.status === "ready"
                          ? "bg-[#C9A7EB] text-foreground border-foreground"
                          : ""
                      }
                    >
                      {s.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Separator />
      <Button
        variant="outline"
        className="text-red-600"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
