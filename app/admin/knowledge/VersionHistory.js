import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './knowledge.module.css'

export const formatDate = value => value ? new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei', dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(value)) : ''

export default function VersionHistory({ request, generation, onClose }) {
  const dialog = useRef(null)
  const versionRequest = useRef(null)
  const [versions, setVersions] = useState(null)
  const [selected, setSelected] = useState(null)
  const [content, setContent] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    dialog.current.showModal()
    const controller = new AbortController()
    request('/versions', { signal: controller.signal }).then(setVersions).catch(err => {
      if (!controller.signal.aborted) setError(err.message)
    })
    return () => {
      controller.abort()
      versionRequest.current?.abort()
    }
  }, [request])

  async function openVersion(version) {
    versionRequest.current?.abort()
    const controller = new AbortController()
    versionRequest.current = controller
    setSelected(version)
    setContent(null)
    setError('')
    try {
      const result = await request(`/versions/${version}`, { signal: controller.signal })
      if (!controller.signal.aborted) setContent(result.content)
    } catch (err) {
      if (!controller.signal.aborted) setError(err.message)
    }
  }

  return <dialog ref={dialog} className={styles.history} onClose={onClose}>
    <header><h2>版本紀錄</h2><form method="dialog"><button aria-label="關閉版本紀錄"><X size={20} /></button></form></header>
    <div className={styles.historyBody}>
      {error && <p role="alert">{error}</p>}
      {!versions && !error && <p>正在載入版本…</p>}
      {versions?.length === 0 && <p>目前還沒有已發布的版本。</p>}
      {versions?.length > 0 && <ul className={styles.versionList}>{versions.map(version =>
        <li key={version.generation}><button type="button" aria-pressed={selected === version.generation}
          onClick={() => openVersion(version.generation)}>
          <strong>{formatDate(version.updated_at)}{version.generation === String(generation) && ' · 目前版本'}</strong>
          {version.edited_by && <span>{version.edited_by}</span>}
        </button></li>)}</ul>}
      {selected && content === null && !error && <p>正在載入文件…</p>}
      {content !== null && <div className={styles.document}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>{content}</ReactMarkdown>
      </div>}
    </div>
  </dialog>
}
