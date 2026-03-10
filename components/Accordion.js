'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Accordion.module.css'

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.accordionItem} ${openIndex === index ? styles.open : ''}`}
        >
          <h3 className={styles.accordionHeading}>
            <button
              className={styles.accordionHeader}
              onClick={() => toggleItem(index)}
              aria-expanded={openIndex === index}
            >
              <span className={styles.accordionQuestion}>{item.question}</span>
              <span className={styles.accordionIcon} aria-hidden="true">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
          </h3>
          <div
            className={styles.accordionBody}
            role="region"
            aria-hidden={openIndex !== index}
          >
            <div className={styles.accordionContent}>
              {item.answer.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {item.guideLink && (
                <p className={styles.guideLink}>
                  詳細攻略：<Link href={item.guideLink}>{item.guideTitle || '學習指南'}</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
