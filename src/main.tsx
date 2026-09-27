import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap, ScrollTrigger } from './lib/scroll'
import { lenis } from './lib/lenis'
import App from './App'
import './styles/fonts.css'
import './styles/global.css'

// Lenis — yumşaq scroll. GSAP ticker ilə sinxron: `scrub` düzgün işləsin.
// `autoRaf: false` → raf-ı özümüz idarə edirik (ticker), yoxsa iki rAF döyüşər.
// ⚠️ Lenis `lib/lenis.ts`-də yaradılır — `ChapterNav` də ondan scroll edir (dairəvi import olmasın).
// ⚠️ Yerli dəyişənə köçürürük: TS ixrac olunmuş `const`-un daralmasını closure-da saxlamır.
const smooth = lenis
if (smooth) {
  smooth.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => smooth.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

// Şriftlər yüklənəndə mətn ölçüsü dəyişir → trigger mövqeləri köhnəlir.
// Rəsmi GSAP qaydası: layout dəyişdisə `ScrollTrigger.refresh()`.
// Bu, `Backdrop`-ın ölçməsini də yeniləyir (o, `refresh` hadisəsini dinləyir).
if (typeof document !== 'undefined' && 'fonts' in document) {
  document.fonts.ready.then(() => ScrollTrigger.refresh())
}
window.addEventListener('load', () => ScrollTrigger.refresh())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
