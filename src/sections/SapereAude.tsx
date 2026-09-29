


import { useEffect, useRef } from 'react'
import Line from '../components/Line'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { useCopy } from '../lib/i18n'
import { mountSequence } from '../lib/sequence'

export default function SapereAude() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()
  const canvasRef = useRef<HTMLCanvasElement>(null)


  useEffect(
    () =>
      mountSequence({
        canvas: canvasRef.current!,
        trigger: ref.current,
        highDir: 'sapere/frames-1440',
        lowDir: 'sapere/frames-1280',
        poster: 'sapere/poster-1920.webp',
        ease: 0.07,

        focusX: 0.7,
      }),
    [],
  )

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)
      const base = q('.sapere__rule-base')[0] as unknown as SVGPathElement | undefined
      const spark = q('.sapere__rule-spark')[0] as unknown as SVGPathElement | undefined

      if (prefersReducedMotion) {
        gsap.set(q('.rv, .sapere__sub, .sapere__caption'), { opacity: 1, y: 0, yPercent: 0 })
        if (base) base.style.strokeDashoffset = '0'
        if (spark) spark.style.opacity = '0'
        return
      }


      if (base) {
        const len = base.getTotalLength()
        gsap.set(base, { strokeDasharray: len, strokeDashoffset: len })
      }


      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })


      tl.fromTo(q('.sapere__video'), { opacity: 0.45 }, { opacity: 1, duration: 1 }, 0)


      tl.from(q('.section__line .rv'), {
        yPercent: 60,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.08,
        stagger: 0.012,
      }, 0.04)


      if (base) {
        tl.to(base, { strokeDashoffset: 0, duration: 0.22, ease: 'power1.inOut' }, 0.08)
      }


      if (spark) {
        tl.fromTo(
          spark,
          { strokeDashoffset: 26, opacity: 0.95 },
          { strokeDashoffset: -371, duration: 0.26 },
          0.05,
        )
        tl.to(spark, { opacity: 0, duration: 0.07 }, 0.31)
      }

      tl.from(q('.sapere__sub'), { opacity: 0, y: 24, duration: 0.09 }, 0.3)

      tl.from(q('.sapere__caption'), { opacity: 0, duration: 0.07 }, 0.42)
    },
    { scope: ref, dependencies: [copy] },
  )

  return (
    <section className="section section--sapere" data-world="sapere" id="sapere" ref={ref}>
      <div className="sapere__stage">
        <canvas ref={canvasRef} className="sapere__video" aria-hidden="true" />
        <div className="sapere__scrim" aria-hidden="true" />

        <div className="sapere__inner">
          <p className="section__eyebrow">{eyebrow('sapere', copy.titles.sapere)}</p>
          <Line className="section__line" text={copy.sapereLine} />
          <svg
            className="sapere__rule"
            viewBox="0 0 400 12"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            { }
            <path
              className="sapere__rule-base"
              d="M2 8 C 80 2, 160 11, 240 5 S 360 2, 398 7"
            />
            { }
            <path
              className="sapere__rule-spark"
              d="M2 8 C 80 2, 160 11, 240 5 S 360 2, 398 7"
            />
          </svg>
          <p className="sapere__sub">
            <em>{copy.sapereSubEm}</em>
            {copy.sapereSubRest}
          </p>
          <p className="sapere__caption">{copy.sapereCaption}</p>
        </div>
      </div>
    </section>
  )
}
