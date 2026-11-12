import { Suspense } from 'react'
import GiftClient from './GiftClient'

export const metadata = {
  title: '送一份 DOGTOR Pro - Dogtor 逗課',
  description: '不需要 LINE，買一組 DOGTOR Pro 授權碼送給孩子，或捐給需要的學生。1 個月 NT$300 起。',
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
