import { NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function POST(request) {
  try {
    const { lineUserId, planType } = await request.json()

    const priceMap = {
      monthly: process.env.STRIPE_PRICE_MONTHLY,
      yearly: process.env.STRIPE_PRICE_YEARLY,
    }

    if (!lineUserId || typeof lineUserId !== 'string' || !lineUserId.startsWith('U')) {
      return NextResponse.json(
        { error: 'Invalid LINE user ID' },
        { status: 400 }
      )
    }

    if (!priceMap[planType]) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be "monthly" or "yearly".' },
        { status: 400 }
      )
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceMap[planType], quantity: 1 }],
      metadata: {
        parent_identifier: lineUserId,
        parent_type: 'line',
        plan_type: planType,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscribe?canceled=1`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout session error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
