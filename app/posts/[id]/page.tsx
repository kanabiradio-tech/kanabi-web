export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/src/lib/supabase";

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

  return {
    title: data ? `${data.title} - kanabi.live` : "文章不存在",
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, content, series, episode, voice, word_count, published_at, created_at")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

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
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-label text-sm mb-8 no-underline"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          返回首頁
        </Link>

        {/* Article header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="font-label text-[10px] font-bold uppercase tracking-widest bg-primary-container text-on-primary px-2 py-1 rounded">
              {post.series}
            </span>
            {post.episode && (
              <span className="font-label text-[10px] font-bold uppercase tracking-widest bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded">
                {post.episode}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-headline text-primary leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-sm font-label">
            {post.voice && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">mic</span>
                {post.voice}
              </span>
            )}
            {post.word_count && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">article</span>
                {post.word_count.toLocaleString()} 字
              </span>
            )}
            {estimatedMinutes && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">schedule</span>
                約 {estimatedMinutes} 分鐘
              </span>
            )}
            {formattedDate && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                {formattedDate}
              </span>
            )}
          </div>
        </header>

        {/* Article content */}
        <article className="font-serif text-on-surface text-lg leading-relaxed space-y-6">
          {post.content ? (
            post.content.split("\n").map((paragraph: string, i: number) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("# ")) return null;
              if (trimmed === "---") {
                return (
                  <div
                    key={i}
                    className="my-10 flex justify-center gap-2 text-outline-variant"
                  >
                    <span>*</span>
                    <span>*</span>
                    <span>*</span>
                  </div>
                );
              }
              return (
                <p key={i} className="text-justify">
                  {trimmed}
                </p>
              );
            })
          ) : (
            <p className="text-on-surface-variant italic">此文章尚無內容。</p>
          )}
        </article>

        {/* Bottom navigation */}
        <div className="mt-16 pt-8 border-t border-outline-variant/30 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-primary hover:underline font-label text-sm no-underline"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            返回首頁
          </Link>
          <Link
            href="/playlist"
            className="inline-flex items-center gap-1 text-primary hover:underline font-label text-sm no-underline"
          >
            我的清單
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
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
