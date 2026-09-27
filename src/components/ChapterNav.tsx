/**
 * ChapterNav — sağ kənarda fəsil relsi.
 *
 * Hər dünyaya bir nöqtə. `n: ''` olan fəsil (Hero) relsdə **görünmür** — o, girişdir,
 * fəsil deyil. Aktiv fəsil scroll-la işarələnir; kliklə həmin bölməyə sürüşür.
 *
 * ⚠️ Aktivlik **`IntersectionObserver`** ilə tapılır, `ScrollTrigger` ilə YOX.
 * Səbəb: pin-lər layout-u dəyişir, trigger mövqeləri isə refresh sırasına bağlıdır.
 * IO layout-dan asılı deyil — ekranın ortasındaki zolağa hansı fəsil düşürsə, o aktivdir.
 *
 * ⚠️ Mətn **yalnız hover/focus**-da açılır — rels sakit qalır, oxunuşu pozmur.
 * `aria-label` həmişə var → ekran oxuyucusu üçün gizli deyil.
 */
import { useEffect, useRef, useState } from 'react'
import { WORLDS, gsap, prefersReducedMotion } from '../lib/scroll'
import { scrollToId } from '../lib/lenis'

const CHAPTERS = WORLDS.filter((w) => w.n !== '')

export default function ChapterNav() {
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
      // Ekranın ortasındaki 10% zolaq — hansı fəsil oradadırsa, o aktivdir.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    for (const el of targets) io.observe(el)
    return () => io.disconnect()
  }, [])

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
    <nav className="chapter-nav" ref={ref} aria-label="Chapters">
      <ol className="chapter-nav__list">
        {CHAPTERS.map((w) => (
          <li key={w.id} className="chapter-nav__item">
            <button
              type="button"
              className="chapter-nav__link"
              data-active={active === w.id ? '1' : '0'}
              onClick={() => scrollToId(w.id)}
              aria-current={active === w.id ? 'true' : undefined}
              aria-label={`Chapter ${w.n} — ${w.title}`}
            >
              <span className="chapter-nav__label">
                <span className="chapter-nav__num">{w.n}</span>
                <span className="chapter-nav__title">{w.title}</span>
              </span>
              <span className="chapter-nav__dot" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
