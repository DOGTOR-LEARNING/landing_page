/**
 * iOS Universal Links - Apple App Site Association
 * URL: https://dogtor.superb-tutor.com/.well-known/apple-app-site-association
 */
const body = {
  applinks: {
    apps: [],
    details: [
      {
        appID: '623TA8PLPU.com.dogtor.superbFlutterApp',
        paths: ['/invite', '/invite*'],
      },
    ],
  },
}

export async function GET() {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
