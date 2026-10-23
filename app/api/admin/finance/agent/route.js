import { NextResponse } from 'next/server'
import { requireEmployee, forwardToFinance } from '@/lib/financeProxy'

// The agent reads Notion and Drive over several model turns before writing.
export const maxDuration = 180

// submit: the agent plans and the backend writes the plan.
// commit: write a plan returned earlier again (retry after a failed step).
const ACTIONS = { submit: '/agent/submit', commit: '/agent/commit' }

export async function POST(request) {
  const denied = await requireEmployee(request, 'finance.manage')
  if (denied) return denied
  const action = new URL(request.url).searchParams.get('action') || 'submit'
  const path = ACTIONS[action]
  if (!path) return NextResponse.json({ success: false, message: 'INVALID_ACTION' }, { status: 400 })
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
  return forwardToFinance(path, { method: 'POST', body: outgoing }, 170_000)
}
