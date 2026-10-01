

import { useEffect, useRef, useState } from 'react'
import { WORLDS, gsap, prefersReducedMotion } from '../lib/scroll'
import { scrollToId } from '../lib/lenis'
import { fmt, useCopy } from '../lib/i18n'

const CHAPTERS = WORLDS.filter((w) => w.n !== '')

export default function ChapterNav() {
  const copy = useCopy()
  const [active, setActive] = useState<string>('')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const targets = CHAPTERS.map((w) =>
      document.querySelector<HTMLElement>(`[data-world="${w.id}"]`),
    ).filter((el): el is HTMLElement => el !== null)
    if (!targets.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.world ?? '')
        }
      },

      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    for (const el of targets) io.observe(el)
    return () => io.disconnect()
    // v25: `<main key={lang}>` dil dəyişəndə bölmələri YENİDƏN yaradır —
    // observer köhnə (artıq DOM-dan çıxmış) elementlərə baxırdı və
    // fəsil göstəricisi donurdu. `copy` asılılığı yenidən qurur.
  }, [copy])

  useEffect(() => {
    const nav = ref.current
    if (prefersReducedMotion || !nav) return
    gsap.fromTo(
      nav.querySelectorAll('.chapter-nav__item'),
      { opacity: 0, x: 14 },
      { opacity: 1, x: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out', delay: 1.4 },
    )
  }, [])

  return (
    <nav className="chapter-nav" ref={ref} aria-label={copy.a11y.chapters}>
      <ol className="chapter-nav__list">
        {CHAPTERS.map((w) => (
          <li key={w.id} className="chapter-nav__item">
            <button
              type="button"
              className="chapter-nav__link"
              data-active={active === w.id ? '1' : '0'}
              onClick={() => scrollToId(w.id)}
              aria-current={active === w.id ? 'true' : undefined}
              aria-label={fmt(copy.a11y.chapter, { n: w.n, title: copy.titles[w.id] ?? w.title })}
            >
              <span className="chapter-nav__label">
                <span className="chapter-nav__num">{w.n}</span>
                <span className="chapter-nav__title">{copy.titles[w.id] ?? w.title}</span>
              </span>
              <span className="chapter-nav__dot" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
