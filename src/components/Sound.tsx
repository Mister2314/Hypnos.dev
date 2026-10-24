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
  const ensureSrcRef = useRef<() => void>(() => {})
  const onRef = useRef(true)
  // v30: autoplay bloklandıqda düymə nəbz edir — istifadəçi bilir ki,
  // bir dəyməklə musiqi başlayacaq (əks halda "səs niyə yoxdur?" itirilir)
  const [blocked, setBlocked] = useState(false)
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem(KEY) !== 'off'
    } catch {
      return true
    }
  })
  onRef.current = on

  useEffect(() => {
    // v28: fayl DƏRHAL yüklənmir — 5.6 MB audio pərdə arxasındaki 36 MB kadrla
    // eyni zolaqda yarışırdı. `src` yalnız başlamaq lazım olanda qoyulur.
    const el = new Audio()
    el.loop = true
    el.preload = 'none'
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

    const ensureSrc = () => {
      if (el.src) return
      el.src = BASE + SITE.track.src
      el.load()
    }
    ensureSrcRef.current = ensureSrc

    const start = () => {
      if (!onRef.current || armed) return
      ensureSrc()
      el.play()
        .then(() => {
          setBlocked(false)
          fadeRef.current(TARGET_VOL)
        })
        .catch(() => {
          // autoplay bloklandı — ilk real hərəkəti gözlə (bir dəfə).
          // pointerdown/keydown/touchend/click — hər platformadan biri tutur
          setBlocked(true)
          armed = true
          const kick = () => {
            armed = false
            for (const ev of ['pointerdown', 'keydown', 'touchend', 'click'] as const) {
              window.removeEventListener(ev, kick)
            }
            start()
          }
          for (const ev of ['pointerdown', 'keydown', 'touchend', 'click'] as const) {
            window.addEventListener(ev, kick, { once: true })
          }
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
      ensureSrcRef.current()
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
      data-blocked={blocked && on ? '1' : '0'}
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
