"use client";

import Link from "next/link";
import { useQueue } from "@/src/components/QueueProvider";
import { useCallback } from "react";

export default function PlaylistPage() {
  const {
    items,
    currentIndex,
    isPlaying,
    removeFromQueue,
    clearQueue,
    reorder,
    play,
    toggle,
  } = useQueue();

  const totalWords = items.reduce((sum, p) => sum + (p.word_count ?? 0), 0);
  const estimatedMinutes = Math.ceil(totalWords / 500);

  // Simple drag & drop via index swap
  const handleMoveUp = useCallback(
    (idx: number) => {
      if (idx > 0) reorder(idx, idx - 1);
    },
    [reorder]
  );

  const handleMoveDown = useCallback(
    (idx: number) => {
      if (idx < items.length - 1) reorder(idx, idx + 1);
    },
    [reorder, items.length]
  );

  return (
    <>
      {/* TopNavBar */}
      <header className="w-full top-0 sticky z-40 bg-surface transition-colors duration-300">
        <nav className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
          <Link
            href="/"
            className="text-2xl font-serif italic text-primary no-underline"
          >
            kanabi.live
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="text-[#5c5957] hover:text-primary transition-colors font-label text-[0.75rem] font-medium tracking-tight uppercase no-underline"
              href="/"
            >
              首頁
            </Link>
            <a
              className="text-primary border-b-2 border-primary-container pb-1 font-label text-[0.75rem] font-medium tracking-tight uppercase"
              href="#"
            >
              我的清單
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              search
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12 pb-32">
        {/* Header */}
        <section className="mb-12">
          <span className="font-label text-[0.75rem] font-semibold tracking-widest text-primary uppercase mb-2 block">
            個人手札
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-headline text-primary mb-4 leading-tight">
                我的播放清單
              </h1>
              <p className="text-on-surface-variant text-lg font-body">
                你的每日晨讀，照你的順序播。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {items.length > 0 && (
                <>
                  <button
                    onClick={() => play(0)}
                    className="bg-primary text-on-primary px-6 py-3 rounded-full font-label text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
                  >
                    <span className="material-symbols-outlined text-lg">
                      play_arrow
                    </span>
                    從頭播放
                  </button>
                  <button
                    onClick={clearQueue}
                    className="bg-surface-container-high text-on-surface-variant px-6 py-3 rounded-full font-label text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-highest transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete_sweep
                    </span>
                    清空
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Queue items */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex justify-between items-end border-b border-outline-variant pb-4 mb-6">
              <h2 className="text-2xl font-headline text-primary">
                播放列表
              </h2>
              <span className="font-label text-sm text-on-surface-variant font-medium">
                {items.length} 項目 · 約 {estimatedMinutes} 分鐘
              </span>
            </div>

            {items.length > 0 ? (
              items.map((item, idx) => {
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={item.id}
                    className={`group flex items-center gap-4 p-5 rounded-lg transition-all ${
                      isCurrent
                        ? "bg-primary-container/20 border border-primary/20"
                        : "bg-surface-container-low hover:bg-surface-container-high border border-transparent"
                    }`}
                  >
                    {/* Reorder controls */}
                    <div className="flex flex-col gap-1 flex-none">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        className="text-outline-variant hover:text-primary transition-colors disabled:opacity-30"
                        disabled={idx === 0}
                      >
                        <span className="material-symbols-outlined text-sm">
                          keyboard_arrow_up
                        </span>
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        className="text-outline-variant hover:text-primary transition-colors disabled:opacity-30"
                        disabled={idx === items.length - 1}
                      >
                        <span className="material-symbols-outlined text-sm">
                          keyboard_arrow_down
                        </span>
                      </button>
                    </div>

                    {/* Track number / playing indicator */}
                    <span className="flex-none w-8 text-center font-label text-sm text-on-surface-variant font-semibold">
                      {isCurrent && isPlaying ? (
                        <span className="material-symbols-outlined text-primary text-lg">
                          graphic_eq
                        </span>
                      ) : (
                        idx + 1
                      )}
                    </span>

                    {/* Info */}
                    <button
                      onClick={() => play(idx)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <h3
                        className={`text-lg font-headline mb-0.5 truncate ${
                          isCurrent ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm font-label truncate">
                        {item.series}
                        {item.voice && ` · ${item.voice}`}
                        {item.word_count &&
                          ` · ${item.word_count.toLocaleString()} 字`}
                      </p>
                    </button>

                    {/* Play + Remove */}
                    <div className="flex items-center gap-2 flex-none">
                      <button
                        onClick={() => {
                          if (isCurrent) toggle();
                          else play(idx);
                        }}
                        className="p-2 text-primary hover:bg-surface-container-highest rounded-full transition-all"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {isCurrent && isPlaying
                            ? "pause_circle"
                            : "play_circle"}
                        </span>
                      </button>
                      <button
                        onClick={() => removeFromQueue(item.id)}
                        className="p-2 text-outline-variant hover:text-error rounded-full transition-colors"
                        title="移除"
                      >
                        <span className="material-symbols-outlined text-lg">
                          close
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">
                  queue_music
                </span>
                <p className="text-on-surface-variant text-lg mb-2">
                  播放清單是空的
                </p>
                <p className="text-on-surface-variant text-sm mb-6">
                  到系列頁或文章頁點「加入播放清單」
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label text-sm font-semibold no-underline hover:opacity-90 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">
                    explore
                  </span>
                  探索小說
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container rounded-full opacity-30" />
                <h3 className="font-label text-[10px] font-bold uppercase tracking-widest text-primary-fixed mb-4 relative z-10">
                  播放統計
                </h3>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between font-label text-sm">
                    <span>項目</span>
                    <span className="font-semibold">{items.length} 篇</span>
                  </div>
                  <div className="flex justify-between font-label text-sm">
                    <span>總字數</span>
                    <span className="font-semibold">
                      {totalWords.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-label text-sm">
                    <span>預估時間</span>
                    <span className="font-semibold">
                      約 {estimatedMinutes} 分鐘
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-surface-container-low">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="font-serif text-lg text-primary-container">
            kanabi.live
          </div>
          <p className="text-[#5c5957] font-label text-xs italic">
            © 2026 Kelu AI 內容工廠
          </p>
        </div>
      </footer>
    </>
  );
}
