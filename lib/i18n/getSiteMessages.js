import { zhTW } from './messages/zh-TW'
import { en } from './messages/en'

export function getSiteMessages(locale) {
  return locale === 'en' ? en : zhTW
}
