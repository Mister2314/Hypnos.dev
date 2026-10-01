/**
 * Sound — fon musiqisi + səs düyməsi.
 *
 * ⚠️ Brauzerlər SƏSSİZ OLMAYAN autoplay-ı bloklayır. Ona görə iki addımlı yol:
 *   1. Pərdə qalxanda pleyer başlamağa ÇALIŞIR.
 *   2. Bloklansa — ilk real hərəkətdə (klik / toxunuş / düymə) başlayır.
 * Düymə həmişə vəziyyəti göstərir, seçim `localStorage`-da qalır.
 */
import { useEffect, useRef, useState } from 'react'
import { SITE } from '../lib/site'
import { isLoaderDone, onLoaderProgress } from '../lib/loader'
import { useCopy } from '../lib/i18n'

const BASE = import.meta.env.BASE_URL
const TARGET_VOL = 0.34
const KEY = 'khayal-sound'

export default function Sound() {
  const copy = useCopy()
  const elRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<(to: number) => void>(() => {})
  const onRef = useRef(true)
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem(KEY) !== 'off'
    } catch {
      return true
    }
  })
  onRef.current = on

  useEffect(() => {
    const el = new Audio(BASE + SITE.track.src)
    el.loop = true
    el.preload = 'auto'
    el.volume = 0
    elRef.current = el

    let raf = 0
    let armed = false
    fadeRef.current = (to: number) => {
      cancelAnimationFrame(raf)
      const step = () => {
        const d = to - el.volume
        if (Math.abs(d) < 0.008) {
          el.volume = to
          return
        }
        el.volume = Math.max(0, Math.min(1, el.volume + d * 0.045))
        raf = requestAnimationFrame(step)
      }
      step()
    }

    const start = () => {
      if (!onRef.current || armed) return
      el.play()
        .then(() => fadeRef.current(TARGET_VOL))
        .catch(() => {
          // autoplay bloklandı — ilk real hərəkəti gözlə (bir dəfə)
          armed = true
          const kick = () => {
            armed = false
            window.removeEventListener('pointerdown', kick)
            window.removeEventListener('keydown', kick)
            start()
          }
          window.addEventListener('pointerdown', kick, { once: true })
          window.addEventListener('keydown', kick, { once: true })
        })
    }

    if (isLoaderDone()) start()
    else {
      const off = onLoaderProgress((pct) => {
        if (pct >= 1) {
          off()
          start()
        }
      })
    }

    return () => {
      cancelAnimationFrame(raf)
      el.pause()
      el.removeAttribute('src')
    }
  }, [])

  const toggle = () => {
    const next = !on
    setOn(next)
    try {
      localStorage.setItem(KEY, next ? 'on' : 'off')
    } catch {
      /* storage bloklanıb — sessiya daxilində yenə də işləyir */
    }
    const el = elRef.current
    if (!el) return
    if (next) {
      el.play()
        .then(() => fadeRef.current(TARGET_VOL))
        .catch(() => {
          /* hərəkət olmadan mümkün deyil — istifadəçi yenə basacaq */
        })
    } else {
      fadeRef.current(0)
      window.setTimeout(() => {
        if (!onRef.current) el.pause()
      }, 420)
    }
  }

  return (
    <button
      type="button"
      className="sound-btn"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? copy.a11y.soundOff : copy.a11y.soundOn}
      title={SITE.track.title}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9.4h3.3L12 5.5v13L7.3 14.6H4z" />
        {on ? (
          <>
            <path d="M15.3 9.3a4 4 0 0 1 0 5.4" />
            <path d="M17.9 6.7a7.6 7.6 0 0 1 0 10.6" />
          </>
        ) : (
          <>
            <path d="M15.8 9.8l4.6 4.4" />
            <path d="M20.4 9.8l-4.6 4.4" />
          </>
        )}
      </svg>
    </button>
  )
}
