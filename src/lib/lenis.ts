

import Lenis from 'lenis'

const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const lenis = reduced ? null : new Lenis({ autoRaf: false, duration: 1.15 })

export function scrollToId(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.15 })
  else el.scrollIntoView({ block: 'start' })
}
