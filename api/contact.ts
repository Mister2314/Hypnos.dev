/**
 * POST /api/contact — kontakt formunun server hissəsi.
 *
 * Mesajı Resend vasitəsilə birbaşa poçta göndərir (Resend-in pulsuz
 * tieri: 100/gün, 3000/ay — portfolioda bol-bolostur). RESEND_API_KEY
 * Vercel env-dədir; açarı klientə vermək olmaz (gizli).
 *
 * v24 qoruması (spam → Gmail dolması + Resend limitinin yanması):
 *   1. honeypot — `website` sahesi formda görünmür (CSS ilə kənarda);
 *      botlar onu doldurur → 200 {ok:true} QAYTARILIR amma heç nə göndərilmir
 *      (bot "uğur" görüb gedir, limit sayğaca da düşmür).
 *   2. uzunluq cap-ları — name 100 · email 254 · message 5000 simvol.
 *   3. IP limiti — serverless-də instance-miqyaslıdır (mükəmməl deyil),
 *      amma sadə flood-a bəsdir: 5 sorğu / 10 dəqiqə.
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  list.push(now)
  hits.set(ip, list)
  if (hits.size > 500) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
  }
  return list.length > MAX_PER_WINDOW
}

function clientIp(req: { headers: unknown; socket?: { remoteAddress?: string } }): string {
  const h = req.headers as Record<string, string | string[] | undefined>
  const fwd = h?.['x-forwarded-for']
  const first = Array.isArray(fwd) ? fwd[0] : fwd
  return (first ?? req.socket?.remoteAddress ?? 'unknown').split(',')[0].trim()
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method' })
    return
  }
  try {
    const body = req.body ?? {}
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const message = String(body.message ?? '').trim()

    // honeypot — bot işi: uğur kimi qapan, heç nə göndərmə, limitə sayma
    if (String(body.website ?? '').trim() !== '') {
      res.status(200).json({ ok: true })
      return
    }

    if (!name || !email || !message) {
      res.status(400).json({ ok: false, error: 'fields' })
      return
    }
    if (name.length > 100 || email.length > 254 || message.length > 5000) {
      res.status(400).json({ ok: false, error: 'size' })
      return
    }
    const ip = clientIp(req)
    if (rateLimited(ip)) {
      res.status(429).json({ ok: false, error: 'limit' })
      return
    }

    const key = process.env.RESEND_API_KEY
    if (!key) {
      res.status(500).json({ ok: false, error: 'nokey' })
      return
    }
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: ['xeyalhuseynli06@gmail.com'],
        reply_to: email,
        subject: `Hello from ${name}`,
        text: `${message}\n\n— ${name}\n${email}`,
      }),
    })
    const data = await r.json()
    if (r.ok && (data.id || data.message === 'Email sent')) {
      res.status(200).json({ ok: true })
    } else {
      res.status(502).json({ ok: false, error: String(data.message ?? 'resend').slice(0, 120) })
    }
  } catch (e: any) {
    res.status(500).json({ ok: false, error: String(e?.message ?? e).slice(0, 120) })
  }
}
