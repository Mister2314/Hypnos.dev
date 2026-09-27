import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap, ScrollTrigger } from './lib/scroll'
import { lenis } from './lib/lenis'
import App from './App'
import './styles/fonts.css'
import './styles/global.css'

// Hər yükləmə hero-dan başlayır. Brauzerin scroll bərpası (refresh-də köhnə mövqe)
// fəsilləri yüklənməmiş tutub videonu sındırırdı — manual + top bu dəstəni kökündən silir.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

const smooth = lenis
if (smooth) {
  smooth.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => smooth.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

if (typeof document !== 'undefined' && 'fonts' in document) {
  document.fonts.ready.then(() => ScrollTrigger.refresh())
}
window.addEventListener('load', () => ScrollTrigger.refresh())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
