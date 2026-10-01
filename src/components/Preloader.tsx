

import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/scroll'
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
      }, wait)
    }

    let target = 0
    let shown = 0
    let raf = 0

    // rAF lerp — sayaç sıçramır, real yükləməni yumşaq izləyir
    const render = () => {
      shown += (target - shown) * 0.09
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
