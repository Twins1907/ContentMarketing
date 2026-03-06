import { PLAN_TIERS } from "@/lib/constants";

export function isPaidPlan(plan: string): boolean {
  return plan === "starter" || plan === "pro";
}

export function getCalendarDayLimit(plan: string): number {
  if (plan === "pro") return PLAN_TIERS.pro.calendarDays;
  if (plan === "starter") return PLAN_TIERS.starter.calendarDays;
  return PLAN_TIERS.free.calendarDays; // 7
}

export function getBriefLimit(plan: string): number {
  if (plan === "pro") return PLAN_TIERS.pro.briefLimit;
  if (plan === "starter") return PLAN_TIERS.starter.briefLimit;
  return PLAN_TIERS.free.briefLimit; // 3
}

export function canViewCalendarDay(plan: string, dayNumber: number): boolean {
  return dayNumber <= getCalendarDayLimit(plan);
}

export function canViewBrief(plan: string, briefIndex: number): boolean {
  return briefIndex < getBriefLimit(plan);
}

export function canCreateStrategy(plan: string, existingCount: number): boolean {
  if (plan === "pro") return true; // unlimited
  if (plan === "starter") return existingCount < PLAN_TIERS.starter.strategies;
  return existingCount < PLAN_TIERS.free.strategies; // max 1
}
