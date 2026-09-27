/**
 * 06 — The Pond (Laghetto — «əkslər gölməçəsi»).
 *
 * **Niyə ağac getdi:** filmin ikonik olan şeyi MEYVƏ idi, ağac yox — real
 * Villa Albergoni-də şaftalı ağacı heç olmayıb, bağ çəkiliş üçün xüsusi
 * əkilmişdi (movie-locations.com). Su isə filmin «emosional barometri»dir:
 * 5+ səhnə eyni suya qayıdır — gecə üzgüçülüyü, ilk gecədən sonra səhər,
 * dostlarla üzmə. Diaqnoz və 10 namizədin müqayisəsi:
 * `research/06-3d-model-variantlari.md`.
 *
 * **Necə qurulub — analitik heightfield, raymarching YOX:**
 *   · dalğalar = yönəlmiş sin-lərin cəmi → qradiyent ANALİTİK (cos ilə).
 *     Hər piksel üçün əlavə noise çağırışı yoxdur — normal «pulsuzdur».
 *   · normal = normalize(-grad, 1) · fresnel = Schlick
 *   · günəş parıltısı = reflect(-V, n) · L — Blinn-Phong yox, vektor reflaksiyası
 *   · halqalar = pointer + avtomatik, 8 yuvalı buffer, yaşa görə şaderdə söner
 *   · kamera = saxta (sabit pitch, prog ilə aşağı oturur) — mat4 lazım deyil
 *
 * ⚠️ **«Üç dubl» qaydası** (`research/05 §6.4` — *"three takes"*): hər
 * ziyarətdə dalğa fazaları `uSeed` (1|2|3) ilə sürüşür — hər dəfə bir az
 * başqa gölmə, amma eyni gölməçə. Borrowed deyil, canlı.
 *
 * ⚠️ **İki hərəkət mənbəyi var və qarışdırılmamalıdır** (Berm-dəki qayda):
 *   · **vaxt** → dalğalar + halqalar. Scroll olmasa da su yaşayır.
 *   · **scroll** → kamera oturur, günəş batır, külək ortada güclənir
 *     (SYNTHESIS §5: hər fəsılda bir sükut, bir partlayış).
 *
 * ⚠️ **Sərv siluetləri** sahil xəttindədir və günəş arxalarında batır —
 * CMBYN-in «postkart» kompozisiyası. Real kadr kopyalanmır: sərv + su
 * ümumi təbiət formalarıdır (legal qeyd: `research/06 §5`).
 *
 * ⚠️ **Sayğac yoxdur.** Toxunma sayı yalnız sonunda — 13 Signature-də —
 * peyda olur (CMBYN adı da yalnız son dəqiqədə gəlir). HUD əvəzinə tək
 * balaca təlimat var, ilk toxunuşdan sonra sönməyə başlayır.
 */
import { useEffect, useRef } from 'react'
import { ScrollTrigger, ambient, eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { POND } from '../lib/site'
import { addRings, markPond } from '../lib/journey'
import { PERF, isNarrow } from '../lib/perf'
import { QUAD_VS, bindFullscreenTriangle, buildProgram, createGL, sizeCanvas, uniformLocations } from '../lib/webgl'

/* ------------------------------------------------------------------ shaderlər */

/**
 * Analitik su — tam ekran üçbucaq üstündə saxta kamera.
 *
 * ⚠️ JS TƏRƏFİ BU SABİTLƏRİ TƏKRAR EDİR (`Z_NEAR`…`CAMX_D`, aşağıda) — pointer
 * ekran nöqtəsini dalğa fəzasına salmaq üçün. Birini dəyişirsənsə, o birini də.
 */
const POND_FS = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uProg;      /* scroll 0..1 — kamera + günəş */
uniform float uAspect;
uniform float uWind;      /* külək gücü — fəsil boyu bir şiş */
uniform float uSeed;      /* «üç dubl» — hər ziyarət bir az başqa */
uniform float uWaves;     /* high: 7 · low: 4 */
uniform vec4  uR[8];      /* halqalar: x, z, yaş, güc */

const float Z_NEAR = 0.55;
const float Z_FAR = 26.0;
const float TANX = 0.384;  /* tan(21°) — üfüqi yarı-FOV */

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

/** Sərv silueti — kökdən uca daralan damla. Qayıdır: 1 = tam için, 0 = kənar. */
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

  /* ---- saxta kamera: prog ilə aşağı oturur, yanana sürüşür ---- */
  float hz = 0.60 + 0.055 * uProg;
  float camX = (uProg - 0.5) * 1.5;
  float p = clamp((hz - uv.y) / hz, 0.0, 1.0);      /* 0 = üfüq · 1 = ayaq altı */
  float z = mix(Z_NEAR, Z_FAR, p * p);
  float halfW = z * TANX * uAspect;
  float x = (uv.x - 0.5) * 2.0 * halfW + camX;

  /* ---- dalğalar: yönəlmiş sin-lər, qradiyent analitik ---- */
  float h = 0.0;
  vec2 grad = vec2(0.0);
  for (int i = 0; i < 8; i++) {
    if (float(i) >= uWaves) break;
    float fi = float(i);
    float ang = uSeed * 2.094 + fi * 2.39996;        /* qızıl bucaq paylaması */
    vec2 dir = normalize(vec2(0.86 + 0.30 * cos(ang), 0.42 + 0.30 * sin(ang)));
    float freq = 1.05 + fi * 0.82;
    float amp = 0.030 / (1.0 + fi * 0.9);
    float ph = dot(dir, vec2(x, z)) * freq + uTime * (0.55 + fi * 0.31) + fi * 1.73;
    h += amp * sin(ph) * uWind;
    grad += amp * freq * cos(ph) * dir * uWind;
  }

  /* ---- halqalar: pointer + avtomatik; yaşa görə söner ---- */
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

  /* ---- baxış və günəş: el proqress ilə azalır — günəş batır ----
     Günəşin ekran mövqeyi SABİT (0.66) — sonsuz uzaq obyekt kameranın
     yanana sürüşməsindən tərpənmir. Azimut ekrandan TÖRƏDİLİR: beləcə
     disk ilə su parıltısı hər ekran nisbətində üst-üstə düşür. */
  vec3 V = normalize(vec3(camX - x, 1.35, -z));
  float el = mix(0.40, 0.10, uProg);
  float azx = (0.66 - 0.5) * 2.0 * TANX * uAspect;
  vec3 L = normalize(vec3(azx * cos(el), sin(el), cos(el)));

  float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, V), 0.0), 5.0);

  /* ---- rənglər — CMBYN palitrasından ölçülmüş ankerlər (KONSEPT §2.3) ---- */
  vec3 deep = vec3(0.047, 0.082, 0.071);       /* #0c1512 */
  vec3 shallow = vec3(0.082, 0.118, 0.088);
  vec3 cream = vec3(0.820, 0.800, 0.686);      /* #d1ccaf */
  vec3 dusk = vec3(0.42, 0.36, 0.34);
  vec3 sunCol = mix(vec3(1.0, 0.86, 0.58), vec3(1.0, 0.58, 0.40), uProg);

  /* ---- SU ---- */
  /* Yaxın sahə tünd qalır — əvvəl açıq idi və qum kimi oxunurdu (ekran yoxlaması). */
  vec3 base = mix(deep, shallow, p * 0.6);
  float diff = 0.62 + 0.38 * max(dot(n, L), 0.0);
  vec3 skyRef = mix(cream, dusk, uProg * 0.55);
  vec3 col = mix(base * diff, skyRef, fres);

  vec3 refl = reflect(-V, n);
  float rd = max(dot(refl, L), 0.0);
  col += sunCol * pow(rd, 90.0) * 1.15;        /* dara parıltı */
  col += sunCol * pow(rd, 9.0) * 0.10;         /* enişli şüa */
  col += sunCol * max(h, 0.0) * 0.55;          /* crest işığı tutur */

  /* sahil zolağı — üfüqün dərhal altında silt */
  col = mix(vec3(0.135, 0.125, 0.085), col, smoothstep(0.0, 0.05, p));

  /* ---- SƏMA (su xəttindən yuxarı) ---- */
  if (uv.y > hz) {
    float t = (uv.y - hz) / max(0.001, 1.0 - hz);
    vec3 sky = mix(cream, vec3(0.145, 0.135, 0.095), pow(t, 0.75));
    sky = mix(sky, dusk, uProg * 0.40 * (1.0 - t));
    /* uzaq sahil ağacları — üfüqdə tünd zolaq */
    sky = mix(sky, vec3(0.085, 0.088, 0.062), smoothstep(0.12, 0.0, t) * 0.55);

    /* günəş diski — proqress ilə sərvlərin arxasına doğru batır */
    vec2 sunUV = vec2(0.66, hz + 0.02 + el * 0.30);
    float sd = length((uv - sunUV) * vec2(uAspect, 1.0));
    float disc = smoothstep(0.030, 0.024, sd);
    float glow = pow(smoothstep(0.42, 0.0, sd), 1.8);
    sky += sunCol * glow * 0.55 + sunCol * disc * 0.9;

    /* iki sərv — günəş onların arxasında batır */
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

/* ------------------------------------------------------------------ sabitlər */

/**
 * ⚠️ SHADER İLƏ EYNİDİR — `POND_FS`-dəki sabitlər. Pointer-in ekran nöqtəsini
 * dalğa fəzasına salmaq üçün təkrarlanır (shader-dən rəqəm oxumaq olmaz).
 */
const Z_NEAR = 0.55
const Z_FAR = 26
const TANX = 0.384
const HZ0 = 0.6
const HZ_D = 0.055
const CAMX_D = 1.5

/** Halqa yuvaları — şaderdəki `uR[8]` ilə 1:1. */
const RIPPLES = 8
/** Halqanın ömrü (saniyə) — bundan sonra yuva boş sayılır. */
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

      // Kopya fəsli girəndə yumşaq qalxır — sudan əvvəl söz gəlir.
      gsap.from(q('.pond__copy'), {
        opacity: 0,
        y: 26,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.pond__sticky')[0], start: 'top 55%' },
      })

      // Təlimat nəfəs alır — «burada nəsə olar» işarəsi, scroll olmadan da.
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
      // WebGL yoxdursa su yoxdur — amma fəsil **oxunmalıdır**: CSS qradiyenti
      // + mətn qalır, yalnız hərəkətli qat düşür (Berm-dəki sığorta ilə eyni).
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

    /* «Üç dubl» — hər ziyarət üçün tək seçim: dalğa fazaları dəyişir.
       Oktava sayı enə görə (mobil 4, desktop 7) — tier sistemi yoxdur (v6.9). */
    const seed = 1 + Math.floor(Math.random() * 3)
    gl.uniform1f(u.uSeed, seed)
    gl.uniform1f(u.uWaves, isNarrow() ? 4 : 7)

    /* Halqa bufferi: [x, z, birth, amp] × 8. */
    const rip = new Float32Array(RIPPLES * 4)
    const ripOut = new Float32Array(RIPPLES * 4)
    let ripIdx = 0

    const spawnRipple = (cssX: number, cssY: number, amp: number, time: number) => {
      const r = canvas.getBoundingClientRect()
      const uvx = (cssX - r.left) / Math.max(1, r.width)
      const uvy = 1 - (cssY - r.top) / Math.max(1, r.height)
      const hz = HZ0 + HZ_D * smooth
      /* Səmaya toxunsa da su cavab verir — yaxın sahilə düşür. */
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
      // Sayğaca YALNIZ məqsədli toxunma düşür — sürüşmə yox (journey qaydası).
      // Reduced-motion-da kadr donur: halqa görünmür, ona görə sayğa da düşmür.
      if (!prefersReducedMotion) addRings(1)
      hintRef.current?.classList.add('is-done')
    }

    /* Sürüşmə halqası: ekranda kiçik məsafə + vaxt aşımı — izlər «yol» buraxır. */
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

    /* scroll → kamera + günəş */
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })

    // Yalnız görünəndə çək — tam ekran şader arxa fonda FPS yeyir.
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

      /* Külək: fəsil boyu bir şiş — ortada zirvə, kənarlarda sakit. */
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

    /**
     * ⚠️ `tick` ƏVVƏLCƏDƏN `null` — reduced-motion yolunda yaranmır,
     * cleanup ondan əvvəl yazılır (TDZ buqu — Berm/TheOrchard-dakı eyni qayda).
     */
    let tick: ((time: number, delta: number) => void) | null = null

    const cleanup = () => {
      if (tick) gsap.ticker.remove(tick)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      io.disconnect()
      st.kill()
      gl.deleteProgram(prog)
      // `loseContext()` yox — StrictMode dev-də ikiqat mount itirilmiş kontekst
      // alardı (bax: TheOrchard-dakı izah; resurslar deleteProgram ilə azad olur).
    }

    // ---- reduced-motion: bir kadr, sakit su ----
    // Hərəkət silinir, **məkan** qalır: günəş yarı-batmış, dalğalar yumşaq.
    // Kadr dönmür — ona görə toxunma görünən halqa doğmur, sayğaca da düşmür.
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
      /* Avtomatik halqa — su «sağlam» görünür və toxunmağı öyrədir. Sayğaca düşmür. */
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
