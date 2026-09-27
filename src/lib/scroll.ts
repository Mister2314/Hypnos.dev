/**
 * Ortaq hərəkət qatı — GSAP + ScrollTrigger + useGSAP + dünya modeli.
 *
 * ⚠️ TƏK-YAZAN QAYDASI. Dünya vəziyyətini YALNIZ `applyWorld()` yazır.
 * Səbəb: 26 sentyabrda 4 ayrı `fromTo` tween eyni `--bg`-ni yazırdı, hamısı
 * progress 0-da idi → `immediateRender` səbəbindən SONUNCU qalib gəlirdi →
 * səhifə açılışda yanlış rəngdə görünürdü. Bir yazıcı = toqquşma mümkün deyil.
 *
 * Oxucular: `Backdrop` (fon), `FilmOverlay` (WebGL qran/halation), `ChapterNav`.
 *
 * Mənbə: rəsmi GSAP skilləri (greensock/gsap-skills, commit aed9cfd)
 *   → gsap-react: useGSAP + scope + avtomatik cleanup
 *   → gsap-scrolltrigger: scrub, pin, refresh
 *   → gsap-utils: interpolate, clamp
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Dünya — bir fəsil.
 * `bg` / `text` / `accent` → CSS dəyişənləri.
 * `grain` / `halo` / `lx` / `ly` → WebGL film qatı (qran, halation, işıq nöqtəsi).
 * `n` / `title` → `ChapterNav` relsi. `n: ''` olan fəsil naviqasiyada görünmür.
 */
export type World = {
  id: string
  n: string
  title: string
  bg: string
  text: string
  accent: string
  grain: number
  halo: number
  lx: number
  ly: number
}

/**
 * Fəsil sırası = scroll sırası. `App.tsx`-dəki bölmələrlə **1:1** üst-üstə düşməlidir.
 *
 * Palitra ankerləri CMBYN-dən ölçülüb (KONSEPT §2.3): `#30312D` · `#55544D` · `#0C1512`
 * · `#D1CCAF` · `#F1F1EA`. Son dörd fəsil "press"ə qayıdır — bu, qəsdəndir: ikinci yarı
 * sakitləşir, rəng dəyişmə dayanır, səs qalır.
 *
 * ⚠️ Konsept "üç dünya"dan **"many worlds, one head"**ə genişləndi (26 sentyabr):
 * hər fəsil bir paralel dünyadır. 08-ci fəsil (`worlds`) həmin dünyaların **xəritəsidir**.
 *
 * ⚠️ **`n` və `title` TƏK YERDƏ saxlanır — burada.** Fəsillərin başlıqları
 * (`section__eyebrow`) əvvəl hər faylda əl ilə yazılırdı; fəsil əlavə olunanda
 * hamısını əl ilə yenidən nömrələmək lazım gəlirdi və biri mütləq sürüşürdü.
 * İndi fəsillər `eyebrow(id)` çağırır — ikinci həqiqət mənbəyi yoxdur.
 *
 * 14 fəsil (26 sentyabr v5): `pond` (analitik su şaderi — prosedural ağacın
 * əvəzi, `research/06`) və `quiet` (sükut fəsli — CMBYN-in "uzadılmış müddət"
 * mexanizmi).
 */
export const WORLDS: World[] = [
  { id: 'hero', n: '', title: 'Overture', bg: '#0e100f', text: '#fffce1', accent: '#b08d57', grain: 0.30, halo: 0.00, lx: 0.50, ly: 0.40 },
  /** 01 — sıçrayış. Spider-Verse: dərin lacivərd + elektrik cyan; stepped → smooth.
   *  ⚠️ v6.10 — Khayalın istəyi ilə hero-dan SONRA köçürüldü ("miles section-u
   *  hi im khayal sectionundan sonra"). */
  { id: 'leap', n: '01', title: 'The Leap', bg: '#0a0e1e', text: '#fbfbfc', accent: '#00fcfd', grain: 0.40, halo: 0.5, lx: 0.50, ly: 0.38 },
  { id: 'summer', n: '02', title: 'Summer', bg: '#30312d', text: '#f1f1ea', accent: '#ffc2ae', grain: 0.46, halo: 0.55, lx: 0.78, ly: 0.26 },
  { id: 'hands', n: '03', title: 'The Hands', bg: '#12100c', text: '#fffce1', accent: '#e0c9a6', grain: 0.40, halo: 0.42, lx: 0.50, ly: 0.46 },
  /** 04 — əks tərəzi. Arcane astral səhnəsi: bənövşəyi-qara + lilac, işıq mərkəzdə. */
  { id: 'counterweight', n: '04', title: 'The Counterweight', bg: '#0f0a16', text: '#fffce1', accent: '#cfa9e8', grain: 0.36, halo: 0.62, lx: 0.50, ly: 0.44 },
  { id: 'sapere', n: '05', title: 'Sapere aude', bg: '#0e100f', text: '#fffce1', accent: '#b08d57', grain: 0.30, halo: 0.10, lx: 0.62, ly: 0.36 },
  { id: 'speak', n: '06', title: 'Speak or die', bg: '#0c1512', text: '#f1f1ea', accent: '#c9c3a4', grain: 0.38, halo: 0.28, lx: 0.24, ly: 0.34 },
  /** 07 — gölmə. Tünd yaşıl su + qızıl günəş: `halo` yüksək, işıq sərvlərin arxasında. */
  { id: 'pond', n: '07', title: 'The Pond', bg: '#101410', text: '#fffce1', accent: '#e8a87c', grain: 0.42, halo: 0.62, lx: 0.66, ly: 0.30 },
  /** 08 — sükut. Saytın ƏN sakit dünyası: qran az, işıq az, rəng demək olar yoxdur. */
  { id: 'quiet', n: '08', title: 'The Quiet', bg: '#0a0b0a', text: '#e6e3d8', accent: '#a89a7c', grain: 0.24, halo: 0.06, lx: 0.50, ly: 0.38 },
  { id: 'worlds', n: '09', title: 'Worlds', bg: '#0b0d0c', text: '#fffce1', accent: '#a8b0c0', grain: 0.26, halo: 0.05, lx: 0.50, ly: 0.40 },
  { id: 'marble', n: '10', title: 'Marble', bg: '#e8e3da', text: '#1b1a19', accent: '#8c8377', grain: 0.20, halo: 0.22, lx: 0.34, ly: 0.30 },
  { id: 'work', n: '11', title: 'Work', bg: '#14150f', text: '#fffce1', accent: '#b08d57', grain: 0.34, halo: 0.06, lx: 0.50, ly: 0.50 },
  { id: 'questions', n: '12', title: 'Questions', bg: '#101210', text: '#fffce1', accent: '#b08d57', grain: 0.32, halo: 0.04, lx: 0.50, ly: 0.46 },
  { id: 'contact', n: '13', title: 'Contact', bg: '#0b0c0b', text: '#fffce1', accent: '#b08d57', grain: 0.28, halo: 0.02, lx: 0.50, ly: 0.42 },
  { id: 'signature', n: '14', title: 'Signature', bg: '#0e100f', text: '#fffce1', accent: '#b08d57', grain: 0.30, halo: 0.00, lx: 0.50, ly: 0.40 },
]

/**
 * Cari dünya vəziyyəti — CANLI obyekt (modul səviyyəsində).
 * `Backdrop`/`WorldDriver` yazır, `FilmOverlay` hər kadr oxuyur.
 * Niyə obyekt: hər kadr `getComputedStyle` oxumaq bahadır.
 */
export const worldState = {
  grain: WORLDS[0].grain,
  halo: WORLDS[0].halo,
  lx: WORLDS[0].lx,
  ly: WORLDS[0].ly,
}

/** Yalnız rəng sahələri — `n`/`title`/`id` keçidə girmir. */
type ColorKey = 'bg' | 'text' | 'accent'

const VARS: [ColorKey, string][] = [
  ['bg', '--bg'],
  ['text', '--text'],
  ['accent', '--accent'],
]

/**
 * `a` dünyasından `b` dünyasına `t` (0–1) nöqtəsində keçid et.
 * Həm CSS dəyişənlərini, həm `worldState`-i YAZIR — yeganə yazıcı budur.
 */
export function applyWorld(a: World, b: World, t: number): void {
  const root = document.documentElement.style
  for (const [key, cssVar] of VARS) {
    root.setProperty(cssVar, String(gsap.utils.interpolate(a[key], b[key], t)))
  }
  worldState.grain = gsap.utils.interpolate(a.grain, b.grain, t)
  worldState.halo = gsap.utils.interpolate(a.halo, b.halo, t)
  worldState.lx = gsap.utils.interpolate(a.lx, b.lx, t)
  worldState.ly = gsap.utils.interpolate(a.ly, b.ly, t)
}

/** Bir dünyanı animasiyasız tətbiq et (ilk yükləmə, reduced-motion). */
export function setWorld(w: World): void {
  applyWorld(w, w, 0)
}

/** `id`-yə görə fəsil. Naviqasiya və sınaq üçün. */
export function getWorld(id: string): World | undefined {
  return WORLDS.find((w) => w.id === id)
}

/**
 * Fəslin başlıq sətri — `"06 — The Orchard"`.
 *
 * ⚠️ Niyə funksiya, sabit sətir deyil: fəsil nömrəsi **`WORLDS`-də** yaşayır.
 * Əvvəl hər bölmə öz nömrəsini əl ilə yazırdı (`<p>02 — The Hands</p>`), yəni
 * eyni həqiqət **iki yerdə** saxlanılırdı. Yeni fəsil əlavə olunanda ya
 * hamısını əl ilə yenidən nömrələmək, ya da sürüşməni qəbul etmək lazım gəlirdi.
 * Ölçülmüş nəticə: `Marble` 07 yazırdı, `WORLDS`-də isə 09 idi — **heç bir
 * yoxlayıcı tutmadı**, çünki səhv rəqəmdə deyil, **təkrarda** idi.
 *
 * `hero` (`n: ''`) üçün yalnız başlıq qaytarır.
 */
export function eyebrow(id: string): string {
  const w = getWorld(id)
  if (!w) return ''
  return w.n ? `${w.n} — ${w.title}` : w.title
}

/**
 * Boş vəziyyət hərəkəti — **vaxt ilə**, scroll ilə deyil.
 *
 * ⚠️ NİYƏ AYRI FUNKSİYA: saytdaki bütün mövcud animasiyalar `scrub`-dır —
 * yəni **scroll dayananda hərəkət dayanır.** Nəticə: oxucu scroll etmirsə,
 * saytın ön planı **tam ölü** olur. Film kadrı heç vaxt tam dayanmır
 * (qran, işıq, yarpaq tərpənir) — saytın isə **boş vəziyyəti yox idi.**
 * Diaqnoz: `research/07-uiux-hekaye-interaktivlik.md §3.3`.
 *
 * ⚠️ NİYƏ `yoyo: true` + `sine.inOut`: dövrə bitəndə əvvəlki dəyərə **yumşaq
 * qayıdır**. `repeat` tək işlədilsə, hər dövrədə başlanğıca **sıçrayır** —
 * göz bunu "səhv" oxuyur, "canlı" yox.
 *
 * ⚠️ NİYƏ MÜDDƏT PARAMETRDİR: `research/07 §4` — həll *"daha çox hərəkət"* deyil,
 * **məsafəni açmaqdır.** `07 The Quiet` → 11s (dərə) · orta fəsıllar → 7s ·
 * aktiv fəsıllar → 4.5s (zirvə). Kontrast olmasa, hərəkət oxunmur.
 *
 * ⚠️ `prefersReducedMotion` → `null` qaytarır, heç nə işləmir.
 *
 * @example
 * ambient(q('.hero__sign'), { y: -6, rotate: -1 }, 7)
 */
export function ambient(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars = {},
  duration = 7,
): gsap.core.Tween | null {
  if (prefersReducedMotion) return null
  const list = Array.isArray(target) ? target : [target]
  if (list.length === 0 || list[0] === undefined || list[0] === null) return null
  return gsap.to(target, {
    ...vars,
    duration,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
}

export { gsap, ScrollTrigger, useGSAP }
