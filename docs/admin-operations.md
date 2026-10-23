# Dogtor 員工後台操作與部署

## 本次範圍與現況

已實作員工帳密登入、伺服器端登入紀錄、員工管理、個別功能授權、明亮工作區與分頁。

- `/admin/login`：Email + 密碼登入。
- `/admin`：工作總覽。
- `/admin/push`：全體推播；`/admin/email`：指定 App 用戶推播。
- `/admin/announcements`：公開公告預覽及管理。
- `/admin/team/users`：新增員工、停用、重設密碼、角色與功能權限。
- `/admin/team/roles`：系統角色說明；實際授權在員工編輯視窗設定。
- `/admin/settings`：修改自己的密碼，完成後所有裝置須重新登入。
- `/admin/activate`：首位管理員的一次性密碼設定。

第一版角色為固定的 `super_admin/admin/staff`；admin/staff 的權限逐人指定，沒有自訂角色編輯器。AI Team、聊天室、財務模組本次未實作。

2026-10-23 已對 Cloud SQL 的 **dogtor_staging** 執行新增 migration，並建立 `superb.taipei@gmail.com` / Pierre Chen，角色 super_admin、狀態 invited。

2026-10-23 同日先建立 Cloud SQL 備份（instance `dogtor-dev`），再對**正式資料庫 dogtor** 執行 migration（`alembic current` = `e7f8a9b0c1d2`）。正式首位 super_admin `superb.taipei@gmail.com` 由負責人以互動式 bootstrap 自行輸入密碼建立。線上 Cloud Run 後端與官網**尚未部署**此版本，所以在部署前無法於正式網站登入。整體進度與下一步見 `docs/company-admin-ai-team-spec.md` 開頭的「目前進度」。

UI：已改為與官網一致的淺色風格（深藍側欄、官方字標、橘色漸層按鈕）；色票集中在 `admin.module.css` 的 `.workspace` `--ws-*` 變數。

## 安全與資料

四個獨立資料表：`admin_users`、`admin_sessions`、`admin_login_limits`、`admin_audit_logs`。不共用 App users。密碼使用專案現有 bcrypt（cost 12），至少 8 字元，最多 72 UTF-8 bytes；session 12 小時，只保存 token SHA-256。Cookie HttpOnly、SameSite=Strict，正式建置加 Secure。瀏覽器不取得原始 session token、不放 localStorage。所有寫入從同源 Next.js API 進入並檢查 Origin；後端僅接受 Authorization Bearer。員工停用、密碼重設及權限變動撤銷該員工所有 session。

登入限流存 MySQL，跨 Cloud Run instance 共用。錯誤登入不透露帳號是否存在。帳號建立、更新、啟用、登入成功／失敗、登出及修改密碼會寫入稽核紀錄；推播送達統計保留原系統行為。後台不載入公開網站的分析與廣告追蹤。啟用 token 放 URL fragment，使用後從網址清除，資料庫只存其 hash。

後端公告管理與全體／指定推播均驗證員工權限；2026-10-23 已移除推播與公告的舊共用 key 授權：瀏覽器不再送通關密語，`X-Announcements-Key` 不能管理公告，`/api/admin/verify` 已刪除。`ADMIN_PASSPHRASE` 環境變數**保留**在官網與 `superb-backend`，現在只當財務報帳的伺服器之間金鑰（官網 → 後端 `/finance`），沒有 `FINANCE_API_KEY`。注意：後端環境變數 `ANNOUNCEMENTS_API_KEY` **仍要保留**，它現在只給 Cloud Scheduler／Cloud Tasks 呼叫 campaigns、scheduled reports 用，不再能管理公告。公開 App 公告和 App 使用的 `/admin/subjects_and_chapters` 維持原讀取入口；舊後端的其他管理工具僅限 super_admin。

## 本機啟動

後端（既有 venv 及 .env，先確認 DB_NAME 是 staging）：

```bash
cd /Users/guanyuchen/superb_app/backend
DB_NAME=dogtor_staging venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8082
```

本機前端 `.env.local`（已建立、Git 忽略；沒有 secret）：

```dotenv
ADMIN_AUTH_BACKEND_URL=http://127.0.0.1:8082
ADMIN_PUBLIC_ORIGIN=http://127.0.0.1:3000
BACKEND_Announcement_URL=http://127.0.0.1:8082
BACKEND_NOTIFICATIONS_URL=http://127.0.0.1:8082/notifications
```

```bash
cd /Users/guanyuchen/landing_page
npm run dev -- --hostname 127.0.0.1
```

請用 `http://127.0.0.1:3000`，確保 Origin 與設定相符。原有 Cloud SQL Proxy 必須持續執行。後端 `DB_HOST/DB_PORT` 已改為遵循環境變數，可沿用 Proxy。

## Migration 與首位管理員

```bash
cd /Users/guanyuchen/superb_app/backend
# 從既有 .env 取得 DB_USER/DB_PASSWORD，不要貼到聊天或命令列
DB_NAME=dogtor_staging venv/bin/alembic current
DB_NAME=dogtor_staging venv/bin/alembic upgrade head
# 正式環境必須先備份、驗證 staging，再將 DB_NAME 改為 dogtor 執行
```

首位帳號只能在 admin_users 為空時建立；已有帳號後 CLI 拒絕執行，不提供公開 bootstrap API 或永久 bootstrap key。

```bash
DB_NAME=dogtor_staging venv/bin/python -m scripts.bootstrap_admin \
  --email superb.taipei@gmail.com --name 'Pierre Chen'
# CLI 會安全地互動詢問密碼，不會將密碼寫到命令列或日誌
```

或提供一次性設定密碼連結（24 小時有效，檔案權限 0600，勿提交 Git）：

```bash
DB_NAME=dogtor_staging venv/bin/python -m scripts.bootstrap_admin \
  --email superb.taipei@gmail.com --name 'Pierre Chen' \
  --invite-file /tmp/dogtor-pierre-admin-activation.txt \
  --site-url http://127.0.0.1:3000
```

本次已採用第二種方式建立 staging 帳號。完整連結保存在上述本機私密檔案。若逾期，應由具資料庫權限的操作員重新簽發邀請，不可清空員工表或設定共用弱密碼。

其他員工從員工管理新增：填 Email、姓名、登入密碼、角色及權限，私下提供密碼。員工首次登入後可到帳號設定自行修改。第一版未接寄信服務；尚未提供其他員工的 Email 邀請與自助忘記密碼。

## 功能授權

- 新員工預設只有 `admin.access`。
- 推播：`push.view` / `push.manage`。
- 公告：`announcements.view` / `announcements.manage`。
- 員工管理：`users.view` / `users.manage`。
- 操作權限必須同時包含檢視權限。只有 super_admin 可以設定其他 super_admin；普通管理員不能授予自己沒有的功能。
- 不可停用或降級最後一位 active super_admin，並行請求以資料庫鎖保護。

## 部署順序與多市場

1. staging 已 migration；先驗證本機／staging。
2. 後端沿用 superb_app 的 `cloudbuild.yaml`：main 推送會自動部署 staging；production 推送會部署正式服務。此次沒有推送分支或部署。
3. 正式上線前建立 Cloud SQL 備份，套用相同 migration、bootstrap 正式員工，再更新後端與前端。切換期間舊 key 頁面會無法操作，應安排維護窗口。
4. 官網環境設定 `ADMIN_AUTH_BACKEND_URL` 為中央驗證後端 origin（無 `/admin` 尾綴）；`ADMIN_PUBLIC_ORIGIN` 為官網正式 origin。保留既有中／英文公告與推播後端設定。
5. 英文 Cloud Run 更新同一版本，設定其 `ADMIN_AUTH_BACKEND_URL` 指向中央身分後端。中央後端自己**不要設定此變數**，避免遞迴驗證。這樣同一員工登入可操作不同市場；員工管理一律由前端連中央後端。
6. 確認中文版與英文版服務都已更新驗證，才部署前端。舊共用密語已移除（見上方「安全與資料」）。

新增設定只包含上述 URL；不需要新的 AI Key、session secret 或外部驗證服務。既有 DB_USER/DB_PASSWORD、GCP 憑證仍使用目前 Secret 管理。

## 回滾

優先回滾應用程式，保留新增帳號資料表，避免遺失員工與稽核紀錄。若確實要移除新表，先備份四張 admin 表，再執行 `DB_NAME=dogtor_staging venv/bin/alembic downgrade d6e7f8a9b0c1`。此 downgrade 只會刪除新增 admin 表；**不要對有正式員工資料的環境直接執行**。回到舊版後台會恢復舊金鑰的安全限制，應另行安排安全回復方案。

## 驗證

後端測試必須指向名稱以 `admin_auth_test` 開頭的隔離 MySQL database，測試會清空四張 admin 表，程式會拒絕其他名稱。

```bash
cd /Users/guanyuchen/superb_app/backend
ADMIN_AUTH_TEST_DB=admin_auth_test DB_HOST=127.0.0.1 DB_PORT=33316 \
DB_USER=root DB_PASSWORD='' DB_NAME=admin_auth_test \
venv/bin/python -m pytest tests/test_admin_auth.py tests/test_backend_compatibility_regressions.py -q
```

前端：`npm run build`。同源閘道測試：`node scripts/check-admin-gateway.mjs`，只在指向隔離測試資料庫的本機預覽執行，需要測試 fixture 建立的 owner@example.com，不能指向 staging／production。

已驗證 migration upgrade/downgrade（隔離 MySQL 9.3）、staging MySQL 8.0 migration、員工登入與權限、資料庫 session 撤銷、公告管理舊 key 拒絕、Origin／Cookie／logout、防止最後超級管理員移除，以及桌面／窄版實際瀏覽器。沒有發送真實推播或更改現有正式公告。

最終結果：後端整合與既有相容性測試 **24 passed**，Next.js production build 成功，同源閘道測試成功。剩餘警告為專案原有 Pydantic／Python 版本與 Next.js workspace／middleware 提示。新版首頁截圖：`docs/screenshots/admin-overview.png`。測試過程沒有發送通知，發送確認視窗已以取消結束。
