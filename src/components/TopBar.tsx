

import { SITE } from '../lib/site'
import { scrollToId } from '../lib/lenis'
import { LANGS, setLang, useCopy, useLang } from '../lib/i18n'
import Sound from './Sound'

export default function TopBar() {
  const copy = useCopy()
  const lang = useLang()

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__mark"
        onClick={() => scrollToId('hero')}
        aria-label={copy.a11y.backToTop}
      >
        {SITE.name}
      </button>
      <div className="topbar__group">
        <Sound />
        <div className="lang-switch" role="group" aria-label={copy.a11y.language}>
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              className={`lang-switch__btn${l === lang ? ' lang-switch__btn--on' : ''}`}
              onClick={() => setLang(l)}
              aria-pressed={l === lang}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="topbar__cta" onClick={() => scrollToId('contact')}>
          {copy.navHello}
        </button>
      </div>
    </header>
  )
}
