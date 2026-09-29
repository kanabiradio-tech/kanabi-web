import type { LifePost } from "@/src/types/life";

// Keep source notes internal. Only reviewed, published entries appear on the website.
export const lifePosts: LifePost[] = [{
  slug: "hello-yichen", title: "嗨，我是沈以晨。先從認識開始。",
  excerpt: "喜歡吃東西，也喜歡亂走。這裡會放一些小事，還有那些我不想忘掉的瞬間。",
  category: "diary", status: "published", publishedAt: "2026-09-29T00:00:00+08:00",
  characterId: "shen-yichen", tags: ["沈以晨", "自我介紹"],
  cover: { src: "/images/yichen/portrait.png", alt: "沈以晨穿著白色上衣，戴著玻璃碎片項鍊，自然地笑著", caption: "沈以晨・角色形象", width: 1086, height: 1448, kind: "character" },
  disclosure: "沈以晨是 Kanabi 原創虛擬角色，本篇為角色自介，圖片為角色創作。未來實訪文章的場景、照片與體驗來自創作者，人物合成會另行標示。",
  blocks: [
    {
        "type": "paragraph",
        "text": "嗨，我是沈以晨。住台北，喜歡吃東西，也喜歡沒什麼目的地亂走。"
    },
    {
        "type": "paragraph",
        "text": "先講一個不太重要、但出門可能很重要的事：我的方向感普通。是需要稍微客氣一下，才會用「普通」這個詞的那種。"
    },
    {
        "type": "paragraph",
        "text": "想去的地方倒是存了很多。地圖上的收藏看起來很有行動力，本人就不一定了。真的要出門時，往往先處理肚子餓這件事。"
    },
    {
        "type": "heading",
        "text": "不用每次出門，都很了不起。"
    },
    {
        "type": "paragraph",
        "text": "我做一些內容和視覺編輯的接案工作。工作之外，想把生活裡的小事記下來。吃到喜歡的東西、走進沒走過的巷子，或是碰到一件明明很無聊、自己卻笑很久的事。"
    },
    {
        "type": "paragraph",
        "text": "先說好，這裡不保證每一家都好吃。喜歡就說喜歡，覺得普通也可以說普通。不用因為特地出門了，就硬要給那一天一個很高的分數。"
    },
    {
        "type": "quote",
        "text": "日子不用很厲害，有開心就好。"
    },
    {
        "type": "paragraph",
        "text": "旅行也是。我不太想把每個空檔都塞滿。想坐就坐，想多走一段就走。行程少一個地方，不一定是損失；胃容量多估一點，倒是真的會有後果。"
    },
    {
        "type": "heading",
        "text": "如果路上有貓，我可能會慢一點。"
    },
    {
        "type": "paragraph",
        "text": "我喜歡小動物。牠願意靠近，會很開心；牠不想理我，也沒關係，你忙。喜歡牠跟一定要摸到牠，是兩件事。"
    },
    {
        "type": "paragraph",
        "text": "以後這裡會慢慢有吃東西、旅行、散步的紀錄。也會有一些沒有明確分類的小事。不是每一篇都有結論，有時候只是想說：欸，這個我想給你看。"
    },
    {
        "type": "heading",
        "text": "還有一件事。"
    },
    {
        "type": "paragraph",
        "text": "你也可以在《燼光 CINERIS》裡找到我。想先看故事，或先從這裡認識，都可以。有些事情，晚一點知道也沒關係。"
    },
    {
        "type": "paragraph",
        "text": "第一篇先這樣。很高興認識你。以後如果剛好有空，就來坐一下。"
    }
],
  source: { kind: "character-introduction", notes: "依正式人物與寫作設定撰寫；不包含任何實訪、店家或消費經驗。", photoReferences: ["人物設定/images/01_identity_master.png"], reviewed: true },
}];
