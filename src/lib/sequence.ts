


import { gsap, prefersReducedMotion, ScrollTrigger } from './scroll'
import { PERF, isNarrow } from './perf'
import { setLoaderFrames } from './loader'
import { sizeCanvas } from './webgl'

const BASE = import.meta.env.BASE_URL


const PARALLEL = 8

export type SequenceSpec = {
  canvas: HTMLCanvasElement

  trigger: HTMLElement | null

  highDir: string

  lowDir: string

  poster: string

  ease?: number


  focusX?: number

  trackProgress?: boolean
}

export function mountSequence(spec: SequenceSpec): () => void {
  const { canvas, trigger, highDir, lowDir, poster: posterPath } = spec
  if (!canvas || !trigger) return () => {}
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.style.display = 'none'
    return () => {}
  }

  const dir = isNarrow() ? lowDir : highDir
  const progressRef = { v: 0 }
  // mobil: daha kiçik dekod pəncərəsi — giriş burstlarını endirir
  const AHEAD = isNarrow() ? 10 : PERF.decodeAhead

  const poster = new Image()
  poster.decoding = 'async'
  poster.src = BASE + posterPath

  const cover = (img: HTMLImageElement | ImageBitmap) => {
    const s = Math.max(canvas.width / img.width, canvas.height / img.height)
    const dw = img.width * s
    const dh = img.height * s
    const fx = spec.focusX ?? 0.5
    ctx.drawImage(img, (canvas.width - dw) * fx, (canvas.height - dh) / 2, dw, dh)
  }


  const imgs: (HTMLImageElement | null)[] = []

  const bitmaps = new Map<number, ImageBitmap>()
  const bitmapWip = new Set<number>()
  let decodedCount = 0
  let loadedCount = 0

  // loader pərdəsi üçün real progress: yükləmə 35% + ilk dekod pəncərəsi 65%
  let bootTimer: ReturnType<typeof setInterval> | null = null
  const bootN = () => Math.max(1, Math.min(n, AHEAD + 2))
  const reportProgress = () => {
    if (!spec.trackProgress || !n) return
    setLoaderFrames(0.35 * (loadedCount / n) + 0.65 * Math.min(1, decodedCount / bootN()))
  }

  const grain: HTMLCanvasElement[] = []
  let n = 0
  let contig = 0
  let idx = 0

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const target = Math.min(idx, Math.max(0, contig - 1))



    // ən yaxın hazır bitmap — HƏR İKİ istiqamətdə: yuxarı scroll-da da video
    // davam edir (əvvəl axtarış yalnız geriyə idi → geri gələndə posterə düşürdü)
    let bmp: ImageBitmap | null = null
    let best = Infinity
    for (const [k, b] of bitmaps) {
      const d = Math.abs(k - target)
      if (d < best) {
        best = d
        bmp = b
      }
    }
    if (!bmp) {
      if (poster.complete && poster.naturalWidth > 0) cover(poster)
      return
    }
    cover(bmp)



    const g = grain[target % 2]
    if (g) {
      ctx.globalCompositeOperation = 'overlay'
      ctx.drawImage(g, 0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'source-over'
    }
  }

  const resize = () => {
    if (sizeCanvas(canvas, PERF.canvasDpr)) {
      paintGrain()
      draw()
    }
  }


  const paintGrain = () => {
    for (let k = 0; k < 2; k++) {
      let g = grain[k]
      if (!g) {
        g = document.createElement('canvas')
        grain[k] = g
      }
      g.width = canvas.width
      g.height = canvas.height
      const gtx = g.getContext('2d')
      if (!gtx) continue
      const img = gtx.createImageData(g.width, g.height)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0
        d[i] = v
        d[i + 1] = v
        d[i + 2] = v
        d[i + 3] = 255
      }
      gtx.putImageData(img, 0, 0)
    }
  }

  const bumpContig = () => {
    while (contig < n && imgs[contig]) contig++
  }




  let bitmapBudget = 0
  let prevCenter = 0
  const pumpBitmaps = (center: number) => {
    // dekod pəncərəsi hərəkət istiqamətinə açıqdır: aşağı gedəndə irəli,
    // yuxarı qayıtda geriyə — hər iki istiqamətdə video hazırdır
    const forward = center >= prevCenter
    prevCenter = center
    bitmapBudget = isNarrow() ? 1 : 3
    const lo = forward ? Math.max(0, center - 2) : Math.max(0, center - 1 - AHEAD)
    const hi = forward ? Math.min(n - 1, center + 1 + AHEAD) : Math.min(n - 1, center + 2)
    for (let i = lo; i <= hi && bitmapBudget > 0; i++) {
      if (bitmaps.has(i) || bitmapWip.has(i) || !imgs[i]) continue
      bitmapWip.add(i)
      bitmapBudget--
      const img = imgs[i]!
      createImageBitmap(img)
        .then((bm) => {
          bitmaps.set(i, bm)
          bitmapWip.delete(i)
          decodedCount++
          reportProgress()
          if (i === idx) draw()
        })
        .catch(() => {
          bitmapWip.delete(i)
        })
    }

    if (bitmaps.size > AHEAD + 10) {
      for (const key of [...bitmaps.keys()]) {
        if (key < center - AHEAD - 6 || key > center + AHEAD + 6) {
          bitmaps.get(key)?.close()
          bitmaps.delete(key)
        }
      }
    }
  }

  const loadChunk = (from: number) => {
    let pending = 0
    for (let i = from; i < Math.min(n, from + PARALLEL); i++) {
      pending++
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        imgs[i] = img
        loadedCount++
        reportProgress()
        bumpContig()
        if (--pending === 0 && Math.min(n, from + PARALLEL) < n) loadChunk(from + PARALLEL)
      }
      img.onerror = () => {
        loadedCount++
        reportProgress()

        if (--pending === 0 && Math.min(n, from + PARALLEL) < n) loadChunk(from + PARALLEL)
      }
      img.src = `${BASE}${dir}/s_${String(i + 1).padStart(3, '0')}.webp`
    }
  }




  let downloadStarted = false
  const startDownload = (attempt = 0) => {
    if (attempt === 0) {
      if (downloadStarted) return
      downloadStarted = true
    }
    fetch(`${BASE}${highDir.split('/')[0]}/manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((m: { n: number }) => {
        n = m.n
        imgs.length = n
        loadChunk(0)

        // loader açılmamışdan əvvəl scroll blokludur → scroll pompası işləmir.
        // İlk dekod pəncərəsini müstəqil pompala — progress real yüksəlir.
        if (spec.trackProgress && !prefersReducedMotion) {
          bootTimer = setInterval(() => {
            pumpBitmaps(0)
            reportProgress()
            if (decodedCount >= bootN() && bootTimer) {
              clearInterval(bootTimer)
              bootTimer = null
            }
          }, 90)
        }
      })
      .catch(() => {
        // keçici şəbəkə xətası: poster fallback var, 2 dəfəyə qədər yenidən cəhd
        if (attempt < 2) setTimeout(() => startDownload(attempt + 1), 1200 * (attempt + 1))
      })
  }
  const dlIo = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        dlIo.disconnect()
        startDownload()
      }
    },
    { rootMargin: '250% 0px' },
  )
  dlIo.observe(canvas)
  // loader-gated fəsil (leap): refresh hansı mövqedən başlayarsa başlasın,
  // pərdənin progressi və hazırlığı mövqeydən asılı olmasın
  if (spec.trackProgress) startDownload()


  poster.onload = () => {
    if (contig === 0) draw()
  }

  resize()
  window.addEventListener('resize', resize)

  const st = ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      progressRef.v = self.progress
    },
  })

  let running = false
  const io = new IntersectionObserver(
    ([entry]) => {
      running = entry.isIntersecting
    },
    { rootMargin: '25% 0px' },
  )
  io.observe(canvas)

  let smooth = 0
  let tick: (() => void) | null = null

  const cleanup = () => {
    if (tick) gsap.ticker.remove(tick)
    if (bootTimer) clearInterval(bootTimer)
    window.removeEventListener('resize', resize)
    dlIo.disconnect()
    io.disconnect()
    st.kill()
    for (const bm of bitmaps.values()) bm.close()
    bitmaps.clear()
  }


  if (prefersReducedMotion) {
    if (poster.complete && poster.naturalWidth > 0) draw()
    else poster.onload = () => draw()
    return cleanup
  }

  tick = () => {
    if (!running) return
    smooth += (progressRef.v - smooth) * (spec.ease ?? 0.08)
    const next = Math.round(smooth * Math.max(1, n - 1))
    if (next !== idx) {
      idx = next
      pumpBitmaps(idx)
      draw()
    } else {
      pumpBitmaps(idx)
    }
  }
  gsap.ticker.add(tick)

  return cleanup
}
