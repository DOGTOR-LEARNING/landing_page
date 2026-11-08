'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Mail, Search, X } from 'lucide-react'
import { adminFetch } from '../../AdminWorkspace'
import styles from '../../admin.module.css'
import page from './modules.module.css'
import { CATEGORIES, MODULES, TEAM, TECH_GROUPS } from '@/lib/moduleOwners'

// Find the employee account behind a TEAM entry: exact email first, then a name token.
function findAccount(person, accounts) {
  const emails = person.match.filter(m => m.includes('@'))
  const names = person.match.filter(m => !m.includes('@'))
  return accounts.find(a => emails.includes((a.email || '').toLowerCase()))
    || accounts.find(a => names.some(n => (a.display_name || '').toLowerCase().includes(n)))
}

function matches(module, query, tech, owner) {
  if (tech && !module.stack.includes(tech)) return false
  if (owner && !module.owners.includes(owner)) return false
  if (!query) return true
  const people = module.owners.map(k => TEAM.find(p => p.key === k)).filter(Boolean).flatMap(p => [p.name, p.fullName])
  const haystack = [module.name, module.summary, ...people, ...module.stack, ...module.paths].join(' ').toLowerCase()
  return haystack.includes(query.toLowerCase())
}

const CARD_WIDTH = 320

export default function ModuleOwnersPage() {
  const [query, setQuery] = useState('')
  const [tech, setTech] = useState('')
  const [owner, setOwner] = useState('')
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    adminFetch('/api/admin/team/members', { cache: 'no-store' })
      .then(r => r.json()).then(d => { if (d.success) setAccounts(d.data) }).catch(() => {})
  }, [])

  // TEAM merged with the live employee account (title, intro, login email).
  const people = useMemo(() => TEAM.map(person => {
    const account = findAccount(person, accounts)
    return {
      ...person,
      displayName: account?.display_name || person.fullName,
      email: account?.email || person.email,
      jobTitle: account?.job_title || '',
      bio: account?.bio || '',
      modules: MODULES.filter(m => m.owners.includes(person.key)),
    }
  }), [accounts])
  const byKey = Object.fromEntries(people.map(p => [p.key, p]))

  // Tech -> module count, grouped by layer; anything not listed in TECH_GROUPS goes to 其他.
  const techGroups = useMemo(() => {
    const counts = new Map()
    MODULES.forEach(m => m.stack.forEach(t => counts.set(t, (counts.get(t) || 0) + 1)))
    const listed = new Set(TECH_GROUPS.flatMap(g => g.items))
    const groups = TECH_GROUPS.map(g => ({ label: g.label, items: g.items.filter(t => counts.has(t)).map(t => [t, counts.get(t)]) }))
    groups.push({ label: '其他', items: [...counts].filter(([t]) => !listed.has(t)) })
    return { total: counts.size, groups: groups.filter(g => g.items.length) }
  }, [])

  // A small name card next to the clicked name; closes on outside click, Escape or scroll.
  const [card, setCard] = useState(null)
  const cardRef = useRef(null)
  const selected = card && byKey[card.key]
  function openPerson(key, event) {
    const rect = event.currentTarget.getBoundingClientRect()
    if (card?.key === key && card.anchor === event.currentTarget) { setCard(null); return }
    const width = Math.min(CARD_WIDTH, window.innerWidth - 32)
    const left = Math.max(16, Math.min(rect.left, window.innerWidth - width - 16))
    const below = rect.bottom + 8
    const fitsBelow = window.innerHeight - below > 260
    setCard({ key, anchor: event.currentTarget, left, width, ...(fitsBelow ? { top: below } : { bottom: window.innerHeight - rect.top + 8 }) })
  }
  useEffect(() => {
    if (!card) return
    const close = () => setCard(null)
    const onKey = e => { if (e.key === 'Escape') close() }
    const onDown = e => { if (!cardRef.current?.contains(e.target) && !card.anchor.contains(e.target)) close() }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [card])

  const visible = MODULES.filter(m => matches(m, query.trim(), tech, owner))
  const filtering = query || tech || owner

  return <>
    <section className={`${styles.tableCard} ${page.card}`}>
      <div className={styles.tableToolbar}><div><h2>開發團隊</h2><p>點名字看介紹、聯絡方式與負責的模組。</p></div></div>
      <div className={page.team}>
        {people.map(p => <button key={p.key} className={page.member} onClick={e => openPerson(p.key, e)} aria-expanded={card?.key === p.key}>
          <span className={page.avatar}>{p.name.slice(0, 1)}</span>
          <span className={page.memberText}><strong>{p.name}</strong><span>{p.jobTitle || p.displayName}</span></span>
          <span className={page.memberCount}>{p.modules.length} 個模組</span>
        </button>)}
      </div>
    </section>

    <section className={`${styles.tableCard} ${page.card}`}>
      <div className={styles.tableToolbar}><div><h2>技術棧</h2><p>{techGroups.total} 項技術，依用途分層。點一項只看用到它的模組，數字是使用的模組數。</p></div></div>
      <dl className={page.techLayers}>
        {techGroups.groups.map(group => <div key={group.label} className={page.techLayer}>
          <dt>{group.label}</dt>
          <dd>{group.items.map(([name, count]) => <button key={name} className={`${page.tech} ${tech === name ? page.techActive : ''}`} onClick={() => setTech(tech === name ? '' : name)} aria-pressed={tech === name}>
            {name}<span>{count}</span>
          </button>)}</dd>
        </div>)}
      </dl>
    </section>

    <section className={`${styles.tableCard} ${page.card}`}>
      <div className={styles.tableToolbar}><div><h2>模組與負責人</h2><p>{MODULES.length} 個模組。負責人掌管該模組的主要設定與操作，有問題直接找他們。</p></div></div>
      <div className={page.filters}>
        <label className={page.search}><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜尋模組、技術、人名或路徑" aria-label="搜尋模組" /></label>
        <select value={owner} onChange={e => setOwner(e.target.value)} aria-label="依負責人篩選" className={page.select}>
          <option value="">所有負責人</option>
          {people.map(p => <option key={p.key} value={p.key}>{p.name}（{p.modules.length}）</option>)}
        </select>
        {filtering && <button className={page.clear} onClick={() => { setQuery(''); setTech(''); setOwner('') }}><X size={15} />清除篩選</button>}
      </div>
      {tech && <p className={page.active}>只顯示使用 <strong>{tech}</strong> 的模組</p>}

      {!visible.length && <p className={page.empty}>沒有符合條件的模組。</p>}
      {CATEGORIES.map(category => {
        const items = visible.filter(m => m.category === category.id)
        if (!items.length) return null
        return <div key={category.id} className={page.group}>
          <h3 className={page.groupTitle}>{category.label}<span>{items.length}</span></h3>
          <div className={page.grid}>
            {items.map(m => <article key={m.id} className={page.module}>
              <h4>{m.name}</h4>
              <p className={page.summary}>{m.summary}</p>
              <div className={page.owners}>
                <span className={page.ownersLabel}>負責人</span>
                {m.owners.map(k => byKey[k] && <button key={k} className={page.ownerChip} onClick={e => openPerson(k, e)}><span className={page.avatarSmall}>{byKey[k].name.slice(0, 1)}</span>{byKey[k].name}</button>)}
              </div>
              <ul className={page.stack}>{m.stack.map(t => <li key={t}><button className={tech === t ? page.techActive : ''} onClick={() => setTech(tech === t ? '' : t)}>{t}</button></li>)}</ul>
              <details className={page.paths}><summary>程式位置</summary><ul>{m.paths.map(p => <li key={p}><code>{p}</code></li>)}</ul></details>
            </article>)}
          </div>
        </div>
      })}
      <div className={styles.permissionHelp}>
        <h3>資料怎麼更新</h3>
        <p>職稱和自我介紹由每個人在「帳號設定」自己填寫。模組、技術棧和負責人寫在官網專案的 <code>lib/moduleOwners.js</code>，改完部署即生效。</p>
      </div>
    </section>

    {selected && <div ref={cardRef} className={page.popover} role="dialog" aria-label={`${selected.name} 的名片`}
      style={{ left: card.left, width: card.width, top: card.top, bottom: card.bottom }}>
      <div className={page.popHead}>
        <span className={page.avatar}>{selected.name.slice(0, 1)}</span>
        <div><strong>{selected.name}</strong><span>{selected.jobTitle || selected.displayName}</span></div>
        <button className={page.popClose} onClick={() => setCard(null)} aria-label="關閉"><X size={16} /></button>
      </div>
      <a className={page.popLink} href={`mailto:${selected.email}`}><Mail size={15} />{selected.email}</a>
      {selected.bio ? <p className={page.popBio}>{selected.bio}</p> : <p className={page.popBioEmpty}>還沒寫自我介紹，可在「帳號設定」填寫。</p>}
      <p className={page.popModules}>負責 {selected.modules.length} 個模組：{selected.modules.map(m => m.name).join('、')}</p>
    </div>}
  </>
}
