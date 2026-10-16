// 網友評價頁（/reviews）的資料。只放真實、公開的評價，不要改寫內容。
// 欄位留 null 或陣列留空時，該區塊會自動隱藏。

export const STORE_RATINGS = {
  appStore: {
    url: 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
    // 會自動從 Apple 抓最新評分（lib/storeRatings.js），這裡只是抓不到時的備用值。
    rating: null,
    count: null,
  },
  googlePlay: {
    // Google Play 沒有公開 API，要手動更新。例：rating: 4.8, count: 120
    url: 'https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp',
    rating: null,
    count: null,
  },
}

// 從商店複製的評論原文。
// { store: 'appStore' | 'googlePlay', author: '暱稱', rating: 5, date: '2026-09-01', text: '評論原文' }
export const STORE_REVIEWS = []

// 公開的臉書貼文（貼文權限必須是「公開」才嵌得進來）。
// 嵌入的貼文是 iframe，搜尋引擎和 AI 讀不到裡面的字，所以另外用自己的話寫一句 summary 顯示在頁面上。
// 有付費、分潤（例如專屬優惠碼）或贈送服務的合作貼文，依公平交易法要標 sponsored: true，會顯示「合作推薦」。
// { url: 'https://www.facebook.com/xxx/posts/yyy', author: '作者／粉專名稱', summary: '一兩句重點摘要', sponsored: true }
export const FACEBOOK_POSTS = [
  {
    url: 'https://www.facebook.com/permalink.php?story_fbid=pfbid02Nw4PasD3Ba5VW6S5wrT7pxwxyAkn3KnVj1TTXdRhppv7LTcGixgCYw45Lpa8dMPol&id=100052104880622',
    author: '尚瑞君（作家，粉專「尚瑞君之愛‧傾聽‧解讀心」）',
    sponsored: true,
    summary: '試用家長版後推薦：AI 分析幫孩子找到弱點、用零碎時間學透知識點，家長也能看到孩子的練習時間、題數和錯題，安心陪孩子一起進步。',
  },
  {
    url: 'https://www.facebook.com/abfunlove/posts/pfbid0fkCQ7i8r2SvoStW3tEVRSvy74zf4xTMYXPTypJte1qsd7tEnABfPAAa24FEgzKV4l',
    author: '愛比妞。親子純粹玩',
    summary: '推薦準備會考的家庭使用：等公車也能用考古題功能無痛刷題、跟同學對戰邊玩邊學，還有超可愛的狗狗教不會的題目。',
  },
]
