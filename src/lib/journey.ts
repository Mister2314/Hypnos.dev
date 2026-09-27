/**
 * journey.ts — fəsillər arası yeganə paylaşılan vəziyyət.
 *
 * Hazırda bir şey daşıyır: **gölməyə toxunulubmu + neçə halqa qoyub**.
 * 06 The Pond yazır, 13 Signature oxuyur — saytın sonunda *"N rings on the
 * water"* sətri peyda olur. Yəni ziyarətçi başdan sona **nəsə etmiş** olur,
 * sadəcə scroll etməmiş.
 *
 * ⚠️ Əvvəl bu, **dərilmiş şaftalı** idi (ağac fəsli). Ağac getdi, məna da
 * dəyişdi: dərmək → toxunmaq. Sayğacın mənası fəsillə birlikdə köhnəlir —
 * onu saxlamaq olmazdı.
 *
 * ⚠️ Niyə ayrı fayl, `scroll.ts` deyil: `scroll.ts` **dünya modelidir** (rəng,
 * qran, işıq) və tək-yazan qaydası ilə qorunur. Bu isə **istifadəçinin
 * etdiyi işdir** — fərqli həyat dövrü, fərqli sahib.
 *
 * ⚠️ Sayğaca YALNIZ məqsədli toxunma (`pointerdown`) düşür. Sürüşmə dalğaları
 * və avtomatik halqalar sayılmır — əks halda «N halqa» rəqəmi iş göstəricisi
 * olur, məna göstəricisi deyil (ağacda da eyni səhv bir dəfə olmuşdu).
 */

let rings = 0
let visited = false

type Listener = (rings: number, visited: boolean) => void
const listeners = new Set<Listener>()

/** 06 The Pond mount olanda bir dəfə. StrictMode-da təkrar çağırılmasından qorunur. */
export function markPond(): void {
  if (visited) return
  visited = true
  emit()
}

/** Halqa sayı. **Yalnız artır** — su üzərindəki halqa geri alınmır. */
export function addRings(n: number): void {
  if (n <= 0) return
  rings += n
  emit()
}

function emit(): void {
  for (const fn of listeners) fn(rings, visited)
}

/** Abunə ol. Qaytarılan funksiya abunəliyi ləğv edir (`useEffect` təmizliyi). */
export function onJourney(fn: Listener): () => void {
  listeners.add(fn)
  fn(rings, visited)
  return () => {
    listeners.delete(fn)
  }
}
