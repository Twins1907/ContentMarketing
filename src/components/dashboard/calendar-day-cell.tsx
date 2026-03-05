"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lock, CheckCircle2, Circle, SkipForward } from "lucide-react";
import { PLATFORM_COLORS } from "@/lib/constants";
import type { CalendarDay } from "@/types";
import { format, parseISO } from "date-fns";

interface CalendarDayCellProps {
  day: CalendarDay;
  isLocked: boolean;
  postStatus?: "pending" | "completed" | "skipped";
  onClick: () => void;
  onStatusChange?: (status: "pending" | "completed" | "skipped") => void;
}

function formatDateLabel(day: CalendarDay): { primary: string; secondary: string } {
  if (day.actualDate) {
    try {
      const date = parseISO(day.actualDate);
      return {
        primary: format(date, "MMM d"),
        secondary: day.weekday || format(date, "EEE"),
      };
    } catch {
      // fall through to default
    }
  }
  return { primary: `Day ${day.day}`, secondary: "" };
}

const STATUS_CONFIG = {
  pending: {
    icon: Circle,
    color: "#9CA3AF",
    label: "Pending",
  },
  completed: {
    icon: CheckCircle2,
    color: "#34D399",
    label: "Posted",
  },
  skipped: {
    icon: SkipForward,
    color: "#F97316",
    label: "Skipped",
  },
};

function getFormatEmoji(format: string): string {
  const f = format.toLowerCase();
  if (f.includes("video") || f.includes("reel") || f.includes("short")) return "🎬";
  if (f.includes("carousel") || f.includes("album") || f.includes("idea pin")) return "📑";
  if (f.includes("story")) return "📱";
  if (f.includes("thread")) return "🧵";
  if (f.includes("text")) return "✍️";
  if (f.includes("poll")) return "📊";
  if (f.includes("image") || f.includes("pin") || f.includes("photo")) return "📸";
  return "📄";
}

export function CalendarDayCell({
  day,
  isLocked,
  postStatus = "pending",
  onClick,
  onStatusChange,
}: CalendarDayCellProps) {
  const dateLabel = formatDateLabel(day);
  const statusConfig = STATUS_CONFIG[postStatus];
  const StatusIcon = statusConfig.icon;

  if (isLocked) {
    return (
      <button
        className="p-3 rounded-xl border-2 border-foreground/20 bg-muted/50 text-left h-full min-h-[120px] flex flex-col items-center justify-center gap-2 opacity-60 cursor-not-allowed"
        disabled
      >
        <Lock className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{dateLabel.primary}</span>
      </button>
    );
  }

  return (
    <div
      className={`p-3 rounded-xl border-2 border-foreground bg-background text-left h-full min-h-[120px] flex flex-col gap-2 hover:shadow-[3px_3px_0px_#272727] transition-all ${
        postStatus === "completed" ? "bg-[#34D399]/5" : ""
      }`}
    >
      {/* Header: date + status toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          {dateLabel.secondary && (
            <span className="text-[10px] text-muted-foreground uppercase font-medium">
              {dateLabel.secondary}
            </span>
          )}
          <span className="text-sm font-bold">{dateLabel.primary}</span>
        </button>

        {/* Status dropdown */}
        {onStatusChange ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center justify-center w-5 h-5 rounded-full hover:scale-110 transition-transform"
                onClick={(e) => e.stopPropagation()}
              >
                <StatusIcon
                  className="w-4 h-4"
                  style={{ color: statusConfig.color }}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange("completed");
                }}
                className="text-xs"
              >
                <CheckCircle2
                  className="w-3.5 h-3.5 mr-2"
                  style={{ color: "#34D399" }}
                />
                Posted
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange("pending");
                }}
                className="text-xs"
              >
                <Circle
                  className="w-3.5 h-3.5 mr-2"
                  style={{ color: "#9CA3AF" }}
                />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange("skipped");
                }}
                className="text-xs"
              >
                <SkipForward
                  className="w-3.5 h-3.5 mr-2"
                  style={{ color: "#F97316" }}
                />
                Skipped
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: PLATFORM_COLORS[day.platform] || "#666" }}
          />
        )}
      </div>

      {/* Platform badge + format + hook — clickable to open brief */}
      <button onClick={onClick} className="cursor-pointer text-left flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-1 flex-wrap">
          <Badge
            className="text-[10px] px-1.5 py-0 w-fit text-white border-0"
            style={{ backgroundColor: PLATFORM_COLORS[day.platform] || "#666" }}
          >
            {day.platform}
          </Badge>
          {day.contentFormat && (
            <span className="text-[9px] text-muted-foreground bg-muted px-1 py-0.5 rounded font-medium truncate max-w-[80px]">
              {getFormatEmoji(day.contentFormat)} {day.contentFormat.split("(")[0].trim()}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">
          {day.briefHook}
        </p>
      </button>
    </div>
  );
}
