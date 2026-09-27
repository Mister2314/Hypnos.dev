/**
 * diag-v6.mjs — v6 dəyişikliklərinin EKRAN yoxlaması (CDP, headless).
 *
 * Nə çəkir:
 *   desktop 1440×900 — hero · berm (orta) · pond (orta) · pond (halqa ilə) · contact · signature
 *   mobil 390×844    — hero · pond (orta) · contact
 *
 * Qeyd: high qat məcbur edilir (localStorage 'khayal-quality' = high) — headless
 * Chrome sandbox-da CPU siqnalı low verir, amma vizual yoxlama YÜKSƏK qatı görməlidir.
 *
 * İşlədilməsi:  node tools/diag-v6.mjs [URL]
 * Çıxış:        tools/shots-v6/*.png
 */
import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.argv[2] || 'http://localhost:4173/'
const PORT = 9334
const OUT = 'tools/shots-v6'

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const profile = mkdtempSync(join(tmpdir(), 'khayal-diag-'))

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--enable-gpu',
    '--use-gl=angle',
    '--hide-scrollbars',
    '--window-size=1440,900',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function wsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const list = await r.json()
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page.webSocketDebuggerUrl
    } catch {
      /* hələ açılmır */
    }
    await sleep(250)
  }
  throw new Error('CDP səhifə hədəfi tapılmadı')
}

const ws = new WebSocket(await wsUrl())
await new Promise((res, rej) => {
  ws.onopen = res
  ws.onerror = rej
})

let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id)
    pending.delete(m.id)
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)
  }
}
function send(method, params = {}) {
  const n = ++id
  return new Promise((res, rej) => {
    pending.set(n, { res, rej })
    ws.send(JSON.stringify({ id: n, method, params }))
  })
}

async function evalJs(expr) {
  const r = await send('Runtime.evaluate', {
    expression: expr,
    returnByValue: true,
    awaitPromise: true,
  })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + JSON.stringify(r.exceptionDetails))
  return r.result.value
}

async function shot(name) {
  await sleep(1400) // sticky + smooth qiymətlərin oturması
  const r = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(join(OUT, `${name}.png`), Buffer.from(r.data, 'base64'))
  console.log('shot:', name)
}

/** Bölmənin ortasına sürüş — sticky aktiv olsun. */
async function goTo(sel, frac = 0.5) {
  await evalJs(`(() => {
    const el = document.querySelector('${sel}')
    el.scrollIntoView({ behavior: 'instant', block: 'start' })
    window.scrollBy(0, Math.max(1, el.getBoundingClientRect().height * ${frac}))
    return window.scrollY
  })()`)
}

await send('Page.enable')
await send('Runtime.enable')
await send('Page.navigate', { url: URL })
await sleep(5000)

/* ---- desktop 1440×900 ---- */
await shot('d1-hero')
await goTo('#counterweight', 0.3)
await shot('d2-cw-entry')
await goTo('#counterweight', 0.62)
await shot('d2-cw-peak')
await goTo('#speak', 0.35)
await shot('d2b-speak')
await goTo('#sapere', 0.15)
await shot('d2c-spark')
await goTo('#sapere', 0.45)
await shot('d2c-sapere')
await goTo('#pond', 0.45)
await shot('d3-pond')
// halqa: suya məqsədli toxunma → 400 ms sonra çək
await evalJs(`(() => {
  const c = document.querySelector('.pond__canvas')
  const r = c.getBoundingClientRect()
  c.dispatchEvent(new PointerEvent('pointerdown', {
    clientX: r.left + r.width * 0.42, clientY: r.top + r.height * 0.62, bubbles: true,
  }))
  return true
})()`)
await sleep(450)
await shot('d4-pond-ripple')
await goTo('#contact', 0)
await shot('d5-contact')
await goTo('#leap', 0.55)
await shot('d5b-leap')
await goTo('#leap', 0.82)
await shot('d5c-leap-rise')
await goTo('#signature', 0)
await shot('d6-signature')

/* ---- mobil 390×844 ---- */
await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
})
await evalJs(`window.scrollTo(0, 0)`)
await shot('m1-hero')
await goTo('#counterweight', 0.55)
await shot('m2a-cw')
await goTo('#speak', 0.35)
await shot('m2b-speak')
await goTo('#sapere', 0.45)
await shot('m2c-sapere')
await goTo('#pond', 0.45)
await shot('m2-pond')
await goTo('#contact', 0)
await shot('m3-contact')
await goTo('#leap', 0.6)
await shot('m3b-leap')

const overflow = await evalJs(
  `({ sw: document.documentElement.scrollWidth, iw: window.innerWidth })`,
)
console.log('mobile overflow:', overflow.sw, '≤', overflow.iw, overflow.sw <= overflow.iw ? 'OK' : 'FAIL')

ws.close()
chrome.kill()
await sleep(400)
try {
  rmSync(profile, { recursive: true, force: true })
} catch {
  /* profil qalır — vacib deyil */
}
process.exit(0)
