import { NextRequest, NextResponse } from "next/server";
import { parseRSSFeed } from "@/lib/rss";

export async function GET(req: NextRequest) {
  const feedUrl = req.nextUrl.searchParams.get("feedUrl");
  const podcastId = req.nextUrl.searchParams.get("podcastId") ?? "unknown";
  const podcastTitle = req.nextUrl.searchParams.get("podcastTitle") ?? "";
  const podcastImageUrl = req.nextUrl.searchParams.get("podcastImageUrl") ?? "";

  if (!feedUrl) return NextResponse.json({ error: "feedUrl required" }, { status: 400 });

  try {
    const episodes = await parseRSSFeed(feedUrl, podcastId, podcastTitle, podcastImageUrl);
    return NextResponse.json({ episodes });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse feed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
