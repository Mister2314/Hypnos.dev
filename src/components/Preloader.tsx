


import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/scroll'
import { isLoaderDone, markLoaderDone, onLoaderProgress, setLoaderFontsReady } from '../lib/loader'

const MIN_SHOW_MS = 700
const FAILSAFE_MS = 8000

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(isLoaderDone())

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

    const off = onLoaderProgress((pct) => {
      const el = ref.current
      const bar = el?.querySelector<HTMLElement>('.preloader__bar i')
      const num = el?.querySelector<HTMLElement>('.preloader__pct b')
      if (bar) bar.style.transform = `scaleX(${pct})`
      if (num) num.textContent = `${Math.round(pct * 100)}%`
      if (pct >= 1) finish()
    })

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
      clearTimeout(failsafe)
      root.classList.remove('is-loading')
    }
  }, [])

  if (gone) return null

  return (
    <div className="preloader" ref={ref} role="status" aria-label="Loading">
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
