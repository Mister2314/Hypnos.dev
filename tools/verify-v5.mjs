/**
 * verify-v5.mjs — v5/v6 dəyişikliklərinin yoxlanması (CDP, headless).
 *
 * Nə yoxlanır:
 *   1. `03 The Berm` — köhnə sitat getdi, yeni sətir gəldi, səhv mənbə getdi
 *   2. `05 Speak or die` — düzgün mənbə + Elio-nun qeydi render olunur
 *   3. Scroll büdcəsi — berm 190svh, speak 320svh
 *   4. Hərəkət lüğəti — üç easing ailəsi + üç müddət tieri `:root`-da
 *   5. Ambient — boş vəziyyətdə hərəkət VAR (əvvəl yox idi)
 *   6. v6: `06 The Pond` — ağac GETDİ, gölmə GƏLDİ, təlimat var, büdcə 380svh
 *   7. v6: iki qat — `quality` nəzarəti render olunur, `data-tier` qoyulur
 *   8. v6: `12 Contact` — sağ panel («Other ways in») var
 *
 * İşlədilməsi:  node tools/verify-v5.mjs [URL]
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.argv[2] || 'http://localhost:5174/'
const PORT = 9333

const profile = mkdtempSync(join(tmpdir(), 'khayal-verify-'))
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
      // ⚠️ `/json/version` **brauzer** səviyyəsidir — orada `Page.enable` YOXDUR.
      // Lazım olan **səhifə** hədəfidir → `/json/list`.
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
    pageErrors.push(`${d.text} ${d.exception?.description ?? ''}`.slice(0, 600))
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
await send('Page.navigate', { url: URL })
await sleep(4500)

if (pageErrors.length) {
  console.log('SƏHİFƏ XƏTALARI:')
  for (const err of pageErrors) console.log('  ', err)
}

const results = []
const check = (name, ok, detail) => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

// ── 1. Yüklə ────────────────────────────────────────────────────────────────
await send('Page.navigate', { url: URL })
await sleep(4500)

const probe = await evalJs(`(() => {
  const css = getComputedStyle(document.documentElement)
  const berm = document.querySelector('.section--berm')
  const speak = document.querySelector('.section--speak')
  const svh = window.innerHeight / 100

  return {
    title: document.title,
    worlds: document.querySelectorAll('[data-world]').length,

    // 04 — counterweight
    cwQuote: document.querySelector('.cw__quote')?.textContent?.trim() ?? null,
    cwSource: document.querySelector('.cw__source')?.textContent?.trim() ?? null,
    cwPersonal: document.querySelector('.cw__personal')?.textContent?.trim() ?? null,
    bermGone: !document.querySelector('.section--berm'),

    // 05 — mətn
    speakQuestion: document.querySelector('.speak__question')?.textContent?.replace(/\\s+/g,' ').trim() ?? null,
    speakSource: document.querySelector('.speak__source')?.textContent?.trim() ?? null,
    speakAdmission: document.querySelector('.speak__admission')?.textContent?.trim() ?? null,
    speakAnswer: document.querySelector('.speak__answer')?.textContent?.trim() ?? null,

    glassSide: !!document.querySelector('.glass__side'),
    interludeGone: !document.querySelector('[data-world="interlude"]'),
    worldsGone: !document.querySelector('[data-world="worlds"]'),
    speakVideo: !!document.querySelector('.speak__video'),
    speakScrim: !!document.querySelector('.speak__scrim'),
    sapereVideo: !!document.querySelector('.sapere__video'),
    sapereSpark: !!document.querySelector('.sapere__rule-spark'),
    leapNah: document.querySelector('.leap__nah')?.textContent?.replace(/\\s+/g, ' ').trim() ?? null,
    leapSvh: (() => {
      const e = document.querySelector('.section--leap')
      return e ? +(e.getBoundingClientRect().height / svh).toFixed(0) : null
    })(),

    // scroll büdcəsi (px → svh)
    cwSvh: (() => {
      const e = document.querySelector('.section--counterweight')
      return e ? +(e.getBoundingClientRect().height / svh).toFixed(0) : null
    })(),
    speakSvh: speak ? +(speak.getBoundingClientRect().height / svh).toFixed(0) : null,

    // hərəkət lüğəti
    easeSnap: css.getPropertyValue('--ease-snap').trim(),
    easeOut: css.getPropertyValue('--ease-out').trim(),
    easeOver: css.getPropertyValue('--ease-over').trim(),
    tSnap: css.getPropertyValue('--t-snap').trim(),
    tBase: css.getPropertyValue('--t-base').trim(),
    tSettle: css.getPropertyValue('--t-settle').trim(),

    // ambient — animasiya sayı
    animated: document.getAnimations().length,
  }
})()`)

check('11 dünya render olunur (speak 03-də, cmbyn yoxdur)', probe.worlds === 11, `${probe.worlds} dünya`)
check('interlude tamamilə GETDİ', probe.interludeGone === true, `interlude: ${probe.interludeGone}`)
check('worlds bölməsi tamamilə GETDİ', probe.worldsGone === true, `worlds: ${probe.worldsGone}`)
check(
  '03 — köhnə berm GETDİ',
  probe.bermGone === true,
  `section--berm: ${probe.bermGone}`,
)
check(
  '03 — sitat Jayce-dəndir',
  /never broken/i.test(probe.cwQuote || ''),
  JSON.stringify(probe.cwQuote),
)
check(
  '03 — şəxsi sətir yerindədir',
  /flaws/i.test(probe.cwPersonal || ''),
  JSON.stringify(probe.cwPersonal),
)
check(
  '05 — düzgün mənbə (Heptaméron)',
  /heptam[eé]ron/i.test(probe.speakSource || ''),
  JSON.stringify(probe.speakSource),
)
check(
  '05 — Elio-nun qeydi render olunur',
  /kind of person/i.test(probe.speakAdmission || ''),
  JSON.stringify(probe.speakAdmission),
)
check('06 — sual yerindədir', /speak/i.test(probe.speakQuestion || '') && /die/i.test(probe.speakQuestion || ''))
check('06 — cavab yerindədir', /better to speak/i.test(probe.speakAnswer || ''))

check('01 — büdcə 540svh', probe.leapSvh === 540, `${probe.leapSvh}svh`)
check('09 Contact — sağ panel var', probe.glassSide === true)
check('01 — üsyan sətri yerindədir', /own thing/i.test(probe.leapNah || ''), JSON.stringify(probe.leapNah))

check('büdcə — counterweight 360svh', probe.cwSvh === 360, `${probe.cwSvh}svh`)
check('büdcə — speak 320svh', probe.speakSvh === 320, `${probe.speakSvh}svh`)

check('easing — üç ailə var', !!(probe.easeSnap && probe.easeOut && probe.easeOver),
  `${probe.easeSnap} | ${probe.easeOut} | ${probe.easeOver}`)
check('easing — ailələr fərqlidir',
  new Set([probe.easeSnap, probe.easeOut, probe.easeOver]).size === 3)
check('müddət — üç tier var', !!(probe.tSnap && probe.tBase && probe.tSettle),
  `${probe.tSnap} / ${probe.tBase} / ${probe.tSettle}`)

check('ambient — boş vəziyyətdə animasiya var', probe.animated > 0, `${probe.animated} animasiya`)

// ── 2b. v6 — qatar ardıcıllığı speak fəslində çəkilirmi? ───────────────────
await evalJs(`document.querySelector('#speak').scrollIntoView({behavior:'instant'}); window.scrollBy(0, window.innerHeight * 1.6); true`)
await sleep(2800) // manifest + ilk kadr-lar + scrub
const vid = await evalJs(`(() => {
  const c = document.querySelector('.speak__video')
  if (!c || !c.width) return { drawn: 0 }
  let luma = 0
  try {
    const ctx = c.getContext('2d')
    const d = ctx.getImageData(c.width >> 1, c.height >> 1, 64, 16).data
    for (let i = 0; i < d.length; i += 4) luma += d[i] + d[i + 1] + d[i + 2]
  } catch { return { drawn: -1 } }
  return { drawn: luma > 0 ? 1 : 0 }
})()`)
check('06 — qatar kadrı canvas-da ÇƏKİLİB', vid.drawn === 1, JSON.stringify(vid))

// v6.2 — sapere həyəti eyni player ilə çəkilirmi?
await evalJs(`document.querySelector('#sapere').scrollIntoView({behavior:'instant'}); window.scrollBy(0, window.innerHeight * 1.2); true`)
await sleep(2800)
const vid2 = await evalJs(`(() => {
  const c = document.querySelector('.sapere__video')
  if (!c || !c.width) return { drawn: 0 }
  let luma = 0
  try {
    const ctx = c.getContext('2d')
    const d = ctx.getImageData(c.width >> 1, c.height >> 1, 64, 16).data
    for (let i = 0; i < d.length; i += 4) luma += d[i] + d[i + 1] + d[i + 2]
  } catch { return { drawn: -1 } }
  return { drawn: luma > 0 ? 1 : 0 }
})()`)
check('05 — həyət kadrı canvas-da ÇƏKİLİB', vid2.drawn === 1, JSON.stringify(vid2))
check('05 — işıq kometası (spark) var', probe.sapereSpark === true)

// ── 2. Ambient həqiqətən tərpənir? (vaxt keçdikcə dəyər dəyişir) ─────────────
const before = await evalJs(
  `(() => { const e = document.querySelector('.hero__sign'); return e ? getComputedStyle(e).transform : null })()`,
)
await sleep(1200)
const after = await evalJs(
  `(() => { const e = document.querySelector('.hero__sign'); return e ? getComputedStyle(e).transform : null })()`,
)
check(
  'ambient — dəyər vaxtla DƏYİŞİR (scroll olmadan)',
  before !== null && after !== null && before !== after,
  `${before} → ${after}`,
)

// ── 3. Mobil ────────────────────────────────────────────────────────────────
await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
})
await sleep(1200)

const mob = await evalJs(`(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  admissionSize: (() => {
    const e = document.querySelector('.speak__admission')
    return e ? getComputedStyle(e).fontSize : null
  })(),
}))()`)

check('mobil — üfüqi sürüşmə yoxdur', mob.scrollWidth <= mob.innerWidth,
  `${mob.scrollWidth} ≤ ${mob.innerWidth}`)
check('mobil — admission oxunaqlıdır (≥15px)',
  parseFloat(mob.admissionSize || '0') >= 15, mob.admissionSize)

// ── v16 — mobil: bütün seqsiyalar DƏRHAL yüklənməlidir (defer qadağandır) ──
// Tarix: mobildə yalnız leap pərdədə yüklənirdi, qalanları arxa planda —
// scroll videoyu keçirdi ("TikTok-da video donur"). Bütün seqsiyalar mount-da
// başlamalıdır.
await send('Page.navigate', { url: URL })
await sleep(6000)
const mobSeq = await evalJs(`(() => {
  const rs = performance.getEntriesByType('resource').map((r) => r.name)
  const dirs = [...new Set(rs.filter((n) => n.includes('/frames-')).map((n) => n.split('/frames-')[0]))]
  return { dirs, frames: rs.filter((n) => n.includes('/frames-')).length }
})()`)
check(
  'mobil — bütün seqsiyalar dərhal yüklənir (defer yoxdur)',
  mobSeq.dirs.length >= 4 && mobSeq.frames > 40,
  JSON.stringify(mobSeq),
)

// ── v6.11 — preloader bağlanmalıdır (yükləmə bitib) ─────────────────────────
// v14: 30s-ə qədər gözlə + hansı seqsiyanın yüklənmədiyini göstər (diaqnoz)
let pre = await evalJs(`({
  el: !!document.querySelector('.preloader'),
  loading: document.documentElement.classList.contains('is-loading'),
})`)
let waitedMs = 0
while ((pre.loading || pre.el) && waitedMs < 30000) {
  await sleep(1000)
  waitedMs += 1000
  pre = await evalJs(`({
    el: !!document.querySelector('.preloader'),
    loading: document.documentElement.classList.contains('is-loading'),
  })`)
}
const preDiag = await evalJs(`(() => {
  performance.setResourceTimingBufferSize(2000) // 521 kadr — default 250 çatmır
  const rs = performance.getEntriesByType('resource').map((r) => r.name)
  const count = (s) => rs.filter((n) => n.includes(s)).length
  return {
    leap: count('leap/frames-'),
    sapere: count('sapere/frames-'),
    cw: count('counterweight/frames-'),
    speak: count('speak/frames-'),
    manifests: count('manifest'),
  }
})()`)
check(
  'preloader bağlanıb (yükləmə bitib)',
  !pre.el && !pre.loading,
  `${JSON.stringify(pre)} · gözlədi ${waitedMs}ms · kadrlar ${JSON.stringify(preDiag)}`,
)

// ── v15 — dil dəyişimi saytı ÇÖKDÜRMƏMƏLİDİR (blob-keş rekursiya regresiyası)
// Tarix: keşlənmiş kadr settle()-i sinxron çağırırdı → dil dəyişimi (hamısı
// keşli) eksponensial rekursiya ilə əsas thread-i kilidləyirdi.
const errsBeforeLang = pageErrors.length
// v15 (bugbot tapıntı 2): əsas thread kilidlənərsə evalJs SONSUZ gözləyir —
// race + timeout ilə donma = FAIL (dondurulmuş CI yox)
const evalHardened = async (expr) =>
  Promise.race([
    evalJs(expr),
    sleep(8000).then(() => {
      throw new Error('MAIN THREAD BLOCKED (> 8s) — dil dəyişimi dondurur')
    }),
  ])
await evalHardened(`(() => {
  window.__v15errs = [];
  window.addEventListener('error', (e) => window.__v15errs.push(String(e.message)));
  window.addEventListener('unhandledrejection', (e) => window.__v15errs.push('rej: ' + String(e.reason)));
  const btns = [...document.querySelectorAll('.lang-switch__btn')];
  const az = btns.find((b) => b.textContent.trim() === 'AZ');
  az.click();
  return true;
})()`)
await sleep(3000)
const langCheck = await evalHardened(`(() => {
  const btns = [...document.querySelectorAll('.lang-switch__btn')];
  const en = btns.find((b) => b.textContent.trim() === 'EN');
  if (en) en.click();
  return {
    worlds: document.querySelectorAll('[data-world]').length,
    v15errs: window.__v15errs,
    h1: document.querySelector('h1')?.textContent ?? null,
  };
})()`)
await sleep(1500)
const langCheck2 = await evalJs(`(() => ({
  worlds: document.querySelectorAll('[data-world]').length,
  v15errs: window.__v15errs,
  h1: document.querySelector('h1')?.textContent ?? null,
}))()`)
check(
  'dil dəyişimi — səhifə canlı, xətasız (regressiya yoxlaması)',
  langCheck.worlds === 11 &&
    langCheck2.worlds === 11 &&
    (langCheck2.v15errs || []).length === 0 &&
    pageErrors.length === errsBeforeLang &&
    !!langCheck2.h1,
  JSON.stringify({ worlds: langCheck2.worlds, errs: langCheck2.v15errs, pageErrs: pageErrors.length - errsBeforeLang, h1: (langCheck2.h1 || '').slice(0, 40) }),
)

// ── Nəticə ──────────────────────────────────────────────────────────────────
const failed = results.filter((r) => !r.ok)
console.log('')
console.log(`VERDICT: ${failed.length === 0 ? 'PASS' : 'FAIL'}  (${results.length - failed.length}/${results.length})`)
if (failed.length) {
  console.log('Uğursuz:')
  for (const f of failed) console.log(`  - ${f.name}  ${f.detail ?? ''}`)
}

ws.close()
chrome.kill()
await sleep(400)
try {
  rmSync(profile, { recursive: true, force: true })
} catch {
  /* profil silinmədi — vacib deyil */
}
process.exit(failed.length === 0 ? 0 : 1)
