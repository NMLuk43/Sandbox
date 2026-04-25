import crypto from "crypto";
import { Podcast } from "@snipd/shared";

const API_KEY = process.env.PODCAST_INDEX_API_KEY!;
const API_SECRET = process.env.PODCAST_INDEX_API_SECRET!;
const BASE = "https://api.podcastindex.org/api/1.0";

function getHeaders() {
  const epoch = Math.floor(Date.now() / 1000);
  const hash = crypto
    .createHash("sha1")
    .update(API_KEY + API_SECRET + epoch)
    .digest("hex");
  return {
    "X-Auth-Date": String(epoch),
    "X-Auth-Key": API_KEY,
    Authorization: hash,
    "User-Agent": "Snipd/1.0",
  };
}

interface PIFeed {
  id: number;
  title: string;
  author: string;
  description: string;
  image: string;
  url: string;
  categories?: Record<string, string>;
  episodeCount?: number;
}

function mapFeed(feed: PIFeed): Podcast {
  return {
    id: String(feed.id),
    title: feed.title,
    author: feed.author,
    description: feed.description,
    imageUrl: feed.image,
    feedUrl: feed.url,
    categories: feed.categories ? Object.values(feed.categories) : [],
    episodeCount: feed.episodeCount,
  };
}

export async function searchPodcasts(query: string, max = 20): Promise<Podcast[]> {
  const url = `${BASE}/search/byterm?q=${encodeURIComponent(query)}&max=${max}&fulltext`;
  const res = await fetch(url, { headers: getHeaders(), next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Podcast Index error: ${res.status}`);
  const data = await res.json();
  return (data.feeds ?? []).map(mapFeed);
}

export async function getTrendingPodcasts(max = 20): Promise<Podcast[]> {
  const url = `${BASE}/podcasts/trending?max=${max}&lang=en`;
  const res = await fetch(url, { headers: getHeaders(), next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Podcast Index error: ${res.status}`);
  const data = await res.json();
  return (data.feeds ?? []).map(mapFeed);
}

export async function getPodcastByFeed(feedUrl: string): Promise<Podcast | null> {
  const url = `${BASE}/podcasts/byfeedurl?url=${encodeURIComponent(feedUrl)}`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  return data.feed ? mapFeed(data.feed) : null;
}
