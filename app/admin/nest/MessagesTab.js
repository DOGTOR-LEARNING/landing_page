'use client'
import { useState } from 'react'
import { Plus, Save } from 'lucide-react'
import styles from '../admin.module.css'
import page from './nest.module.css'
import { ImageField, jsonBody, nestApi } from './shared'

// Friends leave canned notes only — no free text, so nothing needs
// moderation (spec §3.4). Phrases are per market; stickers carry no text.

function PhraseRow({ market, phrase, canEdit, onSaved, notify }) {
  const [draft, setDraft] = useState({ text: phrase.text, sort: phrase.sort, is_published: !!phrase.is_published })
  const dirty = draft.text !== phrase.text || Number(draft.sort) !== phrase.sort || draft.is_published !== !!phrase.is_published
  async function save(next = draft) {
    try {
      await nestApi(market, `/phrases/${phrase.id}`, jsonBody('PUT', { ...next, sort: Number(next.sort) || 0 }))
      notify('已儲存短句')
      onSaved()
    } catch (e) { notify(e.message, true) }
  }
  return <tr>
    <td><input className={styles.input} maxLength={40} value={draft.text} disabled={!canEdit} onChange={e => setDraft({ ...draft, text: e.target.value })} /></td>
    <td className={page.narrow}><input className={styles.input} type="number" value={draft.sort} disabled={!canEdit} onChange={e => setDraft({ ...draft, sort: e.target.value })} /></td>
    <td><button className={`${styles.statusBadge} ${draft.is_published ? '' : styles.statusDisabled} ${page.badgeButton}`} disabled={!canEdit}
      onClick={() => { const next = { ...draft, is_published: !draft.is_published }; setDraft(next); save(next) }}>{draft.is_published ? '上架中' : '未上架'}</button></td>
    <td>{canEdit && <button className={styles.smallButton} disabled={!dirty || !draft.text.trim()} onClick={() => save()}><Save size={14} />儲存</button>}</td>
  </tr>
}

export default function MessagesTab({ market, phrases, stickers, canEdit, onSaved, notify }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  async function addPhrase(event) {
    event.preventDefault()
    if (!text.trim()) return
    setBusy(true)
    try {
      await nestApi(market, '/phrases', jsonBody('POST', { text: text.trim(), is_published: true, sort: phrases.length }))
      setText(''); notify('已新增短句'); onSaved()
    } catch (e) { notify(e.message, true) }
    finally { setBusy(false) }
  }
  async function addSticker(url) {
    try {
      await nestApi(market, '/stickers', jsonBody('POST', { image_url: url, is_published: true, sort: stickers.length }))
      notify('已新增貼圖'); onSaved()
    } catch (e) { notify(e.message, true) }
  }
  async function toggleSticker(sticker) {
    try {
      await nestApi(market, `/stickers/${sticker.id}`, jsonBody('PUT', { image_url: sticker.image_url, sort: sticker.sort, is_published: !sticker.is_published }))
      onSaved()
    } catch (e) { notify(e.message, true) }
  }

  return <div className={page.columns}>
    <section className={page.panel}>
      <h2>留言短句</h2>
      <p className={styles.hint}>學生拜訪好友時可以選一句留言（不開放自由輸入）。最多 40 字，只寫這個市場的語言。</p>
      {canEdit && <form className={page.addRow} onSubmit={addPhrase}>
        <input className={styles.input} maxLength={40} placeholder="例如：一起加油讀書" value={text} onChange={e => setText(e.target.value)} />
        <button className={styles.btnPrimary} disabled={busy || !text.trim()}><Plus size={16} />新增</button>
      </form>}
      <div className={styles.tableScroll}><table className={styles.dataTable}>
        <thead><tr><th>短句</th><th>排序</th><th>狀態</th><th /></tr></thead>
        <tbody>{phrases.map(p => <PhraseRow key={`${p.id}:${p.text}:${p.sort}:${p.is_published}`} market={market} phrase={p} canEdit={canEdit} onSaved={onSaved} notify={notify} />)}</tbody>
      </table></div>
    </section>
    <section className={page.panel}>
      <h2>貼圖</h2>
      <p className={styles.hint}>256×256 透明 WebP、不放文字（兩個市場共用圖片，但各自管理上下架）。點貼圖切換上下架。</p>
      {canEdit && <ImageField market={market} title="上傳新貼圖" kind="sticker" targetId={`sticker_${market}_${stickers.length + 1}_${Date.now() % 100000}`} checker onUploaded={addSticker} />}
      <div className={page.stickerGrid}>{stickers.map(s =>
        <button key={s.id} className={`${page.sticker} ${page.checker} ${s.is_published ? '' : page.stickerOff}`} disabled={!canEdit} onClick={() => toggleSticker(s)} title={s.is_published ? '上架中，點一下下架' : '未上架，點一下上架'}>
          <img src={s.image_url} alt="" />
        </button>)}</div>
    </section>
  </div>
}
