import crypto from 'crypto'

export function generateCheckMacValue(params, hashKey, hashIV) {
  const sorted = Object.keys(params)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(key => `${key}=${params[key]}`)
    .join('&')

  const raw = `HashKey=${hashKey}&${sorted}&HashIV=${hashIV}`

  let encoded = encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+')

  return crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase()
}

export function verifyCheckMacValue(params, hashKey, hashIV) {
  const receivedMac = params.CheckMacValue
  if (!receivedMac) return false

  const filtered = { ...params }
  delete filtered.CheckMacValue

  const computed = generateCheckMacValue(filtered, hashKey, hashIV)
  return computed === receivedMac
}

export function generateTradeNo() {
  const now = Date.now().toString(36)
  const rand = Math.random().toString(36).substring(2, 6)
  return `DG${now}${rand}`.substring(0, 20).toUpperCase()
}

export function formatTradeDate(date = new Date()) {
  const y = date.getFullYear()
  const M = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}/${M}/${d} ${h}:${m}:${s}`
}
