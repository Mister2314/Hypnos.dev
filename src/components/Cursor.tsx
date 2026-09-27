


import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/scroll'

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || prefersReducedMotion) return
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    document.documentElement.classList.add('has-cursor')

    const rx = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3.out' })
    const ry = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3.out' })
    const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
    const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })

    let shown = false
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.to([ring, dot], { opacity: 1, duration: 0.3 })
      }
      rx(e.clientX)
      ry(e.clientY)
      dx(e.clientX)
      dy(e.clientY)
    }


    const HOVER = 'a, button, input, textarea, [data-cursor="grow"]'
    const grow = () => gsap.to(ring, { scale: 2.1, duration: 0.35, ease: 'power3.out' })
    const shrink = () => gsap.to(ring, { scale: 1, duration: 0.35, ease: 'power3.out' })

    const over = (e: Event) => {
      const t = e.target as HTMLElement | null
      if (t?.closest?.(HOVER)) grow()
    }
    const out = (e: Event) => {
      const t = e.target as HTMLElement | null
      if (t?.closest?.(HOVER)) shrink()
    }

    const leave = () => {
      gsap.to([ring, dot], { opacity: 0, duration: 0.25 })
      shown = false
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, true)
    document.addEventListener('pointerout', out, true)
    document.documentElement.addEventListener('pointerleave', leave)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over, true)
      document.removeEventListener('pointerout', out, true)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <>
      <div className="cursor cursor--ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor cursor--dot" ref={dotRef} aria-hidden="true" />
    </>
  )
}
