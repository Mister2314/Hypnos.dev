/**
 * loader.ts — açılış yükləmə vəziyyəti: Preloader ilə sequence-lər arasında
 * körpü. Yeganə məqsəd: preloader **REAL** progress göstərsin (fake spinner
 * yox — istifadəçi nə gözlədiyini görsün).
 *
 * Progress tərkibi: 70% birinci video fəsilin (leap) dekod olunmuş kadrları
 * + 30% şriftlər. monotonic — geri düşmür.
 */

type Listener = (pct: number) => void

const listeners = new Set<Listener>()

let framesFraction = 0
let fontsReady = false
let done = false

function emit(): void {
  const pct = compute()
  for (const fn of listeners) fn(pct)
}

function compute(): number {
  if (done) return 1
  return framesFraction * 0.7 + (fontsReady ? 0.3 : 0)
}

/** Sequence dekod irəliləyişi — yalnız izlənilən (birinci) fəsil yazır. */
export function setLoaderFrames(fraction: number): void {
  const v = Math.min(1, Math.max(0, fraction))
  if (v <= framesFraction) return
  framesFraction = v
  emit()
}

/** Şriftlər hazır — mətn ölçüləri artıq finaldır. */
export function setLoaderFontsReady(): void {
  fontsReady = true
  emit()
}

/** Bütün mənbələr hazır — preloader bağlana bilər. */
export function markLoaderDone(): void {
  if (done) return
  done = true
  emit()
}

export function isLoaderDone(): boolean {
  return done
}

/** Abunə ol. Qaytarılan funksiya abunəliyi ləğv edir. */
export function onLoaderProgress(fn: (pct: number) => void): () => void {
  listeners.add(fn)
  fn(compute())
  return () => {
    listeners.delete(fn)
  }
}
