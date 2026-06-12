const messages = {
  'zh-TW': {
    common: {
      langSwitch: 'English',
      downloadApp: '下載 App',
    },
    header: {
      guide: '學習指南',
      faq: '常見問題',
      about: '關於我們',
      support: '支援中心',
      parentPro: '家長訂閱',
      menuLabel: '選單',
    },
    footer: {
      contact: '聯絡信箱：',
      copyright: (year) => `© ${year} Dogtor 逗課. 版權所有。`,
      links: {
        guide: '學習指南',
        terms: '服務條款',
        privacy: '隱私權政策',
        refund: '退款政策',
        support: '支援中心',
        faq: '常見問題',
      },
    },
    home: {
      badge: '全新發佈',
      heroTitle1: '精通知識，',
      heroTitle2: '征服島嶼！',
      heroTagline: '國高中題庫練習 · 會考學測分科複習 · AI 解題助手',
      heroSubtitle: '和 Dogtor 逗課 一起冒險，輕鬆練習題目，與好友對戰，同時學習成長。',
      floatTitle: '每日挑戰',
      floatDesc: '完成15天連勝！',
      appImgAlt: 'Dogtor 逗課 App 畫面 — 國高中題庫練習與學習島嶼',
      floatImgAlt: 'Dogtor 逗課的學習小狗 — 每日挑戰提醒',
      featuresSectionTitle: '為什麼選擇 Dogtor 逗課？',
      featuresSectionSubtitle: '我們結合教育與娛樂，讓學習變成你真正想做的事。',
      featureTeamImgAlt: 'Dogtor 逗課研發團隊 — 台大學生與補習班聯手開發、多位台大教授顧問指導',
      featureTeamTitle: '台大開發團隊',
      featureTeamDesc: '由台大學生、教授與補習班老師聯手開發，讓學生最有效學習、家長更放心。',
      feature1ImgAlt: 'Dogtor 逗課好友對戰與遊戲化成就 — 國高中生會考學測題庫對戰、蒐集星星解鎖成就',
      feature1Title: '好友對戰 × 成就',
      feature1Desc: '和朋友即時對戰、蒐集星星、解鎖成就，讓刷題像玩遊戲一樣輕鬆，邊玩邊把弱點變強項。',
      feature3ImgAlt: 'Dogtor 逗課 AI 個人化學習計畫 — 錯題本與歷屆試題推薦',
      feature3Title: '個人化學習計畫',
      feature3Desc: 'AI 驅動的推薦系統根據你的步調和目標量身打造學習體驗，確保你始終保持在正軌上。',
      guideSectionTitle: '精選學習攻略',
      guideSectionSubtitle: '會考學測準備、讀書方法、通勤學習，一次掌握。',
      viewAllGuides: '查看全部學習指南',
      ctaTitle: '準備好開始你的學習冒險了嗎？',
      ctaSubtitle: '立即下載 Dogtor 逗課 App，免費開始練習國高中題庫，和同學一起備戰會考學測。',
    },
    faq: {
      pageTitle: '常見問題',
      pageSubtitle: '關於 Dogtor 逗課 的所有疑問，在這裡找到答案。',
      ctaText: '還有其他問題嗎？',
      contactSupport: '聯絡支援中心',
      items: [
        {
          question: 'Dogtor 逗課是什麼？跟狗醫生或獸醫有關嗎？',
          answer:
            'Dogtor 逗課是一款專為台灣國高中生設計的 AI 學習 App，與獸醫、狗醫生或寵物醫療服務完全無關。品牌名稱「Dogtor」來自學霸小狗博士的形象，象徵認真學習、知識淵博的精神；中文名「逗課」意指逗趣上課，讓學習充滿樂趣。Dogtor 逗課提供國中會考、高中學測的題庫練習、好友對戰和 AI 解題功能；由台大學生與補習班老師聯手開發，並由多位台大教授顧問在 AI、軟體、HCI、學習互動等方面提供專業指導。',
        },
        {
          question: 'Dogtor 逗課是誰開發的？團隊背景是什麼？',
          answer:
            'Dogtor 逗課是一款專為國高中生打造的 AI 學習 App，由台大學生與補習班老師聯手開發，並由多位台大教授擔任顧問，在 AI、軟體、HCI（人機互動）、學習互動等方面提供專業指導。這個組合確保 App 的每一個功能設計都兼具實用價值與技術嚴謹度，家長可以放心讓孩子使用。',
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
          answer:
            '我們目前涵蓋國中數學、自然和高中化學，並會根據用戶回饋持續新增更多科目。',
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
          answer:
            '是的，我們非常重視隱私。你的資料都經過加密，我們絕不會將你的個人資訊出售給第三方。',
        },
        {
          question: 'App 一直閃退，該怎麼辦？',
          answer:
            '請先嘗試更新到最新版本。如果問題持續存在，請透過下方的支援中心聯絡我們的團隊。',
        },
        {
          question: '如何刪除我的帳號？',
          answer:
            '如果你想刪除帳號，請透過支援中心傳送請求給我們，我們會在 1-3 個工作天內處理。',
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
    },
    about: {
      pageTitle: '關於我們',
      pageSubtitle: '我們的使命是讓學習變成一場冒險。',
      missionTitle: '我們的使命',
      missionP1:
        'Dogtor 逗課 建立在一個簡單的信念上：教育不應該無聊。我們結合遊戲的吸引力與社群學習的力量，打造一個讓學生真正愛上學習的平台。',
      missionP2:
        '我們相信，當學習變得有趣時，學生會更投入、更有動力，並且能記住更多知識。透過遊戲化元素、社群互動和個人化學習路徑，我們正在重新定義教育的未來。',
      problemTitle: '我們解決的問題',
      problemP1:
        '傳統的學習方式往往讓人感到孤立和缺乏動力。學生們面對著枯燥的教材，缺少即時反饋和社群支持。這導致了學習效率低下，甚至讓許多人對學習產生抗拒。',
      problemP2:
        'Dogtor 逗課 透過引入遊戲化元素，將「學習」這件苦差事轉變為一種有趣的日常習慣。我們讓學習變得社交化、視覺化，並且充滿成就感。',
      teamTitle: '團隊介紹',
      teamP1:
        'Dogtor 逗課 是一款專為國高中生打造的 AI 學習 App，由台大學生與補習班老師聯手開發，並由多位台大教授擔任顧問指導。從產品設計到學習體驗，每一個細節都結合第一線教育經驗與學術專業，確保孩子拿到手上的 App 兼具實用價值與技術嚴謹度。',
      teamP2:
        '台大學生團隊負責 AI 技術研發與產品開發，補習班老師帶來多年備考輔導的第一線經驗，多位台大教授顧問則在 AI、軟體、HCI（人機互動）、學習互動等方面提供專業指導。這是我們敢說 Dogtor 逗課 不只是另一款學習 App 的原因。',
      contactLabel: '聯絡我們：',
      ctaTitle: '加入我們的學習冒險',
      ctaText: '準備好體驗全新的學習方式了嗎？立即下載 Dogtor 逗課 App，開始你的島嶼冒險！',
      contactSupport: '聯絡支援',
    },
    support: {
      pageTitle: '支援中心',
      pageSubtitle: '我們隨時準備協助你回到學習的正軌。',
      contactTitle: '聯絡我們',
      contactTextPre: '如有任何問題、反饋或建議，請直接透過電子郵件聯絡我們。我們會在',
      contactTextPost: '內回覆。',
      contactDays: '1-3 個工作天',
      emailLabel: '電子郵件',
      responseLabel: '回覆時間',
      responseDays: '1-3 個工作天',
      quickActionsTitle: '快速操作',
      quickActionsText: '以下是一些常見的支援項目，點擊即可快速處理：',
      actions: {
        faq: { title: '常見問題', desc: '查看常見問題解答' },
        bug: { title: '回報錯誤', desc: '告訴我們遇到的問題' },
        login: { title: '帳號登入', desc: '無法登入或忘記密碼' },
        billing: { title: '訂閱退款', desc: '關於訂閱和退款問題' },
        delete: { title: '刪除資料', desc: '請求刪除帳號或資料' },
        feature: { title: '功能建議', desc: '分享你的想法' },
      },
      emailSubjects: {
        bug: '錯誤回報',
        login: '帳號登入問題',
        billing: '訂閱與退款',
        delete: '資料刪除請求',
        feature: '功能建議',
      },
      tipTitle: '寄信時請提供',
      tipItems: [
        '問題的詳細描述',
        '發生問題的時間',
        '你的裝置型號和 iOS 版本',
        '相關的螢幕截圖（如果可以的話）',
      ],
      tipNote: '提供越詳細的資訊，我們就能越快幫你解決問題！',
    },
    guide: {
      pageTitle: '國高中學習指南',
      pageSubtitle: '會考學測必備攻略、讀書方法、家長指南、App 推薦。解決學習過程中的焦慮與效率問題。',
      categories: {
        all: '全部',
        '會考準備': '會考準備',
        '學測攻略': '學測攻略',
        '讀書方法': '讀書方法',
        '家長指南': '家長指南',
        'App 推薦': 'App 推薦',
      },
    },
    parentPro: {
      pageTitle: '家長專區 Parent Pro（家長方案）',
      pageSubtitle: '用數據參與孩子的每一步成長，給予最精準的支持與陪伴。',
      heroTitle: '將關心轉化為',
      heroTitleHighlight: '實質的學習助力',
      heroDesc: '全面升級的學習工具，結合 LINE 即時數據回報。不只讓家長安心，更讓孩子學習效率翻倍，完全沉浸在無干擾的知識宇宙中。',
      heroBadge: 'Parent Pro · 家長訂閱方案',
      heroPriceHint: 'NT$ 9/天起 · 月繳或年繳，隨時可取消',
      viewPlansButton: '了解完整功能',
      
      coreFeatureBadge: '核心主打',
      coreFeatureTitle: 'LINE 即時學習報表',
      coreFeatureDesc: '無需額外下載 App，孩子的每日學習動態、強弱項分析與每月專業評估報告，直接推播至您的 LINE。隨時掌握，關心不再有代溝。',
      
      gridTitle: '解鎖全方位學習超能力',
      gridSubtitle: '訂閱 Parent Pro，讓孩子獲得更多專屬優勢，學習不受限。',
      
      featureEnergyTitle: '無限學習體力',
      featureEnergyDesc: '告別次數限制，獲得更多體力值，讓孩子每日能進行更多測驗與學習體驗，探索知識不中斷。',
      
      featureCustomTitle: '拍照生成專屬題庫',
      featureCustomDesc: '拍下自己的學習內容（例如英文雜誌或課外讀物），AI 直接將其轉換為專屬於孩子的個人題庫。',
      
      featureNotebookTitle: '無限錯題本與 AI 解惑',
      featureNotebookDesc: '錯題收錄無上限，並大幅提升 AI 詢問次數。不懂的地方隨時問，將弱點徹底轉化為強項。',
      
      featureAdFreeTitle: '全站無廣告',
      featureAdFreeDesc: '移除所有干擾，給孩子最專注的學習體驗。',

      lineTitle: '專屬 LINE 報表',
      lineDesc: '即時接收學習動態與專業評估，陪伴零距離。',
      lineButton: '加入 LINE',
      pricingTitle: '選擇最適合您的方案',
      pricingSubtitle: '陪伴孩子學習最值得的投資，每天不到一杯咖啡的價格。',
      monthlyPlan: '月繳方案',
      monthlyPrice: 'NT$ 300 / 月',
      yearlyPlan: '年繳方案',
      yearlyPrice: 'NT$ 3,000 / 年',
      yearlySave: '省下 NT$ 600',
      monthlyDailyPrice: '平均每天只要 10 元',
      yearlyDailyPrice: '平均每天不到 9 元',
      planFeatures: [
        { icon: 'MessageCircle', text: '每日學習成效訊息回報', color: '#06C755', important: true },
        { icon: 'BatteryCharging', text: '無限學習體力', color: '#FFD166' },
        { icon: 'Camera', text: '拍照生成專屬題庫', color: '#118AB2' },
        { icon: 'Sparkles', text: '錯題本與 AI 解惑額度提升', color: '#EF476F' },
        { icon: 'ShieldCheck', text: '全站無廣告', color: '#9D4EDD' }
      ],
      subscribeButton: '立即訂閱',
      alreadySubscribed: '已經訂閱？',
      manageLink: '管理訂閱',
      homeSection: '家長專區',
      homeSectionTitle: '您知道孩子今天學了什麼嗎？',
      homeSectionDesc: 'Dogtor Parent Pro（家長方案）讓您即時掌握孩子的學習進度，AI 報告一目了然，陪伴更有方向、支持更有力量。',
      homeSectionButton: '了解 Parent Pro（家長方案）',
    },
    pricing: {
      pageTitle: '訂閱方案',
      pageSubtitle: '選擇最適合您的方案，開始掌握孩子的學習狀況。',
      freePlanName: '免費方案',
      freePlanPrice: 'NT$ 0',
      freePlanFeatures: ['國高中題庫練習', '好友對戰', 'AI 解題助手', '錯題本'],
      freePlanButton: '下載 App',
      parentProLabel: 'Parent Pro（家長方案）',
    },
    subscribe: {
      pageTitle: '訂閱 Dogtor Parent Pro（家長方案）',
      back: '返回',
      choosePlan: '選擇訂閱方案',
      monthly: '月繳',
      yearly: '年繳',
      monthlyPrice: 'NT$ 300 / 月',
      yearlyPrice: 'NT$ 3,000 / 年',
      yearlySave: '省下 NT$ 600',
      subscribing: '前往付款...',
      subscribe: '前往付款',
      notInLine: 'LINE 登入失敗',
      notInLineDesc: '無法完成 LINE 登入驗證，請確認網路連線後重新整理頁面，或透過 Dogtor 家長 LINE 官方帳號的選單點擊「訂閱」。',
      canceled: '付款已取消',
      canceledDesc: '您已取消付款，可以隨時再次訂閱。',
      successTitle: '訂閱成功！',
      successDesc: '請將以下授權碼提供給孩子，在 DOGTOR App 中輸入即可完成綁定（點擊頭像 -> 右上角設定）。',
      authCode: '授權碼',
      copyCode: '複製授權碼',
      copied: '已複製！',
      codeExpiry: '授權碼將在 72 小時後失效，請儘快讓孩子完成綁定。',
      loadingCode: '正在取得授權碼...',
      errorCode: '取得授權碼失敗，請稍後再試或聯絡客服。',
      stepTitle: '綁定步驟',
      step1: '複製上方授權碼',
      step2: '讓孩子開啟 Dogtor App',
      step3: '在 App 中輸入授權碼完成綁定',
      manageTitle: '管理訂閱',
      manageDesc: '查看帳單、更換付款方式或取消訂閱。',
      manageButton: '前往管理',
      portalLoading: '正在開啟...',
      portalError: '無法開啟訂閱管理頁面，可能尚未建立訂閱。',
    },
  },

  en: {
    common: {
      langSwitch: '中文',
      downloadApp: 'Download App',
    },
    header: {
      guide: 'Guides',
      faq: 'FAQ',
      about: 'About',
      support: 'Support',
      parentPro: 'Parent Plan',
      menuLabel: 'Menu',
    },
    footer: {
      contact: 'Contact:',
      copyright: (year) => `© ${year} Dogtor. All rights reserved.`,
      links: {
        guide: 'Learning Guides',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        refund: 'Refund Policy',
        support: 'Support Center',
        faq: 'FAQ',
      },
    },
    home: {
      badge: 'New Release',
      heroTitle1: 'Master Knowledge,',
      heroTitle2: 'Conquer Islands!',
      heroTagline: 'Quiz Practice · Exam Review · AI Study Assistant',
      heroSubtitle:
        'Adventure with Dogtor, practice questions effortlessly, battle friends, and grow together.',
      floatTitle: 'Daily Challenge',
      floatDesc: '15-day streak!',
      appImgAlt: 'Dogtor App screenshot — quiz practice and learning islands',
      floatImgAlt: 'Dogtor study dog — daily challenge reminder',
      featuresSectionTitle: 'Why Choose Dogtor?',
      featuresSectionSubtitle:
        'We blend education and entertainment to make learning something you actually want to do.',
      featureTeamImgAlt: 'Dogtor team — jointly developed by NTU students and cram-school teachers, advised by NTU professors',
      featureTeamTitle: 'A Team You Can Trust',
      featureTeamDesc:
        'Jointly developed by NTU students and cram-school teachers, with product guidance from multiple NTU professor advisors.',
      feature1ImgAlt: 'Dogtor friend battles and gamified achievements — challenge friends, collect stars, unlock achievements',
      feature1Title: 'Friend Battles & Achievements',
      feature1Desc:
        'Challenge friends in real-time quiz battles, collect stars, and unlock achievements — making practice as addictive as a game.',
      feature3ImgAlt: 'Dogtor AI personalized learning plan — mistake book and question recommendations',
      feature3Title: 'Personalized Learning Plan',
      feature3Desc:
        'An AI-powered recommendation system tailors your learning experience to your pace and goals, keeping you on track.',
      guideSectionTitle: 'Featured Guides',
      guideSectionSubtitle:
        'Exam prep strategies, study methods, and learning on-the-go — all in one place.',
      viewAllGuides: 'View All Guides',
      ctaTitle: 'Ready to Start Your Learning Adventure?',
      ctaSubtitle:
        'Download Dogtor now and start practicing for free. Join your classmates in conquering the exam!',
    },
    faq: {
      pageTitle: 'FAQ',
      pageSubtitle: 'Find answers to all your questions about Dogtor.',
      ctaText: 'Still have questions?',
      contactSupport: 'Contact Support',
      items: [
        {
          question: 'What is Dogtor? Is it related to veterinarians?',
          answer:
            'Dogtor is an AI learning app designed for junior and senior high school students in Taiwan. It has nothing to do with veterinarians, animal doctors, or pet medical services. The name "Dogtor" is inspired by a scholar-dog mascot symbolizing dedication and knowledge. Dogtor is jointly developed by NTU (National Taiwan University) students and cram-school teachers, and advised by multiple NTU professors across AI, software, HCI, and learning-interaction design.',
        },
        {
          question: 'Who builds Dogtor? What is the team\'s background?',
          answer:
            'Dogtor is an AI learning app for junior and senior high school students, jointly developed by NTU (National Taiwan University) students and cram-school teachers, with multiple NTU professors serving as advisors across AI, software, HCI (human-computer interaction), and learning-interaction design. This combination ensures every product detail on Dogtor is both practical and technically rigorous.',
        },
        {
          question: 'Is the app free?',
          answer:
            'Yes! Dogtor is free to download and use. We may offer premium features in the future, but the core experience will always remain free.',
        },
        {
          question: 'Can I learn with friends?',
          answer:
            'Absolutely. Social learning is at the core of Dogtor. You can challenge friends to quiz battles and earn achievement titles together.',
        },
        {
          question: 'What subjects are covered?',
          answer:
            'We currently cover junior high Math, Natural Science, and senior high Chemistry. More subjects will be added based on user feedback.',
        },
        {
          question: 'Where do the questions come from?',
          answer:
            'We compile publicly available learning resources and curriculum standards, map knowledge points for each chapter, and use large language models (LLMs) to generate questions based on those points. Each question is then reviewed and refined by our team to ensure accuracy and educational quality.',
        },
        {
          question: 'When will more subjects be added?',
          answer:
            'We are actively looking for educators to collaborate on new subjects. Dogtor has established a pipeline for generating, reviewing, and publishing questions for different subjects, but we prioritize educational quality and work with professional teachers to build content. If you are interested in collaborating, please reach out through the support center or email dogtor.love.learning@gmail.com.',
        },
        {
          question: 'Is my data safe?',
          answer:
            'Yes, we take privacy very seriously. Your data is encrypted and we will never sell your personal information to third parties.',
        },
        {
          question: 'The app keeps crashing. What should I do?',
          answer:
            'Please try updating to the latest version first. If the problem persists, contact our team through the Support Center below.',
        },
        {
          question: 'How do I delete my account?',
          answer:
            'If you want to delete your account, please send us a request through the Support Center and we will process it within 1–3 business days.',
        },
        {
          question: 'Is Dogtor available on Android?',
          answer:
            'Yes! Dogtor is now on Google Play. Android users can search "Dogtor" in the Play Store to download for free, or click the Google Play button on this page.',
        },
        {
          question: 'How do I report issues or suggest new features?',
          answer:
            'We love hearing from you! Send us a message through the Support Center or email us directly at dogtor.love.learning@gmail.com.',
        },
        {
          question: 'Will my progress sync across devices?',
          answer:
            'Yes, all your learning progress, achievements, and island settings are automatically synced to the cloud so you can continue learning on any device.',
        },
        {
          question: 'Why do I have to re-enter my nickname or interests every time I open the app?',
          answer:
            'This usually happens when the account registration was not completed successfully, preventing the system from reading your data. Please follow these steps:\n\n1. Log out of the app\n2. Log back in with your Google account\n3. Re-entering your nickname and interests after logging back in is normal\n\nYour account should work normally after that. If the issue persists, try logging out again and signing in with a different Google account. If it still cannot be resolved, please contact us through the Support Center.',
        },
        {
          question: 'What grade levels is Dogtor designed for?',
          answer:
            'Dogtor is primarily designed for junior high students (grades 7–9) and senior high students (grades 10–12). Junior high students can use Math, Natural Science, and past exam questions to prepare for the Basic Competency Test; senior high students can use the Chemistry question bank to strengthen their Academic Ability Test preparation.',
          guideLink: '/guide/xue-ce-dao-shu-yi-ge-yue-ke-yi-zuo-shen-me',
          guideTitle: 'What can you do one month before the Academic Ability Test?',
        },
        {
          question: 'How do I get started with Dogtor?',
          answer:
            'Simply search "Dogtor" on the App Store or click the download link, install for free, log in with your Google account, enter your nickname and subject interests, and you can immediately start practicing questions or challenging friends.',
          guideLink: '/guide/gong-che-shang-guo-zhong-ying-wen-dan-zi-app',
          guideTitle: 'How to make the most of your commute for studying?',
        },
        {
          question: 'What is the AI explanation feature and how do I use it?',
          answer:
            'After you answer a question incorrectly, Dogtor provides a detailed AI-generated explanation to help you understand why you got it wrong and how to approach the problem. This feature appears automatically after a wrong answer — no extra steps needed — so you get the most effective feedback at exactly the right moment.',
        },
        {
          question: 'How does the mistake book work?',
          answer:
            'Every question you answer incorrectly is automatically added to your mistake book. You can open the mistake book anytime to review your weak points. The system tracks how well you have mastered each mistake question, helping you efficiently turn weaknesses into strengths.',
          guideLink: '/guide/guo-zhong-sheng-zen-me-zheng-li-cuo-ti-ben',
          guideTitle: 'How should junior high students organize their mistake books?',
        },
        {
          question: 'How does friend battle work?',
          answer:
            'You can add friends within the app and challenge them to a real-time quiz battle. Both players answer the same questions simultaneously, competing on accuracy and speed. Final rankings and points are awarded based on performance. Battle results count toward the achievement system, making learning competitively fun.',
        },
      ],
    },
    about: {
      pageTitle: 'About Us',
      pageSubtitle: 'Our mission is to turn learning into an adventure.',
      missionTitle: 'Our Mission',
      missionP1:
        'Dogtor is built on a simple belief: education should not be boring. We combine the appeal of games with the power of social learning to create a platform where students genuinely love to learn.',
      missionP2:
        'We believe that when learning is fun, students become more engaged, more motivated, and retain more knowledge. Through gamification, social interaction, and personalized learning paths, we are redefining the future of education.',
      problemTitle: 'The Problem We Solve',
      problemP1:
        'Traditional study methods often feel isolating and demotivating. Students face dry materials without immediate feedback or community support, leading to low efficiency and even a resistance to learning.',
      problemP2:
        'Dogtor transforms studying from a chore into an enjoyable daily habit through gamification. We make learning social, visual, and filled with a sense of achievement.',
      teamTitle: 'Our Team',
      teamP1:
        'Dogtor is an AI learning app designed for junior and senior high school students, jointly developed by National Taiwan University (NTU) students and cram-school teachers, and advised by multiple NTU professors. From product design to learning experience, every detail combines frontline educational experience with academic expertise — so the app your child uses is both practical and technically rigorous.',
      teamP2:
        'Our NTU student team leads AI research and product engineering; cram-school teachers bring years of frontline exam-prep experience; and multiple NTU professor advisors provide expert guidance across AI, software, HCI (human-computer interaction), and learning-interaction design. This is why Dogtor is more than just another learning app.',
      contactLabel: 'Contact us:',
      ctaTitle: 'Join Our Learning Adventure',
      ctaText:
        'Ready to experience a whole new way of learning? Download Dogtor now and start your island adventure!',
      contactSupport: 'Contact Support',
    },
    support: {
      pageTitle: 'Support Center',
      pageSubtitle: 'We are always ready to help you get back on track with your learning.',
      contactTitle: 'Contact Us',
      contactTextPre: 'For any questions, feedback, or suggestions, please reach out to us directly by email. We will respond within',
      contactTextPost: '.',
      contactDays: '1–3 business days',
      emailLabel: 'Email',
      responseLabel: 'Response Time',
      responseDays: '1–3 business days',
      quickActionsTitle: 'Quick Actions',
      quickActionsText: 'Here are some common support options — click to get started quickly:',
      actions: {
        faq: { title: 'FAQ', desc: 'Browse frequently asked questions' },
        bug: { title: 'Report a Bug', desc: 'Tell us about the issue you encountered' },
        login: { title: 'Account Login', desc: 'Cannot log in or forgot password' },
        billing: { title: 'Billing & Refunds', desc: 'Questions about subscriptions and refunds' },
        delete: { title: 'Delete Data', desc: 'Request to delete your account or data' },
        feature: { title: 'Feature Request', desc: 'Share your ideas with us' },
      },
      emailSubjects: {
        bug: 'Bug Report',
        login: 'Account Login Issue',
        billing: 'Subscription & Refund',
        delete: 'Data Deletion Request',
        feature: 'Feature Suggestion',
      },
      tipTitle: 'When emailing us, please include',
      tipItems: [
        'A detailed description of the issue',
        'When the issue occurred',
        'Your device model and iOS version',
        'Relevant screenshots (if possible)',
      ],
      tipNote: 'The more detail you provide, the faster we can help you!',
    },
    guide: {
      pageTitle: 'Learning Guides',
      pageSubtitle:
        'Exam prep strategies, study methods, parent guides, and app recommendations — all in one place.',
      categories: {
        all: 'All',
        '會考準備': 'Basic Competency Test',
        '學測攻略': 'Academic Ability Test',
        '讀書方法': 'Study Methods',
        '家長指南': 'Parent Guide',
        'App 推薦': 'App Picks',
      },
    },
    parentPro: {
      pageTitle: 'Parent Pro',
      pageSubtitle: 'Participate in your child\'s growth with data-driven insights and precise support.',
      heroTitle: 'Turn Your Care Into',
      heroTitleHighlight: 'Real Learning Power',
      heroDesc: 'Upgraded learning tools paired with instant LINE reports. Give your child an edge and stay fully informed of their progress in a distraction-free environment.',
      heroBadge: 'Parent Pro · Subscription Plan',
      heroPriceHint: 'From NT$9/day · Monthly or yearly · Cancel anytime',
      viewPlansButton: 'Explore Features',
      
      coreFeatureBadge: 'Core Feature',
      coreFeatureTitle: 'Instant LINE Reports',
      coreFeatureDesc: 'No extra apps needed. Receive daily learning updates, weakness analysis, and monthly professional reports directly on your LINE. Stay connected effortlessly.',
      
      gridTitle: 'Unlock Premium Learning Powers',
      gridSubtitle: 'Subscribe to Parent Pro and give your child the ultimate advantage.',
      
      featureEnergyTitle: 'More Learning Energy',
      featureEnergyDesc: 'Say goodbye to limits. Get more stamina for daily tests and learning experiences. Keep the momentum going.',
      
      featureCustomTitle: 'Snap & Generate Custom Questions',
      featureCustomDesc: 'Take a picture of any learning material, such as an English magazine, and let AI instantly turn it into a personalized question bank.',
      
      featureNotebookTitle: 'Upgraded AI & Mistake Book',
      featureNotebookDesc: 'Higher limits for the mistake notebook and AI question-answering. Turn weaknesses into strengths with on-demand help.',
      
      featureAdFreeTitle: 'Ad-Free Experience',
      featureAdFreeDesc: 'Remove all ads for a purely focused learning environment.',

      lineTitle: 'LINE Reports',
      lineDesc: 'Get instant updates and insights directly on your LINE.',
      lineButton: 'Add LINE',
      pricingTitle: 'Simple, Transparent Pricing',
      pricingSubtitle: 'The best investment in your child\'s learning — for less than the cost of a coffee a day.',
      monthlyPlan: 'Monthly Plan',
      monthlyPrice: 'NT$ 300 / mo',
      yearlyPlan: 'Yearly Plan',
      yearlyPrice: 'NT$ 3,000 / yr',
      yearlySave: 'Save NT$ 600',
      monthlyDailyPrice: 'Only NT$10 / day',
      yearlyDailyPrice: 'Less than NT$9 / day',
      planFeatures: [
        { icon: 'MessageCircle', text: 'Daily learning effectiveness message report via LINE', color: '#06C755', important: true },
        { icon: 'BatteryCharging', text: 'More learning energy', color: '#FFD166' },
        { icon: 'Camera', text: 'Snap & generate custom questions', color: '#118AB2' },
        { icon: 'Sparkles', text: 'Higher AI & mistake limits', color: '#EF476F' },
        { icon: 'ShieldCheck', text: 'Ad-free experience', color: '#9D4EDD' }
      ],
      subscribeButton: 'Subscribe Now',
      alreadySubscribed: 'Already subscribed?',
      manageLink: 'Manage subscription',
      homeSection: 'Parent Pro',
      homeSectionTitle: 'Do you really know what your child learned today?',
      homeSectionDesc: 'Dogtor Parent Pro keeps you in sync with real-time progress tracking, AI-powered insights, and personalized recommendations.',
      homeSectionButton: 'Learn About Parent Pro',
    },
    pricing: {
      pageTitle: 'Pricing Plans',
      pageSubtitle: 'Choose the plan that works best for you and start tracking your child\'s learning.',
      freePlanName: 'Free Plan',
      freePlanPrice: 'NT$ 0',
      freePlanFeatures: ['Quiz practice for all grades', 'Friend battles', 'AI study assistant', 'Mistake book'],
      freePlanButton: 'Download App',
      parentProLabel: 'Parent Pro（家長方案）',
    },
    subscribe: {
      pageTitle: 'Subscribe to Dogtor Parent Pro（家長方案）',
      back: 'Back',
      choosePlan: 'Choose a Plan',
      monthly: 'Monthly',
      yearly: 'Yearly',
      monthlyPrice: 'NT$ 300 / mo',
      yearlyPrice: 'NT$ 3,000 / yr',
      yearlySave: 'Save NT$ 600',
      subscribing: 'Redirecting to payment...',
      subscribe: 'Proceed to Payment',
      notInLine: 'LINE Login Failed',
      notInLineDesc: 'Could not complete LINE login. Please check your internet connection and refresh the page, or tap "Subscribe" from the Dogtor Parent LINE official account menu.',
      canceled: 'Payment Canceled',
      canceledDesc: 'You have canceled the payment. You can subscribe again anytime.',
      successTitle: 'Subscription Successful!',
      successDesc: 'Please share the authorization code below with your child. They can enter it in the Dogtor App to complete the connection.',
      authCode: 'Authorization Code',
      copyCode: 'Copy Code',
      copied: 'Copied!',
      codeExpiry: 'This code expires in 72 hours. Please have your child complete the connection as soon as possible.',
      loadingCode: 'Retrieving authorization code...',
      errorCode: 'Failed to retrieve the authorization code. Please try again later or contact support.',
      stepTitle: 'Connection Steps',
      step1: 'Copy the authorization code above',
      step2: 'Have your child open the Dogtor App',
      step3: 'Enter the authorization code in the App to complete the connection',
      manageTitle: 'Manage Subscription',
      manageDesc: 'View bills, change payment method, or cancel your subscription.',
      manageButton: 'Manage Subscription',
      portalLoading: 'Opening...',
      portalError: 'Could not open subscription management. You may not have an active subscription.',
    },
  },
}

export function getMessages(locale) {
  return messages[locale] || messages['zh-TW']
}
