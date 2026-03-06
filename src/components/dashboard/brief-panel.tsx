"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Target,
  Eye,
  FileText,
  Hash,
  MessageCircle,
  Lightbulb,
  ExternalLink,
  Lock,
  Send,
  Sparkles,
  Loader2,
  Layers,
  Wand2,
  Copy,
  Check,
} from "lucide-react";
import type { ContentBrief } from "@prisma/client";
import Link from "next/link";
import { canViewBrief } from "@/lib/access";
import { addBriefFeedback, getBriefFeedback, suggestBriefChanges } from "@/actions/strategy";
import { toast } from "sonner";

import { PLATFORM_COLORS } from "@/lib/constants";

interface BriefPanelProps {
  brief: ContentBrief | null;
  open: boolean;
  onClose: () => void;
  plan: string;
  briefIndex: number;
}

interface FeedbackItem {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
}

export function BriefPanel({ brief, open, onClose, plan, briefIndex }: BriefPanelProps) {
  const isUnlocked = canViewBrief(plan, briefIndex);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  useEffect(() => {
    if (brief && open && isUnlocked) {
      getBriefFeedback(brief.id).then((data) => setFeedbackList(data as FeedbackItem[]));
    }
  }, [brief?.id, open, isUnlocked]);

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

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        {brief ? (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge
                  className="text-white border-0"
                  style={{ backgroundColor: PLATFORM_COLORS[brief.platform] || "#666" }}
                >
                  {brief.platform}
                </Badge>
                <Badge variant="outline" className="bg-[#A8A6FF]/10 border-[#89CFF0] font-semibold">
                  {getFormatIcon(brief.contentFormat)} {brief.contentFormat}
                </Badge>
                <Badge variant="outline">{brief.pillar}</Badge>
              </div>
              <SheetTitle className="font-display text-xl">
                Day {brief.dayNumber} Content Brief
              </SheetTitle>
            </SheetHeader>

            {isUnlocked ? (
              <div className="space-y-5 mt-6">
                <Section icon={Target} title="Goal" color="#C9A7EB">
                  <p className="text-sm">{brief.goal}</p>
                </Section>

                <Section icon={Lightbulb} title="Hook" color="#C9A7EB">
                  <p className="text-sm font-medium">{brief.hook}</p>
                </Section>

                <Separator />

                <Section icon={FileText} title="Script / Outline" color="#89CFF0">
                  <p className="text-sm whitespace-pre-line">{brief.script}</p>
                </Section>

                <Section icon={Eye} title="Visual Direction" color="#89CFF0">
                  <p className="text-sm">{brief.visualDirection}</p>
                </Section>

                <Separator />

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

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border-2 border-black bg-[#918EFA]/10">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Target className="w-3 h-3" /> CTA
                    </p>
                    <p className="text-sm font-medium">{brief.cta}</p>
                  </div>
                  <div className="p-3 rounded-xl border-2 border-black bg-[#A8A6FF]/10">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Best Time
                    </p>
                    <p className="text-sm font-medium">{brief.postingTime}</p>
                  </div>
                </div>

                <Section icon={Lightbulb} title="Strategic Reasoning" color="#89CFF0">
                  <p className="text-sm text-muted-foreground">
                    {brief.strategicReasoning}
                  </p>
                </Section>

                {/* Carousel Slides */}
                {Array.isArray((brief as Record<string, unknown>).carouselSlides) &&
                  ((brief as Record<string, unknown>).carouselSlides as Array<{ slideNumber: number; textOverlay: string; visualDescription: string }>).length > 0 && (
                  <Section icon={Layers} title="Slide Breakdown" color="#C9A7EB">
                    <div className="space-y-2">
                      {((brief as Record<string, unknown>).carouselSlides as Array<{ slideNumber: number; textOverlay: string; visualDescription: string }>).map((slide) => (
                        <div
                          key={slide.slideNumber}
                          className="p-2.5 rounded-lg border bg-[#918EFA]/5"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-5 h-5 rounded-full bg-[#918EFA] text-white text-[10px] font-bold flex items-center justify-center">
                              {slide.slideNumber}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Slide {slide.slideNumber}</span>
                          </div>
                          <p className="text-xs font-medium">{slide.textOverlay}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{slide.visualDescription}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* AI Media Prompt */}
                {typeof (brief as Record<string, unknown>).aiMediaPrompt === "string" && (
                  <Section icon={Wand2} title="AI Media Prompt" color="#89CFF0">
                    <div className="relative">
                      <div className="p-2.5 rounded-lg border-2 border-dashed border-[#89CFF0]/40 bg-[#A8A6FF]/5">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1.5">
                          Generate your visuals with AI tools
                        </p>
                        <p className="text-xs whitespace-pre-line font-mono text-black/80 line-clamp-6">
                          {String((brief as Record<string, unknown>).aiMediaPrompt)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-1.5 right-1.5 h-6 text-[10px]"
                        onClick={() => {
                          navigator.clipboard.writeText(String((brief as Record<string, unknown>).aiMediaPrompt));
                          setPromptCopied(true);
                          setTimeout(() => setPromptCopied(false), 2000);
                        }}
                      >
                        {promptCopied ? <Check className="w-2.5 h-2.5 mr-0.5" /> : <Copy className="w-2.5 h-2.5 mr-0.5" />}
                        {promptCopied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </Section>
                )}

                <Link href={`/dashboard/brief/${brief.id}`}>
                  <Button variant="outline" className="w-full mt-2">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Brief
                  </Button>
                </Link>

                <Separator />

                {/* Feedback Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center bg-[#FFF066]">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold">Feedback & Notes</h3>
                  </div>

                  <div className="space-y-2 mb-3">
                    <Textarea
                      placeholder="Add a note or describe changes you'd like..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
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
                        className="flex-1 bg-[#918EFA] text-black border-2 border-black hover:bg-[#918EFA]/80"
                      >
                        {suggesting ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 mr-1" />
                        )}
                        Suggest Changes
                      </Button>
                    </div>
                  </div>

                  {feedbackList.length > 0 && (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {feedbackList.map((fb) => (
                        <div
                          key={fb.id}
                          className={`p-3 rounded-lg border text-sm ${
                            fb.type === "ai_suggestion"
                              ? "bg-[#918EFA]/10 border-[#C9A7EB]"
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
            ) : (
              <div className="mt-8 text-center space-y-4">
                <div className="w-16 h-16 bg-muted border-2 border-black rounded-2xl flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold">
                  Brief Locked
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade to unlock all content briefs.
                </p>
                <Link href="/pricing">
                  <Button className="bg-[#FFE500] text-white border-2 border-black">
                    Unlock All Briefs
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Select a day to view the brief</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
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
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
