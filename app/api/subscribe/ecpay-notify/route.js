import { NextResponse } from 'next/server'
import { verifyCheckMacValue } from '@/lib/ecpay'

const API_BASE = process.env.API_BASE_URL

export async function POST(request) {
  try {
    const formData = await request.formData()
    const params = Object.fromEntries(formData.entries())

    const hashKey = process.env.ECPAY_HASH_KEY
    const hashIV = process.env.ECPAY_HASH_IV

    if (!hashKey || !hashIV) {
      console.error('ECPay keys not configured')
      return new Response('0|ECPay keys not configured', { status: 500 })
    }

    if (!verifyCheckMacValue(params, hashKey, hashIV)) {
      console.error('ECPay CheckMacValue verification failed')
      return new Response('0|CheckMacValue verification failed', { status: 400 })
    }

    const rtnCode = params.RtnCode
    if (rtnCode !== '1') {
      console.log('ECPay payment not successful, RtnCode:', rtnCode)
      return new Response('1|OK')
    }

    const parentIdentifier = params.CustomField1
    const parentType = params.CustomField2 || 'line'
    const planType = params.CustomField3 || 'monthly'
    const tradeNo = params.MerchantTradeNo

    if (parentIdentifier) {
      try {
        await fetch(`${API_BASE}/generate_auth_code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parent_identifier: parentIdentifier,
            parent_type: parentType,
            plan_type: planType,
            payment_method: 'ecpay',
            trade_no: tradeNo,
          }),
        })
      } catch (err) {
        console.error('Failed to call backend generate_auth_code:', err)
      }
    }

    return new Response('1|OK')
  } catch (err) {
    console.error('ECPay notify error:', err)
    return new Response('0|Error', { status: 500 })
  }
}
