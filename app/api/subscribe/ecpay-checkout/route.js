import { NextResponse } from 'next/server'
import { generateCheckMacValue, generateTradeNo, formatTradeDate } from '@/lib/ecpay'

const ECPAY_URL = process.env.ECPAY_PAYMENT_URL

const AMOUNT = {
  monthly: 300,
  yearly: 3000,
}

export async function POST(request) {
  try {
    const { lineUserId, planType } = await request.json()

    if (!lineUserId || typeof lineUserId !== 'string' || !lineUserId.startsWith('U')) {
      return NextResponse.json({ error: 'Invalid LINE user ID' }, { status: 400 })
    }

    if (!AMOUNT[planType]) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    const merchantID = process.env.ECPAY_MERCHANT_ID
    const hashKey = process.env.ECPAY_HASH_KEY
    const hashIV = process.env.ECPAY_HASH_IV
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

    if (!merchantID || !hashKey || !hashIV) {
      return NextResponse.json({ error: 'ECPay not configured' }, { status: 500 })
    }

    const tradeNo = generateTradeNo()
    const amount = AMOUNT[planType]

    const params = {
      MerchantID: merchantID,
      MerchantTradeNo: tradeNo,
      MerchantTradeDate: formatTradeDate(),
      PaymentType: 'aio',
      TotalAmount: amount,
      TradeDesc: 'Dogtor Parent Pro',
      ItemName: `Dogtor Parent Pro - ${planType === 'monthly' ? '月繳方案' : '年繳方案'}`,
      ReturnURL: `${siteUrl}/api/subscribe/ecpay-notify`,
      ClientBackURL: `${siteUrl}/subscribe/success`,
      ChoosePayment: 'ALL',
      EncryptType: 1,
      NeedExtraPaidInfo: 'Y',
      CustomField1: lineUserId,
      CustomField2: 'line',
      CustomField3: planType,
    }

    params.CheckMacValue = generateCheckMacValue(params, hashKey, hashIV)

    return NextResponse.json({ url: ECPAY_URL, params })
  } catch (err) {
    console.error('ECPay checkout error:', err)
    return NextResponse.json({ error: 'Failed to create ECPay checkout' }, { status: 500 })
  }
}
