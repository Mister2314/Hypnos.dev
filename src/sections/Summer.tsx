


import { useRef } from 'react'
import Line from '../components/Line'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { useCopy } from '../lib/i18n'

const BASE = import.meta.env.BASE_URL

export default function Summer() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)

      if (prefersReducedMotion) {


        gsap.set(q('.rv, .summer__plate-img, .summer__caption'), { opacity: 1 })
        gsap.set(q('.summer__halftone'), { opacity: 0 })
        return
      }


      gsap.from(q('.section__line .rv'), {
        yPercent: 60,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.9,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.section__line')[0], start: 'top 80%' },
      })

      gsap.from(q('.summer__caption'), {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.summer__caption')[0], start: 'top 88%' },
      })


      gsap.fromTo(
        q('.summer__plate-img'),
        { y: 46, scale: 1.12 },
        {
          y: -46,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      )


      gsap.fromTo(
        q('.summer__halftone'),
        { opacity: 1, scale: 1 },
        {
          opacity: 0,
          scale: 1.18,
          ease: 'none',
          scrollTrigger: {
            trigger: q('.summer__plate')[0],
            start: 'top 92%',
            end: 'top 34%',
            scrub: 0.9,
          },
        },
      )


      gsap.fromTo(
        q('.summer__bloom'),
        { opacity: 0.12, scale: 1.05 },
        {
          opacity: 0.5,
          scale: 1.4,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        },
      )
    },
    { scope: ref },
  )

  return (
    <section className="section section--summer" data-world="summer" id="summer" ref={ref}>
      <div className="summer__bloom" aria-hidden="true" />
      <div className="summer__inner">
        <p className="section__eyebrow">{eyebrow('summer', copy.titles.summer)}</p>
        <Line className="section__line" text={copy.summerLine} />
        <p className="summer__caption">
          <em>{copy.summerCaptionFilm}</em>
          {copy.summerCaptionRest}
        </p>
        <div className="summer__plate">
          <img
            className="summer__plate-img"
            src={`${BASE}scenes/summer-apricots.webp`}
            width={1500}
            height={1000}
            alt="Ripe apricots and a halved peach on a stone table in a sunlit garden."
            loading="lazy"
            decoding="async"
          />
          <span className="summer__halftone" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
