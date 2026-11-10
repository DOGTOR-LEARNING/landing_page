// fetch that refuses to follow redirects, for server-to-backend calls that
// carry employee tokens or shared keys (a redirect must never forward them).
//
// Same behavior as fetch(url, { redirect: 'error' }), which Cloudflare Workers
// rejects outright ("Invalid redirect value, must be one of follow or manual").
// So request with 'manual' and throw on any 3xx, like 'error' would.
export async function fetchNoRedirect(url, init = {}) {
  const response = await fetch(url, { ...init, redirect: 'manual' })
  if (response.status >= 300 && response.status < 400) {
    await response.body?.cancel()
    throw new TypeError(`Unexpected redirect (${response.status}) from backend`)
  }
  return response
}
