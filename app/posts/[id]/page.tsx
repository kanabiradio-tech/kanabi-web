export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/src/lib/supabase";
import { SERIES_META } from "@/src/lib/series-meta";
import PostContent from "@/src/components/PostContent";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase
    .from("posts")
    .select("title, series")
    .eq("id", id)
    .single();
  return { title: data ? `${data.title} - kanabi.live` : "文章不存在" };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "id, title, content, series, episode, voice, word_count, audio_url, published_at, created_at"
    )
    .eq("id", id)
    .single();

  if (error || !post) notFound();

  // Fetch all episodes in this series for prev/next navigation
  const { data: siblings } = await supabase
    .from("posts")
    .select("id, title, episode")
    .eq("series", post.series)
    .eq("status", "published")
    .order("episode", { ascending: true });

  const currentIdx = siblings?.findIndex((s) => s.id === post.id) ?? -1;
  const prevPost = currentIdx > 0 ? siblings![currentIdx - 1] : null;
  const nextPost =
    siblings && currentIdx < siblings.length - 1
      ? siblings[currentIdx + 1]
      : null;
  const totalChapters =
    SERIES_META[post.series]?.totalChapters ?? siblings?.length ?? 0;
  const chapterNum = currentIdx >= 0 ? currentIdx + 1 : null;

  const publishDate = post.published_at ?? post.created_at;
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const estimatedMinutes = post.word_count
    ? Math.ceil(post.word_count / 500)
    : null;

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

      <main className="max-w-3xl mx-auto px-8 py-12 pb-32">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-on-surface-variant font-label text-sm mb-8">
          <Link
            href="/"
            className="hover:text-primary transition-colors no-underline"
          >
            首頁
          </Link>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <Link
            href={`/series/${encodeURIComponent(post.series)}`}
            className="hover:text-primary transition-colors no-underline"
          >
            {post.series}
          </Link>
          {post.episode && (
            <>
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
              <span className="text-on-surface">{post.episode}</span>
            </>
          )}
        </div>

        {/* Article header */}
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href={`/series/${encodeURIComponent(post.series)}`}
              className="font-label text-[10px] font-bold uppercase tracking-widest bg-primary-container text-on-primary px-2 py-1 rounded no-underline hover:opacity-80 transition-opacity"
            >
              {post.series}
            </Link>
            {post.episode && (
              <span className="font-label text-[10px] font-bold uppercase tracking-widest bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded">
                {post.episode}
              </span>
            )}
            {chapterNum && (
              <span className="font-label text-xs text-on-surface-variant">
                第 {chapterNum} / {totalChapters} 章
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-headline text-primary leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-sm font-label">
            {post.voice && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  mic
                </span>
                {post.voice}
              </span>
            )}
            {post.word_count && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  article
                </span>
                {post.word_count.toLocaleString()} 字
              </span>
            )}
            {estimatedMinutes && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  schedule
                </span>
                約 {estimatedMinutes} 分鐘
              </span>
            )}
            {formattedDate && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  calendar_today
                </span>
                {formattedDate}
              </span>
            )}
          </div>
        </header>

        {/* Mode toggle + content (client component) */}
        <PostContent post={post} />

        {/* Prev / Next navigation */}
        <div className="mt-16 pt-8 border-t border-outline-variant/30 grid grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              href={`/posts/${prevPost.id}`}
              className="group p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors no-underline"
            >
              <span className="font-label text-xs text-on-surface-variant flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                上一章
              </span>
              <p className="font-headline text-primary text-sm group-hover:underline">
                {prevPost.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              href={`/posts/${nextPost.id}`}
              className="group p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors text-right no-underline"
            >
              <span className="font-label text-xs text-on-surface-variant flex items-center justify-end gap-1 mb-1">
                下一章
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </span>
              <p className="font-headline text-primary text-sm group-hover:underline">
                {nextPost.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
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
