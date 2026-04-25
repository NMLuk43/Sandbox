"use client";

import { useState } from "react";
import { X, Scissors, Sparkles, Loader2, Tag } from "lucide-react";
import { Episode } from "@snipd/shared";
import { formatDuration } from "@snipd/shared";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

interface Props {
  episode: Episode;
  startTime: number;
  endTime: number;
  onClose: () => void;
}

export function SnipModal({ episode, startTime, endTime, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const duration = endTime - startTime;

  const transcribe = async () => {
    setIsTranscribing(true);
    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl: episode.audioUrl, startTime, endTime }),
      });
      const data = await res.json();
      if (data.transcript) {
        setTranscript(data.transcript);
        toast("Transcription complete!", "success");
      } else {
        toast(data.error || "Transcription failed", "error");
      }
    } catch {
      toast("Transcription failed", "error");
    } finally {
      setIsTranscribing(false);
    }
  };

  const summarize = async () => {
    if (!transcript) return;
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, episodeTitle: episode.title, podcastTitle: episode.podcastTitle }),
      });
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        toast("Summary generated!", "success");
      } else {
        toast(data.error || "Summarization failed", "error");
      }
    } catch {
      toast("Summarization failed", "error");
    } finally {
      setIsSummarizing(false);
    }
  };

  const save = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/snips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: episode.id,
          episodeTitle: episode.title,
          podcastTitle: episode.podcastTitle,
          podcastImageUrl: episode.podcastImageUrl,
          audioUrl: episode.audioUrl,
          startTime,
          endTime,
          title: title || `Snip from ${episode.title}`,
          note,
          transcript,
          aiSummary: summary,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        toast("Snip saved!", "success");
        onClose();
      } else {
        toast("Failed to save snip", "error");
      }
    } catch {
      toast("Failed to save snip", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">New Snip</h2>
              <p className="text-xs text-muted-foreground">
                {formatDuration(startTime)} → {formatDuration(endTime)} ({formatDuration(duration)})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Snip from ${episode.title}`}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          {/* Transcript */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Transcript</label>
              <button
                onClick={transcribe}
                disabled={isTranscribing}
                className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors disabled:opacity-50"
              >
                {isTranscribing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                {isTranscribing ? "Transcribing…" : "Auto-transcribe"}
              </button>
            </div>
            <div className={cn(
              "w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm min-h-[80px] text-muted-foreground",
              transcript && "text-foreground"
            )}>
              {transcript || "Transcription will appear here after processing."}
            </div>
          </div>

          {/* Summary */}
          {transcript && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">AI Summary</label>
                <button
                  onClick={summarize}
                  disabled={isSummarizing}
                  className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors disabled:opacity-50"
                >
                  {isSummarizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {isSummarizing ? "Summarizing…" : "Generate summary"}
                </button>
              </div>
              {summary && (
                <div className="w-full bg-brand-950/40 border border-brand-800/30 rounded-xl px-4 py-3 text-sm text-brand-100">
                  {summary}
                </div>
              )}
            </div>
          )}

          {/* Note */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Your Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your thoughts…"
              rows={2}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
              <Tag className="w-3 h-3" /> Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ai, productivity, mindset"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={isSaving}
            className="flex-1 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Snip
          </button>
        </div>
      </div>
    </div>
  );
}
