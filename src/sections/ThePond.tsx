


import { useEffect, useRef } from 'react'
import { ScrollTrigger, ambient, eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { POND } from '../lib/site'
import { addRings, markPond } from '../lib/journey'
import { PERF, isNarrow } from '../lib/perf'
import { QUAD_VS, bindFullscreenTriangle, buildProgram, createGL, sizeCanvas, uniformLocations } from '../lib/webgl'




const POND_FS = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uProg;
uniform float uAspect;
uniform float uWind;
uniform float uSeed;
uniform float uWaves;
uniform vec4  uR[8];

const float Z_NEAR = 0.55;
const float Z_FAR = 26.0;
const float TANX = 0.384;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float cypress(vec2 uv, float sx, float w, float hgt, float base) {
  float dy = (uv.y - base) / hgt;
  if (dy < 0.0 || dy > 1.2) return 0.0;
  float dx = abs(uv.x - sx);
  float rad = w * (1.0 - 0.72 * clamp(dy, 0.0, 1.0));
  if (dy > 1.0) rad *= (1.2 - dy) / 0.2;
  return smoothstep(rad, rad * 0.55, dx);
}

void main() {
  vec2 uv = vUv;


  float hz = 0.60 + 0.055 * uProg;
  float camX = (uProg - 0.5) * 1.5;
  float p = clamp((hz - uv.y) / hz, 0.0, 1.0);
  float z = mix(Z_NEAR, Z_FAR, p * p);
  float halfW = z * TANX * uAspect;
  float x = (uv.x - 0.5) * 2.0 * halfW + camX;


  float h = 0.0;
  vec2 grad = vec2(0.0);
  for (int i = 0; i < 8; i++) {
    if (float(i) >= uWaves) break;
    float fi = float(i);
    float ang = uSeed * 2.094 + fi * 2.39996;
    vec2 dir = normalize(vec2(0.86 + 0.30 * cos(ang), 0.42 + 0.30 * sin(ang)));
    float freq = 1.05 + fi * 0.82;
    float amp = 0.030 / (1.0 + fi * 0.9);
    float ph = dot(dir, vec2(x, z)) * freq + uTime * (0.55 + fi * 0.31) + fi * 1.73;
    h += amp * sin(ph) * uWind;
    grad += amp * freq * cos(ph) * dir * uWind;
  }


  for (int i = 0; i < 8; i++) {
    vec4 rp = uR[i];
    if (rp.w < 0.001) continue;
    vec2 d = vec2(x, z) - rp.xy;
    float r = length(d);
    float env = exp(-r * 0.48) * exp(-rp.z * 1.15) * smoothstep(0.0, 0.10, rp.z);
    if (env < 0.004) continue;
    float ph = r * 6.0 - rp.z * 5.0;
    float a = rp.w * env * 0.075;
    h += a * sin(ph);
    grad += a * 6.0 * cos(ph) * (d / max(r, 0.001));
  }

  vec3 n = normalize(vec3(-grad.x, 1.0, -grad.y));



  vec3 V = normalize(vec3(camX - x, 1.35, -z));
  float el = mix(0.40, 0.10, uProg);
  float azx = (0.66 - 0.5) * 2.0 * TANX * uAspect;
  vec3 L = normalize(vec3(azx * cos(el), sin(el), cos(el)));

  float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, V), 0.0), 5.0);


  vec3 deep = vec3(0.047, 0.082, 0.071);
  vec3 shallow = vec3(0.082, 0.118, 0.088);
  vec3 cream = vec3(0.820, 0.800, 0.686);
  vec3 dusk = vec3(0.42, 0.36, 0.34);
  vec3 sunCol = mix(vec3(1.0, 0.86, 0.58), vec3(1.0, 0.58, 0.40), uProg);



  vec3 base = mix(deep, shallow, p * 0.6);
  float diff = 0.62 + 0.38 * max(dot(n, L), 0.0);
  vec3 skyRef = mix(cream, dusk, uProg * 0.55);
  vec3 col = mix(base * diff, skyRef, fres);

  vec3 refl = reflect(-V, n);
  float rd = max(dot(refl, L), 0.0);
  col += sunCol * pow(rd, 90.0) * 1.15;
  col += sunCol * pow(rd, 9.0) * 0.10;
  col += sunCol * max(h, 0.0) * 0.55;


  col = mix(vec3(0.135, 0.125, 0.085), col, smoothstep(0.0, 0.05, p));


  if (uv.y > hz) {
    float t = (uv.y - hz) / max(0.001, 1.0 - hz);
    vec3 sky = mix(cream, vec3(0.145, 0.135, 0.095), pow(t, 0.75));
    sky = mix(sky, dusk, uProg * 0.40 * (1.0 - t));

    sky = mix(sky, vec3(0.085, 0.088, 0.062), smoothstep(0.12, 0.0, t) * 0.55);


    vec2 sunUV = vec2(0.66, hz + 0.02 + el * 0.30);
    float sd = length((uv - sunUV) * vec2(uAspect, 1.0));
    float disc = smoothstep(0.030, 0.024, sd);
    float glow = pow(smoothstep(0.42, 0.0, sd), 1.8);
    sky += sunCol * glow * 0.55 + sunCol * disc * 0.9;


    float cy = max(
      cypress(uv, 0.665, 0.011, 0.115, hz),
      cypress(uv, 0.738, 0.016, 0.175, hz)
    );
    sky = mix(sky, vec3(0.043, 0.052, 0.040), cy);

    col = sky;
  }

  gl_FragColor = vec4(col, 1.0);
}
`

const UNIFORMS = ['uTime', 'uProg', 'uAspect', 'uWind', 'uSeed', 'uWaves', 'uR[0]'] as const




const Z_NEAR = 0.55
const Z_FAR = 26
const TANX = 0.384
const HZ0 = 0.6
const HZ_D = 0.055
const CAMX_D = 1.5


const RIPPLES = 8

const RIPPLE_LIFE = 6

export default function ThePond() {
  const ref = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const progressRef = useRef(0)

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) return


      gsap.from(q('.pond__copy'), {
        opacity: 0,
        y: 26,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.pond__sticky')[0], start: 'top 55%' },
      })


      ambient(q('.pond__hint'), { y: -3 }, 6)
    },
    { scope: ref },
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    markPond()

    const gl = createGL(canvas)
    if (!gl) {


      canvas.style.display = 'none'
      return
    }

    const prog = buildProgram(gl, QUAD_VS, POND_FS)
    if (!prog) {
      canvas.style.display = 'none'
      return
    }
    const u = uniformLocations(gl, prog, UNIFORMS)
    gl.useProgram(prog)
    bindFullscreenTriangle(gl, prog)



    const seed = 1 + Math.floor(Math.random() * 3)
    gl.uniform1f(u.uSeed, seed)
    gl.uniform1f(u.uWaves, isNarrow() ? 4 : 7)


    const rip = new Float32Array(RIPPLES * 4)
    const ripOut = new Float32Array(RIPPLES * 4)
    let ripIdx = 0

    const spawnRipple = (cssX: number, cssY: number, amp: number, time: number) => {
      const r = canvas.getBoundingClientRect()
      const uvx = (cssX - r.left) / Math.max(1, r.width)
      const uvy = 1 - (cssY - r.top) / Math.max(1, r.height)
      const hz = HZ0 + HZ_D * smooth

      const pp = uvy > hz ? 0.94 : Math.min(1, Math.max(0, (hz - uvy) / hz))
      const z = Z_NEAR + (Z_FAR - Z_NEAR) * pp * pp
      const halfW = z * TANX * (canvas.width / Math.max(1, canvas.height))
      const x = (uvx - 0.5) * 2 * halfW + (smooth - 0.5) * CAMX_D

      rip[ripIdx * 4] = x
      rip[ripIdx * 4 + 1] = z
      rip[ripIdx * 4 + 2] = time
      rip[ripIdx * 4 + 3] = amp
      ripIdx = (ripIdx + 1) % RIPPLES
    }

    const onDown = (e: PointerEvent) => {
      spawnRipple(e.clientX, e.clientY, 1.0, gsap.ticker.time)


      if (!prefersReducedMotion) addRings(1)
      hintRef.current?.classList.add('is-done')
    }


    let lastMove = 0
    let lastX = -1
    let lastY = -1
    const onMove = (e: PointerEvent) => {
      const t = gsap.ticker.time
      const dx = lastX < 0 ? 999 : Math.abs(e.clientX - lastX)
      const dy = lastY < 0 ? 999 : Math.abs(e.clientY - lastY)
      if (t - lastMove < 0.14 || dx + dy < 56) return
      lastMove = t
      lastX = e.clientX
      lastY = e.clientY
      spawnRipple(e.clientX, e.clientY, 0.5, t)
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)

    const resize = () => {
      if (sizeCanvas(canvas, PERF.canvasDpr)) {
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform1f(u.uAspect, canvas.width / Math.max(1, canvas.height))
      }
    }

    resize()
    window.addEventListener('resize', resize)


    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })


    let running = false
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting
      },
      { rootMargin: '25% 0px' },
    )
    io.observe(canvas)

    let smooth = 0
    let nextAuto = 2.5

    const draw = (time: number) => {
      smooth += (progressRef.current - smooth) * 0.06
      const cp = smooth


      const gust = 0.55 + 0.75 * Math.sin(cp * Math.PI)

      for (let i = 0; i < RIPPLES; i++) {
        const o = i * 4
        const amp = rip[o + 3]
        const age = amp > 0 ? time - rip[o + 2] : 999
        ripOut[o] = rip[o]
        ripOut[o + 1] = rip[o + 1]
        ripOut[o + 2] = age
        ripOut[o + 3] = age < RIPPLE_LIFE ? amp : 0
      }

      gl.uniform1f(u.uTime, time)
      gl.uniform1f(u.uProg, cp)
      gl.uniform1f(u.uWind, gust)
      gl.uniform4fv(u['uR[0]'], ripOut)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }




    let tick: ((time: number, delta: number) => void) | null = null

    const cleanup = () => {
      if (tick) gsap.ticker.remove(tick)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      io.disconnect()
      st.kill()
      gl.deleteProgram(prog)


    }




    if (prefersReducedMotion) {
      progressRef.current = 0.38
      smooth = 0.38
      gl.uniform1f(u.uTime, 3.0)
      gl.uniform1f(u.uAspect, canvas.width / Math.max(1, canvas.height))
      draw(3.0)
      return cleanup
    }

    tick = (time: number, delta: number) => {
      if (!running || gl.isContextLost()) return
      void delta

      if (time > nextAuto) {
        nextAuto = time + 3.2 + Math.random() * 2.6
        const pp = 0.25 + Math.random() * 0.6
        const z = Z_NEAR + (Z_FAR - Z_NEAR) * pp * pp
        const halfW = z * TANX * (canvas.width / Math.max(1, canvas.height))
        rip[ripIdx * 4] = (Math.random() - 0.5) * 1.7 * halfW + (smooth - 0.5) * CAMX_D
        rip[ripIdx * 4 + 1] = z
        rip[ripIdx * 4 + 2] = time
        rip[ripIdx * 4 + 3] = 0.38
        ripIdx = (ripIdx + 1) % RIPPLES
      }
      draw(time)
    }
    gsap.ticker.add(tick)

    return cleanup
  }, [])

  return (
    <section className="section section--pond" data-world="pond" id="pond" ref={ref}>
      <div className="pond__sticky">
        <canvas ref={canvasRef} className="pond__canvas" aria-hidden="true" />

        <div className="pond__copy">
          <p className="section__eyebrow">{eyebrow('pond')}</p>
          <h2 className="pond__head">{POND.head}</h2>
          <p className="pond__sub">{POND.sub}</p>
        </div>

        <p className="pond__hint" ref={hintRef}>
          {POND.hint}
        </p>
      </div>
    </section>
  )
}
