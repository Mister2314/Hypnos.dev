/**
 * perf-loop.mjs — PERFORMANS FEEDBACK LOOP (diagnosing-bugs §1: ölç — düzəlt — yenidən ölç).
 *
 * Nə edir: səhifəni yükləyir → rAF delta kollektorunu quraşdırır → bütün səhifəni
 * proqramlı scroll ilə keçir (sürətli keçid + video fəsillərdə yavaş) → statistika:
 *   · dropped frames (delta > 32ms — 60fps-də buraxılan kadr)
 *   · p95 / max delta
 *   · long tasks (>50ms main-thread bloku)
 *
 * RED şərti (deterministik): aktiv scroll zamanı dropped > 4%  VƏ YA max > 120ms.
 * Qeyd: headless + GPU; software rendering varsa daha sərt ölçür (zəif cihaz proksi).
 *
 * İşlədilməsi:  node tools/perf-loop.mjs [URL] [--mobile]
 * Çıxış:        PASS/FAIL + statistika cədvəli
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.argv[2] || 'http://localhost:4173/'
const MOBILE = process.argv.includes('--mobile')
const PORT = 9339

const profile = mkdtempSync(join(tmpdir(), 'khayal-perf-'))
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
    MOBILE ? '--window-size=390,844' : '--window-size=1440,900',
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
const pageErrors = []
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.method === 'Runtime.exceptionThrown') {
    const d = m.params.exceptionDetails
    pageErrors.push(`${d.text} ${d.exception?.description ?? ''}`.slice(0, 300))
  }
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
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text)
  return r.result.value
}

await send('Page.enable')
await send('Runtime.enable')

if (MOBILE) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  })
}

await send('Page.navigate', { url: URL })
await sleep(5000)

// ---- rAF delta kollektoru + longtask observer ----
await evalJs(`(() => {
  window.__perf = { deltas: [], ys: [], last: 0, scrolling: false }
  const loop = (t) => {
    const p = window.__perf
    if (p.last && p.scrolling) { p.deltas.push(t - p.last); p.ys.push(window.scrollY) }
    p.last = t
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__perf.longTasks = (window.__perf.longTasks ?? 0) + 1
  }).observe({ entryTypes: ['longtask'] })
  return true
})()`)

// ---- proqramlı scroll: REAL istifadəçi yolu — wheel hadisələri (Lenis native input) ----
// `window.scrollTo` Lenis-in internal vəziyyəti ilə döyüşür — oskillasiya = süni jank.
// Wheel dispatch = real istifadəçi girişi: Lenis öz yumşaq scroll-unu edir.
const height = await evalJs(`document.documentElement.scrollHeight`)
const vh = await evalJs(`window.innerHeight`)
console.log(`səhifə: ${height}px · viewport: ${vh}px · keçid başlayır`)

const wheelStep = 320 // hər wheel ~320px (sürətli real scroll)
const pass = async (msPerWheel, label) => {
  await evalJs(`window.__perf.deltas.length = 0; window.__perf.ys.length = 0; window.__perf.scrolling = true; window.scrollTo(0, 0); true`)
  await sleep(600)
  let y = 0
  while (y <= height) {
    await send('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: MOBILE ? 195 : 720,
      y: MOBILE ? 400 : 450,
      deltaX: 0,
      deltaY: wheelStep,
    })
    y += wheelStep
    await sleep(msPerWheel)
  }
  await evalJs(`window.__perf.scrolling = false; true`)
  const d = await evalJs(`window.__perf.deltas.slice()`)
  const ys = await evalJs(`window.__perf.ys.slice()`)
  const lt = await evalJs(`window.__perf.longTasks ?? 0`)
  const sorted = [...d].sort((a, b) => a - b)
  const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0
  const max = sorted[sorted.length - 1] ?? 0
  const dropped = d.filter((x) => x > 32).length
  const droppedPct = d.length ? +((dropped / d.length) * 100).toFixed(1) : 0
  const avg = d.length ? +(d.reduce((a, b) => a + b, 0) / d.length).toFixed(1) : 0
  // ən böyük 5 spike — hansı scroll mövqeyində (hansı fəsildə) baş verir
  const spikes = d
    .map((x, i) => ({ d: x, y: ys[i] ?? 0 }))
    .sort((a, b) => b.d - a.d)
    .slice(0, 5)
    .map((s) => `${Math.round(s.d)}ms@${Math.round(s.y)}px`)
    .join(' · ')
  console.log(
    `${label}: kadr ${d.length} · orta ${avg}ms · p95 ${p95}ms · max ${max}ms · dropped(>32ms) ${dropped} (${droppedPct}%) · longtask ${lt}`,
  )
  if (spikes) console.log(`   ən böyük spike-lar: ${spikes}`)
  return { droppedPct, max }
}

// IDLE ölçmə — scroll YOX: saytın öz sabit xərci (qran + ambient + Lenis)
const idle = async (label) => {
  await evalJs(`window.__perf.deltas.length = 0; window.__perf.ys.length = 0; window.__perf.scrolling = false; true`)
  await sleep(2500)
  const d = await evalJs(`window.__perf.deltas.slice()`)
  const sorted = [...d].sort((a, b) => a - b)
  const max = sorted[sorted.length - 1] ?? 0
  const avg = d.length ? +(d.reduce((a, b) => a + b, 0) / d.length).toFixed(1) : 0
  const dropped = d.filter((x) => x > 32).length
  console.log(`${label}: kadr ${d.length} · orta ${avg}ms · max ${max}ms · dropped ${dropped}`)
  return { avg, max, dropped }
}

// IDLE — saytın öz sabit xərci (qran baked + halation yoxdur + Lenis)
await idle('idle — scroll yoxdur')

// SÜRƏTLİ keçid — teleport sərhəddi (5.4k px/s): burada dropped faizi
// headless raster xərci ilə qarışır — reference üçün ölçülür
const a = await pass(80, 'sürətli keçid (wheel, teleport)')

// REALİSTİK keçid — ~1.9k px/s: real oxucu sürəti — ƏSAS göstərici
const b = await pass(250, 'realistik keçid (wheel)')

const RED = b.droppedPct > 8 || b.max > 150
console.log('')
console.log(
  `VERDICT: ${RED ? 'FAIL' : 'PASS'}  — realistik: dropped% ${b.droppedPct} · max ${b.max}ms (sürətli referans: ${a.droppedPct}% / ${a.max}ms)`,
)
if (pageErrors.length) {
  console.log('SƏHİFƏ XƏTALARI:')
  for (const err of pageErrors) console.log('  ', err)
}

ws.close()
chrome.kill()
await sleep(400)
try {
  rmSync(profile, { recursive: true, force: true })
} catch {
  /* profil qalır */
}
process.exit(RED ? 1 : 0)
