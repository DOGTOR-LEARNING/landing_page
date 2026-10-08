/**
 * iOS Universal Links - Apple App Site Association
 * URL: https://<host>/.well-known/apple-app-site-association
 *
 * Each host names only its own app; see lib/appHosts.js.
 */
import { appForHost, requestHost } from '@/lib/appHosts'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const app = appForHost(requestHost(request.headers))
  const body = {
    applinks: {
      apps: [],
      details: [
        {
          appID: app.iosAppId,
          paths: ['/invite', '/invite*'],
        },
      ],
    },
  }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
