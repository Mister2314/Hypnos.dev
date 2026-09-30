/**
 * POST /api/contact — kontakt formunun server hissəsi.
 *
 * Mesajı Resend vasitəsilə birbaşa poçta göndərir (Resend-in pulsuz
 * tieri: 100/gün, 3000/ay — portfolioda bol-bolostur). RESEND_API_KEY
 * Vercel env-dədir; açarı klientə vermək olmaz (gizli).
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method' })
    return
  }
  try {
    const { name, email, message } = req.body ?? {}
    if (!name || !email || !message) {
      res.status(400).json({ ok: false, error: 'fields' })
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
