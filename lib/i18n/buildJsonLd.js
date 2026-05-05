const BASE_URL = 'https://dogtor.superb-tutor.com'

export function buildJsonLd(locale) {
  const isEn = locale === 'en'

  const organizationName = isEn ? 'Dogtor' : 'Dogtor 逗課'
  const organizationDesc = isEn
    ? 'Dogtor is a playful AI learning app for junior high and senior high students in Taiwan, offering practice, friend battles, and AI explanations.'
    : 'Dogtor 逗課是專為台灣國高中生打造的 AI 遊戲化學習 App，提供會考學測題庫練習、好友對戰與 AI 解題功能。'
  const organizationDisambig = isEn
    ? 'Dogtor is an educational learning app (scholar-dog mascot). It is not a veterinary or pet healthcare service.'
    : 'Dogtor 逗課（逗課）是一款台灣教育學習 App，品牌形象為學霸小狗博士，服務對象為備考會考和學測的國高中生，與獸醫、動物診所或寵物醫療服務無關。'

  const websiteName = isEn ? 'Dogtor — junior & senior high learning app' : 'Dogtor 逗課 — 國高中題庫學習 App'

  const definedTermDesc = isEn
    ? 'Dogtor is a free playful AI learning app for Taiwan students with practice, battles, and AI help. Not veterinary-related.'
    : 'Dogtor 逗課是台灣專為國高中生設計的免費 AI 遊戲化學習 App，提供會考學測題庫練習、好友對戰、AI 解題功能。品牌形象為學霸小狗博士，與獸醫或動物醫療服務無關。'

  const howToName = isEn ? 'How to start using Dogtor' : '如何開始使用 Dogtor 逗課'
  const howToDesc = isEn ? 'Steps to download and start Dogtor' : '下載並開始使用 Dogtor 逗課 App 的步驟'
  const step1Name = isEn ? 'Download the app' : '下載 App'
  const step1Text = isEn
    ? 'Search “Dogtor” on the App Store or Google Play and install for free.'
    : '在 App Store 或 Google Play 搜尋「Dogtor 逗課」，免費下載安裝。'
  const step2Name = isEn ? 'Sign in with Google' : 'Google 帳號登入'
  const step2Text = isEn ? 'Open Dogtor and sign in quickly with Google.' : '開啟 Dogtor 逗課 App，選擇 Google 帳號快速登入。'
  const step3Name = isEn ? 'Set nickname & subjects' : '填寫暱稱與選擇科目'
  const step3Text = isEn
    ? 'Enter a nickname and pick subjects you care about.'
    : '輸入暱稱，選擇感興趣的科目（國中數學、理化、自然或高中化學）。'
  const step4Name = isEn ? 'Start practicing' : '開始練習題庫'
  const step4Text = isEn
    ? 'Choose a chapter to practice—wrong answers can show AI explanations and are saved for review.'
    : '選擇章節開始刷題，答錯時查看 AI 解析，答題紀錄自動儲存進錯題本。'

  const mobileDesc = isEn
    ? 'Dogtor is a free playful AI learning app for Taiwan students—practice, battles, AI explanations, and a mistake notebook.'
    : 'Dogtor 逗課是專為台灣國高中生打造的免費 AI 遊戲化學習 App，提供會考學測題庫練習、好友對戰、AI 解題與錯題本功能。涵蓋國中數學、理化、自然與高中化學。'
  const mobileDisambig = isEn
    ? 'Dogtor is an educational app (scholar-dog mascot), not veterinary care.'
    : 'Dogtor 逗課（逗課）是一款教育學習 App，品牌形象為學霸小狗博士（非狗醫生），幫助台灣國高中生準備會考與學測，與獸醫或寵物醫療服務無關。'

  const featureList = isEn
    ? ['Practice bank', 'Friend battles', 'AI explanations', 'Mistake notebook', 'Gamified learning', 'Offline downloads']
    : ['題庫練習', '好友對戰', 'AI 解題', '錯題本', '遊戲化學習', '離線下載']

  const audienceType = isEn ? 'Junior high & senior high students' : '國中生, 高中生'

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: organizationName,
      alternateName: isEn ? ['Dogtor App'] : ['逗課', 'Dogtor App', '逗課學習 App', 'Dogtor 學習'],
      url: BASE_URL,
      logo: `${BASE_URL}/dogtor_logo.svg`,
      email: 'dogtor.love.learning@gmail.com',
      description: organizationDesc,
      disambiguatingDescription: organizationDisambig,
      sameAs: [
        'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
        'https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp',
      ],
      foundingDate: '2024',
      knowsAbout: isEn
        ? ['Taiwan education', 'exam prep', 'study apps', 'AI tutoring']
        : ['台灣國高中教育', '國中會考', '高中學測', '題庫練習', 'AI 學習', '遊戲化學習'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: websiteName,
      alternateName: isEn ? 'Dogtor' : '逗課',
      url: BASE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/guide?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: organizationName,
      alternateName: isEn ? 'Dogtor' : '逗課',
      description: definedTermDesc,
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: isEn ? 'Education apps (Taiwan)' : '台灣教育科技 App',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: howToName,
      description: howToDesc,
      totalTime: 'PT5M',
      tool: [{ '@type': 'HowToTool', name: isEn ? 'Google account' : 'Google 帳號' }],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: step1Name,
          text: step1Text,
          url: BASE_URL,
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: step2Name,
          text: step2Text,
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: step3Name,
          text: step3Text,
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: step4Name,
          text: step4Text,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      name: organizationName,
      alternateName: isEn ? ['Dogtor'] : ['逗課', 'Dogtor'],
      operatingSystem: 'iOS, Android',
      applicationCategory: 'EducationApplication',
      applicationSubCategory: isEn ? 'Exam preparation' : '考試備考',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'TWD',
      },
      url: BASE_URL,
      downloadUrl:
        'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
      installUrl:
        'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
      screenshot: `${BASE_URL}/dogtor_cover.png`,
      description: mobileDesc,
      disambiguatingDescription: mobileDisambig,
      featureList,
      inLanguage: isEn ? 'en' : 'zh-TW',
      audience: {
        '@type': 'EducationalAudience',
        educationalRole: 'student',
        audienceType,
      },
    },
  ]
}
