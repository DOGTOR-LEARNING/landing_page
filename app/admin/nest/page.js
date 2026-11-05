'use client'
import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'
import page from './nest.module.css'
import CatalogTab from './CatalogTab'
import MessagesTab from './MessagesTab'
import SupportTab from './SupportTab'
import { MARKETS, nestApi } from './shared'

const TABS = [['species', '寵物'], ['items', '擺件與背景'], ['messages', '留言短句與貼圖'], ['support', '客服查詢與補發']]

export default function NestAdminPage() {
  const { user } = useAdmin()
  const canEdit = user.permissions.includes('nest.manage')
  const [market, setMarket] = useState('tw')
  const [tab, setTab] = useState('species')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  const notify = useCallback((text, error = false) => setMessage({ text, error }), [])

  const load = useCallback(async (target = market) => {
    setLoading(true)
    try {
      const [species, items, phrases, stickers, options] = await Promise.all([
        nestApi(target, '/species'), nestApi(target, '/items'), nestApi(target, '/phrases'),
        nestApi(target, '/stickers'), nestApi(target, '/options'),
      ])
      setData({ species: species.species, items: items.items, phrases: phrases.phrases, stickers: stickers.stickers, options })
    } catch (e) { setData(null); notify(e.message, true) }
    finally { setLoading(false) }
  }, [market, notify])

  useEffect(() => { load(market) }, [market, load])

  return <div className={page.root}>
    <div className={page.toolbar}>
      <div className={styles.langTabs}>{MARKETS.map(([code, text]) =>
        <button key={code} className={`${styles.langTab} ${market === code ? styles.langTabActive : ''}`} onClick={() => setMarket(code)}>{text}</button>)}
      </div>
      <span className={page.spacer} />
      <button className={styles.smallButton} onClick={() => load()} disabled={loading}><RefreshCw size={14} />重新整理</button>
    </div>
    <nav className={page.tabs} aria-label="寵物窩管理">{TABS.map(([code, text]) =>
      <button key={code} className={`${page.tab} ${tab === code ? page.tabActive : ''}`} onClick={() => setTab(code)} aria-current={tab === code ? 'page' : undefined}>{text}</button>)}
    </nav>
    {message && <p className={`${styles.inlineMessage} ${message.error ? page.errorMessage : ''}`} role="status">
      {message.text}<button className={page.dismiss} onClick={() => setMessage(null)} aria-label="關閉"><X size={14} /></button>
    </p>}

    {loading && !data ? <p className={page.muted}>載入中…</p> : !data ? <p className={page.muted}>載入失敗，請重新整理。</p> : <>
      {(tab === 'species' || tab === 'items') && <CatalogTab key={`${market}:${tab}`} market={market} kind={tab}
        rows={data[tab]} options={data.options} canEdit={canEdit} onSaved={() => load()} notify={notify} />}
      {tab === 'messages' && <MessagesTab market={market} phrases={data.phrases} stickers={data.stickers}
        canEdit={canEdit} onSaved={() => load()} notify={notify} />}
      {tab === 'support' && <SupportTab key={market} market={market} species={data.species} items={data.items}
        canEdit={canEdit} notify={notify} />}
    </>}
  </div>
}
