'use client'
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, CornerDownRight, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react'
import { adminFetch, useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'
import page from './knowledge.module.css'

// The product document the 汪汪題 agent and the LINE bot answer app questions
// from, edited as blocks: a section is a heading (大標 / 中標) with its points,
// and a point can have sub-points. The backend
// (backend/app/routers/admin_product_info.py) turns the blocks into Markdown
// and saves it to Cloud Storage; the agent picks up a save within a minute.
const MARKETS = [['tw', '台灣（繁中）'], ['en', 'International（英文）']]
const LEVELS = [[2, '大標'], [3, '中標']]
const KINDS = [['bullet', '• 小點'], ['number', '1.2.3 編號'], ['text', '¶ 段落']]
const SUB_KINDS = KINDS.slice(0, 2)

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

let nextId = 1
const uid = () => `k${nextId++}`
const withIds = document => ({
  preamble: document.preamble || '',
  sections: document.sections.map(s => ({
    ...s, id: uid(),
    items: s.items.map(i => ({ ...i, id: uid(), children: (i.children || []).map(c => ({ ...c, id: uid() })) })),
  })),
})
const withoutIds = doc => ({
  preamble: doc.preamble,
  sections: doc.sections.map(({ id, items, ...s }) => ({
    ...s, items: items.map(({ id, children, ...i }) => ({ ...i, children: children.map(({ id, ...c }) => c) })),
  })),
})
const snapshot = doc => JSON.stringify(withoutIds(doc))
const move = (list, index, delta) => {
  const target = index + delta
  if (target < 0 || target >= list.length) return list
  const next = [...list]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}
const when = iso => iso ? new Date(iso).toLocaleString('zh-TW', { hour12: false }) : ''

// Grows with its content so a long point never hides behind a scrollbar.
function AutoText({ value, onChange, placeholder, className, readOnly, label }) {
  const ref = useRef(null)
  const fit = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    // scrollHeight leaves out the border, which border-box sizing counts.
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`
  }, [])
  useLayoutEffect(fit, [value, fit])
  useEffect(() => {
    // Line wrapping changes with the width (rotation, sidebar, web fonts loading).
    const observer = new ResizeObserver(fit)
    observer.observe(ref.current)
    document.fonts?.ready.then(fit)
    return () => observer.disconnect()
  }, [fit])
  return <textarea ref={ref} rows={1} className={className} value={value} placeholder={placeholder}
    readOnly={readOnly} aria-label={label} onChange={e => onChange(e.target.value)} />
}

function IconButton({ label, onClick, disabled, danger, children }) {
  return <button type="button" className={`${page.iconButton} ${danger ? page.danger : ''}`} onClick={onClick}
    disabled={disabled} aria-label={label} title={label}>{children}</button>
}

// **bold** is the only inline formatting the documents use.
function Inline({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <Fragment key={i}>{part}</Fragment>)
}

function PreviewList({ points }) {
  // Consecutive points of one kind form one list, as in the saved Markdown.
  const runs = []
  for (const point of points.filter(p => p.text.trim() || p.children?.some(c => c.text.trim()))) {
    if (runs.length && runs.at(-1).kind === point.kind) runs.at(-1).points.push(point)
    else runs.push({ kind: point.kind, points: [point] })
  }
  return runs.map((run, i) => {
    if (run.kind === 'text') return run.points.map(p => <p key={p.id}><Inline text={p.text} /></p>)
    const List = run.kind === 'number' ? 'ol' : 'ul'
    return <List key={i}>{run.points.map(p => <li key={p.id}><Inline text={p.text} />
      {p.children?.length > 0 && <PreviewList points={p.children} />}</li>)}</List>
  })
}

function Preview({ doc }) {
  return <div className={page.preview}>{doc.sections.map(s => {
    const Heading = `h${s.level}`
    return <Fragment key={s.id}>{s.title && <Heading><Inline text={s.title} /></Heading>}<PreviewList points={s.items} /></Fragment>
  })}</div>
}

export default function KnowledgePage() {
  const { user } = useAdmin()
  const canEdit = user.permissions.includes('knowledge.manage')
  const [market, setMarket] = useState('tw')
  const [meta, setMeta] = useState(null)
  const [doc, setDoc] = useState(null)
  const [baseline, setBaseline] = useState('')
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [conflict, setConflict] = useState(false)
  const dirty = doc !== null && snapshot(doc) !== baseline

  const apply = data => {
    const next = withIds(data.document)
    setMeta(data); setDoc(next); setBaseline(snapshot(next))
  }
  const load = useCallback(async target => {
    setLoading(true); setConflict(false)
    try {
      const data = (await api(`/api/admin/product-info/${target}`)).data
      // A backend from before the block editor sends Markdown only.
      if (!data.document) throw new Error('後端尚未更新到支援區塊編輯的版本，請稍後再試')
      apply(data); setMessage('')
    }
    catch (e) { setDoc(null); setMessage(e.message) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { load(market) }, [market, load])

  useEffect(() => {
    if (!dirty) return
    const warn = e => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const switchMarket = next => {
    if (next === market || (dirty && !window.confirm('目前的修改還沒儲存，確定要切換嗎？'))) return
    setMarket(next)
  }
  const reload = () => (!dirty || window.confirm('放棄目前的修改並重新載入？')) && load(market)

  // ---- edits (all immutable, keyed by the ids added on load)
  const setSections = fn => setDoc(d => ({ ...d, sections: fn(d.sections) }))
  const editSection = (sid, fn) => setSections(list => list.map(s => s.id === sid ? fn(s) : s))
  const editItems = (sid, fn) => editSection(sid, s => ({ ...s, items: fn(s.items) }))
  const editItem = (sid, iid, fn) => editItems(sid, items => items.map(i => i.id === iid ? fn(i) : i))
  const editChildren = (sid, iid, fn) => editItem(sid, iid, i => ({ ...i, children: fn(i.children) }))

  const addSection = after => setSections(list => {
    const next = [...list]
    next.splice(after + 1, 0, { id: uid(), level: 2, title: '', items: [{ id: uid(), kind: 'bullet', text: '', children: [] }] })
    return next
  })
  const removeSection = (index, section) => {
    const filled = section.title.trim() || section.items.some(i => i.text.trim())
    if (filled && !window.confirm(`刪除「${section.title || '未命名區塊'}」整個區塊？`)) return
    setSections(list => list.filter((_, i) => i !== index))
  }
  const addItem = (sid, kind) => editItems(sid, items => [...items, { id: uid(), kind, text: '', children: [] }])
  const setKind = (sid, item, kind) => editItem(sid, item.id, i => ({
    ...i, kind,
    // A paragraph has no sub-points; keep them as points after it instead of losing them.
    children: kind === 'text' ? [] : i.children,
  }))
  const changeKind = (sid, item, kind) => {
    if (kind === 'text' && item.children.length) {
      editItems(sid, items => items.flatMap(i => i.id !== item.id ? [i]
        : [{ ...i, kind, children: [] }, ...i.children.map(c => ({ ...c, children: [] }))]))
    } else setKind(sid, item, kind)
  }

  const save = async () => {
    const untitled = doc.sections.some(s => s.level > 1 && !s.title.trim() && s.items.some(i => i.text.trim()))
    if (untitled) { setMessage('有區塊還沒填標題，請補上再儲存'); return }
    setSaving(true); setMessage('')
    try {
      const result = await api(`/api/admin/product-info/${market}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: withoutIds(doc), generation: meta.generation }),
      })
      apply(result.data)
      setMessage(result.message || '已儲存')
    } catch (e) { setConflict(e.status === 409); setMessage(e.message) }
    finally { setSaving(false) }
  }

  const readOnly = !canEdit
  return <section className={`${styles.tableCard} ${page.card}`}>
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
      <button className={`${styles.btnSecondary} ${page.reload}`} onClick={reload} disabled={loading}><RefreshCw size={16} />重新載入</button>
    </div>

    {meta && <p className={page.meta}>
      {meta.source === 'gcs'
        ? <>最後修改：{when(meta.updated_at)}{meta.edited_by ? `・${meta.edited_by}` : ''}</>
        : <>尚未從後台儲存過，目前顯示的是程式碼裡的初始版本</>}
    </p>}
    {meta && !meta.lossless && <p className={page.warning}>這份文件有部分格式無法用區塊顯示，儲存時會整理成區塊格式。</p>}

    {message && <p className={styles.inlineMessage} role="status">
      {message}
      {conflict && <button className={page.linkButton} onClick={() => load(market)}>載入最新版本</button>}
      <button className={page.dismiss} onClick={() => setMessage('')} aria-label="關閉"><X size={14} /></button>
    </p>}

    <div className={page.body}>
      {loading ? <p className={page.empty}>載入中…</p>
        : !doc ? null
        : preview ? <Preview doc={doc} />
        : doc.sections.map((section, sIndex) => {
          const isTitle = section.level === 1
          return <Fragment key={section.id}>
            <article className={`${page.section} ${isTitle ? page.titleSection : ''}`}>
              <div className={page.sectionHead}>
                {isTitle
                  ? <span className={page.levelFixed}>文件標題</span>
                  : <div className={page.levelChips}>{LEVELS.map(([level, label]) =>
                    <button key={level} type="button" disabled={readOnly}
                      className={`${page.chip} ${section.level === level ? page.chipActive : ''}`}
                      onClick={() => editSection(section.id, s => ({ ...s, level }))}>{label}</button>)}</div>}
                {!isTitle && !readOnly && <div className={page.actions}>
                  <IconButton label="區塊上移" onClick={() => setSections(l => move(l, sIndex, -1))} disabled={sIndex <= 1}><ChevronUp size={18} /></IconButton>
                  <IconButton label="區塊下移" onClick={() => setSections(l => move(l, sIndex, 1))} disabled={sIndex === doc.sections.length - 1}><ChevronDown size={18} /></IconButton>
                  <IconButton label="刪除區塊" danger onClick={() => removeSection(sIndex, section)}><Trash2 size={18} /></IconButton>
                </div>}
              </div>
              <input className={`${styles.input} ${page.title} ${section.level === 3 ? page.titleSmall : ''}`}
                value={section.title} readOnly={readOnly} aria-label="區塊標題"
                placeholder={isTitle ? '文件標題' : section.level === 2 ? '大標，例如：體力（愛心）' : '中標，例如：試用與取消'}
                onChange={e => editSection(section.id, s => ({ ...s, title: e.target.value }))} />

              <div className={page.items}>{section.items.map((item, iIndex) =>
                <div key={item.id} className={page.item}>
                  <div className={page.itemBar}>
                    <select className={page.kind} value={item.kind} disabled={readOnly} aria-label="類型"
                      onChange={e => changeKind(section.id, item, e.target.value)}>
                      {KINDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                    {!readOnly && <>
                      {item.kind !== 'text' && <button type="button" className={page.textButton}
                        onClick={() => editChildren(section.id, item.id, c => [...c, { id: uid(), kind: 'bullet', text: '' }])}>
                        <CornerDownRight size={15} />子項目</button>}
                      <span className={page.spacer} />
                      <IconButton label="上移" onClick={() => editItems(section.id, l => move(l, iIndex, -1))} disabled={iIndex === 0}><ChevronUp size={18} /></IconButton>
                      <IconButton label="下移" onClick={() => editItems(section.id, l => move(l, iIndex, 1))} disabled={iIndex === section.items.length - 1}><ChevronDown size={18} /></IconButton>
                      <IconButton label="刪除" danger onClick={() => editItems(section.id, l => l.filter(i => i.id !== item.id))}><Trash2 size={18} /></IconButton>
                    </>}
                  </div>
                  <AutoText className={`${styles.textarea} ${page.text}`} value={item.text} readOnly={readOnly}
                    label="內容" placeholder={item.kind === 'text' ? '段落文字' : '輸入內容'}
                    onChange={text => editItem(section.id, item.id, i => ({ ...i, text }))} />

                  {item.children.length > 0 && <div className={page.children}>{item.children.map((child, cIndex) =>
                    <div key={child.id} className={page.child}>
                      <div className={page.itemBar}>
                        <select className={page.kind} value={child.kind} disabled={readOnly} aria-label="子項目類型"
                          onChange={e => editChildren(section.id, item.id, l => l.map(c => c.id === child.id ? { ...c, kind: e.target.value } : c))}>
                          {SUB_KINDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        {!readOnly && <>
                          <span className={page.spacer} />
                          <IconButton label="上移" onClick={() => editChildren(section.id, item.id, l => move(l, cIndex, -1))} disabled={cIndex === 0}><ChevronUp size={18} /></IconButton>
                          <IconButton label="下移" onClick={() => editChildren(section.id, item.id, l => move(l, cIndex, 1))} disabled={cIndex === item.children.length - 1}><ChevronDown size={18} /></IconButton>
                          <IconButton label="刪除子項目" danger onClick={() => editChildren(section.id, item.id, l => l.filter(c => c.id !== child.id))}><Trash2 size={18} /></IconButton>
                        </>}
                      </div>
                      <AutoText className={`${styles.textarea} ${page.text}`} value={child.text} readOnly={readOnly}
                        label="子項目內容" placeholder="子項目內容"
                        onChange={text => editChildren(section.id, item.id, l => l.map(c => c.id === child.id ? { ...c, text } : c))} />
                    </div>)}
                  </div>}
                </div>)}
              </div>

              {!readOnly && <div className={page.addRow}>
                {KINDS.map(([kind, label]) => <button key={kind} type="button" className={page.addButton} onClick={() => addItem(section.id, kind)}>
                  <Plus size={15} />{label.split(' ')[1]}</button>)}
              </div>}
            </article>
            {!readOnly && <button type="button" className={page.addSection} onClick={() => addSection(sIndex)}>
              <Plus size={16} />在這裡新增區塊</button>}
          </Fragment>
        })}
    </div>

    {doc && <div className={page.footer}>
      <span className={styles.hint}>{dirty ? '有未儲存的修改' : '沒有未儲存的修改'}{readOnly ? '・你的帳號只能檢視' : ''}</span>
      {canEdit && <button className={styles.btnPrimary} onClick={save} disabled={!dirty || saving}>
        <Save size={17} />{saving ? '儲存中…' : '儲存'}
      </button>}
    </div>}
  </section>
}
