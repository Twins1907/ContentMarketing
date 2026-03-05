export const SITE_NAME = "LaunchMap";
export const SITE_DESCRIPTION =
  "AI-powered social media strategy platform. Get a complete content strategy with per-post briefs in minutes.";

export const INDUSTRIES = [
  "Business & Entrepreneurship",
  "Marketing & Advertising",
  "Technology & SaaS",
  "Health & Fitness",
  "Personal Development",
  "Education & E-Learning",
  "Finance & Investing",
  "Real Estate",
  "Fashion & Beauty",
  "Food & Cooking",
  "Travel & Lifestyle",
  "Entertainment & Media",
  "Creative & Design",
  "Coaching & Consulting",
  "E-Commerce & Retail",
  "Other",
] as const;

export const PLATFORMS = [
  { id: "tiktok", name: "TikTok", color: "#000000" },
  { id: "instagram", name: "Instagram", color: "#E4405F" },
  { id: "youtube", name: "YouTube", color: "#FF0000" },
  { id: "twitter", name: "X / Twitter", color: "#1DA1F2" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2" },
  { id: "reddit", name: "Reddit", color: "#FF4500" },
  { id: "facebook", name: "Facebook", color: "#1877F2" },
  { id: "pinterest", name: "Pinterest", color: "#E60023" },
  { id: "threads", name: "Threads", color: "#000000" },
] as const;

export const PLATFORM_COLORS: Record<string, string> = {
  tiktok: "#000000",
  instagram: "#E4405F",
  youtube: "#FF0000",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
  reddit: "#FF4500",
  facebook: "#1877F2",
  pinterest: "#E60023",
  threads: "#000000",
};

export const BUSINESS_GOALS = [
  "Brand Awareness",
  "Lead Generation",
  "Sales & Conversions",
  "Community Building",
  "Thought Leadership",
  "Customer Retention",
  "Website Traffic",
  "Product Launches",
] as const;

export const STRATEGY_DURATIONS = [
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days" },
] as const;

export const CONTENT_TONES = [
  "Professional",
  "Casual",
  "Fun",
  "Educational",
  "Motivational",
  "Storytelling",
  "Bold & Provocative",
  "Witty & Humorous",
  "Empathetic & Supportive",
  "Authoritative",
  "Conversational",
  "Luxurious & Premium",
] as const;

export const AVAILABLE_ASSETS = [
  "Professional Photos",
  "Smartphone Photos",
  "Studio Video",
  "Smartphone Video",
  "Graphic Design / Canva",
  "Illustrations",
  "User-Generated Content",
  "Text-only / No Visuals",
] as const;

export const BUDGET_OPTIONS = [
  "Under $500/mo",
  "$500-$2K/mo",
  "$2K-$5K/mo",
  "$5K+/mo",
  "Not sure yet",
] as const;

export const PLAN_TIERS = {
  free: {
    name: "Free",
    price: 0,
    calendarDays: 7,
    briefLimit: 3,
    strategies: 1,
    features: [
      "1 AI-generated strategy",
      "Calendar preview",
      "Content briefs",
      "Strategy overview & pillars",
    ],
  },
  starter: {
    name: "Starter",
    price: 39,
    priceLabel: "$39 one-time",
    calendarDays: 30,
    briefLimit: 30,
    strategies: 1,
    features: [
      "Full content calendar",
      "All content briefs",
      "Audience persona report",
      "Platform strategy guide",
      "PDF export",
    ],
  },
  pro: {
    name: "Pro",
    price: 19,
    priceLabel: "$19/month",
    calendarDays: 30,
    briefLimit: 30,
    strategies: -1, // unlimited
    features: [
      "Everything in Starter",
      "Unlimited strategy regeneration",
      "Multiple businesses",
      "Priority AI generation",
      "Advanced analytics",
    ],
  },
} as const;

export type PlanTier = keyof typeof PLAN_TIERS;

export const GENERATION_STEPS = [
  { step: 1, label: "Analyzing your business", description: "Understanding your brand, industry, and goals" },
  { step: 2, label: "Building audience persona", description: "Creating a detailed profile of your ideal customer" },
  { step: 3, label: "Crafting platform strategy", description: "Optimizing approach for each social platform" },
  { step: 4, label: "Defining content pillars", description: "Establishing your key content themes" },
  { step: 5, label: "Generating content calendar", description: "Planning your daily content schedule" },
  { step: 6, label: "Writing content briefs", description: "Creating detailed briefs for each post" },
] as const;
