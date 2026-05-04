export const reportMessages = {
  'zh-TW': {
    pageTitle: 'Dogtor 每日學習報告',
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
      'Pierre 真的很努力、也做得不錯！接下來的關鍵，是把「錯的地方」變成「會的地方」：你不需要變成生物老師，只要用對方法陪他複習。',
    adviceBullets: [
      '針對「spindle fibers（紡錘絲）」這題：Pierre 可能把「複製染色體」跟「分開染色體」混在一起。你可以請他用手比一比：「紡錘絲是『拉』還是『複製』？」簡單說：染色體在 S 期就複製好了；到了有絲分裂，紡錘絲的工作是把姐妹染色分體拉開，分到兩邊，讓兩個新細胞各拿到一份。',
      '針對「paracrine（旁分泌）」這題：Pierre 可能把 endocrine（內分泌，跑很遠）跟 paracrine（只影響附近）搞混。你可以用一句話幫他記：「para = nearby（附近）」。簡單說：paracrine 就像同學在旁邊小聲提醒，只影響隔壁幾個細胞；endocrine 則像廣播，透過血液影響遠處器官。',
      '陪讀時不要直接講答案，改用 2 句固定提問：①「你怎麼判斷它是『附近』還是『很遠』？」②「它是『拉開』還是『複製』？」這兩句能快速抓出他卡住的判斷點。',
      '10 分鐘針對性練習（比刷很多題更有效）：找 6 題同類題（3 題 mitosis/細胞週期、3 題 signaling），每題都要說出「關鍵字」再選答案。關鍵字示例：spindle fibers → separate sister chromatids；paracrine → nearby cells。',
      '最後 3 分鐘把錯誤寫成「一句規則」貼在筆記最上面：例如「spindle fibers = 拉開姐妹染色分體」與「paracrine = 影響附近細胞」。明天先念規則再做 2 題，最容易真的記住。',
    ],
    unitOverviewTitle: 'Units 1–4 重點（AP Biology）',
    unitOverviewBody:
      'AP Biology Units 1–4 涵蓋生命的分子與細胞基礎，約占 AP 考試 40–60%。重點包含：水與巨分子化學（Unit 1）、細胞構造與物質運輸/膜功能（Unit 2）、光合作用與呼吸作用等能量轉換（Unit 3）、細胞溝通與細胞週期（Unit 4）。',
    localeSwitchLabel: '語言',
    zh: '中文',
    en: 'English',
  },
  en: {
    pageTitle: 'Dogtor Daily Learning Report',
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
    yourAnswer: 'Pierre\'s answer',
    correctAnswer: 'Correct answer',
    learningAdvice: 'Learning advice',
    adviceIntro:
      "Pierre is doing a great job—and that effort matters. The next step is turning today's mistakes into tomorrow's confidence. You don't need to be a biology teacher; you just need a simple, repeatable way to review together.",
    adviceBullets: [
      'For the spindle fibers mistake: Pierre likely mixed up “replicate chromosomes” vs “separate chromosomes.” Have him act it out with his hands: “Are spindle fibers *copying* or *pulling*?” Quick guide: DNA is copied in S phase; during mitosis, spindle fibers pull sister chromatids apart so each new cell gets one set.',
      'For the paracrine mistake: Pierre likely confused endocrine (far) with paracrine (nearby). Give him a simple anchor: “para = nearby.” Quick guide: paracrine is like whispering to the neighbors (nearby cells); endocrine is like broadcasting through the bloodstream to distant organs.',
      'Use two repeatable questions instead of giving the answer: (1) “Is the signal meant for nearby cells or far away?” (2) “Is this process pulling things apart or copying them?” These quickly reveal the exact point of confusion.',
      '10-minute targeted practice beats an hour of random review: do 6 similar questions (3 on mitosis/cell cycle, 3 on signaling). Pierre must say the keyword *before* choosing: spindle fibers → separate sister chromatids; paracrine → nearby cells.',
      'Close with a 3-minute “one-sentence rule” written at the top of the notebook: “Spindle fibers pull sister chromatids apart.” “Paracrine signals affect nearby cells.” Tomorrow: read the rules once, then do 2 questions to lock it in.',
    ],
    unitOverviewTitle: 'Key focus (AP Biology Units 1–4)',
    unitOverviewBody:
      'AP Biology Units 1–4 cover the foundational molecular and cellular basis of life, making up roughly 40–60% of the AP exam. Key topics include the chemistry of water and macromolecules (Unit 1), cellular structure, transport, and membrane function (Unit 2), cellular energy processes like photosynthesis and respiration (Unit 3), and cell communication and the cell cycle (Unit 4).',
    localeSwitchLabel: 'Language',
    zh: '中文',
    en: 'English',
  },
}

export function getReportMessages(locale) {
  return reportMessages[locale] || reportMessages['zh-TW']
}

