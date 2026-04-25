import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl ?? "http://localhost:3000";

export async function searchPodcasts(query?: string) {
  const url = `${BASE_URL}/api/podcasts/search${query ? `?q=${encodeURIComponent(query)}` : ""}`;
  const res = await fetch(url);
  return res.json();
}

export async function getEpisodes(feedUrl: string, podcastId: string, podcastTitle: string, podcastImageUrl: string) {
  const url = `${BASE_URL}/api/episodes?feedUrl=${encodeURIComponent(feedUrl)}&podcastId=${podcastId}&podcastTitle=${encodeURIComponent(podcastTitle)}&podcastImageUrl=${encodeURIComponent(podcastImageUrl)}`;
  const res = await fetch(url);
  return res.json();
}

export async function transcribeSnip(audioUrl: string, startTime: number, endTime: number) {
  const res = await fetch(`${BASE_URL}/api/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioUrl, startTime, endTime }),
  });
  return res.json();
}

export async function summarizeSnip(transcript: string, episodeTitle: string, podcastTitle: string) {
  const res = await fetch(`${BASE_URL}/api/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, episodeTitle, podcastTitle }),
  });
  return res.json();
}

export async function saveSnip(snip: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/api/snips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snip),
  });
  return res.json();
}

export async function getSnips() {
  const res = await fetch(`${BASE_URL}/api/snips`);
  return res.json();
}
