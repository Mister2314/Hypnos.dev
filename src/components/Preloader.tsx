

import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, prefersReducedMotion } from '../lib/scroll'
import { isLoaderDone, markLoaderDone, onLoaderProgress, setLoaderFontsReady } from '../lib/loader'
import { useCopy } from '../lib/i18n'

const MIN_SHOW_MS = 700
// v9: pərdə videolar BÜTÜN kadrları yüklənənə qədər qalır. Failsafe artıq
// "3 saniyədə burax" deyil — yalnız ölü şəbəkə üçün son çıxışdır (20s).
const FAILSAFE_MS = 20000

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(isLoaderDone())
  const copy = useCopy()

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('is-loading')

    let finished = false
    const startedAt = performance.now()

    const finish = () => {
      if (finished) return
      finished = true
      const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - startedAt))
      setTimeout(() => {
        ref.current?.classList.add('is-done')
        root.classList.remove('is-loading')
        setTimeout(() => setGone(true), prefersReducedMotion ? 200 : 900)
        // v28: pərdə qalxanda ölçülər sabitləşir. Refresh olmasa gecikmiş layout
        // dəyişimi triggerləri köhnə mövqedə saxlayır → scrub animasiyaları səhv
        // progressdə ilişib qalır (real şikayət: speak mətninin rəngi/effekti).
        requestAnimationFrame(() => ScrollTrigger.refresh())
        window.setTimeout(() => ScrollTrigger.refresh(), 700)
      }, wait)
    }

    let target = 0
    let shown = 0
    let raf = 0

    // v29 — "heç vaxt durmayan, yalan deməyən" sayaç:
    //  • real progress 92%-də saxlanılır (bitməmiş yükləmə 100% demiir)
    //  • nəbizən (creep) yavaş-özü irəliləyir — bar ekranda HEÇ VAXT donmur,
    //    amma heç vaxt real yükləmədən irəlidə də getmir
    //  • real yükləmə bitəndə (pct=1) pərdə TAM O ANDA qalxır — ikisi eyni anda
    const CREEP_MS = 16000
    const CAP_UNTIL_DONE = 0.92

    const render = () => {
      const elapsed = performance.now() - startedAt
      const creep = Math.min(CAP_UNTIL_DONE, elapsed / CREEP_MS)
      const displayTarget = target >= 1 ? 1 : Math.max(Math.min(target, CAP_UNTIL_DONE), creep)
      shown += (displayTarget - shown) * 0.09
      if (target >= 1 && shown > 0.992) shown = 1
      const el = ref.current
      const bar = el?.querySelector<HTMLElement>('.preloader__bar i')
      const num = el?.querySelector<HTMLElement>('.preloader__pct b')
      if (bar) bar.style.transform = `scaleX(${shown})`
      if (num) num.textContent = `${Math.round(shown * 100)}%`
      if (target >= 1 && shown >= 1) {
        finish()
        return
      }
      raf = requestAnimationFrame(render)
    }

    const off = onLoaderProgress((pct) => {
      target = pct
    })

    raf = requestAnimationFrame(render)

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setLoaderFontsReady())
    } else {
      setLoaderFontsReady()
    }

    const failsafe = setTimeout(() => {
      markLoaderDone()
      finish()
    }, FAILSAFE_MS)

    return () => {
      finished = true
      off()
      cancelAnimationFrame(raf)
      clearTimeout(failsafe)
      root.classList.remove('is-loading')
    }
  }, [])

  if (gone) return null

  return (
    <div className="preloader" ref={ref} role="status" aria-label={copy.a11y.loading}>
      <p className="preloader__name">Khayal</p>
      <div className="preloader__bar" aria-hidden="true">
        <i />
      </div>
      <p className="preloader__pct">
        <b>0%</b>
      </p>
    </div>
  )
}
