import { create } from "zustand";
import { Episode } from "@snipd/shared";

interface SnipMark {
  startTime: number | null;
  endTime: number | null;
}

interface PlayerState {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isSnipping: boolean;
  snipMark: SnipMark;

  setEpisode: (episode: Episode) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  toggleSnipping: () => void;
  setSnipStart: (time: number) => void;
  setSnipEnd: (time: number) => void;
  resetSnip: () => void;
  seekTo: (time: number) => void;
  seekRequest: number | null;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentEpisode: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  volume: 1,
  isSnipping: false,
  snipMark: { startTime: null, endTime: null },
  seekRequest: null,

  setEpisode: (episode) => set({ currentEpisode: episode, currentTime: 0, isPlaying: true }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setVolume: (volume) => set({ volume }),
  toggleSnipping: () => set((s) => ({ isSnipping: !s.isSnipping, snipMark: { startTime: null, endTime: null } })),
  setSnipStart: (time) => set((s) => ({ snipMark: { ...s.snipMark, startTime: time } })),
  setSnipEnd: (time) => set((s) => ({ snipMark: { ...s.snipMark, endTime: time } })),
  resetSnip: () => set({ snipMark: { startTime: null, endTime: null }, isSnipping: false }),
  seekTo: (time) => set({ seekRequest: time }),
}));
