import { NextRequest, NextResponse } from "next/server";
import { searchPodcasts, getTrendingPodcasts } from "@/lib/podcastIndex";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  try {
    const podcasts = q ? await searchPodcasts(q) : await getTrendingPodcasts();
    return NextResponse.json({ podcasts });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
