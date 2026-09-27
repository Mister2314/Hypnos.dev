// Scrub probe — fəsil İÇİNDƏ YUXARI qayıdarkən videonun kadr-ları irəliləyir?
// İstifadəçi şikayəti: «refresh-dən sonra aşağıdan yuxarı gələndə video düzgün işləmir».
// Metod: fəsilin dibinə en → wheel ilə addım-addım yuxarı → hər addımda canvas
// imzası (8×8 boz cəmi) → fərqli imza sayı = irəliləyən kadr sayı.
import { spawn } from 'node:child_process'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.argv[2] || 'http://localhost:4173/'
const SEL = process.argv[3] || '#hands'
const PORT = 9335

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--window-size=1440,900',
    '--disable-gpu',
    '--no-first-run',
    '--user-data-dir=' + process.env.TEMP + '/scrub-probe-profile',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getWs() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const tabs = await r.json()
      const page = tabs.find((t) => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await sleep(250)
  }
  throw new Error('Chrome CDP tapılmadı')
}

const wsUrl = await getWs()
const ws = new WebSocket(wsUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })

let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
}
const send = (method, params = {}) =>
  new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })

const evalJs = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })
  if (r.result?.exceptionDetails) {
    console.log('EVAL XETA:', JSON.stringify(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text).slice(0, 300))
    return undefined
  }
  return r.result?.result?.value
}

await send('Page.enable')
await send('Page.navigate', { url: URL })

// pərdənin açılmasını gözlə
for (let t = 0; t < 14000; t += 300) {
  const open = await evalJs(`!document.querySelector('.preloader') && !!document.querySelector('[data-world="hero"]')`)
  if (open) break
  await sleep(300)
}
await sleep(600)

// fəsilin dibinə en (instant), dekod üçün gözlə
await evalJs(`(() => { const el = document.querySelector('${SEL}'); el.scrollIntoView({behavior:'instant', block:'end'}); window.scrollBy(0, -80); return true })()`)
await sleep(2200)

const sig = `(() => {
  const c = document.querySelector('${SEL} canvas')
  if (!c) return 'NO_CANVAS'
  const t = document.createElement('canvas'); t.width = 8; t.height = 8
  const x = t.getContext('2d'); x.drawImage(c, 0, 0, 8, 8)
  const d = x.getImageData(0, 0, 8, 8).data
  let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i]
  return s
})()`

let last = null
let distinct = 0
const seen = new Set()
const steps = []
for (let step = 0; step < 10; step++) {
  await evalJs(`(() => { const el = document.querySelector('${SEL}'); const r = el.getBoundingClientRect(); window.scrollBy({top: -Math.min(700, r.height * 0.08), behavior: 'instant'}); return Math.round(window.scrollY) })()`)
  await sleep(320)
  const s = await evalJs(sig)
  if (s === 'NO_CANVAS') { console.log('canvas tapılmadı'); break }
  if (!seen.has(s)) { seen.add(s); distinct++ }
  last = s
  steps.push(s)
}

console.log('imzalar:', steps.join(' · '))
console.log(`fərqli kadr imzası: ${distinct}/10 addım`)
if (distinct >= 5) console.log(`VERDICT: PASS — ${SEL} yuxarı qayıdarkən video irəliləyir`)
else console.log(`VERDICT: FAIL — video yuxarı qayıdarkən donub (fərqli kadr: ${distinct})`)

chrome.kill()
process.exit(0)
