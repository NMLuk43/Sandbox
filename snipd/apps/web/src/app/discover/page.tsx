"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, TrendingUp, Loader2, Headphones, ChevronRight } from "lucide-react";
import { Podcast } from "@snipd/shared";
import { truncate } from "@snipd/shared";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTrending, setIsTrending] = useState(true);

  const search = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/podcasts/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      const data = await res.json();
      setPodcasts(data.podcasts ?? []);
      setIsTrending(!q);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { search(""); }, [search]);

  useEffect(() => {
    if (!query) { search(""); return; }
    const t = setTimeout(() => search(query), 400);
    return () => clearTimeout(t);
  }, [query, search]);

  return (
    <div className="min-h-full p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover</h1>
          <p className="text-muted-foreground">Search thousands of podcasts or browse what&apos;s trending.</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search podcasts, topics, people…"
            className="w-full bg-secondary border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-base transition-all"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400 animate-spin" />
          )}
        </div>

        {/* Section title */}
        <div className="flex items-center gap-2 mb-5">
          {isTrending ? (
            <><TrendingUp className="w-4 h-4 text-brand-400" /><h2 className="font-semibold text-foreground">Trending Now</h2></>
          ) : (
            <><Search className="w-4 h-4 text-brand-400" /><h2 className="font-semibold text-foreground">{podcasts.length} results for &quot;{query}&quot;</h2></>
          )}
        </div>

        {/* Grid */}
        {loading && podcasts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 flex gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-xl bg-secondary shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                  <div className="h-3 bg-secondary rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {podcasts.map((podcast) => (
              <Link key={podcast.id} href={`/podcast/${podcast.id}?feedUrl=${encodeURIComponent(podcast.feedUrl)}&title=${encodeURIComponent(podcast.title)}&image=${encodeURIComponent(podcast.imageUrl)}`}>
                <div className="glass-card rounded-2xl p-4 flex gap-4 hover:border-brand-800/40 transition-all duration-200 group cursor-pointer">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-secondary">
                    {podcast.imageUrl ? (
                      <Image
                        src={podcast.imageUrl}
                        alt={podcast.title}
                        width={64} height={64}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Headphones className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-brand-300 transition-colors truncate leading-tight">
                      {podcast.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1.5">{podcast.author}</p>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
                      {truncate(podcast.description, 120)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-brand-400 shrink-0 self-center transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && podcasts.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No podcasts found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
