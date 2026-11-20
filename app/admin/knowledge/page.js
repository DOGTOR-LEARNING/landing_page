'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, History, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { adminFetch, useAdmin } from '../AdminWorkspace'
import DocumentEditor from './DocumentEditor'
import KnowledgePreview from './KnowledgePreview'
import VersionHistory, { formatDate } from './VersionHistory'
import { addDocumentSection, documentContent, documentSections, sectionHeading } from './document.mjs'
import styles from './knowledge.module.css'

const MARKETS = [['tw', '台灣（繁中）'], ['en', 'International（英文）']]
const titleOf = section => section?.title || '文件總覽'
const EMPTY_SET = []

function DocumentOutline({ sections, selected, onSelect, onAdd, editable }) {
  const [collapsed, setCollapsed] = useState({})
  const groups = []
  for (const section of sections) {
    if (section.level === 3 && groups.at(-1)?.section.level === 2) groups.at(-1).children.push(section)
    else groups.push({ section, children: [] })
  }

  const item = section => <button type="button" className={styles.outlineItem}
    aria-current={section.id === selected ? 'location' : undefined}
    onClick={() => onSelect(section.id)} title={titleOf(section)}>{titleOf(section)}</button>

  return <nav className={styles.outline} aria-label="文件目錄">
    <div className={styles.outlineHeader}><h2>文件目錄</h2>
      {editable && <button type="button" className={styles.iconButton} title="新增區段" aria-label="新增區段" onClick={() => onAdd(null)}><Plus size={19} /></button>}
    </div>
    <ul>
      {groups.map(({ section, children }) => {
        const open = !collapsed[section.id] || children.some(child => child.id === selected)
        return <li key={section.id}>
          <div className={styles.outlineRow}>
            {children.length > 0 && <button type="button" className={styles.chevron}
              aria-label={titleOf(section) + '子區段'} aria-expanded={open}
              onClick={() => {
                if (open && children.some(child => child.id === selected)) onSelect(section.id)
                setCollapsed(current => ({ ...current, [section.id]: open }))
              }}>{open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</button>}
            {item(section)}
          </div>
          {open && (children.length > 0 || (editable && section.level === 2 && section.id === selected)) &&
            <ul className={styles.children}>
              {children.map(child => <li key={child.id}>{item(child)}</li>)}
              {editable && <li><button type="button" className={styles.addChild} onClick={() => onAdd(section.id)}>
                <Plus size={15} />新增子區段
              </button></li>}
            </ul>}
        </li>
      })}
    </ul>
  </nav>
}

export default function KnowledgePage() {
  const { user } = useAdmin()
  const canEdit = user.permissions.includes('knowledge.manage')
  const [market, setMarket] = useState('tw')
  const [meta, setMeta] = useState(null)
  const [sections, setSections] = useState([])
  const [active, setActive] = useState(null)
  const [source, setSource] = useState(false)
  const [revision, setRevision] = useState(0)
  const [focusToken, setFocusToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [conflict, setConflict] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [pendingByMarket, setPendingByMarket] = useState({})
  const pending = pendingByMarket[market] || EMPTY_SET
  const panel = useRef(null)
  const pendingList = useRef(null)
  const composer = useRef(null)
  const loadRequest = useRef(null)
  const editorSequence = useRef(0)
  const draft = documentContent(sections)
  const dirty = Boolean(meta && draft !== meta.content)
  const current = sections.find(section => section.id === active)
  const currentIndex = sections.indexOf(current)
  const parent = current?.level === 3
    ? sections.slice(0, currentIndex).findLast(section => section.level <= 2)
    : sections[0]
  const editable = canEdit && !saving && !loading

  const request = useCallback(async (suffix = '', options) => {
    const response = await adminFetch(`/api/admin/product-info/${market}${suffix}`, options)
    const result = await response.json().catch(() => ({}))
    if (!response.ok || result.success === false) {
      const error = new Error(result.message || (suffix && response.status === 404
        ? '此功能需要後台 API 更新。' : '操作失敗，請稍後再試。'))
      error.status = response.status
      throw error
    }
    return result.data
  }, [market])

  const load = useCallback(async () => {
    loadRequest.current?.abort()
    const controller = new AbortController()
    loadRequest.current = controller
    setLoading(true)
    setMessage('')
    setConflict(false)
    try {
      const document = await request('', { signal: controller.signal })
      if (controller.signal.aborted) return
      const next = documentSections(document.content)
      setMeta(document)
      setSections(next)
      setActive(next[0].id)
      setFocusToken(null)
      setRevision(value => value + 1)
    } catch (error) {
      if (!controller.signal.aborted) setMessage(error.message)
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [request])

  useEffect(() => {
    load()
    return () => loadRequest.current?.abort()
  }, [load])

  useEffect(() => {
    if (!dirty) return
    const warn = event => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function select(id) {
    setActive(id)
    setFocusToken(null)
  }

  function switchMarket(next) {
    if (next === market || (dirty && !window.confirm('這份草稿尚未發布，確定要切換市場？'))) return
    setMeta(null)
    setSections([])
    setSource(false)
    setMarket(next)
  }

  function reload() {
    if (!dirty || window.confirm('放棄此草稿並載入已發布的文件？')) load()
  }

  function changeSection(content) {
    const heading = sectionHeading(content, current.level)
    setSections(items => items.map(section => section.id === active ? { ...section, content, ...heading } : section))
  }

  function insertSection(parentId, suppliedTitle) {
    const title = suppliedTitle || window.prompt(parentId ? '子區段名稱' : '區段名稱')
    if (!title?.trim() || !editable) return
    const id = `new-${++editorSequence.current}`
    setSections(items => addDocumentSection(items, parentId, id, title.trim()))
    setActive(id)
    setSource(false)
    setFocusToken(id)
    composer.current?.scrollIntoView({ block: 'nearest' })
  }

  function deleteSection() {
    if (!editable || currentIndex < 1 || !window.confirm(`移除「${titleOf(current)}」這個區段？發布後才會生效。`)) return
    setSections(items => items.filter(section => section.id !== active))
    select(sections[currentIndex - 1].id)
  }

  function trackQuestion(question, needsFollowUp) {
    setPendingByMarket(current => {
      const existing = current[market] || []
      const next = needsFollowUp ? [...new Set([...existing, question])] : existing.filter(item => item !== question)
      return { ...current, [market]: next }
    })
  }

  async function publish() {
    if (!editable || !dirty || !draft.trim() || conflict) return
    setSaving(true)
    setMessage('')
    try {
      const published = await request('', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft, generation: meta.generation }),
      })
      setMeta(published)
      setMessage('已發布，AI 將在一分鐘內使用新版文件。')
    } catch (error) {
      setConflict(error.status === 409)
      setMessage(error.message)
    } finally {
      setSaving(false)
    }
  }

  return <section className={styles.workspace}>
    <header className={styles.workspaceHeader}>
      <div className={styles.headerGroup}>
        <h1>知識庫</h1>
        {pending.length > 0 && <button className={styles.pending} type="button"
          onClick={() => {
            if (pendingList.current) pendingList.current.open = true
            panel.current?.scrollIntoView({ block: 'nearest' })
            pendingList.current?.querySelector('summary')?.focus()
          }}>
          待補充問題 {pending.length}
        </button>}
      </div>
      <div className={styles.headerGroup}>
        <select aria-label="文件市場" className={styles.market} value={market} disabled={loading || saving}
          onChange={event => switchMarket(event.target.value)}>
          {MARKETS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button type="button" className={styles.iconButton} aria-label="重新載入" title="重新載入"
          disabled={loading || saving} onClick={reload}><RefreshCw size={18} /></button>
        <button type="button" className={styles.secondary} disabled={!meta || loading}
          onClick={() => setHistoryOpen(true)}><History size={17} />版本紀錄</button>
        {canEdit && <button type="button" className={styles.primary} disabled={!dirty || saving || loading || conflict || !draft.trim()}
          onClick={publish}>{saving ? '發布中…' : '發布'}</button>}
      </div>
    </header>

    {message && <div className={styles.notice} role="status">{message}
      {conflict && <button className={styles.secondary} type="button" onClick={reload}>載入最新版本</button>}
      {!current && !loading && <button className={styles.secondary} type="button" onClick={load}>重試</button>}
    </div>}
    {loading ? <p className={styles.notice} role="status">正在載入知識文件…</p> : current &&
      <div className={styles.columns}>
        <DocumentOutline key={revision} sections={sections} selected={active} onSelect={select} onAdd={insertSection} editable={editable} />
        <article className={styles.composer} ref={composer}>
          <header className={styles.documentHeader}>
            {parent && parent.id !== current.id && <button type="button" className={styles.breadcrumb}
              onClick={() => select(parent.id)}>{titleOf(parent)} <ChevronRight size={14} /></button>}
            <strong>{titleOf(current)}</strong>
            <span className={`${styles.status} ${dirty ? styles.draft : ''}`}>
              {dirty ? '未發布草稿' : meta.source === 'gcs' ? '已發布' : '初始版本'}
            </span>
            {meta.updated_at && <small title={meta.edited_by || undefined}>{formatDate(meta.updated_at)}</small>}
            {editable && currentIndex > 0 && <button type="button" className={`${styles.iconButton} ${styles.deleteSection}`}
              title="移除區段" aria-label="移除區段" onClick={deleteSection}><Trash2 size={16} /></button>}
          </header>
          <DocumentEditor key={`${revision}:${active}`} section={current} editable={editable} source={source}
            onSource={() => setSource(value => !value)} onChange={changeSection} focusToken={focusToken} />
        </article>
        <KnowledgePreview key={market} request={request} sections={sections} editable={editable} pending={pending}
          onSelect={select} onInsert={question => insertSection(current.level === 2 ? current.id : parent?.id, question)}
          onResult={trackQuestion} panelRef={panel} pendingRef={pendingList} />
      </div>}
    {historyOpen && <VersionHistory request={request} generation={meta?.generation}
      onClose={() => setHistoryOpen(false)} />}
  </section>
}
