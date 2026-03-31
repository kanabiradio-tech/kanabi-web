"use client";

import { useRef, useState } from "react";

interface Props {
  audioUrl: string | null;
}

export default function InlineAudioPlayer({ audioUrl }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!audioUrl) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-highest text-on-surface-variant font-label text-sm">
        <span className="material-symbols-outlined text-lg">pending</span>
        音訊合成中
      </div>
    );
  }

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener("timeupdate", () => {
        if (!audioRef.current) return;
        const pct =
          audioRef.current.duration > 0
            ? (audioRef.current.currentTime / audioRef.current.duration) * 100
            : 0;
        setProgress(pct);
      });
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary-container text-on-primary">
      <button onClick={togglePlay}>
        <span
          className="material-symbols-outlined text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {playing ? "pause" : "play_arrow"}
        </span>
      </button>
      <div
        className="w-32 h-1 bg-on-primary/20 rounded-full cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((e.clientX - rect.left) / rect.width) * 100;
          if (audioRef.current && audioRef.current.duration) {
            audioRef.current.currentTime =
              (pct / 100) * audioRef.current.duration;
          }
          setProgress(pct);
        }}
      >
        <div
          className="h-full bg-on-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="font-label text-xs">播放</span>
    </div>
  );
}
