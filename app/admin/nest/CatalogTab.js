'use client'
import { useState } from 'react'
import { Pencil, Plus, X } from 'lucide-react'
import styles from '../admin.module.css'
import page from './nest.module.css'
import LayoutEditor, { DEFAULT_LAYOUT } from './LayoutEditor'
import {
  ASSET_BASE, Field, ImageField, MOTIONS, POSES, PRESETS, RARITIES, RuleEditor, SLOT_KINDS, SOURCES, Select,
  jsonBody, label, nestApi, priceInput, ruleText,
} from './shared'

const ID_PATTERN = /^[a-z0-9_]{2,40}$/

const newSpecies = () => ({
  isNew: true, id: '', names: { tw: '', en: '' }, image_urls: {}, display_scale: 1, rarity: 'common', source: 'shop',
  unlock_rule: null, price_bones: '', is_published: false, sort: 0,
})
const newItem = slotKind => ({
  isNew: true, id: '', names: { tw: '', en: '' }, image_url: '', slot_kind: slotKind || 'toy', layout: null, rarity: 'common',
  motion: 'static', motion_preset: null, source: 'shop', unlock_rule: null, price_bones: '', is_published: false, sort: 0,
})

// Rows from the API (decimal, 0/1) as form state.
const formNames = row => ({ tw: row.names?.tw || '', en: row.names?.en || '' })
const speciesForm = row => ({ ...row, names: formNames(row), display_scale: Number(row.display_scale), price_bones: row.price_bones ?? '', is_published: !!row.is_published, image_urls: row.image_urls || {} })
const itemForm = row => ({ ...row, names: formNames(row), price_bones: row.price_bones ?? '', is_published: !!row.is_published })

function speciesBody(form) {
  const imageUrls = Object.fromEntries(POSES.map(([pose]) => [pose, form.image_urls[pose] || `${ASSET_BASE}/species/${form.id}/${pose}.webp`]))
  return {
    id: form.id, names: { tw: form.names.tw.trim(), en: form.names.en.trim() }, image_urls: imageUrls, display_scale: Number(form.display_scale) || 1,
    rarity: form.rarity, source: form.source, unlock_rule: form.unlock_rule, price_bones: priceInput(form.price_bones),
    is_published: form.is_published, sort: Number(form.sort) || 0,
  }
}

function itemBody(form) {
  return {
    id: form.id, names: { tw: form.names.tw.trim(), en: form.names.en.trim() }, image_url: form.image_url || `${ASSET_BASE}/items/${form.id}.webp`,
    slot_kind: form.slot_kind, layout: form.slot_kind === 'background' ? form.layout || DEFAULT_LAYOUT : null,
    rarity: form.rarity, motion: form.motion, motion_preset: form.motion === 'static' ? null : form.motion_preset,
    source: form.source, unlock_rule: form.unlock_rule, price_bones: priceInput(form.price_bones),
    is_published: form.is_published, sort: Number(form.sort) || 0,
  }
}

function validate(form, kind) {
  if (!ID_PATTERN.test(form.id)) return '代號只能用小寫英文、數字、底線，2–40 字'
  if (!form.names.tw.trim() || !form.names.en.trim()) return '中文和英文名稱都要填'
  if (form.price_bones !== '' && !(Number(form.price_bones) >= 0)) return '價格要是 0 以上的整數，或留空表示非賣品'
  const rule = form.unlock_rule
  if (rule?.type === 'streak' && !(rule.days > 0)) return '請填連續學習天數'
  if (rule?.type === 'ranked_tier' && !rule.tier) return '請選段位'
  if (rule?.type === 'achievement' && !rule.id) return '請選成就'
  if (kind === 'item' && form.motion !== 'static' && !form.motion_preset) return '請選動態效果'
  return ''
}

function PriceCell({ price }) {
  return price === null || price === undefined ? <span className={page.muted}>非賣品</span> : <span>{price} 骨頭</span>
}

const displayName = row => row.names?.tw || row.names?.en || row.name

export default function CatalogTab({ market, kind, rows, options, canEdit, onSaved, notify }) {
  const [form, setForm] = useState(null)
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const isSpecies = kind === 'species'
  const path = isSpecies ? '/species' : '/items'

  async function save(body) {
    setBusy(true); setError('')
    try {
      const result = await nestApi(market, path, jsonBody(form?.isNew ? 'POST' : 'PUT', body))
      notify(`已儲存「${body.names.tw}」到 ${(result.databases || []).join('、')}`)
      setForm(null)
      onSaved()
    } catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }
  function submit(event) {
    event.preventDefault()
    const problem = validate(form, kind)
    if (problem) { setError(problem); return }
    save(isSpecies ? speciesBody(form) : itemBody(form))
  }
  async function togglePublish(row) {
    const body = isSpecies ? speciesBody(speciesForm(row)) : itemBody(itemForm(row))
    body.is_published = !row.is_published
    try {
      await nestApi(market, path, jsonBody('PUT', body))
      notify(`${body.is_published ? '已上架' : '已下架'}「${displayName(row)}」`)
      onSaved()
    } catch (e) { notify(e.message, true) }
  }

  const visible = isSpecies ? rows : rows.filter(r => filter === 'all' || r.slot_kind === filter)
  const set = patch => setForm(f => ({ ...f, ...patch }))

  return <>
    <div className={page.toolbar}>
      {!isSpecies && <div className={styles.langTabs}>
        {[['all', '全部'], ...SLOT_KINDS].map(([code, text]) =>
          <button key={code} className={`${styles.langTab} ${filter === code ? styles.langTabActive : ''}`} onClick={() => setFilter(code)}>{text}</button>)}
      </div>}
      <span className={page.spacer} />
      {canEdit && <button className={styles.btnPrimary} onClick={() => { setError(''); setForm(isSpecies ? newSpecies() : newItem(filter === 'all' ? 'toy' : filter)) }}>
        <Plus size={16} />{isSpecies ? '新增寵物' : '新增擺件／背景'}
      </button>}
    </div>

    <div className={styles.tableScroll}><table className={styles.dataTable}>
      <thead><tr><th>圖</th><th>名稱</th>{!isSpecies && <th>種類</th>}<th>稀有度</th><th>取得方式</th><th>價格</th><th>解鎖條件</th><th>狀態</th><th>排序</th>{canEdit && <th />}</tr></thead>
      <tbody>{visible.length === 0
        ? <tr><td colSpan={10} className={page.muted}>還沒有資料</td></tr>
        : visible.map(row => <tr key={row.id}>
          <td><div className={`${page.thumb} ${page.checker}`}>{(isSpecies ? row.image_urls?.avatar || row.image_urls?.sit : row.image_url) && <img src={isSpecies ? row.image_urls?.avatar || row.image_urls?.sit : row.image_url} alt="" />}</div></td>
          <td><strong>{row.names?.tw || '—'}</strong> / {row.names?.en || <span className={page.warn}>缺英文名</span>}<div className={page.muted}>{row.id}</div>
            {row.missing_in?.length > 0 && <div className={page.warn}>尚未同步到 {row.missing_in.join('、')}，重新儲存一次即可</div>}</td>
          {!isSpecies && <td>{label(SLOT_KINDS, row.slot_kind)}</td>}
          <td>{label(RARITIES, row.rarity)}</td>
          <td>{label(SOURCES, row.source)}</td>
          <td><PriceCell price={row.price_bones} /></td>
          <td>{ruleText(row.unlock_rule, options)}</td>
          <td><button className={`${styles.statusBadge} ${row.is_published ? '' : styles.statusDisabled} ${page.badgeButton}`} disabled={!canEdit} onClick={() => togglePublish(row)} title={canEdit ? '點一下切換上下架' : undefined}>{row.is_published ? '上架中' : '未上架'}</button></td>
          <td>{row.sort}</td>
          {canEdit && <td><button className={styles.smallButton} onClick={() => { setError(''); setForm(isSpecies ? speciesForm(row) : itemForm(row)) }}><Pencil size={14} />編輯</button></td>}
        </tr>)}
      </tbody>
    </table></div>

    {form && <div className={styles.modalOverlay}>
      <section className={`${styles.modal} ${page.editor}`} role="dialog" aria-modal="true" aria-labelledby="nest-editor-title">
        <button className={styles.modalClose} disabled={busy} onClick={() => setForm(null)} aria-label="關閉"><X size={20} /></button>
        <h2 id="nest-editor-title">{form.isNew ? (isSpecies ? '新增寵物' : '新增擺件／背景') : `編輯「${form.names.tw || form.id}」`}</h2>
        <p className={styles.hint}>中英文一起設定：儲存時同時寫入 {(options?.catalog_databases || []).join('、') || '所有資料庫'}，中文名稱給台灣、英文名稱給國際版。圖片只要上傳一次。</p>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formColumns}>
            <Field label="代號（id）" hint="小寫英文、數字、底線；建立後不能改，也是圖片檔名">
              <input className={styles.input} value={form.id} disabled={!form.isNew} onChange={e => set({ id: e.target.value.toLowerCase() })} placeholder={isSpecies ? 'shiba' : 'shelf_books'} />
            </Field>
          </div>
          <div className={styles.formColumns}>
            <Field label="中文名稱"><input className={styles.input} maxLength={40} value={form.names.tw} onChange={e => set({ names: { ...form.names, tw: e.target.value } })} placeholder="小柴" /></Field>
            <Field label="英文名稱"><input className={styles.input} maxLength={40} value={form.names.en} onChange={e => set({ names: { ...form.names, en: e.target.value } })} placeholder="Shiba" /></Field>
          </div>
          <div className={styles.formColumns}>
            {!isSpecies && <Field label="種類" hint="決定能放在哪個格位"><Select value={form.slot_kind} options={SLOT_KINDS} disabled={!form.isNew} onChange={slot_kind => set({ slot_kind })} /></Field>}
            <Field label="稀有度" hint="物品欄卡片的框色"><Select value={form.rarity} options={RARITIES} onChange={rarity => set({ rarity })} /></Field>
            <Field label="取得方式"><Select value={form.source} options={SOURCES} onChange={source => set({ source })} /></Field>
          </div>
          <div className={styles.formColumns}>
            <Field label="價格（骨頭）" hint="留空＝非賣品，只能從解鎖條件或獎勵取得">
              <input className={styles.input} type="number" min={0} value={form.price_bones} onChange={e => set({ price_bones: e.target.value })} placeholder="非賣品" />
            </Field>
            <Field label="排序" hint="數字小的排前面"><input className={styles.input} type="number" value={form.sort} onChange={e => set({ sort: e.target.value })} /></Field>
            {isSpecies && <Field label="顯示大小" hint="0.6–1.4，體型不同的寵物用這個調"><input className={styles.input} type="number" min={0.6} max={1.4} step="any" value={form.display_scale} onChange={e => set({ display_scale: e.target.value })} /></Field>}
          </div>
          {!isSpecies && form.slot_kind !== 'background' && <div className={styles.formColumns}>
            <Field label="動態"><Select value={form.motion} options={MOTIONS} onChange={motion => set({ motion, motion_preset: motion === 'static' ? null : PRESETS[motion][0][0] })} /></Field>
            {form.motion !== 'static' && <Field label="效果"><Select value={form.motion_preset} options={PRESETS[form.motion]} onChange={motion_preset => set({ motion_preset })} /></Field>}
          </div>}
          {!isSpecies && form.slot_kind === 'background' && <div className={styles.formColumns}>
            <Field label="背景特效"><Select value={form.motion === 'particle' ? form.motion_preset : ''} options={[['', '無'], ...PRESETS.particle]} onChange={preset => set(preset ? { motion: 'particle', motion_preset: preset } : { motion: 'static', motion_preset: null })} /></Field>
          </div>}
          <Field label="解鎖條件" hint="有價格的東西不論條件都能在商店買；同一個條件可以綁好幾樣東西">
            <RuleEditor rule={form.unlock_rule} options={options} forSpecies={isSpecies} onChange={unlock_rule => set({ unlock_rule })} />
          </Field>

          <Field label="圖片" hint="WebP 或 GIF 都可以（GIF 會循環播放）；規格見 docs/pet-nest-art/README.md；上傳後要按下方「儲存」才會套用">
            {isSpecies
              ? <div className={page.imageGrid}>{POSES.map(([pose, text]) =>
                <ImageField key={pose} market={market} title={text} checker
                  url={form.image_urls[pose]} targetId={ID_PATTERN.test(form.id) ? form.id : ''}
                  kind={pose === 'avatar' ? 'avatar' : 'pet'} pose={pose === 'avatar' ? null : pose}
                  size={options?.asset_sizes?.[pose === 'avatar' ? 'avatar' : 'pet']}
                  gifSize={options?.gif_sizes?.[pose === 'avatar' ? 'avatar' : 'pet']}
                  onUploaded={url => set({ image_urls: { ...form.image_urls, [pose]: url } })} />)}</div>
              : <ImageField market={market} title={label(SLOT_KINDS, form.slot_kind)} checker={form.slot_kind !== 'background'}
                url={form.image_url} targetId={ID_PATTERN.test(form.id) ? form.id : ''} kind={form.slot_kind}
                size={options?.asset_sizes?.[form.slot_kind]} onUploaded={image_url => set({ image_url })} />}
          </Field>

          {!isSpecies && form.slot_kind === 'background' && <Field label="格位與寵物位置">
            <LayoutEditor value={form.layout} imageUrl={form.image_url} onChange={layout => set({ layout })} />
          </Field>}

          <label className={page.checkRow}><input type="checkbox" checked={form.is_published} onChange={e => set({ is_published: e.target.checked })} />上架（App 會看到、也會被發放）</label>
          {error && <p className={styles.errorMsg} role="alert">{error}</p>}
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} disabled={busy} onClick={() => setForm(null)}>取消</button>
            <button className={styles.btnPrimary} disabled={busy}>{busy ? '儲存中…' : '儲存'}</button>
          </div>
        </form>
      </section>
    </div>}
  </>
}
