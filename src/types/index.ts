import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan: string;
      onboardingComplete: boolean;
    };
  }
}

export type PlatformId = "tiktok" | "instagram" | "youtube" | "twitter" | "linkedin" | "reddit" | "facebook" | "pinterest" | "threads";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface StrategyDirection {
  primaryApproach: string;
  contentMix: string;
  growthPlaybook: string[];
  weeklyRhythm: string;
  keyMetrics: string;
}

export interface StrategyOverview {
  businessSummary: string;
  valueProposition: string;
  toneAndVoice: string;
  differentiators: string[];
  strategyDirection?: StrategyDirection;
}

export interface AudiencePersona {
  name: string;
  age: string;
  occupation: string;
  interests: string[];
  painPoints: string[];
  platforms: string[];
  contentPreferences: string[];
  buyingBehavior: string;
  basedOn?: string;
}

export interface PlatformStrategy {
  platform: string;
  postingFrequency: string;
  bestTimes: string[];
  contentFormats: string[];
  keyTactics: string[];
  kpiTargets?: {
    followerGrowth: string;
    engagementRate: string;
    reachGrowth: string;
    saves: string;
  };
}

export interface ContentPillar {
  name: string;
  description: string;
  percentage: number;
  exampleTopics: string[];
}

export interface CalendarDay {
  day: number;
  platform: string;
  pillar: string;
  briefHook: string;
  contentFormat?: string;
  briefId?: string;
  actualDate?: string;
  weekday?: string;
  weekTheme?: string;
}

export interface BrandGuidelines {
  colorRecommendations: string[];
  toneDos: string[];
  toneDonts: string[];
  visualStyle: string;
  hashtagStrategy: string;
}

export interface ContentBriefData {
  id: string;
  dayNumber: number;
  platform: string;
  pillar: string;
  goal: string;
  hook: string;
  script: string;
  visualDirection: string;
  caption: string;
  hashtags: string[];
  cta: string;
  postingTime: string;
  strategicReasoning: string;
}
