/**
 * 05 — Speak or die.
 *
 * CMBYN-in mərkəzi sualı: *"Is it better to speak or to die?"* — və cavabı.
 *
 * Cihaz: seçim **görünən** edilir. Scroll etdikcə «die» sözünün üstündən xətt
 * çəkilir, «speak» altından qızıl xətt açılır. Yəni sayt sadəcə sitat gətirmir —
 * seçimi **icra edir**. Sonra cavab böyük ölçüdə açılır.
 *
 * ⚠️ v6 — ARXA PLAN: qatar səhnəsi (Khayalın öz kəsdiyi klip) **frame
 * ardıcıllığı** kimi (§5.1 qərarı: video yox, WebP kadr). Scroll scrub edir —
 * qatar fəsil boyu keçir, cavab gələndə ekrandan çıxır. Player indi
 * `lib/sequence.ts`-dədir (04 SapereAude ikinci istifadəçidir).
 *
 * ⚠️ Yükləmə: poster dərhal, kadr-lar ardıcıllıqla (pəncərə = 8). Scrub
 * **ardıcıl yüklənmiş** son kadra qədər gedir — yarı-yüklü video atlamır.
 *
 * ⚠️ Xətlər `::after` DEYİL, ayrı `<span>`-dır: GSAP yalnız real elementi
 * hədəfləyə bilər. Pseudo-elementi tween etmək mümkün deyil.
 *
 * ⚠️ Işıq soldan gəlir (`--speak-rim`) — filmin struktur cihazı: işıq həmişə
 * pəncərədən, yandan düşür (KONSEPT §2.3). Video üstündə kölgə (`.speak__scrim`)
 * mətni oxunaqlı saxlayır — sol tərəf ağır, sağ yüngül (qatar sağdan keçir).
 */
import { useEffect, useRef } from 'react'
import { SPEAK } from '../lib/site'
import { ambient, eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { mountSequence } from '../lib/sequence'

export default function SpeakOrDie() {
  const ref = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* ---- kadr ardıcıllığı: yüklə + scroll ilə scrub (bax: lib/sequence.ts) ---- */
  useEffect(
    () =>
      mountSequence({
        canvas: canvasRef.current!,
        trigger: ref.current,
        highDir: 'speak/frames-1280',
        lowDir: 'speak/frames-854',
        poster: 'speak/poster-1280.webp',
        ease: 0.08,
      }),
    [],
  )

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(
          q(
            '.speak__word, .speak__source, .speak__admission, .speak__answer, .speak__reflect, .speak__strike, .speak__underline',
          ),
          { opacity: 1, scaleX: 1 },
        )
        return
      }

      // --- açılış: sual söz-söz (scrub deyil) ---
      gsap.from(q('.speak__word'), {
        yPercent: 70,
        opacity: 0,
        filter: 'blur(12px)',
        duration: 1,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.speak__question')[0], start: 'top 74%' },
      })

      gsap.from(q('.speak__source'), {
        opacity: 0,
        y: 10,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: q('.speak__source')[0], start: 'top 92%' },
      })

      // --- scrub: seçim icra olunur ---
      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })

      // «die» üstündən xətt çəkilir — soldan sağa
      tl.fromTo(q('.speak__strike'), { scaleX: 0 }, { scaleX: 1, duration: 0.14 }, 0.06)

      // «speak» altından qızıl xətt açılır — bir az gecikmə ilə (qərar ani deyil)
      tl.fromTo(q('.speak__underline'), { scaleX: 0 }, { scaleX: 1, duration: 0.18 }, 0.24)

      // Elio-nun qorxusu — sual eşidiləndən sonra, cavabdan ƏVVƏL.
      // Niyə bu sətir var: `03 The Berm` əvvəl eyni sualı deyirdi (təkrar).
      // İndi `05` sualı **tam** verir: sual → qorxu → cavab. Bax `research/08 §3`.
      tl.fromTo(
        q('.speak__admission'),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.18 },
        0.38,
      )

      // cavab — böyüyüb gəlir
      tl.fromTo(
        q('.speak__answer'),
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.22 },
        0.54,
      )

      // şəxsi qat — ən sonda, ən sakit
      tl.fromTo(q('.speak__reflect'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.18 }, 0.76)

      // işıq — yavaş-yavaş güclənir (otaq işıqlanır)
      tl.fromTo(
        q('.speak__rim'),
        { opacity: 0.18, scale: 1.05 },
        { opacity: 0.6, scale: 1.25, duration: 1 },
        0,
      )

      // video — karadan başlayır, qərar verdikcə açılır
      tl.fromTo(q('.speak__video'), { opacity: 0.5 }, { opacity: 1, duration: 1 }, 0)

      // ── BOŞ VƏZİYYƏT HƏRƏKƏTİ ────────────────────────────────────────────
      // ⚠️ Bu, saytın **zirvə** fəsılıdır (`research/07 §1`) — ona görə burada
      // ən SÜRƏTLİ ambient işləyir (4.5s). `07 The Quiet` 11s, `Hero` 7s.
      // Məqsəd hərəkətin özü deyil — **kontrastdır.** `research/07 §4`.
      //
      // Sual işarəsi "döyünür": sual cavabsız qalır, ona görə sakitləşmir.
      // ⚠️ `scale` + `opacity`, `y` deyil — scrub timeline bu elementə heç nə
      // yazmır, amma `y` işlədilsəydi `.speak__word` stagger-ı ilə vizual
      // toqquşardı. Fərqli ox seçilir.
      ambient(q('.speak__qmark'), { scale: 1.14, opacity: 0.9 }, 4.5)
    },
    { scope: ref },
  )

  return (
    <section className="section section--speak" data-world="speak" id="speak" ref={ref}>
      <div className="speak__stage">
        <canvas ref={canvasRef} className="speak__video" aria-hidden="true" />
        <div className="speak__scrim" aria-hidden="true" />
        <div className="speak__rim" aria-hidden="true" />

        <div className="speak__inner">
          <p className="section__eyebrow">{eyebrow('speak')}</p>

          <h2 className="speak__question">
            <span className="speak__word">Is</span>{' '}
            <span className="speak__word">it</span>{' '}
            <span className="speak__word">better</span>{' '}
            <span className="speak__word">to</span>{' '}
            <span className="speak__word speak__pole speak__pole--speak">
              speak
              <span className="speak__underline" aria-hidden="true" />
            </span>{' '}
            <span className="speak__word">or</span>{' '}
            <span className="speak__word">to</span>{' '}
            <span className="speak__word speak__pole speak__pole--die">
              die
              <span className="speak__strike" aria-hidden="true" />
            </span>
            <span className="speak__qmark">?</span>
          </h2>

          <p className="speak__source">— {SPEAK.source}</p>

          <p className="speak__admission">{SPEAK.admission}</p>

          <p className="speak__answer">{SPEAK.answer}</p>
          <p className="speak__reflect">{SPEAK.reflection}</p>
        </div>
      </div>
    </section>
  )
}
