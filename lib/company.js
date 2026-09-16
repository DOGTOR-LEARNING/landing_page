/**
 * 公司登記資料（單一來源）。
 * 用於頁尾、關於我們、支援中心、法律條款與 JSON-LD 結構化資料，
 * 供 LINE 官方帳號認證等第三方審核比對營運主體。
 */
export const COMPANY = {
  nameZh: '超棒軟體科技有限公司',
  nameEn: 'SuperB Software Technology Co., Ltd.',
  taxId: '62214225',
  representative: '丁崇耘',
  addressZh: '臺北市中正區金山北路 1 號 5 樓之 6',
  addressEn: '5F.-6, No. 1, Jinshan N. Rd., Zhongzheng Dist., Taipei City, Taiwan',
  phone: '0963-779-263',
  phoneEn: '+886 963 779 263',
  // tel: 連結用的 E.164 格式
  phoneHref: '+886963779263',
  email: 'dogtor.love.learning@gmail.com',
}

export function getCompanyAddress(locale) {
  return locale === 'en' ? COMPANY.addressEn : COMPANY.addressZh
}

export function getCompanyPhone(locale) {
  return locale === 'en' ? COMPANY.phoneEn : COMPANY.phone
}
