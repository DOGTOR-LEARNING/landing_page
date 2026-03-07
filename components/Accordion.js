'use client'

import { useState } from 'react'
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
          <button
            className={styles.accordionHeader}
            onClick={() => toggleItem(index)}
            aria-expanded={openIndex === index}
          >
            <span className={styles.accordionQuestion}>{item.question}</span>
            <span className={styles.accordionIcon}>
              {openIndex === index ? '−' : '+'}
            </span>
          </button>
          <div className={styles.accordionBody}>
            <div className={styles.accordionContent}>
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
