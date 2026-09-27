/**
 * Sequence — 2.5D büst ardıcıllığı.
 *
 * 101 WebP kadr canvas-a çəkilir, scroll-a bağlanır.
 * Kadrlar **qaba-sonra-sıx** yüklənir: əvvəl hər 8-ci, sonra boşluqlar.
 * Yüklənməmiş kadr istənəndə ən yaxın yüklənmiş kadr çəkilir → heç vaxt boş ekran yox.
 *
 * ⚠️ SCROLL BÜDCƏSİ — CSS-DƏDİR, `pin` İLƏ DEYİL.
 * Əvvəl `pin: true` + `end: '+=300%'` idi → ScrollTrigger pin-spacer yaradırdı, amma
 * məsafə **0** çıxırdı (spacer = element hündürlüyü, ölçüldü: 748px). Nəticə: büst
 * scroll boyu yerində qalmırdı. İndi:
 *   `.section--marble { min-height: 400svh }`  → scroll büdcəsi
 *   `.sequence        { position: sticky }`     → yerində saxlayan native CSS
 *   ScrollTrigger     → yalnız `top top` → `bottom bottom` (400svh − 100svh = 300svh)
 * Səbəb: sticky **layout-a toxunmur** — spacer yox, refresh sırası problemi yox,
 * `anticipatePin` hiyləsi yox, resize-da avtomatik düzgün.
 *
 * `prefers-reduced-motion` → scroll bağlanır, statik kadr qalır.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'

type Props = {
  frameCount: number
  /** `set` = 1920 (masaüstü) | 1024 (mobil) */
  srcFor: (index: number, set: 1920 | 1024) => string
  poster?: string
  label: string
  /** sticky qabın İÇİNDƏ render olunur — üzərinə düşən mətn */
  children?: ReactNode
}

const COARSE = 8

export default function Sequence({ frameCount, srcFor, poster, label, children }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef<(i: number) => void>(() => {})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const set: 1920 | 1024 = window.innerWidth < 768 ? 1024 : 1920

    const imgs: (HTMLImageElement | undefined)[] = new Array(frameCount)
    const attempted: boolean[] = new Array(frameCount).fill(false)
    let current = 0
    let disposed = false

    const sizeCanvas = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
    }

    const paint = (img: HTMLImageElement) => {
      const cw = canvas.width
      const ch = canvas.height
      const ir = img.naturalWidth / img.naturalHeight
      const cr = cw / ch
      let dw: number
      let dh: number
      if (ir > cr) {
        dh = ch
        dw = ch * ir
      } else {
        dw = cw
        dh = cw / ir
      }
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    /** Ən yaxın yüklənmiş kadrı tap — iki tərəfə axtarır. */
    const nearest = (i: number): number => {
      const at = imgs[i]
      if (at && at.complete && at.naturalWidth) return i
      for (let d = 1; d < frameCount; d++) {
        const lo = imgs[i - d]
        if (lo && lo.complete && lo.naturalWidth) return i - d
        const hi = imgs[i + d]
        if (hi && hi.complete && hi.naturalWidth) return i + d
      }
      return -1
    }

    const draw = (i: number) => {
      if (disposed) return
      current = Math.max(0, Math.min(frameCount - 1, i))
      const n = nearest(current)
      if (n >= 0) paint(imgs[n]!)
    }
    drawRef.current = draw

    const load = (i: number) => {
      if (i < 0 || i >= frameCount || attempted[i]) return
      attempted[i] = true
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (disposed) return
        imgs[i] = img
        if (i === 0) setReady(true)
        // istənən kadra yaxındırsa — ekranı dərhal yenilə
        if (Math.abs(i - current) <= COARSE) draw(current)
      }
      img.onerror = () => {
        attempted[i] = false
      }
      img.src = srcFor(i, set)
    }

    const onResize = () => {
      sizeCanvas()
      draw(current)
    }

    sizeCanvas()

    // ⚠️ `useGSAP` (useLayoutEffect) bu effect-dən ƏVVƏL işləyir → orada `drawRef` hələ
    // no-op-dur. Ona görə reduced-motion statik kadrı BURADA istəyirik.
    if (prefersReducedMotion) draw(0)

    // 1) Qaba keçid — hər 8-ci kadr + sonuncu
    for (let i = 0; i < frameCount; i += COARSE) load(i)
    load(frameCount - 1)
    load(0)

    // 2) Sıx keçid — boşluqlar, boş vaxtda
    const idle = (cb: () => void) => {
      const ric = (window as unknown as { requestIdleCallback?: (f: () => void) => number })
        .requestIdleCallback
      if (ric) ric(cb)
      else window.setTimeout(cb, 900)
    }
    idle(() => {
      for (let i = 1; i < frameCount; i++) if (i % COARSE !== 0) load(i)
    })

    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      window.removeEventListener('resize', onResize)
      drawRef.current = () => {}
    }
  }, [frameCount, srcFor])

  useGSAP(
    () => {
      // reduced-motion → scroll bağlanır. Statik kadrı canvas effect-i çəkir
      // (`drawRef` bu mərhələdə hələ qurulmayıb — səbəbi yuxarıda yazılıb).
      if (prefersReducedMotion) return
      // Scroll büdcəsi sticky-ni əhatə edən `.section`-dədir — trigger odur.
      const host = wrapRef.current?.closest('.section') ?? wrapRef.current
      const state = { frame: 0 }
      gsap.to(state, {
        frame: frameCount - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: host,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        // kadr tam ədədə yuvarlaqlaşdırılır — `snap` əvəzinə (rəsmi API-də yoxdur)
        onUpdate: () => drawRef.current(Math.round(state.frame)),
      })
    },
    { scope: wrapRef },
  )

  return (
    <div className="sequence" ref={wrapRef}>
      {poster && (
        <img
          className="sequence__poster"
          src={poster}
          alt=""
          aria-hidden="true"
          data-ready={ready ? '1' : '0'}
        />
      )}
      <canvas ref={canvasRef} className="sequence__canvas" aria-hidden="true" />
      <span className="sequence__sr">{label}</span>
      {children}
    </div>
  )
}
