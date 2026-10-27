'use client'

import { useState, useCallback, useEffect } from 'react'
import styles from './admin.module.css'
import { adminFetch as fetch } from './AdminWorkspace'

// MUI Icons
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LocalDrinkOutlinedIcon from '@mui/icons-material/LocalDrinkOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'

// ─── 通知類型選項 ────────────────────────────────────────────────────────────
const NOTIFICATION_TYPES = [
  { value: 'system',    label: '系統公告',  desc: '平台維護、重要更新',   Icon: InfoOutlinedIcon },
  { value: 'challenge', label: '每日挑戰',  desc: '任務提醒、挑戰開啟',   Icon: BoltOutlinedIcon },
  { value: 'reward',    label: '獎勵通知',  desc: '獎勵發放、積分入帳',   Icon: CardGiftcardOutlinedIcon },
  { value: 'social',    label: '社群動態',  desc: '好友互動、對戰邀請',   Icon: GroupOutlinedIcon },
]

const INIT_BROADCAST = { title: '', content: '', notification_type: 'system', save_to_db: true, with_potions: false, potion_count: 1 }
const INIT_EMAIL     = {
  emails: '', title: '', content: '', notification_type: 'system', save_to_db: true,
  reward: 'none', potion_count: 1, pro_days: 365, pro_program: 'low_income', pro_note: '',
}

// ─── 獎勵（僅中文版後端）─────────────────────────────────────────────────────
// Limits mirror backend/app/routers/admin_grants.py.
const MAX_POTIONS_PER_GRANT = 20
const MAX_POTIONS_PER_BROADCAST = 5
const MAX_PRO_DAYS = 730

const REWARDS = [
  { value: 'none',    label: '只發通知',   desc: '不附加任何獎勵',         Icon: SendRoundedIcon },
  { value: 'potions', label: '體力恢復劑', desc: '直接加進用戶的背包',     Icon: LocalDrinkOutlinedIcon },
  { value: 'pro',     label: '開通 Pro',   desc: '不需綁 LINE、不需優惠碼', Icon: WorkspacePremiumOutlinedIcon },
]

const PRO_PROGRAMS = [
  { value: 'low_income', label: '清寒方案' },
  { value: 'gift',       label: '贈送' },
]

const POTION_SOURCES = {
  purchase: '購買', starter_quest: '新手任務', achievement: '成就', invite: '邀請好友',
  test_code: '測試碼', admin_grant: '後台發放', admin_broadcast: '全體贈送', use: '使用',
}

// A fresh id per broadcast form: the backend pays each user once per id, so a
// double click or a retried request cannot send potions twice.
const newCampaignId = () => `bc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`

// The backend sends naive UTC datetimes; without the Z they would parse as local time.
const formatDate = value => value
  ? new Date(/(Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value}Z`).toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' })
  : '—'

// ─── 語言版本選項 ──────────────────────────────────────────────────────────────
const LANGS = [
  { value: 'zh', label: '中文版' },
  { value: 'en', label: '英文版' },
]

// ─── 語言版本切換器 ────────────────────────────────────────────────────────────
function LangTabs({ value, onChange }) {
  return (
    <div className={styles.langTabs}>
      {LANGS.map(({ value: v, label }) => (
        <button
          key={v}
          type="button"
          className={`${styles.langTab} ${value === v ? styles.langTabActive : ''}`}
          onClick={() => onChange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── 公佈欄管理 ───────────────────────────────────────────────────────────────
const ANN_BASE = '/api/admin/announcements'

const ANN_TYPES = [
  { value: 'info',        label: '資訊', color: '#18738e', bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.25)' },
  { value: 'warning',     label: '警告', color: '#906418', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  { value: 'update',      label: '更新', color: '#258555', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)' },
  { value: 'maintenance', label: '維護', color: '#8050a8', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.25)' },
]

const ANN_INIT = {
  title: '', content: '', image_url: '', type: 'info',
  is_active: true, force_update: false,
  expires_at: '', min_app_version: '', update_url: '',
}

// ─── Toggle 開關 ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleInfo}>
        <span className={styles.toggleLabel}>{label}</span>
        {desc && <span className={styles.toggleDesc}>{desc}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  )
}

// ─── 通知類型選擇器 ───────────────────────────────────────────────────────────
function TypeSelector({ value, onChange }) {
  return (
    <div className={styles.typeGrid}>
      {NOTIFICATION_TYPES.map(({ value: v, label, desc, Icon }) => (
        <button
          key={v}
          type="button"
          className={`${styles.typeOption} ${value === v ? styles.typeSelected : ''}`}
          onClick={() => onChange(v)}
        >
          <Icon className={styles.typeIcon} fontSize="small" />
          <span className={styles.typeLabel}>{label}</span>
          <span className={styles.typeDesc}>{desc}</span>
        </button>
      ))}
    </div>
  )
}

// ─── 字數計數器 ───────────────────────────────────────────────────────────────
function CharCount({ value, max }) {
  const over = value.length > max
  return (
    <span className={`${styles.charCount} ${over ? styles.charOver : ''}`}>
      {value.length}/{max}
    </span>
  )
}

// ─── 推播預覽 ─────────────────────────────────────────────────────────────────
function PushPreview({ title, content, lang = 'zh' }) {
  if (!title && !content) return null
  return (
    <div className={styles.preview}>
      <div className={styles.previewLabelRow}>
        <SmartphoneOutlinedIcon style={{ fontSize: 14, opacity: 0.45 }} />
        <span className={styles.previewLabel}>推播預覽</span>
      </div>
      <div className={styles.previewCard}>
        <div className={styles.previewAppRow}>
          <span className={styles.previewAppDot} />
          <span className={styles.previewAppName}>{lang === 'en' ? 'Dogtor' : 'Dogtor 逗課'}</span>
          <span className={styles.previewTime}>{lang === 'en' ? 'now' : '剛剛'}</span>
        </div>
        <p className={styles.previewTitle}>{title || '（未填標題）'}</p>
        <p className={styles.previewContent}>{content || '（未填內容）'}</p>
      </div>
    </div>
  )
}

// ─── 確認彈窗 ─────────────────────────────────────────────────────────────────
function ConfirmModal({ title, onConfirm, onCancel, loading }) {
  const handleSubmit = (e) => { e.preventDefault(); onConfirm() }

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="通知操作確認" onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onCancel} type="button">
          <CloseRoundedIcon fontSize="small" />
        </button>
        <div className={styles.modalIconWrap}>
          <LockOutlinedIcon className={styles.modalIconSvg} />
        </div>
        <h3 className={styles.modalTitle}>確認發送</h3>
        <p className={styles.modalDesc}>
          即將執行：<strong>{title}</strong><br />
          請確認通知內容與收件對象，送出後無法收回。
        </p>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onCancel} disabled={loading}>
              取消
            </button>
            <button type="submit" className={styles.btnDanger} disabled={loading}>
              {loading
                ? <><span className={styles.spinner} />發送中…</>
                : <><SendRoundedIcon style={{ fontSize: 16 }} />確認發送</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── 結果彈窗 ─────────────────────────────────────────────────────────────────
function ResultModal({ result, onClose }) {
  if (!result) return null
  const ok = result.success

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="通知操作確認" onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose} type="button">
          <CloseRoundedIcon fontSize="small" />
        </button>
        <div className={`${styles.modalIconWrap} ${ok ? styles.iconSuccess : styles.iconError}`}>
          {ok
            ? <CheckCircleOutlineRoundedIcon className={styles.modalIconSvg} />
            : <ErrorOutlineRoundedIcon className={styles.modalIconSvg} />}
        </div>
        <h3 className={styles.modalTitle}>{ok ? '發送成功' : '發送失敗'}</h3>
        <p className={styles.modalDesc}>{result.message}</p>

        {ok && result.data && (
          <div className={styles.statsGrid}>
            {[
              { key: 'credited_users',   label: '獲得恢復劑', type: 'success' },
              { key: 'total_tokens',     label: '目標裝置' },
              { key: 'success_count',    label: '成功送達',  type: 'success' },
              { key: 'failure_count',    label: '發送失敗',  type: 'warn', hideZero: false },
              { key: 'db_saved_count',   label: 'DB 寫入' },
            ].map(({ key, label, type }) =>
              result.data[key] !== undefined ? (
                <div key={key} className={`${styles.statCard} ${type ? styles[`stat_${type}`] : ''}`}>
                  <span className={styles.statNum}>{result.data[key]}</span>
                  <span className={styles.statLabel}>{label}</span>
                </div>
              ) : null
            )}
            {result.data.found_emails !== undefined && (
              <div className={`${styles.statCard} ${styles.stat_success}`}>
                <span className={styles.statNum}>{result.data.found_emails.length}</span>
                <span className={styles.statLabel}>找到用戶</span>
              </div>
            )}
            {result.data.not_found_emails?.length > 0 && (
              <div className={`${styles.statCard} ${styles.stat_warn}`}>
                <span className={styles.statNum}>{result.data.not_found_emails.length}</span>
                <span className={styles.statLabel}>找不到用戶</span>
              </div>
            )}
            {result.data.no_token_emails?.length > 0 && (
              <div className={`${styles.statCard} ${styles.stat_warn}`}>
                <span className={styles.statNum}>{result.data.no_token_emails.length}</span>
                <span className={styles.statLabel}>無推播 Token</span>
              </div>
            )}
          </div>
        )}
        <button className={styles.btnPrimary} onClick={onClose} style={{ marginTop: '1.5rem', width: '100%' }}>
          關閉
        </button>
      </div>
    </div>
  )
}

// ─── 功能卡片 ───────────────────────────────────────────────────────────
function ModuleCard({ icon: Icon, title, sub, badge, children }) {
  const open = true

  return (
    <section className={`${styles.moduleCard} ${open ? styles.moduleOpen : ''}`}>
      <div className={styles.moduleHeader}>
        <div className={styles.moduleTitleRow}>
          <div className={styles.moduleIconWrap}>
            <Icon className={styles.moduleIconSvg} />
          </div>
          <div>
            <h2 className={styles.moduleTitle}>{title}</h2>
            <p className={styles.moduleSub}>{sub}</p>
          </div>
        </div>
        <div className={styles.moduleRight}>
          <span className={styles.moduleBadge}>{badge}</span>
        </div>
      </div>

      <div className={`${styles.moduleBody} ${open ? styles.moduleBodyOpen : ''}`}>
        <div className={styles.divider} />
        <div className={styles.moduleBodyInner}>
          {children}
        </div>
      </div>
    </section>
  )
}

// ─── 公告類型標籤 ─────────────────────────────────────────────────────────────
function AnnTypeBadge({ type, small }) {
  const cfg = ANN_TYPES.find(t => t.value === type) ?? ANN_TYPES[0]
  return (
    <span
      className={`${styles.annTypeBadge}${small ? ' ' + styles.annTypeBadgeSm : ''}`}
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  )
}

// ─── 公告卡片（用戶視角預覽）─────────────────────────────────────────────────
function AnnCard({ ann }) {
  const cfg = ANN_TYPES.find(t => t.value === ann.type) ?? ANN_TYPES[0]
  return (
    <div className={styles.annCard} style={{ borderLeftColor: cfg.color }}>
      <div className={styles.annCardHeader}>
        <AnnTypeBadge type={ann.type} small />
        <span className={styles.annCardTime}>
          {ann.created_at ? new Date(ann.created_at).toLocaleDateString('zh-TW') : ''}
        </span>
      </div>
      <p className={styles.annCardTitle}>{ann.title}</p>
      {ann.image_url && <img className={styles.annCardImage} src={ann.image_url} alt="" />}
      {ann.content && <p className={styles.annCardContent}>{ann.content}</p>}
    </div>
  )
}

// ─── 公告表單（新增 / 編輯）─────────────────────────────────────────────────
function AnnForm({ initial, onSave, onCancel, loading, isEdit }) {
  const [form, setForm] = useState({ ...ANN_INIT, ...initial })
  const originalExpiresAt = initial?.expires_at ?? ''
  const originalImageUrl  = initial?.image_url ?? ''
  const [imageBroken, setImageBroken] = useState(false)
  const upd   = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const imageUrl   = form.image_url.trim()
  const imageValid = !imageUrl || /^https:\/\/\S+$/i.test(imageUrl)
  const valid = form.title.trim() && form.content.trim() && imageValid

  const handleSave = () => {
    const body = { ...form }
    if (isEdit) {
      body.expires_at = body.expires_at || (originalExpiresAt ? 'null' : undefined)
      if (body.expires_at === undefined) delete body.expires_at
    } else {
      if (!body.expires_at) delete body.expires_at
    }
    if (!body.min_app_version) delete body.min_app_version
    if (!body.update_url) delete body.update_url
    // The backend treats "" as "remove the image", so only send it when an
    // existing image is being cleared.
    body.image_url = imageUrl
    if (!imageUrl && !(isEdit && originalImageUrl)) delete body.image_url
    onSave(body)
  }

  return (
    <div className={styles.annForm}>
      {/* 公告類型 */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>公告類型</label>
        <div className={styles.annTypeGrid}>
          {ANN_TYPES.map(t => (
            <button
              key={t.value} type="button"
              className={`${styles.annTypeBtn}${form.type === t.value ? ' ' + styles.annTypeBtnActive : ''}`}
              style={form.type === t.value ? { borderColor: t.color, background: t.bg, color: t.color } : {}}
              onClick={() => upd('type', t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 標題 */}
      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label}>標題 <span className={styles.required}>*</span></label>
          <CharCount value={form.title} max={100} />
        </div>
        <input
          type="text" className={styles.input} placeholder="公告標題"
          maxLength={100} value={form.title}
          onChange={e => upd('title', e.target.value)}
        />
      </div>

      {/* 內容 */}
      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label}>內容 <span className={styles.required}>*</span></label>
          <CharCount value={form.content} max={500} />
        </div>
        <textarea
          className={styles.textarea} placeholder="公告內容" rows={4}
          maxLength={500} value={form.content}
          onChange={e => upd('content', e.target.value)}
        />
      </div>

      {/* Image */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>圖片網址（選填）</label>
        <input
          type="url" className={styles.input}
          placeholder="例：https://storage.googleapis.com/.../poster.png"
          maxLength={1000} value={form.image_url}
          onChange={e => { upd('image_url', e.target.value); setImageBroken(false) }}
        />
        <p className={styles.hint}>
          {!imageValid
            ? '圖片網址必須以 https:// 開頭'
            : imageBroken
              ? '圖片載入失敗，App 會略過這張圖片，請確認網址是否公開'
              : '圖片會顯示在公告標題上方，點擊可放大；需 App 新版本才看得到'}
        </p>
        {imageValid && imageUrl && !imageBroken && (
          <img
            className={styles.annFormImagePreview} src={imageUrl} alt=""
            onError={() => setImageBroken(true)}
          />
        )}
      </div>

      {/* 啟用 / 強制更新 */}
      <div className={styles.annToggleRow}>
        <Toggle
          checked={form.is_active}
          onChange={v => upd('is_active', v)}
          label="啟用公告"
          desc="關閉後用戶不會看到此公告"
        />
        <Toggle
          checked={form.force_update}
          onChange={v => upd('force_update', v)}
          label="強制更新"
          desc="開啟後提示用戶必須更新 App"
        />
      </div>

      {/* 到期時間 */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>到期時間（選填）</label>
        <input
          type="datetime-local" className={styles.input}
          value={form.expires_at}
          onChange={e => upd('expires_at', e.target.value)}
        />
        <p className={styles.hint}>
          {isEdit ? '清空此欄位將清除到期設定（永不過期）' : '不填表示永不到期'}
        </p>
      </div>

      {/* 強制更新附加欄位 */}
      {form.force_update && (
        <>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>最低支援版本</label>
            <input
              type="text" className={styles.input} placeholder="例：1.0.2"
              value={form.min_app_version}
              onChange={e => upd('min_app_version', e.target.value)}
            />
            <p className={styles.hint}>低於此版本的 App 將顯示強制更新提示</p>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>商店更新連結</label>
            <input
              type="text" className={styles.input}
              placeholder="例：https://apps.apple.com/..."
              value={form.update_url}
              onChange={e => upd('update_url', e.target.value)}
            />
          </div>
        </>
      )}

      {/* 操作按鈕 */}
      <div className={styles.modalActions}>
        <button type="button" className={styles.btnSecondary} onClick={onCancel} disabled={loading}>
          取消
        </button>
        <button
          type="button" className={styles.btnPrimary}
          style={{ flex: 1 }} disabled={!valid || loading}
          onClick={handleSave}
        >
          {loading
            ? <><span className={styles.spinner} />{isEdit ? '儲存中…' : '新增中…'}</>
            : isEdit ? '儲存變更' : '新增公告'}
        </button>
      </div>
    </div>
  )
}

// ─── 公佈欄管理面板 ───────────────────────────────────────────────────────────
function AnnouncementsPanel({ lang, canManage }) {
  const [publicAnns, setPublicAnns]       = useState(null)
  const [publicLoading, setPublicLoading] = useState(false)
  const [adminAnns, setAdminAnns]         = useState(null)
  const [adminLoading, setAdminLoading]   = useState(false)
  const [formMode, setFormMode]           = useState(null)
  const [submitting, setSubmitting]       = useState(false)
  const [deleteId, setDeleteId]           = useState(null)
  const [annMsg, setAnnMsg]               = useState(null)

  const fetchPublicAnns = useCallback(async () => {
    setPublicLoading(true)
    try {
      const res  = await fetch(ANN_BASE, { headers: { 'X-App-Lang': lang } })
      const data = await res.json()
      if (!res.ok || !data.success) setAnnMsg({ ok: false, text: data.message || '公告預覽載入失敗' })
      setPublicAnns(data.success ? (data.data?.announcements ?? []) : [])
    } catch {
      setAnnMsg({ ok: false, text: '公告預覽連線失敗，請稍後再試' })
      setPublicAnns([])
    } finally {
      setPublicLoading(false)
    }
  }, [lang])

  const fetchAdminAnns = useCallback(async () => {
    setAdminLoading(true)
    try {
      const res  = await fetch(`${ANN_BASE}/admin/all`, {
        headers: { 'X-App-Lang': lang },
      })
      const data = await res.json()
      if (data.success) {
        const list = data.data?.announcements ?? (Array.isArray(data.data) ? data.data : [])
        setAdminAnns(list)
        return true
      }
      setAnnMsg({ ok: false, text: data.message || '無法載入公告' })
      return false
    } catch {
      setAnnMsg({ ok: false, text: '連線失敗，請稍後再試' })
      return false
    } finally {
      setAdminLoading(false)
    }
  }, [lang])

  // 語言版本切換時，重新載入該版本的公告
  useEffect(() => {
    fetchPublicAnns()
    fetchAdminAnns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const handleSave = async (processedBody) => {
    setSubmitting(true)
    setAnnMsg(null)
    const isEdit = formMode?.mode === 'edit'
    const id     = formMode?.id
    try {
      const url = isEdit
        ? `${ANN_BASE}/${id}`
        : ANN_BASE
      const res  = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'X-App-Lang': lang },
        body: JSON.stringify(processedBody),
      })
      const data = await res.json()
      if (data.success) {
        setAnnMsg({ ok: true, text: isEdit ? '公告已更新！' : '公告已新增！' })
        setFormMode(null)
        fetchAdminAnns()
        fetchPublicAnns()
      } else {
        setAnnMsg({ ok: false, text: data.message || '操作失敗' })
      }
    } catch (err) {
      setAnnMsg({ ok: false, text: `連線失敗: ${err.message}` })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (ann) => {
    setAdminLoading(true)
    setAnnMsg(null)
    try {
      const res = await fetch(`${ANN_BASE}/${ann.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-App-Lang': lang },
        body: JSON.stringify({ is_active: !ann.is_active }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setAnnMsg({ ok: false, text: data.message || '公告狀態更新失敗' })
        return
      }
      await Promise.all([fetchAdminAnns(), fetchPublicAnns()])
    } catch {
      setAnnMsg({ ok: false, text: '連線失敗，公告狀態尚未更新' })
    } finally { setAdminLoading(false) }
  }

  const handleDelete = async (id) => {
    setAdminLoading(true)
    try {
      const res  = await fetch(`${ANN_BASE}/${id}`, {
        method: 'DELETE',
        headers: { 'X-App-Lang': lang },
      })
      const data = await res.json()
      if (data.success) {
        setAnnMsg({ ok: true, text: '公告已刪除' })
        setDeleteId(null)
        fetchAdminAnns()
        fetchPublicAnns()
      } else {
        setAnnMsg({ ok: false, text: data.message || '刪除失敗' })
      }
    } catch (err) {
      setAnnMsg({ ok: false, text: `連線失敗: ${err.message}` })
    } finally {
      setAdminLoading(false)
    }
  }

  const langLabel = LANGS.find(l => l.value === lang)?.label ?? lang

  return (
    <div className={styles.annPanel}>

      {/* ── 用戶視角 ── */}
      <div className={styles.annSection}>
        <div className={styles.annSectionHeader}>
          <span className={styles.annSectionLabel}>
            用戶看到的公告 <span className={styles.annLangHint}>（{langLabel}）</span>
          </span>
          <button
            type="button" className={styles.annRefreshBtn}
            onClick={fetchPublicAnns} disabled={publicLoading}
          >
            <RefreshRoundedIcon
              style={{ fontSize: 15 }}
              className={publicLoading ? styles.spinning : ''}
            />
            重新載入
          </button>
        </div>

        {publicLoading && !publicAnns ? (
          <div className={styles.annLoading}><span className={styles.spinner} />載入中…</div>
        ) : publicAnns?.length === 0 ? (
          <div className={styles.annEmpty}>目前沒有啟用中的公告</div>
        ) : (
          <div className={styles.annPublicList}>
            {publicAnns?.map(ann => <AnnCard key={ann.id} ann={ann} />)}
          </div>
        )}
      </div>

      <div className={styles.annDivider} />

      {/* ── 管理員工具 ── */}
      <div className={styles.annSection}>
        <div className={styles.annSectionHeader}>
          <span className={styles.annSectionLabel}>管理員工具</span>
        </div>
        {!canManage && annMsg && <p role="status" className={styles.hint}>{annMsg.text}</p>}
        {!canManage && <p className={styles.hint}>你目前擁有公告檢視權限。</p>}
        {canManage ? (
          <>
            {/* 操作結果提示 */}
            {annMsg && (
              <div className={`${styles.annMsg} ${annMsg.ok ? styles.annMsgOk : styles.annMsgErr}`}>
                {annMsg.ok
                  ? <CheckCircleOutlineRoundedIcon style={{ fontSize: 15 }} />
                  : <ErrorOutlineRoundedIcon style={{ fontSize: 15 }} />}
                <span>{annMsg.text}</span>
                <button type="button" className={styles.annMsgClose} onClick={() => setAnnMsg(null)}>
                  <CloseRoundedIcon style={{ fontSize: 13 }} />
                </button>
              </div>
            )}

            {/* 新增按鈕 / 新增表單 */}
            {formMode?.mode === 'new' ? (
              <div className={styles.annFormWrap}>
                <p className={styles.annFormTitle}>新增公告</p>
                <AnnForm
                  onSave={handleSave}
                  onCancel={() => setFormMode(null)}
                  loading={submitting}
                  isEdit={false}
                />
              </div>
            ) : (
              <button
                type="button" className={styles.annAddBtn}
                onClick={() => { setFormMode({ mode: 'new' }); setAnnMsg(null); setDeleteId(null) }}
              >
                <AddRoundedIcon style={{ fontSize: 18 }} />新增公告
              </button>
            )}

            {/* 所有公告列表 */}
            {adminLoading && !adminAnns ? (
              <div className={styles.annLoading}><span className={styles.spinner} />載入中…</div>
            ) : adminAnns?.length === 0 ? (
              <div className={styles.annEmpty}>資料庫中沒有任何公告</div>
            ) : (
              <div className={styles.adminAnnList}>
                {adminAnns?.map(ann => (
                  <div
                    key={ann.id}
                    className={`${styles.adminAnnRow}${!ann.is_active ? ' ' + styles.adminAnnRowDimmed : ''}`}
                  >
                    {formMode?.mode === 'edit' && formMode.id === ann.id ? (
                      /* 編輯表單 */
                      <div className={styles.annFormWrap} style={{ margin: 0, border: 'none', borderRadius: 0 }}>
                        <p className={styles.annFormTitle}>編輯公告 #{ann.id}</p>
                        <AnnForm
                          initial={{
                            title: ann.title, content: ann.content, type: ann.type,
                            image_url: ann.image_url || '',
                            is_active: ann.is_active, force_update: ann.force_update,
                            expires_at: ann.expires_at ? ann.expires_at.slice(0, 16) : '',
                            min_app_version: ann.min_app_version || '',
                            update_url: ann.update_url || '',
                          }}
                          onSave={handleSave}
                          onCancel={() => setFormMode(null)}
                          loading={submitting}
                          isEdit
                        />
                      </div>
                    ) : deleteId === ann.id ? (
                      /* 刪除確認 */
                      <div className={styles.deleteConfirm}>
                        <p className={styles.deleteConfirmText}>
                          確定刪除「{ann.title}」？此操作無法還原。
                        </p>
                        <div className={styles.modalActions}>
                          <button
                            type="button" className={styles.btnSecondary}
                            onClick={() => setDeleteId(null)} disabled={adminLoading}
                          >
                            取消
                          </button>
                          <button
                            type="button" className={styles.btnDanger}
                            onClick={() => handleDelete(ann.id)} disabled={adminLoading}
                          >
                            {adminLoading
                              ? <><span className={styles.spinner} />刪除中…</>
                              : '確認刪除'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* 一般列表行 */
                      <div className={styles.adminAnnRowInner}>
                        <AnnTypeBadge type={ann.type} small />
                        <div className={styles.adminAnnInfo}>
                          <span className={styles.adminAnnTitle}>{ann.title}</span>
                          <span className={styles.adminAnnMeta}>
                            #{ann.id}
                            {ann.expires_at
                              ? ` · 到期：${new Date(ann.expires_at).toLocaleDateString('zh-TW')}`
                              : ' · 永不到期'}
                            {ann.force_update && ' · 強制更新'}
                          </span>
                        </div>
                        <div className={styles.adminAnnRowRight}>
                          <button
                            type="button"
                            className={`${styles.annStatusBtn} ${ann.is_active ? styles.annStatusActive : styles.annStatusInactive}`}
                            onClick={() => handleToggleActive(ann)}
                            disabled={adminLoading}
                            title={ann.is_active ? '點擊停用' : '點擊啟用'}
                          >
                            {ann.is_active ? '啟用' : '停用'}
                          </button>
                          <button
                            type="button" className={styles.annIconBtn}
                            onClick={() => { setFormMode({ mode: 'edit', id: ann.id }); setAnnMsg(null); setDeleteId(null) }}
                            title="編輯"
                          >
                            <EditOutlinedIcon style={{ fontSize: 16 }} />
                          </button>
                          <button
                            type="button"
                            className={`${styles.annIconBtn} ${styles.annIconBtnDanger}`}
                            onClick={() => { setDeleteId(ann.id); setFormMode(null) }}
                            title="刪除"
                          >
                            <DeleteOutlineIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={styles.annPublicList}>
            {adminAnns?.map(ann => <AnnCard key={ann.id} ann={ann} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 獎勵發放紀錄 ─────────────────────────────────────────────────────────────
function GrantsPanel({ canManage, refreshKey }) {
  const [summary, setSummary] = useState(null)
  const [grants, setGrants]   = useState([])
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [revoking, setRevoking] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [s, g] = await Promise.all([
        fetch('/api/admin/grants/potions/summary?days=30').then(r => r.json()),
        fetch('/api/admin/grants/pro').then(r => r.json()),
      ])
      if (!s.success || !g.success) throw new Error(s.message || g.message || '讀取失敗')
      setSummary(s.data); setGrants(g.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load, refreshKey])

  async function revoke(email) {
    if (!window.confirm(`確定要取消 ${email} 的 Pro 授權嗎？若沒有其他付費來源，對方會立刻變回免費版。`)) return
    setRevoking(email)
    try {
      const data = await fetch('/api/admin/grants/pro/revoke', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      }).then(r => r.json())
      if (!data.success) throw new Error(data.message)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setRevoking('')
    }
  }

  return (
    <ModuleCard icon={HistoryOutlinedIcon} title="獎勵發放紀錄" sub="近 30 天體力恢復劑進出，以及目前有效的 Pro 授權" badge="中文版">
      <div className={styles.form}>
        <div className={styles.labelRow}>
          <span className={styles.label}>體力恢復劑（近 30 天）</span>
          <button type="button" className={styles.smallButton} onClick={load} disabled={loading}>
            <RefreshRoundedIcon style={{ fontSize: 16 }} />重新整理
          </button>
        </div>
        {error && <p role="alert" className={styles.loginError}>{error}</p>}
        {summary && <>
          <div className={styles.statsGrid}>
            {[
              ['發出', summary.received, 'success'],
              ['使用', summary.used],
              ['目前持有', summary.held_now],
              ['持有人數', summary.holders],
            ].map(([label, value, type]) => (
              <div key={label} className={`${styles.statCard} ${type ? styles[`stat_${type}`] : ''}`}>
                <span className={styles.statNum}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
          {summary.by_source.length > 0 && (
            <div className={styles.tableScroll}>
              <table className={styles.dataTable}>
                <thead><tr><th>來源</th><th>數量</th><th>次數</th><th>人數</th></tr></thead>
                <tbody>{summary.by_source.map(row => (
                  <tr key={row.source}>
                    <td>{POTION_SOURCES[row.source] || row.source}</td>
                    <td>{row.potions}</td><td>{row.events}</td><td>{row.users}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          <p className={styles.hint}>紀錄從這次上線開始累積，「目前持有」包含上線前就有的恢復劑。</p>
        </>}

        <span className={styles.label}>有效的 Pro 授權（{grants.length}）</span>
        {grants.length === 0
          ? <p className={styles.hint}>目前沒有後台開通的 Pro。</p>
          : <div className={styles.tableScroll}>
              <table className={styles.dataTable}>
                <thead><tr><th>用戶</th><th>方案</th><th>到期日</th><th>發放者</th>{canManage && <th />}</tr></thead>
                <tbody>{grants.map(grant => (
                  <tr key={grant.id}>
                    <td>{grant.name ? `${grant.name}・` : ''}{grant.email}{grant.note ? <><br /><small>{grant.note}</small></> : null}</td>
                    <td>{PRO_PROGRAMS.find(p => p.value === grant.program)?.label || grant.program}</td>
                    <td>{formatDate(grant.expires_at)}</td>
                    <td>{grant.granted_by_name || '—'}</td>
                    {canManage && <td>
                      <button type="button" className={styles.smallButton} disabled={revoking === grant.email} onClick={() => revoke(grant.email)}>
                        {revoking === grant.email ? '取消中…' : '取消授權'}
                      </button>
                    </td>}
                  </tr>
                ))}</tbody>
              </table>
            </div>}
      </div>
    </ModuleCard>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 主頁面
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminTools({ section, user }) {
  // ── 語言版本（中文版 / 英文版 App）────────────────────────────────────────
  const [lang, setLang] = useState('zh')
  const langLabel = LANGS.find(l => l.value === lang)?.label ?? lang

  // ── 廣播 ──────────────────────────────────────────────────────────────────
  const [broadcast, setBroadcast]           = useState(INIT_BROADCAST)
  const [broadcastConfirm, setBroadcastConfirm] = useState(false)
  const [broadcastLoading, setBroadcastLoading] = useState(false)
  const [broadcastResult, setBroadcastResult]   = useState(null)

  // ── Email ─────────────────────────────────────────────────────────────────
  const [emailForm, setEmailForm]       = useState(INIT_EMAIL)
  const [emailConfirm, setEmailConfirm] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailResult, setEmailResult]   = useState(null)

  // ── 獎勵（體力恢復劑／Pro，僅中文版）───────────────────────────────────────
  const canPush      = user.permissions.includes('push.manage')
  const canGrant     = lang === 'zh' && user.permissions.includes('grants.manage')
  const canSeeGrants = lang === 'zh' && user.permissions.includes('grants.view')
  const [campaignId, setCampaignId]       = useState(newCampaignId)
  const [grantsRefresh, setGrantsRefresh] = useState(0)

  // ── 廣播發送 ──────────────────────────────────────────────────────────────
  const handleBroadcastSend = useCallback(async () => {
    setBroadcastLoading(true)
    try {
      const withPotions = canGrant && broadcast.with_potions
      const { with_potions, potion_count, ...notice } = broadcast
      const res  = withPotions
        ? await fetch('/api/admin/grants/potions/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...notice, count: potion_count, campaign_id: campaignId }),
          })
        : await fetch('/api/admin/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-App-Lang': lang },
            body: JSON.stringify(notice),
          })
      const data = await res.json()
      setBroadcastConfirm(false)
      setBroadcastResult(data)
      if (data.success) {
        setBroadcast(INIT_BROADCAST)
        setCampaignId(newCampaignId())
      }
    } catch (err) {
      setBroadcastConfirm(false)
      setBroadcastResult({ success: false, message: `連線失敗: ${err.message}` })
    } finally {
      setBroadcastLoading(false)
    }
  }, [broadcast, lang, canGrant, campaignId])

  // ── Email 發送 ────────────────────────────────────────────────────────────
  const handleEmailSend = useCallback(async () => {
    setEmailLoading(true)
    try {
      const emails = emailForm.emails
        .split(/[\n,]+/)
        .map(e => e.trim().toLowerCase())
        .filter(Boolean)
      const { reward, potion_count, pro_days, pro_program, pro_note, ...notice } = emailForm
      const grant = canGrant ? reward : 'none'
      const [url, body] = {
        none:    ['/api/admin/send-to-emails', { ...notice, emails }],
        potions: ['/api/admin/grants/potions', { ...notice, emails, count: potion_count }],
        pro:     ['/api/admin/grants/pro', { ...notice, emails, days: pro_days, program: pro_program, note: pro_note.trim() || null }],
      }[grant]
      const res  = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-App-Lang': lang },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setEmailConfirm(false)
      setEmailResult(data)
      if (data.success) {
        setEmailForm(INIT_EMAIL)
        if (grant !== 'none') setGrantsRefresh(n => n + 1)
      }
    } catch (err) {
      setEmailConfirm(false)
      setEmailResult({ success: false, message: `連線失敗: ${err.message}` })
    } finally {
      setEmailLoading(false)
    }
  }, [emailForm, lang, canGrant])

  // ── 管理區 ────────────────────────────────────────────────────────────────
  const emailCount   = emailForm.emails.split(/[\n,]+/).map(e => e.trim()).filter(Boolean).length
  const broadcastOk  = broadcast.title.trim() && broadcast.content.trim()
  const emailReward  = canGrant ? emailForm.reward : 'none'
  const hasTitle     = Boolean(emailForm.title.trim())
  const hasContent   = Boolean(emailForm.content.trim())
  // A grant may go out without a push, but a half-filled push is a mistake.
  const noticeOk     = emailReward === 'none' ? canPush && hasTitle && hasContent : hasTitle === hasContent
  const rewardOk     = emailReward === 'potions'
    ? emailForm.potion_count >= 1 && emailForm.potion_count <= MAX_POTIONS_PER_GRANT
    : emailReward === 'pro' ? emailForm.pro_days >= 1 && emailForm.pro_days <= MAX_PRO_DAYS : true
  const emailOk      = emailCount > 0 && noticeOk && rewardOk
  const emailAction  = {
    none:    `發送推播給 ${emailCount} 位${langLabel}用戶`,
    potions: `發給 ${emailCount} 位用戶各 ${emailForm.potion_count} 瓶體力恢復劑`,
    pro:     `為 ${emailCount} 位用戶開通 Pro ${emailForm.pro_days} 天（${PRO_PROGRAMS.find(p => p.value === emailForm.pro_program)?.label}）`,
  }[emailReward]

  return (
    <>
      <LangTabs value={lang} onChange={value => { setLang(value); setBroadcastResult(null); setEmailResult(null) }} />
      <p className={styles.langNotice}>目前操作對象：<strong>{langLabel} App</strong></p>
      <div className={styles.moduleGrid}>
              {/* 廣播通知 */}
              {section === 'push' && <ModuleCard
                icon={CampaignOutlinedIcon}
                title="系統廣播"
                sub="發送推播通知給所有已安裝 App 的用戶"
                badge="全體推播"
              >
                <form
                  onSubmit={e => { e.preventDefault(); if (broadcastOk) setBroadcastConfirm(true) }}
                  className={styles.form}
                ><fieldset className={styles.toolFields} disabled={!user.permissions.includes('push.manage')}>
                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <label className={styles.label} htmlFor="bc-title">
                        通知標題 <span className={styles.required}>*</span>
                      </label>
                      <CharCount value={broadcast.title} max={50} />
                    </div>
                    <input
                      id="bc-title"
                      type="text"
                      className={styles.input}
                      placeholder="例：系統維護公告"
                      maxLength={50}
                      value={broadcast.title}
                      onChange={e => setBroadcast(p => ({ ...p, title: e.target.value }))}
                    />
                    <p className={styles.hint}>這是用戶在鎖定畫面上最先看到的文字，建議簡短有力</p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <label className={styles.label} htmlFor="bc-content">
                        通知內容 <span className={styles.required}>*</span>
                      </label>
                      <CharCount value={broadcast.content} max={200} />
                    </div>
                    <textarea
                      id="bc-content"
                      className={styles.textarea}
                      placeholder="例：Dogtor 正在進行關卡維護，預計 30 分鐘後恢復。"
                      rows={4}
                      maxLength={200}
                      value={broadcast.content}
                      onChange={e => setBroadcast(p => ({ ...p, content: e.target.value }))}
                    />
                    <p className={styles.hint}>詳細說明通知內容，讓用戶了解此次通知的目的</p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>通知類型</label>
                    <TypeSelector
                      value={broadcast.notification_type}
                      onChange={v => setBroadcast(p => ({ ...p, notification_type: v }))}
                    />
                    <p className={styles.hint}>影響 App 內通知分類顯示與小圖示</p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <Toggle
                      checked={broadcast.save_to_db}
                      onChange={v => setBroadcast(p => ({ ...p, save_to_db: v }))}
                      label="寫入通知記錄"
                      desc="開啟後，每位用戶的 App 內通知中心都會看到這則訊息"
                    />
                  </div>

                  {canGrant && (
                    <div className={styles.fieldGroup}>
                      <Toggle
                        checked={broadcast.with_potions}
                        onChange={v => setBroadcast(p => ({ ...p, with_potions: v }))}
                        label="同時贈送體力恢復劑"
                        desc="發給資料庫裡的每一位用戶（包含沒開推播的人），同一次廣播重送也不會重複發"
                      />
                      {broadcast.with_potions && <>
                        <label className={styles.label} htmlFor="bc-potions">每人幾瓶</label>
                        <input
                          id="bc-potions"
                          type="number"
                          className={styles.input}
                          min={1}
                          max={MAX_POTIONS_PER_BROADCAST}
                          value={broadcast.potion_count}
                          onChange={e => setBroadcast(p => ({ ...p, potion_count: Number(e.target.value) }))}
                        />
                        <p className={styles.hint}>全體贈送每人最多 {MAX_POTIONS_PER_BROADCAST} 瓶</p>
                      </>}
                    </div>
                  )}

                  <PushPreview title={broadcast.title} content={broadcast.content} lang={lang} />

                  <button
                    type="submit"
                    className={`${styles.btnPrimary} ${styles.sendBtn}`}
                    disabled={!broadcastOk || broadcastLoading || (canGrant && broadcast.with_potions && !(broadcast.potion_count >= 1 && broadcast.potion_count <= MAX_POTIONS_PER_BROADCAST))}
                  >
                    <SendRoundedIcon style={{ fontSize: 18 }} />
                    {canGrant && broadcast.with_potions ? '發送廣播並贈送恢復劑' : '發送廣播給所有用戶'}
                  </button>
                </fieldset></form>
              </ModuleCard>}

              {/* 指定 Email 推播 */}
              {section === 'email' && <ModuleCard
                icon={AlternateEmailOutlinedIcon}
                title="指定用戶推播"
                sub="依 Email 發送推播給特定用戶"
                badge="精準投遞"
              >
                <form
                  onSubmit={e => { e.preventDefault(); if (emailOk) setEmailConfirm(true) }}
                  className={styles.form}
                ><fieldset className={styles.toolFields} disabled={!canPush && !canGrant}>
                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <label className={styles.label} htmlFor="em-emails">
                        目標用戶 Email <span className={styles.required}>*</span>
                      </label>
                      {emailCount > 0 && (
                        <span className={styles.emailCount}>{emailCount} 位</span>
                      )}
                    </div>
                    <textarea
                      id="em-emails"
                      className={styles.textarea}
                      placeholder={'每行一個 Email，或用逗號分隔\n例：alice@gmail.com\nbob@gmail.com'}
                      rows={5}
                      value={emailForm.emails}
                      onChange={e => setEmailForm(p => ({ ...p, emails: e.target.value }))}
                    />
                    <p className={styles.hint}>支援換行或逗號分隔，系統會自動去重並比對資料庫</p>
                  </div>

                  {canGrant && (
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>附加獎勵</label>
                      <div className={styles.typeGrid}>
                        {REWARDS.map(({ value, label, desc, Icon }) => (
                          <button
                            key={value}
                            type="button"
                            className={`${styles.typeOption} ${emailForm.reward === value ? styles.typeSelected : ''}`}
                            onClick={() => setEmailForm(p => ({ ...p, reward: value }))}
                          >
                            <Icon className={styles.typeIcon} fontSize="small" />
                            <span className={styles.typeLabel}>{label}</span>
                            <span className={styles.typeDesc}>{desc}</span>
                          </button>
                        ))}
                      </div>

                      {emailForm.reward === 'potions' && <>
                        <label className={styles.label} htmlFor="em-potions">每人幾瓶</label>
                        <input
                          id="em-potions"
                          type="number"
                          className={styles.input}
                          min={1}
                          max={MAX_POTIONS_PER_GRANT}
                          value={emailForm.potion_count}
                          onChange={e => setEmailForm(p => ({ ...p, potion_count: Number(e.target.value) }))}
                        />
                        <p className={styles.hint}>每人最多 {MAX_POTIONS_PER_GRANT} 瓶，送出後立即入帳</p>
                      </>}

                      {emailForm.reward === 'pro' && <>
                        <div className={styles.formColumns}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.label} htmlFor="em-program">方案</label>
                            <select
                              id="em-program"
                              className={styles.input}
                              value={emailForm.pro_program}
                              onChange={e => setEmailForm(p => ({ ...p, pro_program: e.target.value }))}
                            >
                              {PRO_PROGRAMS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                            </select>
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.label} htmlFor="em-days">天數</label>
                            <input
                              id="em-days"
                              type="number"
                              className={styles.input}
                              min={1}
                              max={MAX_PRO_DAYS}
                              value={emailForm.pro_days}
                              onChange={e => setEmailForm(p => ({ ...p, pro_days: Number(e.target.value) }))}
                            />
                          </div>
                        </div>
                        <label className={styles.label} htmlFor="em-note">備註（選填）</label>
                        <input
                          id="em-note"
                          type="text"
                          className={styles.input}
                          placeholder="例：學校推薦、申請編號"
                          maxLength={255}
                          value={emailForm.pro_note}
                          onChange={e => setEmailForm(p => ({ ...p, pro_note: e.target.value }))}
                        />
                        <p className={styles.hint}>到期會自動收回；已經有授權的人會延長，到期日取兩者中較晚的。付費訂閱到期也不會影響這份授權。</p>
                      </>}

                      {emailForm.reward !== 'none' && (
                        <p className={styles.hint}>通知標題與內容可以留空，只發獎勵不推播{canPush ? '' : '（你的帳號沒有推播權限，請留空）'}</p>
                      )}
                    </div>
                  )}

                  <fieldset className={styles.toolFields} disabled={!canPush}>

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <label className={styles.label} htmlFor="em-title">
                        通知標題 {emailReward === 'none' && <span className={styles.required}>*</span>}
                      </label>
                      <CharCount value={emailForm.title} max={50} />
                    </div>
                    <input
                      id="em-title"
                      type="text"
                      className={styles.input}
                      placeholder="例：限定活動邀請"
                      maxLength={50}
                      value={emailForm.title}
                      onChange={e => setEmailForm(p => ({ ...p, title: e.target.value }))}
                    />
                    <p className={styles.hint}>簡短標題，用戶在鎖定畫面即可看到</p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <label className={styles.label} htmlFor="em-content">
                        通知內容 {emailReward === 'none' && <span className={styles.required}>*</span>}
                      </label>
                      <CharCount value={emailForm.content} max={200} />
                    </div>
                    <textarea
                      id="em-content"
                      className={styles.textarea}
                      placeholder="例：您已被選入 Beta 測試計畫，請更新至最新版本！"
                      rows={4}
                      maxLength={200}
                      value={emailForm.content}
                      onChange={e => setEmailForm(p => ({ ...p, content: e.target.value }))}
                    />
                    <p className={styles.hint}>針對這批用戶說明通知的具體內容</p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>通知類型</label>
                    <TypeSelector
                      value={emailForm.notification_type}
                      onChange={v => setEmailForm(p => ({ ...p, notification_type: v }))}
                    />
                    <p className={styles.hint}>影響 App 內通知分類顯示與小圖示</p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <Toggle
                      checked={emailForm.save_to_db}
                      onChange={v => setEmailForm(p => ({ ...p, save_to_db: v }))}
                      label="寫入通知記錄"
                      desc="開啟後，指定用戶的 App 內通知中心都會看到這則訊息"
                    />
                  </div>

                  <PushPreview title={emailForm.title} content={emailForm.content} lang={lang} />
                  </fieldset>

                  {emailReward !== 'none' && hasTitle !== hasContent && (
                    <p className={styles.hint}>通知標題與內容要一起填，或一起留空</p>
                  )}

                  <button
                    type="submit"
                    className={`${styles.btnPrimary} ${styles.sendBtn}`}
                    disabled={!emailOk || emailLoading}
                  >
                    <SendRoundedIcon style={{ fontSize: 18 }} />
                    {{ none: '發送給指定用戶', potions: '發送體力恢復劑', pro: '開通 Pro' }[emailReward]}{emailCount > 0 ? `（${emailCount} 位）` : ''}
                  </button>
                </fieldset></form>
              </ModuleCard>}

              {section === 'email' && canSeeGrants && (
                <GrantsPanel canManage={canGrant} refreshKey={grantsRefresh} />
              )}

              {/* 公佈欄管理 */}
              {section === 'announcements' && <div>
                <ModuleCard
                  icon={AnnouncementOutlinedIcon}
                  title="公佈欄管理"
                  sub="管理 App 公告、發布狀態與版本更新提示"
                  badge="公告系統"
                >
                  <AnnouncementsPanel key={lang} lang={lang} canManage={user.permissions.includes('announcements.manage')} />
                </ModuleCard>
              </div>}
      </div>

      {broadcastConfirm && (
        <ConfirmModal
          title={`廣播「${broadcast.title}」給所有${langLabel}用戶${canGrant && broadcast.with_potions ? `，並每人送 ${broadcast.potion_count} 瓶體力恢復劑` : ''}`}
          onConfirm={handleBroadcastSend}
          onCancel={() => setBroadcastConfirm(false)}
          loading={broadcastLoading}
        />
      )}
      {emailConfirm && (
        <ConfirmModal
          title={hasTitle ? `${emailAction}，並推播「${emailForm.title}」` : `${emailAction}（不發推播）`}
          onConfirm={handleEmailSend}
          onCancel={() => setEmailConfirm(false)}
          loading={emailLoading}
        />
      )}
      {broadcastResult && (
        <ResultModal result={broadcastResult} onClose={() => setBroadcastResult(null)} />
      )}
      {emailResult && (
        <ResultModal result={emailResult} onClose={() => setEmailResult(null)} />
      )}

    </>
  )
}
