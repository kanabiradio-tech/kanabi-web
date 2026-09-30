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
}, {
  "slug": "keep-these-little-things",
  "title": "先不要刪，我還想記得",
  "excerpt": "照片、截圖、沒想完的念頭。先留著，過幾天還想講，就講。",
  "category": "diary",
  "status": "published",
  "publishedAt": "2026-09-30T12:24:10.482584+08:00",
  "characterId": "shen-yichen",
  "tags": [
    "沈以晨",
    "日常",
    "小事"
  ],
  "cover": {
    "src": "/images/yichen/portrait.png",
    "alt": "沈以晨穿著白色上衣，戴著玻璃碎片項鍊，自然開心地笑著",
    "caption": "沈以晨・角色形象創作",
    "width": 1086,
    "height": 1448,
    "kind": "character"
  },
  "disclosure": "沈以晨是 Kanabi 原創虛擬角色。本篇為角色觀點創作，非實訪紀錄。 圖片為角色形象創作。",
  "blocks": [
    {
      "type": "paragraph",
      "text": "如果要替我的相簿寫一句介紹，大概是：東西都在，找不找得到再說。"
    },
    {
      "type": "paragraph",
      "text": "照片、截圖、想去的地方，存的時候每一個都很有道理。等到真的要找，才發現「我記得我有存」是一句毫無幫助的話。"
    },
    {
      "type": "paragraph",
      "text": "所以我想在這裡留一點比較找得到的東西。不用整理得多厲害，至少下次想起來，不用往上滑到手痠。"
    },
    {
      "type": "paragraph",
      "text": "第一種，是我喜歡，但不一定說得很完整的細節。"
    },
    {
      "type": "paragraph",
      "text": "比起只留一句「很好吃」，我比較想記得自己喜歡哪一口。是邊邊、醬，還是熱的時候那個味道？也可能吃完只剩一句「嗯，下次還想吃」。那就先寫這句，不要硬湊五個形容詞。等真的吃過，再慢慢說。"
    },
    {
      "type": "paragraph",
      "text": "第二種，是計畫外面的小事。"
    },
    {
      "type": "paragraph",
      "text": "如果出門本來只想買一樣東西，卻在路上看到什麼捨不得走，我想把那段也留下來。它可能完全不適合排進行程表。沒關係，我的行程表本來也沒有那麼大的權力。"
    },
    {
      "type": "paragraph",
      "text": "但想去跟去過要分開。收藏一百個地方，不代表腳已經走了一百次。這件事我要先替我的腳澄清。"
    },
    {
      "type": "paragraph",
      "text": "第三種，是還沒決定的東西。"
    },
    {
      "type": "paragraph",
      "text": "有些照片不漂亮，有些話寫到一半，有些地方看了介紹很想去，又覺得好遠。它們不一定會變成文章，我也不想先替它們找一個很有意義的理由。"
    },
    {
      "type": "paragraph",
      "text": "先留著。過幾天還想講，就講。"
    },
    {
      "type": "paragraph",
      "text": "我知道這個方法聽起來很像「整理失敗，換個說法」。有一點。但至少我開始分得出來，哪些是想留給自己，哪些是想拿來給你看。"
    },
    {
      "type": "paragraph",
      "text": "以後這裡大概會長成這樣：有吃過才寫的東西，有走過才說的路，也有一點還沒想完的念頭。你不用每次都得到什麼；偶爾看到一段，覺得「我也是」，我就會很開心。"
    },
    {
      "type": "paragraph",
      "text": "至於相簿，先不要催。我有在想了。"
    }
  ],
  "source": {
    "kind": "character-opinion",
    "notes": "依使用者 2026-09-30「請發布」授權發布。角色觀點，無真實實訪宣稱。",
    "photoReferences": [
      "人物設定/images/01_identity_master.png"
    ],
    "reviewed": true
  }
}];
