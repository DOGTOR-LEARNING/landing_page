'use client'
import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'
import page from './nest.module.css'
import CatalogTab from './CatalogTab'
import MessagesTab from './MessagesTab'
import SupportTab from './SupportTab'
import SharedArtTab from './SharedArtTab'
import { MARKETS, nestApi } from './shared'

// Species and items are one catalog: the tw backend writes every save to all
// databases (NEST_CATALOG_DATABASES). Messages and support stay per market.
const CATALOG_MARKET = 'tw'
const TABS = [['species', '寵物'], ['items', '擺件與背景'], ['messages', '留言短句與貼圖'], ['shared', '共用介面圖'], ['support', '客服查詢與補發']]

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
        nestApi(CATALOG_MARKET, '/species'), nestApi(CATALOG_MARKET, '/items'), nestApi(target, '/phrases'),
        nestApi(target, '/stickers'), nestApi(CATALOG_MARKET, '/options'),
      ])
      setData({ species: species.species, items: items.items, phrases: phrases.phrases, stickers: stickers.stickers, options })
    } catch (e) { setData(null); notify(e.message, true) }
    finally { setLoading(false) }
  }, [market, notify])

  useEffect(() => { load(market) }, [market, load])

  const isCatalog = tab === 'species' || tab === 'items' || tab === 'shared'
  return <div className={page.root}>
    <div className={page.toolbar}>
      {isCatalog ? <span className={page.muted}>中英文共用一份目錄</span> : <div className={styles.langTabs}>{MARKETS.map(([code, text]) =>
        <button key={code} className={`${styles.langTab} ${market === code ? styles.langTabActive : ''}`} onClick={() => setMarket(code)}>{text}</button>)}
      </div>}
      <span className={page.spacer} />
      <button className={styles.smallButton} onClick={() => load()} disabled={loading}><RefreshCw size={14} />重新整理</button>
    </div>
    <nav className={page.tabs} aria-label="寵物窩管理">{TABS.map(([code, text]) =>
      <button key={code} className={`${page.tab} ${tab === code ? page.tabActive : ''}`} onClick={() => setTab(code)} aria-current={tab === code ? 'page' : undefined}>{text}</button>)}
    </nav>
    <p className={styles.hint}>首次開啟只發放逗逗和溫暖臥室。其他寵物、背景、家具、玩具先選「商店」，價格留空，不會自動發放。</p>
    {message && <p className={`${styles.inlineMessage} ${message.error ? page.errorMessage : ''}`} role="status">
      {message.text}<button className={page.dismiss} onClick={() => setMessage(null)} aria-label="關閉"><X size={14} /></button>
    </p>}

    {loading && !data ? <p className={page.muted}>載入中…</p> : !data ? <p className={page.muted}>載入失敗，請重新整理。</p> : <>
      {(tab === 'species' || tab === 'items') && <CatalogTab key={tab} market={CATALOG_MARKET} kind={tab}
        rows={data[tab]} options={data.options} canEdit={canEdit} onSaved={() => load()} notify={notify} />}
      {tab === 'messages' && <MessagesTab market={market} phrases={data.phrases} stickers={data.stickers}
        canEdit={canEdit} onSaved={() => load()} notify={notify} />}
      {tab === 'shared' && <SharedArtTab market={CATALOG_MARKET} canEdit={canEdit} notify={notify} />}
      {tab === 'support' && <SupportTab key={market} market={market} species={data.species} items={data.items}
        canEdit={canEdit} notify={notify} />}
    </>}
  </div>
}
