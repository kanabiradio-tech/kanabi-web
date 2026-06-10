// Static metadata for each series (color, description, total planned chapters, cover image)
export const SERIES_META: Record<
  string,
  {
    color: string;
    desc: string;
    totalChapters: number;
    cover: string;
    kind?: "novel" | "column";
  }
> = {
  斬斷星辰: {
    color: "#1a3a5c",
    desc: "都市仙俠 / 熱血劍道。前世灰燼大賢者轉生為超商大夜班店員，用殘破的身體守護台北地底的古靈脈。",
    totalChapters: 365,
    cover: "/covers/zhan-duan-xing-chen.jpg",
  },
  台北冥影: {
    color: "#2d1b2e",
    desc: "都市民俗恐怖 / 規則類怪談。外送員一夜之間被迫看見了不該看見的東西，壽命開始倒數。",
    totalChapters: 365,
    cover: "/covers/taipei-ming-ying.jpg",
  },
  許願便利商店: {
    color: "#3d2b1f",
    desc: "黑色寓言 / 單元劇。凌晨三點的便利商店，門口寫著「徵求願望，代價自負」。",
    totalChapters: 365,
    cover: "/covers/xu-yuan-store.jpg",
  },
  我直播的不是靈異: {
    color: "#1c2a3a",
    desc: "靈異追債 / 直播互動 / 社會諷刺。過氣直播主拿到一張額度無限的黑業障卡，開始替冥界銀行追債。",
    totalChapters: 365,
    cover: "/covers/live-stream.jpg",
  },
  "燼光 CINERIS": {
    color: "#012d1d",
    desc: "詼諧的史詩愛情奇幻。台北圖書館檔案管理員，是所有人眼中最熱愛生活的人。只有他自己知道那是假裝的。",
    totalChapters: 365,
    cover: "/covers/cineris.jpg",
  },
  鯤島淵界: {
    color: "#8b1a1a",
    desc: "都市奇幻 × 台灣民俗 × 詼諧史詩。三千歲的存在，最大的敵人是食物冷掉。",
    totalChapters: 365,
    cover: "/covers/kunlun-abyss.jpg",
  },
  每日新聞: {
    color: "#0f4a45",
    desc: "萬年視角 × 當日熱點。用台灣早晨能入口的語感，看日本、韓國、歐美與世界正在發生的事。",
    totalChapters: 365,
    cover: "",
    kind: "column",
  },
  荒唐新聞: {
    color: "#8a4b1f",
    desc: "全球荒唐新聞 × 台灣口語轉譯。朋友傳來的那種新聞，不是新聞台播報腔。",
    totalChapters: 208,
    cover: "",
    kind: "column",
  },
};
