"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Play, Loader2, Clock, Calendar, ChevronLeft, BookmarkPlus } from "lucide-react";
import { Episode } from "@snipd/shared";
import { formatDuration, formatRelativeDate, truncate } from "@snipd/shared";
import Link from "next/link";
import { usePlayerStore } from "@/store/playerStore";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

export default function PodcastPage() {
  const params = useSearchParams();
  const feedUrl = params.get("feedUrl") ?? "";
  const id = params.get("id") ?? "";
  const title = params.get("title") ?? "";
  const imageUrl = params.get("image") ?? "";

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setEpisode, currentEpisode } = usePlayerStore();

  useEffect(() => {
    if (!feedUrl) return;
    setLoading(true);
    fetch(`/api/episodes?feedUrl=${encodeURIComponent(feedUrl)}&podcastId=${id}&podcastTitle=${encodeURIComponent(title)}&podcastImageUrl=${encodeURIComponent(imageUrl)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setEpisodes(data.episodes ?? []);
      })
      .catch(() => setError("Failed to load episodes"))
      .finally(() => setLoading(false));
  }, [feedUrl, id, title, imageUrl]);

  return (
    <div className="min-h-full p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link href="/discover" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to Discover
        </Link>

        {/* Podcast header */}
        <div className="flex gap-6 mb-10">
          <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-secondary shadow-2xl">
            {imageUrl && <Image src={imageUrl} alt={title} width={112} height={112} className="object-cover w-full h-full" unoptimized />}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground mb-2 leading-tight">{title || "Podcast"}</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{episodes.length} episodes</span>
              <button
                onClick={() => toast("Subscribed! (Requires sign in)", "info")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold hover:bg-brand-500/30 transition-colors"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Episodes */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">Episodes</h2>

          {loading && (
            <div className="flex items-center gap-3 py-10 justify-center">
              <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
              <span className="text-muted-foreground text-sm">Loading episodes…</span>
            </div>
          )}

          {error && (
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-destructive text-sm">{error}</p>
              <p className="text-muted-foreground text-xs mt-1">Check that the RSS feed is accessible.</p>
            </div>
          )}

          <div className="space-y-2">
            {episodes.map((episode) => {
              const isActive = currentEpisode?.id === episode.id;
              return (
                <div
                  key={episode.id}
                  className={cn(
                    "glass-card rounded-2xl p-4 flex gap-4 transition-all duration-200 group",
                    isActive ? "border-brand-500/30 bg-brand-950/20" : "hover:border-border"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-medium text-sm leading-snug mb-1 transition-colors",
                      isActive ? "text-brand-300" : "text-foreground"
                    )}>
                      {episode.title}
                    </h3>
                    <p className="text-xs text-muted-foreground/80 line-clamp-2 mb-2 leading-relaxed">
                      {truncate(episode.description, 180)}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatRelativeDate(episode.publishedAt)}</span>
                      {episode.duration > 0 && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(episode.duration)}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setEpisode(episode)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 self-center transition-all",
                      isActive
                        ? "bg-brand-500 text-white"
                        : "bg-secondary text-muted-foreground hover:bg-brand-500 hover:text-white group-hover:scale-105"
                    )}
                  >
                    <Play className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
