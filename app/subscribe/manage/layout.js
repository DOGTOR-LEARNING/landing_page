import Header from '@/components/Header'

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
