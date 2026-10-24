
import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/scroll'
import { useCopy } from '../lib/i18n'

/**
 * PauseHint — v32 "sayt donmur" bildirişi.
 *
 * Kadrlardan yığılan videolar SCRUB ilə oynayır: istifadəçi sürüşdürməyi
 * buraxanda ekran donub-qalır və "sayt işləmir?" deyə düşünür (sahibinin
 * ən böyük şikayəti). Davranış:
 *   • video fəsillərində scroll dayananda → fade IN, scroll davam edəndə → fade OUT
 *   • yenə dayananda yenə gəlir — amma spam yoxdur:
 *       - 1.4s fasiləsiz durmuş olmalıdır (tez-tez toxunuşda toqquşmur)
 *       - əvvəlki göstərişdən bəri ən azı 150px real scroll olmalıdır
 *       - fade out-dan sonra 3s soyuma müddəti
 */
const VIDEO_WORLDS = ['leap', 'speak', 'counterweight', 'sapere']
const IDLE_MS = 1400
const MIN_SCROLL_BETWEEN = 150
const COOLDOWN_MS = 3000

export default function PauseHint() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  const copy = useCopy()

  useEffect(() => {
    let visible = false
    let animating = false
    let lastMove = performance.now()
    let shownAtY = -1
    let lastHideAt = 0

    const onScroll = () => {
      lastMove = performance.now()
      if (visible && !animating) {
        // scroll davam etdi — dərhal yox ol
        visible = false
        lastHideAt = performance.now()
        const el = ref.current
        if (el) {
          animating = true
          gsap.to(el, {
            opacity: 0,
            y: -8,
            duration: prefersReducedMotion ? 0.12 : 0.35,
            ease: 'power2.in',
            overwrite: 'auto',
            onComplete: () => {
              animating = false
              setOn(false)
            },
          })
        } else {
          setOn(false)
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const currentWorld = (): string | null => {
      const mid = window.innerHeight / 2
      for (const el of document.querySelectorAll<HTMLElement>('[data-world]')) {
        const r = el.getBoundingClientRect()
        if (r.top <= mid && r.bottom >= mid) return el.dataset.world ?? null
      }
      return null
    }

    const timer = window.setInterval(() => {
      if (visible || animating) return
      if (performance.now() - lastMove < IDLE_MS) return
      if (performance.now() - lastHideAt < COOLDOWN_MS) return
      if (shownAtY >= 0 && Math.abs(window.scrollY - shownAtY) < MIN_SCROLL_BETWEEN) return
      const world = currentWorld()
      if (!world || !VIDEO_WORLDS.includes(world)) return
      shownAtY = window.scrollY
      visible = true
      setOn(true)
    }, 300)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!on) return
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 })
    } else {
      gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', overwrite: 'auto' })
    }
  }, [on])

  if (!on) return null

  return (
    <div className="pause-hint" ref={ref} role="status">
      <span className="pause-hint__pulse" aria-hidden="true" />
      {copy.hintNotStuck}
    </div>
  )
}
