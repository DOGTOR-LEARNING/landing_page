import { useEffect, useRef, useState } from 'react'
import { ArrowUp, MessageCircle, Plus } from 'lucide-react'
import styles from './knowledge.module.css'

export default function KnowledgePreview({ request, sections, editable, onSelect, onInsert, pending, onResult, panelRef, pendingRef }) {
  const [question, setQuestion] = useState('')
  const [turns, setTurns] = useState([])
  const [busy, setBusy] = useState(false)
  const controller = useRef(null)
  const log = useRef(null)
  const input = useRef(null)

  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight
  }, [turns, busy])

  async function ask(event) {
    event.preventDefault()
    const text = question.trim()
    if (!text || busy) return
    const signal = new AbortController()
    controller.current = signal
    const snapshot = sections.filter(section => section.content.trim())
    const history = turns.filter(turn => turn.answer || turn.needs_follow_up).slice(-6)
      .map(turn => ({ question: turn.question, answer: turn.answer || '' }))
    setBusy(true)
    setQuestion('')
    setTurns(current => [...current, { question: text }])
    try {
      if (!snapshot.length) throw new Error('請先在文件中輸入內容。')
      const result = await request('/preview', {
        method: 'POST',
        signal: signal.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, history, sections: snapshot.map(section => section.content) }),
      })
      if (signal.signal.aborted) return
      const citations = result.citations.map(citation => ({
        ...citation, target: snapshot[citation.section]?.id, title: snapshot[citation.section]?.title || '文件總覽',
      }))
      setTurns(current => [...current.slice(0, -1), { question: text, ...result, citations }])
      onResult(text, result.needs_follow_up)
    } catch (error) {
      if (!signal.signal.aborted) {
        setTurns(current => [...current.slice(0, -1), { question: text, error: error.message }])
        setQuestion(current => current || text)
      }
    } finally {
      if (!signal.signal.aborted) setBusy(false)
    }
  }

  return <aside className={styles.preview} ref={panelRef} aria-label="AI 試問" tabIndex={-1}>
    <header><MessageCircle size={19} /><h2>AI 試問</h2></header>
    <div ref={log} className={styles.conversation} role="log" aria-live="polite">
      {!turns.length && <p className={styles.previewHint}>用目前文件試問，查看 AI 找得到哪些回答和引用。</p>}
      {turns.map((turn, index) => <div key={index} className={styles.turn}>
        <p className={styles.question}>{turn.question}</p>
        {turn.error && <p className={styles.answer} role="alert">{turn.error}</p>}
        {turn.answer && <p className={styles.answer}>{turn.answer}</p>}
        {turn.needs_follow_up && <p className={`${styles.answer} ${styles.noEvidence}`}>查無足夠依據 · 需人工確認</p>}
        {turn.citations?.map(({ target, title, quote }, citationIndex) =>
          <button key={citationIndex} type="button" className={styles.citation}
            onClick={() => onSelect(target)} disabled={!sections.some(section => section.id === target)}>
            <strong>引用 · {title}</strong><span>{quote}</span>
          </button>)}
        {turn.needs_follow_up && editable && pending.includes(turn.question) &&
          <button type="button" className={styles.supplement} onClick={() => onInsert(turn.question)}>
            <Plus size={15} /> 補進文件
          </button>}
      </div>)}
      {busy && <p className={styles.previewHint}>正在搜尋文件內容…</p>}
    </div>
    {pending.length > 0 && <details ref={pendingRef} className={styles.pendingList}>
      <summary>待補充問題</summary>
      <ul>{pending.map(text => <li key={text}>
        <button type="button" onClick={() => { setQuestion(text); input.current?.focus() }}>{text}</button>
        {editable && <button type="button" title="補進文件" aria-label={`補進文件：${text}`} onClick={() => onInsert(text)}><Plus size={14} /></button>}
      </li>)}</ul>
    </details>}
    <form onSubmit={ask} className={styles.askForm}>
      <input ref={input} aria-label="輸入試問" value={question} maxLength={500} onChange={event => setQuestion(event.target.value)}
        placeholder="輸入想測試的問題…" />
      <button type="submit" aria-label="送出試問" disabled={!question.trim() || busy}><ArrowUp size={20} /></button>
    </form>
  </aside>
}
