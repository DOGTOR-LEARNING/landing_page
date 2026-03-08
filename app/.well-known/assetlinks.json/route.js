/**
 * Android App Links - Digital Asset Links
 * URL: https://dogtor.superb-tutor.com/.well-known/assetlinks.json
 *
 * SHA-256 指紋由環境變數 ANDROID_SHA256_FINGERPRINT 提供（多個請用逗號分隔，例如 debug,release）。
 * 未設定時使用佔位符，Android App Links 驗證不會通過，需在部署環境設定實際指紋。
 *
 * 指紋取得方式（二擇一）：
 * 1. 已上架 Play：Play Console → 你的 App → 設定 → App 簽署 → 「App 簽署金鑰憑證」的 SHA-256。
 * 2. 本機：keytool -list -v -keystore path/to/your.keystore -alias your_key_alias，取 SHA256 並改成冒號分隔。
 */
function getSha256Fingerprints() {
  const raw = process.env.ANDROID_SHA256_FINGERPRINT
  if (!raw || raw.trim() === '' || raw.includes('REPLACE')) {
    return ['REPLACE_WITH_YOUR_SHA256']
  }
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}

export async function GET() {
  const body = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.dogtor.superb_flutter_app',
        sha256_cert_fingerprints: getSha256Fingerprints(),
      },
    },
  ]
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
