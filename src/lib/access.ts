// Access control — currently unlocked for testing
// All users get full access to test the complete user journey

export function canViewCalendarDay(_plan: string, _dayNumber: number): boolean {
  return true;
}

export function canViewBrief(_plan: string, _briefIndex: number): boolean {
  return true;
}

export function getCalendarDayLimit(_plan: string): number {
  return 999;
}

export function getBriefLimit(_plan: string): number {
  return 999;
}

export function canCreateStrategy(_plan: string, _existingCount: number): boolean {
  return true;
}

export function isPaidPlan(plan: string): boolean {
  return plan === "starter" || plan === "pro";
}
