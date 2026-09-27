/**
 * mat4.ts — minimal 4×4 matris riyaziyyatı (yalnız 4 funksiya).
 *
 * Niyə əl ilə: `gl-matrix` ~11 KB gzip gətirir, bizə cəmi `perspective` ·
 * `lookAt` · `multiply` · `project` lazımdır. Saytın bütün WebGL qatı əl ilə
 * yazılıb (bax `webgl.ts`) — bu, həmin xəttin davamıdır.
 *
 * Bütün matrislər **sütun-əsaslıdır** (column-major): `uniformMatrix4fv`
 * `transpose = false` gözləyir, yəni massiv olduğu kimi göndərilir.
 *
 * `project()` CPU-da eyni proyeksiyanı təkrarlayır — şaftalıların **ekran
 * koordinatını** bilmək üçün. Onsuz kliklə "şaftalı dərmək" mümkün olmazdı:
 * GPU-da nə baş verdiyini JS görmür, ona görə eyni riyaziyyat iki yerdə
 * işlədilir. Bu **qəsdli təkrar**dır — tək mənbə odur ki, hər ikisi eyni
 * `vp` matrisini alır.
 */

export type Mat4 = Float32Array
export type Vec3 = [number, number, number]

export const TAU = Math.PI * 2

export function mat4(): Mat4 {
  return new Float32Array(16)
}

export function perspective(
  out: Mat4,
  fovyRad: number,
  aspect: number,
  near: number,
  far: number,
): Mat4 {
  const f = 1 / Math.tan(fovyRad / 2)
  const nf = 1 / (near - far)
  out[0] = f / aspect
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = f
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = (far + near) * nf
  out[11] = -1
  out[12] = 0
  out[13] = 0
  out[14] = 2 * far * near * nf
  out[15] = 0
  return out
}

export function lookAt(out: Mat4, eye: Vec3, center: Vec3, up: Vec3): Mat4 {
  let zx = eye[0] - center[0]
  let zy = eye[1] - center[1]
  let zz = eye[2] - center[2]
  let l = Math.hypot(zx, zy, zz) || 1
  zx /= l
  zy /= l
  zz /= l

  let xx = up[1] * zz - up[2] * zy
  let xy = up[2] * zx - up[0] * zz
  let xz = up[0] * zy - up[1] * zx
  l = Math.hypot(xx, xy, xz) || 1
  xx /= l
  xy /= l
  xz /= l

  const yx = zy * xz - zz * xy
  const yy = zz * xx - zx * xz
  const yz = zx * xy - zy * xx

  out[0] = xx
  out[1] = yx
  out[2] = zx
  out[3] = 0
  out[4] = xy
  out[5] = yy
  out[6] = zy
  out[7] = 0
  out[8] = xz
  out[9] = yz
  out[10] = zz
  out[11] = 0
  out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2])
  out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2])
  out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2])
  out[15] = 1
  return out
}

/** Skratç bufеr — `out` `a` və ya `b` ilə eyni ola bilər, ona görə təhlükəsiz. */
const _m = new Float32Array(16)

export function multiply(out: Mat4, a: Mat4, b: Mat4): Mat4 {
  for (let c = 0; c < 4; c++) {
    const b0 = b[c * 4]
    const b1 = b[c * 4 + 1]
    const b2 = b[c * 4 + 2]
    const b3 = b[c * 4 + 3]
    _m[c * 4] = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3
    _m[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3
    _m[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3
    _m[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3
  }
  out.set(_m)
  return out
}

/**
 * Dünya nöqtəsi → klip fəzası. Nəticə `[cx, cy, cw]`.
 * Ekran pikselinə çevirmək üçün: `x = (cx/cw*0.5+0.5) * cssWidth`.
 *
 * ⚠️ `cw <= 0` → nöqtə kameranın ARXASINDADIR. Çağıran tərəf bunu yoxlamalıdır,
 * yoxsa şaftalı ekranın əks tərəfində "görünür" və klik səhv düşür.
 */
export function project(
  m: Mat4,
  x: number,
  y: number,
  z: number,
  out: [number, number, number],
): [number, number, number] {
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12]
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13]
  out[2] = m[3] * x + m[7] * y + m[11] * z + m[15]
  return out
}
