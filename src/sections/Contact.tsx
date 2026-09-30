


import { useRef, useState } from 'react'
import Line from '../components/Line'
import { links } from '../lib/site'
import { eyebrow, gsap, prefersReducedMotion, useGSAP } from '../lib/scroll'
import { useCopy } from '../lib/i18n'

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCopy()
  const [sent, setSent] = useState<'' | 'ok' | 'sending' | 'error' | 'invalid'>('')
  const socials = links()

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)
      if (prefersReducedMotion) {
        gsap.set(q('.rv, .glass'), { opacity: 1 })
        return
      }
      gsap.from(q('.section__line .rv'), {
        yPercent: 60,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.9,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.section__line')[0], start: 'top 84%' },
      })
      gsap.from(q('.glass'), {
        y: 40,
        opacity: 0,
        scale: 0.98,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.glass')[0], start: 'top 88%' },
      })
    },
    { scope: ref, dependencies: [copy] },
  )

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const from = String(fd.get('email') ?? '').trim()
    const msg = String(fd.get('message') ?? '').trim()

    if (!name || !from || !msg) {
      setSent('invalid')
      return
    }
    // v19: FormSubmit AJAX — tamamilə pulsuz, səhifədən kənar heç nə açılmır:
    // mesaj birbaşa poçta düşür (ilk göndərişdə aktivasiya məktubu gəlir)
    setSent('sending')
    try {
      const r = await fetch('https://formsubmit.co/ajax/xeyalhuseynli06@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email: from,
          message: msg,
          _subject: `Hello from ${name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const data = (await r.json()) as { success?: string }
      setSent(data.success === 'true' ? 'ok' : 'error')
    } catch {
      setSent('error')
    }
  }

  return (
    <section className="section section--contact" data-world="contact" id="contact" ref={ref}>
      <p className="section__eyebrow">{eyebrow('contact', copy.titles.contact)}</p>
      <Line className="section__line" text={copy.contactLine} />

      <div className="glass">
        <div className="glass__sheen" aria-hidden="true" />
        <form className="glass__form" onSubmit={submit} noValidate>
          <label className="glass__field">
            <span>{copy.nameLabel}</span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label className="glass__field">
            <span>{copy.emailLabel}</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="glass__field glass__field--wide">
            <span>{copy.messageLabel}</span>
            <textarea name="message" rows={4} required />
          </label>
          <button className="glass__submit" type="submit">
            <span>{copy.send}</span>
          </button>
        </form>

        <p className="glass__status" data-state={sent} role="status">
          {sent === 'invalid' && copy.statusInvalid}
          {sent === 'sending' && copy.statusSending}
          {sent === 'error' && copy.statusError}
          {sent === 'ok' && copy.statusOk}
        </p>

        <aside className="glass__side">
          <p className="glass__side-label">{copy.sideLabel}</p>
          <ul className="glass__direct">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
