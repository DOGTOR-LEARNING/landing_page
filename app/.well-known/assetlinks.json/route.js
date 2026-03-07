/**
 * Android App Links - Digital Asset Links
 * URL: https://dogtor.superb-tutor.com/.well-known/assetlinks.json
 *
 * SHA-256 取得方式（二擇一）：
 * 1. 已上架 Play：Play Console → 你的 App → 設定 → App 簽署 → 「App 簽署金鑰憑證」的 SHA-256 憑證指紋（格式 XX:XX:XX:...，共 64 字元）。
 * 2. 本機簽章：終端機執行
 *    keytool -list -v -keystore path/to/your.keystore -alias your_key_alias
 *    在輸出中找「SHA256:」那一行的指紋，複製並改成冒號分隔（例如 AA:BB:CC:...）。
 *
 * 取得後替換下方的 REPLACE_WITH_YOUR_SHA256。
 */
const body = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'com.dogtor.superb_flutter_app',
      sha256_cert_fingerprints: ['REPLACE_WITH_YOUR_SHA256'],
    },
  },
]

export async function GET() {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
