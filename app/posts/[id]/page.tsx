export const dynamic = "force-dynamic";

import Link from "next/link";
import SiteHeader from "@/src/components/SiteHeader";
import SiteFooter from "@/src/components/SiteFooter";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/src/lib/supabase";
import { SERIES_META } from "@/src/lib/series-meta";
import { ENABLE_AUDIO_FEATURES } from "@/src/lib/features";
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
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
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
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .single();

  if (error || !post) notFound();

  // Block access to scheduled (future) posts
  if (post.published_at && new Date(post.published_at) > new Date()) notFound();

  // Fetch all episodes in this series for prev/next navigation
  const { data: siblings } = await supabase
    .from("posts")
    .select("id, title, episode")
    .eq("series", post.series)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
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
  const isColumn = SERIES_META[post.series]?.kind === "column";

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
      <SiteHeader active="stories" />

      <main id="main-content" className="max-w-3xl mx-auto px-8 py-12 pb-32">
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
                第 {chapterNum} / {totalChapters} {isColumn ? "篇" : "章"}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-headline text-primary leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-sm font-label">
            {ENABLE_AUDIO_FEATURES && post.voice && (
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
                {isColumn ? "上一篇" : "上一章"}
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
                {isColumn ? "下一篇" : "下一章"}
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
      <SiteFooter />
    </>
  );
}
