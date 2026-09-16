import { COMPANY, getCompanyAddress, getCompanyPhone } from '@/lib/company'
import styles from './CompanyInfo.module.css'

/**
 * 公開的公司登記資訊區塊，讓使用者與第三方審核（如 LINE 官方帳號認證）
 * 能在網站上直接確認本服務的營運主體。
 */
export default function CompanyInfo({ messages, locale = 'zh-TW', headingLevel = 'h2' }) {
  const c = messages.company
  const Heading = headingLevel

  const rows = [
    { label: c.nameLabel, value: `${COMPANY.nameZh}（${COMPANY.nameEn}）` },
    { label: c.taxIdLabel, value: COMPANY.taxId },
    { label: c.representativeLabel, value: COMPANY.representative },
    { label: c.addressLabel, value: getCompanyAddress(locale) },
  ]

  return (
    <section className={styles.companySection} id="company">
      <Heading className={styles.title}>{c.title}</Heading>
      <p className={styles.intro}>{c.intro}</p>
      <dl className={styles.list}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <dt className={styles.label}>{row.label}</dt>
            <dd className={styles.value}>{row.value}</dd>
          </div>
        ))}
        <div className={styles.row}>
          <dt className={styles.label}>{c.phoneLabel}</dt>
          <dd className={styles.value}>
            <a href={`tel:${COMPANY.phoneHref}`} className={styles.link}>
              {getCompanyPhone(locale)}
            </a>
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>{c.emailLabel}</dt>
          <dd className={styles.value}>
            <a href={`mailto:${COMPANY.email}`} className={styles.link}>
              {COMPANY.email}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  )
}
