


import { useEffect, useRef, useState } from 'react'
import { FAQ } from '../lib/site'
import { useCopy } from '../lib/i18n'
import { eyebrow, gsap, prefersReducedMotion } from '../lib/scroll'

const N = FAQ.length
const STEP = 360 / N

const DRAG_K = 0.32

const DRAG_MIN = 6


function shortest(from: number, to: number): number {
  let d = (((to - from) % 360) + 540) % 360 - 180
  if (d === -180) d = 180
  return from + d
}

export default function Questions() {
  const copy = useCopy()
  const faq = copy.faq
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pickRef = useRef<(i: number) => void>(() => {})
  const stepRef = useRef<(dir: 1 | -1) => void>(() => {})
  const [active, setActive] = useState(0)

  useEffect(() => {
    const stage = stageRef.current
    const ring = ringRef.current
    if (!stage || !ring) return

    const cards = Array.from(ring.querySelectorAll<HTMLElement>('.q-card'))
    const rot = { value: 0, target: 0 }
    let lockedUntil = 0
    let idx = 0



    const size = () => {
      const r = Math.max(185, Math.min(stage.clientWidth * 0.48, 430))
      stage.style.setProperty('--ring-r', `${r}px`)

      stage.style.setProperty('--ring-step', `${STEP}deg`)



      const chord = 2 * r * Math.sin(Math.PI / N)
      const cardW = Math.max(140, Math.min(340, chord - 18))
      stage.style.setProperty('--card-w', `${Math.round(cardW)}px`)
    }
    size()
    window.addEventListener('resize', size)

    const paint = () => {
      ring.style.transform = `translateZ(calc(var(--ring-r) * -1)) rotateY(${rot.value.toFixed(3)}deg)`
      for (let i = 0; i < cards.length; i++) {
        const a = (((rot.value + i * STEP) % 360) + 540) % 360 - 180
        const d = Math.abs(a) / 180
        cards[i].style.filter = `blur(${(d * 2.6).toFixed(2)}px)`
        cards[i].style.opacity = String(1 - d * 0.62)
      }
    }

    const lock = (ms: number) => {
      lockedUntil = performance.now() + ms
    }


    pickRef.current = (i: number) => {
      idx = i
      setActive(i)
      rot.target = shortest(rot.value, -i * STEP)
      lock(1200)
    }



    stepRef.current = (dir: 1 | -1) => {
      idx = (idx + dir + N) % N
      setActive(idx)
      rot.target = rot.target + dir * STEP
      lock(1400)
    }


    if (prefersReducedMotion) {
      stage.dataset.static = '1'
      paint()
      return () => window.removeEventListener('resize', size)
    }



    const onScroll = () => {
      if (performance.now() < lockedUntil) return
      const rect = stage.getBoundingClientRect()
      const vh = window.innerHeight
      const p = gsap.utils.clamp(0, 1, (vh - rect.top) / (vh + rect.height))
      rot.target = -p * 360
      const i = ((Math.round(p * N) % N) + N) % N
      if (i !== idx) {
        idx = i
        setActive(i)
      }
    }


    const tick = () => {
      const diff = rot.target - rot.value
      if (Math.abs(diff) < 0.02) return
      rot.value += diff * 0.11
      paint()
    }


    const drag = { on: false, x0: 0, rot0: 0, moved: 0 }
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      drag.on = true
      drag.x0 = e.clientX
      drag.rot0 = rot.target
      drag.moved = 0
      lock(1e9)
    }
    const onMove = (e: PointerEvent) => {
      if (!drag.on) return
      const dx = e.clientX - drag.x0
      drag.moved = Math.max(drag.moved, Math.abs(dx))
      rot.target = drag.rot0 - dx * DRAG_K
    }
    const onUp = () => {
      if (!drag.on) return
      drag.on = false
      if (drag.moved >= DRAG_MIN) {

        const nearest = Math.round(rot.target / STEP) * STEP
        rot.target = nearest
        const i = ((-Math.round(nearest / STEP) % N) + N) % N
        idx = i
        setActive(i)
      }
      lock(1200)
    }


    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        stepRef.current(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        stepRef.current(-1)
      }
    }

    gsap.ticker.add(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    stage.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    stage.addEventListener('keydown', onKey)
    onScroll()
    paint()

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', size)
      stage.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      stage.removeEventListener('keydown', onKey)
      pickRef.current = () => {}
      stepRef.current = () => {}
    }
  }, [])

  return (
    <section className="section section--questions" data-world="questions" id="questions">
      <p className="section__eyebrow">{eyebrow('questions')}</p>
      <h2 className="questions__head">{copy.questionsHead}</h2>

      <div className="ring-row">
        <button
          type="button"
          className="ring-arrow ring-arrow--prev"
          onClick={() => stepRef.current(-1)}
          aria-label="Previous question"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 4 L7 12 L15 20" />
          </svg>
        </button>

        <div
          className="ring-stage"
          ref={stageRef}
          tabIndex={0}
          role="group"
          aria-label="Question ring — use left and right arrow keys to turn it"
        >
          <div className="ring" ref={ringRef}>
            {faq.map((item, i) => (
              <button
                type="button"
                className="q-card"
                key={item.q}
                data-front={active === i ? '1' : '0'}
                onClick={() => pickRef.current(i)}
                aria-label={`Question ${i + 1} of ${N}: ${item.q}`}
              >
                <span className="q-card__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="q-card__q">{item.q}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="ring-arrow ring-arrow--next"
          onClick={() => stepRef.current(1)}
          aria-label="Next question"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 4 L17 12 L9 20" />
          </svg>
        </button>
      </div>

      <div className="questions__answer" key={active}>
        <p className="questions__a-text">{FAQ[active].a}</p>
        <div className="questions__controls">
          <span className="questions__count">
            {String(active + 1).padStart(2, '0')}
            <span className="questions__count-sep"> / </span>
            {String(N).padStart(2, '0')}
          </span>
          <div className="questions__dots">
            {faq.map((item, i) => (
              <button
                type="button"
                key={item.q}
                className="questions__dot"
                data-active={active === i ? '1' : '0'}
                onClick={() => pickRef.current(i)}
                aria-label={`Go to question ${i + 1}`}
              />
            ))}
          </div>
          <span className="questions__hint" aria-hidden="true">
            {copy.questionsHint}
          </span>
        </div>
      </div>
    </section>
  )
}
