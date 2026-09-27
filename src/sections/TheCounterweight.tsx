/**
 * 03 — The Counterweight.
 *
 * **Konsept:** Arcane S2 finalının astral səhnəsi (Khayalın klipi) — Jayce
 * Viktora yetişir: *"You were never broken."* Bu fəsil saytın **əks
 * tərəzisidir**: 05 «Speak or die» sualı soruşursa, 03 tərəzinin hansı
 * ağırlıqda saxlandığını göstərir — qüsunları **görmək**, amma **silməmək**.
 *
 * **Mətn:** sitat Jayce-dəndir (Arcane S2E9). Son şəxsi sətir Khayalın
 * "amma ki"-nin davamıdır — hazırda CIZMA durur, o öz sözünü qoyacaq
 * (`site.ts` → `COUNTERWEIGHT.personal`, ⚠️ işarəsi oradadır).
 *
 * **Arcane üslubunun sayt tərcüməsi** (Fortiche prinsipləri → web,
 * `QERARLAR.md §29`):
 *   · **painted light** → `.cw__bloom` — işıq qatı scroll ilə nəfəs alır,
 *     alın-çırpma anında (klipin ~70%-i) zirvəyə çatır; `mix-blend: screen`
 *     ilə kadrın ÜSTÜNƏ çəkilir — Fortiche-in render üstü rəng boyaması kimi
 *   · **2D FX üstə gələn kadrlar** → qlobal film qranı (FilmOverlay) artıq var
 *   · **color script** → dünya rəngi: bənövşəyi-qara + lilac accent
 *     (qonşu fəsıllar tünd-qəhvəridir — kontrast qanunu, SYNTHESIS §5)
 *
 * ⚠️ Player: `lib/sequence.ts` — 05/04 ilə eyni. 123 kadr (letterbox kəsilib,
 * 2.35:1), iki qat, poster-ilk, ardıcıl yükləmə.
 *
 * ⚠️ **EFFEKT TARİXÇƏSI — BU FƏSİL FROZEN-DİR:**
 *   · v6.4 (xromatik split + ink-bleed) RƏDD — *"süni"* (`QERARLAR.md §30`)
 *   · v6.5 Variant B (SplitText «held line») RƏDD — *"xoşum gəlmədi"* (§31)
 *   · FİNAL: v6.3-in özü + scroll **360svh** (mətn bitəndə ~2s dayanıb
 *     oxunur; onun sözü: *"biraz qalım, amma cox uzatma da"*). Yeni effekt
 *     təklifi YOXDUR — o istəməyənə qədər bu forma qalır.
 */
import { useEffect, useRef } from 'react'
import Line from '../components/Line'
import { COUNTERWEIGHT } from '../lib/site'
import { ambient, eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { mountSequence } from '../lib/sequence'

export default function TheCounterweight() {
  const ref = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* ---- kadr ardıcıllığı: yüklə + scroll ilə scrub (bax: lib/sequence.ts) ---- */
  useEffect(
    () =>
      mountSequence({
        canvas: canvasRef.current!,
        trigger: ref.current,
        highDir: 'counterweight/frames-1920',
        lowDir: 'counterweight/frames-1280',
        poster: 'counterweight/poster-1920.webp',
        ease: 0.07,
      }),
    [],
  )

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(q('.cw__quote .rv, .cw__source, .cw__personal'), { opacity: 1, y: 0, yPercent: 0 })
        return
      }

      // --- açılış: sitat söz-söz (scrub deyil) — brush-reveal ---
      gsap.from(q('.cw__quote .rv'), {
        yPercent: 65,
        opacity: 0,
        filter: 'blur(9px)',
        duration: 0.95,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.cw__quote')[0], start: 'top 78%' },
      })

      gsap.from(q('.cw__source'), {
        opacity: 0,
        y: 10,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: q('.cw__source')[0], start: 'top 92%' },
      })

      // --- scrub: painted light nəfəs alır, şəxsi sətir gec gəlir ---
      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      })

      // video — karadan açılır
      tl.fromTo(q('.cw__video'), { opacity: 0.4 }, { opacity: 1, duration: 1 }, 0)

      // painted light: sükut → yığılma → ALIN-ÇIRPMA (~0.68) → əks-səda.
      // Zirvə klipin alın-çırpma anına düşür — scroll ilə sinxron.
      tl.fromTo(q('.cw__bloom'), { opacity: 0.1, scale: 0.82 }, { opacity: 0.28, duration: 0.4 }, 0)
      tl.to(q('.cw__bloom'), { opacity: 0.85, scale: 1.16, duration: 0.28 }, 0.4)
      tl.to(q('.cw__bloom'), { opacity: 0.45, scale: 1.0, duration: 0.32 }, 0.68)

      // şəxsi sətir — pıçıltı kimi, zirvədən SONRA (qərar anından sonra gəlir)
      tl.fromTo(
        q('.cw__personal'),
        { opacity: 0, y: 16, filter: 'blur(6px)' },
        { opacity: 0.85, y: 0, filter: 'blur(0px)', duration: 0.18 },
        0.66,
      )

      // ── BOŞ VƏZİYYƏT ── video hər kadr canlıdır (scrub), əlavə JS animasiya
      // lazım deyil — iki hərəkət mənbəyi qarışdırılmır (Berm-dəki qayda).
      ambient(q('.cw__source'), { y: -2 }, 9)
    },
    { scope: ref },
  )

  return (
    <section
      className="section section--counterweight"
      data-world="counterweight"
      id="counterweight"
      ref={ref}
    >
      <div className="cw__stage">
        <canvas ref={canvasRef} className="cw__video" aria-hidden="true" />
        <div className="cw__bloom" aria-hidden="true" />
        <div className="cw__scrim" aria-hidden="true" />

        <div className="cw__inner">
          <p className="section__eyebrow">{eyebrow('counterweight')}</p>

          <Line tag="h2" className="cw__quote" text={COUNTERWEIGHT.quote} />

          <p className="cw__source">— {COUNTERWEIGHT.source}</p>

          <p className="cw__personal">{COUNTERWEIGHT.personal}</p>
        </div>
      </div>
    </section>
  )
}
