


import { Fragment, useEffect, useRef } from 'react'
import Line from '../components/Line'
import { ambient, eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { LEAP } from '../lib/site'
import { useCopy } from '../lib/i18n'
import { mountSequence } from '../lib/sequence'

export default function TheLeap() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()
  const nahWords = copy.leapNah.split(' ')
  const canvasRef = useRef<HTMLCanvasElement>(null)


  useEffect(
    () =>
      mountSequence({
        canvas: canvasRef.current!,
        trigger: ref.current,
        highDir: 'leap/frames-1440',
        lowDir: 'leap/frames-960',
        poster: 'leap/poster-1920.webp',
        // v20: mobil portret kəsimdə Miles-in üzü sağ-mərkəzdədir (~0.68) —
        // kadro onu mərkəzə alır (şəkilə özüm baxıb təyin etdim)
        focusXMobile: 0.72,
        ease: 0.07,
        trackProgress: true,
      }),
    [],
  )

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)
      const words = q('.leap__nw')

      if (prefersReducedMotion) {
        gsap.set(q('.leap__quote .rv, .leap__source'), { opacity: 1, y: 0, yPercent: 0 })
        gsap.set(words, {
          opacity: 1,
          x: 0,
          textShadow: '0px 0px rgba(0,252,253,0), 0px 0px rgba(255,0,254,0)',
        })
        return
      }



      gsap.set(words, {
        opacity: 0,
        x: () => gsap.utils.random(-14, 14),
        textShadow: '5px 0 rgba(0,252,253,0.7), -5px 0 rgba(255,0,254,0.7)',
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


      tl.fromTo(q('.leap__video'), { opacity: 0.4 }, { opacity: 1, duration: 1 }, 0)


      tl.fromTo(q('.leap__halftone'), { opacity: 0 }, { opacity: 0.4, duration: 0.25 }, 0.05)
      tl.to(q('.leap__halftone'), { opacity: 0.26, duration: 0.2 }, 0.78)


      tl.from(
        q('.leap__quote .rv'),
        { yPercent: 110, duration: 0.06, ease: 'steps(3)', stagger: 0.012 },
        0.02,
      )

      tl.from(q('.leap__source'), { opacity: 0, y: 10, duration: 0.07 }, 0.24)



      tl.to(
        words,
        {
          opacity: 1,
          x: 0,
          textShadow: '0px 0px rgba(0,252,253,0), 0px 0px rgba(255,0,254,0)',
          duration: 0.08,
          ease: 'power3.out',
          stagger: 0.012,
        },
        0.5,
      )


      tl.to(
        words,
        { textShadow: '4px 0 rgba(0,252,253,0.7), -4px 0 rgba(255,0,254,0.7)', duration: 0.015 },
        0.73,
      )
      tl.to(
        words,
        { textShadow: '0px 0px rgba(0,252,253,0), 0px 0px rgba(255,0,254,0)', duration: 0.02 },
        0.745,
      )


      const riseTargets = [canvasRef.current, q('.leap__inner')[0]].filter(Boolean)
      tl.to(riseTargets, { yPercent: -3.5, duration: 0.16, ease: 'power2.inOut' }, 0.8)


      ambient(q('.leap__source'), { y: -2 }, 9)
    },
    { scope: ref, dependencies: [copy] },
  )

  return (
    <section className="section section--leap" data-world="leap" id="leap" ref={ref}>
      <div className="leap__stage">
        <canvas ref={canvasRef} className="leap__video" aria-hidden="true" />
        <div className="leap__halftone" aria-hidden="true" />
        <div className="leap__scrim" aria-hidden="true" />

        <div className="leap__inner">
          <p className="section__eyebrow">{eyebrow('leap', copy.titles.leap)}</p>

          <Line tag="h2" className="leap__quote" text={copy.leapQuote} />

          <p className="leap__source">— {LEAP.source}</p>

          {

 }
          <p className="leap__nah" aria-label={copy.leapNah}>
            {nahWords.map((w, i) => (
              <Fragment key={i}>
                <span className="leap__nw" aria-hidden="true">
                  {w}
                </span>
                {i < nahWords.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
