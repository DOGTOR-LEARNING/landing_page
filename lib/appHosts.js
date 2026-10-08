/**
 * One web host per app. Each app claims /invite on its own host only, so a
 * device with both apps installed always opens the right one, and an inviter
 * id (users.id restarts at 1 per market database) never reaches the wrong app.
 *
 * Android fingerprints are the SHA-256 of the Play App Signing key
 * (Play Console → App integrity), colon-separated. Several can be given
 * comma-separated, e.g. to also accept a locally signed build.
 */
export const GLOBAL_HOST = 'global.superb-tutor.com'

const APPS = {
  tw: {
    iosAppId: '623TA8PLPU.com.dogtor.superbFlutterApp',
    androidPackage: 'com.dogtor.superbFlutterApp',
    androidFingerprintEnv: 'ANDROID_SHA256_FINGERPRINT',
  },
  global: {
    iosAppId: '623TA8PLPU.com.dogtor.global',
    androidPackage: 'com.dogtor.global',
    androidFingerprintEnv: 'ANDROID_SHA256_FINGERPRINT_GLOBAL',
  },
}

/** Host of the incoming request, without the port. */
export function requestHost(headers) {
  const raw = headers.get('x-forwarded-host') || headers.get('host') || ''
  return raw.split(',')[0].trim().toLowerCase().replace(/:\d+$/, '')
}

export function isGlobalHost(host) {
  return host === GLOBAL_HOST
}

export function appForHost(host) {
  return isGlobalHost(host) ? APPS.global : APPS.tw
}

export function androidFingerprints(app) {
  const raw = process.env[app.androidFingerprintEnv] || ''
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s && !s.includes('REPLACE'))
}
