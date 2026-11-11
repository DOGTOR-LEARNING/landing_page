import { Suspense } from 'react'
import GiftClient from './GiftClient'

export const metadata = {
  title: '送一份 DOGTOR Pro - Dogtor 逗課',
  description: '買 DOGTOR Pro 送給孩子，或捐給需要的學生。',
  robots: { index: false, follow: false },
}

export default function GiftPage() {
  return (
    <Suspense fallback={null}>
      <GiftClient />
    </Suspense>
  )
}
