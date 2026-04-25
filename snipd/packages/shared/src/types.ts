export interface Podcast {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  feedUrl: string;
  categories: string[];
  episodeCount?: number;
  isSubscribed?: boolean;
}

export interface Episode {
  id: string;
  podcastId: string;
  podcastTitle: string;
  podcastImageUrl: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  publishedAt: string;
  imageUrl?: string;
  transcript?: TranscriptSegment[];
  summary?: string;
  chapters?: Chapter[];
  playbackPosition?: number;
  isCompleted?: boolean;
}

export interface TranscriptSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

export interface Chapter {
  title: string;
  startTime: number;
  endTime?: number;
  imageUrl?: string;
}

export interface Snip {
  id: string;
  userId: string;
  episodeId: string;
  episodeTitle: string;
  podcastTitle: string;
  podcastImageUrl: string;
  audioUrl: string;
  startTime: number;
  endTime: number;
  title: string;
  note?: string;
  transcript?: string;
  aiSummary?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ExportTarget {
  type: "notion" | "obsidian" | "readwise" | "markdown";
  label: string;
  icon: string;
}

export interface PlaybackState {
  episodeId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
}

export interface SearchResult {
  podcasts: Podcast[];
  total: number;
  query: string;
}
