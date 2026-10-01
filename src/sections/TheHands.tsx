

import { useRef } from 'react'
import Line from '../components/Line'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { useCopy } from '../lib/i18n'

const BASE = import.meta.env.BASE_URL

export default function TheHands() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      const reach = q('.hands__hand--reach')
      const open = q('.hands__hand--open')

      if (prefersReducedMotion) {
        gsap.set(q('.rv, .hands__caption'), { opacity: 1 })
        gsap.set(reach, { xPercent: -2, rotate: -0.5 })
        gsap.set(open, { xPercent: 2, rotate: 0.5 })
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      })

      tl.fromTo(reach, { xPercent: -26, rotate: -3 }, { xPercent: -2, rotate: -0.5, duration: 0.28 }, 0)
      tl.fromTo(open, { xPercent: 26, rotate: 3 }, { xPercent: 2, rotate: 0.5, duration: 0.28 }, 0)
      tl.fromTo(reach, { y: -18 }, { y: 0, duration: 0.28 }, 0)
      tl.fromTo(open, { y: 18 }, { y: 0, duration: 0.28 }, 0)

      tl.fromTo(
        q('.hands__spark'),
        { opacity: 0, scale: 0.35 },
        { opacity: 1, scale: 1, duration: 0.1 },
        0.2,
      )
      tl.to(q('.hands__spark'), { opacity: 0, scale: 2.4, duration: 0.16 }, 0.34)
      tl.to(q('.hands__hairline'), { opacity: 1, duration: 0.08 }, 0.26)
      tl.to(q('.hands__hairline'), { opacity: 0, duration: 0.1 }, 0.4)

      tl.to(reach, { xPercent: -34, y: -5, rotate: -6, duration: 0.5 }, 0.38)
      tl.to(open, { xPercent: 34, y: 5, rotate: 6, duration: 0.5 }, 0.38)

      tl.fromTo(q('.hands__caption'), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.2 }, 0.5)

      gsap.from(q('.hands__line .rv'), {
        yPercent: 70,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1,
        stagger: 0.055,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.hands__line')[0], start: 'top 72%' },
      })
    },
    { scope: ref, dependencies: [copy] },
  )

  return (
    <section className="section section--hands" data-world="hands" id="hands" ref={ref}>
      <div className="hands__stage">
        <div className="hands__zoom">
          <div className="hands__layer hands__layer--reach">
            <img
              className="hands__hand hands__hand--reach"
              src={`${BASE}hands/hand-reach.webp`}
              width={1200}
              height={800}
              alt={copy.a11y.handsReach}
              decoding="async"
            />
          </div>

          <div className="hands__layer hands__layer--open">
            <img
              className="hands__hand hands__hand--open"
              src={`${BASE}hands/hand-open.webp`}
              width={1200}
              height={742}
              alt={copy.a11y.handsOpen}
              decoding="async"
            />
          </div>

          <span className="hands__spark" aria-hidden="true" />
          <span className="hands__hairline" aria-hidden="true" />
        </div>

        <div className="hands__inner">
          <p className="section__eyebrow">{eyebrow('hands', copy.titles.hands)}</p>
          <Line className="section__line hands__line" text={copy.handsLine} />
          <p className="hands__caption">{copy.handsCaption}</p>
        </div>
      </div>
    </section>
  )
}
