/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";

import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/src/lib/supabase";

export const metadata: Metadata = {
  title: "我的播放清單 - kanabi.live",
};

export default async function PlaylistPage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, series, voice, word_count")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Supabase playlist query error:", JSON.stringify(error, null, 2));
  }

  const totalWords = posts?.reduce((sum, p) => sum + (p.word_count ?? 0), 0) ?? 0;
  const estimatedMinutes = Math.ceil(totalWords / 500);

  return (
    <>
      {/* TopNavBar */}
      <header className="w-full top-0 sticky z-40 bg-surface transition-colors duration-300">
        <nav className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-serif italic text-primary">
            kanabi.live
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="text-[#5c5957] hover:text-primary transition-colors font-label text-[0.75rem] font-medium tracking-tight uppercase"
              href="/"
            >
              首頁
            </Link>
            <a
              className="text-[#5c5957] hover:text-primary transition-colors font-label text-[0.75rem] font-medium tracking-tight uppercase"
              href="#"
            >
              探索
            </a>
            <a
              className="text-primary border-b-2 border-primary-container pb-1 font-label text-[0.75rem] font-medium tracking-tight uppercase"
              href="#"
            >
              我的清單
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <span className="material-symbols-outlined text-on-surface-variant">
                search
              </span>
            </div>
            <img
              alt="使用者大頭照"
              className="w-8 h-8 rounded-full border border-outline-variant/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLxILvH6XULKWC2uccNJkiHkBI2L2PlCiFQnj7r7JmwpZl56pcVCHt_Ky2IjGSaJlkzHKQXLjLKrIYUTU1m_aeB6k_FG-6qJEE2jsQ-hnTB_YPSh2ICJR_I9Ov6H4Y8ev3B-yAhu1xUCefbCqGkCNMGBYnR4wbM3w8YDQrugkA3fQcRXTI_llAO3txOOPgSe8dn0iut-HJXyhzAeAmoO3cF8oFTH7JWUFjJ3gEYvpKIdy07TsnJszT0h5qx4HwL0ooYan46SyiYKc"
            />
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <section className="mb-12">
          <span className="font-label text-[0.75rem] font-semibold tracking-widest text-primary uppercase mb-2 block">
            個人手札
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-6xl md:text-7xl font-headline text-primary mb-4 leading-tight">
                我的播放清單
              </h1>
              <p className="text-on-surface-variant text-lg max-w-xl font-body">
                你的每日晨讀，照你的順序播。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="bg-primary text-on-primary px-6 py-3 rounded-full font-label text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-md no-underline"
              >
                <span className="material-symbols-outlined text-lg">
                  play_arrow
                </span>
                繼續播放喜好清單
              </Link>
              <button className="bg-surface-container-high text-primary px-6 py-3 rounded-full font-label text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-highest transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                建立新清單
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Playlist Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-end border-b border-outline-variant pb-4 mb-8">
              <h2 className="text-3xl font-headline text-primary">
                當前播放列表
              </h2>
              <span className="font-label text-sm text-on-surface-variant font-medium">
                總計 {posts?.length ?? 0} 項目 &bull; 約 {estimatedMinutes} 分鐘
              </span>
            </div>

            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="group bg-surface-container-low p-6 rounded-lg flex gap-6 items-center transition-all hover:shadow-md border border-transparent hover:border-outline-variant/30"
                >
                  <div className="flex flex-col gap-2">
                    <button
                      className="cursor-grab active:cursor-grabbing text-outline-variant hover:text-primary transition-colors"
                      title="重新排序"
                    >
                      <span className="material-symbols-outlined">
                        drag_indicator
                      </span>
                    </button>
                    <button
                      className="text-outline-variant hover:text-error transition-colors"
                      title="移除"
                    >
                      <span className="material-symbols-outlined text-lg">
                        remove_circle
                      </span>
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-label text-[10px] font-bold tracking-tighter uppercase text-primary-container bg-primary-fixed px-2 py-0.5 rounded-full">
                        {post.series}
                      </span>
                      <span className="font-label text-[11px] text-on-surface-variant">
                        &bull; {post.word_count?.toLocaleString()} 字
                      </span>
                    </div>
                    <h3 className="text-2xl font-headline text-on-surface mb-1">
                      {post.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm">
                      聲線：{post.voice}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-on-surface-variant py-12 text-center">
                目前沒有已發佈的文章。
              </p>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Stats Bento */}
              <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container rounded-full opacity-30" />
                <h3 className="font-label text-[10px] font-bold uppercase tracking-widest text-primary-fixed mb-4 relative z-10">
                  播放統計
                </h3>
                <div className="space-y-4 relative z-10">
                  <p className="font-headline text-lg italic leading-snug">
                    「共 {posts?.length ?? 0} 篇・{totalWords.toLocaleString()} 字・約 {estimatedMinutes} 分鐘」
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-surface-container-low mt-24 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="font-serif text-lg text-primary-container">
            kanabi.live
          </div>
          <div className="flex gap-8">
            <a
              className="text-[#5c5957] hover:text-primary transition-all font-label text-xs"
              href="#"
            >
              隱私政策
            </a>
            <a
              className="text-[#5c5957] hover:text-primary transition-all font-label text-xs"
              href="#"
            >
              使用條款
            </a>
            <a
              className="text-[#5c5957] hover:text-primary transition-all font-label text-xs"
              href="#"
            >
              編輯方針
            </a>
          </div>
          <p className="text-[#5c5957] font-label text-xs italic">
            © 2026 Kelu AI 內容工廠
          </p>
        </div>
      </footer>

      {/* Bottom Player Control Bar */}
      <nav className="fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-6 pb-safe bg-surface/80 backdrop-blur-md z-50 border-t border-outline-variant/30">
        <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
          <span className="material-symbols-outlined">slow_motion_video</span>
          <span className="font-label text-[10px] font-semibold">倍速</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
          <span className="material-symbols-outlined">replay_10</span>
          <span className="font-label text-[10px] font-semibold">後退</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary scale-125">
          <span
            className="material-symbols-outlined text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_circle
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
          <span className="material-symbols-outlined">forward_30</span>
          <span className="font-label text-[10px] font-semibold">前進</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined">queue_music</span>
          <span className="font-label text-[10px] font-semibold">
            播放隊列
          </span>
        </button>
      </nav>
    </>
  );
}
