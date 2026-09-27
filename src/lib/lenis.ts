/**
 * Lenis — yumşaq scroll, tək nüsxə.
 *
 * ⚠️ Niyə ayrı fayl: `main.tsx` onu yaradır, `ChapterNav` isə onunla scroll edir.
 * `main`-dən import etsək dairəvi asılılıq olar (`main → App → ChapterNav → main`).
 * Modul səviyyəsində yaradılır — brauzerdə bir dəfə işləyir, SSR yoxdur.
 *
 * `prefers-reduced-motion` → Lenis **yoxdur**, `scrollToId` yerli `scrollIntoView` işlədir.
 */
import Lenis from 'lenis'

const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const lenis = reduced ? null : new Lenis({ autoRaf: false, duration: 1.15 })

/** Bölməyə yumşaq sürüş. `id` — bölmənin `id` atributu. */
export function scrollToId(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.15 })
  else el.scrollIntoView({ block: 'start' })
}
