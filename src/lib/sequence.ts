


import { gsap, prefersReducedMotion, ScrollTrigger } from './scroll'
import { PERF, isNarrow, pickTierDir } from './perf'
import { registerSequence, setSequenceFraction, markSequenceSkipped, isLoaderDone, unregisterSequence } from './loader'
import { sizeCanvas } from './webgl'

const BASE = import.meta.env.BASE_URL


const PARALLEL = 8

// v14: blob keşi — dil dəyişimi remount-da kadrlar ŞƏBƏKƏDƏN yenidən
// yüklənmir (keşdən dərhal dekod → video 1-2 kadrda bərpa olunur).
// Blob obyektləri paylaşılır — RAM əlavə yemir.
const blobCache = new Map<string, Blob>()
// v15: uçuşda olan fetch-lərin keşi — sürətli ikiqat dil dəyişimində
// eyni URL iki dəfə çəkilmir (bugbot tapıntı 4)
const inflight = new Map<string, Promise<Blob>>()

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

  const dir = pickTierDir(highDir, lowDir)
  const progressRef = { v: 0 }
  // mobil: daha kiçik dekod pəncərəsi — giriş burstlarını endirir
  const AHEAD = isNarrow() ? 10 : PERF.decodeAhead
  // v9: seqsiya pərdəyə qeydiyyatdadır — pərdə onun BÜTÜN kadrları yüklənənə
  // qədər gözləyir (scroll videoyu keçə bilməz, çünki yükləmə pərdədə bitir)
  const seqId = registerSequence()

  const poster = new Image()
  poster.decoding = 'async'
  // M8: poster pərdə arxasında ilk görünən kadrdir — yükləmə prioriteti yüksək
  ;(poster as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'high'
  poster.src = BASE + posterPath

  const cover = (img: HTMLImageElement | ImageBitmap) => {
    const s = Math.max(canvas.width / img.width, canvas.height / img.height)
    const dw = img.width * s
    const dh = img.height * s
    const fx = spec.focusX ?? 0.5
    ctx.drawImage(img, (canvas.width - dw) * fx, (canvas.height - dh) / 2, dw, dh)
  }


  // v13: Image elementləri ƏVƏZLƏNMƏDİ blob ilə — yaddaşda yalnız SIXILMIŞ
  // baytlar qalır (~19 MB hamısı); dekod edilmiş kadr yalnız bitmaps pəncərəsində.
  // 521 HTMLImageElement + onların dekod keşi rendererdə ~1 GB tuturdu.
  const blobs: (Blob | null)[] = []

  const bitmaps = new Map<number, ImageBitmap>()
  const bitmapWip = new Set<number>()
  let decodedCount = 0
  let loadedCount = 0

  // loader pərdəsi üçün real progress: seqsiyanın yüklənmiş kadr payı
  let bootTimer: ReturnType<typeof setInterval> | null = null
  // v14: mobildə pərdədən sonrakı yükləmə gözləyicisi
  let waitIv: ReturnType<typeof setInterval> | null = null
  const reportProgress = () => {
    if (!n) return
    setSequenceFraction(seqId, loadedCount / n)
  }

  let n = 0
  let contig = 0
  let idx = 0

  let painted = false
  const draw = () => {
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
      // v13: ekrandan qayıtdıqda bitmaps boşdur — son çəkilmiş kadr DONUR
      // (poster fləşi yoxdur). İlk dəfədirsə (heç nə çəkilməyib) poster.
      if (painted) return
      if (poster.complete && poster.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        cover(poster)
      }
      return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cover(bmp)
    painted = true
  }

  const resize = () => {
    if (sizeCanvas(canvas, PERF.canvasDpr)) {
      painted = false // canvas ölçüsü dəyişdi — məcburi yenidən çək
      draw()
    }
  }

  const bumpContig = () => {
    while (contig < n && blobs[contig]) contig++
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
      if (bitmaps.has(i) || bitmapWip.has(i) || !blobs[i]) continue
      bitmapWip.add(i)
      bitmapBudget--
      createImageBitmap(blobs[i]!)
        .then((bm) => {
          if (!running) {
            // dekod bitdi, amma fəsil artıq ekrandan çıxdı — dərhal burax
            bm.close()
            bitmapWip.delete(i)
            return
          }
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

    if (bitmaps.size > AHEAD + 4) {
      for (const key of [...bitmaps.keys()]) {
        if (key < center - AHEAD - 3 || key > center + AHEAD + 3) {
          bitmaps.get(key)?.close()
          bitmaps.delete(key)
        }
      }
    }
  }

  // v15: chunk yükləməsi İTERATIVDIR (rekursiya yoxdur). Səbəb: keşlənmiş
  // kadr settle()-i SINXRON çağırırdı → növbəti chunk for-loop içində
  // rekursiv başlayır → dil dəyişimi (hamısı keşli) eksponensial yenidən
  // gəzinti ilə əsas thread-i KİLİDLƏYİRDİ ("sayt çökur"). Promise.all +
  // await — keşli kadrlar mikrotask-da həll olunur, zəncir sinxron deyil.
  const loadFrame = async (i: number): Promise<void> => {
    const url = `${BASE}${dir}/s_${String(i + 1).padStart(3, '0')}.webp`
    let b = blobCache.get(url)
    if (!b) {
      try {
        let p = inflight.get(url)
        if (!p) {
          p = fetch(url)
            .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
            .then((blob) => {
              blobCache.set(url, blob)
              inflight.delete(url)
              return blob
            })
            .catch((err) => {
              inflight.delete(url)
              throw err
            })
          inflight.set(url, p)
        }
        b = await p
      } catch {
        /* səhv kadr pərdəni bloklamır — draw() poster fallback-ına düşür */
      }
    }
    if (b) blobs[i] = b
    loadedCount++
    reportProgress()
    bumpContig()
  }

  const loadChunk = async (from: number): Promise<void> => {
    const end = Math.min(n, from + PARALLEL)
    const batch: Promise<void>[] = []
    for (let i = from; i < end; i++) batch.push(loadFrame(i))
    await Promise.all(batch)
    if (end < n) await loadChunk(end)
  }




  let downloadStarted = false
  // v15 (bugbot tapıntı 1): unmount-dan SONRA gecikmiş manifest retry-isi
  // işə düşsə, yaradılan bootTimer heç kim təmizləmədiyi üçün əbədi
  // dekod pompası olur — alive bayrağı bütün asinxron davamları kəsir.
  let alive = true
  const startDownload = (attempt = 0) => {
    if (attempt === 0) {
      if (downloadStarted) return
      downloadStarted = true
    }
    if (!alive) return
    fetch(`${BASE}${highDir.split('/')[0]}/manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((m: { n: number }) => {
        if (!alive) return
        n = m.n
        blobs.length = n
        loadChunk(0)

        // loader-gated fəsil (leap): pərdə açılmamışdan əvvəl scroll pompası
        // işləmir — ilk dekod pəncərəsini müstəqil pompala
        if (spec.trackProgress && !prefersReducedMotion) {
          bootTimer = setInterval(() => {
            if (!alive) {
              clearInterval(bootTimer!)
              bootTimer = null
              return
            }
            pumpBitmaps(0)
            if (decodedCount >= AHEAD + 2 && bootTimer) {
              clearInterval(bootTimer)
              bootTimer = null
            }
          }, 90)
        }
      })
      .catch(() => {
        // keçici şəbəkə xətası: poster fallback var, 2 dəfəyə qədər yenidən cəhd
        if (attempt < 2 && alive) setTimeout(() => startDownload(attempt + 1), 1200 * (attempt + 1))
        else if (alive) setSequenceFraction(seqId, 1)
      })
  }
  // v9: hamısı dərhal yüklənməyə başlayır — IO-gated lazy start onu yaradırdı
  // ki, scroll seqsiyanın üstünə çatanda kadrlar hələ şəbəkədə olurdu.
  // v14 mobil istisna: telefonda yalnız İLK video (leap) pərdədə yüklənir —
  // mobile data + ilk yükləmə donması; qalanları pərdə qalxandan sonra
  // arxa planda çəkirik (fraksiya monoton olduğundan sayçı geri düşmür).
  if (prefersReducedMotion) {
    // kadr oynamayacaq — bayt yükləməsini də synchronically keç
    markSequenceSkipped(seqId)
  } else if (isNarrow() && !spec.trackProgress) {
    setSequenceFraction(seqId, 1)
    waitIv = setInterval(() => {
      if (isLoaderDone()) {
        clearInterval(waitIv!)
        waitIv = null
        startDownload()
      }
    }, 400)
  } else {
    startDownload()
  }


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
      if (!running) {
        // v13: fəsil ekrandan çıxdı — dekod edilmiş bitmaps BURAXILIR (bloblar
        // qalır). RAM yalnız görünən seqsiyalarla miqyaslanır; geri girişdə
        // lokal bloblardan 1-2 tick-ə yenidən dekod olunur (smoothluq eyni).
        for (const bm of bitmaps.values()) bm.close()
        bitmaps.clear()
        bitmapWip.clear()
      }
    },
    { rootMargin: '25% 0px' },
  )
  io.observe(canvas)

  // v14: remount (dil dəyişimi) səhifənin MÖVCUD mövqeyində baş verir —
  // smooth hazırki scrub progressindən başlayır ki, video birinci kadrdan
  // oynayıb "geri qayıtmağa çalışmasın" (onun orijinal şikayəti)
  let smooth = st.progress
  progressRef.v = st.progress
  let tick: (() => void) | null = null

  const cleanup = () => {
    alive = false
    if (tick) gsap.ticker.remove(tick)
    if (bootTimer) clearInterval(bootTimer)
    if (waitIv) clearInterval(waitIv)
    window.removeEventListener('resize', resize)
    io.disconnect()
    st.kill()
    for (const bm of bitmaps.values()) bm.close()
    bitmaps.clear()
    unregisterSequence(seqId)
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
