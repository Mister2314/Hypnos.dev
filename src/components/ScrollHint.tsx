
import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/scroll'
import { isLoaderDone, onLoaderProgress } from '../lib/loader'
import { useCopy } from '../lib/i18n'

/**
 * ScrollHint — v29 onboarding.
 *
 * Pərdə qalxandan ~1 saniyə sonra bir dəfə görünür: "scroll — film səninlə oynayır".
 * İlk scroll / touch / wheel / düymədə yox da 8 saniyədə yumşaq yox olur.
 * Məqsəd: istifadəçi BİLSİN ki sürüşdürmə videonu idarə edir — tutorial yazısız.
 * sessionStorage: hər sessiyada yalnız bir dəfə (yeniləmədə narahat etmir).
 */
const SESSION_KEY = 'khayal-hint-shown'
const AUTO_HIDE_MS = 8000

export default function ScrollHint() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  const copy = useCopy()

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return

    const show = () => {
      // pərdə arxada bitib, amma istifadəçi artıq aşağıda idisə narahat etmə
      if (window.scrollY > 40) return
      sessionStorage.setItem(SESSION_KEY, '1')
      setOn(true)
    }

    // pərdə hələ qalxmayıbsa gözlə — pct=1 (markLoaderDone) gələndə başlat
    let off = () => {}
    if (isLoaderDone()) {
      setTimeout(show, 100)
    } else {
      off = onLoaderProgress((pct) => {
        if (pct >= 1) {
          off()
          setTimeout(show, 1000)
        }
      })
    }

    return () => {
      off()
    }
  }, [])

  useEffect(() => {
    if (!on) return
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 })
    } else {
      gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    }

    let gone = false
    const hide = () => {
      if (gone) return
      gone = true
      gsap.to(el, {
        opacity: 0,
        y: -10,
        duration: prefersReducedMotion ? 0.15 : 0.5,
        ease: 'power2.in',
        onComplete: () => setOn(false),
      })
      for (const ev of ['wheel', 'touchmove', 'keydown'] as const) {
        window.removeEventListener(ev, hide)
      }
      window.removeEventListener('scroll', hide, { capture: true })
    }

    const timer = setTimeout(hide, AUTO_HIDE_MS)
    for (const ev of ['wheel', 'touchmove', 'keydown'] as const) {
      window.addEventListener(ev, hide, { passive: true })
    }
    window.addEventListener('scroll', hide, { capture: true, passive: true })

    return () => {
      clearTimeout(timer)
      for (const ev of ['wheel', 'touchmove', 'keydown'] as const) {
        window.removeEventListener(ev, hide)
      }
      window.removeEventListener('scroll', hide, { capture: true })
    }
  }, [on])

  if (!on) return null

  return (
    <div className="scroll-hint" ref={ref} aria-hidden="true">
      <span className="scroll-hint__mouse">
        <i />
      </span>
      <span className="scroll-hint__text">{copy.scrollHint}</span>
    </div>
  )
}
