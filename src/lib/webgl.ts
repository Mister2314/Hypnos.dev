
/**
 * v24: burada 6 WebGL funksiyası vardı (createGL, buildProgram, QUAD_VS,
 * bindFullscreenTriangle, uniformLocations, loadTexture) — pond/film-overlay
 * silinəndən (v7.0) istifadəçisi yox idi. Yalnız sizeCanvas qaldı.
 */

export function sizeCanvas(canvas: HTMLCanvasElement, cap = 2): boolean {
  const dpr = Math.min(window.devicePixelRatio || 1, cap)
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
  if (canvas.width === w && canvas.height === h) return false
  canvas.width = w
  canvas.height = h
  return true
}
