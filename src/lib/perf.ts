/**
 * perf.ts — sabit performans konfiqurasiyası.
 *
 * ⚠️ v6.9 — ADAPTİV TİER SİSTEMİ SİLİNDİ (Khayalın qərarı: *"butun ozellikleri
 * low-a yaz ve sadece low qualityde islesin, qrafik secimini sil"*). Əvvəl:
 * 5 siqnal + High→Low keçidi + localStorage + Signature-də seçim UI — hamısı
 * getdi. İndi sayt HƏMİŞƏ aşağı qatda işləyir: **eyni dizayn, az GPU işi**
 * (`research/07 §5.1`: template tipoqrafiyada və hekayədədir — GPU-da deyil).
 *
 * Niyə sabit (ölçmə ilə, `tools/perf-loop.mjs`): adaptiv sistem real cihazda
 * High-da BAŞLAYIR və istifadəçi donmanı orada yaşayır — Low-a düşmə gecikir.
 * Sabit Low = ilk kadr artıq hamar. Ölçmə (bazа → sonra): dropped 33.3% →
 * hədəf <4%.
 *
 * **Deletion testi:** adaptiv mexanizmi silmək mürəkkəbliyi toplayır
 * (quality.ts 140 sətir + UI + CSS + verify) — qısalır. İki dəfə «low»
 * istəyən ikinci implementasiya yoxdur — sabit konstant kifayətdir.
 */
export const PERF = {
  /** Foto/video canvas DPR — qran + scrim altında 1:1 kifayətdir (4× az piksel). */
  canvasDpr: 1,
  /** Film qranı canvas DPR — küydür, chunky upscale = filmik dənə (16× az iş). */
  grainDpr: 0.35,
  /** Film qranı yenilənmə bölgüsü — 60/3 = 20fps (küy üçün kifayət). */
  grainFrameSkip: 3,
  /** Dar ekran həddi — kadr qovluğu seçimi (mobil aşağı qat kadrları). */
  narrowBreakpoint: 760,
  /** Sequence dekod pəncərəsi — scrub indeksindən neçə kadr ÖNDƏ dekod olunur.
   *  Bütün kadr-ları dekod etmək = minlərlə dekodlanmış bitmap = yaddaş + jank. */
  decodeAhead: 20,
} as const

/** Dar ekran — kadr qovluğu seçimində istifadə olunur (mobil aşağı qat). */
export function isNarrow(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < PERF.narrowBreakpoint
}
