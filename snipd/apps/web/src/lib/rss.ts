import { Episode } from "@snipd/shared";
import { stripHtml } from "@snipd/shared";

interface RSSItem {
  title?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  link?: string;
  enclosure?: { url: string; type: string; length?: string };
  pubDate?: string;
  itunes?: {
    duration?: string;
    image?: string;
    summary?: string;
    episode?: string;
  };
}

function parseDuration(d: string | undefined): number {
  if (!d) return 0;
  const parts = d.split(":").map(Number).reverse();
  return (parts[0] ?? 0) + (parts[1] ?? 0) * 60 + (parts[2] ?? 0) * 3600;
}

export async function parseRSSFeed(
  feedUrl: string,
  podcastId: string,
  podcastTitle: string,
  podcastImageUrl: string,
  limit = 50
): Promise<Episode[]> {
  const Parser = (await import("rss-parser")).default;
  const parser = new Parser({
    customFields: { item: [["itunes:duration", "itunes.duration"], ["itunes:image", "itunes.image"]] },
  });

  const feed = await parser.parseURL(feedUrl);
  const items = feed.items.slice(0, limit) as RSSItem[];

  return items
    .filter((item) => item.enclosure?.url)
    .map((item, i) => ({
      id: item.guid || `${podcastId}-${i}`,
      podcastId,
      podcastTitle,
      podcastImageUrl,
      title: item.title ?? "Untitled Episode",
      description: stripHtml(item.content ?? item.contentSnippet ?? ""),
      audioUrl: item.enclosure!.url,
      duration: parseDuration(item.itunes?.duration),
      publishedAt: item.pubDate ?? new Date().toISOString(),
      imageUrl: item.itunes?.image ?? podcastImageUrl,
    }));
}
