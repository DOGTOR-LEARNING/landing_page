'use client'
import { useState } from 'react'
import { Gift, Search } from 'lucide-react'
import styles from '../admin.module.css'
import page from './nest.module.css'
import { Field, jsonBody, nestApi } from './shared'

// Customer support: look a student up by user_id or email, see their nest
// and ledger, and hand out bones, food, pets or items by hand.

const STATUS = { home: '在房間', resting: '休息中', away: '被抓走', lost: '已失去' }
const SOURCES = {
  level: '完成關卡', battle: '對戰', feed: '餵食', friend_feed: '幫朋友餵', shop: '商店',
  streak: '連續學習', achievement: '成就', ranked: '段位', duplicate_refund: '重複補償', admin: '後台補發',
}
const when = value => value ? new Date(String(value).replace(' ', 'T') + (String(value).endsWith('Z') ? '' : 'Z')).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false }) : '—'

export default function SupportTab({ market, species, items, canEdit, notify }) {
  const [query, setQuery] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [grant, setGrant] = useState({ bones: '', food: '', species: '', items: [], note: '' })
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState(null)

  async function lookup(id = query.trim()) {
    if (!id) return
    setLoading(true); setError('')
    try { setData(await nestApi(market, `/users/${encodeURIComponent(id)}`)) }
    catch (e) { setData(null); setError(e.message === 'no nest' ? '這位學生還沒打開過寵物窩' : e.message === 'no user with this email' ? '找不到這個 Email 的帳號' : e.message) }
    finally { setLoading(false) }
  }

  async function sendGrant(event) {
    event.preventDefault()
    const body = {
      user_id: data.nest.user_id, bones: Number(grant.bones) || 0, food: Number(grant.food) || 0,
      species: grant.species ? [grant.species] : [], items: grant.items, note: grant.note || null,
    }
    if (!body.bones && !body.food && !body.species.length && !body.items.length) { notify('請至少選一樣要補發的東西', true); return }
    const name = (list, id) => list.find(x => x.id === id)?.name || id
    const parts = [body.bones && `${body.bones} 骨頭`, body.food && `${body.food} 飼料`, ...body.species.map(id => name(species, id)), ...body.items.map(id => name(items, id))].filter(Boolean)
    const summary = `補發給 ${data.user?.nickname || data.user?.name || body.user_id}：${parts.join('、')}`
    // Two steps: the first press shows exactly what will be sent.
    if (pending !== summary) { setPending(summary); return }
    setPending(null)
    setBusy(true)
    try {
      await nestApi(market, '/grant', jsonBody('POST', body))
      notify('已補發，學生下次打開寵物窩會看到通知')
      setGrant({ bones: '', food: '', species: '', items: [], note: '' })
      lookup(body.user_id)
    } catch (e) { notify(e.message, true) }
    finally { setBusy(false) }
  }

  const nest = data?.nest
  return <>
    <form className={page.addRow} onSubmit={e => { e.preventDefault(); lookup() }}>
      <input className={styles.input} placeholder="學生的 user_id 或 Email" value={query} onChange={e => setQuery(e.target.value)} />
      <button className={styles.btnPrimary} disabled={loading || !query.trim()}><Search size={16} />{loading ? '查詢中…' : '查詢'}</button>
    </form>
    {error && <p className={styles.errorMsg} role="alert">{error}</p>}

    {nest && <div className={page.columns}>
      <section className={page.panel}>
        <h2>{data.user?.nickname || data.user?.name || nest.user_id}</h2>
        <p className={styles.hint}>{data.user?.email} · {nest.user_id} · 建立於 {when(nest.created_at)}</p>
        <div className={page.stats}>
          <div><span>飼料</span><strong>{nest.food} / 20</strong></div>
          <div><span>今天拿到</span><strong>{nest.food_earned_today} / 5</strong></div>
          <div><span>骨頭</span><strong>{nest.bones}</strong></div>
          <div><span>收到的讚</span><strong>{nest.likes_total}</strong></div>
        </div>
        <h3>寵物</h3>
        <div className={styles.tableScroll}><table className={styles.dataTable}>
          <thead><tr><th>名字</th><th>種類</th><th>狀態</th><th>飽足度</th><th>陪伴</th><th>來源</th></tr></thead>
          <tbody>{data.pets.map(p => <tr key={p.pet_id}>
            <td>{p.nickname}</td><td>{p.species_id}</td>
            <td>{STATUS[p.status] || p.status}{p.status === 'away' && p.away_since && <div className={page.muted}>{p.away_since} 起</div>}</td>
            <td>{p.fullness} / 5</td><td>{p.companion_days} 天</td><td>{p.source}</td>
          </tr>)}</tbody>
        </table></div>
        <h3>擁有的擺件（{data.items.length}）</h3>
        <p className={page.tagList}>{data.items.map(i => <span key={i.item_id}>{items.find(x => x.id === i.item_id)?.name || i.item_id}</span>)}</p>
      </section>

      <section className={page.panel}>
        {canEdit && <form className={styles.form} onSubmit={sendGrant} onChange={() => setPending(null)}>
          <h2>手動補發</h2>
          <p className={styles.hint}>客服用。每次補發都會留紀錄；已擁有的擺件會自動改發骨頭。</p>
          <div className={styles.formColumns}>
            <Field label="骨頭"><input className={styles.input} type="number" min={0} max={10000} value={grant.bones} onChange={e => setGrant({ ...grant, bones: e.target.value })} /></Field>
            <Field label="飼料" hint="不會超過存放上限 20"><input className={styles.input} type="number" min={0} max={20} value={grant.food} onChange={e => setGrant({ ...grant, food: e.target.value })} /></Field>
          </div>
          <Field label="寵物（新增一隻）">
            <select className={styles.input} value={grant.species} onChange={e => setGrant({ ...grant, species: e.target.value })}>
              <option value="">不補發寵物</option>
              {species.map(s => <option key={s.id} value={s.id}>{s.name}（{s.id}）</option>)}
            </select>
          </Field>
          <Field label="擺件／背景" hint="可複選（按住 ⌘ 或 Ctrl）">
            <select className={`${styles.input} ${page.multi}`} multiple value={grant.items} onChange={e => setGrant({ ...grant, items: [...e.target.selectedOptions].map(o => o.value) })}>
              {items.map(i => <option key={i.id} value={i.id}>{i.name}（{i.id}）</option>)}
            </select>
          </Field>
          <Field label="備註"><input className={styles.input} maxLength={200} placeholder="例如：客服單 #123 補償" value={grant.note} onChange={e => setGrant({ ...grant, note: e.target.value })} /></Field>
          {pending && <p className={page.confirm}>{pending}？再按一次「確認補發」送出。</p>}
          <div className={styles.modalActions}>
            {pending && <button type="button" className={styles.btnSecondary} onClick={() => setPending(null)}>取消</button>}
            <button className={styles.btnPrimary} disabled={busy}><Gift size={16} />{busy ? '補發中…' : pending ? '確認補發' : '補發'}</button>
          </div>
        </form>}

        <h3>收支紀錄（最近 100 筆）</h3>
        <div className={`${styles.tableScroll} ${page.ledger}`}><table className={styles.dataTable}>
          <thead><tr><th>時間</th><th>項目</th><th>變動</th><th>結餘</th><th>原因</th></tr></thead>
          <tbody>{data.ledger.map(l => <tr key={l.id}>
            <td>{when(l.created_at)}</td><td>{l.currency === 'food' ? '飼料' : '骨頭'}</td>
            <td className={l.delta < 0 ? page.negative : page.positive}>{l.delta > 0 ? `+${l.delta}` : l.delta}</td>
            <td>{l.balance_after}</td><td>{SOURCES[l.source] || l.source}</td>
          </tr>)}</tbody>
        </table></div>
        <h3>已發放的獎勵</h3>
        <p className={page.tagList}>{data.grants.map(g => <span key={g.grant_key} title={when(g.granted_at)}>{g.grant_key}</span>)}</p>
      </section>
    </div>}
  </>
}
