// 逗課動態（/news）的資料。分類順序就是頁面上的區塊順序，沒有內容的分類會自動隱藏；
// 同一分類內依日期由新到舊排列。
//
// 每一則依填的欄位決定怎麼顯示：youtubeId → 影片；instagramUrl → IG 嵌入；
// spotifyEpisodeId → Podcast 播放器（含封面圖；同時填 image 的話，標題旁放小縮圖、下面放精簡播放器）；
// image → 照片；都沒有 → 文字卡片連結到 url。
// {
//   category: 'award' | 'interview' | 'talk' | 'street' | 'demo' | 'event',
//   title: '標題',
//   date: '2026-09-01',          // 選填，沒填的排最後
//   description: '一兩句說明',    // 選填
//   youtubeId: 'xxxxxxxxxxx',    // YouTube 影片 ID（網址 watch?v= 或 shorts/ 後面那段）
//   vertical: true,              // Shorts／直式影片設 true
//   spotifyEpisodeId: 'xxxx',    // Spotify 單集網址 episode/ 後面那段
//   instagramUrl: 'https://www.instagram.com/reel/xxxx/',  // IG 貼文／Reels 網址（? 後面的參數不用）
//   image: '/news/xxx.jpg',      // 照片放在 public/news/ 底下
//   url: 'https://...',          // 選填；新聞報導、得獎公告等原文連結
// }

export const NEWS_CATEGORIES = ['award', 'interview', 'talk', 'street', 'demo', 'event']

export const NEWS_ITEMS = [
  {
    category: 'interview',
    title: 'Dogcast 逗課 Podcast',
    description: '逗課團隊自己的 Podcast。',
    instagramUrl: 'https://www.instagram.com/reel/DaSODPyRCjr/',
  },
  {
    category: 'demo',
    title: 'Dogtor 逗課 App 展示',
    instagramUrl: 'https://www.instagram.com/reel/Dcy42MaxS8H/',
  },
  {
    category: 'interview',
    title: '創業小聚 Podcast《創業新聲帶》S03EP05｜打造給學生的 GPT！他們把陪讀放進手機裡',
    date: '2026-08-05',
    description: '三位共同創辦人 Pierre、Bowen、Dino 受邀上節目，聊 AI 怎麼幫學生找到真正不會的地方、遊戲化與陪伴角色的設計，以及給家長的學習報告。',
    spotifyEpisodeId: '2GyfKcLo9dhEzu7vQKiiNF',
    image: '/news/podcast-chuangye-xinshengdai.webp',
    url: 'https://open.spotify.com/episode/2GyfKcLo9dhEzu7vQKiiNF',
  },
  {
    category: 'demo',
    title: 'Dogtor 逗課 App 介紹',
    youtubeId: '97PbV861JYs',
    vertical: true,
    date: '2026-03-25',
  },
]
