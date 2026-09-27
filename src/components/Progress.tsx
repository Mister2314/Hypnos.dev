/**
 * Progress — yuxarıda nazik qızıl xətt, səhifənin scroll gedişatını göstərir.
 * Sırf scroll-a bağlıdır (scrub) — "səhifə hərəkət edir" siqnalı.
 */
import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'

export default function Progress() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion) return
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        },
      )
    },
    { scope: ref },
  )

  return <div className="progress" ref={ref} aria-hidden="true" />
}
