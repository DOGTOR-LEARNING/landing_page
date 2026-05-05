/** @typedef {{ question: string, answer: string, guideLink?: string, guideTitle?: string }} FaqItem */

/** @type {Record<'zh-TW' | 'en', FaqItem[]>} */
export const faqItemsByLocale = {
  'zh-TW': [
    {
      question: 'Dogtor 逗課是什麼？跟狗醫生或獸醫有關嗎？',
      answer:
        'Dogtor 逗課是一款專為台灣國高中生設計的學習 App，與獸醫、狗醫生或寵物醫療服務完全無關。品牌名稱「Dogtor」來自學霸小狗博士的形象，象徵認真學習、知識淵博的精神；中文名「逗課」意指逗趣上課，讓學習充滿樂趣。Dogtor 逗課提供國中會考、高中學測的題庫練習、好友對戰和 AI 解題功能，與精湛教育師資團隊合作，確保題目品質符合 108 課綱。',
    },
    {
      question: 'App 是免費的嗎？',
      answer:
        '是的！Dogtor 逗課 App 可以免費下載和使用。我們未來可能會提供進階功能，但核心體驗將永遠免費。',
    },
    {
      question: '我可以和朋友一起玩嗎？',
      answer:
        '當然可以。社群學習是 Dogtor 逗課 的核心功能。你可以挑戰朋友進行測驗對戰，並獲得成就稱號。',
    },
    {
      question: '涵蓋哪些科目？',
      answer: '我們目前涵蓋國中數學、自然和高中化學，並會根據用戶回饋持續新增更多科目。',
    },
    {
      question: '題目來源？',
      answer:
        '我們整理了眾多公開的學習資源與課綱，為所有章節整理對應的知識點，並透過多種大型語言模型（LLM）依照這些知識點生成題目，之後再由我們反覆審查與調整題型，確保內容正確且符合教學目標。',
    },
    {
      question: '什麼時候會有其他科目？',
      answer:
        '我們目前正在尋找其他科目的合作教育者。Dogtor 逗課 已經建立一套可以為不同科目生成、審查並上架題目的流程，但我們更重視題目的教育品質，因此會與專業老師合作一同打造內容。如果你有意願合作，歡迎透過支援中心或寄信至 dogtor.love.learning@gmail.com 與我們聯繫。',
    },
    {
      question: '我的資料安全嗎？',
      answer: '是的，我們非常重視隱私。你的資料都經過加密，我們絕不會將你的個人資訊出售給第三方。',
    },
    {
      question: 'App 一直閃退，該怎麼辦？',
      answer: '請先嘗試更新到最新版本。如果問題持續存在，請透過下方的支援中心聯絡我們的團隊。',
    },
    {
      question: '如何刪除我的帳號？',
      answer: '如果你想刪除帳號，請透過支援中心傳送請求給我們，我們會在 1-3 個工作天內處理。',
    },
    {
      question: '可以在 Android 上使用嗎？',
      answer:
        '可以！Dogtor 逗課現已登上 Google Play，Android 用戶可直接在 Play 商店搜尋「Dogtor 逗課」免費下載，或點擊頁面上的 Google Play 按鈕前往下載。',
    },
    {
      question: '如何回報問題或建議新功能？',
      answer:
        '我們很樂意聽到你的意見！請透過支援中心傳送訊息給我們，或直接寄信至 dogtor.love.learning@gmail.com。',
    },
    {
      question: '我的學習進度會同步嗎？',
      answer:
        '是的，你的所有學習進度、成就和島嶼設定都會自動同步到雲端，確保你在不同裝置上都能繼續學習。',
    },
    {
      question: '為什麼每次開啟 App 都要重新填寫暱稱或興趣？或是能量恢復顯示異常？',
      answer:
        '這通常是因為帳號在當時的註冊流程中沒有完整建立成功，導致系統無法正常讀取您的使用資料。建議依照以下步驟操作：\n\n1. 在 App 內登出帳號\n2. 重新使用 Google 帳號登入\n3. 重新登入後需要再填寫一次暱稱與興趣表單是正常的\n\n完成後帳號通常即可恢復正常使用。若問題仍持續，請再登出一次，並嘗試改用其他 Google 帳號登入。如仍無法解決，歡迎透過支援中心聯絡我們，我們會盡快協助處理。',
    },
    {
      question: 'Dogtor 逗課適合幾年級的學生？',
      answer:
        'Dogtor 逗課主要針對國中生（七至九年級）和高中生（十至十二年級）設計。國中生可以使用數學、自然等科目，以及會考考古題備戰會考；高中生則可透過化學題庫強化學測準備。',
      guideLink: '/guide/xue-ce-dao-shu-yi-ge-yue-ke-yi-zuo-shen-me',
      guideTitle: '學測倒數一個月可以做什麼？',
    },
    {
      question: '如何開始使用 Dogtor 逗課？',
      answer:
        '只需在 App Store 搜尋「Dogtor 逗課」或點擊下載連結，免費安裝後以 Google 帳號登入，填寫暱稱與感興趣的科目，即可立刻開始練習題庫或挑戰好友對戰。',
      guideLink: '/guide/gong-che-shang-guo-zhong-ying-wen-dan-zi-app',
      guideTitle: '通勤時間怎麼善用學習？',
    },
    {
      question: 'AI 解題功能是什麼？如何使用？',
      answer:
        '當你答錯題目後，Dogtor 逗課 會提供 AI 生成的詳細解析，幫助你理解錯誤原因和解題思路。這個功能會自動在答錯後顯示，不需要額外操作，讓你在對的時機獲得最有效的學習回饋。',
    },
    {
      question: '錯題本功能怎麼運作？',
      answer:
        '每次你答錯的題目都會自動收進錯題本，你可以隨時開啟錯題本複習這些弱點題目。系統會追蹤你對每道錯題的掌握程度，幫助你有效率地把弱點變強項。',
      guideLink: '/guide/guo-zhong-sheng-zen-me-zheng-li-cuo-ti-ben',
      guideTitle: '國中生如何整理錯題本？',
    },
    {
      question: '好友對戰是怎麼進行的？',
      answer:
        '你可以在 App 內加入好友，然後向對方發起即時答題對戰。雙方同時作答相同的題目，比較正確率和速度，最後依照成績給予排名和積分。對戰結果會計入成就系統，讓學習充滿競爭樂趣。',
    },
  ],
  en: [
    {
      question: 'What is Dogtor? Is it related to veterinarians?',
      answer:
        "Dogtor is a learning app designed for junior high and senior high students in Taiwan. It is not related to veterinary care, “dog doctors,” or pet medical services. The name “Dogtor” reflects a scholar-dog mascot that symbolizes curiosity and mastery, while the Chinese name suggests fun, engaging classes. Dogtor offers practice for middle/senior-high entrance exams (like Taiwan’s GSAT-style prep), friend challenges, and AI explanations—developed with educators to align with Taiwan’s curriculum.",
    },
    {
      question: 'Is the app free?',
      answer:
        'Yes. You can download and use Dogtor for free. We may add optional paid features later, but the core experience will stay free.',
    },
    {
      question: 'Can I learn with friends?',
      answer:
        'Absolutely. Social learning is a core feature. You can challenge friends to quiz battles and unlock achievement titles.',
    },
    {
      question: 'Which subjects are covered?',
      answer:
        'We currently cover junior high math and science plus senior high chemistry, and we continue to add more subjects based on feedback.',
    },
    {
      question: 'Where do the questions come from?',
      answer:
        'We consolidate public learning resources and curriculum goals, organize key knowledge points for each chapter, and use multiple large language models to generate draft items. Our team then reviews and refines question types to keep content accurate and aligned with learning objectives.',
    },
    {
      question: 'When will you add other subjects?',
      answer:
        'We are actively looking for educator partners for additional subjects. Dogtor already has a pipeline to generate, review, and publish questions, but we prioritize educational quality—so we build content with professional teachers when possible. If you are interested in collaborating, please reach us via Support or email dogtor.love.learning@gmail.com.',
    },
    {
      question: 'Is my data safe?',
      answer:
        'We take privacy seriously. Data is handled with strong security practices, and we do not sell your personal information to third parties.',
    },
    {
      question: 'The app keeps crashing. What should I do?',
      answer:
        'Please update to the latest version first. If it still happens, contact us via the Support Center linked below.',
    },
    {
      question: 'How do I delete my account?',
      answer:
        'Send a request through the Support Center. We typically process account deletion requests within 1–3 business days.',
    },
    {
      question: 'Can I use Dogtor on Android?',
      answer:
        'Yes. Dogtor is on Google Play. Android users can search for “Dogtor” and install for free, or use the Google Play button on our site.',
    },
    {
      question: 'How do I report bugs or request features?',
      answer:
        'We’d love your feedback. Message us via the Support Center or email dogtor.love.learning@gmail.com.',
    },
    {
      question: 'Does my progress sync across devices?',
      answer:
        'Yes. Your learning progress, achievements, and island settings sync to the cloud so you can continue on different devices.',
    },
    {
      question:
        'Why do I have to re-enter my nickname/interests every launch, or why does my energy display look wrong?',
      answer:
        'This often means the account setup did not fully complete at registration, so the app can’t reliably read your profile data. Try:\n\n1. Log out inside the app\n2. Sign in again with Google\n3. It is normal to fill in nickname/interests again after re-login\n\nIf issues persist, log out once more and try another Google account. If it still fails, contact us via Support and we will help.',
    },
    {
      question: 'What grades is Dogtor best for?',
      answer:
        'Dogtor primarily targets junior high (grades 7–9) and senior high (grades 10–12) students. Junior high students can use math and science practice; senior high students can strengthen chemistry prep.',
      guideLink: '/guide/xue-ce-dao-shu-yi-ge-yue-ke-yi-zuo-shen-me',
      guideTitle: '學測倒數一個月可以做什麼？',
    },
    {
      question: 'How do I get started with Dogtor?',
      answer:
        'Search “Dogtor” on the App Store (or use our download links), install for free, sign in with Google, set a nickname and subjects, then start practicing or challenge friends.',
      guideLink: '/guide/gong-che-shang-guo-zhong-ying-wen-dan-zi-app',
      guideTitle: '通勤時間怎麼善用學習？',
    },
    {
      question: 'What is the AI explanation feature? How do I use it?',
      answer:
        'After you answer incorrectly, Dogtor can show an AI-generated explanation to help you understand the mistake and the reasoning. It appears automatically—no extra steps required.',
    },
    {
      question: 'How does the mistake notebook work?',
      answer:
        'Missed questions are saved automatically. You can review them anytime, and the system tracks mastery over time so weak areas become strengths.',
      guideLink: '/guide/guo-zhong-sheng-zen-me-zheng-li-cuo-ti-ben',
      guideTitle: '國中生如何整理錯題本？',
    },
    {
      question: 'How do friend battles work?',
      answer:
        'Add friends in the app, then start a real-time quiz battle. Both players answer the same set, comparing accuracy and speed. Results feed into achievements to make studying more motivating.',
    },
  ],
}

export function getFaqItems(locale) {
  return faqItemsByLocale[locale === 'en' ? 'en' : 'zh-TW']
}
