

import { useRef } from 'react'
import Line from '../components/Line'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { useCopy } from '../lib/i18n'

/**
 * 04 — Interlude: The Hands (film) ilə The Counterweight (film) arasında
 * nəfəs — onun "1 video · 1 videosuz" ritm qərarı (brief §16, M4-b).
 * Saf tipografiya, heç bir effektdən əlavə xərc yoxdur.
 */
export default function TheInterlude() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(q('.rv, .interlude__caption'), { opacity: 1 })
        return
      }

      gsap.from(q('.interlude__line .rv'), {
        yPercent: 70,
        opacity: 0,
        duration: 1,
        stagger: 0.055,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.interlude__line')[0], start: 'top 74%' },
      })
      gsap.from(q('.interlude__caption'), {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: q('.interlude__line')[0], start: 'top 62%' },
      })
    },
    { scope: ref },
  )

  return (
    <section className="section section--interlude" data-world="interlude" id="interlude" ref={ref}>
      <p className="section__eyebrow">{eyebrow('interlude')}</p>
      <Line className="section__line interlude__line" text={copy.interludeLine} />
      <p className="interlude__caption">{copy.interludeCaption}</p>
    </section>
  )
}
