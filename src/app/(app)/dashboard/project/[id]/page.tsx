"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStrategy, updateProjectStatus, deleteStrategy, updatePostStatus } from "@/actions/strategy";
import { ContentCalendar } from "@/components/dashboard/content-calendar";
import {
  AudienceTab,
  PillarsTab,
  PlatformsTab,
} from "@/components/dashboard/strategy-tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  Layers,
  MonitorSmartphone,
  FileText,
  MoreHorizontal,
  Pause,
  Play,
  Archive,
  Trash2,
  Megaphone,
  Target,
  BarChart3,
  TrendingUp,
  CalendarDays,
  LineChart,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import Link from "next/link";
import {
  StaggeredContainer,
  StaggeredItem,
} from "@/components/ui/animated-section";
import type { Strategy, Business, ContentBrief } from "@prisma/client";
import type {
  CalendarDay,
  AudiencePersona,
  PlatformStrategy,
  ContentPillar,
  StrategyOverview,
  StrategyDirection,
} from "@/types";

type StrategyWithBriefs = Strategy & {
  business: Business;
  briefs: ContentBrief[];
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const [strategy, setStrategy] = useState<StrategyWithBriefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const data = await getStrategy(id);
      if (!data) {
        router.push("/dashboard");
        return;
      }
      setStrategy(data as StrategyWithBriefs);
      setLoading(false);
    }
    load();
  }, [id, router]);

  // Navigate directly to full brief page instead of side panel
  const handleDayClick = (dayNumber: number, briefId?: string) => {
    if (!strategy) return;
    // Use Number() to handle type mismatches from JSON parsing (string vs number)
    const brief = strategy.briefs.find(
      (b) => Number(b.dayNumber) === Number(dayNumber) || (briefId && b.id === briefId)
    );
    if (brief) {
      router.push(`/dashboard/brief/${brief.id}`);
    } else {
      toast.error("Brief not available for this day. It may have failed to generate.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleStatusChange = async (newStatus: "active" | "paused" | "archived") => {
    if (!strategy) return;
    const result = await updateProjectStatus(strategy.id, newStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      setStrategy({ ...strategy, projectStatus: newStatus });
      toast.success(`Project ${newStatus === "active" ? "activated" : newStatus}`);
    }
  };

  const handlePostStatusChange = async (
    briefId: string,
    postStatus: "pending" | "completed" | "skipped"
  ) => {
    if (!strategy) return;
    const result = await updatePostStatus(briefId, postStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      setStrategy({
        ...strategy,
        briefs: strategy.briefs.map((b) =>
          b.id === briefId ? { ...b, postStatus } : b
        ),
      });
      const label = postStatus === "completed" ? "Posted" : postStatus === "skipped" ? "Skipped" : "Pending";
      toast.success(`Marked as ${label}`);
    }
  };

  const handleDelete = async () => {
    if (!strategy) return;
    const result = await deleteStrategy(strategy.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Project deleted");
      router.push("/dashboard");
    }
  };

  if (!strategy) return null;

  const rawCalendar = (strategy.calendar as unknown as CalendarDay[]) || [];
  const startDate = strategy.startDate ? new Date(strategy.startDate) : new Date(strategy.createdAt);
  const calendarData = rawCalendar.map((day) => {
    const date = addDays(startDate, day.day - 1);
    return {
      ...day,
      actualDate: format(date, "yyyy-MM-dd"),
      weekday: format(date, "EEE"),
    };
  });
  const overview = strategy.overview as unknown as StrategyOverview | null;
  const persona = strategy.audiencePersona as unknown as AudiencePersona | null;
  const platformStrategies = (strategy.platformStrategy as unknown as PlatformStrategy[]) || [];
  const pillars = (strategy.contentPillars as unknown as ContentPillar[]) || [];
  const plan = session?.user?.plan || "free";

  const completedBriefs = strategy.briefs.filter((b) => b.postStatus === "completed").length;
  const totalBriefs = strategy.briefs.length;

  return (
    <div className="space-y-6">
      {/* Back navigation + Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-black transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-11 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] flex-shrink-0"
              style={{ backgroundColor: strategy.projectColor || "#C9A7EB" }}
            />
            <div>
              <h1 className="font-display text-3xl font-bold">
                {strategy.business.businessName}
              </h1>
              <p className="text-muted-foreground text-sm">
                {strategy.business.industry}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {strategy.projectStatus === "paused" ? (
              <Badge className="bg-[#F97316] text-white border-black h-8 px-3 text-xs flex items-center">Paused</Badge>
            ) : strategy.projectStatus === "archived" ? (
              <Badge className="bg-[#A8A6FF] text-white border-black h-8 px-3 text-xs flex items-center">Archived</Badge>
            ) : strategy.status === "generating" ? (
              <Badge className="bg-[#FFF066] text-black border-black h-8 px-3 text-xs flex items-center">Generating</Badge>
            ) : (
              <Badge className="bg-[#34D399] text-white border-black h-8 px-3 text-xs flex items-center">Active</Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {strategy.projectStatus === "paused" ? (
                  <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                    <Play className="w-4 h-4 mr-2" />
                    Resume Project
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleStatusChange("paused")}>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Project
                  </DropdownMenuItem>
                )}
                {strategy.projectStatus === "archived" ? (
                  <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                    <Play className="w-4 h-4 mr-2" />
                    Unarchive Project
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleStatusChange("archived")}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive Project
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the project and all associated content briefs.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Overview Cards */}
      {overview && (
        <div className="space-y-4">
          {/* Strategy Direction — full width */}
          <StaggeredContainer>
            <StaggeredItem>
              <Card className="border-2 border-black shadow-[3px_3px_0px_#000000] overflow-hidden">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-[#A8A6FF] rounded-lg flex items-center justify-center border-2 border-black">
                      <Target className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Strategy Direction
                    </p>
                  </div>

                  {/* Primary approach */}
                  <p className="text-sm leading-relaxed">
                    {(overview as StrategyOverview & { strategyDirection?: StrategyDirection }).strategyDirection?.primaryApproach ||
                      `Focused on ${strategy.business.goals.map((g: string) => g.toLowerCase()).join(", ")} across ${strategy.business.platforms.join(", ")}.`}
                  </p>

                  {/* Platform posting cadence */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {platformStrategies.map((ps) => (
                      <Badge key={ps.platform} variant="outline" className="text-xs max-w-full truncate" title={`${ps.platform}: ${ps.postingFrequency}`}>
                        {ps.platform}: {ps.postingFrequency?.split("—")[0]?.split("–")[0]?.trim() || ps.postingFrequency}
                      </Badge>
                    ))}
                  </div>

                  {/* Expanded sections in 2-col grid */}
                  {(overview as StrategyOverview & { strategyDirection?: StrategyDirection }).strategyDirection && (
                    <div className="mt-4 pt-4 border-t border-black/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Growth Playbook */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-[#34D399]" />
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Growth Playbook</p>
                        </div>
                        {(overview as StrategyOverview & { strategyDirection?: StrategyDirection }).strategyDirection!.growthPlaybook.map((approach, i) => (
                          <p key={i} className="text-sm text-muted-foreground leading-relaxed mt-1">{approach}</p>
                        ))}
                      </div>

                      {/* Weekly Rhythm */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-[#C9A7EB]" />
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Weekly Rhythm</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {(overview as StrategyOverview & { strategyDirection?: StrategyDirection }).strategyDirection!.weeklyRhythm}
                        </p>
                      </div>

                      {/* Key Metrics */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <LineChart className="w-3.5 h-3.5 text-[#F5C542]" />
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Key Metrics to Track</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {(overview as StrategyOverview & { strategyDirection?: StrategyDirection }).strategyDirection!.keyMetrics}
                        </p>
                      </div>

                      {/* Content Mix */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#89CFF0]" />
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Content Mix</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {(overview as StrategyOverview & { strategyDirection?: StrategyDirection }).strategyDirection!.contentMix}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </StaggeredItem>
          </StaggeredContainer>

          {/* Row 2: Tone & Voice + Platforms + Progress */}
          <StaggeredContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tone & Voice */}
            <StaggeredItem className="col-span-2">
              <Card className="h-full border-2 border-black shadow-[3px_3px_0px_#000000]">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-[#918EFA] rounded-lg flex items-center justify-center border-2 border-black">
                      <Megaphone className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Tone & Voice
                    </p>
                  </div>
                  <p className="text-sm">{overview.toneAndVoice}</p>
                </CardContent>
              </Card>
            </StaggeredItem>

            {/* Platforms */}
            <StaggeredItem>
              <Card className="h-full border-2 border-black shadow-[3px_3px_0px_#000000]">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-[#FFF066] rounded-md flex items-center justify-center border-2 border-black">
                      <MonitorSmartphone className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Platforms
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {strategy.business.platforms.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </StaggeredItem>

            {/* Progress */}
            <StaggeredItem>
              <Card className="h-full border-2 border-black shadow-[3px_3px_0px_#000000]">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-[#34D399] rounded-md flex items-center justify-center border-2 border-black">
                      <BarChart3 className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Progress
                    </p>
                  </div>
                  <p className="text-2xl font-bold">{completedBriefs}/{totalBriefs}</p>
                  <p className="text-xs text-muted-foreground">briefs completed</p>
                </CardContent>
              </Card>
            </StaggeredItem>
          </StaggeredContainer>
        </div>
      )}

      {/* Content Pillars */}
      {pillars.length > 0 && (
        <Card className="border-2 border-black shadow-[3px_3px_0px_#000000]">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#918EFA] rounded-lg flex items-center justify-center border-2 border-black">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                Content Pillar Breakdown
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {pillars.map((p, i) => {
                const pillarColors = ["#C9A7EB", "#89CFF0", "#E8614D", "#F5C542"];
                const color = pillarColors[i % pillarColors.length];
                return (
                  <div key={p.name} className="p-3 rounded-xl border-2 border-black bg-white">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full border border-black flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-bold truncate">{p.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{p.percentage}% of content</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategy + Calendar Tabs */}
      <Tabs defaultValue="strategy" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="strategy" className="flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            Strategy
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Calendar
          </TabsTrigger>
          {platformStrategies.length > 0 && (
            <TabsTrigger value="platforms" className="flex items-center gap-1.5">
              <MonitorSmartphone className="w-4 h-4" />
              Platforms
            </TabsTrigger>
          )}
        </TabsList>

        {/* Strategy Tab — Audience + Pillars together */}
        <TabsContent value="strategy" className="mt-6 space-y-6">
          {persona && <AudienceTab persona={persona} />}

          {pillars.length > 0 && <PillarsTab pillars={pillars} />}
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          {calendarData.length > 0 ? (
            <ContentCalendar
              calendar={calendarData}
              briefs={strategy.briefs}
              plan={plan}
              onDayClick={handleDayClick}
              onPostStatusChange={handlePostStatusChange}
            />
          ) : (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-bold mb-1">No Calendar Data</p>
                <p className="text-sm text-muted-foreground">
                  Calendar data hasn&apos;t been generated yet for this strategy.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {platformStrategies.length > 0 && (
          <TabsContent value="platforms" className="mt-6">
            <PlatformsTab strategies={platformStrategies} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
