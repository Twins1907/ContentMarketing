"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Target,
  Lightbulb,
  FileText,
  Eye,
  MessageCircle,
  Hash,
  Clock,
  Lock,
  Send,
  Sparkles,
  Loader2,
  Video,
  Image,
  Layers,
  Wand2,
  Copy,
  Check,
} from "lucide-react";
import { getBrief, addBriefFeedback, getBriefFeedback, suggestBriefChanges } from "@/actions/strategy";
import { canViewBrief } from "@/lib/access";
import Link from "next/link";
import { toast } from "sonner";
import type { ContentBrief } from "@prisma/client";
import { PLATFORM_COLORS } from "@/lib/constants";

interface FeedbackItem {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
}

export default function BriefDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [brief, setBrief] = useState<(ContentBrief & { strategy: { id: string; business: { businessName: string } } }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  useEffect(() => {
    async function load() {
      if (!params.id) return;
      const data = await getBrief(params.id as string);
      setBrief(data as typeof brief);
      setLoading(false);
    }
    load();
  }, [params.id]);

  useEffect(() => {
    if (brief) {
      getBriefFeedback(brief.id).then((data) => setFeedbackList(data as FeedbackItem[]));
    }
  }, [brief?.id]);

  const handleAddNote = async () => {
    if (!brief || !newNote.trim()) return;
    setSubmitting(true);
    const result = await addBriefFeedback(brief.id, newNote.trim());
    if (result.error) {
      toast.error(result.error);
    } else {
      setNewNote("");
      const updated = await getBriefFeedback(brief.id);
      setFeedbackList(updated as FeedbackItem[]);
      toast.success("Note added");
    }
    setSubmitting(false);
  };

  const handleSuggestChanges = async () => {
    if (!brief) return;
    setSuggesting(true);
    const feedbackContext = newNote.trim() || feedbackList.filter(f => f.type === "note").map(f => f.content).join("; ") || "general improvement";
    const result = await suggestBriefChanges(brief.id, feedbackContext);
    if (result.error) {
      toast.error(result.error);
    } else {
      const updated = await getBriefFeedback(brief.id);
      setFeedbackList(updated as FeedbackItem[]);
      setNewNote("");
      toast.success("AI suggestion generated");
    }
    setSuggesting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="text-center mt-16">
        <h1 className="font-display text-2xl font-bold mb-2">Brief Not Found</h1>
        <p className="text-muted-foreground mb-4">This brief doesn&apos;t exist or you don&apos;t have access.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const plan = session?.user?.plan || "free";
  const isUnlocked = canViewBrief(plan, brief.dayNumber - 1);

  if (!isUnlocked) {
    return (
      <div className="max-w-lg mx-auto text-center mt-16">
        <div className="w-16 h-16 bg-muted border-2 border-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Brief Locked</h1>
        <p className="text-muted-foreground mb-6">
          Upgrade to unlock all content briefs.
        </p>
        <Link href="/pricing">
          <Button className="bg-[#C9A7EB] text-foreground border-2 border-foreground shadow-[3px_3px_0px_#272727]">
            Unlock All Briefs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Calendar
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge
            className="text-white border-0"
            style={{ backgroundColor: PLATFORM_COLORS[brief.platform] || PLATFORM_COLORS[brief.platform.toLowerCase()] || "#666" }}
          >
            {brief.platform}
          </Badge>
          <Badge variant="outline" className="bg-[#89CFF0]/10 border-[#89CFF0] text-foreground font-semibold">
            {getFormatIcon(brief.contentFormat)} {brief.contentFormat}
          </Badge>
          <Badge variant="outline">{brief.pillar}</Badge>
          <Badge variant="outline" className="ml-auto bg-[#FFF8F0]">
            Day {brief.dayNumber}
          </Badge>
        </div>
        <h1 className="font-display text-3xl font-bold mb-1">{brief.hook}</h1>
        <p className="text-sm text-muted-foreground">
          {brief.strategy?.business?.businessName}
        </p>
      </div>

      {/* Main content — 2 column layout on large screens */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column — main brief content */}
        <div className="lg:col-span-2 space-y-5">
          <Section icon={Target} title="Goal" color="#C9A7EB">
            <p className="text-sm">{brief.goal}</p>
          </Section>

          <Section icon={FileText} title="Script / Outline" color="#89CFF0">
            <p className="text-sm whitespace-pre-line">{brief.script}</p>
          </Section>

          <Section icon={Eye} title="Visual Direction" color="#89CFF0">
            <p className="text-sm">{brief.visualDirection}</p>
          </Section>

          <Section icon={MessageCircle} title="Caption" color="#C9A7EB">
            <p className="text-sm whitespace-pre-line">{brief.caption}</p>
          </Section>

          <Section icon={Hash} title="Hashtags" color="#89CFF0">
            <div className="flex flex-wrap gap-1.5">
              {brief.hashtags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </Section>

          <Section icon={Lightbulb} title="Strategic Reasoning" color="#F5C542">
            <p className="text-sm text-muted-foreground">{brief.strategicReasoning}</p>
          </Section>

          {/* Carousel Slides (if applicable) */}
          {Array.isArray((brief as Record<string, unknown>).carouselSlides) &&
            ((brief as Record<string, unknown>).carouselSlides as Array<{ slideNumber: number; textOverlay: string; visualDescription: string }>).length > 0 && (
            <Section icon={Layers} title="Carousel Slide Breakdown" color="#C9A7EB">
              <div className="space-y-3">
                {((brief as Record<string, unknown>).carouselSlides as Array<{ slideNumber: number; textOverlay: string; visualDescription: string }>).map((slide) => (
                  <div
                    key={slide.slideNumber}
                    className="p-3 rounded-lg border-2 border-foreground/10 bg-[#C9A7EB]/5"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-[#C9A7EB] text-white text-xs font-bold flex items-center justify-center border border-foreground">
                        {slide.slideNumber}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground uppercase">Slide {slide.slideNumber}</span>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Text Overlay</span>
                      {slide.textOverlay}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Visual Direction</span>
                      {slide.visualDescription}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* AI Media Prompt */}
          {typeof (brief as Record<string, unknown>).aiMediaPrompt === "string" && (
            <Section icon={Wand2} title="AI Media Prompt" color="#89CFF0">
              <div className="relative">
                <div className="p-3 rounded-lg border-2 border-dashed border-[#89CFF0]/40 bg-[#89CFF0]/5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">
                    Use this prompt to generate your {brief.contentFormat.toLowerCase().includes("video") || brief.contentFormat.toLowerCase().includes("reel") || brief.contentFormat.toLowerCase().includes("short") ? "video" : "image"} with AI tools (Midjourney, DALL·E, Runway, etc.)
                  </p>
                  <p className="text-sm whitespace-pre-line font-mono text-foreground/80">
                    {String((brief as Record<string, unknown>).aiMediaPrompt)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    navigator.clipboard.writeText(String((brief as Record<string, unknown>).aiMediaPrompt));
                    setPromptCopied(true);
                    setTimeout(() => setPromptCopied(false), 2000);
                    toast.success("Prompt copied to clipboard");
                  }}
                >
                  {promptCopied ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  {promptCopied ? "Copied" : "Copy"}
                </Button>
              </div>
            </Section>
          )}
        </div>

        {/* Right column — CTA, time, feedback */}
        <div className="space-y-4">
          {/* CTA + Best Time — consistent height */}
          <Card className="border-2 border-foreground shadow-[3px_3px_0px_#272727] bg-[#C9A7EB]/10">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Target className="w-3 h-3" /> Call to Action
              </p>
              <p className="text-sm font-medium">{brief.cta}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground shadow-[3px_3px_0px_#272727] bg-[#89CFF0]/10">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Best Time to Post
              </p>
              <p className="text-lg font-bold">{brief.postingTime}</p>
              {typeof (brief as Record<string, unknown>).postingTimeRationale === "string" && (
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {String((brief as Record<string, unknown>).postingTimeRationale)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Feedback & Notes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md flex items-center justify-center bg-[#F5C542] border-2 border-foreground">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold">Feedback & Notes</h3>
            </div>

            <div className="space-y-2 mb-3">
              <Textarea
                placeholder="Add a note or describe changes you'd like..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddNote}
                  disabled={submitting || !newNote.trim()}
                  className="flex-1"
                >
                  {submitting ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3 mr-1" />
                  )}
                  Add Note
                </Button>
                <Button
                  size="sm"
                  onClick={handleSuggestChanges}
                  disabled={suggesting}
                  className="flex-1 bg-[#C9A7EB] text-foreground border-2 border-foreground hover:bg-[#C9A7EB]/80 shadow-[2px_2px_0px_#272727]"
                >
                  {suggesting ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  AI Suggest
                </Button>
              </div>
            </div>

            {feedbackList.length > 0 && (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {feedbackList.map((fb) => (
                  <div
                    key={fb.id}
                    className={`p-3 rounded-lg border text-sm ${
                      fb.type === "ai_suggestion"
                        ? "bg-[#C9A7EB]/10 border-[#C9A7EB]"
                        : "bg-muted/50 border-muted"
                    }`}
                  >
                    {fb.type === "ai_suggestion" && (
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-[#C9A7EB]" />
                        <span className="text-xs font-bold text-[#C9A7EB]">AI Suggestion</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line text-xs">{fb.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(fb.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getFormatIcon(format: string): string {
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

function Section({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center border-2 border-foreground"
          style={{ backgroundColor: color }}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wide">{title}</h3>
      </div>
      <div className="pl-9">{children}</div>
    </div>
  );
}
