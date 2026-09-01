// 依語言版本 (zh / en) 選擇對應的後端服務網址。
// zh 版沿用既有環境變數；en 版對應新增的英文版後端 (BACKEND_*_URL_EN)。

export function getAnnouncementBackendBase(lang) {
  const envVar = lang === 'en' ? 'BACKEND_Announcement_URL_EN' : 'BACKEND_Announcement_URL'
  const backendBase = process.env[envVar]
  if (!backendBase) {
    console.error(`[backendConfig] ${envVar} env var not set`)
    return null
  }
  return backendBase
}

export function getNotificationsBackendBase(lang) {
  const envVar = lang === 'en' ? 'BACKEND_NOTIFICATIONS_URL_EN' : 'BACKEND_NOTIFICATIONS_URL'
  const backendBase = process.env[envVar]
  if (!backendBase) {
    console.error(`[backendConfig] ${envVar} env var not set`)
    return null
  }
  return backendBase
}
