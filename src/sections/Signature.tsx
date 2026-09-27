import { useRef } from 'react'
import Line from '../components/Line'
import { PROJECTS, SIGNATURE, SITE, links } from '../lib/site'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'

export default function Signature() {
  const ref = useRef<HTMLElement>(null)
  const socials = links()

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(
          q('.signature__close .rv, .socials li, .signature__work li, .signature__title, .signature__colophon'),
          { opacity: 1, y: 0, yPercent: 0 },
        )
        return
      }

      gsap.from(q('.signature__close .rv'), {
        yPercent: 70,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.9,
        stagger: 0.045,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.signature__close')[0], start: 'top 82%' },
      })

      gsap.from(q('.socials li'), {
        y: 26,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.socials')[0], start: 'top 88%' },
      })

      gsap.from(q('.signature__work li'), {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.signature__work')[0], start: 'top 92%' },
      })

      gsap.from(q('.signature__rule'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: q('.signature__rule')[0], start: 'top 96%' },
      })

      gsap.from(q('.signature__title'), {
        yPercent: 112,
        duration: 1.25,
        ease: 'power4.out',
        scrollTrigger: { trigger: q('.signature__title-mask')[0], start: 'top 94%' },
      })

      gsap.from(q('.signature__colophon, .signature__mark'), {
        opacity: 0,
        y: 14,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.signature__colophon')[0], start: 'top 96%' },
      })
    },
    { scope: ref },
  )

  return (
    <section className="section section--signature" data-world="signature" id="signature" ref={ref}>
      <p className="section__eyebrow">{eyebrow('signature')}</p>

      <Line
        tag="h2"
        className="signature__close"
        text={SIGNATURE.close}
      />

      {socials.length > 0 ? (
        <ul className="socials">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer noopener">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="socials--pending">
          The direct lines are still being wired up. The questions above are the honest way in for now.
        </p>
      )}

      <ul className="signature__work">
        {PROJECTS.map((p) => (
          <li key={p.title}>
            {p.href ? (
              <a href={p.href} target="_blank" rel="noreferrer noopener">
                {p.title}
              </a>
            ) : (
              <span>{p.title}</span>
            )}
          </li>
        ))}
      </ul>

      <p className="signature__colophon">{SIGNATURE.colophon}</p>

      <span className="signature__rule" aria-hidden="true" />

      <div className="signature__title-mask">
        <p className="signature__title">{SITE.name}</p>
      </div>

      <p className="signature__mark" aria-hidden="true">
        Sapere aude
      </p>
    </section>
  )
}
