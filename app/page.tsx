export const dynamic = 'force-dynamic'

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { SERIES_META } from "@/src/lib/series-meta";

const fallbackPosts = [
  { id: "fallback-1", title: "燼光之城：黎明前的最後一夜", series: "燼光宇宙", episode: "S01E01", voice: "陸沉淵", word_count: 3200 },
  { id: "fallback-2", title: "台北地下鐵的幽靈列車", series: "暗黑宇宙", episode: "S01E01", voice: "簡瑞麒", word_count: 2800 },
  { id: "fallback-3", title: "許願便利商店：第四個願望", series: "燼光宇宙", episode: "S01E02", voice: "林宗佑", word_count: 4100 },
];

export default async function HomePage() {
  let latestPosts;
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, series, episode, voice, word_count")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Supabase query error:", JSON.stringify({ message: error.message, details: error.details, hint: error.hint, code: error.code }, null, 2));
      latestPosts = fallbackPosts;
    } else {
      console.log(`Supabase query OK: returned ${data?.length ?? 0} posts`);
      latestPosts = data;
    }
  } catch (err) {
    console.error("Supabase fetch failed:", err instanceof Error ? JSON.stringify({ message: err.message, stack: err.stack }, null, 2) : err);
    latestPosts = fallbackPosts;
  }

  // Fetch series bookshelf data
  let seriesShelf: { series: string; voice: string | null; latest_episode: string | null; count: number }[] = [];
  try {
    const { data: allPosts } = await supabase
      .from("posts")
      .select("series, voice, episode")
      .eq("status", "published")
      .order("episode", { ascending: false });

    if (allPosts) {
      const seriesMap = new Map<string, { voice: string | null; latest_episode: string | null; count: number }>();
      for (const p of allPosts) {
        if (!seriesMap.has(p.series)) {
          seriesMap.set(p.series, { voice: p.voice, latest_episode: p.episode, count: 1 });
        } else {
          seriesMap.get(p.series)!.count++;
        }
      }
      seriesShelf = Array.from(seriesMap.entries()).map(([series, info]) => ({ series, ...info }));
    }
  } catch {}

  return (
    <>
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[100]">
        <div className="reading-progress h-full w-1/3" />
      </div>

      {/* TopNavBar */}
      <header className="w-full top-0 sticky z-50 bg-surface-container-low transition-colors duration-300">
        <nav className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-serif italic text-primary">
            kanabi.live
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="font-label text-[0.75rem] uppercase font-medium tracking-tight text-primary border-b-2 border-primary-container pb-1"
              href="#"
            >
              首頁
            </a>
            <a
              className="font-label text-[0.75rem] uppercase font-medium tracking-tight text-[#5c5957] hover:text-primary transition-colors"
              href="#"
            >
              燼光宇宙
            </a>
            <a
              className="font-label text-[0.75rem] uppercase font-medium tracking-tight text-[#5c5957] hover:text-primary transition-colors"
              href="#"
            >
              暗黑宇宙
            </a>
            <Link
              className="font-label text-[0.75rem] uppercase font-medium tracking-tight text-[#5c5957] hover:text-primary transition-colors"
              href="/playlist"
            >
              我的清單
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <button className="material-symbols-outlined text-primary-container hover:bg-surface-variant/50 p-2 rounded-md transition-all">
              search
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
              <img
                alt="User Profile Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8XwZvxdig0qrdFJg0frNOA3Avv2H3ZYeMHU6NHFDdagL76VOqB5OVBTRQ3gE_RliVDHeMAf2vjKHrr7o82iqYO4u7fyB_1uJI1BNlAmJY_RfOMtTIB_T1dX0lxjrMtf0TJGMouIHOEgUvzBKOzi7VpiyQWzL5NNArGifX5Iw4KeYRowbqaQQACNGRsJkB3OT-N2m1Ss4-6xSOejECruDaqqNt1NWKgiT8x7Rsjc_A-8QjuMQU-fsiTUihaSYQjPujBZEwiG5uOT0"
              />
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-screen-2xl mx-auto pb-32">
        {/* Hero Section */}
        <section className="px-8 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-4xl">
            <p className="font-label text-[0.75rem] uppercase font-semibold tracking-[0.2em] text-on-primary-fixed-variant mb-6">
              晨曦將至，萬年已過。
            </p>
            <h1 className="text-5xl md:text-7xl font-headline text-primary leading-tight mb-8">
              早安。這是陸沉淵為你準備的今日清單，
              <span className="italic">更新於清晨 5 點。</span>
            </h1>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary-container text-on-primary px-8 py-4 rounded-full font-label font-semibold text-sm hover:scale-[0.98] transition-transform">
                開始閱讀
              </button>
              <button className="bg-surface-container-highest text-primary px-8 py-4 rounded-full font-label font-semibold text-sm hover:bg-surface-container-high transition-colors">
                查看排程
              </button>
            </div>
          </div>
        </section>

        {/* News of the Day (Bento Grid) */}
        <section className="px-8 mb-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-headline text-primary mb-2">
                今日精選
              </h2>
              <p className="text-on-surface-variant font-serif">
                為您精選今日必讀的全球觀點。
              </p>
            </div>
            <a
              className="font-label text-xs font-bold text-primary border-b border-primary/20 hover:border-primary pb-1 transition-all"
              href="#"
            >
              瀏覽所有故事
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {latestPosts && latestPosts.length > 0 ? (
              <>
                {/* Main Feature */}
                <article className="md:col-span-8 bg-surface-container-low rounded-lg p-1 group">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Link
                        href={`/series/${encodeURIComponent(latestPosts[0].series)}`}
                        className="font-label text-[10px] font-bold uppercase tracking-widest bg-primary-container text-on-primary px-2 py-1 rounded no-underline hover:opacity-80 transition-opacity"
                      >
                        {latestPosts[0].series}
                      </Link>
                      {latestPosts[0].episode && (
                        <span className="font-label text-[10px] font-bold uppercase tracking-widest bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded">
                          {latestPosts[0].episode}
                        </span>
                      )}
                      <span className="font-label text-xs text-on-surface-variant">
                        {latestPosts[0].word_count?.toLocaleString()} 字
                      </span>
                    </div>
                    <Link
                      href={`/posts/${latestPosts[0].id}`}
                      className="no-underline"
                    >
                      <h3 className="text-3xl font-headline text-primary group-hover:underline decoration-primary/30 underline-offset-4 mb-4 cursor-pointer">
                        {latestPosts[0].title}
                      </h3>
                    </Link>
                    <p className="text-on-surface-variant mb-5">
                      聲線：{latestPosts[0].voice}
                    </p>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/posts/${latestPosts[0].id}`}
                        className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-label text-sm font-semibold no-underline hover:opacity-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">menu_book</span>
                        閱讀
                      </Link>
                      <Link
                        href={`/posts/${latestPosts[0].id}#listen`}
                        className="inline-flex items-center gap-2 bg-surface-container-high text-primary px-5 py-2.5 rounded-full font-label text-sm font-semibold no-underline hover:bg-surface-container-highest transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">headphones</span>
                        收聽
                      </Link>
                    </div>
                  </div>
                </article>

                {/* Side Features */}
                {latestPosts.slice(1).map((post) => (
                  <article
                    key={post.id}
                    className="md:col-span-4 bg-surface-container-low rounded-lg p-6 group flex flex-col justify-between border border-transparent hover:bg-surface-container-high transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-4">
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
                      <Link href={`/posts/${post.id}`} className="no-underline">
                        <h3 className="text-xl font-headline text-primary mb-3 leading-snug group-hover:underline decoration-primary/30 underline-offset-4 cursor-pointer">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-on-surface-variant text-sm mb-4">
                        {post.voice} · {post.word_count?.toLocaleString()} 字
                      </p>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/posts/${post.id}`}
                          className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-3.5 py-1.5 rounded-full font-label text-xs font-semibold no-underline hover:opacity-90 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">menu_book</span>
                          閱讀
                        </Link>
                        <Link
                          href={`/posts/${post.id}#listen`}
                          className="inline-flex items-center gap-1.5 bg-surface-container-highest text-on-surface-variant px-3.5 py-1.5 rounded-full font-label text-xs font-semibold no-underline hover:text-primary transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">headphones</span>
                          收聽
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </>
            ) : (
              <p className="md:col-span-12 text-on-surface-variant">
                目前沒有已發佈的文章。
              </p>
            )}
          </div>
        </section>

        {/* Top Novels (Horizontal Scroll — from Supabase) */}
        <section className="bg-surface-container-low py-24 mb-32 overflow-hidden">
          <div className="px-8 max-w-screen-2xl mx-auto mb-12 flex justify-between items-center">
            <h2 className="text-3xl font-headline text-primary">熱門小說</h2>
          </div>
          <div className="flex gap-8 px-8 overflow-x-auto pb-4 snap-x">
            {seriesShelf.map((s) => {
              const meta = SERIES_META[s.series];
              return (
                <Link
                  key={s.series}
                  href={`/series/${encodeURIComponent(s.series)}`}
                  className="flex-none w-64 snap-start group no-underline"
                >
                  <div
                    className="aspect-[2/3] rounded-lg mb-4 shadow-sm group-hover:-translate-y-2 transition-transform duration-300 flex items-end p-5"
                    style={{ backgroundColor: meta?.color ?? "#333" }}
                  >
                    <span className="text-xl font-headline text-white drop-shadow-md leading-tight">
                      {s.series}
                    </span>
                  </div>
                  <h4 className="font-headline text-lg text-primary mb-1">
                    {s.series}
                  </h4>
                  <p className="font-label text-xs text-on-surface-variant">
                    {s.voice && <span className="font-semibold uppercase tracking-tighter">{s.voice}</span>}
                    {s.latest_episode && <span> · 最新 {s.latest_episode}</span>}
                    <span> · {s.count} 章</span>
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Feature: Curation Tool Teaser */}
        <section className="px-8">
          <div className="relative rounded-xl overflow-hidden bg-primary p-12 md:p-24 flex items-center justify-center text-center">
            <div className="absolute inset-0 opacity-20">
              <img
                alt="Background Texture"
                className="w-full h-full object-cover mix-blend-overlay"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWgmIt0NNLmpHXLucLpBT2HDUjPAp7z7kp-msJgxCsbX-26MfIwN6B1JYQ29zQKJ4HRX3FGzrL_jzepT-fbWTECy_0fs0svNuwN6fBR6ew0u1MHAI96_cbT9Ll-Qv39B9pfTAvzhnvC283k-7c0D2SPdQwMkBCE-RcV71EHav82LMt_VjDdESW-wB0J7tYqt0ATs1bW0TyKJjXgMZI6VTXVlnVUvVd-6jkt9MW5cJqmGCZvkICUw7G7fUdAsF1YADNhIWMG_Jq01M"
              />
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-on-primary-container mb-8 inline-block">
                思維揉合的藝術
              </span>
              <h2 className="text-4xl md:text-6xl font-headline text-white mb-8 leading-tight">
                將台北的黑夜與萬年的記憶，揉合成你的每日晨讀。
              </h2>
              <p className="text-on-primary-container font-serif text-lg mb-12">
                我們的策展工具能智能地將今日頭條與經典及當代文學配對，建立起富有主題性的閱讀橋樑。
              </p>
              <button className="bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-full font-label font-bold tracking-tight hover:scale-105 transition-all">
                體驗策展工具
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full py-12 px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="font-serif text-lg text-primary-container">
            kanabi.live
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              className="font-label text-xs text-[#5c5957] hover:text-primary transition-all"
              href="#"
            >
              隱私權政策
            </a>
            <a
              className="font-label text-xs text-[#5c5957] hover:text-primary transition-all"
              href="#"
            >
              使用條款
            </a>
            <a
              className="font-label text-xs text-[#5c5957] hover:text-primary transition-all"
              href="#"
            >
              編輯方針
            </a>
            <a
              className="font-label text-xs text-[#5c5957] hover:text-primary transition-all"
              href="#"
            >
              客戶支援
            </a>
          </div>
          <p className="font-label text-xs text-[#5c5957]">
            © 2026 Kelu AI 內容工廠
          </p>
        </div>
      </footer>

      {/* GlobalPlayer is rendered in layout.tsx */}
    </>
  );
}
