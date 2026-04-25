import { create } from "zustand";
import { Audio } from "expo-av";
import { Episode } from "@snipd/shared";

interface PlayerState {
  currentEpisode: Episode | null;
  sound: Audio.Sound | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isSnipping: boolean;
  snipStartTime: number | null;

  loadEpisode: (episode: Episode) => Promise<void>;
  togglePlayback: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
  startSnip: () => void;
  stopSnip: () => number | null;
  cleanup: () => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentEpisode: null,
  sound: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  isSnipping: false,
  snipStartTime: null,

  loadEpisode: async (episode) => {
    const { sound: prev } = get();
    if (prev) await prev.unloadAsync();

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri: episode.audioUrl },
      { shouldPlay: true, rate: get().playbackRate },
      (status) => {
        if (!status.isLoaded) return;
        set({
          isPlaying: status.isPlaying,
          currentTime: status.positionMillis / 1000,
          duration: (status.durationMillis ?? 0) / 1000,
        });
      }
    );

    set({ sound, currentEpisode: episode, isPlaying: true });
  },

  togglePlayback: async () => {
    const { sound, isPlaying } = get();
    if (!sound) return;
    if (isPlaying) await sound.pauseAsync();
    else await sound.playAsync();
    set({ isPlaying: !isPlaying });
  },

  seekTo: async (seconds) => {
    const { sound } = get();
    if (!sound) return;
    await sound.setPositionAsync(seconds * 1000);
  },

  setPlaybackRate: async (rate) => {
    const { sound } = get();
    if (sound) await sound.setRateAsync(rate, true);
    set({ playbackRate: rate });
  },

  startSnip: () => set({ isSnipping: true, snipStartTime: get().currentTime }),

  stopSnip: () => {
    const { snipStartTime } = get();
    set({ isSnipping: false, snipStartTime: null });
    return snipStartTime;
  },

  cleanup: async () => {
    const { sound } = get();
    if (sound) await sound.unloadAsync();
    set({ sound: null, currentEpisode: null, isPlaying: false });
  },
}));
