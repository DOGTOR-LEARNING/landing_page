import Header from '@/components/Header'

// 訂閱用戶看到信用卡帳單上的「Paddle」後常搜尋「paddle 取消訂閱」，這頁會出現在結果裡；
// 頁面本身是 client component 拿不到 metadata，原本沿用首頁標題，搜尋者看不出這裡能取消。
export const metadata = {
  title: '管理或取消 Dogtor 逗課訂閱（Paddle 扣款）｜Dogtor 逗課',
  description:
    '信用卡帳單出現 Paddle 扣款？那是 Dogtor 逗課的訂閱付款。在此頁可查看帳單、更換付款方式或取消 Dogtor Pro / Parent Pro 訂閱；也可在 LINE 官方帳號輸入「取消訂閱」取得管理連結。',
  alternates: { canonical: '/subscribe/manage' },
}

// 訂閱流程的終點頁：付款已經結束，沒有理由把使用者關在這裡出不去。
// 這裡用 layout 包住，是因為頁面本身有多個 return 分支（載入中、錯誤、正常），
// 逐一加 Header 容易漏掉。結帳頁 /subscribe 刻意不套用，避免付款途中分心。
export default function SubscribeLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
