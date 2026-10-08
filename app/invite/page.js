import { headers } from 'next/headers'
import InviteClient from './InviteClient'

export default async function InvitePage() {
  const h = await headers()
  return <InviteClient marketKey={h.get('x-app-market') || 'tw'} />
}
