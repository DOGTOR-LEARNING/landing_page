import { headers } from 'next/headers'
import DownloadClient from './DownloadClient'

export const metadata = {
  title: 'DOGTOR',
  robots: { index: false, follow: false },
}

/**
 * One link for "get the app" in emails, LINE and posts: a phone goes straight
 * to its own store, anything else sees both store buttons.
 * `?from=<label>` is recorded with the redirect so each link can be counted.
 */
export default async function DownloadPage({ searchParams }) {
  const h = await headers()
  const params = await searchParams
  return <DownloadClient marketKey={h.get('x-app-market') || 'tw'} from={params?.from || 'direct'} />
}
