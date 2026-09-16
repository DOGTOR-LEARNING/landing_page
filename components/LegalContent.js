import { COMPANY, getCompanyAddress, getCompanyPhone } from '@/lib/company'
import styles from '../app/legal.module.css'

function RichText({ text }) {
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g
  const parts = []
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[2]) {
      parts.push(<strong key={key++}>{match[2]}</strong>)
    } else if (match[3]) {
      parts.push(
        <a key={key++} href={match[4]} target="_blank" rel="noopener noreferrer">
          {match[3]}
        </a>
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return <>{parts}</>
}

function ContactBlock({ locale }) {
  const isEn = locale === 'en'
  const labels = isEn
    ? {
        name: 'Company: ',
        taxId: 'Business Registration No.: ',
        address: 'Address: ',
        phone: 'Phone: ',
        email: 'Email: ',
      }
    : {
        name: '公司名稱：',
        taxId: '統一編號：',
        address: '公司地址：',
        phone: '聯絡電話：',
        email: '客服信箱：',
      }

  return (
    <div className={styles.contactEmail}>
      <p>
        <strong>{labels.name}</strong>
        {COMPANY.nameZh}（{COMPANY.nameEn}）
      </p>
      <p>
        <strong>{labels.taxId}</strong>
        {COMPANY.taxId}
      </p>
      <p>
        <strong>{labels.address}</strong>
        {getCompanyAddress(locale)}
      </p>
      <p>
        <strong>{labels.phone}</strong>
        <a href={`tel:${COMPANY.phoneHref}`}>{getCompanyPhone(locale)}</a>
      </p>
      <p>
        <strong>{labels.email}</strong>
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
      </p>
    </div>
  )
}

function renderBlocks(blocks, locale) {
  return blocks.map((block, i) => {
    if (block.type === 'p') {
      return (
        <p key={i}>
          <RichText text={block.text} />
        </p>
      )
    }
    if (block.type === 'ul') {
      return (
        <ul key={i}>
          {block.items.map((item, j) => (
            <li key={j}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      )
    }
    if (block.type === 'contact') {
      return <ContactBlock key={i} locale={locale} />
    }
    if (block.type === 'sub') {
      return (
        <div key={i}>
          <h3>{block.heading}</h3>
          {renderBlocks(block.blocks, locale)}
        </div>
      )
    }
    return null
  })
}

export default function LegalContent({ sections, locale = 'zh-TW' }) {
  return sections.map((section, i) => (
    <section key={i} className={styles.section}>
      <h2>{section.heading}</h2>
      {renderBlocks(section.blocks, locale)}
    </section>
  ))
}
