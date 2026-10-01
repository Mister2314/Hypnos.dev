

import { Fragment, useRef } from 'react'
import { SITE } from '../lib/site'
import { ambient, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { fmt, useCopy } from '../lib/i18n'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {

        gsap.set(q('.hero__eyebrow, .hero__title, .hero__sub, .hero__sign, .hero__cue'), {
          opacity: 1,
        })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(q('.hero__eyebrow'), { y: 20, opacity: 0, duration: 0.7 })
        .from(
          q('.hero__word'),
          { yPercent: 60, opacity: 0, filter: 'blur(10px)', duration: 1.1, stagger: 0.09 },
          '-=0.35',
        )
        .from(q('.hero__sub'), { y: 18, opacity: 0, duration: 0.8 }, '-=0.6')
        .from(q('.hero__sign'), { opacity: 0, y: 14, duration: 0.9 }, '-=0.5')
        .from(q('.hero__cue'), { opacity: 0, duration: 0.6 }, '-=0.35')

      gsap.to(q('.hero__inner'), {
        yPercent: -12,
        scale: 0.94,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      gsap.to(q('.hero__sign'), {
        xPercent: 6,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      ambient(q('.hero__sign'), { y: -6, rotate: -0.9 }, 7)

      ambient(q('.hero__cue-text'), { y: 3, opacity: 0.55 }, 4.5)
    },
    // v14: dil dəyişəndə animasiyalar yeni elementlərə qurulur — köhnələrinə yox
    { scope: ref, dependencies: [copy] },
  )

  return (
    <section className="section section--hero" data-world="hero" id="hero" ref={ref}>
      <div className="hero__inner">
        <p className="section__eyebrow hero__eyebrow">Portfolio · 2026</p>
        <h1 className="hero__title">
          {copy.heroTitle.map((w, i) => (
            <Fragment key={i}>
              {i > 0 && ' '}
              <span className={i === copy.heroTitle.length - 1 ? 'hero__word hero__word--name' : 'hero__word'}>
                {w}
              </span>
            </Fragment>
          ))}
        </h1>
        <p className="hero__sub">{copy.heroSub}</p>
      </div>

      <p className="hero__sign" aria-label={fmt(copy.a11y.signed, { name: SITE.name })}>
        {SITE.name}
      </p>

      <div className="hero__cue" aria-hidden="true">
        <span className="hero__cue-line" />
        <span className="hero__cue-text">{copy.heroCue}</span>
      </div>
    </section>
  )
}
