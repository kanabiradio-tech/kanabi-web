"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import AddToQueueButton from "./AddToQueueButton";

interface Props {
  post: {
    id: string;
    title: string;
    series: string;
    episode: string | null;
    voice: string | null;
    word_count: number | null;
    audio_url: string | null;
  };
  color: string;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ListenView({ post, color }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const hasAudio = !!post.audio_url;

  // Initialize audio element
  useEffect(() => {
    if (!post.audio_url) return;
    const audio = new Audio(post.audio_url);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () =>
      setDuration(audio.duration)
    );
    audio.addEventListener("timeupdate", () =>
      setCurrentTime(audio.currentTime)
    );
    audio.addEventListener("ended", () => setPlaying(false));

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [post.audio_url]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  const seek = useCallback((pct: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
  }, []);

  const skip = useCallback(
    (sec: number) => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(audioRef.current.duration, audioRef.current.currentTime + sec)
      );
    },
    []
  );

  const cycleSpeed = useCallback(() => {
    const speeds = [1, 1.25, 1.5, 1.75, 2, 0.75];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }, [speed]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const estimatedMin = post.word_count ? Math.ceil(post.word_count / 500) : null;

  return (
    <div className="flex flex-col items-center py-8">
      {/* Cover art */}
      <div
        className="w-64 h-64 md:w-72 md:h-72 rounded-2xl shadow-xl mb-10 flex items-end p-6"
        style={{ backgroundColor: color }}
      >
        <div>
          <p className="text-white/60 font-label text-xs font-bold uppercase tracking-widest mb-1">
            {post.series}
          </p>
          <h3 className="text-white text-xl font-headline leading-tight drop-shadow-md">
            {post.title}
          </h3>
        </div>
      </div>

      {/* Track info */}
      <div className="text-center mb-2 max-w-md">
        <h2 className="text-2xl font-headline text-primary mb-1">
          {post.title}
        </h2>
        <p className="text-on-surface-variant font-label text-sm">
          {post.series}
          {post.episode && ` · ${post.episode}`}
          {post.voice && ` · ${post.voice}`}
        </p>
      </div>

      {hasAudio ? (
        <>
          {/* Progress bar */}
          <div className="w-full max-w-md mt-8 mb-2">
            <div
              className="h-1.5 bg-surface-container-highest rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                seek(((e.clientX - rect.left) / rect.width) * 100);
              }}
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 font-label text-xs text-on-surface-variant">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-6 mt-4">
            {/* Speed */}
            <button
              onClick={cycleSpeed}
              className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center font-label text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              {speed}x
            </button>

            {/* Rewind 15s */}
            <button
              onClick={() => skip(-15)}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">
                replay_10
              </span>
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {playing ? "pause" : "play_arrow"}
              </span>
            </button>

            {/* Forward 30s */}
            <button
              onClick={() => skip(30)}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">
                forward_30
              </span>
            </button>

            {/* Queue */}
            <AddToQueueButton
              variant="icon"
              item={{
                id: post.id,
                title: post.title,
                series: post.series,
                voice: post.voice,
                audio_url: post.audio_url,
                word_count: post.word_count,
              }}
            />
          </div>
        </>
      ) : (
        /* No audio available */
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">
              pending
            </span>
          </div>
          <div className="text-center">
            <p className="text-on-surface-variant font-label text-sm font-semibold mb-1">
              音訊合成中
            </p>
            <p className="text-on-surface-variant/60 font-label text-xs">
              這一章的語音正在製作中，完成後會自動上線。
            </p>
            {estimatedMin && (
              <p className="text-on-surface-variant/60 font-label text-xs mt-1">
                文字版約 {estimatedMin} 分鐘閱讀 — 可切換至「閱讀」模式
              </p>
            )}
          </div>
          <AddToQueueButton
            item={{
              id: post.id,
              title: post.title,
              series: post.series,
              voice: post.voice,
              audio_url: post.audio_url,
              word_count: post.word_count,
            }}
          />
        </div>
      )}
    </div>
  );
}
