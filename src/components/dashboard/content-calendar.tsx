"use client";

import { CalendarDayCell } from "./calendar-day-cell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { canViewCalendarDay, getCalendarDayLimit } from "@/lib/access";
import type { CalendarDay } from "@/types";
import type { ContentBrief } from "@prisma/client";
import Link from "next/link";

interface ContentCalendarProps {
  calendar: CalendarDay[];
  briefs: ContentBrief[];
  plan: string;
  onDayClick: (day: number, briefId?: string) => void;
  onPostStatusChange?: (briefId: string, status: "pending" | "completed" | "skipped") => void;
}

export function ContentCalendar({
  calendar,
  briefs,
  plan,
  onDayClick,
  onPostStatusChange,
}: ContentCalendarProps) {
  const planLimit = getCalendarDayLimit(plan);
  const totalDays = calendar.length;
  const lockedDays = Math.max(0, totalDays - planLimit);

  // Group days by week for theme headers
  const weeks: Array<{ weekNum: number; theme?: string; days: CalendarDay[] }> = [];
  calendar.forEach((day) => {
    const weekNum = Math.ceil(day.day / 7);
    let week = weeks.find((w) => w.weekNum === weekNum);
    if (!week) {
      week = { weekNum, theme: day.weekTheme, days: [] };
      weeks.push(week);
    }
    week.days.push(day);
  });

  const hasWeekThemes = calendar.some((d) => d.weekTheme);

  const renderDay = (day: CalendarDay) => {
    const isLocked = !canViewCalendarDay(plan, day.day);
    const brief = briefs.find((b) => Number(b.dayNumber) === Number(day.day));
    return (
      <CalendarDayCell
        key={day.day}
        day={day}
        isLocked={isLocked}
        hasBrief={!!brief}
        postStatus={(brief?.postStatus as "pending" | "completed" | "skipped") || "pending"}
        onClick={() => onDayClick(day.day, brief?.id)}
        onStatusChange={
          brief && onPostStatusChange
            ? (status) => onPostStatusChange(brief.id, status)
            : undefined
        }
      />
    );
  };

  return (
    <div className="space-y-6">
      {hasWeekThemes ? (
        weeks.map((week) => (
          <div key={week.weekNum}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#C9A7EB]" />
              <span className="text-sm font-bold">Week {week.weekNum}</span>
              {week.theme && (
                <span className="text-xs text-muted-foreground bg-[#918EFA]/10 px-2 py-0.5 rounded-full border border-[#C9A7EB]/30">
                  {week.theme}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {week.days.map(renderDay)}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {calendar.map(renderDay)}
        </div>
      )}

      {lockedDays > 0 && (
        <Card className="mt-6 border-[#C9A7EB] bg-[#918EFA]/10">
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#918EFA] border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold">
                  {lockedDays} more days locked
                </p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to unlock your full strategy
                </p>
              </div>
            </div>
            <Link href="/pricing">
              <Button className="bg-[#918EFA] text-white border-2 border-black hover:bg-[#918EFA]/90 shadow-[2px_2px_0px_#000000]">
                Unlock Full Calendar
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
