
import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/scroll'
import { isLoaderDone, onLoaderProgress } from '../lib/loader'
import { useCopy } from '../lib/i18n'

/**
 * ScrollHint — v32 başlanğıc bələdçisi.
 *
 * Pərdə qalxanda İLK SCROLL-DAN ƏVVƏL iki ox + izah görünür:
 *   • səs düyməsinin DƏQİQ altında: "musiqi açıqdır — dayandırmaq üçün bura bas"
 *   • sağ fəsillərin DƏQİQ solunda: "birinə bas, birbaşa oraya atla"
 * Mövqe elementlərin REAL koordinatından ölçülür (mobil + desktop, resize-də
 * yenilənir). Vaxt limiti YOXDUR — istifadəçi scroll edənə qədər qalır,
 * scroll-da fade out.
 */
const SESSION_KEY = 'khayal-hint-shown'
/** gizləmə yalnız real istifadəçi hərəkətində (scroll auto-sürüşmə hesab deyil) */
const HIDE_EVENTS = ['wheel', 'touchmove', 'keydown'] as const

export default function ScrollHint() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  const copy = useCopy()

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return

    let interacted = false
    const mark = () => {
      interacted = true
    }
    for (const ev of ['wheel', 'touchmove', 'keydown'] as const) {
      window.addEventListener(ev, mark, { passive: true, once: true })
    }

    const show = () => {
      if (interacted) return
      sessionStorage.setItem(SESSION_KEY, '1')
      setOn(true)
    }

    let off = () => {}
    if (isLoaderDone()) {
      setTimeout(show, 100)
    } else {
      off = onLoaderProgress((pct) => {
        if (pct >= 1) {
          off()
          setTimeout(show, 900)
        }
      })
    }

    return () => {
      off()
      for (const ev of ['wheel', 'touchmove', 'keydown'] as const) {
        window.removeEventListener(ev, mark)
      }
    }
  }, [])

  useEffect(() => {
    if (!on) return
    const el = ref.current
    if (!el) return

    const soundPop = el.querySelector<HTMLElement>('.hint-pop--sound')
    const chPop = el.querySelector<HTMLElement>('.hint-pop--chapters')

    /** pop-ları hədəf elementlərin REAL koordinatına oturt */
    const place = () => {
      const sb = document.querySelector('.sound-btn')?.getBoundingClientRect()
      if (sb && soundPop) {
        // düymənin mərkəz x-ini tut, pop-u onun altına, ekranın içində saxla
        const cx = sb.left + sb.width / 2
        const popW = soundPop.offsetWidth
        let left = cx - 22 // ox-un pop daxilindəki ofseti
        left = Math.max(10, Math.min(left, window.innerWidth - popW - 10))
        soundPop.style.left = `${left}px`
        soundPop.style.top = `${sb.bottom + 12}px`
        // ox-u düymənin mərkəzi altına sürüşdür
        const arrow = soundPop.querySelector<HTMLElement>('.hint-pop__arrow')
        if (arrow) arrow.style.left = `${Math.max(10, Math.min(cx - left - 5, popW - 20))}px`
      }
      // nav-ın GÖRÜNƏN nöqtələrinə bağla — label-lar opacity 0 olsa da en tutur,
      // `.chapter-nav` ölçüsü istifadəçinin gördüyündən enli olur
      const dots = Array.from(document.querySelectorAll('.chapter-nav__dot')).map((d) => d.getBoundingClientRect())
      if (dots.length && chPop) {
        const mid = dots[Math.floor(dots.length / 2)]
        const popH = chPop.offsetHeight
        let top = mid.top + mid.height / 2 - popH / 2
        top = Math.max(10, Math.min(top, window.innerHeight - popH - 10))
        chPop.style.top = `${top}px`
        chPop.style.right = `${window.innerWidth - mid.left + 10}px`
        const arrow = chPop.querySelector<HTMLElement>('.hint-pop__arrow')
        if (arrow) arrow.style.top = `${Math.max(8, mid.top + mid.height / 2 - top - 5)}px`
      }
    }
    place()
    window.addEventListener('resize', place)

    const pops = el.querySelectorAll('.hint-pop')
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1 })
      gsap.set(pops, { opacity: 1, y: 0 })
    } else {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(
        pops,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.35, delay: 0.3, ease: 'power3.out' },
      )
    }

    let gone = false
    // gizləmə YALNIZ istifadəçi hərəkətində: wheel / touchmove / keydown.
    // Qeyd: 'scroll' hadisəsinə qulaq asmırıq — dil dəyişimində (key={lang}
    // remount → ScrollTrigger.refresh) səhifə öz-özünə yerdəyişir və scroll
    // hadisəsi yaradır; bu, hint-i səhvən öldürürdü.
    const hide = () => {
      if (gone) return
      gone = true
      gsap.to(el, {
        opacity: 0,
        duration: prefersReducedMotion ? 0.15 : 0.45,
        ease: 'power2.in',
        onComplete: () => setOn(false),
      })
      for (const ev of HIDE_EVENTS) {
        window.removeEventListener(ev, hide)
      }
      window.removeEventListener('resize', place)
    }

    for (const ev of HIDE_EVENTS) {
      window.addEventListener(ev, hide, { passive: true })
    }

    return () => {
      for (const ev of HIDE_EVENTS) {
        window.removeEventListener(ev, hide)
      }
      window.removeEventListener('resize', place)
    }
  }, [on])

  if (!on) return null

  return (
    <div className="hint-layer" ref={ref} role="status">
      <div className="hint-pop hint-pop--sound" aria-hidden="true">
        <span className="hint-pop__arrow hint-pop__arrow--up" />
        <span className="hint-pop__dot" />
        {copy.hintSound}
      </div>
      <div className="hint-pop hint-pop--chapters" aria-hidden="true">
        <span className="hint-pop__arrow hint-pop__arrow--right" />
        <span className="hint-pop__glyph">
          <i />
          <i />
          <i />
          <b>›</b>
        </span>
        {copy.hintChapters}
      </div>
    </div>
  )
}
