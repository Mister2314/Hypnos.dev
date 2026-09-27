/**
 * 0 — Hero (Overture).
 *
 * Giriş: eyebrow → ad (söz-söz) → alt sətir → əl yazısı imza → scroll işarəsi.
 * Scroll: bütün blok yuxarı sürüşür, kiçilir, yox olur (scrub).
 *
 * ⚠️ İmza **əl yazısı şrifti**dir (Italianno), CMBYN titrını **təqlid etmir** —
 * o titr əl ilə çəkilib (Chen Li, KONSEPT §2.1), fontu yoxdur. Bu, sadəcə *öz* imzamız.
 */
import { useRef } from 'react'
import { SITE } from '../lib/site'
import { ambient, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        // Tək selector sətri — boş selector nəticəsi GSAP-da `undefined` hədəf yaradır
        // (bax `Signature.tsx` izahı).
        gsap.set(q('.hero__eyebrow, .hero__title, .hero__sub, .hero__sign, .hero__cue'), {
          opacity: 1,
        })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(q('.hero__eyebrow'), { y: 20, opacity: 0, duration: 0.7 })
        .from(
          q('.hero__word'),
          { yPercent: 60, opacity: 0, filter: 'blur(10px)', duration: 1.1, stagger: 0.09 },
          '-=0.35',
        )
        .from(q('.hero__sub'), { y: 18, opacity: 0, duration: 0.8 }, '-=0.6')
        .from(q('.hero__sign'), { opacity: 0, y: 14, duration: 0.9 }, '-=0.5')
        .from(q('.hero__cue'), { opacity: 0, duration: 0.6 }, '-=0.35')

      // scroll — ad yuxarı çıxır və kiçilir
      gsap.to(q('.hero__inner'), {
        yPercent: -12,
        scale: 0.94,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      // imza — scroll-la bir az sağa "çəkilir"
      gsap.to(q('.hero__sign'), {
        xPercent: 6,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      // ── BOŞ VƏZİYYƏT HƏRƏKƏTİ ────────────────────────────────────────────
      // Giriş ekranı əvvəl **tam ölü** idi: mətn + bir nazik xətt. Scroll
      // etmirsənsə heç nə tərpənmirdi (`research/07 §3.3`).
      //
      // ⚠️ Niyə `y` + `rotate`, `xPercent` deyil: yuxarıdaki scroll tween
      // `.hero__sign`-a `xPercent` və `opacity` yazır. GSAP eyni hədəfə iki
      // tween-i **fərqli property-lərlə** problemsiz işlədir — ona görə burada
      // **üst-üstə düşməyən** property-lər seçilir. Toqquşma yoxdur.
      //
      // 7s = `--amb-mid`. `07 The Quiet` 11s, `05 Speak` 4.5s → **məsafə açılır.**
      ambient(q('.hero__sign'), { y: -6, rotate: -0.9 }, 7)

      // İşarə oxu — artıq CSS `cue` animasiyası var; bu ona **ikinci oktava**
      // əlavə edir (qeyri-bərabər ritm). `threejsresources.com/guides/grass`:
      // *"Two octaves reads far more convincing than one."*
      ambient(q('.hero__cue-text'), { y: 3, opacity: 0.55 }, 4.5)
    },
    { scope: ref },
  )

  return (
    <section className="section section--hero" data-world="hero" id="hero" ref={ref}>
      <div className="hero__inner">
        <p className="section__eyebrow hero__eyebrow">Portfolio · 2026</p>
        <h1 className="hero__title">
          <span className="hero__word">Hi,</span>{' '}
          <span className="hero__word">I&rsquo;m</span>{' '}
          <span className="hero__word hero__word--name">Khayal.</span>
        </h1>
        <p className="hero__sub">
          I keep more worlds than one head should hold. Scroll — I&rsquo;ll show you a few.
        </p>
      </div>

      <p className="hero__sign" aria-label={`Signed, ${SITE.name}`}>
        {SITE.name}
      </p>

      <div className="hero__cue" aria-hidden="true">
        <span className="hero__cue-line" />
        <span className="hero__cue-text">scroll</span>
      </div>
    </section>
  )
}
