/**
 * ⚠️ RETIRED — 26 sentyabr, v6.3: `03 The Berm` → `03 The Counterweight`.
 *
 * Khayalın qərarı: berm-in arxa planına Arcane astral səhnəsi gəldi və mətn
 * counterweight məzmunu ilə əvəzləndi (`QERARLAR.md §29`).
 *
 * Bu fayl CANLI SAYTA DAXİL DEYİL (App.tsx onu import etmir, Vite bundle-a
 * almır) — yalnız `tsc` yoxlayır. Kuləkli ot playeri bərpa olunacaqsa:
 *   1. Bu faylı `src/sections/Berm.tsx`-ə qaytar (import yollarını düzəlt)
 *   2. `App.tsx`-də bölməni əvəz et
 *   3. `global.css`-dəki köhnə `.berm__*` blokunu qaytar (git yoxdur —
 *      köhnə CSS `QERARLAR.md §26`-dakı təsvirdən bərpa edilir)
 *   4. `WORLDS`-ə `berm` sətrini qaytar
 */
import { useEffect, useRef } from 'react'
import Line from '../components/Line'
import { buildGrass } from '../lib/grass'
import { isNarrow } from '../lib/perf'
import { lookAt, mat4, multiply, perspective, type Vec3 } from '../lib/mat4'
import { ScrollTrigger, ambient, eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { buildProgram, createGL, sizeCanvas, uniformLocations, type GL } from '../lib/webgl'

/* shaderlər və player — orijinal v6 məzmunu, dəyişilmədən saxlanılıb */

const GRASS_VS = `
precision highp float;

attribute vec2 aOff;    /* x = yan sürüşmə (en profili) · y = 0..1 (kökdən uca) */
attribute vec2 aRoot;   /* dünya XZ — qılçanın kökü */

uniform mat4  uVP;
uniform float uTime;
uniform float uWind;
uniform vec2  uPush;
uniform float uPushAmp;
uniform float uAspect;

varying float vT;
varying float vShade;
varying float vVar;
varying float vPush;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float windAt(vec2 p, float t) {
  float slow = sin(p.x * 0.33 + p.y * 0.21 + t * 0.58);
  float fast = sin(p.x * 1.27 - p.y * 0.94 + t * 1.71) * 0.30;
  return slow + fast;
}

void main() {
  float h = 0.30 + 0.28 * hash(aRoot);
  float t = aOff.y;
  float seed = hash(aRoot * 1.37);

  vec3 p;
  p.x = aRoot.x + aOff.x;
  p.z = aRoot.y;
  p.y = t * h;

  float w = windAt(aRoot, uTime) * uWind;
  float stiff = t * t;
  vec2 dir = normalize(vec2(0.87, 0.49));
  p.x += dir.x * w * stiff * h * 0.62;
  p.z += dir.y * w * stiff * h * 0.62;
  p.y -= abs(w) * stiff * h * 0.34;

  p.x += sin(uTime * 3.1 + seed * 6.283) * 0.010 * t;

  float dap = 0.58 + 0.42 * sin(aRoot.x * 0.52 + aRoot.y * 0.33 + uTime * 0.09);
  dap *= 0.74 + 0.26 * sin(aRoot.x * -0.81 + aRoot.y * 0.64 + 2.1);
  vShade = dap;
  vT = t;
  vVar = seed;

  gl_Position = uVP * vec4(p, 1.0);

  vPush = 0.0;
  if (gl_Position.w > 0.001) {
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 diff = (ndc - uPush) * vec2(uAspect, 1.0);
    float dist = length(diff);
    float infl = exp(-dist * dist * 24.0) * uPushAmp;
    if (dist > 0.0001 && infl > 0.001) {
      float lean = t * (0.45 + 0.55 * t);
      gl_Position.xy += (diff / dist) * infl * lean * gl_Position.w;
      vPush = infl * lean;
    }
  }
}
`

const GRASS_FS = `
precision mediump float;

uniform vec3 uBase;
uniform vec3 uTip;
uniform vec3 uDry;

varying float vT;
varying float vShade;
varying float vVar;
varying float vPush;

void main() {
  vec3 tip = mix(uTip, uDry, vVar);
  vec3 col = mix(uBase, tip, vT * vT);
  col *= 0.42 + 0.72 * vShade;
  col += vPush * 0.16;
  gl_FragColor = vec4(col, 1.0);
}
`

const UNIFORMS = ['uVP', 'uTime', 'uWind', 'uPush', 'uPushAmp', 'uAspect', 'uBase', 'uTip', 'uDry'] as const

const FOV = (42 * Math.PI) / 180
const NARROW = 760
const BLADES_WIDE = 4500
const BLADES_NARROW = 1300

const BASE: Vec3 = [0.075, 0.098, 0.048]
const TIP: Vec3 = [0.315, 0.365, 0.152]
const DRY: Vec3 = [0.455, 0.415, 0.205]

function attrib(
  gl: GL,
  prog: WebGLProgram,
  name: string,
  size: number,
  stride: number,
  offset: number,
): void {
  const loc = gl.getAttribLocation(prog, name)
  if (loc < 0) return
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset)
}

export default function Berm() {
  const ref = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(q('.rv, .berm__note, .berm__caption'), { opacity: 1 })
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      })

      tl.fromTo(
        q('.berm__sun'),
        { yPercent: -22, opacity: 0.32, scale: 0.9 },
        { yPercent: 18, opacity: 0.92, scale: 1.18 },
        0,
      )

      const note = q('.berm__scribble path')[0] as unknown as SVGPathElement | undefined
      if (note) {
        const len = note.getTotalLength()
        gsap.set(note, { strokeDasharray: len, strokeDashoffset: len })
        tl.to(note, { strokeDashoffset: 0, duration: 0.34 }, 0.1)
      }
      tl.fromTo(q('.berm__note'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.3 }, 0.16)

      gsap.from(q('.berm__line .rv'), {
        yPercent: 65,
        opacity: 0,
        filter: 'blur(9px)',
        duration: 0.95,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.berm__line')[0], start: 'top 78%' },
      })

      ambient(q('.berm__note-hand'), { y: -3, rotate: 0.5 }, 7)
    },
    { scope: ref },
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const narrow = window.innerWidth < NARROW
    const low = isNarrow()
    const field = buildGrass(narrow ? (low ? 900 : BLADES_NARROW) : low ? 1600 : BLADES_WIDE)

    const gl = createGL(canvas, { depth: true })
    if (!gl) {
      canvas.style.display = 'none'
      return
    }

    const prog = buildProgram(gl, GRASS_VS, GRASS_FS)
    if (!prog) {
      canvas.style.display = 'none'
      return
    }
    const u = uniformLocations(gl, prog, UNIFORMS)

    const vbo = gl.createBuffer()
    const ibo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, field.verts, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, field.indices, gl.STATIC_DRAW)

    const STRIDE = 16
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    attrib(gl, prog, 'aOff', 2, STRIDE, 0)
    attrib(gl, prog, 'aRoot', 2, STRIDE, 8)

    const projM = mat4()
    const viewM = mat4()
    const vpM = mat4()
    const eye: Vec3 = [0, 0, 0]
    const ctr: Vec3 = [0, 0, 0]
    const up: Vec3 = [0, 1, 0]

    const resize = () => {
      if (sizeCanvas(canvas, narrow ? 1 : 1.25)) gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const ptr = { x: 10, y: 10, tx: 10, ty: 10, s: 0, ts: 0 }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      ptr.tx = ((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1
      ptr.ty = 1 - ((e.clientY - r.top) / Math.max(1, r.height)) * 2
      ptr.ts = 1
    }
    const onLeave = () => {
      ptr.ts = 0
    }

    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

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

    const draw = (time: number, cp: number) => {
      eye[0] = -0.55 + 1.1 * cp
      eye[1] = 1.05 - 0.16 * cp
      eye[2] = 5.4 - 2.6 * cp
      ctr[0] = eye[0] * 0.35
      ctr[1] = 0.34 - 0.05 * cp
      ctr[2] = -5.5

      perspective(projM, FOV, canvas.width / Math.max(1, canvas.height), 0.1, 60)
      lookAt(viewM, eye, ctr, up)
      multiply(vpM, projM, viewM)

      const gust = 0.55 + 0.95 * Math.sin(cp * Math.PI)

      gl.depthMask(true)
      gl.enable(gl.DEPTH_TEST)
      gl.depthFunc(gl.LEQUAL)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      gl.useProgram(prog)
      gl.uniformMatrix4fv(u.uVP, false, vpM)
      gl.uniform1f(u.uTime, time)
      gl.uniform1f(u.uWind, gust)
      gl.uniform2f(u.uPush, ptr.x, ptr.y)
      gl.uniform1f(u.uPushAmp, ptr.s * 0.11)
      gl.uniform1f(u.uAspect, canvas.width / Math.max(1, canvas.height))
      gl.uniform3fv(u.uBase, BASE)
      gl.uniform3fv(u.uTip, TIP)
      gl.uniform3fv(u.uDry, DRY)

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
      attrib(gl, prog, 'aOff', 2, STRIDE, 0)
      attrib(gl, prog, 'aRoot', 2, STRIDE, 8)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
      gl.drawElements(gl.TRIANGLES, field.indexCount, gl.UNSIGNED_SHORT, 0)
    }

    let tick: ((time: number, delta: number) => void) | null = null

    const cleanup = () => {
      if (tick) gsap.ticker.remove(tick)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
      io.disconnect()
      st.kill()
      gl.deleteBuffer(vbo)
      gl.deleteBuffer(ibo)
      gl.deleteProgram(prog)
    }

    if (prefersReducedMotion) {
      draw(0, 0.42)
      return cleanup
    }

    tick = (time: number, delta: number) => {
      if (!running || gl.isContextLost()) return
      const dt = Math.min(0.05, (delta || 16.7) / 1000)
      smooth += (progressRef.current - smooth) * 0.06

      ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt * 7)
      ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt * 7)
      ptr.s += (ptr.ts - ptr.s) * Math.min(1, dt * 4)

      draw(time, smooth)
    }
    gsap.ticker.add(tick)

    return cleanup
  }, [])

  return (
    <section className="section section--berm" data-world="berm" id="berm" ref={ref}>
      <div className="berm__stage">
        <div className="berm__sun" aria-hidden="true" />
        <canvas ref={canvasRef} className="berm__canvas" aria-hidden="true" />
        <div className="berm__inner">
          <p className="section__eyebrow">{eyebrow('berm')}</p>
          <Line
            className="section__line berm__line"
            text="There is a path off the road. At the bottom of it, nobody is watching."
          />
          <p className="berm__note">
            <span className="berm__note-hand">this is my spot</span>
            <svg
              className="berm__scribble"
              viewBox="0 0 260 14"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M3 10 C 52 3, 96 12, 150 6 S 232 3, 257 9" />
            </svg>
          </p>
          <p className="berm__caption">The Berm · the shaded knoll where he goes to read</p>
        </div>
      </div>
    </section>
  )
}
