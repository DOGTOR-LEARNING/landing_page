# 快速啟動指南

## 1. 安裝依賴

```bash
cd landing_page
npm install
```

## 2. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器前往：http://localhost:3000

## 3. 圖片顯示問題

如果圖片無法顯示，請確認以下事項：

### 檢查圖片是否存在

```bash
ls -la public/
```

應該要看到：
- app_icon.png
- dogtor_logo.svg
- login-sea.png
- island_math.png
- question-corgi.png
- home-background-sky.png

### 如果圖片缺失

請從 Flutter App 或其他來源複製對應的圖片到 `public/` 資料夾。

可以從以下位置尋找：
- Flutter App: `frontend/superb_flutter_app/assets/images/`
- 或直接從設計檔案匯出

## 4. 更新 App Store 連結

當 App 上架後，更新以下檔案中的 `APP_STORE_URL`：

- `components/Header.js`
- `app/page.js`

將 `#coming-soon` 改為實際的 App Store 連結。

## 5. 建構生產版本

```bash
npm run build
npm start
```

## 常見問題

### Q: 圖片顯示不出來？
A: 確認圖片在 `public/` 資料夾中，檔名正確且大小寫匹配。

### Q: 樣式跑版？
A: 清除瀏覽器快取或使用無痕模式測試。

### Q: 部署後圖片還是有問題？
A: 確認部署平台有正確複製 `public/` 資料夾的所有檔案。

## 需要協助？

查看 README.md 獲得更多詳細資訊。
