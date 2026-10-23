# 後台第一階段修改計畫

範圍：個別員工帳密登入、員工與頁面權限管理、明亮側邊導航；AI 聊天室後續實作。

- `app/admin/`：共用工作區、登入、總覽、推播、指定用戶通知、公告、員工與帳號設定路由。保留 Dogtor 藍綠色、圓角、通知預覽及發送確認。
- `app/api/admin/`、`lib/adminProxy.js`：同源 HttpOnly cookie；寫入驗證 Origin；伺服器轉送 session，不再接受共用密語或公告 key。
- `../superb_app/backend/app/admin_auth.py`、`routers/admin_auth.py`：MySQL 員工、雜湊密碼、可撤銷 session、權限、登入限流與稽核。
- `../superb_app/backend/alembic/versions/`：新增獨立 admin_users、admin_sessions、admin_login_limits、admin_audit_logs；不變更 App users。第一版角色及個人權限以明確 allowlist 保存於員工紀錄，角色為 super_admin/admin/staff。
- 既有 announcements 管理 API、notifications 的 broadcast/send_to_emails 與 admin router：後端驗證 session + 權限。公開 App 公告保持原狀。
- bootstrap CLI：互動式輸入首位員工資料與密碼；不建立預設密碼。既有資料庫不重設。

衝突與部署：目前前後端獨立部署、中文版與英文版可能連到不同 DB。員工身分以單一主後端為準；其他市場可配置 ADMIN_AUTH_BACKEND_URL 進行中央 session 驗證。新舊登入不可混用，需先 migration/bootstrap、部署後端，再部署前端。舊 key 將不再授權操作。

本次不自動部署正式環境或執行未知環境的 migration；確認連線環境後先 staging 驗證。測試涵蓋登入、session 撤銷、權限與 CSRF；建置前端並檢查桌機／手機。
