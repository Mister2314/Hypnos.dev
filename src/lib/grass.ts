/**
 * grass.ts — `03 The Berm` üçün ot sahəsinin **statik** həndəsəsi.
 *
 * **Niyə statik:** külək CPU-da hesablansa, hər kadrda minlərlə qılçanın vertex-i
 * JS-də yenidən yazılmalı olardı. Əvəzində həndəsə **bir dəfə** qurulur, külək isə
 * vertex shader-də hesablanır — CPU işi kadr başına **sıfırdır**, draw call **birdir**.
 * (Mənbə: `research/08-berm-grass-tekrar.md §4.3`.)
 *
 * ⚠️ **Sıxlıq məsafə ilə kompensasiya olunur — bu, dizaynın açarıdır.**
 * Sadə düzbucaqlı paylama işləmir: perspektivdə ekran sıxlığı `1/d²` ilə düşür, ona
 * görə yaxın ot seyrək, uzaq ot isə sıx görünərdi (və ya tərsinə — hamısı bir yerdə).
 * Əvəzində kök mövqeyi elə paylanır ki **ekranda** sıxlıq bərabər olsun:
 *
 *   · məsafə → `ρ(d) ∝ 1/d²`, inteqralı əl ilə həll olunub (aşağıda `d` üçün düstur)
 *   · en → `d`-yə mütənasib, çünki perspektiv eni də məsafə ilə açılır
 *
 * Nəticə: 4 500 qılça bütün dərinliyi bərabər örtür — nə uzaqda seyrəklik, nə yaxında yığılma.
 *
 * ⚠️ **Bir qılça = 8 vertex, 18 indeks.** 4 sıra (`t = 0 · 0.34 · 0.67 · 1`), hər sırada
 * 2 vertex, uca doğru en sıfıra düşür — qılça itiləşir. İndeks buferi olmasaydı eyni forma
 * 18 vertex tələb edərdi; indeks onu **~1.75× kiçik** saxlayır.
 *
 * ⚠️ **Bufer ölçüsü `Uint16` həddinə bağlıdır.** İndekslər vertex massivinə işarə edir,
 * ona görə təpə sayı **65 535-dən az** olmalıdır. `MAX_BLADES` bunu zəmanətləyir —
 * oradan yuxarı qılça sayı sükutla yanlış həndəsə verərdi (indeks daşması).
 */

export type GrassField = {
  /** 4 float/vertex: yan sürüşmə + boyu (`aOff.xy`) · dünya XZ (`aRoot.xy`) */
  verts: Float32Array
  /** Qılça başına 18 indeks — hamısı tək `drawElements` çağırışında */
  indices: Uint16Array
  blades: number
  vertexCount: number
  indexCount: number
}

/** Sıra boyu en profili: `t = 0 · 0.34 · 0.67 · 1`. Ucda en sıfırdır. */
const WIDTH_AT = [1, 0.62, 0.28, 0] as const
const ROWS = WIDTH_AT.length
const VERTS_PER_BLADE = ROWS * 2
const INDICES_PER_BLADE = (ROWS - 1) * 6

/** Qılçanın kökdəki yarım-eni, dünya vahidi. */
const HALF_WIDTH = 0.021

/**
 * Kamera bu məsafələr arasında görür.
 * `NEAR` — kameranın önündəki ən yaxın ot. 2.4-dən **1.2-yə** endi (v6):
 * ekran yoxlaması göstərdi ki, kamera 5+ vahid uzaqdan bütün sahəni yalnız
 * üfüqi zolaq kimi görürdü, kadrlın altı boş qalırdı. 1.2-də ən yaxın qılçalar
 * kadrlın alt kənarına çatır — sahəyə **içində** durmuş kimi baxırsan.
 */
const NEAR = 1.2
const FAR = 30

/**
 * `Uint16` indeks həddi: 65 535 təpə. 8 vertex/qılça → təhlükəsiz maksimum.
 * `8000 × 8 = 64 000` — həddin altında, amma yaxın. Ondan yuxarı **qadağandır**.
 */
export const MAX_BLADES = 8000

/** Kənarın sərt düzbucaqlı kimi görünməməsi üçün en frustumdan bir az genişdir. */
const WIDTH_SPREAD = 1.15

export function buildGrass(blades: number): GrassField {
  const count = Math.min(blades, MAX_BLADES)
  const verts = new Float32Array(count * VERTS_PER_BLADE * 4)
  const indices = new Uint16Array(count * INDICES_PER_BLADE)

  // `1/d²` paylamasının həlli. CDF: `u = (1/NEAR − 1/d) / (1/NEAR − 1/FAR)`
  // → `d = 1 / (1/NEAR − u · (1/NEAR − 1/FAR))`
  const invNear = 1 / NEAR
  const invFar = 1 / FAR
  const span = invNear - invFar

  let v = 0
  let ix = 0

  for (let b = 0; b < count; b++) {
    const u = Math.random()
    const d = 1 / (invNear - u * span)

    // En `d`-yə mütənasibdir — perspektiv eni də məsafə ilə açılır.
    const halfW = d * WIDTH_SPREAD
    const x = (Math.random() * 2 - 1) * halfW
    const z = -d

    const base = v

    for (let r = 0; r < ROWS; r++) {
      const t = r / (ROWS - 1)
      const w = WIDTH_AT[r] * HALF_WIDTH
      // Sıra daxilində iki vertex: sol (−1) və sağ (+1).
      verts[v++] = -w
      verts[v++] = t
      verts[v++] = x
      verts[v++] = z

      verts[v++] = w
      verts[v++] = t
      verts[v++] = x
      verts[v++] = z
    }

    // Sıra cütləri arasında 2 üçbucaq. Sarğı **əhəmiyyətsizdir** — `CULL_FACE`
    // WebGL-də default olaraq söndürülüb və biz onu yandırmırıq.
    for (let r = 0; r < ROWS - 1; r++) {
      const a = base + r * 2
      indices[ix++] = a
      indices[ix++] = a + 1
      indices[ix++] = a + 3
      indices[ix++] = a
      indices[ix++] = a + 3
      indices[ix++] = a + 2
    }
  }

  return {
    verts,
    indices,
    blades: count,
    vertexCount: count * VERTS_PER_BLADE,
    indexCount: count * INDICES_PER_BLADE,
  }
}
