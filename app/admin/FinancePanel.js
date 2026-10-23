'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './admin.module.css'
import fin from './finance.module.css'

// ─── 財務報帳 ─────────────────────────────────────────────────────────────────
// 表單送到 /api/admin/finance/*（伺服器端驗證通關密語後轉給後端 /finance）。
// 後端不用資料庫：Notion 是帳務紀錄，Google Drive 存收據與收據說明。
// 每次開啟表單產生一個交易 ID；送出失敗時用同一個 ID 再送一次，
// 只會補做沒完成的步驟，不會重複上傳、重複記帳或重複寄信。

const CATEGORY = [['COMPANY_BOOK', '公司帳面'], ['INTERNAL', '內部認列']]
const PAYMENT = [['COMPANY_BANK', '公司銀行帳戶'], ['PERSONAL_ADVANCE', '個人代墊'], ['OTHER', '其他']]
const TAX_ID = [['YES', '有'], ['NO', '沒有'], ['UNKNOWN', '不確定']]
const SETTLEMENT = [
  ['UNDECIDED', '未決定'],
  ['REIMBURSEMENT', '報銷還款'],
  ['POTENTIAL_REINVESTMENT_OFFSET', '擬回投抵扣（待核准）'],
]

const STEP_LABEL = { drive: 'Google Drive', notion: 'Notion', email: '通知管理層' }
const STEP_STATE = {
  done: ['完成', fin.chipOk],
  skipped: ['無附件，略過', fin.chipOk],
  pending: ['未執行', ''],
  failed: ['失敗', fin.chipBad],
  not_configured: ['尚未設定', fin.chipWarn],
}

const ERROR_TEXT = {
  UNAUTHORIZED: '通關密語錯誤或已失效，請重新登入。',
  FINANCE_NOT_CONFIGURED: '財務功能尚未設定（後端網址或 FINANCE_API_KEY）。',
  BACKEND_UNREACHABLE: '連不到後端，請稍後再送一次。',
  TOO_MANY_ATTACHMENTS: '附件數量超過上限。',
  ATTACHMENT_TOO_LARGE: '有附件超過大小上限。',
  ATTACHMENT_TYPE_NOT_ALLOWED: '附件格式不支援，請用 PDF、JPG、PNG、WEBP 或 HEIC。',
  VALIDATION: '有欄位沒填或格式不對，請檢查標示的欄位。',
  INVALID_FORM: '表單內容無法讀取，請再試一次。',
}

const FIELD_TEXT = {
  expense_date: '請選擇支出日期',
  amount: '金額請填大於 0 的整數',
  purpose: '請填寫用途',
  expense_category: '請選擇支出性質',
  payment_method: '請選擇付款方式',
  company_tax_id_status: '請選擇是否有打統編',
  submitter_email: '請選擇申請人',
  payer_email: '個人代墊請選擇付款人',
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

function Segmented({ value, options, onChange, invalid }) {
  return (
    <div className={fin.segmented} role="radiogroup">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          className={`${fin.segment} ${value === v ? fin.segmentActive : ''} ${invalid ? styles.inputError : ''}`}
          onClick={() => onChange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function emptyForm(today, memberEmail) {
  return {
    expense_id: newId(),
    submitter_email: memberEmail || '',
    expense_date: today || '',
    amount: '',
    purpose: '',
    vendor_name: '',
    expense_category: '',
    payment_method: '',
    payer_email: memberEmail || '',
    company_tax_id_status: '',
    voucher_pending: false,
    notes: '',
    settlement_method: 'UNDECIDED',
  }
}

function ResultSummary({ result }) {
  const steps = result.steps || {}
  return (
    <div className={fin.resultBox} role="status">
      <strong>
        {result.complete
          ? result.duplicate ? '這筆先前已送出，剩下的步驟已補齊。' : '報帳完成！'
          : '部分步驟沒有完成，資料都還在，可以直接再送一次。'}
      </strong>
      <div className={fin.steps}>
        {Object.entries(STEP_LABEL).map(([key, label]) => {
          const [text, cls] = STEP_STATE[steps[key]] || ['—', '']
          return <span key={key} className={`${fin.chip} ${cls}`}>{label}：{text}</span>
        })}
      </div>
      {result.error_code && <span>錯誤代碼：<code>{result.error_code}</code></span>}
      {result.notion_url && <a href={result.notion_url} target="_blank" rel="noopener noreferrer">開啟 Notion 紀錄</a>}
      {result.description_link && <a href={result.description_link} target="_blank" rel="noopener noreferrer">開啟收據說明（Drive）</a>}
      <span className={styles.hint}>交易 ID：{result.expense_id}</span>
    </div>
  )
}

function SubmitForm({ passphrase, config }) {
  const members = config.members
  const [form, setForm] = useState(() => emptyForm(config.today, ''))
  const [files, setFiles] = useState([])
  const [preparing, setPreparing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))
  const totalBytes = useMemo(() => files.reduce((s, f) => s + f.file.size, 0), [files])
  // 送出後（不論成功與否）鎖定交易 ID，避免改了內容又被當成同一筆
  const locked = Boolean(result)

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
    setErrors((e) => ({ ...e, attachments: problems.join('；') }))
    setPreparing(false)
  }

  function validate() {
    const e = {}
    if (!form.submitter_email) e.submitter_email = FIELD_TEXT.submitter_email
    if (!form.expense_date) e.expense_date = FIELD_TEXT.expense_date
    if (!/^\d+$/.test(String(form.amount)) || Number(form.amount) <= 0) e.amount = FIELD_TEXT.amount
    if (!form.purpose.trim()) e.purpose = FIELD_TEXT.purpose
    if (!form.expense_category) e.expense_category = FIELD_TEXT.expense_category
    if (!form.payment_method) e.payment_method = FIELD_TEXT.payment_method
    if (!form.company_tax_id_status) e.company_tax_id_status = FIELD_TEXT.company_tax_id_status
    if (form.payment_method === 'PERSONAL_ADVANCE' && !form.payer_email) e.payer_email = FIELD_TEXT.payer_email
    if (totalBytes > MAX_REQUEST_BYTES) e.attachments = `附件合計 ${mb(totalBytes)}，超過單次上傳上限 ${mb(MAX_REQUEST_BYTES)}，請減少檔案。`
    return e
  }

  async function submit(e) {
    e.preventDefault()
    if (submitting) return
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return

    const body = new FormData()
    body.set('payload', JSON.stringify({
      ...form,
      amount: Number(form.amount),
      vendor_name: form.vendor_name || null,
      notes: form.notes || null,
      payer_email: form.payment_method === 'PERSONAL_ADVANCE' ? form.payer_email : null,
    }))
    for (const f of files) body.append('attachments', f.file, f.file.name)

    setSubmitting(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/finance/expenses', {
        method: 'POST',
        headers: { 'X-Admin-Passphrase': passphrase },
        body,
      })
      const data = await res.json().catch(() => ({}))
      if (data?.data?.steps) {
        setResult(data.data)
      } else if (res.status === 400 && data?.data?.fields) {
        setErrors(Object.fromEntries(data.data.fields.map((f) => [f, FIELD_TEXT[f] || '格式不正確'])))
        setMessage(ERROR_TEXT.VALIDATION)
      } else if (res.status === 413) {
        setMessage('檔案太大，請減少附件或改傳較小的檔案。')
      } else {
        setMessage(ERROR_TEXT[data?.message] || '送出失敗，請稍後再送一次；系統會避免重複建立。')
      }
    } catch {
      setMessage('網路連線中斷，請確認網路後再送一次；系統會避免重複建立。')
    } finally {
      setSubmitting(false)
    }
  }

  function startNew() {
    setForm(emptyForm(config.today, form.submitter_email))
    setFiles([])
    setErrors({})
    setMessage('')
    setResult(null)
  }

  const err = (key) => errors[key] && <p className={styles.errorMsg}>{errors[key]}</p>

  if (result?.complete) {
    return (
      <div className={styles.form}>
        <ResultSummary result={result} />
        <button type="button" className={styles.btnPrimary} onClick={startNew}>再新增一筆</button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={fin.grid2}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="fin-submitter">申請人 <span className={styles.required}>*</span></label>
          <select id="fin-submitter" className={styles.input} value={form.submitter_email} disabled={locked}
            onChange={(e) => set('submitter_email')(e.target.value)}>
            <option value="">請選擇</option>
            {members.map((m) => <option key={m.email} value={m.email}>{m.name}</option>)}
          </select>
          {err('submitter_email')}
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="fin-date">支出日期 <span className={styles.required}>*</span></label>
          <input id="fin-date" type="date" className={`${styles.input} ${errors.expense_date ? styles.inputError : ''}`}
            value={form.expense_date} max={config.today} disabled={locked} onChange={(e) => set('expense_date')(e.target.value)} />
          {err('expense_date')}
        </div>
      </div>

      <div className={fin.grid2}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="fin-amount">金額（{config.currency}，整數元） <span className={styles.required}>*</span></label>
          <input id="fin-amount" type="number" inputMode="numeric" min={1} step={1} placeholder="450"
            className={`${styles.input} ${errors.amount ? styles.inputError : ''}`} value={form.amount} disabled={locked}
            onChange={(e) => set('amount')(e.target.value)} />
          {err('amount')}
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="fin-vendor">供應商／開立公司</label>
          <input id="fin-vendor" className={styles.input} maxLength={200} placeholder="不確定可留白" value={form.vendor_name}
            disabled={locked} onChange={(e) => set('vendor_name')(e.target.value)} />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="fin-purpose">用途／費用描述 <span className={styles.required}>*</span></label>
        <input id="fin-purpose" className={`${styles.input} ${errors.purpose ? styles.inputError : ''}`} maxLength={200}
          placeholder="例：Canva Pro 月費" value={form.purpose} disabled={locked} onChange={(e) => set('purpose')(e.target.value)} />
        {err('purpose')}
      </div>

      <div className={styles.fieldGroup}>
        <span className={styles.label}>支出性質 <span className={styles.required}>*</span></span>
        <Segmented value={form.expense_category} options={CATEGORY} onChange={locked ? () => {} : set('expense_category')} invalid={errors.expense_category} />
        <p className={styles.hint}>申請人的分類僅供參考，正式會計認列以會計師判斷為準。</p>
        {err('expense_category')}
      </div>

      <div className={styles.fieldGroup}>
        <span className={styles.label}>付款方式 <span className={styles.required}>*</span></span>
        <Segmented value={form.payment_method} options={PAYMENT}
          onChange={locked ? () => {} : (v) => setForm((f) => ({ ...f, payment_method: v, payer_email: f.payer_email || f.submitter_email }))} invalid={errors.payment_method} />
        {err('payment_method')}
      </div>

      {form.payment_method === 'PERSONAL_ADVANCE' && (
        <div className={`${fin.subPanel} ${fin.grid2}`}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="fin-payer">付款人 <span className={styles.required}>*</span></label>
            <select id="fin-payer" className={styles.input} value={form.payer_email} disabled={locked}
              onChange={(e) => set('payer_email')(e.target.value)}>
              <option value="">請選擇</option>
              {members.map((m) => <option key={m.email} value={m.email}>{m.name}</option>)}
            </select>
            {err('payer_email')}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="fin-settlement">結算方式</label>
            <select id="fin-settlement" className={styles.input} value={form.settlement_method} disabled={locked}
              onChange={(e) => set('settlement_method')(e.target.value)}>
              {SETTLEMENT.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <p className={styles.hint}>「擬回投抵扣」只是候選方式，需要核准，不代表已抵扣。</p>
          </div>
        </div>
      )}

      <div className={styles.fieldGroup}>
        <span className={styles.label}>是否有打公司統編 <span className={styles.required}>*</span></span>
        <Segmented value={form.company_tax_id_status} options={TAX_ID} onChange={locked ? () => {} : set('company_tax_id_status')} invalid={errors.company_tax_id_status} />
        {err('company_tax_id_status')}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="fin-files">收據或發票（選填）</label>
        <input id="fin-files" type="file" multiple disabled={locked || preparing}
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.heic,.heif"
          className={styles.input}
          onChange={(e) => { pickFiles(e.target.files); e.target.value = '' }} />
        <p className={styles.hint}>可拍照或選 PDF／圖片，最多 {config.max_attachments} 個，照片會自動壓縮。沒有收據也可以直接送出。</p>
        {preparing && <p className={styles.hint}>處理照片中…</p>}
        {files.length > 0 && (
          <ul className={fin.fileList}>
            {files.map((f) => (
              <li key={f.key} className={fin.fileItem}>
                <span className={fin.fileName}>{f.file.name}（{mb(f.file.size)}）</span>
                {!locked && <button type="button" className={fin.linkBtn} onClick={() => setFiles(files.filter((x) => x.key !== f.key))}>移除</button>}
              </li>
            ))}
          </ul>
        )}
        {err('attachments')}
      </div>

      <label className={fin.checkRow}>
        <input type="checkbox" checked={form.voucher_pending} disabled={locked}
          onChange={(e) => set('voucher_pending')(e.target.checked)} />
        <span>憑證待補件（之後會再提供正式收據或發票）</span>
      </label>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="fin-notes">補充備註</label>
        <textarea id="fin-notes" className={styles.textarea} rows={3} maxLength={2000} value={form.notes}
          disabled={locked} onChange={(e) => set('notes')(e.target.value)} />
      </div>

      {result && <ResultSummary result={result} />}
      {message && <p className={styles.errorMsg} role="alert">{message}</p>}

      <button type="submit" className={`${styles.btnPrimary} ${styles.sendBtn}`} disabled={submitting || preparing}>
        {submitting ? '送出中…（上傳與同步可能需要數十秒）' : result ? '再送一次（只補未完成的步驟）' : '送出報帳'}
      </button>
      {result && (
        <button type="button" className={styles.btnSecondary} onClick={startNew}>放棄這筆，重新填寫</button>
      )}
    </form>
  )
}

function RecentList({ passphrase }) {
  const [month, setMonth] = useState('')
  const [state, setState] = useState({ loading: false, items: null, error: '' })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }))
    try {
      const res = await fetch(`/api/admin/finance/expenses${month ? `?month=${month}` : ''}`, {
        headers: { 'X-Admin-Passphrase': passphrase },
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setState({ loading: false, items: data.data.items, error: '' })
    } catch (e) {
      setState({ loading: false, items: null, error: ERROR_TEXT[e.message] || `讀取失敗（${e.message || '未知錯誤'}）` })
    }
  }, [month, passphrase])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <div className={fin.toolbar}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="fin-month">年月</label>
          <input id="fin-month" type="month" className={styles.input} value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <button type="button" className={styles.btnSecondary} onClick={load} disabled={state.loading}>
          {state.loading ? '讀取中…' : '重新整理'}
        </button>
      </div>
      {state.error && <p className={styles.errorMsg}>{state.error}</p>}
      {state.items && state.items.length === 0 && <p className={styles.hint}>沒有紀錄。</p>}
      {state.items && state.items.length > 0 && (
        <div className={fin.tableWrap}>
          <table className={fin.table}>
            <thead>
              <tr><th>日期</th><th className={fin.num}>金額</th><th>用途</th><th>申請人</th><th>付款</th><th>憑證</th><th>審核</th><th>通知</th><th /></tr>
            </thead>
            <tbody>
              {state.items.map((item) => (
                <tr key={item.url}>
                  <td>{item.date}</td>
                  <td className={fin.num}>{typeof item.amount === 'number' ? item.amount.toLocaleString() : item.amount}</td>
                  <td>{item.purpose}</td>
                  <td>{item.submitter}</td>
                  <td>{item.payment_method}{item.payment_method === '個人代墊' && item.payer ? `：${item.payer}` : ''}</td>
                  <td>{item.voucher}</td>
                  <td>{item.review}</td>
                  <td>{item.notification}</td>
                  <td><a href={item.url} target="_blank" rel="noopener noreferrer">Notion</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className={styles.hint}>審核、修改請直接在 Notion 進行；這裡只列出最近 50 筆。</p>
    </div>
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
          {status.notion.mapping && (
            <span className={styles.hint}>
              找不到的欄位（會略過）：{status.notion.mapping.filter((m) => !m.type).map((m) => m.property).join('、') || '無'}
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

  const tabs = [['submit', '新增報帳'], ['recent', '最近紀錄'], ['status', '整合狀態']]

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
            : config.members.length === 0 ? <p className={styles.errorMsg}>尚未設定成員名單（後端 FINANCE_MEMBERS）。</p>
              : <SubmitForm passphrase={passphrase} config={config} />
      )}
      {tab === 'recent' && <RecentList passphrase={passphrase} />}
      {tab === 'status' && <StatusView passphrase={passphrase} />}
    </div>
  )
}
