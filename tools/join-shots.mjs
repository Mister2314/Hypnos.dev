// Join shots — TheJoin sectionının 3 scrub mövqeyinin ekran görüntüləri
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.argv[2] || 'http://localhost:4173/'
const PORT = 9336
const OUT = process.env.TEMP

const chrome = spawn(
  CHROME,
  ['--headless=new', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--disable-gpu', '--no-first-run', '--user-data-dir=' + process.env.TEMP + '/join-shot-profile', 'about:blank'],
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
  throw new Error('CDP yoxdur')
}
const ws = new WebSocket(await getWs())
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let id = 0
const pending = new Map()
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } }
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value

await send('Page.enable')
await send('Page.navigate', { url: URL })
for (let t = 0; t < 14000; t += 300) {
  if (await evalJs(`!document.querySelector('.preloader') && !!document.querySelector('[data-world="hero"]')`)) break
  await sleep(300)
}
await sleep(500)

const POS = { a: 0.12, b: 0.56, c: 0.92 }
for (const [name, frac] of Object.entries(POS)) {
  await evalJs(`(() => { const el = document.querySelector('#join'); const r = el.getBoundingClientRect(); window.scrollTo({top: window.scrollY + r.top + r.height * ${frac} - window.innerHeight * 0.0, behavior:'instant'}); return Math.round(window.scrollY) })()`)
  await sleep(900)
  const shot = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(`${OUT}/join-${name}.png`, Buffer.from(shot.result.data, 'base64'))
  console.log(`${name}: ${OUT}/join-${name}.png`)
}
chrome.kill()
process.exit(0)
