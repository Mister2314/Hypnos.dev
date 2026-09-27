


import { SITE } from '../lib/site'
import { scrollToId } from '../lib/lenis'

export default function TopBar() {
  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__mark"
        onClick={() => scrollToId('hero')}
        aria-label="Back to top"
      >
        {SITE.name}
      </button>
      <button type="button" className="topbar__cta" onClick={() => scrollToId('contact')}>
        Say hello
      </button>
    </header>
  )
}
