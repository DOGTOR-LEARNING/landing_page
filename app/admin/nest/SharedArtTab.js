'use client'
import { useCallback, useEffect, useState } from 'react'
import { ImageField, nestApi, jsonBody } from './shared'
import styles from '../admin.module.css'
import page from './nest.module.css'

const FIELDS = [
  ['dogcatcher_avatar', '捕狗大隊頭像', [256, 256]],
  ['note', '離家紙條', [384, 320]],
  ['bowl', '飼料碗', [240, 160]],
  ['box', '空房紙箱', [640, 640]],
]

export default function SharedArtTab({ market, canEdit, notify }) {
  const [images, setImages] = useState({})
  const [generation, setGeneration] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [ready, setReady] = useState(false)
  const load = useCallback(async () => {
    setLoading(true)
    setReady(false)
    try {
      const data = await nestApi(market, '/shared')
      setImages(data.images || {})
      setGeneration(data.generation || 0)
      setDirty(false)
      setReady(true)
    } catch (error) { notify(error.message, true) }
    finally { setLoading(false) }
  }, [market, notify])
  useEffect(() => { load() }, [load])

  async function save() {
    setBusy(true)
    try {
      const data = await nestApi(market, '/shared', jsonBody('PUT', { images, generation }))
      setGeneration(data.generation)
      setDirty(false)
      notify('共用圖片已儲存，App 下次開啟時會取得新版圖片。')
    } catch (error) { notify(error.message, true) }
    finally { setBusy(false) }
  }

  return <section>
    <h2>共用介面圖</h2>
    <p className={styles.hint}>這四張用在固定介面，不會當作寵物或家具發放。逐格上傳後，按「儲存共用圖」。尚未上傳時，App 使用內建圖片。</p>
    <div className={page.imageGrid}>
      {FIELDS.map(([id, title, size]) => <ImageField key={id} market={market}
        title={title} kind={id} targetId={id} size={size} checker
        url={images[id]} disabled={!canEdit || loading || busy || !ready}
        onUploaded={url => { setImages(previous => ({ ...previous, [id]: url })); setDirty(true) }} />)}
    </div>
    <div className={styles.modalActions}>
      <button type="button" className={styles.smallButton} disabled={loading || busy} onClick={load}>重新整理共用圖</button>
      <button type="button" className={styles.btnPrimary} disabled={!canEdit || !ready || !dirty || busy} onClick={save}>
        {busy ? '儲存中…' : '儲存共用圖'}
      </button>
    </div>
  </section>
}
