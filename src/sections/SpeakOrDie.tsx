


import { useEffect, useRef } from 'react'
import { ambient, eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { SPEAK } from '../lib/site'
import { useCopy } from '../lib/i18n'
import { mountSequence } from '../lib/sequence'

export default function SpeakOrDie() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()
  const sq = copy.speakQ
  const canvasRef = useRef<HTMLCanvasElement>(null)


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


      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })


      tl.fromTo(q('.speak__strike'), { scaleX: 0 }, { scaleX: 1, duration: 0.14 }, 0.06)


      tl.fromTo(q('.speak__underline'), { scaleX: 0 }, { scaleX: 1, duration: 0.18 }, 0.24)




      tl.fromTo(
        q('.speak__admission'),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.18 },
        0.38,
      )


      tl.fromTo(
        q('.speak__answer'),
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.22 },
        0.54,
      )


      tl.fromTo(q('.speak__reflect'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.18 }, 0.76)


      tl.fromTo(
        q('.speak__rim'),
        { opacity: 0.18, scale: 1.05 },
        { opacity: 0.6, scale: 1.25, duration: 1 },
        0,
      )


      tl.fromTo(q('.speak__video'), { opacity: 0.5 }, { opacity: 1, duration: 1 }, 0)










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
            {sq.words.map((w, i) => (
              <span key={i}>
                {i > 0 && ' '}
                {i === sq.speak ? (
                  <span className="speak__word speak__pole speak__pole--speak">
                    {w}
                    <span className="speak__underline" aria-hidden="true" />
                  </span>
                ) : i === sq.die ? (
                  <span className="speak__word speak__pole speak__pole--die">
                    {w}
                    <span className="speak__strike" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="speak__word">{w}</span>
                )}
              </span>
            ))}
            <span className="speak__qmark">{sq.qmark}</span>
          </h2>

          <p className="speak__source">— {SPEAK.source}</p>

          <p className="speak__admission">{copy.speakAdmission}</p>

          <p className="speak__answer">{copy.speakAnswer}</p>
          <p className="speak__reflect">{copy.speakReflection}</p>
        </div>
      </div>
    </section>
  )
}
