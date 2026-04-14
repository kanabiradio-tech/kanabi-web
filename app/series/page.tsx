export const dynamic = "force-dynamic";

import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/src/lib/supabase";
import { SERIES_META } from "@/src/lib/series-meta";

export const metadata: Metadata = {
  title: "所有故事 - kanabi.live",
};

export default async function AllSeriesPage() {
  const { data: allPosts } = await supabase
    .from("posts")
    .select("series, voice, episode, word_count")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("episode", { ascending: false });

  const seriesMap = new Map<
    string,
    { voice: string | null; latest_episode: string | null; count: number; totalWords: number }
  >();

  if (allPosts) {
    for (const p of allPosts) {
      if (!seriesMap.has(p.series)) {
        seriesMap.set(p.series, {
          voice: p.voice,
          latest_episode: p.episode,
          count: 1,
          totalWords: p.word_count ?? 0,
        });
      } else {
        const existing = seriesMap.get(p.series)!;
        existing.count++;
        existing.totalWords += p.word_count ?? 0;
      }
    }
  }

  const seriesList = Array.from(seriesMap.entries()).map(([series, info]) => ({
    series,
    ...info,
  }));

  return (
    <>
      {/* Nav */}
      <header className="w-full top-0 sticky z-40 bg-surface transition-colors duration-300">
        <nav className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
          <Link href="/" className="text-2xl font-serif italic text-primary no-underline">
            kanabi.live
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="text-[#5c5957] hover:text-primary transition-colors font-label text-[0.75rem] font-medium tracking-tight uppercase no-underline"
              href="/"
            >
              首頁
            </Link>
            <span className="text-primary font-label text-[0.75rem] font-medium tracking-tight uppercase border-b-2 border-primary-container pb-1">
              所有故事
            </span>
            <Link
              className="text-[#5c5957] hover:text-primary transition-colors font-label text-[0.75rem] font-medium tracking-tight uppercase no-underline"
              href="/playlist"
            >
              我的清單
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12 pb-32">
        <h1 className="text-4xl md:text-5xl font-headline text-primary mb-4">
          所有故事
        </h1>
        <p className="text-on-surface-variant font-serif text-lg mb-12">
          六條連載線，同一座台北，不同的深夜。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seriesList.map((s) => {
            const meta = SERIES_META[s.series];
            return (
              <Link
                key={s.series}
                href={`/series/${encodeURIComponent(s.series)}`}
                className="group no-underline"
              >
                <div
                  className="aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:-translate-y-2 transition-transform duration-300 relative mb-4"
                  style={{ backgroundColor: meta?.color ?? "#333" }}
                >
                  {meta?.cover ? (
                    <img
                      src={meta.cover}
                      alt={s.series}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-end p-6">
                      <span className="text-2xl font-headline text-white drop-shadow-md leading-tight">
                        {s.series}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-headline text-primary mb-1 group-hover:underline decoration-primary/30 underline-offset-4">
                  {s.series}
                </h3>
                {meta && (
                  <p className="text-on-surface-variant text-sm font-serif mb-2 line-clamp-2">
                    {meta.desc}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-on-surface-variant text-xs font-label">
                  {s.voice && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">mic</span>
                      {s.voice}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">menu_book</span>
                    {s.count} / {meta?.totalChapters ?? "?"} 章
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">article</span>
                    {s.totalWords.toLocaleString()} 字
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="w-full py-12 px-8 bg-surface-container-low">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="font-serif text-lg text-primary-container">kanabi.live</div>
          <p className="text-[#5c5957] font-label text-xs italic">© 2026 Kelu AI 內容工廠</p>
        </div>
      </footer>
    </>
  );
}
