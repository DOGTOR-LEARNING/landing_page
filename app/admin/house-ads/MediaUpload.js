'use client'
import { useEffect, useRef, useState } from 'react'
import { Crop, Film, Play, Upload } from 'lucide-react'
import styles from '../admin.module.css'
import page from './house-ads.module.css'
import { api, clock, fileType, jsonBody, megabytes, uploadToStorage } from './shared'

const MAX_VIDEO_UPLOAD = 200 * 1024 * 1024
const BANNER_RATIO = 4
const BANNER_MIN_WIDTH = 600
const BANNER_OUT_WIDTH = 1200
const MAX_BANNER_BYTES = 2 * 1024 * 1024

function useObjectUrl(file) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (!file) { setUrl(''); return undefined }
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  return url
}

function Progress({ value, label }) {
  return <div className={page.progress} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
    <div className={page.progressBar} style={{ width: `${Math.round(value * 100)}%` }} />
    <span>{label}</span>
  </div>
}

/**
 * Pick a video, choose a window of at most `max` seconds when it is longer,
 * and upload. The backend cuts that window and compresses it (long side
 * 1280 px, about 11 MB a minute), so every video ends up small enough for
 * phones on mobile data.
 */
export function VideoUpload({ market, max, onDone, disabled }) {
  const input = useRef(null)
  const player = useRef(null)
  const [file, setFile] = useState(null)
  const url = useObjectUrl(file)
  const [duration, setDuration] = useState(null)
  const [unreadable, setUnreadable] = useState(false)
  const [start, setStart] = useState(0)
  const [stage, setStage] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const windowLength = duration ? Math.min(max, duration) : max
  const needsTrim = duration > max
  const busy = stage === 'uploading' || stage === 'processing'

  function pick(event) {
    const picked = event.target.files?.[0]
    event.target.value = ''
    if (!picked) return
    setError(''); setDuration(null); setUnreadable(false); setStart(0); setStage('idle')
    if (!fileType(picked).startsWith('video/')) { setError('請選 mp4、mov 或 webm 影片'); return }
    if (picked.size > MAX_VIDEO_UPLOAD) { setError(`檔案 ${megabytes(picked.size)}，上限 200 MB，請先在手機或剪輯軟體輸出較小的檔案`); return }
    setFile(picked)
  }

  // Preview stops at the end of the chosen window.
  function onTime() {
    const video = player.current
    if (video && needsTrim && video.currentTime >= start + windowLength) video.pause()
  }

  function previewWindow() {
    const video = player.current
    if (!video) return
    video.currentTime = start
    video.play().catch(() => {})
  }

  async function upload() {
    if (!file) return
    setError(''); setStage('uploading'); setProgress(0)
    try {
      const object = await uploadToStorage(market, 'video', file, setProgress)
      setStage('processing')
      const result = await api(market, '/media/video', jsonBody('POST', { object, start_seconds: needsTrim ? start : 0 }))
      setStage('done')
      onDone(result)
    } catch (e) { setStage('idle'); setError(e.message) }
  }

  return <div className={page.uploadBox}>
    <div className={page.uploadHead}>
      <button type="button" className={styles.smallButton} disabled={disabled || busy} onClick={() => input.current?.click()}><Film size={14} />{file ? '換一支影片' : '選擇影片檔'}</button>
      {file && <span className={page.muted}>{file.name} · {megabytes(file.size)}{duration ? ` · ${clock(duration)}` : ''}</span>}
    </div>
    <input ref={input} type="file" accept="video/mp4,video/quicktime,video/webm,.mov,.m4v" hidden onChange={pick} />

    {url && <video ref={player} className={page.videoPreview} src={url} controls playsInline preload="metadata"
      onLoadedMetadata={e => setDuration(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : null)}
      onError={() => setUnreadable(true)} onTimeUpdate={onTime} />}

    {unreadable && <p className={styles.hint}>這個瀏覽器無法預覽此影片（常見於 iPhone 的 HEVC 格式），仍可上傳；超過 {max} 秒時會自動保留前 {max} 秒。</p>}

    {needsTrim && <div className={page.trim}>
      <p className={styles.hint}>影片長 {clock(duration)}，超過 {max} 秒。拖動選取要保留的 {max} 秒：</p>
      <div className={page.timeline} aria-hidden="true">
        <div className={page.timelineWindow} style={{ left: `${(start / duration) * 100}%`, width: `${(windowLength / duration) * 100}%` }} />
      </div>
      <input className={page.range} type="range" min={0} max={Math.max(0, duration - windowLength)} step={0.1} value={start}
        aria-label="截取起點" disabled={busy} onChange={e => { const value = Number(e.target.value); setStart(value); if (player.current) player.current.currentTime = value }} />
      <div className={page.trimRow}>
        <strong>保留 {clock(start)} – {clock(start + windowLength)}</strong>
        <button type="button" className={styles.smallButton} onClick={previewWindow} disabled={busy}><Play size={14} />從起點試播</button>
      </div>
    </div>}

    {file && stage !== 'done' && <div className={page.trimRow}>
      <span className={page.muted}>上傳後會自動壓縮成手機適用的畫質（長邊 1280 px，約 1 分鐘 11 MB 以內）。</span>
      <button type="button" className={styles.btnPrimary} onClick={upload} disabled={disabled || busy}><Upload size={16} />{needsTrim ? `上傳並截取這 ${max} 秒` : '上傳'}</button>
    </div>}
    {stage === 'uploading' && <Progress value={progress} label={`上傳中 ${Math.round(progress * 100)}%`} />}
    {stage === 'processing' && <Progress value={1} label="截取、壓縮中，約需 30 秒到 2 分鐘，請不要關閉視窗…" />}
    {stage === 'done' && <p className={page.ok}>已上傳並處理完成。</p>}
    {error && <p className={styles.errorMsg} role="alert">{error}</p>}
  </div>
}

/**
 * Pick an image and crop it to the 4:1 banner the app shows. The crop runs
 * in the browser; the result (at most 1200×300 JPEG) is uploaded.
 */
export function BannerCrop({ market, onDone, disabled }) {
  const input = useRef(null)
  const frame = useRef(null)
  const drag = useRef(null)
  const [file, setFile] = useState(null)
  const url = useObjectUrl(file)
  const [image, setImage] = useState(null)
  const [crop, setCrop] = useState(null)
  const [stage, setStage] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const busy = stage === 'uploading' || stage === 'processing'

  function pick(event) {
    const picked = event.target.files?.[0]
    event.target.value = ''
    if (!picked) return
    setError(''); setImage(null); setCrop(null); setStage('idle')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(fileType(picked))) { setError('請選 JPG、PNG 或 WebP 圖片'); return }
    setFile(picked)
  }

  useEffect(() => {
    if (!url) return
    const img = new Image()
    img.onload = () => {
      const maxWidth = Math.min(img.naturalWidth, img.naturalHeight * BANNER_RATIO)
      if (maxWidth < BANNER_MIN_WIDTH) {
        setError(`圖片太小：裁成 4:1 後寬度只有 ${Math.floor(maxWidth)} px，至少要 ${BANNER_MIN_WIDTH} px`)
        return
      }
      setImage(img)
      setCrop({ x: (img.naturalWidth - maxWidth) / 2, y: (img.naturalHeight - maxWidth / BANNER_RATIO) / 2, w: maxWidth })
    }
    img.onerror = () => setError('讀不出這張圖片')
    img.src = url
  }, [url])

  const maxWidth = image ? Math.min(image.naturalWidth, image.naturalHeight * BANNER_RATIO) : 0
  const clamp = next => ({
    w: next.w,
    x: Math.min(Math.max(0, next.x), image.naturalWidth - next.w),
    y: Math.min(Math.max(0, next.y), image.naturalHeight - next.w / BANNER_RATIO),
  })

  function zoom(width) {
    setCrop(current => {
      const cx = current.x + current.w / 2
      const cy = current.y + current.w / BANNER_RATIO / 2
      return clamp({ w: width, x: cx - width / 2, y: cy - width / BANNER_RATIO / 2 })
    })
  }

  function onPointerDown(event) {
    if (busy) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { px: event.clientX, py: event.clientY, crop }
  }
  function onPointerMove(event) {
    if (!drag.current || !frame.current) return
    const scale = image.naturalWidth / frame.current.clientWidth
    const { px, py, crop: from } = drag.current
    setCrop(clamp({ w: from.w, x: from.x + (event.clientX - px) * scale, y: from.y + (event.clientY - py) * scale }))
  }
  function onPointerUp() { drag.current = null }

  async function exportCrop() {
    const width = Math.round(Math.min(BANNER_OUT_WIDTH, crop.w))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = Math.round(width / BANNER_RATIO)
    const context = canvas.getContext('2d')
    // JPEG has no transparency: put transparent artwork on white.
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, crop.x, crop.y, crop.w, crop.w / BANNER_RATIO, 0, 0, canvas.width, canvas.height)
    for (const quality of [0.9, 0.8, 0.7, 0.6]) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality))
      if (blob && blob.size <= MAX_BANNER_BYTES) return new File([blob], 'banner.jpg', { type: 'image/jpeg' })
    }
    throw new Error('圖片壓不到 2 MB 以下，請換一張')
  }

  async function upload() {
    setError(''); setStage('uploading'); setProgress(0)
    try {
      const cropped = await exportCrop()
      const object = await uploadToStorage(market, 'image', cropped, setProgress)
      setStage('processing')
      const result = await api(market, '/media/image', jsonBody('POST', { object }))
      setStage('done')
      onDone(result)
    } catch (e) { setStage('idle'); setError(e.message) }
  }

  const box = crop && image ? {
    left: `${(crop.x / image.naturalWidth) * 100}%`,
    top: `${(crop.y / image.naturalHeight) * 100}%`,
    width: `${(crop.w / image.naturalWidth) * 100}%`,
    height: `${(crop.w / BANNER_RATIO / image.naturalHeight) * 100}%`,
  } : null

  return <div className={page.uploadBox}>
    <div className={page.uploadHead}>
      <button type="button" className={styles.smallButton} disabled={disabled || busy} onClick={() => input.current?.click()}><Crop size={14} />{file ? '換一張圖' : '選擇圖片檔'}</button>
      {image && <span className={page.muted}>{file.name} · {image.naturalWidth}×{image.naturalHeight}</span>}
    </div>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={pick} />

    {image && box && <>
      <p className={styles.hint}>拖動框框選要顯示的範圍；App 裡會以 4:1 橫幅顯示框內的畫面。</p>
      <div ref={frame} className={page.cropFrame}>
        <img src={url} alt="" draggable={false} />
        <div className={page.cropBox} style={box} onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerCancel={onPointerUp} role="slider" aria-label="裁切範圍" aria-valuetext={`${Math.round(crop.w)} px 寬`} />
      </div>
      <label className={page.zoomRow}>縮放
        <input className={page.range} type="range" min={Math.min(BANNER_MIN_WIDTH, maxWidth)} max={maxWidth} step={1} value={crop.w}
          disabled={busy} onChange={e => zoom(Number(e.target.value))} />
        <span className={page.muted}>輸出 {Math.round(Math.min(BANNER_OUT_WIDTH, crop.w))}×{Math.round(Math.min(BANNER_OUT_WIDTH, crop.w) / BANNER_RATIO)}</span>
      </label>
      {stage !== 'done' && <div className={page.trimRow}>
        <span className={page.muted}>預覽（App 裡的樣子）</span>
        <button type="button" className={styles.btnPrimary} onClick={upload} disabled={disabled || busy}><Upload size={16} />裁切並上傳</button>
      </div>}
      <div className={page.bannerPreview}>
        <div className={page.cropPreview} style={{
          backgroundImage: `url(${url})`,
          backgroundSize: `${(image.naturalWidth / crop.w) * 100}% auto`,
          backgroundPosition: `${maxOffset(crop.x, image.naturalWidth - crop.w)}% ${maxOffset(crop.y, image.naturalHeight - crop.w / BANNER_RATIO)}%`,
        }} />
      </div>
    </>}
    {stage === 'uploading' && <Progress value={progress} label={`上傳中 ${Math.round(progress * 100)}%`} />}
    {stage === 'processing' && <Progress value={1} label="檢查圖片中…" />}
    {stage === 'done' && <p className={page.ok}>已上傳。</p>}
    {error && <p className={styles.errorMsg} role="alert">{error}</p>}
  </div>
}

// background-position percentage that shows the area starting at `offset`.
const maxOffset = (offset, room) => (room > 0 ? (offset / room) * 100 : 0)
