// Loader probe — preloader % sayacının zaman seriyası.
// İstifadə: node tools/loader-probe.mjs [url]
// Çıxış: hər 250ms-də sayac dəyəri → sıçrayış var/yoxdur göstərir.
import { spawn } from 'node:child_process'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.argv[2] || 'http://localhost:4173/'
const PORT = 9334

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--window-size=1440,900',
    '--disable-gpu',
    '--no-first-run',
    '--user-data-dir=' + process.env.TEMP + '/loader-probe-profile',
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

const series = []
let gone = false
for (let t = 0; t < 11000 && !gone; t += 250) {
  const v = await evalJs(`(() => {
    const k = performance.getEntriesByType('resource').filter(r => /\\/s_\\d+\\.webp/.test(r.name)).length
    const el = document.querySelector('.preloader')
    if (el) return (el.querySelector('.preloader__pct b')?.textContent ?? '?') + ' · kadrlar:' + k
    return document.querySelector('[data-world="hero"]') ? 'GONE' : 'BOOT'
  })()`)
  if (v === 'GONE') { gone = true; series.push(`${t}ms → pərdə AÇILIB`) }
  else series.push(`${t}ms → ${v === 'BOOT' ? '— (mount)' : v}`)
  await sleep(250)
}

console.log(series.join('\n'))

const nums = series.map(s => (s.match(/(\d+)%/) || [])[1]).filter(Boolean).map(Number)
let maxJump = 0
for (let i = 1; i < nums.length; i++) maxJump = Math.max(maxJump, nums[i] - nums[i - 1])
console.log(`\nən böyük 250ms sıçrayış: +${maxJump}% · addımlar: ${nums.length} · ən son: ${nums.at(-1) ?? '—'}%`)
if (maxJump <= 12) console.log('VERDICT: PASS — progress hamar qalxır')
else console.log('VERDICT: FAIL — sıçrayış var')

chrome.kill()
process.exit(0)
