import { Suspense } from 'react'
import GiftClient from './GiftClient'

export const metadata = {
  title: '送一份 DOGTOR Pro - Dogtor 逗課',
  description: '不需要 LINE，買一組 DOGTOR Pro 授權碼送給孩子，或捐給需要的學生。1 個月 NT$300 起。',
  // ?mode=donate 等參數版本都指回同一頁，避免被當成重複頁面。
  alternates: { canonical: '/gift' },
  openGraph: {
    title: '送一份 DOGTOR Pro',
    description: '買一組授權碼送給孩子，或捐給需要的學生。',
    images: ['/dogtor_cover.png'],
  },
}

export default function GiftPage() {
  return (
    <Suspense fallback={null}>
      <GiftClient />
    </Suspense>
  )
}
