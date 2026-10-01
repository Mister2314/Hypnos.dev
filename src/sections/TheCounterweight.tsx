

import { useEffect, useRef } from 'react'
import Line from '../components/Line'
import { ambient, eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { useCopy } from '../lib/i18n'
import { COUNTERWEIGHT } from '../lib/site'
import { mountSequence } from '../lib/sequence'

export default function TheCounterweight() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(
    () =>
      mountSequence({
        canvas: canvasRef.current!,
        trigger: ref.current,
        highDir: 'counterweight/frames-1440',
        lowDir: 'counterweight/frames-1280',
        poster: 'counterweight/poster-1920.webp',
        ease: 0.07,
      }),
    [],
  )

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(q('.cw__quote .rv, .cw__source, .cw__personal'), { opacity: 1, y: 0, yPercent: 0 })
        return
      }

      gsap.from(q('.cw__quote .rv'), {
        yPercent: 65,
        opacity: 0,
        filter: 'blur(9px)',
        duration: 0.95,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.cw__quote')[0], start: 'top 78%' },
      })

      gsap.from(q('.cw__source'), {
        opacity: 0,
        y: 10,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: q('.cw__source')[0], start: 'top 92%' },
      })

      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      })

      tl.fromTo(q('.cw__video'), { opacity: 0.4 }, { opacity: 1, duration: 1 }, 0)

      tl.fromTo(q('.cw__bloom'), { opacity: 0.1, scale: 0.82 }, { opacity: 0.28, duration: 0.4 }, 0)
      tl.to(q('.cw__bloom'), { opacity: 0.85, scale: 1.16, duration: 0.28 }, 0.4)
      tl.to(q('.cw__bloom'), { opacity: 0.45, scale: 1.0, duration: 0.32 }, 0.68)

      tl.fromTo(
        q('.cw__personal'),
        { opacity: 0, y: 16, filter: 'blur(6px)' },
        { opacity: 0.85, y: 0, filter: 'blur(0px)', duration: 0.18 },
        0.66,
      )

      ambient(q('.cw__source'), { y: -2 }, 9)
    },
    { scope: ref, dependencies: [copy] },
  )

  return (
    <section
      className="section section--counterweight"
      data-world="counterweight"
      id="counterweight"
      ref={ref}
    >
      <div className="cw__stage">
        <canvas ref={canvasRef} className="cw__video" aria-hidden="true" />
        <div className="cw__bloom" aria-hidden="true" />
        <div className="cw__scrim" aria-hidden="true" />

        <div className="cw__inner">
          <p className="section__eyebrow">{eyebrow('counterweight', copy.titles.counterweight)}</p>

          <Line tag="h2" className="cw__quote" text={copy.cwQuote} />

          <p className="cw__source">— {COUNTERWEIGHT.source}</p>

          <p className="cw__personal">{copy.cwPersonal}</p>
        </div>
      </div>
    </section>
  )
}
