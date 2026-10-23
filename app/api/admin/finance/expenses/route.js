import { NextResponse } from 'next/server'
import { checkAdmin, forwardToFinance } from '@/lib/financeProxy'

// Drive + Notion + email run inside one backend request.
export const maxDuration = 120

export async function GET(request) {
  const denied = checkAdmin(request)
  if (denied) return denied
  const month = new URL(request.url).searchParams.get('month')
  const query = month && /^\d{4}-\d{2}$/.test(month) ? `?month=${month}` : ''
  return forwardToFinance(`/expenses${query}`)
}

export async function POST(request) {
  const denied = checkAdmin(request)
  if (denied) return denied
  let incoming
  try {
    incoming = await request.formData()
  } catch {
    return NextResponse.json({ success: false, message: 'INVALID_FORM' }, { status: 400 })
  }
  // Rebuild the form so only the expected fields reach the backend.
  const outgoing = new FormData()
  outgoing.set('payload', String(incoming.get('payload') || ''))
  for (const file of incoming.getAll('attachments')) {
    if (typeof file !== 'string' && file.size > 0) outgoing.append('attachments', file, file.name)
  }
  return forwardToFinance('/expenses', { method: 'POST', body: outgoing })
}
