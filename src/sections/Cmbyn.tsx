

import { useRef } from 'react'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { useCopy } from '../lib/i18n'

const BASE = import.meta.env.BASE_URL

/**
 * 03 — Call Me By Your Name: Summer-in vizual davamı (onun qərarı —
 * mətn və şəkil ayrı bölmələrdə, "sanki əvvəldən belə"). Şəkil yüngül
 * parallax ilə tənəffüs edir; heç bir əlavə effektdən bəhs yoxdur.
 */
export default function Cmbyn() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(q('.cmbyn__plate-img'), { opacity: 1, y: 0, scale: 1 })
        return
      }

      gsap.from(q('.cmbyn__plate-img'), {
        opacity: 0,
        y: 42,
        scale: 1.06,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.cmbyn__plate')[0], start: 'top 82%' },
      })

      gsap.fromTo(
        q('.cmbyn__plate-img'),
        { y: -30, scale: 1.05 },
        {
          y: 30,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      )
    },
    { scope: ref },
  )

  return (
    <section className="section section--cmbyn" data-world="cmbyn" id="cmbyn" ref={ref}>
      <p className="section__eyebrow">{eyebrow('cmbyn', copy.titles.cmbyn)}</p>
      <div className="cmbyn__plate">
        <img
          className="cmbyn__plate-img"
          src={`${BASE}scenes/summer-apricots.webp`}
          width={1500}
          height={1000}
          alt="Ripe apricots and a halved peach on a stone table in a sunlit garden."
          loading="lazy"
          decoding="async"
        />
        <span className="cmbyn__halftone" aria-hidden="true" />
      </div>
    </section>
  )
}
