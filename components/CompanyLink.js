import { COMPANY } from '@/lib/company'
import styles from './CompanyLink.module.css'

export default function CompanyLink({ children, className = '' }) {
  return (
    <a
      href={COMPANY.website}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.link} ${className}`.trim()}
    >
      {children}
    </a>
  )
}
