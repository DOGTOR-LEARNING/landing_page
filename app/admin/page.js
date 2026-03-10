'use client'

import { useState, useCallback, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './admin.module.css'

// MUI Icons
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
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
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined'

// ─── 通知類型選項 ────────────────────────────────────────────────────────────
const NOTIFICATION_TYPES = [
  { value: 'system',    label: '系統公告',  desc: '平台維護、重要更新',   Icon: InfoOutlinedIcon },
  { value: 'challenge', label: '每日挑戰',  desc: '任務提醒、挑戰開啟',   Icon: BoltOutlinedIcon },
  { value: 'reward',    label: '獎勵通知',  desc: '獎勵發放、積分入帳',   Icon: CardGiftcardOutlinedIcon },
  { value: 'social',    label: '社群動態',  desc: '好友互動、對戰邀請',   Icon: GroupOutlinedIcon },
]

const INIT_BROADCAST = { title: '', content: '', notification_type: 'system', save_to_db: true }
const INIT_EMAIL     = { emails: '', title: '', content: '', notification_type: 'system', save_to_db: true }

// ─── 公佈欄管理 ───────────────────────────────────────────────────────────────
const ANN_BASE = '/api/admin/announcements'

const ANN_TYPES = [
  { value: 'info',        label: '資訊', color: '#38BDF8', bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.25)' },
  { value: 'warning',     label: '警告', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  { value: 'update',      label: '更新', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)' },
  { value: 'maintenance', label: '維護', color: '#C084FC', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.25)' },
]

const ANN_INIT = {
  title: '', content: '', type: 'info',
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
function PushPreview({ title, content }) {
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
          <span className={styles.previewAppName}>Dogtor 逗課</span>
          <span className={styles.previewTime}>剛剛</span>
        </div>
        <p className={styles.previewTitle}>{title || '（未填標題）'}</p>
        <p className={styles.previewContent}>{content || '（未填內容）'}</p>
      </div>
    </div>
  )
}

// ─── 確認彈窗 ─────────────────────────────────────────────────────────────────
function ConfirmModal({ title, onConfirm, onCancel, loading }) {
  const [pw, setPw]   = useState('')
  const [err, setErr] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!pw.trim()) { setErr('請輸入通關密語'); return }
    setErr('')
    onConfirm(pw)
  }

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onCancel} type="button">
          <CloseRoundedIcon fontSize="small" />
        </button>
        <div className={styles.modalIconWrap}>
          <LockOutlinedIcon className={styles.modalIconSvg} />
        </div>
        <h3 className={styles.modalTitle}>確認發送</h3>
        <p className={styles.modalDesc}>
          即將執行：<strong>{title}</strong><br />
          請再次輸入通關密語確認身份
        </p>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <input
            type="password"
            className={`${styles.input} ${err ? styles.inputError : ''}`}
            placeholder="輸入通關密語"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr('') }}
            autoFocus
          />
          {err && <p className={styles.errorMsg}>{err}</p>}
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
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
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

// ─── 可折疊模組卡片 ───────────────────────────────────────────────────────────
function ModuleCard({ icon: Icon, title, sub, badge, children }) {
  const [open, setOpen] = useState(false)

  return (
    <section className={`${styles.moduleCard} ${open ? styles.moduleOpen : ''}`}>
      <button
        type="button"
        className={styles.moduleHeader}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
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
          <KeyboardArrowDownRoundedIcon
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          />
        </div>
      </button>

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
      {ann.content && <p className={styles.annCardContent}>{ann.content}</p>}
    </div>
  )
}

// ─── 公告表單（新增 / 編輯）─────────────────────────────────────────────────
function AnnForm({ initial, onSave, onCancel, loading, isEdit }) {
  const [form, setForm] = useState({ ...ANN_INIT, ...initial })
  const originalExpiresAt = initial?.expires_at ?? ''
  const upd   = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const valid = form.title.trim() && form.content.trim()

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
function AnnouncementsPanel() {
  const [publicAnns, setPublicAnns]       = useState(null)
  const [publicLoading, setPublicLoading] = useState(false)
  const [annKeyInput, setAnnKeyInput]     = useState('')
  const [annKey, setAnnKey]               = useState('')
  const [annKeyErr, setAnnKeyErr]         = useState('')
  const [adminAnns, setAdminAnns]         = useState(null)
  const [adminLoading, setAdminLoading]   = useState(false)
  const [formMode, setFormMode]           = useState(null)
  const [submitting, setSubmitting]       = useState(false)
  const [deleteId, setDeleteId]           = useState(null)
  const [annMsg, setAnnMsg]               = useState(null)

  const fetchPublicAnns = useCallback(async () => {
    setPublicLoading(true)
    try {
      const res  = await fetch(ANN_BASE)
      const data = await res.json()
      setPublicAnns(data.success ? (data.data?.announcements ?? []) : [])
    } catch {
      setPublicAnns([])
    } finally {
      setPublicLoading(false)
    }
  }, [])

  const fetchAdminAnns = useCallback(async (key) => {
    setAdminLoading(true)
    try {
      const res  = await fetch(`${ANN_BASE}/admin/all`, {
        headers: { 'X-Announcements-Key': key },
      })
      const data = await res.json()
      if (data.success) {
        const list = data.data?.announcements ?? (Array.isArray(data.data) ? data.data : [])
        setAdminAnns(list)
        return true
      }
      setAnnKeyErr(data.message || '權限密語錯誤，請重新輸入')
      return false
    } catch {
      setAnnKeyErr('連線失敗，請稍後再試')
      return false
    } finally {
      setAdminLoading(false)
    }
  }, [])

  useEffect(() => { fetchPublicAnns() }, [fetchPublicAnns])

  const handleKeySubmit = async (e) => {
    e.preventDefault()
    if (!annKeyInput.trim()) { setAnnKeyErr('請輸入公佈欄權限密語'); return }
    setAnnKeyErr('')
    const ok = await fetchAdminAnns(annKeyInput.trim())
    if (ok) setAnnKey(annKeyInput.trim())
  }

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
        headers: { 'Content-Type': 'application/json', 'X-Announcements-Key': annKey },
        body: JSON.stringify(processedBody),
      })
      const data = await res.json()
      if (data.success) {
        setAnnMsg({ ok: true, text: isEdit ? '公告已更新！' : '公告已新增！' })
        setFormMode(null)
        fetchAdminAnns(annKey)
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
    try {
      await fetch(`${ANN_BASE}/${ann.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Announcements-Key': annKey },
        body: JSON.stringify({ is_active: !ann.is_active }),
      })
      fetchAdminAnns(annKey)
      fetchPublicAnns()
    } catch {}
  }

  const handleDelete = async (id) => {
    setAdminLoading(true)
    try {
      const res  = await fetch(`${ANN_BASE}/${id}`, {
        method: 'DELETE',
        headers: { 'X-Announcements-Key': annKey },
      })
      const data = await res.json()
      if (data.success) {
        setAnnMsg({ ok: true, text: '公告已刪除' })
        setDeleteId(null)
        fetchAdminAnns(annKey)
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

  const clearKey = () => {
    setAnnKey(''); setAnnKeyInput(''); setAdminAnns(null)
    setFormMode(null); setDeleteId(null); setAnnMsg(null)
  }

  return (
    <div className={styles.annPanel}>

      {/* ── 用戶視角 ── */}
      <div className={styles.annSection}>
        <div className={styles.annSectionHeader}>
          <span className={styles.annSectionLabel}>用戶看到的公告</span>
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
          {annKey && (
            <div className={styles.annAdminHeaderRight}>
              <span className={styles.annKeyBadge}>
                <CheckCircleOutlineRoundedIcon style={{ fontSize: 13 }} />已驗證
              </span>
              <button type="button" className={styles.annClearKeyBtn} onClick={clearKey}>
                清除權限密語
              </button>
            </div>
          )}
        </div>

        {!annKey ? (
          /* ─ 權限密語輸入 ─ */
          <form onSubmit={handleKeySubmit} className={styles.annKeyForm}>
            <p className={styles.hint}>輸入 公佈欄權限密語 以解鎖新增、編輯、刪除功能</p>
            <div className={styles.fieldGroup}>
              <input
                type="password"
                className={`${styles.input}${annKeyErr ? ' ' + styles.inputError : ''}`}
                placeholder="X-Announcements-Key"
                value={annKeyInput}
                onChange={e => { setAnnKeyInput(e.target.value); setAnnKeyErr('') }}
                autoComplete="off"
              />
              {annKeyErr && <p className={styles.errorMsg}>{annKeyErr}</p>}
            </div>
            <button
              type="submit" className={styles.btnPrimary}
              disabled={adminLoading} style={{ width: '100%' }}
            >
              {adminLoading
                ? <><span className={styles.spinner} />驗證中…</>
                : <><VpnKeyOutlinedIcon style={{ fontSize: 16 }} />解鎖管理功能</>}
            </button>
          </form>
        ) : (
          /* ─ 管理面板 ─ */
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
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 主頁面
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminPage() {
  // ── 登入 ──────────────────────────────────────────────────────────────────
  const [authed, setAuthed]           = useState(false)
  const [loginPw, setLoginPw]         = useState('')
  const [loginErr, setLoginErr]       = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

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

  // ── 登入處理 ──────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginPw.trim()) { setLoginErr('請輸入通關密語'); return }
    setLoginLoading(true)
    setLoginErr('')
    try {
      const res  = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase: loginPw }),
      })
      const data = await res.json()
      if (data.success) {
        setAuthed(true)
      } else {
        setLoginErr(data.message || '你真的是管理員嗎...')
        setLoginPw('')
      }
    } catch {
      setLoginErr('連線失敗，請稍後再試')
    } finally {
      setLoginLoading(false)
    }
  }

  // ── 廣播發送 ──────────────────────────────────────────────────────────────
  const handleBroadcastSend = useCallback(async (pw) => {
    setBroadcastLoading(true)
    try {
      const res  = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...broadcast, passphrase: pw }),
      })
      const data = await res.json()
      setBroadcastConfirm(false)
      setBroadcastResult(data)
      if (data.success) setBroadcast(INIT_BROADCAST)
    } catch (err) {
      setBroadcastConfirm(false)
      setBroadcastResult({ success: false, message: `連線失敗: ${err.message}` })
    } finally {
      setBroadcastLoading(false)
    }
  }, [broadcast])

  // ── Email 發送 ────────────────────────────────────────────────────────────
  const handleEmailSend = useCallback(async (pw) => {
    setEmailLoading(true)
    try {
      const emails = emailForm.emails
        .split(/[\n,]+/)
        .map(e => e.trim().toLowerCase())
        .filter(Boolean)
      const res  = await fetch('/api/admin/send-to-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...emailForm, emails, passphrase: pw }),
      })
      const data = await res.json()
      setEmailConfirm(false)
      setEmailResult(data)
      if (data.success) setEmailForm(INIT_EMAIL)
    } catch (err) {
      setEmailConfirm(false)
      setEmailResult({ success: false, message: `連線失敗: ${err.message}` })
    } finally {
      setEmailLoading(false)
    }
  }, [emailForm])

  // ── 登入前畫面 ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.loginWrap}>
            <div className={styles.loginCard}>
              <div className={styles.loginIconWrap}>
                <ShieldOutlinedIcon className={styles.loginIconSvg} />
              </div>
              <h1 className={styles.loginTitle}>管理員入口</h1>
              <p className={styles.loginSubtitle}>此頁面僅限授權人員存取，請輸入通關密語</p>
              <form onSubmit={handleLogin} className={styles.loginForm}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="passphrase">通關密語</label>
                  <input
                    id="passphrase"
                    type="password"
                    className={`${styles.input} ${loginErr ? styles.inputError : ''}`}
                    placeholder="輸入通關密語…"
                    value={loginPw}
                    onChange={e => { setLoginPw(e.target.value); setLoginErr('') }}
                    autoComplete="current-password"
                    autoFocus
                  />
                  {loginErr && <p className={styles.loginError}>{loginErr}</p>}
                </div>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={loginLoading}
                  style={{ width: '100%', marginTop: '0.25rem' }}
                >
                  {loginLoading
                    ? <><span className={styles.spinner} />驗證中…</>
                    : '進入管理區'}
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ── 管理區 ────────────────────────────────────────────────────────────────
  const emailCount   = emailForm.emails.split(/[\n,]+/).map(e => e.trim()).filter(Boolean).length
  const broadcastOk  = broadcast.title.trim() && broadcast.content.trim()
  const emailOk      = emailCount > 0 && emailForm.title.trim() && emailForm.content.trim()

  return (
    <>
      <Header />
      <main className={styles.main}>

        {/* ── 頂部橫幅 ── */}
        <div className={styles.adminBanner}>
          <div className="container">
            <div className={styles.bannerInner}>
              <div className={styles.bannerLeft}>
                <AdminPanelSettingsOutlinedIcon className={styles.bannerIconSvg} />
                <div>
                  <h1 className={styles.bannerTitle}>管理員控制台</h1>
                  <p className={styles.bannerSub}>Dogtor 逗課 後台管理系統</p>
                </div>
              </div>
              <button
                className={styles.logoutBtn}
                onClick={() => { setAuthed(false); setLoginPw('') }}
              >
                <LogoutOutlinedIcon style={{ fontSize: 16 }} />
                登出
              </button>
            </div>
          </div>
        </div>

        {/* ── 功能卡片區 ── */}
        <div className="container">
          <div className={styles.adminContent}>
            <div className={styles.moduleGrid}>

              {/* 廣播通知 */}
              <ModuleCard
                icon={CampaignOutlinedIcon}
                title="系統廣播"
                sub="發送推播通知給所有已安裝 App 的用戶"
                badge="全體推播"
              >
                <form
                  onSubmit={e => { e.preventDefault(); if (broadcastOk) setBroadcastConfirm(true) }}
                  className={styles.form}
                >
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

                  <PushPreview title={broadcast.title} content={broadcast.content} />

                  <button
                    type="submit"
                    className={`${styles.btnPrimary} ${styles.sendBtn}`}
                    disabled={!broadcastOk || broadcastLoading}
                  >
                    <SendRoundedIcon style={{ fontSize: 18 }} />
                    發送廣播給所有用戶
                  </button>
                </form>
              </ModuleCard>

              {/* 指定 Email 推播 */}
              <ModuleCard
                icon={AlternateEmailOutlinedIcon}
                title="指定用戶推播"
                sub="依 Email 發送推播給特定用戶"
                badge="精準投遞"
              >
                <form
                  onSubmit={e => { e.preventDefault(); if (emailOk) setEmailConfirm(true) }}
                  className={styles.form}
                >
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

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <label className={styles.label} htmlFor="em-title">
                        通知標題 <span className={styles.required}>*</span>
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
                        通知內容 <span className={styles.required}>*</span>
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

                  <PushPreview title={emailForm.title} content={emailForm.content} />

                  <button
                    type="submit"
                    className={`${styles.btnPrimary} ${styles.sendBtn}`}
                    disabled={!emailOk || emailLoading}
                  >
                    <SendRoundedIcon style={{ fontSize: 18 }} />
                    發送給指定用戶{emailCount > 0 ? `（${emailCount} 位）` : ''}
                  </button>
                </form>
              </ModuleCard>

              {/* 公佈欄管理 */}
              <div style={{ gridColumn: '1 / -1' }}>
                <ModuleCard
                  icon={AnnouncementOutlinedIcon}
                  title="公佈欄管理"
                  sub="管理 App 內公告：展開可預覽用戶視角，輸入權限密語後可新增、編輯、刪除"
                  badge="公告系統"
                >
                  <AnnouncementsPanel />
                </ModuleCard>
              </div>

            </div>
          </div>
        </div>
      </main>

      {broadcastConfirm && (
        <ConfirmModal
          title={`廣播「${broadcast.title}」給所有用戶`}
          onConfirm={handleBroadcastSend}
          onCancel={() => setBroadcastConfirm(false)}
          loading={broadcastLoading}
        />
      )}
      {emailConfirm && (
        <ConfirmModal
          title={`傳送「${emailForm.title}」給 ${emailCount} 位指定用戶`}
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

      <Footer />
    </>
  )
}
