/**
 * 02 — The Hands (Creation of Adam).
 *
 * Konsept: Mikelancelonun «Adəmin Yaradılışı» kompozisiyası — iki əl, barmaqlar
 * təmasa **çatmır**. Fərq budur: burada hərəkət tam bir qövsdür —
 *   **yaxınlaşır → az qalır toxunsun → ayrılır.**
 *
 * ⚠️ TƏK-YAZAN: `transform`-u **yalnız** bir timeline yazır. Əvvəl "giriş" ayrı
 * tween, "ayrılma" ayrı tween olsaydı, ikisi eyni xassəni yazardı — v1-də rəng
 * keçidini öldürən xətanın eynisi. Ona görə hər şey **bir** timeline-dadır və
 * trigger `top bottom`-dan başlayır (bölmə hələ ekrana girərkən).
 *
 * ⚠️ Şəkillər nativ alfa ilə generasiya olunub (`background: transparent`),
 * sonra `tools/make-assets.py` ilə kəsilib. `mix-blend-mode` **yoxdur** —
 * həqiqi şəffaflıq var, ona görə istənilən fonda işləyir.
 */
import { useRef } from 'react'
import Line from '../components/Line'
import { HANDS } from '../lib/site'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'

const BASE = import.meta.env.BASE_URL

export default function TheHands() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      const reach = q('.hands__hand--reach')
      const open = q('.hands__hand--open')

      // reduced-motion → statik «az qalıb» kadrı: əllər görüş nöqtəsində donur.
      // Tək selector sətri (boş selector → massivdə `undefined` → hər tick `TypeError`).
      if (prefersReducedMotion) {
        gsap.set(q('.rv, .hands__caption'), { opacity: 1 })
        gsap.set(reach, { xPercent: -2, rotate: -0.5 })
        gsap.set(open, { xPercent: 2, rotate: 0.5 })
        return
      }

      // ⚠️ `xPercent` — elementin ÖZ eninə nisbətən. Element `50vw`-dir, ona görə
      // -2% ≈ -1vw. Bu, responsivdir: kiçik ekranda da məsafə eyni nisbətdə qalır.
      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      })

      // 1) YAXINLAŞMA — kadr hələ ekrana girərkən əllər bir-birinə gəlir
      tl.fromTo(reach, { xPercent: -26, rotate: -3 }, { xPercent: -2, rotate: -0.5, duration: 0.28 }, 0)
      tl.fromTo(open, { xPercent: 26, rotate: 3 }, { xPercent: 2, rotate: 0.5, duration: 0.28 }, 0)
      tl.fromTo(reach, { y: -18 }, { y: 0, duration: 0.28 }, 0)
      tl.fromTo(open, { y: 18 }, { y: 0, duration: 0.28 }, 0)

      // 2) TƏMAS ANI — qığılcım yanır, sonra sönür. «Yaradılış» elə bu boşluqdadır.
      tl.fromTo(
        q('.hands__spark'),
        { opacity: 0, scale: 0.35 },
        { opacity: 1, scale: 1, duration: 0.1 },
        0.2,
      )
      tl.to(q('.hands__spark'), { opacity: 0, scale: 2.4, duration: 0.16 }, 0.34)
      tl.to(q('.hands__hairline'), { opacity: 1, duration: 0.08 }, 0.26)
      tl.to(q('.hands__hairline'), { opacity: 0, duration: 0.1 }, 0.4)

      // 3) AYRILMA — boşluq böyüyür. Diagonalla: biri yuxarı, biri aşağı.
      tl.to(reach, { xPercent: -34, y: -5, rotate: -6, duration: 0.5 }, 0.38)
      tl.to(open, { xPercent: 34, y: 5, rotate: 6, duration: 0.5 }, 0.38)
      // ⚠️ Səhnənin `scale`-i BURADA YOXDUR — CSS `--hands-zoom` onu idarə edir.
      // İkisi də yazsaydı, GSAP CSS-i əzərdi (tək-yazan qaydası).

      // mətn — ayrılma başlayandan sonra açılır
      tl.fromTo(q('.hands__caption'), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.2 }, 0.5)

      // sətir söz-söz — scrub deyil, öz trigger-i ilə
      gsap.from(q('.hands__line .rv'), {
        yPercent: 70,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1,
        stagger: 0.055,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.hands__line')[0], start: 'top 72%' },
      })
    },
    { scope: ref },
  )

  return (
    <section className="section section--hands" data-world="hands" id="hands" ref={ref}>
      <div className="hands__stage">
        {/* ⚠️ Zoom AYRI qatdadır, səhnədə deyil. Səbəb ölçmə ilə tapıldı:
            `.hands__stage`-ə `transform: scale(1.6)` versək, elementin öz
            boyanmış qutusu 1.6× böyüyür → mobil ölçüdə `scrollWidth` 151px
            artıq çıxırdı (`504 × 0.3`). `overflow: hidden` bunu tutmur, çünki
            kəsmə elementin LOKAL fəzasında olur, transform isə sonra tətbiq olunur.
            İndi zoom daxili qatdadır: səhnə kəsir, qat böyüyür. */}
        <div className="hands__zoom">
          <div className="hands__layer hands__layer--reach">
            <img
              className="hands__hand hands__hand--reach"
              src={`${BASE}hands/hand-reach.webp`}
              width={1200}
              height={800}
              alt="A marble hand reaching in from the left, index finger extended."
              decoding="async"
            />
          </div>

          <div className="hands__layer hands__layer--open">
            <img
              className="hands__hand hands__hand--open"
              src={`${BASE}hands/hand-open.webp`}
              width={1200}
              height={742}
              alt="A marble hand reaching in from the right, index finger relaxed."
              decoding="async"
            />
          </div>

          {/* Təmas nöqtəsi — iki barmağın arasındaki boşluq */}
          <span className="hands__spark" aria-hidden="true" />
          <span className="hands__hairline" aria-hidden="true" />
        </div>

        <div className="hands__inner">
          <p className="section__eyebrow">{eyebrow('hands')}</p>
          <Line className="section__line hands__line" text={HANDS.line} />
          <p className="hands__caption">{HANDS.caption}</p>
        </div>
      </div>
    </section>
  )
}
