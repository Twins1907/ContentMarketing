import { z } from "zod";

export const businessSchema = z.object({
  businessName: z.string().min(1, "Business name is required").max(100),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().min(10, "Please describe your business (at least 10 characters)"),
  website: z.string().url("Please enter a valid URL").or(z.literal("")).optional().default(""),
  targetAudience: z.string().min(10, "Please describe your target audience"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  goals: z.array(z.string()).min(1, "Select at least one goal").max(3, "Maximum 3 goals"),
  duration: z.coerce.number().int().min(7).max(90).default(30),
  contentTone: z.array(z.string()).default([]),
  availableAssets: z.array(z.string()).default([]),
  budget: z.string().optional().default(""),
  plannedStartDate: z.string().optional().default(""),
  pastPerformance: z.string().optional().default(""),
  assetDescription: z.string().optional().default(""),
});

export const onboardingStep1Schema = z.object({
  businessName: z.string().min(1, "Business name is required").max(100),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().min(10, "Tell us about your business"),
  website: z.string().url().or(z.literal("")).optional(),
});

export const onboardingStep2Schema = z.object({
  targetAudience: z.string().min(10, "Describe your ideal customer"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  goals: z.array(z.string()).min(1, "Select at least one goal").max(3, "Maximum 3 goals"),
});

export type BusinessInput = z.infer<typeof businessSchema>;
export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>;
