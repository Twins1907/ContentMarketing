"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PLATFORM_COLORS } from "@/lib/constants";
import { Users, TrendingUp, Eye, Bookmark, Pencil, Check } from "lucide-react";
import type {
  AudiencePersona,
  PlatformStrategy,
  ContentPillar,
} from "@/types";

const pillarColors = ["#C9A7EB", "#89CFF0", "#E8614D", "#F5C542", "#C9A7EB"];

export function AudienceTab({ persona }: { persona: AudiencePersona }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl">
          Target Audience: {persona.name}
        </CardTitle>
        {persona.basedOn && (
          <p className="text-xs text-muted-foreground mt-1 italic">{persona.basedOn}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InfoBlock label="Age Range" value={persona.age} />
          <InfoBlock label="Likely Occupation" value={persona.occupation} />
        </div>

        <div>
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {persona.interests.map((i) => (
              <Badge key={i} variant="outline">
                {i}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Pain Points</Label>
          <ul className="list-disc list-inside text-sm space-y-1 mt-1">
            {persona.painPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <div>
          <Label>Content Preferences</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {persona.contentPreferences.map((c) => (
              <Badge key={c} className="bg-[#89CFF0] text-white border-foreground">
                {c}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Buying Behavior</Label>
          <p className="text-sm text-muted-foreground mt-1">
            {persona.buyingBehavior}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function FollowerInput({
  platform,
  onSave,
}: {
  platform: string;
  onSave: (count: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState<number | null>(null);

  const handleSave = () => {
    const num = parseInt(value.replace(/,/g, ""), 10);
    if (!isNaN(num) && num >= 0) {
      setSaved(num);
      onSave(num);
      setEditing(false);
    }
  };

  if (saved !== null && !editing) {
    return (
      <div className="p-2.5 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30">
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Users className="w-3 h-3" /> Current Followers
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">{saved.toLocaleString()}</p>
          <button
            onClick={() => setEditing(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2.5 rounded-lg bg-muted/50 border border-muted">
      <p className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
        <Users className="w-3 h-3" /> Current {platform} Followers
      </p>
      {editing || saved === null ? (
        <div className="flex gap-1.5">
          <Input
            type="text"
            placeholder="e.g. 1,250"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-7 text-xs"
          />
          <Button
            size="sm"
            className="h-7 px-2 bg-[#34D399] text-white border border-foreground hover:bg-[#34D399]/80"
            onClick={handleSave}
          >
            <Check className="w-3 h-3" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function computeProjectedGrowth(
  currentFollowers: number | null,
  growthRate: string
): string | null {
  if (currentFollowers === null) return null;
  // Parse growth rate like "8-15% / month"
  const match = growthRate.match(/(\d+)-(\d+)%/);
  if (!match) return null;
  const low = parseInt(match[1], 10);
  const high = parseInt(match[2], 10);
  const avgRate = (low + high) / 2 / 100;
  const projected = Math.round(currentFollowers * (1 + avgRate));
  return `~${projected.toLocaleString()} followers after 30 days`;
}

export function PlatformsTab({
  strategies,
}: {
  strategies: PlatformStrategy[];
}) {
  const [followerCounts, setFollowerCounts] = useState<Record<string, number>>({});

  return (
    <div className="grid gap-4">
      {strategies.map((s) => {
        const currentFollowers = followerCounts[s.platform] ?? null;
        const projectedGrowth = s.kpiTargets
          ? computeProjectedGrowth(currentFollowers, s.kpiTargets.followerGrowth)
          : null;

        return (
          <Card key={s.platform} className="h-full">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <PlatformDot platform={s.platform} />
                {s.platform}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoBlock label="Posting Frequency" value={s.postingFrequency} />

              <div>
                <Label>Best Times</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {s.bestTimes.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Content Formats</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {s.contentFormats.map((f) => (
                    <Badge key={f} className="bg-[#C9A7EB] text-foreground border-foreground">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Key Tactics</Label>
                <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                  {s.keyTactics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>

              {s.kpiTargets && (
                <div>
                  <Label>Performance Targets</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {/* Current followers input */}
                    <FollowerInput
                      platform={s.platform}
                      onSave={(count) =>
                        setFollowerCounts((prev) => ({ ...prev, [s.platform]: count }))
                      }
                    />
                    <div className="p-2 rounded-lg bg-[#C9A7EB]/10 border border-[#C9A7EB]/30">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Follower Growth
                      </p>
                      <p className="text-sm font-bold">{s.kpiTargets.followerGrowth}</p>
                      {projectedGrowth && (
                        <p className="text-[10px] text-[#34D399] font-medium mt-0.5">{projectedGrowth}</p>
                      )}
                    </div>
                    <div className="p-2 rounded-lg bg-[#89CFF0]/10 border border-[#89CFF0]/30">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Engagement Rate
                      </p>
                      <p className="text-sm font-bold">{s.kpiTargets.engagementRate}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F5C542]/10 border border-[#F5C542]/30">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Reach Growth
                      </p>
                      <p className="text-sm font-bold">{s.kpiTargets.reachGrowth}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#E8614D]/10 border border-[#E8614D]/30">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Bookmark className="w-3 h-3" /> Saves / Bookmarks
                      </p>
                      <p className="text-sm font-bold">{s.kpiTargets.saves}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function PillarsTab({ pillars }: { pillars: ContentPillar[] }) {
  return (
    <div className="grid gap-4">
      {pillars.map((p, i) => (
        <Card key={p.name} className="h-full">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border-2 border-foreground"
                  style={{ backgroundColor: pillarColors[i % pillarColors.length] }}
                />
                <h3 className="font-bold">{p.name}</h3>
              </div>
              <Badge variant="outline">{p.percentage}%</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {p.description}
            </p>
            <Progress value={p.percentage} className="h-2 mb-3" />
            <div>
              <Label>Example Topics</Label>
              <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                {p.exampleTopics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{children}</p>;
}

function PlatformDot({ platform }: { platform: string }) {
  return (
    <div
      className="w-3 h-3 rounded-full border border-foreground"
      style={{ backgroundColor: PLATFORM_COLORS[platform] || PLATFORM_COLORS[platform.toLowerCase()] || "#666" }}
    />
  );
}
