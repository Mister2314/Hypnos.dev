/**
 * FilmOverlay — tam ekran WebGL film qatı: qran + halation + vinyetka.
 *
 * Bu, `pear.no`-nun imzasıdır: əl ilə yazılmış GLSL, kitabxana yox.
 * DOM-un ÜSTÜNDƏ durur, `mix-blend-mode: overlay` ilə qarışır.
 * Baza rəngi **0.5**-dir — overlay blend-də 0.5 neytraldır, ona görə yalnız
 * qran və isti işıq görünür, məzmun təhrif olunmur.
 *
 * Dəyərləri `worldState`-dən oxuyur (fəsil dəyişdikcə qran/işıq dəyişir) —
 * yazan `Backdrop`-dur, bura yalnız oxuyur.
 *
 * ⚠️ v6.9–v6.10 tarixçəsi: bu qat bir müddət alpha-speck ilə əvəz olunmuşdu —
 * Khayal *"silmisen kimi gozukur"* dedi və DƏQİQ bu orijinal hal bərpa edildi
 * (QERARLAR §34). Görünməz perf optimallaşdırmaları sequence-lərdədir
 * (`lib/sequence.ts`, `lib/perf.ts`).
 */
import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, worldState } from '../lib/scroll'
import {
  QUAD_VS,
  bindFullscreenTriangle,
  buildProgram,
  createGL,
  sizeCanvas,
  uniformLocations,
} from '../lib/webgl'

/**
 * Hash — `sin()`-siz variant (Dave Hoskins).
 * Niyə: `sin`-li hash hər piksel üçün bahalıdır; tam ekran keçiddə bu, FPS-i yeyir.
 */
const FS = `
precision mediump float;

uniform vec2  uRes;
uniform float uTime;
uniform float uGrain;
uniform float uHalo;
uniform vec2  uLight;
varying vec2  vUv;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = vUv;

  /* --- film qranı: iki tezlik --- */
  float g1 = hash21(uv * uRes + vec2(uTime * 137.0, uTime * 91.0));
  float g2 = hash21(floor(uv * 220.0) + vec2(uTime * 3.0, uTime * 2.0));
  float grain = ((g1 - 0.5) * 0.72 + (g2 - 0.5) * 0.42) * uGrain;

  /* --- halation: isti işıq yumşaq yayılır --- */
  float ar = uRes.x / max(uRes.y, 1.0);
  float d = length((uv - uLight) * vec2(ar, 1.0));
  float halo = pow(smoothstep(1.05, 0.0, d), 1.6);
  vec3 warm = vec3(1.0, 0.60, 0.33) * halo * uHalo * 0.20;

  /* --- vinyetka --- */
  float vig = smoothstep(1.32, 0.40, length(uv - 0.5) * 1.5);
  float v = (vig - 1.0) * 0.26;

  /* baza 0.5 = overlay blend-də neytral */
  vec3 col = vec3(0.5 + v) + grain + warm;
  gl_FragColor = vec4(col, 1.0);
}
`

const UNIFORMS = ['uRes', 'uTime', 'uGrain', 'uHalo', 'uLight'] as const

export default function FilmOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = createGL(canvas)
    if (!gl) {
      console.warn('[FilmOverlay] WebGL yoxdur — qat söndürüldü')
      canvas.style.display = 'none'
      return
    }

    const prog = buildProgram(gl, QUAD_VS, FS)
    if (!prog) {
      canvas.style.display = 'none'
      return
    }

    gl.useProgram(prog)
    bindFullscreenTriangle(gl, prog)
    const u = uniformLocations(gl, prog, UNIFORMS)

    // Ölçmə hər kadrda YOX — `clientWidth` oxusu layout-u məcburi hesablayır (reflow).
    // Yalnız mount + resize-da ölçürük.
    const resize = () => {
      if (sizeCanvas(canvas, 1.5)) gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const render = (time: number) => {
      if (gl.isContextLost()) return
      gl.uniform2f(u.uRes, canvas.width, canvas.height)
      gl.uniform1f(u.uTime, time)
      gl.uniform1f(u.uGrain, worldState.grain)
      gl.uniform1f(u.uHalo, worldState.halo)
      gl.uniform2f(u.uLight, worldState.lx, worldState.ly)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    // reduced-motion → bir dəfə çək, dövrəni işə salma
    if (prefersReducedMotion) {
      render(0)
      return () => window.removeEventListener('resize', resize)
    }

    // GSAP ticker-i ilə paylaşılan dövrə — ayrı rAF açmırıq (Lenis də buradadır)
    const tick = (time: number) => render(time)
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('resize', resize)
      gsap.ticker.remove(tick)
      gl.deleteProgram(prog)
      // `loseContext()` yox — eyni təl: StrictMode dev-də effect-i
      // iki dəfə işlədir, ikinci mount itirilmiş kontekst alır → shader yığılmır.
    }
  }, [])

  return <canvas ref={canvasRef} className="film-overlay" aria-hidden="true" />
}
