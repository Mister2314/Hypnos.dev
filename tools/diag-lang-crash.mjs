/**
 * diag-lang-crash.mjs — dil dəyişimi çökmə reprosu (CDP, headless).
 *
 * Ssenari: səhifəni yüklə → counterweight bölməsinə keç (video ortası) →
 * AZ klik → əsas thread canlıdır? xətalar? text dəyişdi?
 * İşlədilməsi: node tools/diag-lang-crash.mjs [URL]
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.argv[2] || 'http://localhost:4173/'
const PORT = 9339

const profile = mkdtempSync(join(tmpdir(), 'khayal-langdiag-'))
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
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
const pageErrors = []
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.method === 'Runtime.exceptionThrown') {
    const d = m.params.exceptionDetails
    pageErrors.push(
      `${d.text} ${d.exception?.description ?? ''}`.slice(0, 500),
    )
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

// donma aşkarlaması: evaluate 8s-də qayıtmırsa → əsas thread bloklu
const evalHard = async (expr, ms = 8000) => {
  let timer
  const timeout = new Promise((_, rej) => {
    timer = setTimeout(() => rej(new Error(`MAIN THREAD BLOCKED > ${ms}ms`)), ms)
  })
  const r = await Promise.race([send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }), timeout])
  clearTimeout(timer)
  if (r.exceptionDetails) throw new Error('PAGE EXCEPTION: ' + (r.exceptionDetails.exception?.description ?? r.exceptionDetails.text).slice(0, 400))
  return r.result.value
}

await send('Page.enable')
await send('Runtime.enable')
await send('Page.navigate', { url: URL })
await sleep(7000)

console.log('— bölməyə keç (nav btn Chapter 04) —')
await evalHard(`(() => {
  const btn = [...document.querySelectorAll('.chapter-nav__link')].find(b => /Chapter 04/.test(b.getAttribute('aria-label') || ''));
  if (btn) btn.click();
  return !!btn;
})()`)
await sleep(2500)

console.log('— AZ klik (video bölməsində) —')
const t0 = Date.now()
let langOk = true
try {
  await evalHard(`(() => {
    window.__diagErrs = [];
    window.addEventListener('error', (e) => window.__diagErrs.push('err: ' + e.message + ' | ' + (e.error?.stack || '').slice(0, 300)));
    window.addEventListener('unhandledrejection', (e) => window.__diagErrs.push('rej: ' + String(e.reason).slice(0, 200)));
    const b = [...document.querySelectorAll('.lang-switch__btn')].find(x => x.textContent.trim() === 'AZ');
    b.click();
    return true;
  })()`, 8000)
} catch (e) {
  langOk = false
  console.log('KLIK/evaluate XƏTASI:', String(e.message).slice(0, 200))
}
await sleep(3000)
const t1 = Date.now()

const state = await evalHard(`(() => ({
  worlds: document.querySelectorAll('[data-world]').length,
  active: document.querySelector('.lang-switch__btn--on')?.textContent ?? null,
  quote: document.querySelector('.cw__quote')?.textContent?.trim()?.slice(0, 40) ?? null,
  canvasDrawn: (() => { const c = document.querySelector('.cw__video'); if (!c || !c.width) return 'no-canvas'; try { const d = c.getContext('2d').getImageData(c.width >> 1, c.height >> 1, 8, 8).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i+1] + d[i+2]; return s > 0 ? 'drawn' : 'empty'; } catch { return 'tainted'; } })(),
  errs: window.__diagErrs ?? [],
}))()`, 8000).catch((e) => ({ EVAL_FAIL: String(e.message).slice(0, 120) }))

console.log('SƏHİFƏ XƏTALARI (klik sonrası):', pageErrors.length ? pageErrors.slice(-3) : 'yoxdur')
console.log('NƏTİCƏ:', JSON.stringify({ langOk, clickMs: t1 - t0, ...state }, null, 1))

ws.close()
chrome.kill()
await sleep(300)
try { rmSync(profile, { recursive: true, force: true }) } catch {}
process.exit(0)
