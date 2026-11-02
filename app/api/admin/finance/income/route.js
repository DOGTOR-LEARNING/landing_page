import { NextResponse } from 'next/server'
import { requireEmployee, forwardToFinance } from '@/lib/financeProxy'

// Uploading the statements and the model's rewrite of the month's summary.
export const maxDuration = 180

export async function POST(request) {
  const denied = await requireEmployee(request, 'finance.manage')
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
  return forwardToFinance('/income/submit', { method: 'POST', body: outgoing }, 170_000)
}
