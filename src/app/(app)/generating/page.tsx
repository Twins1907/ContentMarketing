"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Rocket, Sparkles, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { GENERATION_STEPS } from "@/lib/constants";
import { getStrategyStatus } from "@/actions/strategy";
import { motion, AnimatePresence } from "framer-motion";

const FUN_MESSAGES = [
  "Brewing your strategy... ☕",
  "Teaching the AI about your brand...",
  "Finding the perfect content mix...",
  "Calibrating hashtag algorithms...",
  "Aligning the content stars...",
  "Almost there, good things take time...",
];

function FloatingDot({ delay, color, size, x, y }: { delay: number; color: string; size: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: size, height: size, backgroundColor: color, left: x, top: y }}
      animate={{
        y: [0, -15, 0],
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 3, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

function GeneratingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const strategyId = searchParams.get("id");
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<string>("generating");
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!strategyId) {
      router.push("/dashboard");
      return;
    }

    const pollStatus = async () => {
      const data = await getStrategyStatus(strategyId);
      if (!data) return;

      setCurrentStep(data.generationStep);
      setStatus(data.status);

      if (data.status === "ready") {
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [strategyId, router]);

  // Cycle fun messages
  useEffect(() => {
    if (status !== "generating") return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % FUN_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [status]);

  const progress = (currentStep / 6) * 100;

  const stepColors = ["#C9A7EB", "#89CFF0", "#F5C542", "#C9A7EB", "#89CFF0", "#F5C542"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-md mx-auto mt-8 relative"
    >
      {/* Floating decorative dots */}
      <FloatingDot delay={0} color="#C9A7EB" size={12} x="5%" y="10%" />
      <FloatingDot delay={0.5} color="#89CFF0" size={8} x="90%" y="5%" />
      <FloatingDot delay={1} color="#F5C542" size={10} x="85%" y="60%" />
      <FloatingDot delay={1.5} color="#E8614D" size={6} x="8%" y="70%" />
      <FloatingDot delay={2} color="#89CFF0" size={14} x="95%" y="85%" />
      <FloatingDot delay={0.8} color="#C9A7EB" size={8} x="3%" y="40%" />

      {/* Header with animated icon */}
      <div className="text-center mb-6">
        <motion.div
          animate={
            status === "generating"
              ? { y: [0, -12, 0], rotate: [0, 5, -5, 0] }
              : status === "ready"
              ? { scale: [1, 1.2, 1] }
              : {}
          }
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 bg-[#C9A7EB] border-2 border-foreground rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#272727] mx-auto mb-5"
        >
          {status === "ready" ? (
            <Sparkles className="w-10 h-10 text-white" />
          ) : (
            <Rocket className="w-10 h-10 text-white" />
          )}
        </motion.div>

        <h1 className="font-display text-4xl font-bold mb-2">
          {status === "ready"
            ? "Your Strategy is Ready!"
            : status === "failed"
            ? "Something Went Wrong"
            : "Crafting Your Strategy"}
        </h1>

        {/* Animated fun message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={status === "generating" ? messageIndex : status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground text-sm"
          >
            {status === "ready"
              ? "Redirecting to your dashboard..."
              : status === "failed"
              ? "Something went wrong during generation."
              : FUN_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Action buttons when failed */}
        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mt-4 justify-center"
          >
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-2 border-foreground">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="sm" className="bg-[#E8614D] text-white border-2 border-foreground shadow-[2px_2px_0px_#272727]">
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Try Again
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Progress Card */}
      <Card className="border-2 border-foreground shadow-[4px_4px_0px_#272727] overflow-hidden">
        <CardContent className="pt-6 pb-6">
          {/* Custom progress bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-6 border border-foreground/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#C9A7EB] via-[#89CFF0] to-[#F5C542]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="sync">
              {GENERATION_STEPS.map(({ step, label, description }, index) => {
                const isComplete = currentStep >= step;
                const isCurrent = currentStep === step - 1 && status === "generating";
                const stepColor = stepColors[index % stepColors.length];

                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: step * 0.06, duration: 0.3 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isCurrent
                        ? "bg-[#FFF8F0] border-2 border-foreground shadow-[2px_2px_0px_#272727]"
                        : isComplete
                        ? "opacity-100"
                        : "opacity-30"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isComplete ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", bounce: 0.5 }}
                          className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-foreground"
                          style={{ backgroundColor: stepColor }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </motion.div>
                      ) : isCurrent ? (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-foreground"
                          style={{ backgroundColor: stepColor }}
                        >
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-muted-foreground/20 bg-muted/30" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-medium text-sm ${isCurrent ? "text-foreground" : ""}`}>
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Step counter */}
          <div className="mt-4 pt-3 border-t border-muted text-center">
            <p className="text-xs text-muted-foreground">
              Step <span className="font-bold text-foreground">{Math.min(currentStep + 1, 6)}</span> of <span className="font-bold text-foreground">6</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <GeneratingContent />
    </Suspense>
  );
}
