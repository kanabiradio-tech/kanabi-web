"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface SeriesItem {
  series: string;
  voice: string | null;
  latest_episode: string | null;
  count: number;
}

interface SeriesMeta {
  color: string;
  desc: string;
  totalChapters: number;
  cover: string;
}

export default function BookshelfCarousel({
  seriesShelf,
  seriesMeta,
}: {
  seriesShelf: SeriesItem[];
  seriesMeta: Record<string, SeriesMeta>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseRef = useRef(false);

  const CARD_WIDTH = 256 + 32; // w-64 + gap-8

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scrollBy = useCallback(
    (direction: number) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollBy({ left: direction * CARD_WIDTH, behavior: "smooth" });
      setTimeout(updateButtons, 400);
    },
    [updateButtons]
  );

  // Auto-scroll every 5 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (pauseRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      // If at the end, scroll back to start
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
      }
      setTimeout(updateButtons, 400);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [updateButtons]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    pauseRef.current = true;
  };
  const handleMouseLeave = () => {
    pauseRef.current = false;
  };

  // Update buttons on scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    updateButtons();
    return () => el.removeEventListener("scroll", updateButtons);
  }, [updateButtons]);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-0 bottom-0 w-16 z-10 flex items-center justify-center bg-gradient-to-r from-surface-container-low/90 to-transparent hover:from-surface-container-low transition-all"
          aria-label="往左滑"
        >
          <span className="material-symbols-outlined text-3xl text-primary/60 hover:text-primary transition-colors">
            chevron_left
          </span>
        </button>
      )}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-0 bottom-0 w-16 z-10 flex items-center justify-center bg-gradient-to-l from-surface-container-low/90 to-transparent hover:from-surface-container-low transition-all"
          aria-label="往右滑"
        >
          <span className="material-symbols-outlined text-3xl text-primary/60 hover:text-primary transition-colors">
            chevron_right
          </span>
        </button>
      )}

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex gap-8 px-8 overflow-x-auto pb-4 snap-x scroll-smooth scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {seriesShelf.map((s) => {
          const meta = seriesMeta[s.series];
          return (
            <Link
              key={s.series}
              href={`/series/${encodeURIComponent(s.series)}`}
              className="flex-none w-64 snap-start group no-underline"
            >
              <div
                className="aspect-[2/3] rounded-lg mb-4 shadow-sm group-hover:-translate-y-2 transition-transform duration-300 overflow-hidden relative"
                style={{ backgroundColor: meta?.color ?? "#333" }}
              >
                {meta?.cover ? (
                  <img
                    src={meta.cover}
                    alt={s.series}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-end p-5">
                    <span className="text-xl font-headline text-white drop-shadow-md leading-tight">
                      {s.series}
                    </span>
                  </div>
                )}
              </div>
              <h4 className="font-headline text-lg text-primary mb-1">
                {s.series}
              </h4>
              <p className="font-label text-xs text-on-surface-variant">
                {s.voice && (
                  <span className="font-semibold uppercase tracking-tighter">
                    {s.voice}
                  </span>
                )}
                {s.latest_episode && (
                  <span> · 最新 {s.latest_episode}</span>
                )}
                <span> · {s.count} 章</span>
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
