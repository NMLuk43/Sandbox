"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Scissors, Loader2, Sparkles, Download, FileText, Tag, Play, Trash2 } from "lucide-react";
import { Snip } from "@snipd/shared";
import { formatDuration, formatRelativeDate, secondsToTimestamp } from "@snipd/shared";
import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/store/playerStore";
import { toast } from "@/components/ui/Toaster";

export default function SnipsPage() {
  const [snips, setSnips] = useState<Snip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSnip, setSelectedSnip] = useState<Snip | null>(null);
  const { seekTo } = usePlayerStore();

  useEffect(() => {
    fetch("/api/snips")
      .then((r) => r.json())
      .then((data) => setSnips(
        (data.snips ?? []).map((s: Record<string, unknown>) => ({
          id: s.id,
          userId: s.user_id,
          episodeId: s.episode_id,
          episodeTitle: s.episode_title,
          podcastTitle: s.podcast_title,
          podcastImageUrl: s.podcast_image_url,
          audioUrl: s.audio_url,
          startTime: s.start_time,
          endTime: s.end_time,
          title: s.title,
          note: s.note,
          transcript: s.transcript,
          aiSummary: s.ai_summary,
          tags: s.tags ?? [],
          createdAt: s.created_at,
          updatedAt: s.updated_at,
        }))
      ))
      .finally(() => setLoading(false));
  }, []);

  const exportSnip = async (snip: Snip, target: "markdown" | "notion" | "readwise" | "obsidian") => {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ snip, target }),
    });
    const data = await res.json();

    if (target === "markdown" || target === "obsidian") {
      const blob = new Blob([data.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = data.filename; a.click();
      URL.revokeObjectURL(url);
      toast("Downloaded as Markdown!", "success");
    } else if (data.url) {
      window.open(data.url, "_blank");
      toast("Exported to Notion!", "success");
    } else if (data.success) {
      toast("Exported to Readwise!", "success");
    } else {
      toast(data.error || "Export failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Snips</h1>
            <p className="text-muted-foreground">{snips.length} captured moments</p>
          </div>
        </div>

        {snips.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 flex flex-col items-center text-center">
            <Scissors className="w-12 h-12 text-brand-400/40 mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No snips yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Start listening to a podcast and tap the Snip button to capture key moments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 space-y-3">
              {snips.map((snip) => (
                <button
                  key={snip.id}
                  onClick={() => setSelectedSnip(snip)}
                  className={cn(
                    "w-full text-left glass-card rounded-2xl p-4 transition-all duration-150",
                    selectedSnip?.id === snip.id
                      ? "border-brand-500/40 bg-brand-950/20"
                      : "hover:border-border"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-secondary">
                      {snip.podcastImageUrl && (
                        <Image src={snip.podcastImageUrl} alt={snip.podcastTitle} width={40} height={40} className="object-cover" unoptimized />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={cn("text-sm font-medium truncate leading-tight", selectedSnip?.id === snip.id ? "text-brand-300" : "text-foreground")}>
                        {snip.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">{snip.podcastTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground/60">{formatDuration(snip.endTime - snip.startTime)}</span>
                        <span className="text-xs text-muted-foreground/40">·</span>
                        <span className="text-xs text-muted-foreground/60">{formatRelativeDate(snip.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="lg:col-span-2">
              {selectedSnip ? (
                <div className="glass-card rounded-2xl p-6 space-y-6 sticky top-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-secondary">
                        {selectedSnip.podcastImageUrl && (
                          <Image src={selectedSnip.podcastImageUrl} alt={selectedSnip.podcastTitle} width={56} height={56} className="object-cover" unoptimized />
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground text-lg leading-tight">{selectedSnip.title}</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">{selectedSnip.podcastTitle}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">{selectedSnip.episodeTitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Time + play */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl text-sm">
                      <Scissors className="w-3.5 h-3.5 text-brand-400" />
                      <span className="text-muted-foreground text-xs">
                        {secondsToTimestamp(selectedSnip.startTime)} → {secondsToTimestamp(selectedSnip.endTime)}
                      </span>
                      <span className="text-muted-foreground/50 text-xs">({formatDuration(selectedSnip.endTime - selectedSnip.startTime)})</span>
                    </div>
                    <button
                      onClick={() => seekTo(selectedSnip.startTime)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-xl text-xs font-medium hover:bg-brand-500/30 transition-colors"
                    >
                      <Play className="w-3 h-3" /> Play
                    </button>
                  </div>

                  {/* AI Summary */}
                  {selectedSnip.aiSummary && (
                    <div className="bg-brand-950/40 border border-brand-800/30 rounded-xl p-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                        <span className="text-xs font-semibold text-brand-400 uppercase tracking-wide">AI Summary</span>
                      </div>
                      <p className="text-sm text-brand-100 leading-relaxed">{selectedSnip.aiSummary}</p>
                    </div>
                  )}

                  {/* Transcript */}
                  {selectedSnip.transcript && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Transcript</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed bg-secondary rounded-xl p-4 border-l-2 border-brand-500/40">
                        {selectedSnip.transcript}
                      </p>
                    </div>
                  )}

                  {/* Note */}
                  {selectedSnip.note && (
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">My Notes</span>
                      <p className="text-sm text-foreground/80 leading-relaxed">{selectedSnip.note}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedSnip.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedSnip.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-secondary rounded-lg text-xs text-muted-foreground">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Export */}
                  <div className="border-t border-border pt-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-3">Export to</span>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { target: "markdown" as const, label: "Markdown", icon: "📝" },
                        { target: "notion" as const, label: "Notion", icon: "◻️" },
                        { target: "obsidian" as const, label: "Obsidian", icon: "🔮" },
                        { target: "readwise" as const, label: "Readwise", icon: "📖" },
                      ].map(({ target, label, icon }) => (
                        <button
                          key={target}
                          onClick={() => exportSnip(selectedSnip, target)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <span>{icon}</span> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center h-64">
                  <Scissors className="w-8 h-8 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">Select a snip to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
