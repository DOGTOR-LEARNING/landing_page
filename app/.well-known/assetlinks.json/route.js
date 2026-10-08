/**
 * Android App Links - Digital Asset Links
 * URL: https://<host>/.well-known/assetlinks.json
 *
 * Each host names only its own app; see lib/appHosts.js. Fingerprints come
 * from ANDROID_SHA256_FINGERPRINT (tw) / ANDROID_SHA256_FINGERPRINT_GLOBAL (en):
 * Play Console → App integrity → App signing key certificate → SHA-256.
 * With the variable unset this returns an empty list, so verification fails
 * plainly instead of against a placeholder.
 */
import { androidFingerprints, appForHost, requestHost } from '@/lib/appHosts'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const app = appForHost(requestHost(request.headers))
  const fingerprints = androidFingerprints(app)
  const body = fingerprints.length
    ? [
        {
          relation: ['delegate_permission/common.handle_all_urls'],
          target: {
            namespace: 'android_app',
            package_name: app.androidPackage,
            sha256_cert_fingerprints: fingerprints,
          },
        },
      ]
    : []
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
