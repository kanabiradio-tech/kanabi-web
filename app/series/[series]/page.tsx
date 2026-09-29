export const dynamic = "force-dynamic";

import Link from "next/link";
import SiteHeader from "@/src/components/SiteHeader";
import SiteFooter from "@/src/components/SiteFooter";
import type { Metadata } from "next";
import { supabase } from "@/src/lib/supabase";
import { SERIES_META } from "@/src/lib/series-meta";
import { ENABLE_AUDIO_FEATURES } from "@/src/lib/features";
import AddToQueueButton from "@/src/components/AddToQueueButton";

interface SeriesPageProps {
  params: Promise<{ series: string }>;
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { series } = await params;
  const name = decodeURIComponent(series);
  return { title: `${name} - kanabi.live` };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { series } = await params;
  const seriesName = decodeURIComponent(series);

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, series, episode, voice, word_count, audio_url")
    .eq("series", seriesName)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("episode", { ascending: true });

  const meta = SERIES_META[seriesName];
  const voice = posts?.[0]?.voice ?? null;
  const totalWords =
    posts?.reduce((sum, p) => sum + (p.word_count ?? 0), 0) ?? 0;
  const isColumn = meta?.kind === "column";

  return (
    <>
      {/* TopNavBar */}
      <SiteHeader active="stories" />

      <main id="main-content" className="max-w-5xl mx-auto px-8 py-12 pb-32">
        {/* Series header */}
        <div className="flex flex-col md:flex-row gap-10 mb-16">
          {/* Cover */}
          <div
            className="flex-none w-48 md:w-56 aspect-[2/3] rounded-xl shadow-lg overflow-hidden relative"
            style={{ backgroundColor: meta?.color ?? "#333" }}
          >
            {meta?.cover ? (
              <img
                src={meta.cover}
                alt={seriesName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-end p-6">
                <h2 className="text-2xl font-headline text-white leading-tight drop-shadow-md">
                  {seriesName}
                </h2>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-end">
            <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              {isColumn ? "內容專欄" : "連載小說"}
            </span>
            <h1 className="text-4xl md:text-5xl font-headline text-primary leading-tight mb-4">
              {seriesName}
            </h1>
            {meta && (
              <p className="text-on-surface-variant font-serif text-lg mb-6 max-w-2xl">
                {meta.desc}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-sm font-label mb-6">
              {ENABLE_AUDIO_FEATURES && voice && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    mic
                  </span>
                  {voice}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  menu_book
                </span>
                {posts?.length ?? 0} / {meta?.totalChapters ?? "?"}{" "}
                {isColumn ? "篇" : "章"}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  article
                </span>
                {totalWords.toLocaleString()} 字
              </span>
            </div>
          </div>
        </div>

        {/* Chapter list */}
        <section>
          <h2 className="text-2xl font-headline text-primary mb-8">
            {isColumn ? "所有文章" : "所有章節"}
          </h2>
          <div className="space-y-3">
            {posts && posts.length > 0 ? (
              posts.map((post, idx) => (
                <div
                  key={post.id}
                  className="group flex items-center gap-4 bg-surface-container-low rounded-lg p-5 hover:bg-surface-container-high transition-colors"
                >
                  {/* Episode number */}
                  <span className="flex-none w-8 text-center font-label text-sm text-on-surface-variant font-semibold">
                    {idx + 1}
                  </span>

                  {/* Title & meta */}
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex-1 min-w-0 no-underline"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {post.episode && (
                        <span className="font-label text-[10px] font-bold text-on-surface-variant tracking-wide">
                          {post.episode}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-headline text-on-surface group-hover:text-primary transition-colors truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant font-label">
                      {post.word_count && (
                        <span>{post.word_count.toLocaleString()} 字</span>
                      )}
                      {post.word_count && (
                        <span>
                          約 {Math.ceil(post.word_count / 500)} 分鐘
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-none">
                    <Link
                      href={`/posts/${post.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label text-xs font-semibold no-underline hover:opacity-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">menu_book</span>
                      閱讀
                    </Link>
                    {ENABLE_AUDIO_FEATURES && (
                      <>
                        <Link
                          href={`/posts/${post.id}#listen`}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-label text-xs font-semibold no-underline transition-all ${
                            post.audio_url
                              ? "bg-surface-container-highest text-primary hover:bg-surface-container-high"
                              : "bg-surface-container-highest text-on-surface-variant/50 cursor-default"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">headphones</span>
                          {post.audio_url ? "收聽" : "合成中"}
                        </Link>
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
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-on-surface-variant py-12 text-center">
                此系列尚無已發佈的章節。
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </>
  );
}
