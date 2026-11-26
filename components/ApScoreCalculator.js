'use client'

import { useRef, useState } from 'react'
import {
  estimatedApScore,
  frqTotal,
  pointsToNextScore,
  weightedPercent,
} from '@/lib/apScoreCalculators'
import { trackEvent } from '@/lib/analytics'
import styles from './ApScoreCalculator.module.css'

function clampInt(value, max) {
  const n = Math.round(Number(value))
  if (!Number.isFinite(n)) return 0
  return Math.min(Math.max(n, 0), max)
}

function NumberSlider({ id, label, value, max, onChange }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>
        <span>{label}</span>
        <span className={styles.fieldMax}>out of {max}</span>
      </label>
      <div className={styles.fieldRow}>
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(clampInt(e.target.value, max))}
          className={styles.range}
          aria-label={`${label} slider`}
        />
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          value={value}
          onChange={(e) => onChange(clampInt(e.target.value, max))}
          className={styles.number}
        />
      </div>
    </div>
  )
}

export default function ApScoreCalculator({ calc }) {
  const [mcq, setMcq] = useState(Math.round(calc.mcq.count * 0.65))
  const [frqs, setFrqs] = useState(calc.frqs.map((f) => Math.round(f.max * 0.55)))
  const tracked = useRef(false)

  const frqPoints = frqs.reduce((a, b) => a + b, 0)
  const percent = weightedPercent(calc, mcq, frqPoints)
  const score = estimatedApScore(calc, percent)
  const next = pointsToNextScore(calc, mcq, frqPoints)

  // One event per visit, on the first change, so we can see which subjects get used.
  const markUsed = () => {
    if (tracked.current) return
    tracked.current = true
    trackEvent('ap_calculator_used', { subject: calc.slug })
  }

  return (
    <div className={styles.calculator}>
      <div className={styles.inputs}>
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>
            Section I · Multiple choice
            <span className={styles.sectionMeta}>{Math.round(calc.mcq.weight * 100)}% of score</span>
          </legend>
          <NumberSlider
            id={`${calc.slug}-mcq`}
            label="Questions correct"
            value={mcq}
            max={calc.mcq.count}
            onChange={(v) => {
              markUsed()
              setMcq(v)
            }}
          />
        </fieldset>

        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>
            Section II · Free response
            <span className={styles.sectionMeta}>{Math.round((1 - calc.mcq.weight) * 100)}% of score</span>
          </legend>
          {calc.frqs.map((f, i) => (
            <NumberSlider
              key={f.label}
              id={`${calc.slug}-frq-${i + 1}`}
              label={f.label}
              value={frqs[i]}
              max={f.max}
              onChange={(v) => {
                markUsed()
                setFrqs((prev) => prev.map((p, j) => (j === i ? v : p)))
              }}
            />
          ))}
          <p className={styles.subtotal}>
            FRQ total: <strong>{frqPoints}</strong> / {frqTotal(calc)}
          </p>
        </fieldset>
      </div>

      <aside className={styles.result} aria-live="polite">
        <p className={styles.resultLabel}>Estimated AP score</p>
        <p className={`${styles.score} ${styles[`score${score}`]}`}>{score}</p>
        <p className={styles.percent}>
          Weighted score: <strong>{percent.toFixed(1)}%</strong>
        </p>
        {next ? (
          <p className={styles.next}>
            To reach a <strong>{next.nextScore}</strong>: about <strong>{next.mcq}</strong> more multiple-choice{' '}
            {next.mcq === 1 ? 'question' : 'questions'}, or <strong>{next.frq}</strong> more FRQ{' '}
            {next.frq === 1 ? 'point' : 'points'}.
          </p>
        ) : (
          <p className={styles.next}>You&apos;re in 5 territory. Keep it there with steady review.</p>
        )}
        <p className={styles.disclaimer}>
          Estimate only. The College Board sets the real 1–5 cut points after each exam.
        </p>
      </aside>
    </div>
  )
}
