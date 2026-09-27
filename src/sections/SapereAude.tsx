/**
 * 04 — Sapere aude (Merli).
 * Scroll: qızıl xətt soldan sağa İŞIQ KOMETASI ilə çəkilir, sətir söz-söz açılır.
 *
 * ⚠️ v6.6 — Khayalın üç şikayəti düzəldi:
 *
 *   1. **«text effekti men ora gelmeden gelir bitir»** — əvvəl `gsap.from`
 *      + trigger `top 80%` idi: bir dəfə oynayır, sticky səhnədə trigger
 *      fəsildən ƏVVƏL keçirdi və heç vaxt təkrarlanmadı. Həll: BÜTÜN mətn
 *      hərəkətləri **scrub timeline**-dadır — fəsilin scroll progressinə
 *      bağlıdır: yalnız fəsil daxilində mövcuddur, **hər girişdə yenidən**
 *      oynayır, geri sarsan geriyə döyünür (Counterweight qaydası).
 *
 *   2. **«rule svg soldan saga effektle, yeni effektle daha gozel»** —
 *      xətt iki qatdır: **base** soldan sağa çəkilir + ucunda **işıq
 *      kometası** gəzir (26px parlaq segment — dasharray pəncərəsi,
 *      `drop-shadow` ilə). Fortiche-in painted light dili: xətt rəsm
 *      deyil, işıq izidir. Kometа base-dən ÖNDƏ gəzir, sona çatanda
 *      sönmür — yox olur (prilot jabası kimi).
 *
 *   3. **Mobil: video tam ekran deyil idi** — stage `100dvh` + canvas
 *      şaquli overscan (bax: `global.css` → v6.6 mobil qaydası).
 *
 * ⚠️ Player: `lib/sequence.ts` — 111 kadr, iki qat. Scroll: 240svh.
 */
import { useEffect, useRef } from 'react'
import Line from '../components/Line'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { mountSequence } from '../lib/sequence'

export default function SapereAude() {
  const ref = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* ---- kadr ardıcıllığı: yüklə + scroll ilə scrub (bax: lib/sequence.ts) ---- */
  useEffect(
    () =>
      mountSequence({
        canvas: canvasRef.current!,
        trigger: ref.current,
        highDir: 'sapere/frames-1920',
        lowDir: 'sapere/frames-1280',
        poster: 'sapere/poster-1920.webp',
        ease: 0.07,
        /* Süjet sağdadır (tələbə profili) — mobil kəsimi ora baxır (m2c yoxlaması). */
        focusX: 0.7,
      }),
    [],
  )

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)
      const base = q('.sapere__rule-base')[0] as unknown as SVGPathElement | undefined
      const spark = q('.sapere__rule-spark')[0] as unknown as SVGPathElement | undefined

      if (prefersReducedMotion) {
        gsap.set(q('.rv, .sapere__sub, .sapere__caption'), { opacity: 1, y: 0, yPercent: 0 })
        if (base) base.style.strokeDashoffset = '0'
        if (spark) spark.style.opacity = '0'
        return
      }

      // base xətt: JS ilə ölçülür (viewBox uzunluğu sabit — 396.44)
      if (base) {
        const len = base.getTotalLength()
        gsap.set(base, { strokeDasharray: len, strokeDashoffset: len })
      }

      /* ---- scrub: hər girişdə yenidən oynayır, yalnız fəsil daxilində ---- */
      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })

      // video — karadan açılır
      tl.fromTo(q('.sapere__video'), { opacity: 0.45 }, { opacity: 1, duration: 1 }, 0)

      // sitat söz-söz — hər dəfə yenidən
      tl.from(q('.section__line .rv'), {
        yPercent: 60,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.08,
        stagger: 0.012,
      }, 0.04)

      // qızıl xətt — base soldan sağa çəkilir
      if (base) {
        tl.to(base, { strokeDashoffset: 0, duration: 0.22, ease: 'power1.inOut' }, 0.08)
      }

      // işıq kometası — base-dən ÖNDƏ gəzir, sona çatanda yox olur
      if (spark) {
        tl.fromTo(
          spark,
          { strokeDashoffset: 26, opacity: 0.95 },
          { strokeDashoffset: -371, duration: 0.26 },
          0.05,
        )
        tl.to(spark, { opacity: 0, duration: 0.07 }, 0.31)
      }

      tl.from(q('.sapere__sub'), { opacity: 0, y: 24, duration: 0.09 }, 0.3)

      tl.from(q('.sapere__caption'), { opacity: 0, duration: 0.07 }, 0.42)
    },
    { scope: ref },
  )

  return (
    <section className="section section--sapere" data-world="sapere" id="sapere" ref={ref}>
      <div className="sapere__stage">
        <canvas ref={canvasRef} className="sapere__video" aria-hidden="true" />
        <div className="sapere__scrim" aria-hidden="true" />

        <div className="sapere__inner">
          <p className="section__eyebrow">{eyebrow('sapere')}</p>
          <Line
            className="section__line"
            text="A teacher I never met taught me to question everything, including myself."
          />
          <svg
            className="sapere__rule"
            viewBox="0 0 400 12"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* base — qızıl xətt, soldan sağa çəkilir */}
            <path
              className="sapere__rule-base"
              d="M2 8 C 80 2, 160 11, 240 5 S 360 2, 398 7"
            />
            {/* spark — işıq kometası: 26px parlaq pəncərə, yolu gəzir */}
            <path
              className="sapere__rule-spark"
              d="M2 8 C 80 2, 160 11, 240 5 S 360 2, 398 7"
            />
          </svg>
          <p className="sapere__sub">
            <em>Sapere aude.</em> I dared. Now I can&rsquo;t stop asking.
          </p>
          <p className="sapere__caption">Merli · dare to know</p>
        </div>
      </div>
    </section>
  )
}
