

import { ScrollTrigger, WORLDS, applyWorld, gsap, prefersReducedMotion, setWorld, useGSAP } from '../lib/scroll'

export default function Backdrop() {
  useGSAP(() => {
    setWorld(WORLDS[0])

    const els = WORLDS.map((w) => document.querySelector<HTMLElement>(`[data-world="${w.id}"]`))
    const missing = WORLDS.filter((_, i) => !els[i]).map((w) => w.id)
    if (missing.length) {
      console.warn('[Backdrop] missing sections:', missing)
      return
    }

    let starts: number[] = []
    let vh = window.innerHeight

    // v30: elementlər hər ölçmədə YENİDƏN soruşulur — dil dəyişimi main-i
    // remount edir, köhnə DOM referansları ölü elementlərə çevrilir və
    // getBoundingClientRect() = 0 qayıdardı → bütün starts=0 → dünya
    // sonda qalan (signature, qızılı) rəngə ilişib qalardı. İndi mümkün deyil.
    const measure = () => {
      vh = window.innerHeight
      for (let i = 0; i < WORLDS.length; i++) {
        els[i] = document.querySelector<HTMLElement>(`[data-world="${WORLDS[i].id}"]`)
      }
      starts = els.map((el) => (el ? el.getBoundingClientRect().top + window.scrollY : 0))

      document.documentElement.dataset.worldStarts = starts.map((n) => Math.round(n)).join(',')
    }

    const indexAt = (y: number): number => {
      let idx = 0
      for (let i = 1; i < starts.length; i++) if (y >= starts[i] - 1) idx = i
      return idx
    }

    const update = (y: number) => {
      if (!starts.length) return
      const idx = indexAt(y)

      if (prefersReducedMotion) {
        setWorld(WORLDS[idx])
        return
      }

      if (idx === 0) {
        applyWorld(WORLDS[0], WORLDS[0], 0)
        return
      }

      const t = gsap.utils.clamp(0, 1, (y - (starts[idx] - vh)) / Math.max(1, vh))
      applyWorld(WORLDS[idx - 1], WORLDS[idx], t)
    }

    measure()

    const onScroll = () => update(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })

    const remeasure = () => {
      measure()
      update(window.scrollY)
    }
    ScrollTrigger.addEventListener('refresh', remeasure)
    window.addEventListener('resize', remeasure)

    update(window.scrollY)

    return () => {
      window.removeEventListener('scroll', onScroll)
      ScrollTrigger.removeEventListener('refresh', remeasure)
      window.removeEventListener('resize', remeasure)
    }
  }, [])

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__vignette" />
    </div>
  )
}
