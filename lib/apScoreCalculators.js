/**
 * AP score calculators on the international site (global.superb-tutor.com/ap-score-calculator).
 *
 * One record per subject drives the calculator, the page copy, the sitemap and
 * the structured data. Exam formats were checked against AP Central in
 * November 2026; update them when the College Board changes a format.
 *
 * The 1–5 cut points are ESTIMATES. The College Board sets them every year and
 * does not publish them; ours are approximations from publicly released
 * scoring worksheets and typical score distributions, and the pages say so.
 * Cut points are the minimum weighted percentage for each AP score.
 */

export const CALCULATOR_BASE_PATH = '/ap-score-calculator'

// The next May exam session the pages target; bump it each summer after scores come out.
export const EXAM_YEAR = 2027

export const AP_CALCULATORS = [
  {
    slug: 'apes',
    name: 'AP Environmental Science',
    shortName: 'APES',
    mcq: { count: 80, weight: 0.6, minutes: 90 },
    frqs: [
      { label: 'FRQ 1: Design an investigation', max: 10 },
      { label: 'FRQ 2: Analyze a problem and propose a solution', max: 10 },
      { label: 'FRQ 3: Analyze a problem with calculations', max: 10 },
    ],
    frqMinutes: 70,
    cutoffs: { 5: 70, 4: 58, 3: 46, 2: 34 },
    guide: { slug: 'ap-environmental-science-exam-format', title: 'AP Environmental Science Exam Format' },
    inApp: true,
    tip: 'FRQ 3 is the calculation question. Showing your work and writing units on every number is the cheapest way to pick up points students usually lose.',
  },
  {
    slug: 'ap-biology',
    name: 'AP Biology',
    shortName: 'AP Bio',
    mcq: { count: 60, weight: 0.5, minutes: 90 },
    frqs: [
      { label: 'FRQ 1: Interpreting and evaluating experimental results (long)', max: 9 },
      { label: 'FRQ 2: Experimental results with graphing (long)', max: 9 },
      { label: 'FRQ 3: Scientific investigation (short)', max: 4 },
      { label: 'FRQ 4: Conceptual analysis (short)', max: 4 },
      { label: 'FRQ 5: Analyze a model or visual representation (short)', max: 4 },
      { label: 'FRQ 6: Analyze data (short)', max: 4 },
    ],
    frqMinutes: 90,
    cutoffs: { 5: 66, 4: 53, 3: 40, 2: 28 },
    guide: { slug: 'ap-biology-exam-format', title: 'AP Biology Exam Format' },
    inApp: true,
    tip: 'The two long FRQs are worth 9 points each, as much as the four short ones together. A correct graph (axes, labels, units, error bars) in FRQ 2 is some of the most reliable points on the exam.',
  },
  {
    slug: 'ap-psychology',
    name: 'AP Psychology',
    shortName: 'AP Psych',
    mcq: { count: 75, weight: 2 / 3, minutes: 90 },
    frqs: [
      { label: 'FRQ 1: Article Analysis Question (AAQ)', max: 7 },
      { label: 'FRQ 2: Evidence-Based Question (EBQ)', max: 7 },
    ],
    frqMinutes: 70,
    cutoffs: { 5: 72, 4: 60, 3: 48, 2: 36 },
    guide: { slug: 'ap-psychology-exam-format', title: 'AP Psychology Exam Format' },
    inApp: true,
    tip: 'Each FRQ point is worth more than two multiple-choice questions here. The AAQ asks from a short list (research method, variables, sample, statistics, ethics), so drilling that vocabulary pays off directly.',
  },
  {
    slug: 'ap-us-government',
    name: 'AP U.S. Government and Politics',
    shortName: 'AP Gov',
    mcq: { count: 55, weight: 0.5, minutes: 80 },
    frqs: [
      { label: 'FRQ 1: Concept application', max: 3 },
      { label: 'FRQ 2: Quantitative analysis', max: 4 },
      { label: 'FRQ 3: SCOTUS comparison', max: 4 },
      { label: 'FRQ 4: Argument essay', max: 6 },
    ],
    frqMinutes: 100,
    cutoffs: { 5: 69, 4: 56, 3: 44, 2: 32 },
    guide: { slug: 'ap-us-government-required-supreme-court-cases', title: 'All 15 Required Supreme Court Cases for AP Gov' },
    inApp: true,
    tip: 'The whole free-response section is only 17 points, so each FRQ point is worth about three multiple-choice questions. Knowing the 15 required Supreme Court cases cold is what makes FRQ 3 and the argument essay manageable.',
  },
]

export function getCalculator(slug) {
  return AP_CALCULATORS.find((c) => c.slug === slug) || null
}

export function frqTotal(calc) {
  return calc.frqs.reduce((sum, f) => sum + f.max, 0)
}

/** Weighted percentage (0–100) from raw section scores. */
export function weightedPercent(calc, mcqCorrect, frqPoints) {
  const mcq = Math.min(Math.max(mcqCorrect, 0), calc.mcq.count) / calc.mcq.count
  const frqMax = frqTotal(calc)
  const frq = Math.min(Math.max(frqPoints, 0), frqMax) / frqMax
  return (mcq * calc.mcq.weight + frq * (1 - calc.mcq.weight)) * 100
}

export function estimatedApScore(calc, percent) {
  for (const score of [5, 4, 3, 2]) {
    if (percent >= calc.cutoffs[score]) return score
  }
  return 1
}

/**
 * How many more multiple-choice questions, or FRQ points, would reach the next
 * AP score. Returns null at a 5.
 */
export function pointsToNextScore(calc, mcqCorrect, frqPoints) {
  const percent = weightedPercent(calc, mcqCorrect, frqPoints)
  const score = estimatedApScore(calc, percent)
  if (score === 5) return null
  const gap = calc.cutoffs[score + 1] - percent
  const perMcq = (calc.mcq.weight / calc.mcq.count) * 100
  const perFrq = ((1 - calc.mcq.weight) / frqTotal(calc)) * 100
  return {
    nextScore: score + 1,
    mcq: Math.ceil(gap / perMcq - 1e-9),
    frq: Math.ceil(gap / perFrq - 1e-9),
  }
}

/** Value of one FRQ point measured in multiple-choice questions. */
export function frqPointInMcq(calc) {
  const perMcq = calc.mcq.weight / calc.mcq.count
  const perFrq = (1 - calc.mcq.weight) / frqTotal(calc)
  return perFrq / perMcq
}

export function calculatorFaq(calc) {
  const total = frqTotal(calc)
  const mcqPct = Math.round(calc.mcq.weight * 100)
  const ratio = frqPointInMcq(calc).toFixed(1)
  return [
    {
      question: `How is the ${calc.name} exam scored?`,
      answer: `The multiple-choice section has ${calc.mcq.count} questions and counts for ${mcqPct}% of the score; the free-response section has ${calc.frqs.length} questions worth ${total} points in total and counts for ${100 - mcqPct}%. Wrong answers are not penalized. The College Board combines the two sections into a composite score and converts it to an AP score from 1 to 5.`,
    },
    {
      question: `What percentage do you need to get a 5 on ${calc.shortName}?`,
      answer: `The College Board does not publish exact cut points and they shift a little each year. Based on released scoring worksheets and typical score distributions, a weighted score of roughly ${calc.cutoffs[5]}% or higher has usually been enough for a 5, about ${calc.cutoffs[4]}% for a 4 and about ${calc.cutoffs[3]}% for a 3. Treat these as estimates.`,
    },
    {
      question: `Is one ${calc.shortName} FRQ point worth more than a multiple-choice question?`,
      answer: `Yes. With these section weights, one free-response point is worth about ${ratio} multiple-choice questions, so practicing the FRQ formats is usually the fastest way to move your score.`,
    },
    {
      question: `Is this ${calc.shortName} score calculator accurate?`,
      answer: 'It uses the official section weights and point values, so the weighted percentage is exact for the scores you enter. The 1–5 conversion is an estimate, because the real cut points are set after each exam and are not published.',
    },
  ]
}
