# Dogtor 逗課 Landing Page

使用 Next.js 14 建立的 Dogtor 逗課 官方網站，採用 App Router 架構。

## 特色功能

- ✅ **Mobile-First RWD**：完全響應式設計，從 360px 起適配所有裝置
- ✅ **SEO 優化**：完整的 meta tags、Open Graph 和結構化資料
- ✅ **效能優化**：Next.js Image 優化、lazy loading
- ✅ **現代化 UI/UX**：對齊 App 視覺風格，流暢的動畫和互動
- ✅ **完整頁面**：首頁、FAQ、關於我們、支援中心、服務條款、隱私權政策

## 技術架構

- **框架**：Next.js 14 (App Router)
- **樣式**：CSS Modules + CSS Variables
- **圖片優化**：Next.js Image Component
- **部署**：可部署至 Vercel、Netlify 或任何支援 Node.js 的平台

## 開始使用

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

在瀏覽器開啟 [http://localhost:3000](http://localhost:3000)

### 建構生產版本

```bash
npm run build
npm start
```

## 專案結構

```
landing_page/
├── app/                    # Next.js App Router 頁面
│   ├── page.js            # 首頁
│   ├── faq/               # FAQ 頁面
│   ├── about/             # 關於我們
│   ├── support/           # 支援中心
│   ├── terms/             # 服務條款
│   ├── privacy/           # 隱私權政策
│   ├── layout.js          # 全域 Layout
│   └── globals.css        # 全域樣式
├── components/            # 共用元件
│   ├── Header.js
│   ├── Footer.js
│   └── Accordion.js
├── public/                # 靜態資源
│   ├── app_icon.png
│   ├── dogtor_eng_logo.svg
│   ├── dogtor_logo.svg
│   ├── login-sea.png
│   ├── island_math.png
│   ├── question-corgi.png
│   └── home-background-sky.png
└── package.json
```

## 待辦事項

### 上線前必須完成

- [ ] 更新 App Store 連結（目前為 `#coming-soon`）
- [ ] 更新實際的聯絡信箱（如果不是 support@superbapp.com）
- [ ] 新增更多 App 截圖到 `/public` 資料夾
- [ ] 設定 Google Analytics 或其他分析工具
- [ ] 測試所有頁面在不同裝置和瀏覽器上的顯示

### 可選優化

- [ ] 新增 sitemap.xml 和 robots.txt
- [ ] 實作深色模式（如果 App 有支援）
- [ ] 新增更多動畫和互動效果
- [ ] 多語言支援（如果需要）
- [ ] 新增部落格或更新公告功能

## 圖片資源

所有圖片應放在 `public/` 資料夾中。建議格式：

- Logo：SVG 或 PNG (透明背景)
- App 截圖：PNG 或 WebP
- 背景圖：WebP (優先) 或 PNG
- 建議尺寸：
  - App 截圖：750x1624 (iPhone 比例)
  - OG 分享圖：1200x630
  - Icon：512x512

## 效能目標

- Lighthouse Performance: ≥ 85
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 部署

### Vercel (推薦)

1. 推送程式碼到 GitHub
2. 在 Vercel 匯入專案
3. 自動建置和部署

### 其他平台

```bash
npm run build
```

將 `.next` 資料夾和 `package.json` 部署到支援 Node.js 的平台。

## 聯絡

如有問題請聯絡：dogtor.love.learning@gmail.com

---

**最後更新**：2026-02-13
