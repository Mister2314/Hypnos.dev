/**
 * TopBar — yuxarı zolaq.
 *
 * Solda ad, sağda tək giriş qapısı ("Say hello"). Fəsil relsi (`ChapterNav`) sağdadır,
 * ona görə buranı sadə saxlayırıq — iki naviqasiya döyüşməsin.
 *
 * ⚠️ `mix-blend-mode: difference` → həm tünd, həm **işıq mərmər** fəslində oxunur.
 * Ayrı rəng dəyişənləri idarə etmək lazım deyil — qarışma özü həll edir.
 */
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
