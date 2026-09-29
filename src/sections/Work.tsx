


import { useRef } from 'react'
import Line from '../components/Line'
import { PROJECTS } from '../lib/site'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { useCopy } from '../lib/i18n'

export default function Work() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(q('.rv, .work__item'), { opacity: 1 })
        return
      }

      gsap.from(q('.section__line .rv'), {
        yPercent: 60,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.9,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.section__line')[0], start: 'top 82%' },
      })


      gsap.from(q('.work__item'), {
        yPercent: 105,
        opacity: 0,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.work__list')[0], start: 'top 84%' },
      })

      gsap.from(q('.work__foot'), {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.work__foot')[0], start: 'top 94%' },
      })
    },
    { scope: ref, dependencies: [copy] },
  )

  return (
    <section className="section section--work" data-world="work" id="work" ref={ref}>
      <p className="section__eyebrow">{eyebrow('work', copy.titles.work)}</p>
      <Line className="section__line" text={copy.workLine} />

      <ul className="work__list">
        {copy.projects.map((p, i) => {
          const href = PROJECTS[i]?.href ?? ''
          const year = PROJECTS[i]?.year ?? ''
          return (
            <li className="work__item" key={p.title}>
              <span className="work__index">{String(i + 1).padStart(2, '0')}</span>
              <div className="work__body">
                <h3 className="work__title">
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer noopener">
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </h3>
                <p className="work__meta">
                  <span>{p.kind}</span>
                  <span className="work__dot" aria-hidden="true">
                    ·
                  </span>
                  <span>{p.stack}</span>
                  <span className="work__dot" aria-hidden="true">
                    ·
                  </span>
                  <span>{year}</span>
                </p>
                <p className="work__blurb">{p.blurb}</p>
              </div>
            </li>
          )
        })}
      </ul>

            <p className="work__foot">{copy.workFoot}</p>
    </section>
  )
}
