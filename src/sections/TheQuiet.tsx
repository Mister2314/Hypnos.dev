


import { useEffect, useRef } from 'react'
import { ScrollTrigger, eyebrow, gsap, prefersReducedMotion } from '../lib/scroll'
import { QUIET } from '../lib/site'


const QUIET_S = 6.5

const STILL_MS = 220

const R = 21

export default function TheQuiet() {
  const ref = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const ring = ringRef.current
    if (!stage || !ring) return

    const circ = 2 * Math.PI * R
    ring.style.strokeDasharray = String(circ)
    ring.style.strokeDashoffset = String(circ)

    if (prefersReducedMotion) {
      ring.style.strokeDashoffset = '0'
      stage.classList.add('is-open')
      return
    }

    let active = false
    let hold = 0
    let lastScroll = -1e9
    const now = () => performance.now()

    const onScroll = () => {
      lastScroll = now()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 72%',
      end: 'bottom 28%',
      onToggle: (self) => {
        active = self.isActive
      },
    })

    const tick = (_time: number, delta: number) => {
      const dt = Math.min(0.05, (delta || 16.7) / 1000)
      const still = active && now() - lastScroll > STILL_MS


      hold += still ? dt : -dt * 2.4
      hold = Math.max(0, Math.min(QUIET_S, hold))

      ring.style.strokeDashoffset = String(circ * (1 - hold / QUIET_S))

      if (hold >= QUIET_S && !stage.classList.contains('is-open')) {
        stage.classList.add('is-open')
      } else if (hold < QUIET_S * 0.35 && stage.classList.contains('is-open')) {
        stage.classList.remove('is-open')
      }
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('scroll', onScroll)
      st.kill()
    }
  }, [])

  return (
    <section className="section section--quiet" data-world="quiet" id="quiet" ref={ref}>
      <div className="quiet__sticky" ref={stageRef}>
        <div className="quiet__glow" aria-hidden="true" />
        <div className="quiet__ripples" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="quiet__core">
          <svg className="quiet__ring" viewBox="0 0 48 48" aria-hidden="true">
            <circle className="quiet__ring-track" cx="24" cy="24" r={R} />
            <circle className="quiet__ring-fill" cx="24" cy="24" r={R} ref={ringRef} />
          </svg>
          <span className="quiet__dot" aria-hidden="true" />
          <span className="quiet__hold">{QUIET.hold}</span>
        </div>

        <div className="quiet__copy">
          <p className="section__eyebrow">{eyebrow('quiet')}</p>
          <h2 className="quiet__head">{QUIET.head}</h2>
          <p className="quiet__sub">{QUIET.sub}</p>
        </div>

        <p className="quiet__reward">{QUIET.reward}</p>
      </div>
    </section>
  )
}
