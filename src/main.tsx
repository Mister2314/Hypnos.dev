import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap, ScrollTrigger } from './lib/scroll'
import { lenis } from './lib/lenis'
import { injectSpeedInsights } from '@vercel/speed-insights'
import App from './App'
import './styles/fonts.css'
import './styles/global.css'

// Initialize Vercel Speed Insights
injectSpeedInsights()

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
