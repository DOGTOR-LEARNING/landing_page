import { Suspense } from 'react'
import { headers } from 'next/headers'
import SubscribeClient from './SubscribeClient'

export const metadata = {
  title: '訂閱方案 - Dogtor 逗課',
  description: '選擇 Dogtor 逗課的付費訂閱方案。',
  robots: { index: false, follow: false },
}

export default async function SubscribePage() {
  const h = await headers()
  // Set by middleware.js only when ?preview=<PADDLE_PREVIEW_TOKEN> matches.
  const previewMode = h.get('x-paddle-preview') === '1'

  return (
    <Suspense fallback={null}>
      <SubscribeClient previewMode={previewMode} />
    </Suspense>
  )
}
