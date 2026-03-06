"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Users,
  Settings,
  Rocket,
  CheckCircle2,
  Loader2,
  CalendarDays,
} from "lucide-react";
import {
  INDUSTRIES,
  PLATFORMS,
  BUSINESS_GOALS,
  STRATEGY_DURATIONS,
  CONTENT_TONES,
  AVAILABLE_ASSETS,
  BUDGET_OPTIONS,
} from "@/lib/constants";
import { createBusiness } from "@/actions/business";
import { getTotalStrategyCount } from "@/actions/strategy";
import { canCreateStrategy } from "@/lib/access";
import { toast } from "sonner";

interface FormData {
  businessName: string;
  industry: string;
  description: string;
  website: string;
  targetAudience: string;
  platforms: string[];
  goals: string[];
  duration: number;
  contentTone: string[];
  availableAssets: string[];
  budget: string;
  plannedStartDate: string;
  pastPerformance: string;
  assetDescription: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const plan = (session?.user as { plan?: string })?.plan ?? "free";
  const maxDuration = plan === "pro" ? 90 : plan === "starter" ? 30 : 7;
  const allowedDurations = STRATEGY_DURATIONS.filter((d) => d.value <= maxDuration);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [limitChecked, setLimitChecked] = useState(false);

  // Guard: check strategy limit before allowing access to the form
  useEffect(() => {
    async function checkLimit() {
      const count = await getTotalStrategyCount();
      if (!canCreateStrategy(plan, count)) {
        toast.error(
          plan === "free"
            ? "Free plan allows 1 strategy. Upgrade to create more."
            : "You've reached your plan limit. Upgrade to Pro for unlimited strategies."
        );
        router.replace("/pricing");
        return;
      }
      setLimitChecked(true);
    }
    if (session) checkLimit();
  }, [session, plan, router]);
  const [form, setForm] = useState<FormData>({
    businessName: "",
    industry: "",
    description: "",
    website: "",
    targetAudience: "",
    platforms: [],
    goals: [],
    duration: maxDuration === 7 ? 7 : 30,
    contentTone: [],
    availableAssets: [],
    budget: "",
    plannedStartDate: "",
    pastPerformance: "",
    assetDescription: "",
  });

  const updateField = (field: keyof FormData, value: string | string[] | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (
    field: "platforms" | "goals" | "contentTone" | "availableAssets",
    item: string
  ) => {
    setForm((prev) => {
      const current = prev[field] as string[];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter((i) => i !== item) };
      }
      // Enforce max 3 for goals
      if (field === "goals" && current.length >= 3) {
        return prev;
      }
      return { ...prev, [field]: [...current, item] };
    });
  };

  const canProceed = () => {
    if (step === 1) {
      return form.businessName && form.industry && form.description.length >= 10;
    }
    if (step === 2) {
      return (
        form.targetAudience.length >= 10 &&
        form.platforms.length > 0 &&
        form.goals.length > 0
      );
    }
    if (step === 3) {
      return form.duration > 0 && form.plannedStartDate;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await createBusiness(form);
      if (result.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      // Update session to reflect onboarding completion
      await update();

      // Trigger AI generation
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: result.businessId }),
      });

      if (!genRes.ok) {
        const errorData = await genRes.json().catch(() => ({}));
        if (genRes.status === 403) {
          toast.error(errorData.error || "Plan limit reached.");
          router.push("/pricing");
          return;
        }
        toast.error(errorData.error || `Generation failed (${genRes.status})`);
        setLoading(false);
        return;
      }

      const genData = await genRes.json();
      if (genData.strategyId) {
        router.push(`/generating?id=${genData.strategyId}`);
      } else {
        toast.error(genData.error || "Failed to start generation");
        setLoading(false);
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Reusable pill-button style for all toggle selections
  const pillClass = (isSelected: boolean, disabled = false) =>
    `px-4 py-2 rounded-full border-2 border-black text-sm font-medium transition-all ${
      disabled
        ? "cursor-not-allowed opacity-40"
        : "cursor-pointer"
    } ${
      isSelected
        ? "bg-[#918EFA] text-black shadow-[3px_3px_0px_#000000]"
        : "bg-background shadow-none hover:shadow-[2px_2px_0px_#000000]"
    }`;

  const steps = [
    { num: 1, label: "Business", icon: Building2 },
    { num: 2, label: "Audience", icon: Users },
    { num: 3, label: "Preferences", icon: Settings },
    { num: 4, label: "Review", icon: Rocket },
  ];

  // Get today's date formatted as YYYY-MM-DD for the date picker
  const today = new Date().toISOString().split("T")[0];

  if (!limitChecked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map(({ num, label, icon: Icon }) => (
            <div
              key={num}
              className="flex items-center gap-2"
            >
              <div
                className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000] transition-colors ${
                  step >= num ? "bg-[#918EFA]" : "bg-background"
                }`}
              >
                {step > num ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  step >= num ? "text-black" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <Progress value={(step / 4) * 100} className="h-2" />
      </div>

      {/* Step 1: Business Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Tell us about your business
            </CardTitle>
            <p className="text-muted-foreground">
              The more detail you provide, the more tailored your strategy will be.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="e.g. Broderick St"
                value={form.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={form.industry}
                onValueChange={(v) => updateField("industry", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">
                Describe your business
              </Label>
              <Textarea
                id="description"
                placeholder="What does your business do? What products or services do you offer? What makes you different from competitors? Be as detailed as possible — this directly shapes the quality of your strategy."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Be detailed — the more context we have, the better your strategy.
              </p>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yoursite.com"
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!canProceed()}>
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Audience & Platforms */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Who are you trying to reach?
            </CardTitle>
            <p className="text-muted-foreground">
              Tell us about your ideal customer and where you want to show up.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="targetAudience">
                Describe your ideal customer
              </Label>
              <Textarea
                id="targetAudience"
                placeholder="e.g. Style-conscious men aged 25-40 who appreciate quality craftsmanship but want a modern, relaxed aesthetic. They follow fashion influencers, shop online, and value brands with a clear identity..."
                value={form.targetAudience}
                onChange={(e) => updateField("targetAudience", e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label className="mb-3 block">
                Which platforms do you want to focus on?
              </Label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map(({ id, name }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleArrayItem("platforms", id)}
                    className={pillClass(form.platforms.includes(id))}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">
                What are your main goals? (max 3)
              </Label>
              <div className="flex flex-wrap gap-3">
                {BUSINESS_GOALS.map((goal) => {
                  const isSelected = form.goals.includes(goal);
                  const isDisabled = !isSelected && form.goals.length >= 3;
                  return (
                    <button
                      key={goal}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => toggleArrayItem("goals", goal)}
                      className={pillClass(isSelected, isDisabled)}
                    >
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="pastPerformance" className="mb-2 block">
                What have you tried so far?
              </Label>
              <Textarea
                id="pastPerformance"
                placeholder="What content have you posted before? What worked and what didn't? Are there any competitors or accounts you admire? What does your current social media presence look like?"
                value={form.pastPerformance}
                onChange={(e) => updateField("pastPerformance", e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This helps us avoid repeating what hasn&apos;t worked and build on what has.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!canProceed()}>
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preferences */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Set your preferences
            </CardTitle>
            <p className="text-muted-foreground">
              Fine-tune your strategy with timeline, tone, and production details.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="duration">Strategy Duration</Label>
              {allowedDurations.length > 1 ? (
                <Select
                  value={String(form.duration)}
                  onValueChange={(v) => updateField("duration", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedDurations.map(({ value, label }) => (
                      <SelectItem key={value} value={String(value)}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1.5">
                  <div className="flex items-center justify-between border-2 border-black rounded-lg px-4 py-3 bg-[#FFF8F0] shadow-[2px_2px_0px_#000000]">
                    <span className="text-sm font-medium text-black">7 days</span>
                    <span className="text-xs font-bold bg-[#A8A6FF] text-black border border-black rounded-full px-2.5 py-0.5">
                      Free Plan
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Upgrade to Starter or Pro to unlock longer strategies.{" "}
                    <a href="/pricing" className="underline font-medium text-[#918EFA]" target="_blank">
                      View plans →
                    </a>
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="startDate" className="mb-2 block">
                <CalendarDays className="w-4 h-4 inline mr-1.5" />
                When are you starting?
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                This date becomes Day 1 on your content calendar.
              </p>
              <Input
                id="startDate"
                type="date"
                min={today}
                value={form.plannedStartDate}
                onChange={(e) => updateField("plannedStartDate", e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div>
              <Label className="mb-3 block">Content Tone</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select the tones that best match your brand voice.
              </p>
              <div className="flex flex-wrap gap-3">
                {CONTENT_TONES.map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => toggleArrayItem("contentTone", tone)}
                    className={pillClass(form.contentTone.includes(tone))}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">What assets can you produce?</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select all that apply — this shapes the visual direction in your briefs.
              </p>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_ASSETS.map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => toggleArrayItem("availableAssets", asset)}
                    className={pillClass(form.availableAssets.includes(asset))}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="assetDescription" className="mb-2 block">
                Describe your production capabilities
              </Label>
              <Textarea
                id="assetDescription"
                placeholder="e.g. We have a small studio with ring lighting, a Canon R6 camera, and access to a graphic designer 2 days per week. Our founder is comfortable on camera."
                value={form.assetDescription}
                onChange={(e) => updateField("assetDescription", e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Helps us tailor visual direction to what you can actually produce.
              </p>
            </div>

            <div>
              <Label className="mb-3 block">Monthly Content Budget</Label>
              <div className="flex flex-wrap gap-3">
                {BUDGET_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateField("budget", form.budget === option ? "" : option)}
                    className={pillClass(form.budget === option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button onClick={() => setStep(4)} disabled={!canProceed()}>
                Review
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Review & Generate
            </CardTitle>
            <p className="text-muted-foreground">
              Double-check your info, then we&apos;ll create your strategy.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl border-2 border-black bg-[#918EFA]/10">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Business
                </h3>
                <p className="font-medium">{form.businessName}</p>
                <p className="text-sm text-muted-foreground">{form.industry}</p>
                <p className="text-sm mt-1">{form.description}</p>
                {form.website && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {form.website}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl border-2 border-black bg-[#A8A6FF]/10">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Audience & Goals
                </h3>
                <p className="text-sm">{form.targetAudience}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.platforms.map((p) => {
                    const platform = PLATFORMS.find((pl) => pl.id === p);
                    return (
                      <Badge
                        key={p}
                        className="bg-[#918EFA] text-black"
                      >
                        {platform?.name}
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.goals.map((g) => (
                    <Badge key={g} variant="outline">
                      {g}
                    </Badge>
                  ))}
                </div>
                {form.pastPerformance && (
                  <div className="mt-3 pt-3 border-t border-black/10">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      Past Performance
                    </p>
                    <p className="text-sm">{form.pastPerformance}</p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl border-2 border-black bg-[#FFF8F0]">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Preferences
                </h3>
                <p className="text-sm">
                  <span className="font-medium">Duration:</span>{" "}
                  {STRATEGY_DURATIONS.find((d) => d.value === form.duration)?.label ?? `${form.duration} days`}
                </p>
                {form.plannedStartDate && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Start Date:</span>{" "}
                    {new Date(form.plannedStartDate + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {form.contentTone.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm font-medium">Tone:</span>
                    {form.contentTone.map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
                {form.availableAssets.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm font-medium">Assets:</span>
                    {form.availableAssets.map((a) => (
                      <Badge key={a} variant="outline">
                        {a}
                      </Badge>
                    ))}
                  </div>
                )}
                {form.assetDescription && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">Production:</span>{" "}
                    <span className="text-sm">{form.assetDescription}</span>
                  </div>
                )}
                {form.budget && (
                  <p className="text-sm mt-2">
                    <span className="font-medium">Budget:</span> {form.budget}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#918EFA] text-black border-2 border-black hover:bg-[#918EFA]/90 shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Rocket className="w-4 h-4 mr-2" />
                )}
                Generate My Strategy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
