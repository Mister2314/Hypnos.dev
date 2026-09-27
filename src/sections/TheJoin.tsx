import { useRef } from 'react'
import { JOIN } from '../lib/site'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'

/**
 * 04 — The Join. The Hands-ın cavabı: boşluq burada bağlanır.
 * Videosuz breather — saf SVG kontur + scrub. Dekod/yükləmə yoxdur.
 */
export default function TheJoin() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)
      const strokes = q('.join__stroke') as unknown as SVGPathElement[]
      strokes.forEach((p) => {
        const len = p.getTotalLength()
        p.style.strokeDasharray = String(len)
        p.style.strokeDashoffset = String(len)
      })

      if (prefersReducedMotion) {
        strokes.forEach((p) => {
          p.style.strokeDashoffset = '0'
        })
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })

      tl.to(strokes, { strokeDashoffset: 0, duration: 0.4, stagger: 0.015 }, 0)
        .from(
          q('.join__arm--l'),
          { x: () => (window.innerWidth < 760 ? -110 : -150), duration: 0.48, ease: 'power1.inOut' },
          0.04,
        )
        .from(
          q('.join__arm--r'),
          { x: () => (window.innerWidth < 760 ? 110 : 150), duration: 0.48, ease: 'power1.inOut' },
          0.04,
        )
        // BISECT-D: bloom geri
        .fromTo(q('.join__bloom'), { opacity: 0, scale: 0.4 }, { opacity: 0.55, scale: 1, duration: 0.14 }, 0.48)
        .fromTo(
          q('.join__spark'),
          { scale: 0, opacity: 0, svgOrigin: '600 320' },
          { scale: 1, opacity: 1, duration: 0.06 },
          0.52,
        )
        .fromTo(
          q('.join__ring'),
          { scale: 0.2, opacity: 0.9, svgOrigin: '600 320' },
          { scale: 11, opacity: 0, duration: 0.24 },
          0.54,
        )
        .from(q('.join__line'), { yPercent: 70, opacity: 0, duration: 0.16 }, 0.58)
        .from(q('.join__sub'), { y: 16, opacity: 0, duration: 0.14 }, 0.68)
    },
    { scope: ref },
  )

  return (
    <section className="section section--join" data-world="join" id="join" ref={ref}>
      <div className="join__stage">
        <p className="section__eyebrow">{eyebrow('join')}</p>

        <div className="join__scene-wrap">
          <span className="join__bloom-wrap" aria-hidden="true">
            <span className="join__bloom" />
          </span>
          <svg className="join__scene" viewBox="0 0 1200 640" fill="none" aria-hidden="true">
            <g className="join__arm join__arm--l">
              <path className="join__stroke" d="M 560 322 C 380 362, 180 322, -80 356" />
              <path className="join__stroke join__stroke--fine" d="M 578 320 C 556 322, 528 328, 492 338" />
              <path className="join__stroke join__stroke--fine" d="M 568 338 C 546 340, 516 344, 478 350" />
              <circle className="join__tip" cx="586" cy="320" r="3" />
            </g>
            <g className="join__arm join__arm--r">
              <path className="join__stroke" d="M 640 322 C 820 362, 1020 322, 1280 356" />
              <path className="join__stroke join__stroke--fine" d="M 622 320 C 644 322, 672 328, 708 338" />
              <path className="join__stroke join__stroke--fine" d="M 632 338 C 654 340, 684 344, 722 350" />
              <circle className="join__tip" cx="614" cy="320" r="3" />
            </g>
            <circle className="join__spark" cx="600" cy="320" r="4" />
            <circle className="join__ring" cx="600" cy="320" r="10" />
          </svg>
        </div>

        <h2 className="join__line">{JOIN.line}</h2>
        <p className="join__sub">{JOIN.sub}</p>
      </div>
    </section>
  )
}
