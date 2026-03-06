"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getStrategies, updateProjectColor, getTotalStrategyCount } from "@/actions/strategy";
import { canCreateStrategy } from "@/lib/access";
import {
  Loader2,
  ArrowRight,
  Rocket,
  Plus,
  Calendar,
  FileText,
  Archive,
} from "lucide-react";
import Link from "next/link";
import type { Strategy, Business } from "@prisma/client";
import {
  AnimatedSection,
  StaggeredContainer,
  StaggeredItem,
} from "@/components/ui/animated-section";
import { toast } from "sonner";

type StrategyWithBusiness = Strategy & { business: Business };

const PROJECT_COLORS = [
  "#C9A7EB", // Lavender
  "#89CFF0", // Sky Blue
  "#F5C542", // Golden
  "#34D399", // Green
  "#E8614D", // Coral
  "#F97316", // Orange
  "#EC4899", // Pink
  "#6366F1", // Indigo
];

function getStatusBadge(strategy: StrategyWithBusiness) {
  if (strategy.projectStatus === "paused") {
    return (
      <Badge className="bg-[#F97316] text-white border-black text-xs">
        Paused
      </Badge>
    );
  }
  if (strategy.projectStatus === "archived") {
    return (
      <Badge className="bg-[#A8A6FF] text-white border-black text-xs">
        Archived
      </Badge>
    );
  }
  if (strategy.status === "ready") {
    return (
      <Badge className="bg-[#34D399] text-white border-black text-xs">
        Active
      </Badge>
    );
  }
  if (strategy.status === "generating") {
    return (
      <Badge className="bg-[#FFF066] text-black border-black text-xs">
        Generating
      </Badge>
    );
  }
  return <Badge className="text-xs">{strategy.status}</Badge>;
}

function ProjectCard({
  strategy,
  onColorChange,
}: {
  strategy: StrategyWithBusiness;
  onColorChange: (id: string, color: string) => void;
}) {
  const calendarDays = Array.isArray(strategy.calendar)
    ? (strategy.calendar as unknown[]).length
    : 0;
  const briefCount = calendarDays || 30;
  const isPaused = strategy.projectStatus === "paused";
  const projectColor = strategy.projectColor || "#C9A7EB";

  return (
    <StaggeredItem>
      <Card
        className={`h-full min-h-[240px] hover:shadow-[6px_6px_0px_#000000] transition-all ${
          isPaused ? "opacity-70" : ""
        }`}
      >
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {/* Color picker dot — click to change */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="w-4 h-10 rounded-md border-2 border-black shadow-[2px_2px_0px_#000000] flex-shrink-0 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: projectColor }}
                    onClick={(e) => e.stopPropagation()}
                    title="Change project color"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">
                    Project Color
                  </p>
                  <div className="flex gap-2 flex-wrap max-w-[200px]">
                    {PROJECT_COLORS.map((c) => (
                      <button
                        key={c}
                        className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                          projectColor === c
                            ? "border-black shadow-[2px_2px_0px_#000000]"
                            : "border-black/30"
                        }`}
                        style={{ backgroundColor: c }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onColorChange(strategy.id, c);
                        }}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <div>
                <h3 className="font-bold text-base leading-tight">
                  {strategy.business.businessName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {strategy.business.industry}
                </p>
              </div>
            </div>
            {getStatusBadge(strategy)}
          </div>

          {/* Platforms */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {strategy.business.platforms.map((p) => (
              <Badge
                key={p}
                variant="outline"
                className="text-[10px] px-2 py-0"
              >
                {p}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {calendarDays} days
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {briefCount} briefs
            </span>
          </div>

          <Link
            href={`/dashboard/project/${strategy.id}`}
            className="block mt-3 pt-3 border-t border-black/10"
          >
            <div className="flex items-center justify-between group">
              <p className="text-xs text-muted-foreground">
                Created{" "}
                {new Date(strategy.createdAt).toLocaleDateString()}
              </p>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-black transition-colors" />
            </div>
          </Link>
        </CardContent>
      </Card>
    </StaggeredItem>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [strategies, setStrategies] = useState<StrategyWithBusiness[]>([]);
  const [totalStrategyCount, setTotalStrategyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const plan = (session?.user as { plan?: string })?.plan || "free";

  useEffect(() => {
    if (session && !session.user.onboardingComplete) {
      router.push("/onboarding");
      return;
    }

    async function load() {
      const [data, count] = await Promise.all([getStrategies(), getTotalStrategyCount()]);
      setStrategies(data as StrategyWithBusiness[]);
      setTotalStrategyCount(count);
      setLoading(false);
    }
    load();
  }, [session, router]);

  const handleColorChange = async (id: string, color: string) => {
    // Optimistic update
    setStrategies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, projectColor: color } : s))
    );
    const result = await updateProjectColor(id, color);
    if (result.error) {
      toast.error(result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Separate active/paused from archived
  const activeStrategies = strategies.filter(
    (s) => s.projectStatus !== "archived"
  );
  const archivedStrategies = strategies.filter(
    (s) => s.projectStatus === "archived"
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold">Your Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your content strategies in one place
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Projects Grid */}
      {strategies.length === 0 ? (
        <AnimatedSection
          delay={0.2}
          className="max-w-md mx-auto text-center mt-12"
        >
          <div className="w-16 h-16 bg-[#A8A6FF] border-2 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#000000] mx-auto mb-6">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            No Projects Yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Create your first AI-powered content strategy to get started.
          </p>
          <Link href="/onboarding">
            <Button size="lg">
              Create Your First Project
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </AnimatedSection>
      ) : (
        <>
          <StaggeredContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeStrategies.map((strategy) => (
              <ProjectCard
                key={strategy.id}
                strategy={strategy}
                onColorChange={handleColorChange}
              />
            ))}

            {/* New Project Card */}
            {canCreateStrategy(plan, totalStrategyCount) ? (
              <StaggeredItem>
                <Link href="/onboarding" className="block group">
                  <Card className="h-full border-dashed hover:border-solid hover:shadow-[4px_4px_0px_#000000] transition-all flex items-center justify-center min-h-[240px]">
                    <CardContent className="text-center py-8">
                      <div className="w-12 h-12 bg-[#A8A6FF] border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#000000] mx-auto mb-3 group-hover:scale-105 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold">New Project</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Create another strategy
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </StaggeredItem>
            ) : (
              <StaggeredItem>
                <Link href="/pricing" className="block group">
                  <Card className="h-full border-dashed border-[#918EFA] hover:border-solid hover:shadow-[4px_4px_0px_#000000] transition-all flex items-center justify-center min-h-[240px]">
                    <CardContent className="text-center py-8">
                      <div className="w-12 h-12 bg-[#918EFA] border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#000000] mx-auto mb-3 group-hover:scale-105 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold">Upgrade to Create More</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {plan === "free" ? "Free plan: 1 strategy" : "Starter plan: 5 strategies"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </StaggeredItem>
            )}
          </StaggeredContainer>

          {/* Archived Projects Section */}
          {archivedStrategies.length > 0 && (
            <div className="space-y-4">
              <AnimatedSection>
                <div className="flex items-center gap-2">
                  <Archive className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-display text-2xl font-bold">Archived</h2>
                  <span className="text-sm text-muted-foreground">
                    ({archivedStrategies.length})
                  </span>
                </div>
              </AnimatedSection>
              <StaggeredContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {archivedStrategies.map((strategy) => (
                  <ProjectCard
                    key={strategy.id}
                    strategy={strategy}
                    onColorChange={handleColorChange}
                  />
                ))}
              </StaggeredContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
