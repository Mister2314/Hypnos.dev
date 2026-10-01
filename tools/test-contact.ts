/**
 * test-contact.ts — api/contact.ts qoruma testləri (bun ile işləyir).
 *
 * RED→GREEN: push-dan əvvəl `bun run test:contact` → 8/8 PASS.
 * fetch mock-dur — şəbəkə yoxdur, Resend-e heç nə getmir.
 */
import handler from '../api/contact'

type Res = { status: number; body: any }
let res: Res

const makeRes = (): any => ({
  statusCode: 0,
  _body: undefined as any,
  status(code: number) {
    this.statusCode = code
    return this
  },
  json(b: any) {
    this._body = b
    res = { status: this.statusCode, body: b }
    return this
  },
})

const call = async (opts: {
  method?: string
  body?: any
  ip?: string
  website?: string
  name?: string
  email?: string
  message?: string
  sizeHack?: boolean
}): Promise<Res> => {
  const r = makeRes()
  let body = opts.body
  if (body === undefined) {
    body = {
      name: opts.name ?? 'Test',
      email: opts.email ?? 'test@gmail.com',
      message: opts.message ?? 'salam',
      website: opts.website ?? '',
    }
    if (opts.sizeHack) body.message = 'x'.repeat(5001)
  }
  const req = {
    method: opts.method ?? 'POST',
    body,
    headers: { 'x-forwarded-for': opts.ip ?? '1.2.3.4' },
    socket: { remoteAddress: '127.0.0.1' },
  }
  // handler async-dir — cavab (xüsusən Resend yolu) await-dən SONRA gəlir
  await handler(req, r)
  return res
}

// global fetch mock — Resend çağırışı "uğurlu" qayıdır
let resendCalls = 0
;(globalThis as any).fetch = async (): Promise<any> => {
  resendCalls++
  return { ok: true, json: async () => ({ id: 'mock-1' }) }
}

// handler açarı yoxlayır — testdə saxta açar (real şəbəkə yoxdur, fetch mock-dur)
;(process.env as any).RESEND_API_KEY = 'test-key'

let failed = 0
const check = (name: string, ok: boolean, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
  if (!ok) failed++
}

// 1. GET bloklanır
check('GET → 405', (await call({ method: 'GET' })).status === 405)

// 2. sahə əskikdir
check('boş sahə → 400 fields', (await call({ name: '' })).status === 400)

// 3. honeypot — 200 amma Resend ÇAĞIRILMIR
const beforeHp = resendCalls
const hp = await call({ website: 'spam.example' })
check('honeypot → 200 ok (silence drop)', hp.status === 200 && hp.body.ok === true)
check('honeypot → Resend çağırılmadı', resendCalls === beforeHp)

// 4. uzunluq cap
check('5001 simvol → 400 size', (await call({ sizeHack: true })).status === 400)

// 5. real göndəriş işləyir
const beforeSend = resendCalls
const ok = await call({})
check('düzgün göndəriş → 200 ok', ok.status === 200 && ok.body.ok === true)
check('Resend 1 dəfə çağırıldı', resendCalls === beforeSend + 1)

// 6-8. IP limiti — 429-ı görənə qədər vur, sonra başqa IP dəyərsiz qalsın
let got429 = false
for (let i = 0; i < 10; i++) {
  const r = await call({ ip: '9.9.9.9' })
  if (r.status === 429) {
    got429 = true
    break
  }
}
check('flood → 429 limit', got429)
const another = await call({ ip: '8.8.8.8' })
check('başqa IP təsirlənmir', another.status === 200 && another.body.ok === true)

process.exit(failed === 0 ? 0 : 1)
