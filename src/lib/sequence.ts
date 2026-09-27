/**
 * sequence.ts — scroll-scrub frame ardıcıllığı (§5.1: video yox, WebP kadr).
 *
 * İstifadəçilər: `05 SpeakOrDie` (qatar) · `04 SapereAude` (həyət) ·
 * `03 TheCounterweight` (astral) · `13 TheLeap` (bio-elektrik).
 * Üçüncü gəlsə — bu fayla toxunmadan yeni spec kifayətdir.
 *
 * **v6.9 — PERFORMANS ARXITEKTURASI** (ölçmə: `tools/perf-loop.mjs`; bazа:
 * dropped 33.3%, max 600ms donma — Khayalın «donur» şikayəti rəqəmləşdi):
 *
 *   1. **ImageBitmap pəncərəsi (əsas düzəliş).** 651 kadr `<img>` kimi
 *      saxlanılanda bruzer dekodlanmış datasını evik edir → hər drawImage
 *      vaxtaşırı MAIN-THREAD-də sinxron yenidən dekod = 0.5s donmalar
 *      (qeyri-dəqiq, cache təzyiqindən asılı). İndi: scrub pəncərəsindəki
 *      kadr-lar `createImageBitmap` ilə **sahib olunan bitmap**-ə çevrilir
 *      (evik olunmur), köhnələnlər `close()` ilə azad edilir → yaddaş
 *      pəncərə ilə məhduddur (~24 × 3MB), draw = GPU blit, jank yoxdur.
 *   2. **DPR 1** (`PERF.canvasDpr`) — foto + qran + scrim altında kifayət.
 *   3. Qovluq seçimi enə görə (`isNarrow()`): mobil aşağı qat kadrları.
 *   4. `<video>` YOX: `currentTime` scrub-u iOS-da təkanlıdır; frame swap
 *      scroll ilə piksel-dəqiqdir.
 *
 * Necə işləyir:
 *   · **poster dərhal** çəkilir — kadr-lar gələnə qədər arxa plan budur
 *   · manifest → ardıcıl YÜKLƏMƏ (pəncərə = PARALLEL; yüklənmiş = sıxılmış,
 *     ucuz) → yüklənmiş prefiks `contig`
 *   · pəncərə: [idx−2 … idx+decodeAhead] bitmap-ləşdirilir
 *   · scrub **bitmapi olan** kadra düşür; olmayan varsa — img (bir dəfəlik)
 *   · reduced-motion: tək poster; yalnız görünəndə çəkilir (IO, 25% margin)
 */
import { gsap, prefersReducedMotion, ScrollTrigger } from './scroll'
import { PERF, isNarrow } from './perf'
import { setLoaderFrames } from './loader'
import { sizeCanvas } from './webgl'

const BASE = import.meta.env.BASE_URL

/** Eyni anda YÜKLƏNƏN kadr sayı — şəbəkə fazası (HTTP/2 çoxluq qatarı). */
const PARALLEL = 8

export type SequenceSpec = {
  canvas: HTMLCanvasElement
  /** Scroll büdcəsi bu elementə bağlıdır (`top top` → `bottom bottom`). */
  trigger: HTMLElement | null
  /** Geniş ekran kadr qovluğu — `BASE`-ə nisbi: `'speak/frames-1280'`. */
  highDir: string
  /** Dar ekran kadr qovluğu. */
  lowDir: string
  /** Poster — nisbi yol: `'speak/poster-1280.webp'`. */
  poster: string
  /** Scrub yumsatması (0.05–0.12). Kiçik = yumşaq. */
  ease?: number
  /** Üfüqi fokus nöqtəsi (0..1) — cover kəsimi ekranı daşayanda hansı hissə
   *  görünür (mobil portret kəsimi üçün; bax: SapereAude 0.7). */
  focusX?: number
  /** İlk yüklənən fəsil (leap) preloader progressinə yazır (`lib/loader`). */
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

  /* Yüklənmiş kadr-lar (sıxılmış — ucuz). `contig` = ardıcıl yüklənmiş prefiks. */
  const imgs: (HTMLImageElement | null)[] = []
  /* Sahib olunan bitmap-lər — yalnız pəncərədə yaşayır, evik olunmurlar. */
  const bitmaps = new Map<number, ImageBitmap>()
  const bitmapWip = new Set<number>()
  let decodedCount = 0
  /** Qran — 2 növbələşən noise canvas (frame parity ilə): film flicker. */
  const grain: HTMLCanvasElement[] = []
  let n = 0
  let contig = 0
  let idx = 0

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const target = Math.min(idx, Math.max(0, contig - 1))
    /* ⚠️ DEKOD-GATED (v6.11 — donmanın KÖK SƏBƏBİ burada idi): dekod
       olunmamış `<img>`-yə drawImage → main-thread-də 100–300ms sinxron
       dekod = donma. İndi: yalnız hazır bitmap (yoxsa ən yaxın hazırı —
       video bir an qalır, DONMUR). */
    let bmp: ImageBitmap | null = null
    for (let k = target; k >= 0; k--) {
      const b = bitmaps.get(k)
      if (b) {
        bmp = b
        break
      }
    }
    if (!bmp) {
      if (poster.complete && poster.naturalWidth > 0) cover(poster)
      return
    }
    cover(bmp)
    /* film qranı — kadrin İÇİNƏ baked (globalCompositeOperation: overlay).
       2 pattern frame parity ilə növbələşir = proyektor flicker.
       Ayrı fullscreen blend qatı lazım deyil — ən bahalı qat budur. */
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

  /** Qran canvas-ları — buffer həllində, resize-da yenidən boyanır. */
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

  /**
   * Bitmap pəncərəsi: [center−2 … center+decodeAhead] bitmapişdirilir,
   * pəncərədən çıxanlar `close()` edilir. `createImageBitmap` dekod-u
   * off-main-thread edir və nəticə **evik olunmayan** bitmap-dir.
   * Hər tick maksimum 3 yaradılış — burst buraxılır, jank hamar.
   */
  let bitmapBudget = 0
  const pumpBitmaps = (center: number) => {
    bitmapBudget = 3
    const lo = Math.max(0, center - 2)
    const hi = Math.min(n - 1, center + 1 + PERF.decodeAhead)
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
          if (spec.trackProgress) setLoaderFrames(decodedCount / n)
          if (i === idx) draw()
        })
        .catch(() => {
          bitmapWip.delete(i) // bitmap alınmadı — img fallback (bir dəfəlik xərc)
        })
    }
    // pəncərədən çıxanları azad et — yaddaş pəncərə ilə məhduddur
    if (bitmaps.size > PERF.decodeAhead + 10) {
      for (const key of [...bitmaps.keys()]) {
        if (key < center - 6 || key > center + PERF.decodeAhead + 6) {
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
        bumpContig()
        if (--pending === 0 && Math.min(n, from + PARALLEL) < n) loadChunk(from + PARALLEL)
      }
      img.onerror = () => {
        /* tək kadr xarab olsa ardıcıllıq davam etsin */
        if (--pending === 0 && Math.min(n, from + PARALLEL) < n) loadChunk(from + PARALLEL)
      }
      img.src = `${BASE}${dir}/s_${String(i + 1).padStart(3, '0')}.webp`
    }
  }

  /* Manifest frames qovluğunun BİR üstündə durur: 'speak/manifest.json'.
     ⚠️ v6.10 — yükləmə YAXINLIQ gate-lidir: 4 sequence × ~650 fayl səhifə
     açılışında birdən yüklənməsin — bölmə viewport-a 2 viewport yanaşanda
     başlayır (hero birinci olduqda leap dərhal hazır olur, sonrakılar lazım
     olanda yüklənir). */
  let downloadStarted = false
  const startDownload = () => {
    if (downloadStarted) return
    downloadStarted = true
    fetch(`${BASE}${highDir.split('/')[0]}/manifest.json`)
      .then((r) => r.json())
      .then((m: { n: number }) => {
        n = m.n
        imgs.length = n
        loadChunk(0)
      })
      .catch(() => {
        /* manifest yoxdursa poster qalır — fəsil oxunmalıdır */
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

  // Poster gec gəlsə də bir dəfə çəkilsin (kadr-lar hələ yüklənməyibsə).
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
    window.removeEventListener('resize', resize)
    dlIo.disconnect()
    io.disconnect()
    st.kill()
    for (const bm of bitmaps.values()) bm.close()
    bitmaps.clear()
  }

  // ---- reduced-motion: tək kadr (poster) — hərəkət yox, məkan var ----
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
      pumpBitmaps(idx) // yeni yüklənənləri bitmap-ə al — pəncərəni doldur
    }
  }
  gsap.ticker.add(tick)

  return cleanup
}
