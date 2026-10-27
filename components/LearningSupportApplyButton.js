'use client'

import { trackExternalLinkClick } from '@/lib/analytics'
import { LEARNING_SUPPORT } from '@/lib/learningSupport'

/** 學習支持計劃的「填表申請」按鈕。location 帶進 PostHog，用來分辨是哪個位置點的。 */
export default function LearningSupportApplyButton({ label, location, className }) {
  return (
    <a
      href={LEARNING_SUPPORT.formUrl}
      className={className}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackExternalLinkClick(LEARNING_SUPPORT.formUrl, location)}
    >
      {label}
      <span aria-hidden="true"> →</span>
    </a>
  )
}
