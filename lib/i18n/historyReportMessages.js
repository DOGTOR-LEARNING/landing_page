export const historyReportMessages = {
  'zh-TW': {
    pageTitle: 'Dogtor 每日學習報告（歷史）',
    parentViewLabel: '家長版',
    dateLabel: '日期',
    studentLabel: '學生',
    todaySummary: '今日摘要',
    cardsCompleted: '完成關卡',
    accuracy: '正確率',
    streak: '連續學習',
    daysUnit: '天',
    mistakeBook: '錯題本',
    newToday: '今日新增',
    reviewed: '已複習',
    mastered: '已掌握',
    mistakesMade: '本日錯題',
    yourAnswer: '你選的是',
    correctAnswer: '正確答案',
    learningAdvice: '學習建議',
    adviceIntro:
      '歷史題常常不是「背不背」，而是「有沒有抓到時代、對象、制度功能」。你可以用很短的引導，幫 Pierre 把題幹拆成關鍵字，再讓他自己說出判斷理由。',
    adviceBullets: [
      '針對「公學校」這題：先請 Pierre 用 1 句話回答「這種學校主要是給誰？政府想達成什麼？」再選答案。兩個關鍵字：①「日治初期」②「臺籍學童的初等教育」。',
      '建立對比記憶：公學校＝臺籍學童、普及日語與基礎知識；小學校＝多以日本人子弟為主。只要能說出這個對比，通常就不會選錯。',
      '把題幹改寫成「三段式」：時間（何時）＋對象（給誰）＋目的（為什麼）。每次做題都先講這三段，再看選項，命中率會很快提升。',
      '做完題後的 2 分鐘：讓他自己口述一次「為什麼 A 不對、B 才對」，家長只要追問「題幹哪一句話支持你？」就能把理由說得更精準。',
    ],
    unitOverviewTitle: '今日主題（臺灣史）',
    unitOverviewBody:
      '本日重點在日治初期的教育制度：理解「制度設立的對象與目的」，比死背名詞更能應付換句話的題型。',
    localeSwitchLabel: '語言',
    zh: '中文',
    en: 'English',
  },
  en: {
    pageTitle: 'Dogtor Daily Learning Report (History)',
    parentViewLabel: 'Parent view',
    dateLabel: 'Date',
    studentLabel: 'Student',
    todaySummary: "Today's summary",
    cardsCompleted: 'Levels completed',
    accuracy: 'Accuracy',
    streak: 'Learning streak',
    daysUnit: 'days',
    mistakeBook: 'Mistake book',
    newToday: 'Added today',
    reviewed: 'Reviewed',
    mastered: 'Mastered',
    mistakesMade: 'Mistakes made',
    yourAnswer: "Pierre's answer",
    correctAnswer: 'Correct answer',
    learningAdvice: 'Learning advice',
    adviceIntro:
      'History questions are often less about pure memorization and more about spotting time period, target group, and institutional purpose. With short prompts, you can help Pierre extract keywords and explain his reasoning.',
    adviceBullets: [
      'For the “kōgakkō (common school)” question: ask Pierre to answer in one sentence: “Who was this school mainly for, and what was the goal?” Give two anchors: early Japanese rule + primary education for Taiwanese children.',
      'Use a contrast pair: kōgakkō = mainly Taiwanese children / spreading Japanese & basic knowledge; shōgakkō = more often for Japanese children. Being able to explain the contrast prevents most mistakes.',
      'Rewrite stems into a 3-part frame: When + For whom + For what purpose. Say it out loud before looking at the options.',
      'After answering, spend 2 minutes having Pierre explain why A is wrong and B is correct, and ask: “Which phrase in the stem supports your claim?”',
    ],
    unitOverviewTitle: "Today's focus (Taiwan history)",
    unitOverviewBody:
      'Today focuses on early Japanese-rule education policy. Understanding “who the system was for” and “what it aimed to achieve” is more robust than memorizing labels.',
    localeSwitchLabel: 'Language',
    zh: '中文',
    en: 'English',
  },
}

export function getHistoryReportMessages(locale) {
  return historyReportMessages[locale] || historyReportMessages['zh-TW']
}

