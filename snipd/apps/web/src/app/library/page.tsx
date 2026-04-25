"use client";

import { Headphones, BookmarkPlus } from "lucide-react";
import Link from "next/link";

export default function LibraryPage() {
  return (
    <div className="min-h-full p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Library</h1>
          <p className="text-muted-foreground">Your subscribed podcasts.</p>
        </div>

        <div className="glass-card rounded-2xl p-16 flex flex-col items-center text-center">
          <Headphones className="w-12 h-12 text-brand-400/40 mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No subscriptions yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Browse the Discover tab and subscribe to your favorite shows.
          </p>
          <Link
            href="/discover"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <BookmarkPlus className="w-4 h-4" />
            Find Podcasts
          </Link>
        </div>
      </div>
    </div>
  );
}
