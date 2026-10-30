'use client'
import { useCallback, useEffect, useState } from 'react'
import { BookOpen, RefreshCw, Save, X } from 'lucide-react'
import MarkdownContent from '@/components/MarkdownContent'
import { adminFetch, useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'
import page from './knowledge.module.css'

// The product document the 汪汪題 agent and the LINE bot answer app questions
// from. Saved to Cloud Storage by backend/app/routers/admin_product_info.py;
// the agent picks up a save within a minute, without a redeploy.
const MARKETS = [['tw', '台灣（繁中）'], ['en', 'International（英文）']]

async function api(url, options) {
  const response = await adminFetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) {
    const error = new Error(data.message || data.detail || '操作失敗，請稍後再試')
    error.status = response.status
    throw error
  }
  return data
}

const when = iso => iso ? new Date(iso).toLocaleString('zh-TW', { hour12: false }) : ''

export default function KnowledgePage() {
  const { user } = useAdmin()
  const canManage = user.permissions.includes('knowledge.manage')
  const [market, setMarket] = useState('tw')
  const [doc, setDoc] = useState(null)
  const [draft, setDraft] = useState('')
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [conflict, setConflict] = useState(false)
  const dirty = doc !== null && draft !== doc.content

  const load = useCallback(async target => {
    setLoading(true); setConflict(false)
    try {
      const data = (await api(`/api/admin/product-info/${target}`)).data
      setDoc(data); setDraft(data.content); setMessage('')
    } catch (e) { setDoc(null); setMessage(e.message) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load(market) }, [market, load])

  useEffect(() => {
    if (!dirty) return
    const warn = e => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const switchMarket = next => {
    if (next === market) return
    if (dirty && !window.confirm('目前的修改還沒儲存，確定要切換嗎？')) return
    setMarket(next)
  }

  const save = async () => {
    setSaving(true); setMessage('')
    try {
      const result = await api(`/api/admin/product-info/${market}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft, generation: doc.generation }),
      })
      setDoc(result.data); setDraft(result.data.content)
      setMessage(result.message || '已儲存')
    } catch (e) {
      setConflict(e.status === 409)
      setMessage(e.message)
    } finally { setSaving(false) }
  }

  return <section className={styles.tableCard}>
    <div className={styles.tableToolbar}>
      <div>
        <h2>產品知識文件</h2>
        <p>汪汪題和 LINE 官方帳號回答「App 怎麼用、價格、規則」時，只會根據這份文件。儲存後一分鐘內生效。</p>
      </div>
      <BookOpen size={26} />
    </div>

    <div className={page.toolbar}>
      <div className={styles.langTabs}>{MARKETS.map(([code, label]) =>
        <button key={code} className={`${styles.langTab} ${market === code ? styles.langTabActive : ''}`} onClick={() => switchMarket(code)}>{label}</button>)}
      </div>
      <div className={styles.langTabs}>{[[false, '編輯'], [true, '預覽']].map(([value, label]) =>
        <button key={label} className={`${styles.langTab} ${preview === value ? styles.langTabActive : ''}`} onClick={() => setPreview(value)}>{label}</button>)}
      </div>
      <button className={styles.btnSecondary} onClick={() => (!dirty || window.confirm('放棄目前的修改並重新載入？')) && load(market)} disabled={loading}>
        <RefreshCw size={16} />重新載入
      </button>
    </div>

    {doc && <p className={page.meta}>
      {doc.source === 'gcs'
        ? <>最後修改：{when(doc.updated_at)}{doc.edited_by ? `・${doc.edited_by}` : ''}</>
        : <>尚未從後台儲存過，目前顯示的是程式碼裡的初始版本</>}
      {doc.location && <span className={page.location}>{doc.location}</span>}
    </p>}

    {message && <p className={styles.inlineMessage} role="status">
      {message}
      {conflict && <button className={page.linkButton} onClick={() => load(market)}>載入最新版本</button>}
      <button className={page.dismiss} onClick={() => setMessage('')} aria-label="關閉"><X size={14} /></button>
    </p>}

    <div className={page.body}>
      {loading
        ? <p className={page.empty}>載入中…</p>
        : !doc ? null
        : preview
          ? <div className={page.preview}><MarkdownContent>{draft}</MarkdownContent></div>
          : <textarea
              className={`${styles.textarea} ${page.editor}`}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              readOnly={!canManage}
              spellCheck={false}
              aria-label="知識庫內容（Markdown）"
            />}
    </div>

    {doc && <div className={page.footer}>
      <span className={styles.hint}>{draft.length.toLocaleString()} 字{dirty ? '・有未儲存的修改' : ''}{!canManage ? '・你的帳號只能檢視' : ''}</span>
      {canManage && <button className={styles.btnPrimary} onClick={save} disabled={!dirty || saving || !draft.trim()}>
        <Save size={17} />{saving ? '儲存中…' : '儲存'}
      </button>}
    </div>}
  </section>
}
