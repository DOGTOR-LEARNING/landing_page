import { getLocale } from '@/lib/i18n/getLocale'
import { getSiteMessages } from '@/lib/i18n/getSiteMessages'

export async function generateMetadata() {
  const locale = await getLocale()
  const m = getSiteMessages(locale)
  return {
    title: m.invitePage.metaTitle,
    description: m.invitePage.metaDescription,
  }
}

export default function InviteLayout({ children }) {
  return children
}
