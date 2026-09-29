


type Listener = (pct: number) => void

const listeners = new Set<Listener>()

let framesFraction = 0
let fontsReady = false
let done = false

// v9: pərdə ALL seqsiyaların kadr baytları yüklənəndə qalxır — hər seqsiya
// mount-da qeydiyyatdan keçir, öz yüklənmə fraksiyasını bildirir, pərdə
// ortalamaya baxır (biri geciksə də sayaç düz durur).
const seqFractions = new Map<number, number>()
let seqSeq = 0

function emit(): void {
  const pct = compute()
  for (const fn of listeners) fn(pct)
}

function compute(): number {
  if (done) return 1
  return framesFraction * 0.7 + (fontsReady ? 0.3 : 0)
}

export function registerSequence(): number {
  const id = ++seqSeq
  seqFractions.set(id, 0)
  emit()
  return id
}

export function setSequenceFraction(id: number, f: number): void {
  if (!seqFractions.has(id)) return
  const v = Math.min(1, Math.max(0, f))
  // monoton: v14 mobildə gecikən seqsiyalar pərdə üçün 1 qeyd olunur —
  // arxa plan yükləməsi başlayanda real progress sayçını geri aparmasın
  if (v <= (seqFractions.get(id) ?? 0)) return
  seqFractions.set(id, v)
  let sum = 0
  for (const x of seqFractions.values()) sum += x
  framesFraction = sum / seqFractions.size
  emit()
}


/** reduced-motion-da kadr oynamır — bayt yükləməsini də gözləmə */
export function markSequenceSkipped(id: number): void {
  setSequenceFraction(id, 1)
}

/** v15 (bugbot): remount-da köhnə seqsiya qeydləri registry-dən çıxarılır */
export function unregisterSequence(id: number): void {
  if (!seqFractions.delete(id)) return
  let sum = 0
  for (const x of seqFractions.values()) sum += x
  framesFraction = seqFractions.size ? sum / seqFractions.size : framesFraction
  emit()
}

export function setLoaderFontsReady(): void {
  fontsReady = true
  emit()
}


export function markLoaderDone(): void {
  if (done) return
  done = true
  emit()
}

export function isLoaderDone(): boolean {
  return done
}


export function onLoaderProgress(fn: (pct: number) => void): () => void {
  listeners.add(fn)
  fn(compute())
  return () => {
    listeners.delete(fn)
  }
}
