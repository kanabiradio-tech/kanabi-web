export const dynamic = "force-dynamic";

import Link from "next/link";
import SiteHeader from "@/src/components/SiteHeader";
import SiteFooter from "@/src/components/SiteFooter";
import { pageMetadata } from "@/src/lib/life";
export const metadata = pageMetadata("晨間閱讀", "Kanabi 晨讀、專欄與連載，留一點時間給閱讀。", "/reading");
import { supabase } from "@/src/lib/supabase";
import { SERIES_META } from "@/src/lib/series-meta";
import BookshelfCarousel from "@/src/components/BookshelfCarousel";

type HomePost = {
  id: string;
  title: string;
  series: string;
  episode: string | null;
  voice: string | null;
  word_count: number | null;
  published_at?: string | null;
};

const fallbackPosts: HomePost[] = [
  {
    id: "fallback-1",
    title: "晨曦將至，萬年已過",
    series: "每日新聞",
    episode: "NEWS-TODAY",
    voice: "陸沉淵",
    word_count: 1800,
  },
  {
    id: "fallback-2",
    title: "外國人才發現，台灣人早就知道",
    series: "荒唐新聞",
    episode: "ODD-TODAY",
    voice: "林宗佑",
    word_count: 1600,
  },
  {
    id: "fallback-3",
    title: "燼光 CINERIS",
    series: "燼光 CINERIS",
    episode: "S01E01",
    voice: "陸沉淵",
    word_count: 3200,
  },
];

const columnSeries = new Set(["每日新聞", "荒唐新聞", "台灣歷史", "語言觀察"]);

function readingMinutes(post: Pick<HomePost, "word_count">): number {
  return Math.max(1, Math.ceil((post.word_count ?? 500) / 500));
}

function uniquePosts(posts: HomePost[]): HomePost[] {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.id)) return false;
    seen.add(post.id);
    return true;
  });
}

function pickTodayPackage(posts: HomePost[]): HomePost[] {
  const daily = posts.find((post) => post.series === "每日新聞");
  const odd = posts.find((post) => post.series === "荒唐新聞");
  const novel = posts.find((post) => !columnSeries.has(post.series));
  const seeds = [daily, odd, novel].filter(Boolean) as HomePost[];
  return uniquePosts([...seeds, ...posts]).slice(0, 3);
}

function displayTitle(post: HomePost): string {
  return post.title
    .replace(/^每日新聞\s+\d{4}-\d{2}-\d{2}[　\s]*/, "")
    .replace(/^荒唐新聞\s+\d{4}-\d{2}-\d{2}[　\s]*/, "");
}

function mobileTitleChunks(post: HomePost): string[] {
  const title = displayTitle(post);
  if (title.length <= 10) return [title];

  const chunks: string[] = [];
  for (let i = 0; i < title.length; i += 9) {
    chunks.push(title.slice(i, i + 9));
  }
  return chunks;
}

export default async function HomePage() {
  let recentPosts: HomePost[] = fallbackPosts;

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, series, episode, voice, word_count, published_at")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(24);

    if (error) {
      console.error(
        "Supabase query error:",
        JSON.stringify(
          {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          },
          null,
          2
        )
      );
    } else if (data && data.length > 0) {
      recentPosts = data;
    }
  } catch (err) {
    console.error(
      "Supabase fetch failed:",
      err instanceof Error
        ? JSON.stringify({ message: err.message, stack: err.stack }, null, 2)
        : err
    );
  }

  const todayPackage = pickTodayPackage(recentPosts);
  const mainPost = todayPackage[0] ?? recentPosts[0];
  const sidePosts = todayPackage.slice(1);
  const totalMinutes = todayPackage.reduce((sum, post) => sum + readingMinutes(post), 0);
  const today = new Date().toLocaleDateString("zh-TW", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  let seriesShelf: {
    series: string;
    voice: string | null;
    latest_episode: string | null;
    count: number;
  }[] = [];

  try {
    const { data: allPosts } = await supabase
      .from("posts")
      .select("series, voice, episode")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("episode", { ascending: false });

    if (allPosts) {
      const seriesMap = new Map<
        string,
        { voice: string | null; latest_episode: string | null; count: number }
      >();
      for (const post of allPosts) {
        if (!seriesMap.has(post.series)) {
          seriesMap.set(post.series, {
            voice: post.voice,
            latest_episode: post.episode,
            count: 1,
          });
        } else {
          seriesMap.get(post.series)!.count++;
        }
      }
      seriesShelf = Array.from(seriesMap.entries()).map(([series, info]) => ({
        series,
        ...info,
      }));
    }
  } catch {}

  const novelShelf = seriesShelf.filter((item) => !columnSeries.has(item.series));
  const columnShelf = seriesShelf.filter((item) => columnSeries.has(item.series));

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[2px] z-[100]">
        <div className="reading-progress h-full w-1/3" />
      </div>

      <SiteHeader active="reading" />

      <main id="main-content" className="max-w-screen-2xl mx-auto pb-32 overflow-x-hidden">
        <section className="px-8 pt-10 md:pt-16 pb-16">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch min-w-0">
            <div className="xl:col-span-5 flex flex-col justify-between min-h-[520px] py-4 min-w-0">
              <div>
                <p className="font-label text-[0.75rem] uppercase font-semibold tracking-[0.2em] text-on-primary-fixed-variant mb-5">
                  {today}｜清晨 5 點
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline text-primary leading-tight mb-7 max-w-full">
                  <span className="block">今天的 15 分鐘，</span>
                  <span className="block">先交給這三篇。</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl font-serif text-on-surface-variant leading-relaxed max-w-2xl">
                  <span className="block">台灣人每天早上必看的內容網站。</span>
                  <span className="block">不是新聞播報腔，</span>
                  <span className="block">是一份能帶進早餐店、捷運和辦公桌的晨讀。</span>
                </p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {mainPost && !mainPost.id.startsWith("fallback") ? (
                  <Link
                    href={`/posts/${mainPost.id}`}
                    className="inline-flex items-center gap-2 bg-primary text-on-primary px-7 py-3.5 rounded-full font-label font-semibold text-sm no-underline hover:opacity-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">wb_twilight</span>
                    開始今天
                  </Link>
                ) : (
                  <Link
                    href="/series"
                    className="inline-flex items-center gap-2 bg-primary text-on-primary px-7 py-3.5 rounded-full font-label font-semibold text-sm no-underline hover:opacity-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">wb_twilight</span>
                    開始今天
                  </Link>
                )}
                <span className="font-label text-sm text-on-surface-variant">
                  約 {totalMinutes} 分鐘｜{todayPackage.length} 篇
                </span>
              </div>
            </div>

            <div className="xl:col-span-7 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {mainPost && (
                  <article
                    className="md:col-span-2 rounded-lg p-7 md:p-9 min-h-[300px] flex flex-col justify-between min-w-0"
                    style={{
                      backgroundColor: SERIES_META[mainPost.series]?.color ?? "#012d1d",
                    }}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <Link
                          href={`/series/${encodeURIComponent(mainPost.series)}`}
                          className="font-label text-[10px] font-bold uppercase tracking-widest bg-white/15 text-white px-2.5 py-1 rounded no-underline hover:bg-white/20 transition-colors"
                        >
                          {mainPost.series}
                        </Link>
                        {mainPost.episode && (
                          <span className="font-label text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/80 px-2.5 py-1 rounded">
                            {mainPost.episode}
                          </span>
                        )}
                      </div>
                      <Link
                        href={
                          mainPost.id.startsWith("fallback")
                            ? "/series"
                            : `/posts/${mainPost.id}`
                        }
                        className="no-underline"
                      >
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-headline text-white leading-tight mb-5 hover:underline decoration-white/30 underline-offset-4 break-all">
                          {mobileTitleChunks(mainPost).map((chunk, idx) => (
                            <span key={`${chunk}-${idx}`} className="block sm:inline">
                              {chunk}
                            </span>
                          ))}
                        </h2>
                      </Link>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 text-white/80 font-label text-sm">
                      <span>
                        {mainPost.word_count?.toLocaleString()} 字｜約{" "}
                        {readingMinutes(mainPost)} 分鐘
                      </span>
                      {!mainPost.id.startsWith("fallback") && (
                        <Link
                          href={`/posts/${mainPost.id}`}
                          className="inline-flex items-center gap-1.5 bg-white text-primary px-4 py-2 rounded-full font-label text-xs font-semibold no-underline hover:opacity-90 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">menu_book</span>
                          閱讀
                        </Link>
                      )}
                    </div>
                  </article>
                )}

                {sidePosts.map((post, idx) => (
                  <article
                    key={`${post.id}-${idx}`}
                    className="bg-surface-container-low rounded-lg p-6 min-h-[220px] flex flex-col justify-between hover:bg-surface-container-high transition-colors min-w-0"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Link
                          href={`/series/${encodeURIComponent(post.series)}`}
                          className="font-label text-[10px] font-bold uppercase tracking-widest text-on-primary-fixed-variant no-underline hover:text-primary transition-colors"
                        >
                          {post.series}
                        </Link>
                        {post.episode && (
                          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            {post.episode}
                          </span>
                        )}
                      </div>
                      <Link
                        href={post.id.startsWith("fallback") ? "/series" : `/posts/${post.id}`}
                        className="no-underline"
                      >
                        <h3 className="text-xl sm:text-2xl font-headline text-primary leading-snug mb-4 hover:underline decoration-primary/30 underline-offset-4 break-all">
                          {displayTitle(post)}
                        </h3>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs text-on-surface-variant font-label">
                      <span>
                        {post.word_count?.toLocaleString()} 字｜約 {readingMinutes(post)} 分鐘
                      </span>
                      {!post.id.startsWith("fallback") && (
                        <Link
                          href={`/posts/${post.id}`}
                          className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-3.5 py-1.5 rounded-full font-label text-xs font-semibold no-underline hover:opacity-90 transition-all"
                        >
                          閱讀
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {columnShelf.length > 0 && (
          <section className="px-8 mb-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-headline text-primary mb-2">
                  晨間專欄
                </h2>
                <p className="text-on-surface-variant font-serif">
                  萬年視角、荒唐新聞、語言觀察，先把今天看清楚一點。
                </p>
              </div>
              <Link
                className="font-label text-xs font-bold text-primary border-b border-primary/20 hover:border-primary pb-1 transition-all no-underline"
                href="/series"
              >
                所有內容
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {columnShelf.map((item) => {
                const meta = SERIES_META[item.series];
                return (
                  <Link
                    key={`column-${item.series}`}
                    href={`/series/${encodeURIComponent(item.series)}`}
                    className="group bg-surface-container-low rounded-lg p-6 no-underline hover:bg-surface-container-high transition-colors"
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full mb-5"
                      style={{ backgroundColor: meta?.color ?? "#012d1d" }}
                    />
                    <h3 className="text-2xl font-headline text-primary mb-3 group-hover:underline decoration-primary/30 underline-offset-4">
                      {item.series}
                    </h3>
                    <p className="text-on-surface-variant font-serif text-sm leading-relaxed mb-5">
                      {meta?.desc}
                    </p>
                    <span className="font-label text-xs text-on-surface-variant">
                      {item.count} 篇｜最新 {item.latest_episode}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="bg-surface-container-low py-20 mb-24">
          <div className="px-8 max-w-screen-2xl mx-auto mb-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div>
                <h2 className="text-3xl font-headline text-primary mb-2">
                  連載書架
                </h2>
                <p className="text-on-surface-variant font-serif">
                  六條活躍連載，今日讀完，晚上還會惦記。
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {novelShelf.map((item) => (
                  <Link
                    key={`pill-${item.series}`}
                    href={`/series/${encodeURIComponent(item.series)}`}
                    className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface-variant font-label text-xs font-semibold no-underline hover:bg-primary hover:text-on-primary transition-all"
                  >
                    {item.series}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <BookshelfCarousel seriesShelf={novelShelf} seriesMeta={SERIES_META} />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
