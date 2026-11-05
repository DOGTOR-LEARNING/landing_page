'use client'
import { useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import styles from '../admin.module.css'
import page from './nest.module.css'

// Drag the 8 decoration slots and 3 pet spots onto a background (spec §4.2).
// Coordinates are fractions of the canvas: floor things and pets anchor at
// their bottom centre, wall things at their centre. Box sizes are the app's
// drawing boxes on its 1200 × 900 logical canvas (spec §4.4).

const CANVAS = [1200, 900]
const DRAW_BOX = { left_tall: [260, 520], right_large: [360, 480], rug: [520, 260], wall: [220, 220], toy: [160, 160] }
const SLOTS = {
  left_tall: 'left_tall', right_wall_1: 'wall', right_wall_2: 'wall', rug: 'rug',
  toy_1: 'toy', toy_2: 'toy', toy_3: 'toy', right_large: 'right_large',
}
const PET_SCALE = { back_left: 0.9, back_right: 0.9, front: 1 }
const PET_BOX = 320

// Same as the seed's bedroom and the app's fallback (wall corner at x = 0.5).
export const DEFAULT_LAYOUT = {
  slots: {
    left_tall: { x: 0.12, y: 0.70, scale: 1 }, right_wall_1: { x: 0.64, y: 0.30, scale: 1 },
    right_wall_2: { x: 0.80, y: 0.36, scale: 1 }, rug: { x: 0.48, y: 0.76, scale: 1 },
    toy_1: { x: 0.22, y: 0.88, scale: 1 }, toy_2: { x: 0.66, y: 0.90, scale: 1 },
    toy_3: { x: 0.76, y: 0.82, scale: 1 }, right_large: { x: 0.84, y: 0.76, scale: 1 },
  },
  pets: { back_left: { x: 0.42, y: 0.68 }, back_right: { x: 0.55, y: 0.68 }, front: { x: 0.48, y: 0.80 } },
}

const clamp = v => Math.min(1, Math.max(0, Math.round(v * 1000) / 1000))

function box(id, spot, isPet) {
  const kind = isPet ? 'pet' : SLOTS[id]
  const scale = isPet ? PET_SCALE[id] : spot.scale ?? 1
  const [w, h] = isPet ? [PET_BOX * scale, PET_BOX * scale] : DRAW_BOX[kind].map(v => v * scale)
  const wf = w / CANVAS[0]
  const hf = h / CANVAS[1]
  const top = kind === 'wall' ? spot.y - hf / 2 : spot.y - hf
  return { left: spot.x - wf / 2, top, width: wf, height: hf }
}

export default function LayoutEditor({ value, onChange, imageUrl, disabled }) {
  const layout = value || DEFAULT_LAYOUT
  const canvas = useRef(null)
  const drag = useRef(null)
  const [selected, setSelected] = useState('rug')

  function start(event, group, id) {
    if (disabled) return
    event.preventDefault()
    setSelected(id)
    const rect = canvas.current.getBoundingClientRect()
    const spot = layout[group][id]
    drag.current = {
      group, id, rect,
      dx: (event.clientX - rect.left) / rect.width - spot.x,
      dy: (event.clientY - rect.top) / rect.height - spot.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function move(event) {
    const d = drag.current
    if (!d) return
    const x = clamp((event.clientX - d.rect.left) / d.rect.width - d.dx)
    const y = clamp((event.clientY - d.rect.top) / d.rect.height - d.dy)
    onChange({ ...layout, [d.group]: { ...layout[d.group], [d.id]: { ...layout[d.group][d.id], x, y } } })
  }
  const end = () => { drag.current = null }

  const group = selected in layout.slots ? 'slots' : 'pets'
  const spot = layout[group][selected]
  const setSpot = patch => onChange({ ...layout, [group]: { ...layout[group], [selected]: { ...spot, ...patch } } })

  return <div className={page.layoutEditor}>
    <div ref={canvas} className={page.layoutCanvas} style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}>
      {!imageUrl && <span className={page.layoutEmpty}>上傳背景圖後會顯示在這裡</span>}
      <span className={page.layoutCorner} aria-hidden />
      {[['slots', layout.slots], ['pets', layout.pets]].map(([g, spots]) => Object.entries(spots).map(([id, s]) => {
        const b = box(id, s, g === 'pets')
        return <div key={id}
          className={`${page.layoutBox} ${g === 'pets' ? page.layoutPet : ''} ${selected === id ? page.layoutSelected : ''}`}
          style={{ left: `${b.left * 100}%`, top: `${b.top * 100}%`, width: `${b.width * 100}%`, height: `${b.height * 100}%` }}
          onPointerDown={e => start(e, g, id)} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
          <span>{id}</span>
        </div>
      }))}
    </div>
    <div className={page.layoutSide}>
      <p className={styles.hint}>拖拉方框對到背景上的位置。藍框＝擺件格位，橘框＝寵物位置；左右兩面牆的轉角應在正中間（虛線）。</p>
      <div className={page.layoutFields}>
        <strong>{selected}</strong>
        <label>x <input className={styles.input} type="number" step="any" min="0" max="1" value={spot.x} disabled={disabled} onChange={e => setSpot({ x: clamp(Number(e.target.value)) })} /></label>
        <label>y <input className={styles.input} type="number" step="any" min="0" max="1" value={spot.y} disabled={disabled} onChange={e => setSpot({ y: clamp(Number(e.target.value)) })} /></label>
        {group === 'slots' && <label>縮放 <input className={styles.input} type="number" step="any" min="0.5" max="1.5" value={spot.scale ?? 1} disabled={disabled} onChange={e => setSpot({ scale: Number(e.target.value) || 1 })} /></label>}
      </div>
      <button type="button" className={styles.smallButton} disabled={disabled} onClick={() => onChange(structuredClone(DEFAULT_LAYOUT))}><RotateCcw size={14} />恢復預設位置</button>
    </div>
  </div>
}
