import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

function verifySignature(rawBody, signature, secretKey) {
  const parts = signature.split(';')
  let ts = ''
  let h1 = ''
  for (const part of parts) {
    const [key, value] = part.split('=')
    if (key === 'ts') ts = value
    if (key === 'h1') h1 = value
  }

  if (!ts || !h1) return false

  const signedPayload = `${ts}:${rawBody}`
  const computed = createHmac('sha256', secretKey)
    .update(signedPayload, 'utf8')
    .digest('hex')

  try {
    return timingSafeEqual(Buffer.from(computed), Buffer.from(h1))
  } catch {
    return false
  }
}

export async function POST(request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('paddle-signature')
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET

    if (!signature || !secretKey) {
      return NextResponse.json(
        { error: 'Missing signature or secret' },
        { status: 401 }
      )
    }

    if (!verifySignature(rawBody, signature, secretKey)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(rawBody)

    if (event.event_type === 'transaction.completed') {
      const customData = event.data?.custom_data
      if (!customData?.parent_identifier) {
        console.error('Paddle webhook: missing parent_identifier in custom_data')
        return NextResponse.json(
          { error: 'Missing parent data' },
          { status: 400 }
        )
      }

      const apiBase = process.env.API_BASE_URL
      const res = await fetch(`${apiBase}/generate_auth_code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_identifier: customData.parent_identifier,
          parent_type: customData.parent_type || 'line',
          plan_type: customData.plan_type || 'monthly',
          payment_method: 'paddle',
          transaction_id: event.data.id,
        }),
      })

      if (!res.ok) {
        console.error('Backend generate_auth_code failed:', await res.text())
        return NextResponse.json(
          { error: 'Backend error' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Paddle webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
