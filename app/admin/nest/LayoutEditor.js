'use client'
import { useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import styles from '../admin.module.css'
import page from './nest.module.css'

// Match the app's 1200x675 camera, six slots and ground anchors.
const CANVAS = [1200, 675]
const DRAW_BOX = { left_tall: [165, 430], right_large: [250, 300], rug: [400, 200], wall: [128, 144], toy: [140, 140] }
const SLOTS = { left_tall: 'left_tall', right_wall_1: 'wall', rug: 'rug', toy_1: 'toy', toy_2: 'toy', right_large: 'right_large' }
const PET_SCALE = { back_left: 0.85, back_right: 0.85, front: 1 }
const PET_BOX = 320

export const DEFAULT_LAYOUT = {
  "version": 6,
  "slots": {
    "left_tall": {
      "x": 0.075,
      "y": 0.7,
      "scale": 1.0
    },
    "right_wall_1": {
      "x": 0.7116666666666667,
      "y": 0.2519445776711964,
      "scale": 1.0,
      "quad": [
        [
          0.6583333333333333,
          0.14962962962962964
        ],
        [
          0.765,
          0.1388521183053557
        ],
        [
          0.765,
          0.36374100719424457
        ],
        [
          0.6583333333333333,
          0.35555555555555557
        ]
      ]
    },
    "rug": {
      "x": 0.5,
      "y": 0.97,
      "scale": 1.0
    },
    "toy_1": {
      "x": 0.24,
      "y": 0.9,
      "scale": 1.0
    },
    "toy_2": {
      "x": 0.75,
      "y": 0.91,
      "scale": 1.0
    },
    "right_large": {
      "x": 0.89,
      "y": 0.85,
      "scale": 1.0
    }
  },
  "pets": {
    "back_left": {
      "x": 0.32,
      "y": 0.76
    },
    "back_right": {
      "x": 0.68,
      "y": 0.76
    },
    "front": {
      "x": 0.5,
      "y": 0.9
    }
  }
}

const clamp = v => Math.min(1, Math.max(0, Math.round(v * 1000) / 1000))

function moveSpot(spot, patch) {
  if (!spot.quad) return { ...spot, ...patch }
  const xs = spot.quad.map(p => p[0]), ys = spot.quad.map(p => p[1])
  const dx = Math.max(-Math.min(...xs), Math.min(1 - Math.max(...xs), (patch.x ?? spot.x) - spot.x))
  const dy = Math.max(-Math.min(...ys), Math.min(1 - Math.max(...ys), (patch.y ?? spot.y) - spot.y))
  return { ...spot, ...patch, x: spot.x + dx, y: spot.y + dy, quad: spot.quad.map(([x, y]) => [x + dx, y + dy]) }
}

function box(id, spot, isPet) {
  if (spot.quad) {
    const xs = spot.quad.map(p => p[0]), ys = spot.quad.map(p => p[1])
    return { left: Math.min(...xs), top: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) }
  }
  const kind = isPet ? 'pet' : SLOTS[id]
  const scale = isPet ? PET_SCALE[id] : spot.scale ?? 1
  const [w, h] = isPet ? [PET_BOX * scale, PET_BOX * scale] : DRAW_BOX[kind].map(v => v * scale)
  const wf = w / CANVAS[0]
  const hf = h / CANVAS[1]
  const top = kind === 'wall' ? spot.y - hf / 2 : spot.y - hf * (isPet ? 0.9 : 0.96)
  return { left: spot.x - wf / 2, top, width: wf, height: hf }
}

export default function LayoutEditor({ value, onChange, imageUrl, disabled }) {
  const layout = value?.version === 6 ? value : DEFAULT_LAYOUT
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
    onChange({ ...layout, [d.group]: { ...layout[d.group], [d.id]: moveSpot(layout[d.group][d.id], { x, y }) } })
  }
  const end = () => { drag.current = null }

  const group = selected in layout.slots ? 'slots' : 'pets'
  const spot = layout[group][selected]
  const setSpot = patch => onChange({ ...layout, [group]: { ...layout[group], [selected]: moveSpot(spot, patch) } })

  return <div className={page.layoutEditor}>
    <div ref={canvas} className={page.layoutCanvas} style={{ aspectRatio: '16 / 9', ...(imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}) }}>
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
      <p className={styles.hint}>這批背景直接沿用預設位置即可。藍框＝六個擺件格位，橘框＝寵物位置；只有換成不同構圖的背景時才需要調整。</p>
      <div className={page.layoutFields}>
        <strong>{selected}</strong>
        <label>x <input className={styles.input} type="number" step="any" min="0" max="1" value={spot.x} disabled={disabled} onChange={e => setSpot({ x: clamp(Number(e.target.value)) })} /></label>
        <label>y <input className={styles.input} type="number" step="any" min="0" max="1" value={spot.y} disabled={disabled} onChange={e => setSpot({ y: clamp(Number(e.target.value)) })} /></label>
        {group === 'slots' && !spot.quad && <label>縮放 <input className={styles.input} type="number" step="any" min="0.5" max="1.5" value={spot.scale ?? 1} disabled={disabled} onChange={e => setSpot({ scale: Number(e.target.value) || 1 })} /></label>}
      </div>
      <button type="button" className={styles.smallButton} disabled={disabled} onClick={() => onChange(structuredClone(DEFAULT_LAYOUT))}><RotateCcw size={14} />恢復預設位置</button>
    </div>
  </div>
}
