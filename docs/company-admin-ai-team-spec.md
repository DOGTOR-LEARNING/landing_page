# Company Admin 2.0｜員工帳號、權限管理與 AI 虛擬團隊聊天室開發規格

> **用途**：直接交給 Claude Code、Codex 或其他 Coding Agent，於公司現有專案內實作。
>
> **版本**：v1.0｜2026-10-23｜**語言**：繁體中文
>
> **優先原則**：沿用既有系統；先讓登入與權限安全上線，再做聊天室，最後加入 AI 協作。不要因為規格舉例而擅自替換目前技術棧。

---

## 目前進度（接手的 AI 請先讀這段，最後更新：2026-10-23）

| 階段 | 狀態 | 說明 |
|---|---|---|
| Phase 1 登入與 RBAC | **程式完成，正式 DB 已 migration；尚未部署、尚未 commit** | 細節與指令見 `docs/admin-operations.md` |
| Phase 2 多人聊天室 + 單 Agent | 未開始 | — |
| Phase 3 多 Agent 討論 | 未開始 | — |
| Phase 4 工具與自動化 | 未開始 | — |

**Phase 1 已完成**
- 後端（`../superb_app/backend`，未 commit）：`app/admin_auth.py`、`app/routers/admin_auth.py`、migration `e7f8a9b0c1d2`、`scripts/bootstrap_admin.py`、`tests/test_admin_auth.py`；推播／公告 API 改為驗證員工 session。
- 前端（本 repo，未 commit）：`app/admin/**` 多頁工作區、`app/api/admin/**` 同源 proxy、`lib/adminProxy.js`。
- UI 已改為官網風格的淺色版：深藍側欄（同官網 header）+ 官方字標、橘色漸層主按鈕與標籤、首頁 hero 風格的深藍歡迎卡。**後續頁面請沿用 `admin.module.css` 中 `.workspace` 的 `--ws-*` 色票，不要另起風格。**
- 密碼最短 **8 字元**（前後端一致，最多 72 bytes）。
- DB：`dogtor_staging` 與正式 `dogtor` 皆已套用 migration（正式環境套用前已建立 Cloud SQL 備份，instance `dogtor-dev`）。
- 正式 DB 首位 super_admin `superb.taipei@gmail.com`：bootstrap 指令已啟動，由負責人在終端機自行輸入密碼（AI 不經手密碼）。若 `admin_users` 已有資料即代表已完成。
- 權限：使用者表示權限細節之後會自行調整；目前沿用固定角色 `super_admin/admin/staff` + 逐人勾選功能權限，**不要再擴充權限系統**，除非使用者要求。

**下一步（依序）**
1. 確認正式 super_admin 已建立並可登入（需要第 2 步部署後才能在正式網站登入）。
2. Commit 前後端變更 → 部署後端到 Cloud Run（`superb-backend`）→ 部署官網，設定 `ADMIN_AUTH_BACKEND_URL`、`ADMIN_PUBLIC_ORIGIN`；英文版後端同步更新（見 operations 文件「部署順序」）。
3. 輪替／移除舊 `ADMIN_PASSPHRASE` 與公告 key。
4. 待補：員工 Email 邀請、自助忘記密碼（需寄信服務）。
5. 開始 Phase 2（第 5、7、8 章與第 11 章規格）。

---

## 0. 給 Coding Agent 的總指令（請先閱讀）

你要在**既有公司官網／Admin 專案**中完成一次漸進式擴充，不是另建新產品。開始前先閱讀 Repository：

1. 確認前端與後端框架、目前 Admin 路由、共用 key 登入機制、推播與 App 布告欄現有邏輯、DB Schema／ORM、API 規範。
2. 確認 GCP 部署方式、既有 Cloud Run 服務、Cloud SQL 類型（MySQL 或 PostgreSQL）、Cloud Storage bucket、Secrets 管理、CI/CD 與環境變數慣例。
3. 先輸出一份**實際檔案修改計畫、資料表 migration 計畫與可能衝突**，再分階段實作；禁止在不知道目前程式架構時自行建立另一套框架。
4. **保護既有功能**：推播、公告、公開網站、App 使用者認證與既有 API 行為都不可被破壞；不得把公司員工帳號與 App 一般使用者帳號直接混為一談。
5. 優先在**現有常駐 Cloud Run** 加入新 API，在**現有 Cloud SQL** 加表、Cloud Storage 存附件。**MVP 不需要 Firestore、不需要額外 Cloud Run、不需要 MCP、不需要 Discord／LINE／Google Chat Bot。**
6. 遇到尚未定義的實作細節，先按本規格的安全預設與專案既有慣例完成；真正需要 secrets／管理員 Email 等外部資料才設為待配置，不要虛構。
7. 每一階段完成後提供變更清單、 migration／部署指令、測試結果及尚未實作事項。實作前確認是否使用正式環境，**不得擅自破壞或重設正式資料**。

## 1. 專案背景與目標

### 現況
- 公司團隊目前約 3～4 人，預計未來增加員工。
- 已有公司官網及其 Admin 後台，目前能操作 App 推播、App 布告欄等功能。
- Admin 現在只由一組簡單的共用 key 保護，缺乏個別員工身分與細部授權。
- 基礎設施已有一個**常駐／已使用的 GCP Cloud Run**、**Cloud SQL**、**Cloud Storage**，以及主要 AI 模型的 API 使用能力。
- 未來會在同個 Admin 裡擴充財務、行政管理等模組；財務報帳模組有獨立規格，本專案不得重寫或干擾。

### 本次目標
1. 每位員工使用自己的**帳號 + 密碼**登入 Admin。
2. 公司創始管理層預設擁有管理員權限；管理員能新增、停用員工、重設密碼及管理各功能存取權。
3. 新增一個**多人 AI 團隊聊天室**：真人成員可共享對話、提及 AI 角色、查看歷史訊息。
4. AI 角色包括 Finance、Operations、Marketing、Engineering（可擴充），具獨立職責、模型與工具權限。
5. 後續讓多個 AI 能由 Orchestrator 統籌討論、拆解任務、互相提出意見與彙整結論；**不是讓 Bot 無限制相互呼叫**。
6. 後續才接入 Notion、Google Drive、財務後台等操作型工具；所有高風險寫入或外部行為需審核。

### 不在第一版範圍
- 不做獨立的第三方聊天室 Bot、手機原生 App 或企業 IM 替代品。
- 不做完整 ERP、薪資發放或銀行轉帳。
- 不做可以任意讀寫公司全部資料的無限制自主 Agent。
- 不強制導入 Firestore、向量資料庫、Redis、MCP、額外微服務或大型工作流框架。

---

## 2. 推薦架構

```text
現有官網 / Admin（沿用前端技術棧）
├── /admin/login              員工登入
├── /admin                    原管理首頁
├── /admin/push               原推播功能（保留）
├── /admin/announcements      原公告功能（保留）
├── /admin/team/users         員工管理
├── /admin/team/roles         角色及權限管理
└── /admin/ai-team            多人 AI 團隊聊天室
       │
       ▼
現有 GCP Cloud Run（沿用後端服務）
├── Auth / Session / CSRF
├── Authorization (RBAC)
├── Chat API + Message Persistence
├── AI Provider Adapter (OpenAI / Anthropic / Google)
├── Agent Registry / Orchestrator
└── Audit Log / Job Dispatch
       │
       ├── Cloud SQL：帳號、權限、聊天室、訊息、AI 任務、稽核
       ├── Cloud Storage：未來聊天室附件、報告等私有檔案
       ├── Secret Manager：API Key、加密／Session secrets
       └── Cloud Tasks（按需）：較長的 Agent 工作與重試
```

**Cloud Run 使用原則**
- MVP 聊天使用 HTTP 寫入訊息 + 短輪詢取得真人新訊息（例：2～5 秒，適度退避），AI 回覆採 SSE（若既有框架適用）。初期不要求 WebSocket。
- 訊息及任務狀態都必須先落在 Cloud SQL；**不得僅存在單台 Cloud Run instance 的記憶體**，因為未來可能多 instance。
- 長任務不要完全依賴單次 HTTP 連線；需可追蹤 `run_id`，並能處理中斷、逾時、重試。需要時再接 Cloud Tasks。
- 如果現有服務的部署策略或流量不適合長時間串流，先用「任務建立 → 輪詢結果」方式安全落地。

---

## 3. 員工帳號與登入（最高優先級）

### 3.1 帳號
- `email`（唯一，作為登入識別）、`display_name`、`status`、建立與更新時間。
- 使用員工自己的密碼；**資料庫只能保存加鹽且安全的單向密碼雜湊**，建議 Argon2id（使用專案技術棧成熟套件），絕不可明文、可逆加密或自製 hash。
- 狀態至少 `active / disabled / invited`。已停用帳號不能登入、不能使用 API，既有 session 應失效。
- 管理員可新增人員、指定角色、重設登入憑證、停用或重新啟用帳號；員工可修改自己的密碼。
- 新員工由管理員建立後，透過**一次性、短有效期的邀請／設定密碼連結**開通。若 Email 寄送服務尚未配置，可以提供只有管理員能使用的一次性啟用流程；不得將永久明碼預設密碼寫入程式或日誌。
- 預設創辦管理層為 `super_admin`，但**不得憑空填入成員 Email**。提供受保護的 bootstrap seed CLI／一次性啟用機制，透過部署環境明確配置首批帳號；第一次啟用後立即失效。

### 3.2 登入與 Session
- `/admin/login` 提供清楚的 Email、密碼、登入錯誤訊息、登出與修改密碼流程。
- 優先使用**伺服器端 session**：不可預測的隨機 session token、資料庫只保存 session token 的 hash；Cookie 設 `HttpOnly`, `Secure`, 適當的 `SameSite`, `Path` 及有效期。
- 不要把登入 Token 存在 `localStorage`；敏感寫入 API 使用 CSRF 防護（含 Origin／Referer 驗證及適當的 CSRF token 或框架既有防護）。
- 密碼驗證加上 rate limiting／暫時延遲與登入失敗紀錄，避免暴力猜測；不要洩漏帳號是否存在。
- 密碼變更、重設或停用帳號時，撤銷相關工作階段；支援管理員查看／撤銷 session（可稍後擴充）。
- 限制員工後台專用的 API 與 App 公開 API 的認證範圍，避免互相影響。

### 3.3 舊共用 key 轉換
1. 先建立帳號資料表、初始 super admin、安全登入及 Session。
2. 新登入流程可完整操作所有既有 Admin 頁面後，逐一把推播與公告**後端 API** 改為使用 Session + RBAC 驗證。
3. 以明確 migration／feature flag 安排過渡；過渡結束後**徹底移除舊 key 直通權限的後門**，輪替受影響的舊金鑰。
4. **不能只隱藏前端頁面**而讓舊 API 保持無驗證可操作。
5. 保留可回滾的 migration；正式資料庫部署前先備份並驗證現有功能。

---

## 4. RBAC：角色、頁面及功能權限

### 4.1 預設角色

| Role | 初始用途 |
|---|---|
| `super_admin` | 最初管理層；所有管理權限；可新增管理員、設定權限、管理 AI Provider。不得讓最後一個 super admin 被意外移除。 |
| `admin` | 日常管理；可由 super admin 指派細部管理功能。 |
| `staff` | 一般員工；只可進入獲授權的後台頁面與聊天室。 |

建議實作**角色 → 權限**的 RBAC，並讓管理員在 UI 針對人員指定角色及（若現有架構允許）細部權限覆寫。最重要的是：可以直覺勾選某員工能看哪些 Admin 功能、能否修改內容，而不只是三個寫死的職級。

### 4.2 權限代碼（建議最小集合）

```text
admin.access
push.view / push.manage
announcements.view / announcements.manage
chat.view / chat.post / chat.manage
users.view / users.manage
roles.view / roles.manage
agents.view / agents.manage
finance.view / finance.manage     # 保留未來接財務模組
```

- 左側選單與頁面依權限顯示／隱藏；直接輸入 URL 仍需 Server 驗證。
- 所有 API 不管是否由前端 UI 呼叫，都必須檢查有效身份、權限與必要的資源歸屬／聊天室成員資格。
- 新建員工使用**最小權限**，不得預設取得所有頁面。
- 頁面 `view` 與操作 `manage` 應區分。聊天室權限亦須驗證該用戶是否屬於指定群組。
- 管理員改權限後應立即或在短時間內反映；不要因 Session 舊快取而長時間保留已撤銷權限。

### 4.3 管理 UI
- `/admin/team/users`：使用者清單、搜尋、姓名、Email、狀態、角色、最後登入、邀請／停用／重設密碼。
- `/admin/team/roles`：角色清單及權限矩陣（頁面讀取、操作管理）；保護 super admin 系統權限。
- 已無權限的使用者看不到相應選單；若透過網址進入應得到 403 或安全的拒絕畫面。

---

## 5. AI Team 聊天室：使用者體驗

### 5.1 MVP 畫面
- 在 Admin 左側選單新增「AI Team」。維持網站原有 UI 視覺語言，響應式，桌面優先但手機可正常使用。
- 左側聊天室清單：預設「公司大廳」，可建立更多聊天室（例如產品、行銷、行政）。
- 聊天主區：所有具權限且屬於該聊天室的員工可共用訊息、看見發言者與時間；清楚區分真人與 AI。
- 輸入文字訊息、`@Finance`、`@Marketing`、`@Operations`、`@Engineering` 等角色；可指定單一 Agent 或啟動 AI Team 討論。
- 訊息要有送出中、成功、失敗重試狀態；新訊息能在其他成員畫面更新；登入後可看到歷史。
- 支援 Markdown 顯示且必須進行 XSS 安全處理，限制單筆長度及發送頻率。
- **每一則 AI 回覆都需顯示是哪個 AI Agent、使用哪個模型（可在詳細資訊查看）、任務狀態**，不得偽裝真人。
- MVP 可只支援純文字。檔案附件、全文搜尋、串接 Notion／Drive 都可在後續階段加入。

### 5.2 預設 AI 角色（可由管理員編輯）

| Agent | 職責 | 初期工具權限 |
|---|---|---|
| Finance | 費用分析、收支解釋、預算風險、月結建議 | 只有對話與管理員明確提供的資料，**無財務寫入權限** |
| Operations | 行政流程、待辦拆解、協調與追蹤 | 只有對話；待辦工具後續接入 |
| Marketing | 行銷企劃、社群文案、成效分析 | 只有對話；數據讀取後續接入 |
| Engineering | 架構建議、故障分析、技術規劃 | 只有對話；不可直接執行命令／部署 |
| Team Lead（系統） | 分派跨領域問題、決定討論輪次、彙整結論 | 只能分派與彙整，無最高系統權限 |

每個 Agent 定義：`name`、簡介、system instructions、provider、model、啟用狀態、允許參與哪些聊天室、工具 allowlist、單次 Token／金額限制。系統 prompt 保存在後端，不允許一般員工修改。

### 5.3 訊息處理

單一 Agent 範例：

```text
員工：@Finance 請幫我看看這個月成本應該注意什麼？
 -> 後端驗證員工與聊天室權限
 -> 儲存 human message
 -> 建立 ai_run、選擇 Finance 設定與授權資料
 -> 呼叫現有模型 API（例如 OpenAI / Claude / Gemini）
 -> 串流顯示並保存 AI 回覆、Token 使用量與狀態
```

真正的 AI Team 討論（Phase 2）：

```text
員工：「@Team 請幫我評估下個月行銷預算」
 -> Team Lead 判定所需 Finance + Marketing
 -> 各 Agent 有限制地提出觀點與所需資料
 -> 必要時針對他人的具體觀點回應
 -> Team Lead 給出整合方案、待補資料、風險與執行建議
 -> 全程保存各 Agent 可見輸出及 run 狀態
```

**明確限制**：不能由 Bot 訊息自動無限觸發下一個 Bot；只有 Orchestrator 能安排下一輪。先設定最多 3 個參與 Agent、最多 3 輪討論、每個 run 的 Token 上限、時間上限和總成本上限。使用者能中止任務；錯誤時保留已成功步驟並標記失敗。

**重要**：多 Agent 只是多次模型呼叫、角色設定與協作工作流，不保證比單 Agent 更正確。跨部門討論應按需啟動，而非每則訊息都召集全部 AI。

---

## 6. AI API 抽象與成本控管

- 建立通用 `AIProvider` 介面，例如 `generate()`、`stream()`、`usage()`；按現有環境選擇適用 SDK，支援 OpenAI、Anthropic、Gemini 中實際已配置的 Provider。
- MVP 先接**一個現有已可用的 API**，其他 Provider 通過 Adapter 擴充，避免一次改動過大。
- API Key 僅存在伺服器 Secret Manager 或既有安全秘密管理機制；不可放在前端 bundle、聊天紀錄、DB 的明文欄位、Git 或 log。
- 記錄每個 run 的 Agent、Provider、model、輸入／輸出 Token、估算成本、開始／結束時間與失敗原因（注意敏感資料遮罩）。
- 提供 Admin 使用量查看、每日及每月成本上限、每位員工使用率限制；超過限制時停止新的 AI 工作並給出說明。
- Provider 異常時有清楚錯誤、超時及有限次數重試；不得因重試產生重複訊息或重複工具操作。
- ChatGPT Plus／Claude 個人訂閱**不是**商用 API 額度；本系統使用既有的 API 計費專案。

---

## 7. Cloud SQL 資料表（依現有 ORM／資料庫型別調整）

**命名為建議值**，需先檢查是否與專案現有表名衝突。使用對應的 schema migration 工具，設定 Foreign Key、唯一鍵與查詢 index。不要盲目執行 SQL 直接覆蓋正式環境。

```text
admin_users
  id, email [unique], display_name, password_hash,
  status, created_at, updated_at, last_login_at

admin_roles
  id, code [unique], name, is_system

admin_permissions
  id, code [unique], description

admin_user_roles
  user_id, role_id [unique pair]

admin_role_permissions
  role_id, permission_id [unique pair]

admin_user_permission_overrides [optional in first MVP]
  user_id, permission_id, effect(allow/deny)

admin_sessions
  id, user_id, token_hash [unique], expires_at,
  revoked_at, created_at, last_seen_at

admin_audit_logs
  id, actor_user_id, action, resource_type, resource_id,
  metadata_json, created_at, ip_hash_or_metadata

chat_rooms
  id, name, visibility, created_by, created_at, archived_at

chat_room_members
  room_id, user_id, membership_role, joined_at [unique pair]

ai_agents
  id, slug [unique], display_name, description,
  instructions, provider, model, is_enabled,
  tool_policy_json, run_limits_json, created_at, updated_at

chat_messages
  id, room_id, sender_type(human/agent/system),
  sender_user_id(nullable), sender_agent_id(nullable),
  content, reply_to_id(nullable), client_request_id(nullable),
  ai_run_id(nullable), status, created_at, updated_at

ai_runs
  id, room_id, triggered_by_user_id, status,
  mode(single_agent/team), input_message_id,
  started_at, completed_at, error_code,
  token_input, token_output, estimated_cost

ai_run_steps [Phase 2]
  id, ai_run_id, sequence, agent_id, status,
  output_message_id, token_usage_json, started_at, completed_at

chat_attachments [Phase 3]
  id, message_id, storage_object_path, original_filename,
  mime_type, size_bytes, uploaded_by, created_at
```

**必要索引建議**：`admin_users.email`、`admin_sessions.token_hash`、`chat_messages(room_id, created_at, id)`、`chat_room_members(user_id, room_id)`、`ai_runs(room_id, started_at)`；必要時補 `client_request_id` 的唯一性或請求冪等性約束。

需要注意：
- 多人聊天室應先在資料庫保存訊息，取得成功狀態後才對外發送。
- 對話內容可能涉及機密，不應直接出現在 application logs。
- 移除／停用員工時保留合理的歷史發言與稽核紀錄，但撤銷未來存取權。
- 歷史內容分頁、預設只讀近期訊息，避免一次載入整個資料庫。

---

## 8. API 草案（實際命名依既有架構）

### Auth

```text
POST   /api/admin/auth/login
POST   /api/admin/auth/logout
GET    /api/admin/auth/me
POST   /api/admin/auth/change-password
POST   /api/admin/auth/activate-invite
```

### 員工與權限

```text
GET    /api/admin/users
POST   /api/admin/users
PATCH  /api/admin/users/:id
POST   /api/admin/users/:id/disable
POST   /api/admin/users/:id/reset-credentials
GET    /api/admin/roles
POST   /api/admin/roles
PATCH  /api/admin/roles/:id
GET    /api/admin/permissions
```

### 聊天室

```text
GET    /api/admin/chat/rooms
POST   /api/admin/chat/rooms
GET    /api/admin/chat/rooms/:id/messages?cursor=...
POST   /api/admin/chat/rooms/:id/messages
GET    /api/admin/chat/rooms/:id/events     # SSE or polling equivalent
GET    /api/admin/chat/rooms/:id/members
POST   /api/admin/chat/rooms/:id/members
```

### AI Runs / Agent 管理

```text
POST   /api/admin/chat/rooms/:id/ai-runs
GET    /api/admin/ai-runs/:runId
GET    /api/admin/ai-runs/:runId/events      # SSE optional
POST   /api/admin/ai-runs/:runId/cancel
GET    /api/admin/agents
PATCH  /api/admin/agents/:id                 # agents.manage only
GET    /api/admin/ai-usage
```

所有寫入 API 都要具備驗證、RBAC、輸入 schema 檢查、資源歸屬驗證；對重試高風險端點使用 `Idempotency-Key` 或 `client_request_id` 避免重複建資料。

---

## 9. 前端 UI/UX 要求

### Admin 共用 Layout
- 原有 Sidebar 功能名稱與操作流程盡量不變；新增 **團隊管理**、**AI Team** 入口。
- 首頁顯示目前登入帳號、角色、登出，並可變更自己的密碼。
- 若無權限則不渲染選單；前端所有限制都只是 UX，後端一定同步檢查。

### 員工管理
- 帳號列表，新增員工 Modal 或表單，角色／功能權限勾選。
- 停用帳號採二次確認；重設密碼必須走一次性啟用／重設流程。
- 無法意外停用最後一名 super admin。

### AI Team
- 類似常見聊天產品：聊天室列表、中央訊息區、底部輸入框、`@` Agent autocomplete。
- 提供「問單一 Agent」和「團隊討論」的明確入口／標記。
- AI 生成時顯示狀態；可看到等待、進行中、完成、失敗，並可停止較長任務。
- AI 的建議與真正執行外部操作必須區分（初期只有建議與文字輸出）。
- 以公司現有品牌視覺為主，避免另造不一致的設計系統。

---

## 10. 安全與權限邊界（必做）

1. **所有入口預設拒絕**，確認身分與權限後才放行。前端隱藏按鈕不是安全機制。
2. 密碼單向雜湊、Session Cookie 安全屬性、CSRF、XSS 防護、登入 rate limit、最小權限、稽核。
3. 使用參數化查詢／成熟 ORM，避免 SQL injection；所有內容與 URL 在渲染前採安全處理。
4. 秘密值放在 GCP Secret Manager 或既有安全配置；限制 Cloud Run service identity 權限；區分 dev／prod。
5. Agent 指令與外部文件一律視為不可信輸入，需防範 Prompt Injection；一般聊天不得讓 Agent 自行獲得更高工具權限。
6. 工具依 Agent 使用 allowlist 並經後端權限檢查；**自然語言 prompt 不能覆蓋後端權限設定**。
7. **不允許 AI 自動匯款、直接改薪資、刪除正式紀錄、任意操作 GCP、任意執行 Shell、部署正式版**。
8. 未來若串接 Notion、Drive 或財務資料：優先只讀；修改、寄送對外信件等高影響操作必須明確列出變更內容並由有權限真人核准；紀錄核准者、時間與結果。
9. 上傳附件只能進私有 Storage bucket；驗證 MIME／大小／安全檔名，不提供永久公開物件 URL；採授權 API 或短效 Signed URL。
10. 內部財務、員工資訊、聊天內容不得外洩到一般 App 前端或公開 API；AI Provider 傳輸資料範圍需可管控。

---

## 11. 分階段交付（請照順序）

### Phase 1 — 登入與 RBAC（最先完成）

**Deliverables**
- Cloud SQL migrations：users / roles / permissions / sessions / audit。
- 安全登入／登出／密碼修改／邀請或管理員設密流程。
- 初始 3～4 位 super admin 的安全 bootstrap 流程（Email 待配置）。
- 員工新增、停用、角色與頁面權限編輯。
- 原推播、公告的前後端權限保護。
- 移除共用 Admin Key 的永久後門；保留可控的轉換／回滾措施。

**完成標準**：不同帳號可登入、登入失敗安全、停用後無法操作、不同角色在頁面和 API 層皆確實隔離；既有功能正常。

### Phase 2 — 多人聊天室 + 單 Agent

**Deliverables**
- 房間／成員／訊息資料表、聊天室 UI、訊息 CRUD（保留歷史）。
- 3～4 個真人帳號可在同一聊天室看到訊息更新。
- `@Finance` 等單一 Agent 的回覆；模型 Adapter 先接一個已有 Key 的 Provider。
- AI 使用量與每次 run 紀錄、成本及速率限制。

**完成標準**：A 發言，B 可看到；無權限的 C 無法進入房間；`@Finance` 能回覆且 DB 可保存；AI 失敗時頁面不丟失真人訊息。

### Phase 3 — 多 Agent 討論與任務

**Deliverables**
- Team Lead Orchestrator：任務拆解、選 Agent、限制輪次、彙整結果。
- 完整 run 狀態、成員可見進度、取消與錯誤處理。
- 討論後提供**結論、分歧、資料不足、建議下一步**。

**完成標準**：一個跨領域提問可以自動指派兩個不同 Agent，看到各自合理的討論發言，再由 Team Lead 整理；不會無限互相回覆或失控燒 Token。

### Phase 4 — 工具與自動化（本次只預留介面）

- Notion API、Drive OAuth、現有財務模組的受控讀取。
- 管理員核准後才允許有副作用的工具寫入。
- 可逐步加入工作排程、任務追蹤、檔案上傳、報告產出。
- 若跨系統工具逐漸增多，再評估 MCP，**不應在 MVP 就為 MCP 額外建服務**。

---

## 12. 測試與驗收清單

- [ ] 完成 migration 後，原 Admin 推播與公告維持正常。
- [ ] 超級管理員可登入並設定至少三名管理員帳號，各自使用不同密碼。
- [ ] 資料庫不出現明文密碼、登入 Token 或 API Secret。
- [ ] 密碼錯誤、過期 Session、已停用帳號均無法通過驗證。
- [ ] 員工可更改自己的密碼；管理員可安全重設邀請，不回傳原始密碼。
- [ ] 角色權限對 Sidebar、頁面、所有 API 同時生效。
- [ ] 無權限員工即使手動呼叫 API，也拿不到推播／公告寫入能力。
- [ ] 不能停用／刪除最後一名 super admin。
- [ ] 3～4 位真人可共享同一聊天室；跨房間成員隔離正確。
- [ ] 聊天刷新頁面後歷史仍存在，分頁載入與排序正確。
- [ ] 使用相同 client_request_id 重試不會產生重複訊息／重複 AI run。
- [ ] AI Provider 超時／失敗不導致 UI 無限等待，能重試或提示。
- [ ] `@Finance` 取得正確的角色設定，不會有其他 Agent 的權限。
- [ ] Team 模式可限制輪次、Agent 數、執行時間與費用。
- [ ] XSS、CSRF、暴力登入、非授權資源訪問有對應保護或測試。
- [ ] Cloud Run 重啟或多 instance 時，聊天紀錄和 run 狀態不依賴記憶體遺失。
- [ ] 審計能查到登入／停用／角色變更／重要管理操作。
- [ ] 正式部署前先通過 staging 測試並具備 DB 備份與 rollback 步驟。

---

## 13. 交付要求

完成時請提供：

1. **實際修改的檔案清單**、新增／調整的資料表、各頁面入口。
2. **環境變數與 Secret 清單**，僅列名稱和用途，不要回傳真實 Key。
3. 本地啟動、migration、建立首批管理員、測試、部署 Cloud Run 的指令（必須符合 Repository 實況）。
4. `README`／`docs` 裡的操作手冊：如何新增員工、設定頁面權限、建立聊天室、設定 AI Agent 模型、查看使用量。
5. 自動化測試結果、驗收情況、尚未完成的項目和安全風險。
6. **不得因缺少邀請對象 Email 或 API Secret，就用預設弱密碼／假 Key 假裝完成**。請提供明確的配置方式。

### 建議的環境變數（按現有命名慣例調整）

```dotenv
# Existing connection settings; reuse rather than duplicate
DATABASE_URL=...

# Store sensitive values in GCP Secret Manager
ADMIN_SESSION_SECRET=...
ADMIN_BOOTSTRAP_TOKEN=...       # One-time bootstrap only, then revoke

# Use only configured providers
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...

# Optional, if an invite email service already exists
EMAIL_SENDER=...
EMAIL_PROVIDER_API_KEY=...

# Existing bucket if Phase 4 file attachments are implemented
CHAT_STORAGE_BUCKET=...
```

**提醒**：`ADMIN_BOOTSTRAP_TOKEN` 不應持續存在；以一次性 CLI 或經驗證的 Bootstrap 流程初始化首位超級管理員後就撤銷。`ADMIN_SESSION_SECRET` 是否需要，取決於專案既有 session 設計，避免不必要新增。

---

## 14. 可直接貼給 Coding Agent 的執行 Prompt

> 請依照此份 `company-admin-ai-team-spec.md` 規格，在**目前已開啟的公司官網 Repository** 上實際開發，不要重建專案。
>
> 先完整掃描程式架構、Admin 共用 key 登入、既有推播與公告 API、Cloud SQL ORM／migration、Cloud Run 部署及 Cloud Storage 使用方式；回報你將修改的檔案與各階段技術決策。
>
> 請優先完成 **Phase 1：安全的員工帳密登入、首批管理員 Bootstrap、RBAC、員工及角色管理，並讓所有現有 Admin 頁面／API 改用權限驗證**。在既有功能測試通過後，再完成 **Phase 2：多人共享的 AI Team 聊天室，以及可 @ 指定 AI Agent 回覆的功能**。若開發與測試順利，繼續完成 **Phase 3：具輪次和成本上限的多 Agent 協作討論**。
>
> 優先沿用現有 Cloud Run、Cloud SQL、Cloud Storage、前後端技術棧與已存在的 AI API；不要新增 Firestore、額外常駐服務、Discord Bot 或 MCP，除非實際必要且能解釋原因。
>
> 所有資料庫操作使用 migration；正式環境修改先備份。密碼不可明文儲存；Session／Cookie／CSRF／RBAC／API 驗證必須正確。現有 App 與公開網站不能被影響；舊 Admin Key 只能過渡，不能永久留作後門。
>
> 當需要真實管理員 Email、外部 Credentials 或部署權限時，提供最小必要的配置步驟，不要虛構憑證。完成後請實際執行測試，交付建置結果、測試證據、已知限制與部署／回滾文件。

---

## 15. 參考文件

- [Google Cloud Run：WebSockets 與跨執行個體同步](https://docs.cloud.google.com/run/docs/triggering/websockets)
- [Google Cloud Run：Request Timeout](https://docs.cloud.google.com/run/docs/configuring/request-timeout)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

