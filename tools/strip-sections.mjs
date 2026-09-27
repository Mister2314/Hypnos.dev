/**
 * strip-sections.mjs — global.css-dən silinən fəsillərin (pond/quiet/marble)
 * CSS qaydalarını təmizləyir. Blok = selektordan öz bağlayan `}`-ə qədər.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const p = 'src/styles/global.css'
let css = readFileSync(p, 'utf8')

const MARKERS = [
  '.section--pond {',
  '.pond__stage {',
  '.pond__canvas {',
  '.pond__copy {',
  '.pond__head {',
  '.pond__sub {',
  '.pond__hint {',
  '.pond__hint.is-done {',
  '.section--quiet {',
  '.quiet__sticky {',
  '.quiet__glow {',
  '.quiet__ripples {',
  '.quiet__ripples span {',
  '.quiet__core {',
  '.quiet__ring {',
  '.quiet__ring-track {',
  '.quiet__ring-fill {',
  '.quiet__dot {',
  '.quiet__hold {',
  '.quiet__copy {',
  '.quiet__head {',
  '.quiet__sub {',
  '.quiet__reward {',
  '.section--marble {',
  '.marble__stage {',
  '.marble__bg {',
  '.marble__shafts {',
  '.marble__warm {',
  '.marble__edge {',
  '.marble__edge--l {',
  '.marble__edge--r {',
  '.marble__overlay {',
  '.marble__caption {',
]

function findRule(css, marker) {
  const start = css.indexOf(marker)
  if (start === -1) return null
  // selektor sətrinin başlanğıcı (sətir başı deyilsə sətir başına çək)
  const lineStart = css.lastIndexOf('\n', start) + 1
  const open = css.indexOf('{', start)
  if (open === -1) return null
  let depth = 1
  let i = open + 1
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++
    if (css[i] === '}') depth--
    i++
  }
  // geri dönərkən sətir başına çək (boşluqları da götür)
  let end = i
  while (end < css.length && (css[end] === '\n' || css[end] === ' ')) end++
  return { start: lineStart, end }
}

let removed = 0
for (const marker of MARKERS) {
  const r = findRule(css, marker)
  if (r) {
    css = css.slice(0, r.start) + css.slice(r.end)
    removed++
  }
}

// artıq boş sətirləri yığ
css = css.replace(/\n{3,}/g, '\n\n')

writeFileSync(p, css)
console.log(`çıxarılan qayda: ${removed}`)
