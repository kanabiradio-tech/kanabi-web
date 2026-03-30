/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的播放清單 - kanabi.live",
};

export default function PlaylistPage() {
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
                總計 3 項目 &bull; 18 分鐘
              </span>
            </div>

            {/* Curation Item 1: News */}
            <div className="group bg-surface-container-low p-6 rounded-lg flex gap-6 items-center transition-all hover:shadow-md border border-transparent hover:border-outline-variant/30">
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
                    全球事務
                  </span>
                  <span className="font-label text-[11px] text-on-surface-variant">
                    &bull; 5 分鐘
                  </span>
                </div>
                <h3 className="text-2xl font-headline text-on-surface mb-1">
                  寂靜的建築：為何都市計畫正在消除噪音
                </h3>
                <p className="text-on-surface-variant text-sm line-clamp-1">
                  現代城市如何重新考慮聲音環境，以改善心理健康...
                </p>
              </div>
              <div className="hidden sm:block w-20 h-20 rounded overflow-hidden flex-shrink-0">
                <img
                  className="w-full h-full object-cover grayscale"
                  alt="寂靜的建築"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVDbOg0o0kCNkcSebvb6eGMnbSyaFOAo_IT1v0yeBheuAgl9gANgCd-B41qu1W2Q8vM2r5K7A2E8gmIqLggC7t9kRdjYTtvfj378hJWHnm6QERVoWWka56gty8Bn_LoV3ZWq5krrl9nhxiIMXrL7liErfxvwT3duDq0PPJG8LoZ56AMoQclzVBnoYF6ExkTCc8vs426Mirx3OycceSDJ6ZnKpiwsMwBtyyGOdXqDHXGdMcfG01KQQ4KWkvQGaRPQETTQUk1NCsmK8"
                />
              </div>
            </div>

            {/* Curation Item 2: News */}
            <div className="group bg-surface-container-low p-6 rounded-lg flex gap-6 items-center transition-all hover:shadow-md border border-transparent hover:border-outline-variant/30">
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
                    科技
                  </span>
                  <span className="font-label text-[11px] text-on-surface-variant">
                    &bull; 8 分鐘
                  </span>
                </div>
                <h3 className="text-2xl font-headline text-on-surface mb-1">
                  螢幕之外：矽谷類比工具的復興
                </h3>
                <p className="text-on-surface-variant text-sm line-clamp-1">
                  工程師們正回歸鋼筆和實體筆記本，以逃離數位疲勞...
                </p>
              </div>
              <div className="hidden sm:block w-20 h-20 rounded overflow-hidden flex-shrink-0">
                <img
                  className="w-full h-full object-cover grayscale"
                  alt="螢幕之外"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANdIIIXZnElUzLZVfIwWm_cgBJQGqqy6E9E2XqTgv8oTgOgPPn5-90gGpbpImQ7Obl584xUfPWKAZFqV85BPmyssPNlyLlCUmSbd6E2NIGafSY3ox3DSF2f4fKjIEIYGknAyxZTZbzD8El60h3_UtvVcveIJORYuKSrscrUrL-uSbstyeKsuETcnAGkvfGZMkZI3Xk33pjB8wyPprvHPZXIBmKBbtOYsw8LquQFr3gp8TbAwGg2haZzACvGNoDQTG3b1LdH_43Hw8"
                />
              </div>
            </div>

            {/* Curation Item 3: Novel */}
            <div className="group bg-surface-container-low p-6 rounded-lg flex gap-6 items-center transition-all hover:shadow-md border border-transparent hover:border-outline-variant/30">
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
                  <span className="font-label text-[10px] font-bold tracking-tighter uppercase text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded-full">
                    玻璃圖書館 &bull; 第 14 章
                  </span>
                  <span className="font-label text-[11px] text-on-surface-variant">
                    &bull; 12 分鐘
                  </span>
                </div>
                <h3 className="text-2xl font-headline text-on-surface mb-1">
                  拱廊中的低語
                </h3>
                <p className="text-on-surface-variant text-sm line-clamp-1">
                  艾里亞斯沒料到書籍會回話。最初只是嗡嗡聲...
                </p>
              </div>
              <div className="hidden sm:block w-20 h-20 rounded overflow-hidden flex-shrink-0">
                <img
                  className="w-full h-full object-cover grayscale"
                  alt="拱廊中的低語"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB70qz-J9j1X2rpwWLpncFJQW7lQS4X6RenylxyIOwhAIDUD25bvLCY_lUJjVYfnc0BYHCuPt4PcREnBZLu31JA8ezjRO9z2xkFrv-TdQkUK5LXkcaZW7CxyAr5HR6iO-Vjr8sR1U3EgIaZ1aiy4Eu_odaxLmgsdeK00fh5MN0dPnKumxvKQnAk4UFKhb1b8FeAxe1b2irqIQmk0G9U9rflho7EMs7n0b71DY6oeU-C-LZvE-4L5GhwiEchXd6QZPy-rW5soSmmlo"
                />
              </div>
            </div>
          </div>

          {/* Sidebar: Discovery */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Search & Recommendations */}
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/20 shadow-sm">
                <h3 className="font-label text-[0.85rem] font-bold uppercase tracking-widest text-primary mb-6">
                  探索發現
                </h3>
                <div className="relative mb-6">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                    search
                  </span>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:ring-1 focus:ring-primary focus:border-primary rounded-lg pl-10 py-2.5 text-sm font-label"
                    placeholder="搜尋典藏..."
                    type="text"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-3 hover:bg-surface-container rounded-lg transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-label text-[10px] text-on-secondary-fixed-variant uppercase">
                          燼光 CINERIS
                        </p>
                        <span className="font-label text-[11px] text-on-surface-variant">
                          &bull; 15 分鐘
                        </span>
                      </div>
                      <h4 className="font-headline text-[1.05rem] text-on-surface">
                        E03・陸沉淵
                      </h4>
                    </div>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-on-primary bg-primary hover:scale-110 transition-transform shadow-sm"
                      title="加入播放列表"
                    >
                      <span className="material-symbols-outlined text-lg">
                        add
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 hover:bg-surface-container rounded-lg transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-label text-[10px] text-on-secondary-fixed-variant uppercase">
                          斬斷星辰
                        </p>
                        <span className="font-label text-[11px] text-on-surface-variant">
                          &bull; 19 分鐘
                        </span>
                      </div>
                      <h4 className="font-headline text-[1.05rem] text-on-surface">
                        E03・林宗佑
                      </h4>
                    </div>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-on-primary bg-primary hover:scale-110 transition-transform shadow-sm"
                      title="加入播放列表"
                    >
                      <span className="material-symbols-outlined text-lg">
                        add
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 hover:bg-surface-container rounded-lg transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-label text-[10px] text-on-secondary-fixed-variant uppercase">
                          台北冥影
                        </p>
                        <span className="font-label text-[11px] text-on-surface-variant">
                          &bull; 18 分鐘
                        </span>
                      </div>
                      <h4 className="font-headline text-[1.05rem] text-on-surface">
                        E03・簡瑞麒
                      </h4>
                    </div>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-on-primary bg-primary hover:scale-110 transition-transform shadow-sm"
                      title="加入播放列表"
                    >
                      <span className="material-symbols-outlined text-lg">
                        add
                      </span>
                    </button>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 border border-primary/20 rounded-lg font-label text-xs font-semibold text-primary hover:bg-primary/5 transition-all">
                  查看更多推薦
                </button>
              </div>

              {/* Stats Bento */}
              <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container rounded-full opacity-30" />
                <h3 className="font-label text-[10px] font-bold uppercase tracking-widest text-primary-fixed mb-4 relative z-10">
                  播放統計
                </h3>
                <div className="space-y-4 relative z-10">
                  <div>
                    <div className="flex justify-between text-xs font-label mb-1">
                      <span>本週達成度</span>
                      <span>82%</span>
                    </div>
                    <div className="h-1.5 bg-primary-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary-fixed w-[82%]" />
                    </div>
                  </div>
                  <p className="font-headline text-lg italic leading-snug">
                    「本週已聽 3 集・共 52 分鐘」
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
