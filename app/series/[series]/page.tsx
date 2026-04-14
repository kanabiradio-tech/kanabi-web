export const dynamic = "force-dynamic";

import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/src/lib/supabase";
import { SERIES_META } from "@/src/lib/series-meta";
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
            <Link
              className="text-[#5c5957] hover:text-primary transition-colors font-label text-[0.75rem] font-medium tracking-tight uppercase no-underline"
              href="/playlist"
            >
              我的清單
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              search
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12 pb-32">
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
              連載小說
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
              {voice && (
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
                {posts?.length ?? 0} / {meta?.totalChapters ?? "?"} 章
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
            所有章節
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
