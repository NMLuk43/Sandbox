"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Scissors, ChevronUp, ChevronDown, RotateCcw, RotateCw,
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { formatDuration } from "@snipd/shared";
import { cn } from "@/lib/utils";
import { SnipModal } from "./SnipModal";

const RATES = [0.75, 1, 1.25, 1.5, 1.75, 2];

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showSnipModal, setShowSnipModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const {
    currentEpisode, isPlaying, currentTime, duration, playbackRate, volume,
    isSnipping, snipMark,
    setIsPlaying, setCurrentTime, setDuration, setPlaybackRate, setVolume,
    toggleSnipping, setSnipStart, setSnipEnd, seekRequest,
  } = usePlayerStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;
    audio.src = currentEpisode.audioUrl;
    audio.play().catch(() => setIsPlaying(false));
  }, [currentEpisode?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (seekRequest !== null && audioRef.current) {
      audioRef.current.currentTime = seekRequest;
      usePlayerStore.setState({ seekRequest: null });
    }
  }, [seekRequest]);

  if (!currentEpisode) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSnipAction = () => {
    if (!isSnipping) {
      toggleSnipping();
      setSnipStart(currentTime);
    } else if (snipMark.startTime !== null && snipMark.endTime === null) {
      setSnipEnd(currentTime);
      setShowSnipModal(true);
    }
  };

  const cycleRate = () => {
    const idx = RATES.indexOf(playbackRate);
    setPlaybackRate(RATES[(idx + 1) % RATES.length]);
  };

  return (
    <>
      <div className={cn(
        "glass border-t border-border/50 transition-all duration-300",
        expanded ? "h-40" : "h-20"
      )}>
        <audio
          ref={audioRef}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Progress bar */}
        <div
          className="w-full h-0.5 bg-border cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            if (audioRef.current) audioRef.current.currentTime = pct * duration;
          }}
        >
          <div
            className="h-full bg-gradient-brand transition-all relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
          </div>
          {/* Snip marker */}
          {isSnipping && snipMark.startTime !== null && (
            <div
              className="absolute top-0 w-0.5 h-full bg-yellow-400"
              style={{ left: `${(snipMark.startTime / duration) * 100}%` }}
            />
          )}
        </div>

        {/* Main controls */}
        <div className="flex items-center gap-4 px-6 h-[calc(100%-2px)]">
          {/* Episode info */}
          <div className="flex items-center gap-3 w-64 shrink-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-secondary">
              {currentEpisode.podcastImageUrl && (
                <Image
                  src={currentEpisode.podcastImageUrl}
                  alt={currentEpisode.podcastTitle}
                  width={44} height={44}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground truncate leading-tight">
                {currentEpisode.title}
              </div>
              <div className="text-xs text-muted-foreground truncate">{currentEpisode.podcastTitle}</div>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <button
              onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 15; }}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Back 15s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 30; }}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={() => { if (audioRef.current) audioRef.current.currentTime += 30; }}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={() => { if (audioRef.current) audioRef.current.currentTime += 15; }}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Forward 15s"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 w-64 justify-end">
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>

            <button
              onClick={cycleRate}
              className="text-xs font-bold text-muted-foreground hover:text-foreground w-8 tabular-nums transition-colors"
            >
              {playbackRate}x
            </button>

            <button
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleSnipAction}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                isSnipping
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 animate-pulse"
                  : "bg-brand-500/20 text-brand-300 border border-brand-500/30 hover:bg-brand-500/30"
              )}
            >
              <Scissors className="w-3.5 h-3.5" />
              {isSnipping ? (snipMark.startTime !== null ? "End Snip" : "Snipping…") : "Snip"}
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded view: volume slider + transcript hint */}
        {expanded && (
          <div className="px-6 pb-4 flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <input
                type="range" min={0} max={1} step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-brand-500"
              />
            </div>
          </div>
        )}
      </div>

      {showSnipModal && snipMark.startTime !== null && snipMark.endTime !== null && (
        <SnipModal
          episode={currentEpisode}
          startTime={snipMark.startTime}
          endTime={snipMark.endTime}
          onClose={() => { setShowSnipModal(false); usePlayerStore.getState().resetSnip(); }}
        />
      )}
    </>
  );
}
