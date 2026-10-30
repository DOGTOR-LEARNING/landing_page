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

## AI Team 聊天室（Phase 2、3）

- 入口：`/admin/ai-team`（需 `chat.view`；發言需 `chat.post`；建立聊天室、設定私人聊天室成員、停止別人的 AI 任務需 `chat.manage`）。`/admin/ai-team/agents` 調整 AI 角色與查看用量（`agents.view`／`agents.manage`）。super_admin 自動擁有全部權限，其他員工到「員工管理」勾選。
- 使用：在訊息中輸入 `@Finance`、`@Marketing`、`@Operations`、`@Engineering`（也可用英文代號），該角色會根據聊天室最近 20 則訊息回覆。跨部門問題輸入 `@Team`：Team Lead 先安排第 1 輪的角色與任務；**每輪結束後 Team Lead 會看討論內容決定下一步**——只讓還有論點要回應的角色進下一輪，並寫明要回應哪一點，或判斷已有共識／只剩資料不足就直接結束；最多 3 輪（第 3 輪後不再評估、直接彙整），最後彙整「結論／分歧／資料不足／建議下一步」。寫 `@Team @Finance @Marketing` 代表只由點名的角色參與（Team Lead 不能加人，但仍負責分配任務與決定誰再發言）；只寫 `@Team` 則由 Team Lead 自己挑人。發問者的頁面會自動推進討論，可隨時「停止討論」，失敗或停止後可「繼續討論」。AI 只提供文字建議，沒有任何工具或寫入權限，也不能呼叫其他 AI。
- 顯示：所有訊息（員工與 AI）都支援 Markdown 與 LaTeX（KaTeX，行內 `$...$`、獨立 `$$...$$`），不渲染 HTML。AI 角色的系統指示會自動附上公式格式提醒。
- 最終結論 .md：`@Team` 討論完成後，彙整訊息下方有「下載最終結論 .md」（單一角色回覆是「下載 .md」）。內容含主題、時間、發問者、參與角色、最終結論與各角色發言附錄；由後端 `GET /admin/chat/runs/{id}/report` 即時產生，不另外存檔。
- 多模型：每個 AI 角色可在「AI 角色與用量」選擇 AI 服務與模型（Team Lead 也可以）。支援 OpenAI GPT（`OPENAI_API_KEY`）、Google Gemini（`GEMINI_API_KEY`，Google 的 OpenAI 相容端點）、DeepSeek（`DEEPSEEK_API_KEY`，DeepSeek 的 OpenAI 相容端點）、Anthropic Claude（`ANTHROPIC_API_KEY`，官方 `anthropic` SDK）。前三個金鑰 staging／正式 Cloud Run 都已有；Claude 要先在 Cloud Run 加 `ANTHROPIC_API_KEY` 才能用，沒設定時角色卡會顯示「尚未設定金鑰」，回覆會失敗並提示。每一步都記錄實際回覆的服務與模型（Claude 拒答時自動改由備援模型回答、Gemini `-latest` 解析成實際版本），之後改設定也不會改到歷史。用量頁有「本月各模型用量」。Claude 預設 `claude-opus-5-5`，effort `medium`，啟用 `fallbacks: "default"`；Claude 有內建牌價估算（$4／$20 每百萬 tokens），其他服務可用 `AI_TEAM_PRICE_<PROVIDER>_INPUT_PER_1M`／`_OUTPUT_PER_1M` 設定。
- 記憶：每個 AI 角色有自己的記憶（`ai_agent_memories`，每角色最多 50 則），每次回覆都會附上最近 30 則（標明是資料不是指令）。管理員在「AI 角色與用量 → 記憶」新增／修改／刪除；AI 在對話中遇到值得長期記住的事實會自己寫「[記住] …」（每次最多 3 則，不會出現在回覆內文），聊天室該則回覆下方顯示「XX 記住了：…」，發起該對話的人或管理員可按「撤銷」。實測：在一個聊天室告訴 Finance 本月支出，另一個聊天室問「還能再花多少」能正確引用。
- 個人介紹：每位員工在「帳號設定 → 個人介紹」填職稱與自我介紹（`admin_users.job_title`／`bio`），聊天室名字旁顯示職稱、滑過看介紹；AI 回覆時會收到發言同事的背景。
- 新增角色：「AI 角色與用量 → 新增 AI 角色」（英文代號建立後不能改，名稱與代號不能和現有角色重複）。預設新增 Engineering B（DeepSeek），負責交叉審查 Engineering 的方案；Team Lead 會讓同領域的角色都參與並在下一輪互相檢查。`@Engineering B` 只會叫 B（名稱最長者優先比對）。
- 回覆長度：角色的「單次回覆上限」改為提示 AI 的長度目標；送給模型的上限至少 8000 tokens，避免推理型模型想太久而沒有輸出（GPT 在長討論中曾因此失敗）。
- 聊天內容只存在 Cloud SQL，不寫進 log。停用員工後保留歷史訊息，但撤銷登入即無法再讀取。
- Migration：`alembic upgrade head` 會套用 `2728ffdfa62d`（六張表＋預設 4 個角色與 Team Lead＋「公司大廳」）。回滾：`alembic downgrade e7f8a9b0c1d2` 會刪除聊天紀錄，正式環境先備份。
- 環境變數（後端，皆可不設）：`AI_TEAM_DAILY_RUNS_PER_USER`（預設 50，一次 @Team 算 1 次）、`AI_TEAM_DAILY_TOKENS`（預設 3000000）、Team 討論的 `AI_TEAM_MAX_AGENTS`（3）、`AI_TEAM_MAX_ROUNDS`（3）、`AI_TEAM_RUN_TOKENS`（80000）、`AI_TEAM_RUN_SECONDS`（300）、`AI_TEAM_RUN_COST_USD`（0＝不限）、`AI_TEAM_PRICE_INPUT_PER_1M`／`AI_TEAM_PRICE_OUTPUT_PER_1M`（USD，用來估算費用）。模型金鑰沿用既有 `OPENAI_API_KEY`（staging、正式都已設定）。
- 官網的 `/api/admin/chat/.../execute` 設定 `maxDuration = 120`，後端呼叫模型逾時 90 秒。
- 測試：`ADMIN_AUTH_TEST_DB=admin_auth_test ... pytest tests/test_admin_chat.py tests/test_admin_auth.py`（同樣只能指向隔離 DB）。

## PWA、通知與待辦（2026-10-24）

- **PWA**：後台可「加入主畫面」／Chrome「安裝」，名稱「Dogtor 團隊」，從 `/admin/ai-team` 開啟（`public/admin-manifest.webmanifest`、`public/admin-sw.js`，service worker scope 為 `/admin/`，不做離線快取）。
- **@同事與通知**：聊天室輸入 `@名字` 會通知那位同事（自動完成會列出有聊天權限的同事；看不到該聊天室的人不會收到）。右上角鈴鐺顯示「提到你／請你決策／指派待辦」，點了會跳到那則訊息或待辦。
- **推播**：同事在「帳號設定 → 推播通知」於每台裝置開啟。iPhone／iPad 需先用 Safari「加入主畫面」並從主畫面打開（iOS 16.4+）。後端要設定 VAPID 金鑰才會推播（未設定時仍有鈴鐺）：
  1. `cd ../superb_app/backend && venv/bin/python -m scripts.generate_vapid_keys`
  2. 在中央 Cloud Run（`superb-backend`，staging 另產一組）設定 `VAPID_PUBLIC_KEY`、`VAPID_PRIVATE_KEY`（私鑰放 Secret Manager 更好）、`VAPID_SUBJECT=mailto:...`。換金鑰後所有裝置要重新開啟通知。
- **待辦**（`/admin/todos`，權限 `todos.view`／`todos.manage`）：三欄看板、「指派給我」、負責人可為同事或 AI 角色、期限、優先、變更紀錄與復原。聊天訊息可按「加入待辦」。指派給同事會通知他。
- **Team Lead 兼任 PM**：所有 AI 都看得到未完成待辦（資料，不是指令）；Team Lead 的回覆可直接新增／更新待辦、用「請決策」通知同事，聊天室會顯示做了什麼並可取消／復原。只有 Team Lead 能動待辦，其他角色只能建議。只寫 `@Team` 的待辦類問題（例如「把 #9 改成進行中」「目前還有哪些待辦」）Team Lead 會直接處理、不召集其他角色。
- 資料表（migration `594709dac30e`）：`admin_todos`、`admin_todo_events`、`admin_notifications`、`admin_push_subscriptions`。

## Notion 待辦同步與 Finance 帳本（2026-10-25）

- 需要：後端已有的 `NOTION_TOKEN`（財務共用）；Finance 帳本另用既有的 `NOTION_DATABASE_ID`。不需新增環境變數。
- 連接：`/admin/todos` →「連接 Notion」（需 `todos.manage`）。先在 Notion 打開待辦資料庫 →「⋯」→「連線」→ 加入公司 integration，再貼「複製連結」的網址。確認欄位對應與成員對應後按「開始同步」，第一次會匯入整個資料庫（最多 3000 筆），並把看板上未完成、尚未連結的待辦寫進 Notion。
- 成員對應：預設用 email（integration 需有「讀取使用者資訊含 email」能力）或名字配對；不同名的人在對話框手動選。
- 換資料庫會清掉舊連結（看板上的待辦保留）；「停止同步」只停用，不刪任何資料。
- API：`GET/PUT/DELETE /admin/todos/notion`、`POST /admin/todos/notion/connect`、`POST /admin/todos/notion/sync?full=`。
- 排錯：錯誤訊息會顯示在對話框與看板上的 Notion 狀態（紅點）。最常見是資料庫沒有加入 integration（404）或貼到「連結的資料庫檢視」。


## AI 知識庫（2026-10-30）

- `/admin/knowledge`，權限 `knowledge.view`／`knowledge.manage`（員工管理可勾選；超級管理員預設有）。切換「台灣（繁中）／International（英文）」編輯兩份文件，可預覽 Markdown。
- 汪汪題與 LINE 官方帳號回答產品問題（功能、價格、規則）時只根據這份文件。儲存後一分鐘內生效，不用重新部署。
- 文件存在 `gs://dogtor_asset/product_info/<staging|production>/<tw|en>.md`，由後端 `GET/PUT /admin/product-info/{market}` 讀寫（一律走預設的 tw 後端，兩個市場共用 bucket）。staging 後台改的不會影響正式環境。
- 兩個人同時編輯時，後存的會被擋下（409），按「載入最新版本」重新載入再改。
- 還沒從後台存過時，顯示的是程式碼裡 `backend/app/prompts/product_info/<market>.md` 的初始版本。
- 後端需要：各 Cloud Run 服務帳號對 `dogtor_asset` 有讀取權限，tw 後端另需寫入權限；建議 `gsutil versioning set on gs://dogtor_asset` 保留歷史版本。
