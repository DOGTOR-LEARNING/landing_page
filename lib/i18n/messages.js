const messages = {
  'zh-TW': {
    common: {
      langSwitch: 'English',
      langShort: 'EN',
      downloadApp: '下載 App',
    },
    header: {
      guide: '學習指南',
      faq: '常見問題',
      about: '關於我們',
      support: '聯絡客服',
      reviews: '網友評價',
      news: '逗課動態',
      helpMenu: '支援中心',
      parentPro: '家長訂閱',
      menuLabel: '選單',
    },
    company: {
      title: '公司資訊',
      intro: 'Dogtor 逗課 App 與 Dogtor 逗課 LINE 官方帳號由下列公司開發及營運：',
      nameLabel: '公司名稱',
      taxIdLabel: '統一編號',
      representativeLabel: '負責人',
      addressLabel: '公司地址',
      emailLabel: '客服信箱',
    },
    footer: {
      contact: '聯絡信箱：',
      operatedBy: '本網站與 Dogtor 逗課 App 由',
      operatedBySuffix: '開發及營運',
      copyright: (year) => `© ${year} Dogtor 逗課. 版權所有。`,
      links: {
        guide: '學習指南',
        terms: '服務條款',
        privacy: '隱私權政策',
        refund: '退款政策',
        support: '支援中心',
        faq: '常見問題',
        reviews: '網友評價',
        news: '逗課動態',
      },
    },
    home: {
      badge: '家長功能特價中',
      heroTitle1: '終結盲目學習，',
      heroTitle2: '比你還懂你自己',
      heroTagline: 'AI 診斷弱點 · 一題學透一個知識點 · 每天十分鐘',
      heroSubtitle: '別再盲目刷題！學霸贏在「刷一題，就學透一個知識點」。Dogtor 用 AI 找出你真正卡住的觀念，科目章節任你選，每天十分鐘快速複習所學內容——把時間花在真的會進步的地方。',
      lineCta: '加入 LINE 接收每日學習分析和錯題報告',
      floatTitle: '每日挑戰',
      floatDesc: '完成15天連勝！',
      appImgAlt: 'Dogtor 逗課 App 畫面 — 可愛的國高中題庫練習與學習島嶼',
      floatImgAlt: 'Dogtor 逗課可愛的學霸小狗博士 — 每日挑戰提醒',
      featuresSectionTitle: '為什麼學霸都在用 Dogtor 逗課？',
      featuresSectionSubtitle: '不是刷更多題，而是每一題都學透——用最少的時間，補起最關鍵的觀念缺口。',
      featureTeamImgAlt: 'Dogtor 逗課學習島嶼 — 一題學透一個知識點的遊戲化闖關複習',
      featureTeamTitle: '刷一題，學透一個知識點',
      featureTeamDesc: '每一題都對應到一個知識點，答錯就立刻補上觀念、收進錯題本，AI 再推薦你下一題最該練什麼。科目章節任你選，每天十分鐘就能把弱點變強項；也能拍照上傳筆記講義，讓 AI 生成專屬題庫。',
      feature1ImgAlt: 'Dogtor 逗課由台大學生與補習班老師聯手打造，台大教授顧問群提供 AI 與學習互動專業指導',
      feature1Title: '台大團隊',
      feature1Desc: '由台大學生與補習班老師聯手開發，並由台大教授顧問在 HCI（人機互動）、學習互動等方面提供專業指導，確保功能兼具第一線教育經驗與學術嚴謹度。',
      feature3ImgAlt: 'Dogtor 逗課好友對戰與排行榜 — 揪同學一起學習互動、即時 PvP 答題對戰',
      feature3Title: '揪朋友一起對戰',
      feature3Desc: '加好友即時 PvP 答題對戰、比拼正確率與速度，還有排行榜和成就等你解鎖——和同學一起學習互動，備考不再孤單。',
      guideSectionTitle: '精選學習攻略',
      guideSectionSubtitle: '會考學測準備、讀書方法、通勤學習，一次掌握。',
      viewAllGuides: '查看全部學習指南',
      ctaTitle: '每天十分鐘，開始比昨天更懂自己',
      ctaSubtitle: '立即免費下載 Dogtor 逗課，讓 AI 幫你找出真正卡住的觀念，用最有效率的方式備戰會考學測。',
    },
    faq: {
      pageTitle: '常見問題',
      pageSubtitle: '關於 Dogtor 逗課 的所有疑問，在這裡找到答案。',
      ctaText: '還有其他問題嗎？',
      contactSupport: '聯絡支援中心',
      studentSectionTitle: '學生常見問題',
      parentSectionTitle: '家長訂閱 Parent Pro',
      parentSectionSubtitle: '關於 Parent Pro 家長訂閱方案的常見問題。',
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
            '國中涵蓋數學、自然、社會與國中會考考古題；高中涵蓋化學、生物、公民、地理、歷史，並會持續新增更多科目。除此之外，還有「客製化 AI 生題庫」，不受既有科目限制——你可以拍照或上傳任何檔案，讓 AI 依內容生成專屬題庫。',
        },
        {
          question: '可以把自己的筆記、講義或課本變成題目嗎？（客製化 AI 生題庫）',
          answer:
            '可以！這是 Dogtor 逗課很受歡迎的功能。只要拍照或上傳任何檔案（筆記、講義、課本、考卷、PDF、圖片），AI 就會依照你傳入的內容，自動生成一份客製化、超好玩有趣的題庫。不論是課本外的補充教材、老師自製講義，還是任何你想練習的內容，都能立刻變成可以互動作答的遊戲化題目，不受既有科目限制。',
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
            'Dogtor 逗課主要針對國中生（七至九年級）和高中生（十至十二年級）設計。國中生可以使用數學、自然、社會等科目以及會考考古題備戰會考；高中生則可透過化學、生物、公民、地理、歷史題庫強化學測與分科準備。此外還能拍照或上傳檔案，用 AI 生成客製化題庫，任何科目都適用。',
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
      parentSections: [
        {
          title: '訂閱與付款',
          items: [
            {
              question: 'Parent Pro 有哪些方案？',
              answer: 'Parent Pro 提供月訂閱和年訂閱兩種方案。年訂閱享有更優惠的價格。訂閱期間，綁定的孩子可使用所有 Dogtor Pro 功能。',
            },
            {
              question: '如何訂閱 Parent Pro？',
              answer: '1. 透過 LINE 官方帳號輸入「訂閱」，點選連結前往訂閱頁面。\n\n2. 選擇方案並完成付款。\n\n3. 付款成功後，系統會自動產生一組授權碼。\n\n4. 將授權碼提供給孩子，在 App 中輸入即可啟用 Dogtor Pro。',
            },
            {
              question: '付款方式有哪些？',
              answer: '支援信用卡及簽帳金融卡（Visa、Mastercard、JCB）。付款由 Paddle 安全處理。',
            },
            {
              question: '訂閱會自動續訂嗎？',
              answer: '會。訂閱到期前系統會自動續訂，孩子的 Dogtor Pro 功能不會中斷。如果需要取消，請在到期前透過 LINE 官方帳號輸入「取消訂閱」進行管理。',
            },
            {
              question: '如何取消訂閱？',
              answer: '透過 LINE 官方帳號輸入「取消訂閱」，系統會提供訂閱管理頁面的連結。您可以在該頁面取消訂閱、更換付款方式或查看帳單紀錄。取消後，孩子可繼續使用 Dogtor Pro 功能直到當期結束。',
            },
            {
              question: '付款失敗怎麼辦？',
              answer: '請確認信用卡額度是否充足，或嘗試更換另一張卡片。如果仍然無法付款，請透過 LINE 官方帳號輸入「幫助」聯繫客服，我們會協助您排除問題。',
            },
            {
              question: '有免費試用嗎？',
              answer: 'Dogtor 的核心功能（題庫練習、好友對戰、基礎 AI 解題）本身就是免費的，您的孩子可以先體驗看看。Parent Pro 方案提供的是進階功能（無限愛心、完整錯題本、進階 AI 助手、學習報告等），並提供 3 天免費試用，試用期間可隨時取消，不會產生任何費用。',
            },
          ],
        },
        {
          title: '授權碼與綁定',
          items: [
            {
              question: '什麼是授權碼？',
              answer: '授權碼是一組 8 位的英數字代碼，用來將您的訂閱與孩子的 Dogtor 帳號進行綁定。每份訂閱對應一組專屬的授權碼。',
            },
            {
              question: '授權碼的有效期限是多久？',
              answer: '授權碼自產生後 72 小時內有效。如果超過 72 小時未綁定，可以透過 LINE 官方帳號輸入「授權碼」重新取得新的授權碼。',
            },
            {
              question: '孩子要怎麼輸入授權碼？',
              answer: '在 Dogtor App 的個人頁面中，找到「家長綁定」區塊，輸入授權碼即可完成綁定，開始接收學生或孩子的學習報告！。',
            },
            {
              question: '授權碼過期了怎麼辦？',
              answer: '透過 LINE 官方帳號輸入「授權碼」，系統會自動補發一組新的授權碼。',
            },
            {
              question: '可以查看授權碼的綁定狀態嗎？',
              answer: '可以。透過 LINE 官方帳號輸入「授權碼狀態」，即可查看所有授權碼的綁定情況（未綁定、已綁定、已過期等）。每組授權碼會標示所屬方案（月訂閱或年訂閱），方便您辨別。',
            },
            {
              question: '可以把授權碼改綁給另一個孩子嗎？',
              answer: '不行直接改綁。請先透過 LINE 官方帳號輸入「取消訂閱」進入管理頁面解除目前綁定，再重新取得授權碼綁定新的孩子。如需協助，請聯絡客服。',
            },
          ],
        },
        {
          title: '多個孩子',
          items: [
            {
              question: '我有兩個以上的孩子，要怎麼訂閱？',
              answer: '每份訂閱對應一個孩子。如果您有兩個孩子，需要購買兩份訂閱。每份訂閱會產生各自獨立的授權碼，分別讓兩個孩子綁定。',
            },
            {
              question: '每個孩子可以選不同的方案嗎？',
              answer: '可以。每份訂閱是獨立的，您可以為一個孩子選月訂閱，為另一個孩子選年訂閱。',
            },
            {
              question: '取消其中一個孩子的訂閱，會影響另一個嗎？',
              answer: '不會。每份訂閱獨立運作，取消其中一份不會影響其他孩子的 Dogtor Pro 功能。',
            },
          ],
        },
        {
          title: 'Dogtor Pro 功能',
          items: [
            {
              question: 'Dogtor Pro 有哪些功能？',
              answer: '• 無限愛心（免費版每日 5 顆）\n\n• 進階 AI 學習助手\n\n• 完整錯題本功能\n\n• 自訂關卡數量提升\n\n• 每日／每週學習報告推送給家長',
            },
            {
              question: '孩子的 Dogtor Pro 什麼時候生效？',
              answer: '孩子完成授權碼綁定後，Dogtor Pro 功能立即生效。',
            },
            {
              question: '訂閱取消後，孩子的學習紀錄會消失嗎？',
              answer: '不會。取消訂閱後，孩子的學習紀錄、錯題本、成就等資料都會保留。只是 Dogtor Pro 專屬功能會在當期結束後停用。',
            },
          ],
        },
        {
          title: '學習報告',
          items: [
            {
              question: '訂閱後如何收到學習報告？',
              answer: '訂閱並完成綁定後，您可以透過 LINE 官方帳號隨時查看：\n\n• 輸入「今日報告」→ 查看孩子今天的學習情況\n\n• 輸入「週報」→ 查看本週學習總結\n\n• 輸入「知識點」→ 查看各科知識點掌握度\n\n• 輸入「錯題」→ 查看錯題分析',
            },
            {
              question: '可以同時看多個孩子的報告嗎？',
              answer: '可以。如果您綁定了多個孩子，輸入報告指令時會同時顯示所有孩子的學習報告。',
            },
          ],
        },
        {
          title: '帳號與安全',
          items: [
            {
              question: '家長一定要有 Dogtor 帳號嗎？',
              answer: '不需要。家長可以直接透過 LINE 官方帳號使用所有功能。如果之後下載了 Dogtor App 並註冊帳號，也可以將 LINE 帳號與 Dogtor 帳號合併。',
            },
            {
              question: '如何合併 LINE 和 Dogtor 帳號？',
              answer: '下載 Dogtor App 並註冊帳號後，在 App 中的設定頁面點選「綁定 LINE 帳號」即可完成合併。合併後，您在 LINE 和 App 中都能管理訂閱和查看報告。',
            },
            {
              question: '有退款政策嗎？',
              answer: '訂閱後如需退款，請於 14 天內聯絡客服處理。超過 14 天的訂閱依照付款平台的退款規定辦理。退款完成後，對應孩子的 Dogtor Pro 功能將立即停用。',
            },
          ],
        },
      ],
    },
    reviews: {
      pageTitle: '網友怎麼說',
      pageSubtitle: '來自 App Store、Google Play 和臉書社群的真實分享。',
      storeTitle: '商店評分',
      ratingsCount: (n) => `${n.toLocaleString('zh-TW')} 則評分`,
      viewInStore: '前往查看',
      storeReviewsTitle: '商店評論精選',
      fbTitle: '親子教育作家推薦',
      fbViewOriginal: '在臉書查看原文',
      sponsoredLabel: '合作推薦',
      ctaTitle: '換你來試試看',
      ctaText: '可愛的小狗博士、輕鬆刷題、跟朋友一起對戰，下載逗課，看看大家為什麼喜歡它。',
    },
    news: {
      pageTitle: '逗課動態',
      pageSubtitle: '得獎紀錄、媒體採訪、演講分享、街頭訪問和活動花絮，逗課一路走來的點點滴滴都在這裡。',
      categories: {
        award: '得獎紀錄',
        interview: '媒體採訪',
        talk: '演講分享',
        street: '街頭訪問',
        demo: '產品展示',
        event: '活動花絮',
      },
      play: '播放影片',
      readMore: '查看更多',
      instagramMore: '想看更多逗課的影片和 Dogcast？追蹤我們的 Instagram',
      ctaTitle: '看完了，換你玩玩看',
      ctaText: '下載 Dogtor 逗課，和小狗博士一起輕鬆刷題。',
    },
    about: {
      pageTitle: '關於我們',
      pageSubtitle: '我們的使命是讓學習變成一場冒險。',
      whyTitle: '為什麼我們創造了 DOGTOR？',
      whyP1:
        '傳統的學習方式往往讓人感到孤立和缺乏動力。學生面對著枯燥的教材，缺少即時反饋和社群支持，導致學習效率低落，甚至讓許多人對學習產生抗拒。Dogtor 逗課 建立在一個簡單的信念上：教育不應該無聊。',
      whyP2:
        '我們結合遊戲的吸引力與社群學習的力量，將「學習」這件苦差事轉變為一種有趣的日常習慣。透過遊戲化元素、社群互動和個人化學習路徑，我們讓學習變得社交化、視覺化，並且充滿成就感，讓學生真正愛上學習。',
      whyP3:
        '我們打造 Dogtor 逗課 的初衷其實很單純：希望每一位台灣學生，都能擁有一個方便學習、減少痛苦的好工具——用 AI 科技聰明地分析學習數據、自動整理錯題，把時間花在真正需要加強的地方。我們自己就是一路從台灣升學制度走過來的學生，如今也身兼其他孩子的老師；正因為深知這條路的辛苦，我們更希望這款 App 能陪伴更多學生，在學習這條路上走得更輕鬆，也走得更遠。',
      teamTitle: '團隊介紹',
      teamMembersTitle: '核心成員',
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
      featured: '精選文章',
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
      heroTitle: '比起問他「考幾分」，',
      heroTitleHighlight: '不如知道他哪裡不會',
      heroQuestionsTitle: '這些對話，是不是很熟悉？',
      heroQuestions: [
        '「今天學得怎樣？」—「還好啊。」',
        '學校和補習班學生太多，回饋永遠只有一句「他還不錯」？',
        '最後只能用分數衡量學習，卻不知道分數背後是哪個觀念沒學會？',
      ],
      // hero 用的一句話價值主張，必須短——它站在 CTA 前面。
      heroTagline: '每天一則 LINE 訊息，讓您知道孩子今天練了什麼、又是哪個觀念卡住了。',
      // 完整的品牌故事，移到產品畫面之後，不再擋在按鈕前面。
      storyDesc: '跟許多家長與孩子互動後，我們發現：家長其實非常關心孩子的學習，只是一直缺少一個窗口。DOGTOR PARENT PRO 用 LINE 日報與週報，把孩子第一手的學習狀況與錯題分析直接送到您手上，讓關心從追問分數，變成「這個觀念，我陪你補起來」。',
      heroBadge: 'Parent Pro · 家長訂閱方案',
      heroPriceHint: '試用期間取消完全不收費，之後 NT$ 300/月',
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
      lineButton: '加入 LINE 接收專屬學習報表',
      pricingTitle: '選擇最適合您的方案',
      pricingSubtitle: '陪伴孩子學習最值得的投資，每天不到一杯咖啡的價格。',
      promoNotice: '🎉 限時優惠 · 9/30 前訂閱，即可鎖定此優惠價',
      promoBadge: '限時優惠',
      monthlyPlan: '月繳方案',
      monthlyOriginalPrice: 'NT$ 450 / 月',
      monthlyPrice: 'NT$ 300 / 月',
      yearlyPlan: '年繳方案',
      yearlyOriginalPrice: 'NT$ 4,500 / 年',
      yearlyPrice: 'NT$ 3,000 / 年',
      yearlySave: '比月繳再省 NT$ 600',
      monthlyDailyPrice: '平均每天只要 10 元',
      yearlyDailyPrice: '平均每天不到 9 元',
      planFeatures: [
        { icon: 'MessageCircle', text: '每日學習成效訊息回報', color: '#06C755', important: true },
        { icon: 'BatteryCharging', text: '無限學習體力', color: '#FFD166' },
        { icon: 'Camera', text: '拍照生成專屬題庫', color: '#118AB2' },
        { icon: 'Sparkles', text: '錯題本與 AI 解惑額度提升', color: '#EF476F' },
        { icon: 'ShieldCheck', text: '全站無廣告', color: '#9D4EDD' }
      ],
      subscribeButton: '免費試用 3 天',
      trialNote: '試用期間可隨時取消，不會產生任何費用',
      stickyCtaLabel: '3 天免費試用',
      stickyCtaHint: '之後 NT$ 300 / 月 · 隨時可取消',
      stickyCtaButton: '開始試用',
      alreadySubscribed: '已經訂閱？',
      manageLink: '管理訂閱',
      homeSection: '家長專區',
      homeSectionTitle: '您知道孩子今天學了什麼嗎？',
      homeSectionDesc: 'Dogtor Parent Pro（家長方案）讓您即時掌握孩子的學習進度，AI 報告一目了然，陪伴更有方向、支持更有力量。',
      homeSectionTrust: '經過數十位家長與家教老師實測，有效追蹤孩子的學習進度與知識弱點',
      homeTestimonials: [
        {
          icon: 'Heart',
          color: '#EF476F',
          quote:
            '每次問孩子今天學習狀況，永遠只回「還好」😂 \n現在每天定時收到 Dogtor 傳來的可愛報表，哪一科、哪個章節都清清楚楚，終於有方向陪他一起複習了。',
          name: '豆豆媽媽',
          role: '國三會考生家長',
        },
        {
          icon: 'GraduationCap',
          color: '#118AB2',
          quote:
            '帶學生最花時間的就是掌握他們平常的練習狀況。 \nDogtor 現在每天把學習報表整理好傳來，我能快速又精準抓到學生的知識弱點，備課和加強方向都更清楚了。',
          name: '陳老師',
          role: '數學家教老師',
        },
        {
          icon: 'Smile',
          color: '#FFB703',
          quote:
            '最驚喜的是孩子連續刷題達標那天，收到的那一則可愛的通知！ \n看到他學習狀況特別好、還願意這麼主動投入，比考幾分更讓我開心。',
          name: '匿名學生爸爸',
          role: '高一生家長',
        },
      ],
      homeSectionButton: '了解 Parent Pro（家長方案）',
    },
    learningSupport: {
      badge: 'DOGTOR 學習支持計劃',
      heroTitle: '讓好的學習資源，',
      heroTitleHighlight: '不再受限於任何條件',
      heroSubtitle: (seats) =>
        `我們將提供 ${seats} 個免費一年 DOGTOR Pro 名額。只要填寫表單，告訴我們你為什麼需要這個計劃，就有機會獲得資格。`,
      statSeats: '受助名額',
      formatSeats: (n) => `${n} 名`,
      statDuration: 'DOGTOR Pro',
      statDurationValue: '一年',
      statValue: '計劃總價值',
      formatValue: (v) => `${v / 10000} 萬`,
      applyButton: '立即填表申請',
      learnMore: '了解計劃',
      videoTitle: 'DOGTOR 學習支持計劃',
      play: '播放影片',
      letterTitle: '寫在計劃之前',
      letterParagraphs: (seats) => [
        '教書的第七年，開始更相信教育能帶來的改變，而我始終覺得，教育最有價值的地方，是它能為一個人的未來創造更多可能。',
        '抱持著想要讓好的學習資源不再受到地域、環境或經濟條件的限制，我們半年前開發了 DOGTOR 逗課。',
        `這半年來，隨著 DOGTOR 慢慢站穩腳步，我們開始思考，如何讓這份影響力走得更遠，所以我們決定要推出 DOGTOR 學習支持計劃，提供 ${seats} 個免費的一年 DOGTOR PRO 名額，只要填表單告訴我們你為什麼想參加這個計劃，就有機會可以獲得資格！`,
        '以前在南投、台中讀書的時候，很幸運遇見了幾位深深影響我的老師。',
        '長大後，帶著這些曾經受到的啟發，自己也走進了教育現場。一直很希望，有一天也能像當年那些影響我的老師一樣，為更多學生帶來一些改變，甚至是更多選擇與機會。',
        '但這七年來最大的收穫，並不是我變得多會讓學生考高分。而是在和學生相處、陪伴他們成長的過程中，逐漸理解他們真正需要的是什麼。',
        '好的教育，不應該只是讓學生更會考試，而是讓他們更願意學習，而學習可以是有效率的，也可以是快樂的；可以有明確的目標，同時保有自主選擇的空間。',
        '而科技的進步，應該要讓這樣的教育變得更容易實現，也讓更多學生有機會接觸到，帶著這樣的想法，我和團隊的夥伴們一起開發了 DOGTOR。',
        '從最初的一個想法，到現在上線將近半年，DOGTOR 逐漸成為一個更完整、更成熟的學習產品。',
        '這一路上，我們收到了許多教育前輩、家長，以及學生們的建議。每一次回饋，都讓我們重新思考，究竟還能為學習者多做些什麼。',
        '也很感謝越來越多家長願意相信我們、支持我們，讓一群年輕人對教育的想像，有機會真正走進更多學生的日常。',
      ],
      letterQuote: '好的教育，不應該只是讓學生更會考試，而是讓他們更願意學習。',
      letterSignature: 'Pierre 陳冠宇｜DOGTOR 逗課 執行長',
      stepsTitle: '如何申請',
      steps: [
        { title: '填寫申請表單', desc: '花幾分鐘填寫 Google 表單，告訴我們你為什麼需要這個計劃。' },
        { title: '團隊審核', desc: '我們會用心閱讀每一份申請，審核符合資格的同學。' },
        { title: '獲得一年 Pro', desc: '通過審核的同學，將免費獲得一年 DOGTOR Pro 完整功能。' },
      ],
      ctaTitle: '你的故事，值得被聽見',
      ctaText: '不需要完美的成績，只需要真誠地告訴我們，為什麼你想好好學習。',
      homeBadge: '學習支持計劃：免費一年 Pro',
      homeTitle: '免費一年 DOGTOR Pro，給需要的你',
      homeDesc: (seats) => `${seats} 個名額，填表告訴我們你為什麼需要這個計劃，就有機會獲得資格。`,
    },
    subscribe: {
      pageTitle: '訂閱 Dogtor Parent Pro（家長方案）',
      back: '返回',
      choosePlan: '選擇訂閱方案',
      monthly: '月繳',
      yearly: '年繳',
      monthlyPrice: 'NT$ 300 / 月',
      yearlyPrice: 'NT$ 3,000 / 年',
      yearlySave: '比月繳再省 NT$ 600',
      // Shown instead of the prices above when a valid ?discount= link
      // opened the page. Keep in step with the Paddle discount (10% off).
      promoBadge: '已套用 9 折優惠',
      promoMonthlyPrice: 'NT$ 270 / 月',
      promoYearlyPrice: 'NT$ 2,700 / 年',
      promoTrialNote: '前 3 天免費，試用期間取消不收費。試用結束後依所選方案的 9 折價格扣款。',
      subscribing: '前往結帳...',
      subscribe: '開始 3 天免費試用',
      trialNote: '前 3 天免費，試用期間取消不收費。試用結束後才會依所選方案扣款。',
      notInLine: 'LINE 登入失敗',
      notInLineDesc: '無法完成 LINE 登入驗證，請確認網路連線後重新整理頁面，或透過 Dogtor 家長 LINE 官方帳號的選單點擊「訂閱」。',
      canceled: '付款已取消',
      canceledDesc: '您已取消付款，可以隨時再次訂閱。',
      successTitle: '訂閱成功！',
      successDesc: '請將以下授權碼提供給孩子，在 DOGTOR App 中輸入即可完成綁定，開始接收學生或孩子的學習報告！（點擊頭像 -> 右上角設定）。',
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
      bindTutorialAlt: '授權碼綁定教學',
      manageTitle: '管理訂閱',
      manageDesc: '查看帳單、更換付款方式或取消訂閱。',
      manageButton: '前往管理',
      portalLoading: '正在開啟...',
      noSubscriptionTitle: '您目前還沒有訂閱',
      noSubscriptionDesc: '即將帶您前往方案購買頁面。',
      portalError: '暫時無法開啟訂閱管理頁面，請稍後再試。',
      lineTitle: '加入 LINE 官方帳號',
      lineDesc: '訂閱管理、授權碼補發、每日學習報告，都透過 LINE 操作——記得加好友！',
      lineButton: '加入 LINE 好友',
    },
  },

  en: {
    common: {
      langSwitch: '中文',
      langShort: '中',
      downloadApp: 'Download App',
    },
    header: {
      guide: 'Guides',
      faq: 'FAQ',
      about: 'About',
      support: 'Contact Support',
      reviews: 'Reviews',
      news: 'News',
      helpMenu: 'Help',
      parentPro: 'Parent Plan',
      menuLabel: 'Menu',
    },
    company: {
      title: 'Company Information',
      intro: 'The Dogtor app and the Dogtor LINE Official Account are developed and operated by:',
      nameLabel: 'Company Name',
      taxIdLabel: 'Business Registration No.',
      representativeLabel: 'Representative',
      addressLabel: 'Registered Address',
      emailLabel: 'Support Email',
    },
    footer: {
      contact: 'Contact:',
      operatedBy: 'This website and the Dogtor app are developed and operated by',
      operatedBySuffix: '',
      copyright: (year) => `© ${year} Dogtor. All rights reserved.`,
      links: {
        guide: 'Learning Guides',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        refund: 'Refund Policy',
        support: 'Support Center',
        faq: 'FAQ',
        reviews: 'Reviews',
        news: 'News',
      },
    },
    home: {
      badge: 'Parent Plan Sale',
      heroTitle1: 'Learn smarter.',
      heroTitle2: 'Know yourself better',
      heroTagline: 'AI weakness diagnosis · One question, one concept · 10 minutes a day',
      heroSubtitle:
        'Dogtor is a 10-minute daily AI tutor that diagnoses and fixes the concept gaps holding you back — no more mindless drilling. Pick any subject or chapter, and spend your time only where it actually moves the needle.',
      lineCta: 'Join us on LINE for daily learning insights & mistake reports',
      floatTitle: 'Daily Challenge',
      floatDesc: '15-day streak!',
      appImgAlt: 'Dogtor App screenshot — adorable quiz practice and learning islands',
      floatImgAlt: 'Dogtor the cute study-whiz corgi — daily challenge reminder',
      featuresSectionTitle: 'Why Top Students Use Dogtor',
      featuresSectionSubtitle:
        "It's not about doing more questions — it's about truly mastering each one, closing the gaps that matter most in the least amount of time.",
      featureTeamImgAlt: 'Dogtor learning islands — gamified review that masters one concept per question',
      featureTeamTitle: 'One Question, One Concept Mastered',
      featureTeamDesc:
        'Every question maps to a specific concept. Get it wrong and the explanation lands immediately, the mistake goes into your notebook, and AI picks the next question you most need. Choose any subject or chapter and turn weak spots into strengths in ten minutes a day — or upload your own notes and let AI build a custom quiz.',
      feature1ImgAlt: 'Dogtor built by NTU students and cram-school teachers, with NTU professor advisors guiding AI and learning-interaction design',
      feature1Title: 'Built by NTU & Expert Teachers',
      feature1Desc:
        'Jointly developed by National Taiwan University students and cram-school teachers, with multiple NTU professors advising on AI, software, HCI, and learning-interaction design — every feature combines frontline teaching experience with academic rigor.',
      feature3ImgAlt: 'Dogtor friend battles and leaderboards — learn together with classmates in real-time PvP',
      feature3Title: 'Battle Friends Together',
      feature3Desc:
        'Add friends for real-time PvP battles, compete on accuracy and speed, and unlock leaderboards and achievements — learn together with classmates so exam prep never feels lonely.',
      guideSectionTitle: 'Featured Guides',
      guideSectionSubtitle:
        'Exam prep strategies, study methods, and learning on-the-go — all in one place.',
      viewAllGuides: 'View All Guides',
      ctaTitle: 'Ten Minutes a Day. Know Yourself Better.',
      ctaSubtitle:
        'Download Dogtor free and let AI pinpoint the concepts actually holding you back — the most efficient way to prep for your exams.',
    },
    faq: {
      pageTitle: 'FAQ',
      pageSubtitle: 'Find answers to all your questions about Dogtor.',
      ctaText: 'Still have questions?',
      contactSupport: 'Contact Support',
      studentSectionTitle: 'Student FAQ',
      parentSectionTitle: 'Parent Subscription — Parent Pro',
      parentSectionSubtitle: 'Frequently asked questions about the Parent Pro subscription plan.',
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
            'For junior high we cover Math, Natural Science, Social Studies, and Basic Competency Test past papers; for senior high we cover Chemistry, Biology, Civics, Geography, and History, with more added over time. On top of that, our "custom AI quiz generator" is not limited to existing subjects — snap a photo or upload any file and AI turns the content into a personalized quiz.',
        },
        {
          question: 'Can I turn my own notes, handouts, or textbook into quizzes? (Custom AI quiz generator)',
          answer:
            'Yes! This is one of Dogtor\'s most popular features. Just snap a photo or upload any file (notes, handouts, textbooks, exams, PDFs, images), and AI will automatically generate a personalized, genuinely fun quiz from whatever you send in. Any material — supplementary content, a teacher\'s handout, or anything you want to practice — instantly becomes an interactive, gamified quiz, with no limit to existing subjects.',
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
            'Dogtor is primarily designed for junior high students (grades 7–9) and senior high students (grades 10–12). Junior high students can use Math, Natural Science, Social Studies, and past exam questions to prepare for the Basic Competency Test; senior high students can use Chemistry, Biology, Civics, Geography, and History question banks for the Academic Ability Test and Advanced Subjects Test. You can also snap a photo or upload a file to generate a custom AI quiz for any subject.',
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
      parentSections: [
        {
          title: 'Subscription & Payment',
          items: [
            {
              question: 'What plans does Parent Pro offer?',
              answer: 'Parent Pro offers monthly and yearly subscription plans. The yearly plan comes at a discounted rate. During the subscription period, your linked child can access all Dogtor Pro features.',
            },
            {
              question: 'How do I subscribe to Parent Pro?',
              answer: '1. Enter "subscribe" in the LINE official account to get the subscription page link.\n\n2. Choose a plan and complete payment.\n\n3. After successful payment, the system will generate an authorization code.\n\n4. Give the code to your child to enter in the App to activate Dogtor Pro.',
            },
            {
              question: 'What payment methods are accepted?',
              answer: 'We accept credit cards and debit cards (Visa, Mastercard, JCB). Payments are securely processed by Paddle.',
            },
            {
              question: 'Will my subscription auto-renew?',
              answer: 'Yes. The subscription automatically renews before expiration so your child\'s Dogtor Pro features are uninterrupted. To cancel, enter "cancel subscription" in the LINE official account before the renewal date.',
            },
            {
              question: 'How do I cancel my subscription?',
              answer: 'Enter "cancel subscription" in the LINE official account. The system will provide a link to the subscription management page where you can cancel, change payment methods, or view billing history. After cancellation, your child can continue using Dogtor Pro features until the current period ends.',
            },
            {
              question: 'What if my payment fails?',
              answer: 'Please check that your credit card has sufficient balance, or try a different card. If the issue persists, enter "help" in the LINE official account to contact support and we will help resolve the problem.',
            },
            {
              question: 'Is there a free trial?',
              answer: 'Dogtor\'s core features (question bank, friend battles, basic AI explanations) are already free — your child can try them out first. Parent Pro provides advanced features (unlimited hearts, full mistake book, advanced AI assistant, learning reports, etc.) and comes with a 3-day free trial. You can cancel anytime during the trial at no charge.',
            },
          ],
        },
        {
          title: 'Authorization Code & Binding',
          items: [
            {
              question: 'What is an authorization code?',
              answer: 'An authorization code is an 8-character alphanumeric code used to link your subscription to your child\'s Dogtor account. Each subscription has its own unique code.',
            },
            {
              question: 'How long is the authorization code valid?',
              answer: 'The code is valid for 72 hours after generation. If it expires before binding, enter "authorization code" in the LINE official account to get a new one.',
            },
            {
              question: 'How does my child enter the authorization code?',
              answer: 'In the Dogtor App\'s profile page, find the "Parent Binding" section and enter the authorization code to complete the binding.',
            },
            {
              question: 'What if the authorization code expired?',
              answer: 'Enter "authorization code" in the LINE official account and the system will automatically issue a new code.',
            },
            {
              question: 'Can I check the binding status of my authorization code?',
              answer: 'Yes. Enter "code status" in the LINE official account to view all your authorization codes and their binding status (unbound, bound, expired, etc.). Each code shows its associated plan (monthly or yearly) for easy identification.',
            },
            {
              question: 'Can I re-bind the code to a different child?',
              answer: 'Not directly. Please enter "cancel subscription" in the LINE official account to access the management page and unbind the current child first, then obtain a new code to bind to a different child. Contact support if you need assistance.',
            },
          ],
        },
        {
          title: 'Multiple Children',
          items: [
            {
              question: 'I have more than one child. How do I subscribe?',
              answer: 'Each subscription corresponds to one child. If you have two children, you need two separate subscriptions. Each will generate its own authorization code for the respective child.',
            },
            {
              question: 'Can each child have a different plan?',
              answer: 'Yes. Each subscription is independent. You can choose a monthly plan for one child and a yearly plan for another.',
            },
            {
              question: 'If I cancel one child\'s subscription, will it affect the other?',
              answer: 'No. Each subscription operates independently. Canceling one will not affect the other child\'s Dogtor Pro features.',
            },
          ],
        },
        {
          title: 'Dogtor Pro Features',
          items: [
            {
              question: 'What features does Dogtor Pro include?',
              answer: '• Unlimited hearts (free version: 5 per day)\n\n• Advanced AI learning assistant\n\n• Full mistake book features\n\n• Increased custom stage limits\n\n• Daily/weekly learning reports sent to parents',
            },
            {
              question: 'When does Dogtor Pro take effect for my child?',
              answer: 'Dogtor Pro features are activated immediately after your child completes the authorization code binding.',
            },
            {
              question: 'Will my child\'s learning data be lost after canceling?',
              answer: 'No. After cancellation, your child\'s learning records, mistake book, achievements, and other data are all preserved. Only Dogtor Pro-exclusive features will be deactivated after the current period ends.',
            },
          ],
        },
        {
          title: 'Learning Reports',
          items: [
            {
              question: 'How do I receive learning reports after subscribing?',
              answer: 'After subscribing and completing the binding, you can check anytime via the LINE official account:\n\n• Enter "daily report" → view your child\'s learning activity today\n\n• Enter "weekly report" → view the weekly learning summary\n\n• Enter "knowledge points" → view mastery of knowledge points by subject\n\n• Enter "mistakes" → view mistake analysis',
            },
            {
              question: 'Can I see reports for multiple children?',
              answer: 'Yes. If you have bound multiple children, entering a report command will display learning reports for all of them.',
            },
          ],
        },
        {
          title: 'Account & Security',
          items: [
            {
              question: 'Do parents need a Dogtor account?',
              answer: 'No. Parents can use all features directly through the LINE official account. If you later download the Dogtor App and create an account, you can merge your LINE account with your Dogtor account.',
            },
            {
              question: 'How do I merge my LINE and Dogtor accounts?',
              answer: 'After downloading the Dogtor App and creating an account, go to the settings page and tap "Link LINE Account" to complete the merge. Once merged, you can manage subscriptions and view reports from both LINE and the App.',
            },
            {
              question: 'Is there a refund policy?',
              answer: 'If you need a refund, please contact support within 14 days of subscribing. Refunds after 14 days follow the payment platform\'s refund policy. Once refunded, the corresponding child\'s Dogtor Pro features will be deactivated immediately.',
            },
          ],
        },
      ],
    },
    reviews: {
      pageTitle: 'What People Are Saying',
      pageSubtitle: 'Real feedback from the App Store, Google Play, and Facebook.',
      storeTitle: 'Store Ratings',
      ratingsCount: (n) => `${n.toLocaleString('en-US')} ratings`,
      viewInStore: 'View',
      storeReviewsTitle: 'From the App Stores',
      fbTitle: 'Recommended by Parenting Writers',
      fbViewOriginal: 'View on Facebook',
      sponsoredLabel: 'Partnership',
      ctaTitle: 'Try It Yourself',
      ctaText: 'A cute corgi tutor, low-pressure practice, and battles with friends. Download Dogtor and see why people love it.',
    },
    news: {
      pageTitle: 'News',
      pageSubtitle: 'Awards, media coverage, talks, street interviews, and event photos from the Dogtor journey.',
      categories: {
        award: 'Awards',
        interview: 'Media Interviews',
        talk: 'Talks',
        street: 'Street Interviews',
        demo: 'Product Demos',
        event: 'Events',
      },
      play: 'Play video',
      readMore: 'Read more',
      instagramMore: 'Want more Dogtor videos and Dogcast episodes? Follow us on Instagram',
      ctaTitle: 'Now Try It Yourself',
      ctaText: 'Download Dogtor and start practicing with the corgi tutor.',
    },
    about: {
      pageTitle: 'About Us',
      pageSubtitle: 'Our mission is to turn learning into an adventure.',
      whyTitle: 'Why Did We Create DOGTOR?',
      whyP1:
        'Traditional study methods often feel isolating and demotivating. Students face dry materials without immediate feedback or community support — leading to low efficiency and even a resistance to learning. Dogtor is built on a simple belief: education should not be boring.',
      whyP2:
        'We combine the appeal of games with the power of social learning to transform studying from a chore into an enjoyable daily habit. Through gamification, social interaction, and personalized learning paths, we make learning social, visual, and filled with a sense of achievement — so students genuinely love to learn.',
      whyP3:
        'Our reason for building Dogtor is simple: we want every student in Taiwan to have a tool that makes studying easier and less painful — one that uses AI to intelligently analyze learning data and automatically organize mistakes, so time goes to what truly needs work. We are students who have walked Taiwan\'s demanding academic path ourselves, and today we are also teachers to other students. Because we know first-hand how hard this road can be, we hope this app can accompany more students and help them go further on their learning journey — with a little more ease along the way.',
      teamTitle: 'Our Team',
      teamMembersTitle: 'Core Team',
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
      featured: 'Featured',
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
      heroTitle: 'Stop Asking "What Did You Score?"',
      heroTitleHighlight: 'Start Knowing What They Missed',
      heroQuestionsTitle: 'Sound familiar?',
      heroQuestions: [
        '"What did you learn today?" — "It was fine."',
        'Schools and cram schools have too many students — the feedback is always a vague "he\u2019s doing okay".',
        'In the end, a score is all you get — with no idea which concept it was that slipped.',
      ],
      heroTagline: 'A daily LINE message: what your child practised, and where they got stuck.',
      storyDesc: 'After working with countless tutoring and cram-school families, we found the same thing every time: parents care deeply about their child\u2019s learning — they just never had a window into it. DOGTOR PARENT PRO sends daily and weekly LINE reports with first-hand progress and mistake analysis, so care turns from chasing grades into "let\u2019s fix this concept together".',
      heroBadge: 'Parent Pro · Subscription Plan',
      heroPriceHint: '3-day free trial · Cancel during the trial and pay nothing · Then NT$300/mo',
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
      lineButton: 'Add LINE for your child\u2019s reports',
      pricingTitle: 'Simple, Transparent Pricing',
      pricingSubtitle: 'The best investment in your child\'s learning — for less than the cost of a coffee a day.',
      promoNotice: '🎉 Limited-time price · Subscribe before Sep 30 to lock it in',
      promoBadge: 'Limited Time',
      monthlyPlan: 'Monthly Plan',
      monthlyOriginalPrice: 'NT$ 450 / mo',
      monthlyPrice: 'NT$ 300 / mo',
      yearlyPlan: 'Yearly Plan',
      yearlyOriginalPrice: 'NT$ 4,500 / yr',
      yearlyPrice: 'NT$ 3,000 / yr',
      yearlySave: 'Save NT$ 600 vs monthly',
      monthlyDailyPrice: 'Only NT$10 / day',
      yearlyDailyPrice: 'Less than NT$9 / day',
      planFeatures: [
        { icon: 'MessageCircle', text: 'Daily LINE progress report', color: '#06C755', important: true },
        { icon: 'BatteryCharging', text: 'More learning energy', color: '#FFD166' },
        { icon: 'Camera', text: 'Snap to build a question set', color: '#118AB2' },
        { icon: 'Sparkles', text: 'Higher AI & mistake limits', color: '#EF476F' },
        { icon: 'ShieldCheck', text: 'Ad-free experience', color: '#9D4EDD' }
      ],
      subscribeButton: 'Start 3-Day Free Trial',
      trialNote: 'Cancel anytime during the trial — you will not be charged',
      stickyCtaLabel: '3-day free trial',
      stickyCtaHint: 'Then NT$300/mo · Cancel anytime',
      stickyCtaButton: 'Start trial',
      alreadySubscribed: 'Already subscribed?',
      manageLink: 'Manage subscription',
      homeSection: 'Parent Pro',
      homeSectionTitle: 'Do you really know what your child learned today?',
      homeSectionDesc: 'Dogtor Parent Pro keeps you in sync with real-time progress tracking, AI-powered insights, and personalized recommendations.',
      homeSectionTrust: 'Tested by dozens of parents and tutors — effectively tracks your child’s progress and knowledge gaps',
      homeTestimonials: [
        {
          icon: 'Heart',
          color: '#EF476F',
          quote:
            'I used to get a shrug when I asked what my child studied. Now a cute report arrives every day — I can see exactly which subject and chapter is weak, so helping him review finally has direction.',
          name: "Dou-Dou's Mom",
          role: 'Parent of a 9th-grade exam student',
        },
        {
          icon: 'GraduationCap',
          color: '#118AB2',
          quote:
            'As a tutor, my biggest worry is not seeing how students practice between sessions. Dogtor sends a tidy daily report so I can pinpoint knowledge gaps and plan exactly where to reinforce.',
          name: 'Mr. Chen',
          role: 'Math tutor',
        },
        {
          icon: 'Smile',
          color: '#FFB703',
          quote:
            'The best surprise was the cute notification I got the day my son hit his practice streak! Seeing him this engaged and doing so well means more to me than any score.',
          name: "Ting-Ting's Dad",
          role: 'Parent of a 10th grader',
        },
      ],
      homeSectionButton: 'Learn About Parent Pro',
    },
    learningSupport: {
      badge: 'DOGTOR Learning Support Program',
      heroTitle: 'Great learning resources,',
      heroTitleHighlight: 'for every student',
      heroSubtitle: (seats) =>
        `We're giving away ${seats} free one-year DOGTOR Pro memberships. Fill out the form and tell us why you need this program — you could be selected.`,
      statSeats: 'Students supported',
      formatSeats: (n) => `${n}`,
      statDuration: 'DOGTOR Pro',
      statDurationValue: '1 year',
      statValue: 'Total value',
      formatValue: (v) => `NT$${v.toLocaleString('en-US')}`,
      applyButton: 'Apply now',
      learnMore: 'Learn more',
      videoTitle: 'DOGTOR Learning Support Program',
      play: 'Play video',
      letterTitle: 'Why we started this program',
      letterParagraphs: (seats) => [
        'In my seventh year of teaching, I believe more than ever in the change education can bring. To me, what makes education most valuable is the possibilities it opens up for a person’s future.',
        'Half a year ago, we built DOGTOR so that good learning resources would no longer be limited by where you live, your circumstances, or your family’s finances.',
        `As DOGTOR has found its footing, we started asking how we could take this further. So we’re launching the DOGTOR Learning Support Program: ${seats} free one-year DOGTOR Pro memberships. Just fill out the form and tell us why you want to join.`,
        'When I was a student in Nantou and Taichung, I was lucky to meet a few teachers who shaped who I am.',
        'Carrying that inspiration, I became a teacher myself, hoping that one day I could do for other students what those teachers did for me — bring some change, and maybe more choices and opportunities.',
        'But the biggest lesson of these seven years isn’t how to help students score higher. It’s understanding, through spending time with them and watching them grow, what they truly need.',
        'Good education shouldn’t just make students better at tests — it should make them want to learn. Learning can be efficient and joyful; it can have clear goals while leaving room for choice.',
        'Technology should make that kind of education easier to achieve and reach more students. With that in mind, my teammates and I built DOGTOR.',
        'From a single idea to nearly six months since launch, DOGTOR has grown into a more complete, more mature learning product.',
        'Along the way, we’ve received advice from educators, parents and students. Every piece of feedback makes us rethink what more we can do for learners.',
        'Thank you to the growing number of parents who trust and support us, helping a group of young people bring their vision of education into more students’ everyday lives.',
      ],
      letterQuote: 'Good education shouldn’t just make students better at tests — it should make them want to learn.',
      letterSignature: 'Pierre Chen, CEO of DOGTOR',
      stepsTitle: 'How to apply',
      steps: [
        { title: 'Fill out the form', desc: 'Spend a few minutes on the Google Form and tell us why you need this program.' },
        { title: 'We review', desc: 'Our team reads every application carefully and selects eligible students.' },
        { title: 'Get 1 year of Pro', desc: 'Selected students receive a free year of full DOGTOR Pro access.' },
      ],
      ctaTitle: 'Your story deserves to be heard',
      ctaText: 'You don’t need perfect grades — just tell us honestly why you want to learn.',
      homeBadge: 'Free year of Pro for students',
      homeTitle: 'A free year of DOGTOR Pro for students who need it',
      homeDesc: (seats) => `${seats} spots available. Tell us why you need this program for a chance to be selected.`,
    },
    subscribe: {
      pageTitle: 'Subscribe to Dogtor Parent Pro（家長方案）',
      back: 'Back',
      choosePlan: 'Choose a Plan',
      monthly: 'Monthly',
      yearly: 'Yearly',
      monthlyPrice: 'NT$ 300 / mo',
      yearlyPrice: 'NT$ 3,000 / yr',
      yearlySave: 'Save NT$ 600 vs monthly',
      promoBadge: '10% off applied',
      promoMonthlyPrice: 'NT$ 270 / mo',
      promoYearlyPrice: 'NT$ 2,700 / yr',
      promoTrialNote: 'First 3 days are free. Cancel during the trial and you will not be charged; after the trial you are billed the discounted price of your plan.',
      subscribing: 'Redirecting to checkout...',
      subscribe: 'Start 3-day free trial',
      trialNote: 'First 3 days are free. Cancel during the trial and you will not be charged; billing starts only after the trial ends.',
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
      bindTutorialAlt: 'Authorization code binding tutorial',
      manageTitle: 'Manage Subscription',
      manageDesc: 'View bills, change payment method, or cancel your subscription.',
      manageButton: 'Manage Subscription',
      portalLoading: 'Opening...',
      noSubscriptionTitle: 'You don\'t have a subscription yet',
      noSubscriptionDesc: 'We\'ll take you to the purchase page now.',
      portalError: 'Could not open subscription management. Please try again later.',
      lineTitle: 'Add LINE Official Account',
      lineDesc: 'Subscription management, code reissue, and daily learning reports are all handled via LINE — remember to add us as a friend!',
      lineButton: 'Add LINE Friend',
    },
  },
}

export function getMessages(locale) {
  return messages[locale] || messages['zh-TW']
}
