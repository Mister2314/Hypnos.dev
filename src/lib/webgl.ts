/**
 * webgl.ts — minimal WebGL köməkçiləri.
 *
 * Niyə əl ilə: Three.js ~150 KB gətirir, bizə cəmi 2 shader lazımdır.
 * pear.no da eyni yolu seçib (əl ilə GLSL, kitabxana yox) — bu, səviyyənin özüdür.
 */

export type GL = WebGLRenderingContext

export function createGL(
  canvas: HTMLCanvasElement,
  attrs: WebGLContextAttributes = {},
): GL | null {
  const base: WebGLContextAttributes = {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    ...attrs,
  }
  const gl = (canvas.getContext('webgl', base) ||
    canvas.getContext('experimental-webgl', base)) as GL | null
  return gl
}

function compile(gl: GL, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('[webgl] shader:', gl.getShaderInfoLog(sh), '\n', src)
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function buildProgram(gl: GL, vsSrc: string, fsSrc: string): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc)
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc)
  if (!vs || !fs) return null
  const p = gl.createProgram()
  if (!p) return null
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error('[webgl] link:', gl.getProgramInfoLog(p))
    gl.deleteProgram(p)
    return null
  }
  return p
}

/** Vertex shader — bir böyük üçbucaq bütün ekranı örtür (6 yerinə 3 təpə). */
export const QUAD_VS = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

/** Tam ekran üçbucağı qur və `aPos` atributunu bağla. */
export function bindFullscreenTriangle(gl: GL, prog: WebGLProgram): void {
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'aPos')
  if (loc >= 0) {
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  }
}

/** Bütün uniform yerlərini bir dəfə yığ. */
export function uniformLocations<T extends string>(
  gl: GL,
  prog: WebGLProgram,
  names: readonly T[],
): Record<T, WebGLUniformLocation | null> {
  const out = {} as Record<T, WebGLUniformLocation | null>
  for (const n of names) out[n] = gl.getUniformLocation(prog, n)
  return out
}

/** Şəkli tekstura kimi yüklə. `onReady` yalnız uğurlu decode-dan sonra çağırılır. */
export function loadTexture(
  gl: GL,
  src: string,
  onReady: (tex: WebGLTexture, w: number, h: number) => void,
): () => void {
  let cancelled = false
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.decoding = 'async'
  img.onload = () => {
    if (cancelled) return
    const tex = gl.createTexture()
    if (!tex) return
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    onReady(tex, img.naturalWidth, img.naturalHeight)
  }
  img.src = src
  return () => {
    cancelled = true
  }
}

/** Canvas-ı CSS ölçüsünə uyğunlaşdır, DPR-ı `cap` ilə məhdudlaşdır. */
export function sizeCanvas(canvas: HTMLCanvasElement, cap = 2): boolean {
  const dpr = Math.min(window.devicePixelRatio || 1, cap)
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
  if (canvas.width === w && canvas.height === h) return false
  canvas.width = w
  canvas.height = h
  return true
}
