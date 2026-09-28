

import { useRef } from 'react'
import Line from '../components/Line'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { useCopy } from '../lib/i18n'

/**
 * 04 — The Gap: videolar arasındaki nəfəs (onun §13 breather qərarı).
 * Videosuz, saf SVG + tipografiya. İki xətt yaxınlaşır — qığılcım kimi,
 * heç vaxt düşmür, yalnız az qalır (The Hands-ın cavabı).
 */
export default function TheGap() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(q('.gap__rule'), { scaleX: 1 })
        gsap.set(q('.gap__line .rv, .gap__caption'), { opacity: 1 })
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 78%',
          end: 'center 45%',
          scrub: 0.6,
        },
      })

      // iki xətt qarşı-qarşıya çəkilir — aradakı boşluq heç vaxt bağlanmır
      tl.fromTo(q('.gap__rule--from-left'), { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, 0)
      tl.fromTo(q('.gap__rule--from-right'), { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, 0.08)
      tl.fromTo(
        q('.gap__line .rv'),
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.4, stagger: 0.05 },
        0.3,
      )
      tl.fromTo(q('.gap__caption'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.62)
    },
    { scope: ref },
  )

  return (
    <section className="section section--gap" data-world="gap" id="gap" ref={ref}>
      <div className="gap__stage">
        <p className="section__eyebrow">{eyebrow('gap')}</p>

        <div className="gap__rules" aria-hidden="true">
          <span className="gap__rule gap__rule--from-left" />
          <span className="gap__rule gap__rule--from-right" />
        </div>

        <Line className="section__line gap__line" text={copy.gapLine} />
        <p className="gap__caption">{copy.gapCaption}</p>
      </div>
    </section>
  )
}
