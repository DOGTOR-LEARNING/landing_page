'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import styles from './LiteYouTube.module.css'

// 先只放縮圖，點了才換成 iframe。一頁有很多支影片時，不會一開始就載入一堆 YouTube 播放器。
export default function LiteYouTube({ id, title, vertical, playLabel }) {
  const [playing, setPlaying] = useState(false)
  const ratioClass = vertical ? styles.vertical : styles.wide

  if (playing) {
    return (
      <div className={`${styles.frame} ${ratioClass}`}>
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`${styles.frame} ${ratioClass} ${styles.poster}`}
      onClick={() => { setPlaying(true); trackEvent('video_play', { youtube_id: id }) }}
      aria-label={`${playLabel}：${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className={styles.thumb}
      />
      <span className={styles.playIcon} aria-hidden="true" />
    </button>
  )
}
