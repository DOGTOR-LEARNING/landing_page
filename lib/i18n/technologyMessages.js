// Copy for /technology. Every claim here should match how the app actually
// works (dogtor_app: pipeline/agent, backend/app/agent, routers/custom.py,
// routers/forgetting_curve.py, docs/知識點分數.md). Update it when they change.

const technologyContent = {
  'zh-TW': {
    metaTitle: 'AI 技術 - Dogtor 逗課 | 知識點驅動的 AI 學習引擎',
    metaDescription:
      'Dogtor 逗課如何使用 AI：從課綱萃取知識點、多模型交叉驗證的題庫生成 pipeline、AI 家教「汪汪題」、拍照即生成的客製化題庫，以及結合遺忘曲線的知識點掌握度模型。全部運行在 Google Cloud 上。',
    eyebrow: 'AI 技術',
    pageTitle: '一題學透一個知識點，背後是一整套 AI 引擎',
    pageSubtitle:
      'Dogtor 不只是把題目丟給 AI。我們把課綱拆成知識點，讓每一題、每一次作答、每一個推薦都對應到具體觀念——AI 負責規模化，知識點負責讓學習可以被量測。',
    statsLabel: '技術概覽',
    stats: [
      { value: '5', label: '套 AI 系統協同運作' },
      { value: '3', label: '個模型交叉驗證每一題' },
      { value: '0–10', label: '分的知識點掌握度，逐題更新' },
      { value: '24/7', label: 'AI 家教隨時解題' },
    ],
    tocLabel: '本頁內容',
    sections: {
      graph: {
        tag: '01 · 知識圖譜',
        title: '課綱知識圖譜：所有東西的骨架',
        lead:
          '我們整理 108 課綱與公開學習資源，把每一個科目拆成「冊 → 章 → 小節 → 知識點」的階層結構。題目、關卡、錯題、學習報告與推薦，全部都掛在知識點上。',
        points: [
          '以 LLM 從同一小節的題目中歸納 2–7 個高辨識度知識點，再經人工審查合併過細或重複的分類。',
          '再由 Gemini 逐題判斷題目屬於哪一個知識點，並自動排除依賴圖片等無法作答的題目。',
          '用 TF‑IDF 與 SVD 將知識點投影成向量，視覺化成跨科目的 3D 知識圖譜，讓相近觀念彼此靠近，作為擴充新科目與規劃關卡的依據。',
        ],
      },
      pipeline: {
        tag: '02 · 題庫生成 Pipeline',
        title: '多模型交叉驗證的 AI 生題流程',
        lead:
          '每一題都經過「生成 → 盲解 → 詳解 → 審核 → 程式驗證」的流程，任何一關不通過就直接剔除，而不是修改答案來湊題數。',
        steps: [
          { title: '固定範圍', desc: '鎖定冊、章、小節、知識群、常見混淆與排除範圍；不確定的事實標記為需查證，不讓模型補猜。' },
          { title: '知識點導向生成', desc: '依知識點與參考題，由大型語言模型生成臺灣繁體中文、四選一、一題一個判斷重點的題目。' },
          { title: '盲解交叉驗證', desc: '另一個模型在看不到作者答案的情況下重新作答，答案不一致的題目直接退件。' },
          { title: '詳解與最終審核', desc: '生成精簡詳解（一句核心觀念＋2–4 個列點），再由審核模型檢查正確性、唯一正解與重複題。' },
          { title: '程式驗證', desc: '自動檢查選項唯一、答案編號、範圍、格式、內容雜湊與審核覆蓋率，只匯出未被改動且全部通過的題目。' },
          { title: '預演後上線', desc: '先匯入 staging 資料庫預演並回讀驗證，確認每關可抽滿題目後才上線正式環境。' },
        ],
        note:
          '流程以內容雜湊快取每一次成功請求，失敗只續跑缺少的步驟；並分開記錄每個模型角色的 token 用量，控制成本。上線後學生也能在作答畫面回報題目錯誤，回流修正題庫。',
      },
      tutor: {
        tag: '03 · 汪汪題 AI 家教',
        title: '會自己判斷該做什麼的 AI 家教 Agent',
        lead:
          '「汪汪題」不是單次的 LLM 呼叫，而是一個 tool‑calling agent。學生打字或拍照上傳題目後，Agent 會自行判斷這次需要哪一種協助：',
        tools: [
          { name: '解題與觀念說明', desc: '以家教 prompt 直接講解題目與背後觀念，支援拍照上傳的題目。' },
          { name: '出練習題', desc: '指定範圍就照範圍出題；沒指定時，根據學生最近 30 天答錯的題目生成類似題，存成一個可闖關的練習關卡。' },
          { name: '學習狀況摘要', desc: '讀取學生的答題數、正確率、各科與對戰表現，整理成簡短回饋。' },
          { name: '產品問題與回報', desc: '只根據官方產品文件回答 App 使用問題，並能把學生回報的問題連同截圖轉給團隊。' },
        ],
      },
      custom: {
        tag: '04 · 客製化 AI 生題庫',
        title: '拍一張講義，就變成一個關卡',
        lead:
          '學生可以拍照或上傳筆記、講義、考卷或 PDF。系統把檔案存到 Cloud Storage，透過多模態模型讀取內容，生成結構化的題目、選項與詳解，直接變成可以闖關的遊戲化關卡——不受既有科目限制。',
        points: [
          '多模態理解：圖片與 PDF 直接作為模型輸入（Vertex AI Gemini），不需要先手動整理成文字。',
          '結構化輸出：每關約 15 題 JSON，經格式正規化與答案驗證後才寫入資料庫。',
          '額度與重試控制：生成前先檢查使用者額度，失敗有限次重試並記錄錯誤，避免浪費運算。',
        ],
      },
      mastery: {
        tag: '05 · 知識點掌握度模型',
        title: '每一次作答，都在更新學生的知識地圖',
        lead:
          '每位學生對每個知識點都有一個 0–10 分的掌握度。這個分數決定下一關抽什麼題、今天該複習什麼，也是家長學習報告的基礎。',
        blocks: [
          {
            title: '貝氏平滑的掌握度分數',
            desc: '以最近 20 題的滑動視窗計算正確率，並加入隨答題數淡出的 50% 先驗，避免「答對 1 題就被判成精熟」。',
            formula: 'score = (correct + w/2) / (n + w) × 10，w = max(0, 4 × (1 − n/20))',
          },
          {
            title: '弱點導向抽題',
            desc: '關卡抽題時，以 max(10 − score, 1) 作為權重分配題數，越弱的知識點出越多題。',
            formula: 'weight = max(10 − score, 1)',
          },
          {
            title: '遺忘曲線衰減',
            desc: '參考艾賓浩斯遺忘曲線，Cloud Scheduler 每天在第 7／14／30／60 天溫和降低未複習知識點的分數，但保留至少一半的努力成果。',
            formula: 'score ← max(5, score × 0.95 / 0.90 / 0.85 / 0.80)',
          },
          {
            title: '今日個人化複習推薦',
            desc: '結合掌握度與距上次練習的天數計算緊迫度，7–14 天的「黃金複習期」權重最高。',
            formula: 'priority = (10 − score) × W(Δt)',
          },
        ],
      },
      parent: {
        tag: '06 · 家長學習報告',
        title: '把學習數據翻譯成家長看得懂的話',
        lead:
          'Parent Pro 透過 LINE 官方帳號推送每日與每週學習報告。系統彙整答題量、正確率、各科與知識點表現，再由 AI 整理成錯題重點與具體學習建議，讓家長不只看到分數，也知道孩子卡在哪個觀念。',
      },
      cloud: {
        tag: '07 · 雲端架構',
        title: '建構在 Google Cloud 上',
        lead:
          'Dogtor 的後端、資料與 AI 工作負載都運行在 Google Cloud 的 asia-east1（台灣）區域，並分為 staging 與 production 兩套環境。',
        services: [
          { name: 'Cloud Run', desc: 'FastAPI 後端，自動擴展承接 App、汪汪題與 LINE Bot 流量' },
          { name: 'Vertex AI · Gemini', desc: '多模態生題、題目與知識點配對' },
          { name: 'Cloud SQL', desc: '題庫、知識點、作答紀錄與掌握度' },
          { name: 'Cloud Storage', desc: '使用者上傳的講義與照片、產品知識文件' },
          { name: 'Cloud Scheduler', desc: '每日遺忘曲線衰減與學習報告排程' },
          { name: 'Cloud Build · Secret Manager', desc: 'CI/CD 部署與金鑰管理' },
        ],
      },
      responsible: {
        tag: '08 · 負責任的 AI',
        title: '讓 AI 對學生負責',
        points: [
          '題庫題目必須通過多模型交叉驗證與程式檢查，退件題直接排除，不靠修改答案湊數。',
          'AI 家教回答產品問題時只能依據官方文件，不自行猜測規則或價格。',
          '學生可隨時回報題目錯誤，團隊審查後修正題庫。',
          '由台大教授顧問在 AI、HCI 與學習互動方面提供指導，並與學術研究合作評估 AI 對學習的影響。',
        ],
      },
    },
    ctaTitle: '親自體驗 Dogtor 的 AI 學習',
    ctaText: '免費下載，讓 AI 幫你找出真正卡住的觀念。',
    ctaAbout: '認識團隊',
  },
  en: {
    metaTitle: 'AI Technology - Dogtor | A knowledge-point-driven learning engine',
    metaDescription:
      'How Dogtor uses AI: a curriculum knowledge graph, a multi-model question-generation pipeline, the Woof Q&A AI tutor agent, photo-to-quiz custom question banks, and a knowledge mastery model with forgetting-curve decay — all running on Google Cloud.',
    eyebrow: 'AI Technology',
    pageTitle: 'One question, one concept mastered — powered by a full AI engine',
    pageSubtitle:
      'Dogtor does more than hand questions to an LLM. We break the curriculum into knowledge points so every question, every answer and every recommendation maps to a concrete concept. AI gives us scale; knowledge points make learning measurable.',
    statsLabel: 'At a glance',
    stats: [
      { value: '5', label: 'AI systems working together' },
      { value: '3', label: 'models cross-check each question' },
      { value: '0–10', label: 'mastery score per knowledge point' },
      { value: '24/7', label: 'AI tutor on call' },
    ],
    tocLabel: 'On this page',
    sections: {
      graph: {
        tag: '01 · Knowledge graph',
        title: 'A curriculum knowledge graph as the backbone',
        lead:
          "We organize Taiwan's national curriculum and open learning resources into a hierarchy of book → chapter → section → knowledge point. Questions, levels, mistakes, reports and recommendations all attach to knowledge points.",
        points: [
          'An LLM distills 2–7 distinct knowledge points from the questions in each section; the team then reviews and merges overly fine or duplicate ones.',
          'Gemini classifies every question into its knowledge point and filters out questions that depend on images the app cannot show.',
          'TF‑IDF and SVD embed knowledge points into a cross-subject 3D knowledge graph where related concepts sit close together, guiding new subjects and level design.',
        ],
      },
      pipeline: {
        tag: '02 · Question pipeline',
        title: 'Question generation with multi-model verification',
        lead:
          'Every question goes through generate → blind solve → explain → review → programmatic checks. A question that fails any stage is dropped — answers are never edited to hit a quota.',
        steps: [
          { title: 'Fix the scope', desc: 'Lock the book, chapter, section, concept group, common confusions and exclusions. Uncertain facts are flagged for reference, never guessed.' },
          { title: 'Generate per concept', desc: 'An LLM writes four-option, single-answer questions in Traditional Chinese, each testing exactly one idea.' },
          { title: 'Blind solve', desc: "A different model answers without seeing the author's key. Any disagreement rejects the question." },
          { title: 'Explain and review', desc: 'A short explanation is written, then a reviewer model checks correctness, answer uniqueness and duplicates.' },
          { title: 'Programmatic checks', desc: 'Code verifies unique options, answer indices, scope, format, content hashes and review coverage. Only untouched, fully passed questions export.' },
          { title: 'Rehearse, then ship', desc: 'Imports run against staging first, are read back and verified, and only then go to production.' },
        ],
        note:
          'Each successful call is cached by content hash so failures resume only the missing steps, and token usage is tracked per model role to control cost. Students can report a wrong question in-app, and those reports flow back into the bank.',
      },
      tutor: {
        tag: '03 · Woof Q&A tutor',
        title: 'An AI tutor agent that decides what help you need',
        lead:
          'Woof Q&A (汪汪題) is a tool-calling agent, not a single LLM call. Students type or photograph a question and the agent chooses how to help:',
        tools: [
          { name: 'Solve and explain', desc: 'Walks through the problem and the concept behind it, including photographed questions.' },
          { name: 'Generate practice', desc: "Writes questions on a named topic — or, if none is given, on the student's last 30 days of mistakes — and saves them as a playable level." },
          { name: 'Learning summary', desc: 'Reads recent attempts, accuracy, per-subject and battle results, and gives brief feedback.' },
          { name: 'Product help and reports', desc: 'Answers app questions only from the official product document, and forwards bug reports with screenshots to the team.' },
        ],
      },
      custom: {
        tag: '04 · Custom question banks',
        title: 'Snap your notes, get a level',
        lead:
          'Students photograph or upload notes, handouts, exams or PDFs. Files go to Cloud Storage, a multimodal model reads them and produces structured questions, options and explanations that become a playable level — for any subject.',
        points: [
          'Multimodal input: images and PDFs go straight to the model (Vertex AI Gemini), with no manual transcription.',
          'Structured output: about 15 questions of JSON per level, normalized and validated before they reach the database.',
          'Quota and retries: quota is checked before generation, and failures retry a bounded number of times with logging.',
        ],
      },
      mastery: {
        tag: '05 · Mastery model',
        title: 'Every answer updates the student’s knowledge map',
        lead:
          'Each student has a 0–10 mastery score for every knowledge point. It decides what the next level draws, what to review today, and what parents see in reports.',
        blocks: [
          {
            title: 'Bayesian-smoothed mastery',
            desc: 'Accuracy over a sliding window of the last 20 attempts, with a 50% prior that fades as attempts grow, so one lucky answer is not "mastered".',
            formula: 'score = (correct + w/2) / (n + w) × 10, w = max(0, 4 × (1 − n/20))',
          },
          {
            title: 'Weakness-weighted levels',
            desc: 'When a level draws questions, each knowledge point is weighted by max(10 − score, 1): weaker concepts get more questions.',
            formula: 'weight = max(10 − score, 1)',
          },
          {
            title: 'Forgetting-curve decay',
            desc: 'Following the Ebbinghaus curve, Cloud Scheduler gently lowers unreviewed scores on days 7, 14, 30 and 60, never below half.',
            formula: 'score ← max(5, score × 0.95 / 0.90 / 0.85 / 0.80)',
          },
          {
            title: "Today's review picks",
            desc: 'Urgency combines mastery with days since practice; the 7–14 day "golden review window" weighs the most.',
            formula: 'priority = (10 − score) × W(Δt)',
          },
        ],
      },
      parent: {
        tag: '06 · Parent reports',
        title: 'Turning learning data into words parents understand',
        lead:
          "Parent Pro sends daily and weekly reports through LINE. The system aggregates attempts, accuracy and per-subject and per-concept performance, and AI turns them into the key mistakes and concrete next steps — so parents see which concept their child is stuck on, not just a score.",
      },
      cloud: {
        tag: '07 · Infrastructure',
        title: 'Built on Google Cloud',
        lead:
          "Dogtor's backend, data and AI workloads run on Google Cloud in asia-east1 (Taiwan), with separate staging and production environments.",
        services: [
          { name: 'Cloud Run', desc: 'FastAPI backend that autoscales for the app, the AI tutor and the LINE bot' },
          { name: 'Vertex AI · Gemini', desc: 'Multimodal question generation and question–concept matching' },
          { name: 'Cloud SQL', desc: 'Question bank, knowledge points, attempts and mastery' },
          { name: 'Cloud Storage', desc: 'Uploaded notes and photos, product knowledge documents' },
          { name: 'Cloud Scheduler', desc: 'Daily forgetting-curve decay and report jobs' },
          { name: 'Cloud Build · Secret Manager', desc: 'CI/CD and secrets' },
        ],
      },
      responsible: {
        tag: '08 · Responsible AI',
        title: 'Holding AI accountable to students',
        points: [
          'Bank questions must pass multi-model verification and programmatic checks; rejected questions are dropped, not patched.',
          'The tutor answers product questions only from the official document and never guesses rules or prices.',
          'Students can report any question; the team reviews and fixes the bank.',
          'National Taiwan University professors advise on AI, HCI and learning interaction, and we collaborate on academic research into how AI affects learning.',
        ],
      },
    },
    ctaTitle: 'Try Dogtor’s AI learning yourself',
    ctaText: 'Free to download. Let AI find the concepts you are really stuck on.',
    ctaAbout: 'Meet the team',
  },
}

// The international app follows College Board frameworks, writes questions in
// English and has no parent reports or LINE bot, so those parts of the
// English page are rewritten and the parent-report section is dropped.
function globalTechnology() {
  const en = technologyContent.en
  const s = en.sections
  const { parent, ...sections } = s
  return {
    ...en,
    metaTitle: 'AI Technology - Dogtor | A concept-driven engine for AP, SAT & GRE prep',
    sections: {
      ...sections,
      graph: {
        ...s.graph,
        title: 'A knowledge graph of every course',
        lead:
          'We break each course into a hierarchy of unit → topic → knowledge point, following its published framework (the College Board course frameworks for AP and the SAT). Questions, levels, mistakes and recommendations all attach to knowledge points.',
      },
      pipeline: {
        ...s.pipeline,
        steps: s.pipeline.steps.map((step) =>
          step.title === 'Generate per concept'
            ? { ...step, desc: 'An LLM writes four-option, single-answer questions in English, each testing exactly one idea.' }
            : step
        ),
      },
      tutor: {
        ...s.tutor,
        tag: '03 · Ask Dogtor',
        lead:
          'Ask Dogtor is a tool-calling agent, not a single LLM call. Students type or photograph a question and the agent chooses how to help:',
      },
      mastery: {
        ...s.mastery,
        lead:
          "Each student has a 0–10 mastery score for every knowledge point. It decides what the next level draws and what to review today.",
      },
      cloud: {
        ...s.cloud,
        tag: '06 · Infrastructure',
        lead: "Dogtor's backend, data and AI workloads run on Google Cloud, with separate staging and production environments.",
        services: s.cloud.services.map((svc) =>
          svc.name === 'Cloud Run'
            ? { ...svc, desc: 'FastAPI backend that autoscales for the app and the AI tutor' }
            : svc.name === 'Cloud Scheduler'
              ? { ...svc, desc: 'Daily forgetting-curve decay and other scheduled jobs' }
              : svc
        ),
      },
      responsible: { ...s.responsible, tag: '07 · Responsible AI' },
    },
  }
}

export function getTechnologyMessages(locale, market = 'tw') {
  if (market === 'global') return globalTechnology()
  return technologyContent[locale] || technologyContent['zh-TW']
}
