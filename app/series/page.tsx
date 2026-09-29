export const dynamic = "force-dynamic";

import Link from "next/link";
import SiteHeader from "@/src/components/SiteHeader";
import SiteFooter from "@/src/components/SiteFooter";
import type { Metadata } from "next";
import { supabase } from "@/src/lib/supabase";
import { SERIES_META } from "@/src/lib/series-meta";
import { ENABLE_AUDIO_FEATURES } from "@/src/lib/features";

export const metadata: Metadata = {
  title: "故事書架與專欄｜Kanabi", description: "Kanabi 原創小說連載與晨間專欄。", alternates: { canonical: "/series" },
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
      <SiteHeader active="stories" />

      <main id="main-content" className="max-w-5xl mx-auto px-8 py-12 pb-32">
        <h1 className="text-4xl md:text-5xl font-headline text-primary mb-4">
          故事書架與專欄
        </h1>
        <p className="text-on-surface-variant font-serif text-lg mb-12">
          讀一段故事，也看看世界。原有的小說連載與晨間專欄，都在這裡。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seriesList.map((s) => {
            const meta = SERIES_META[s.series];
            const isColumn = meta?.kind === "column";
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
                  {ENABLE_AUDIO_FEATURES && s.voice && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">mic</span>
                      {s.voice}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">menu_book</span>
                    {s.count} / {meta?.totalChapters ?? "?"}{" "}
                    {isColumn ? "篇" : "章"}
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

      <SiteFooter />
    </>
  );
}
