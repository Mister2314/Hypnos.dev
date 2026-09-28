


import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { WORLDS, eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { useCopy } from '../lib/i18n'
import { scrollToId } from '../lib/lenis'

export default function Worlds() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(q('.world-card'), { opacity: 1, y: 0, filter: 'blur(0px)' })
        return
      }

      gsap.from(q('.world-card'), {
        opacity: 0,
        y: 26,
        filter: 'blur(8px)',
        duration: 0.6,
        stagger: 0.028,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.worlds__grid')[0], start: 'top 82%' },
      })

      gsap.from(q('.worlds__note, .worlds__head'), {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.worlds__head')[0], start: 'top 88%' },
      })
    },
    { scope: ref },
  )

  return (
    <section className="section section--worlds" data-world="worlds" id="worlds" ref={ref}>
      <p className="section__eyebrow">{eyebrow('worlds')}</p>
      <h2 className="worlds__head">{copy.worldsHead}</h2>
      <p className="worlds__note">{copy.worldsNote}</p>

      <ul className="worlds__grid">
        {WORLDS.map((w) => (
          <li key={w.id} className="worlds__cell">
            <button
              type="button"
              className="world-card"
              style={{ '--card-bg': w.bg, '--card-fg': w.text, '--card-ac': w.accent } as CSSProperties}
              onClick={() => scrollToId(w.id)}
              aria-label={`Go to ${w.n ? `chapter ${w.n} — ` : ''}${w.title}`}
            >
              <span className="world-card__num">{w.n || '00'}</span>
              <span className="world-card__title">{w.title}</span>
              <span className="world-card__swatch" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
