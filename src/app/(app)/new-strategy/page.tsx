"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { PLAN_TIERS, type PlanTier } from "@/lib/constants";
import Link from "next/link";

export default function NewStrategyPage() {
  const { data: session } = useSession();
  const plan = (session?.user?.plan || "free") as PlanTier;
  const canCreate = plan === "pro";

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-[#E8614D] border-2 border-foreground rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#272727] mx-auto mb-4">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">
          Create New Strategy
        </h1>
        <p className="text-muted-foreground">
          Generate a fresh content strategy for your business.
        </p>
      </div>

      {canCreate ? (
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              As a Pro member, you can generate unlimited strategies.
            </p>
            <Link href="/onboarding">
              <Button size="lg" className="bg-[#E8614D] text-foreground border-2 border-foreground">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate New Strategy
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[#E8614D]">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-muted border-2 border-foreground rounded-xl flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
            <CardTitle className="font-display text-xl">
              Upgrade to Generate More
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {plan === "free"
                ? "Free accounts include 1 strategy. Upgrade to create more."
                : "Starter accounts include 1 strategy. Upgrade to Pro for unlimited."}
            </p>

            <Card className="bg-[#E8614D]/10">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold">Pro Plan</h3>
                    <p className="text-2xl font-bold">
                      ${PLAN_TIERS.pro.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </p>
                  </div>
                  <Badge className="bg-[#E8614D] text-foreground border-foreground">
                    Recommended
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {PLAN_TIERS.pro.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Link href="/pricing" className="block">
              <Button className="w-full" size="lg">
                View Plans
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
