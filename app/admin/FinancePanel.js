'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './admin.module.css'
import fin from './finance.module.css'

// ─── 財務報帳 ─────────────────────────────────────────────────────────────────
// Submitters describe the expense and attach receipts; the backend's finance
// agent reads Notion and Drive, decides where it goes and writes it
// (/api/admin/finance/agent → backend /finance/agent/submit).
// Each form gets one expense id. After a failed step the returned plan is
// committed again with the same id, so nothing is uploaded, recorded or
// emailed twice and the model is not asked again.

const STEP_LABEL = { drive: 'Google Drive', notion: 'Notion', email: '通知管理層' }
const STEP_STATE = {
  done: ['完成', fin.chipOk],
  skipped: ['不需要，略過', fin.chipOk],
  pending: ['未執行', ''],
  failed: ['失敗', fin.chipBad],
  not_configured: ['尚未設定', fin.chipWarn],
}

const ERROR_TEXT = {
  UNAUTHORIZED: '通關密語錯誤或已失效，請重新登入。',
  FINANCE_NOT_CONFIGURED: '財務功能尚未設定（後端網址或通關密語）。',
  BACKEND_UNREACHABLE: '連不到後端或處理太久，請稍後再送一次；系統會避免重複建立。',
  TOO_MANY_ATTACHMENTS: '附件數量超過上限。',
  ATTACHMENT_TOO_LARGE: '有附件超過大小上限。',
  ATTACHMENT_TYPE_NOT_ALLOWED: '附件格式不支援，請用 PDF、JPG、PNG、WEBP 或 HEIC。',
  NOTE_OR_RECEIPT_REQUIRED: '請寫一段說明或附上收據。',
  INVALID_FORM: '表單內容無法讀取，請再試一次。',
  NOTION_NOT_CONFIGURED: 'Notion 尚未設定（NOTION_TOKEN）。',
  NOTION_EXPENSE_ID_PROPERTY_MISSING: '帳務表缺少「交易 ID」文字欄位，請在 Notion 表格新增後再送一次。',
  PLAN_HAS_NO_LEDGER: 'AI 找不到帳務表，請確認 Notion 表格已在「⋯ → 連線」加入 integration。',
}

// Vercel Functions 單次請求上限約 4.5MB，照片先在瀏覽器壓縮
const MAX_REQUEST_BYTES = 4 * 1024 * 1024

const newId = () => crypto.randomUUID()
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)}MB`

async function compressImage(file) {
  if (!file.type.startsWith('image/') || file.size < 1.2 * 1024 * 1024) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    // 瀏覽器無法解碼（例如部分 HEIC）時保留原檔
    return file
  }
}


// 有設定成員名單就用下拉選單，沒設定就直接輸入名字
function PersonField({ id, members, value, onChange, disabled }) {
  if (!members.length) {
    return (
      <input id={id} className={styles.input} maxLength={100} placeholder="輸入名字" value={value}
        disabled={disabled} onChange={(e) => onChange(e.target.value)} />
    )
  }
  return (
    <select id={id} className={styles.input} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
      <option value="">請選擇</option>
      {members.map((m) => <option key={m.email} value={m.email}>{m.name}</option>)}
    </select>
  )
}

function Links({ result }) {
  const links = [
    result.notion_url && ['開啟 Notion 紀錄', result.notion_url],
    result.description_link && ['開啟收據說明（Drive）', result.description_link],
    ...(result.receipt_links || []).map((url, i) => [`憑證 ${i + 1}（Drive）`, url]),
  ].filter(Boolean)
  return links.map(([label, url]) => (
    <a key={url} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
  ))
}

function AgentResult({ plan, result, duplicate }) {
  const steps = result?.steps || {}
  return (
    <div className={fin.resultBox} role="status">
      <strong>
        {duplicate ? 'AI 判斷這筆已經記錄過了，沒有再寫入。'
          : result?.complete ? (result.duplicate ? '這筆先前已送出，剩下的步驟已補齊。' : '報帳完成！')
            : '部分步驟沒有完成，可以直接再送一次（不會重複記帳）。'}
      </strong>
      {plan?.summary && <span>{plan.summary}</span>}
      {duplicate && plan.duplicate_of && (
        <span>
          {plan.duplicate_of.reason}{' '}
          <a href={plan.duplicate_of.url} target="_blank" rel="noopener noreferrer">查看既有紀錄</a>
        </span>
      )}
      {plan?.missing?.length > 0 && (
        <span>待補資訊：{plan.missing.join('、')}</span>
      )}
      {result && (
        <div className={fin.steps}>
          {Object.entries(STEP_LABEL).map(([key, label]) => {
            const [text, cls] = STEP_STATE[steps[key]] || ['—', '']
            return <span key={key} className={`${fin.chip} ${cls}`}>{label}：{text}</span>
          })}
        </div>
      )}
      {result?.error_code && (
        <span>{ERROR_TEXT[result.error_code] || <>錯誤代碼：<code>{result.error_code}</code></>}{result.error_detail ? `（${result.error_detail}）` : ''}</span>
      )}
      {result?.skipped_properties?.length > 0 && (
        <span className={styles.hint}>表格裡找不到、沒有寫入的欄位：{result.skipped_properties.join('、')}</span>
      )}
      {result && <Links result={result} />}
      {plan?.notion?.data_source_title && <span className={styles.hint}>寫入的表格：{plan.notion.data_source_title}</span>}
      {result && <span className={styles.hint}>交易 ID：{result.expense_id}</span>}
    </div>
  )
}

function AgentForm({ passphrase, config }) {
  const [expenseId, setExpenseId] = useState(newId)
  const [submitter, setSubmitter] = useState('')
  const [note, setNote] = useState('')
  const [files, setFiles] = useState([])
  const [preparing, setPreparing] = useState(false)
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')
  const [question, setQuestion] = useState('')
  const [outcome, setOutcome] = useState(null) // { plan, result, duplicate }

  const totalBytes = useMemo(() => files.reduce((s, f) => s + f.file.size, 0), [files])
  // Once something was written, the content is locked to this expense id.
  const locked = Boolean(outcome?.result)

  async function pickFiles(list) {
    if (!list?.length) return
    setPreparing(true)
    const next = [...files]
    const problems = []
    for (const raw of Array.from(list)) {
      if (next.length >= config.max_attachments) { problems.push(`附件最多 ${config.max_attachments} 個`); break }
      const file = await compressImage(raw)
      if (file.size > config.max_upload_bytes) { problems.push(`「${raw.name}」超過 ${mb(config.max_upload_bytes)}`); continue }
      next.push({ file, key: `${raw.name}-${raw.size}-${raw.lastModified}-${next.length}` })
    }
    setFiles(next)
    setMessage(problems.join('；'))
    setPreparing(false)
  }

  async function send(action, payload) {
    const body = new FormData()
    body.set('payload', JSON.stringify(payload))
    for (const f of files) body.append('attachments', f.file, f.file.name)
    setWorking(true)
    setMessage('')
    setQuestion('')
    try {
      const res = await fetch(`/api/admin/finance/agent?action=${action}`, {
        method: 'POST',
        headers: { 'X-Admin-Passphrase': passphrase },
        body,
      })
      const data = await res.json().catch(() => ({}))
      if (action === 'commit' && data?.data?.steps) {
        setOutcome((o) => ({ ...o, result: data.data }))
      } else if (data?.data?.plan) {
        setOutcome({
          plan: data.data.plan,
          result: data.data.result,
          duplicate: data.message === 'DUPLICATE',
        })
      } else if (data?.message === 'AGENT_NO_PLAN') {
        // The model asked something instead of filing; let the person answer.
        setQuestion(data?.data?.detail || 'AI 無法判斷這筆支出，請多寫一些說明。')
      } else if (res.status === 413) {
        setMessage('檔案太大，請減少附件或改傳較小的檔案。')
      } else {
        const detail = data?.data?.detail ? `（${data.data.detail}）` : ''
        setMessage((ERROR_TEXT[data?.message] || `送出失敗：${data?.message || '未知錯誤'}`) + detail)
      }
    } catch {
      setMessage('網路連線中斷，請確認網路後再送一次；系統會避免重複建立。')
    } finally {
      setWorking(false)
    }
  }

  function submit(e, extra = '') {
    e?.preventDefault()
    if (working) return
    if (!note.trim() && !files.length) { setMessage(ERROR_TEXT.NOTE_OR_RECEIPT_REQUIRED); return }
    if (totalBytes > MAX_REQUEST_BYTES) {
      setMessage(`附件合計 ${mb(totalBytes)}，超過單次上傳上限 ${mb(MAX_REQUEST_BYTES)}，請減少檔案。`)
      return
    }
    send('submit', { expense_id: expenseId, submitter, note: note + extra })
  }

  function retry() {
    send('commit', { expense_id: expenseId, plan: outcome.plan })
  }

  function startNew() {
    setExpenseId(newId())
    setNote('')
    setFiles([])
    setMessage('')
    setQuestion('')
    setOutcome(null)
  }

  const finished = outcome && (outcome.duplicate || outcome.result?.complete)

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="fin-submitter">申請人</label>
        <PersonField id="fin-submitter" members={config.members} value={submitter} disabled={locked}
          onChange={setSubmitter} />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="fin-note">說明這筆支出 <span className={styles.required}>*</span></label>
        <textarea id="fin-note" className={styles.textarea} rows={5} maxLength={2000} value={note}
          disabled={locked || working}
          placeholder={'例：10/20 用我的信用卡付了 Canva Pro 月費 450 元，有打統編，想之後報銷。'}
          onChange={(e) => setNote(e.target.value)} />
        <p className={styles.hint}>
          用自己的話寫就好：買了什麼、多少錢、哪天、誰付的、有沒有打統編、公司帳面還是內部認列。
          AI 會讀收據、查 Notion 和 Drive 有沒有記過，再決定寫到哪裡。
        </p>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="fin-files">收據或發票（選填）</label>
        <input id="fin-files" type="file" multiple disabled={locked || preparing || working}
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.heic,.heif"
          className={styles.input}
          onChange={(e) => { pickFiles(e.target.files); e.target.value = '' }} />
        <p className={styles.hint}>可拍照或選 PDF／圖片，最多 {config.max_attachments} 個，照片會自動壓縮。</p>
        {preparing && <p className={styles.hint}>處理照片中…</p>}
        {files.length > 0 && (
          <ul className={fin.fileList}>
            {files.map((f) => (
              <li key={f.key} className={fin.fileItem}>
                <span className={fin.fileName}>{f.file.name}（{mb(f.file.size)}）</span>
                {!locked && !working && <button type="button" className={fin.linkBtn} onClick={() => setFiles(files.filter((x) => x.key !== f.key))}>移除</button>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {question && (
        <div className={fin.subPanel} role="alert">
          <strong>AI 需要更多資訊：</strong>
          <p>{question}</p>
          <p className={styles.hint}>把答案補進上面的說明，再送一次。</p>
        </div>
      )}
      {outcome && <AgentResult {...outcome} />}
      {message && <p className={styles.errorMsg} role="alert">{message}</p>}

      {!finished && !locked && (
        <button type="submit" className={`${styles.btnPrimary} ${styles.sendBtn}`} disabled={working || preparing}>
          {working ? 'AI 處理中…（查表、上傳與寫入約需 30–90 秒）' : '送出，交給 AI 記帳'}
        </button>
      )}
      {locked && !finished && (
        <button type="button" className={`${styles.btnPrimary} ${styles.sendBtn}`} disabled={working} onClick={retry}>
          {working ? '處理中…' : '再送一次（只補未完成的步驟）'}
        </button>
      )}
      {outcome?.duplicate && (
        <button type="button" className={styles.btnSecondary} disabled={working}
          onClick={() => submit(null, '\n（送出者確認：這筆不是重複報帳，請新增紀錄）')}>
          這不是重複的，仍要記錄
        </button>
      )}
      {(finished || locked) && (
        <button type="button" className={finished ? styles.btnPrimary : styles.btnSecondary} onClick={startNew} disabled={working}>
          {finished ? '再新增一筆' : '放棄這筆，重新填寫'}
        </button>
      )}
    </form>
  )
}

function StatusView({ passphrase }) {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const load = useCallback(async (check) => {
    setChecking(check)
    setError('')
    try {
      const res = await fetch(`/api/admin/finance/status${check ? '?check=1' : ''}`, { headers: { 'X-Admin-Passphrase': passphrase } })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setStatus(data.data)
    } catch (e) {
      setError(ERROR_TEXT[e.message] || `讀取失敗（${e.message || '未知錯誤'}）`)
    } finally {
      setChecking(false)
    }
  }, [passphrase])

  useEffect(() => { load(false) }, [load])

  const badge = (s) => {
    if (!s?.configured) return <span className={`${fin.chip} ${fin.chipWarn}`}>尚未設定</span>
    if (s.ok === true) return <span className={`${fin.chip} ${fin.chipOk}`}>連線正常</span>
    if (s.ok === false) return <span className={`${fin.chip} ${fin.chipBad}`}>連線失敗 {s.error}</span>
    return <span className={fin.chip}>已設定</span>
  }

  return (
    <div className={styles.form}>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {status && (
        <div className={fin.resultBox}>
          <span>Google Drive：{badge(status.drive)} {status.drive.detail?.account && `授權帳號 ${status.drive.detail.account}`}</span>
          <span>Notion：{badge(status.notion)}</span>
          {status.notion.detail && <span className={styles.hint}>Notion 回應：{status.notion.detail}</span>}
          {status.notion.ledgers && (
            <span className={styles.hint}>
              AI 看得到的表格：{status.notion.ledgers.join('、') || '沒有（請在 Notion 表格「⋯ → 連線」加入 integration）'}
            </span>
          )}
          <span>Email：{badge(status.email)} 收件人 {status.email.recipients.join('、') || '尚未設定'}</span>
          <span>成員人數：{status.members}</span>
        </div>
      )}
      <button type="button" className={styles.btnSecondary} onClick={() => load(true)} disabled={checking}>
        {checking ? '測試中…' : '測試 Drive／Notion 連線'}
      </button>
    </div>
  )
}

export default function FinancePanel({ passphrase }) {
  const [tab, setTab] = useState('submit')
  const [config, setConfig] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/finance/config', { headers: { 'X-Admin-Passphrase': passphrase } })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.success) setConfig(data.data)
        else setError(ERROR_TEXT[data.message] || `讀取設定失敗（${data.message || '未知錯誤'}）`)
      })
      .catch(() => !cancelled && setError(ERROR_TEXT.BACKEND_UNREACHABLE))
    return () => { cancelled = true }
  }, [passphrase])

  const tabs = [['submit', '新增報帳'], ['status', '整合狀態']]

  return (
    <div>
      <div className={`${styles.langTabs} ${fin.tabs}`}>
        {tabs.map(([v, label]) => (
          <button key={v} type="button" className={`${styles.langTab} ${tab === v ? styles.langTabActive : ''}`} onClick={() => setTab(v)}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'submit' && (
        error ? <p className={styles.errorMsg}>{error}</p>
          : !config ? <p className={styles.hint}>載入中…</p>
            : <AgentForm passphrase={passphrase} config={config} />
      )}
      {tab === 'status' && <StatusView passphrase={passphrase} />}
    </div>
  )
}
