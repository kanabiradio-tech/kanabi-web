"use client";

import { useState, useEffect } from "react";
import { SERIES_META } from "@/src/lib/series-meta";
import ListenView from "./ListenView";
import AddToQueueButton from "./AddToQueueButton";

interface PostContentProps {
  post: {
    id: string;
    title: string;
    content: string | null;
    series: string;
    episode: string | null;
    voice: string | null;
    word_count: number | null;
    audio_url: string | null;
  };
}

export default function PostContent({ post }: PostContentProps) {
  const [mode, setMode] = useState<"read" | "listen">("read");

  // Auto-switch to listen mode if URL has #listen
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#listen") {
      setMode("listen");
    }
  }, []);

  return (
    <>
      {/* Mode toggle — pill segmented control */}
      <div className="flex items-center justify-between mb-10">
        <div className="inline-flex bg-surface-container-highest rounded-full p-1">
          <button
            onClick={() => setMode("read")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-label text-sm font-semibold transition-all ${
              mode === "read"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-lg">menu_book</span>
            閱讀
          </button>
          <button
            onClick={() => setMode("listen")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-label text-sm font-semibold transition-all ${
              mode === "listen"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-lg">headphones</span>
            收聽
          </button>
        </div>

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

      {/* Content area */}
      {mode === "read" ? (
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
      ) : (
        <ListenView
          post={post}
          color={SERIES_META[post.series]?.color ?? "#333"}
        />
      )}
    </>
  );
}
