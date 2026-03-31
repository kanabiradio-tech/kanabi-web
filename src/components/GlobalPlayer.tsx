"use client";

import Link from "next/link";
import { useQueue } from "./QueueProvider";

export default function GlobalPlayer() {
  const { currentTrack, isPlaying, progress, toggle, next, prev, seekTo, items } =
    useQueue();

  if (!currentTrack && items.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      {/* Progress bar */}
      <div
        className="h-[2px] bg-outline-variant/20 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((e.clientX - rect.left) / rect.width) * 100;
          seekTo(pct);
        }}
      >
        <div
          className="h-full bg-primary transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-4 px-6 py-3 max-w-screen-2xl mx-auto">
        {/* Track info */}
        <div className="flex-1 min-w-0">
          {currentTrack ? (
            <Link href={`/posts/${currentTrack.id}`} className="no-underline block">
              <p className="text-sm font-headline text-primary truncate">
                {currentTrack.title}
              </p>
              <p className="text-xs text-on-surface-variant font-label truncate">
                {currentTrack.series}
                {currentTrack.voice && ` · ${currentTrack.voice}`}
              </p>
            </Link>
          ) : (
            <p className="text-sm text-on-surface-variant font-label">
              尚未選取播放項目
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl">skip_previous</span>
          </button>
          <button
            onClick={toggle}
            className="p-2 text-primary"
          >
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? "pause_circle" : "play_circle"}
            </span>
          </button>
          <button
            onClick={next}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl">skip_next</span>
          </button>
        </div>

        {/* Queue link */}
        <Link
          href="/playlist"
          className="hidden sm:flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors p-2 no-underline"
        >
          <span className="material-symbols-outlined text-xl">queue_music</span>
          <span className="font-label text-xs">{items.length}</span>
        </Link>
      </div>
    </nav>
  );
}
