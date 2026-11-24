// /platform 介紹頁的「聯絡我們」表單。欄位、驗證與寄信方式沿用超棒軟體官網
// （superb_official_website 的 lib/actions/contact.ts），用 Resend 寄到公司信箱。
// 需要的環境變數與官網相同：RESEND_API_KEY、CONTACT_TO_EMAIL、CONTACT_FROM_EMAIL。

const INQUIRY_LABELS = {
  education: '教育機構合作 Education partnership',
  product: '產品／技術合作 Product / technology',
  media: '媒體／活動邀請 Media / event',
  other: '其他 Other',
}
const MESSAGE_MAX = 3000
// 表單送出最短時間：防止機器人瞬間送出
const MIN_FILL_MS = 2500
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 同一個 IP 10 分鐘內最多 5 次。Worker 的記憶體不跨實例共享，只是盡力而為。
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const hits = new Map()
function rateLimited(key) {
  const now = Date.now()
  const recent = (hits.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(key, recent)
  return recent.length > RATE_MAX
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

function str(v, max = 5000) {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function validate(input) {
  const errors = {}
  if (!input.name) errors.name = 'nameRequired'
  else if (input.name.length > 80) errors.name = 'nameTooLong'
  if (!input.email) errors.email = 'emailRequired'
  else if (!EMAIL_RE.test(input.email)) errors.email = 'emailInvalid'
  if (input.organization.length > 120) errors.organization = 'organizationTooLong'
  if (!INQUIRY_LABELS[input.inquiryType]) errors.inquiryType = 'typeRequired'
  if (!input.message) errors.message = 'messageRequired'
  else if (input.message.length < 10) errors.message = 'messageTooShort'
  else if (input.message.length > MESSAGE_MAX) errors.message = 'messageTooLong'
  if (input.consent !== true) errors.consent = 'consentRequired'
  return errors
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, reason: 'server' }, { status: 400 })
  }

  const input = {
    name: str(body.name, 200),
    email: str(body.email, 320),
    organization: str(body.organization, 300),
    inquiryType: str(body.inquiryType, 40),
    message: str(body.message, MESSAGE_MAX + 100),
    consent: body.consent === true,
    target: str(body.target, 80),
  }

  const fieldErrors = validate(input)
  if (Object.keys(fieldErrors).length) {
    return Response.json({ ok: false, reason: 'validation', fieldErrors }, { status: 400 })
  }

  // 防垃圾訊息：honeypot 或填寫過快時，靜默視為成功，不寄送
  if (body.website || Date.now() - Number(body.startedAt) < MIN_FILL_MS) {
    return Response.json({ ok: true })
  }

  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) {
    return Response.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[platform-contact] 郵件服務未設定，開發模式僅記錄：', input)
      return Response.json({ ok: true })
    }
    console.error('[platform-contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL 未設定')
    return Response.json({ ok: false, reason: 'server' }, { status: 500 })
  }

  const rows = [
    ['姓名 Name', input.name],
    ['Email', input.email],
    ['單位 Organization', input.organization || '—'],
    ['類型 Type', INQUIRY_LABELS[input.inquiryType]],
    ['來源 Source', `補習班平台介紹頁 /platform${input.target ? `/${input.target}` : ''}`],
  ]

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.email,
        subject: `[補習班平台洽詢] ${input.organization || input.target || INQUIRY_LABELS[input.inquiryType]} — ${input.name}`,
        text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${input.message}`,
        html: `<table>${rows
          .map(([k, v]) => `<tr><th align="left">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`)
          .join('')}</table><p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>`,
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      console.error('[platform-contact] Resend 回應錯誤', res.status, await res.text())
      return Response.json({ ok: false, reason: 'server' }, { status: 502 })
    }
    return Response.json({ ok: true })
  } catch (error) {
    console.error('[platform-contact] 寄送失敗', error)
    return Response.json({ ok: false, reason: 'server' }, { status: 502 })
  }
}
