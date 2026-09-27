/**
 * 07 — Marble (Roma).
 *
 * ⚠️ 26 sentyabr: **101 kadrlı büst ardıcıllığı silindi.** Khayal dedi ki
 * *"heykel videosu çox okey deyil"* — fikir deyil, icra zəif idi. Ona görə
 * «fırlanan büst» tamamilə atıldı və yerinə **Roma kolonnadası** gəldi:
 * bir kadr, amma qat-qat dərinlik + hərəkət.
 *
 * Niyə bu daha yaxşıdır:
 *   * 202 fayl (≈10 MB) → 1 fayl (≈128 KB)
 *   * `Sequence` komponenti, kadr ön-yükləmə, DPR məntiqi — hamısı lazımsız qaldı
 *   * heykəl «3D render» kimi oxunurdu; arxitektura isə **məkan** verir
 *
 * ⚠️ Dərinlik bir kadrdan çıxarılır: fon (yavaş zoom), işıq zolaqları (sürətli),
 * kənar sütunlar (ən sürətli). Parallaks sürət fərqidir — ayrı şəkillər deyil.
 */
import { useRef } from 'react'
import Line from '../components/Line'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'

const BASE = import.meta.env.BASE_URL

export default function Marble() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {
        gsap.set(q('.rv, .marble__caption'), { opacity: 1, y: 0 })
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

      // ən yavaş qat — kolonnada: yüngül zoom-out + şaquli sürüşmə
      tl.fromTo(q('.marble__bg'), { scale: 1.2, yPercent: -3 }, { scale: 1, yPercent: 3 }, 0)

      // orta qat — işıq zolaqları: daha sürətli, istiqamət dəyişir
      tl.fromTo(q('.marble__shafts'), { xPercent: -6, opacity: 0.5 }, { xPercent: 6, opacity: 0.95 }, 0)

      // ən sürətli qat — kənar sütunlar içəri girir → «çərçivə içində çərçivə»
      tl.fromTo(q('.marble__edge--l'), { xPercent: -55 }, { xPercent: 0 }, 0)
      tl.fromTo(q('.marble__edge--r'), { xPercent: 55 }, { xPercent: 0 }, 0)

      // istilik — kadr getdikcə istiləşir (soyuq daş → axşam işığı)
      tl.fromTo(q('.marble__warm'), { opacity: 0 }, { opacity: 0.5 }, 0.1)

      // mətn — ortada açılır, sonda bir az yuxarı sürüşür
      tl.fromTo(
        q('.marble__overlay'),
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.22 },
        0.18,
      )
      tl.to(q('.marble__overlay'), { y: -26, duration: 0.3 }, 0.7)

      gsap.from(q('.section__line .rv'), {
        yPercent: 60,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.9,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.section__line')[0], start: 'top 92%' },
      })

      gsap.from(q('.marble__caption'), {
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: q('.marble__caption')[0], start: 'top 96%' },
      })
    },
    { scope: ref },
  )

  return (
    <section className="section section--marble" data-world="marble" id="marble" ref={ref}>
      <div className="marble__stage">
        <img
          className="marble__bg"
          src={`${BASE}scenes/rome-colonnade.webp`}
          width={1536}
          height={1024}
          alt="A long Roman colonnade in warm afternoon light, sun shafts across the stone floor."
          loading="lazy"
          decoding="async"
        />
        <span className="marble__shafts" aria-hidden="true" />
        <span className="marble__warm" aria-hidden="true" />
        <span className="marble__edge marble__edge--l" aria-hidden="true" />
        <span className="marble__edge marble__edge--r" aria-hidden="true" />

        <div className="marble__overlay">
          <p className="section__eyebrow">{eyebrow('marble')}</p>
          <Line className="section__line" text="Marble remembers everything. So do I." />
          <p className="marble__caption">Rome · what stone keeps</p>
        </div>
      </div>
    </section>
  )
}
