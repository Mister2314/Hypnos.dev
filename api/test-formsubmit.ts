/**
 * Test endpoint — FormSubmit-ə SERVER tərəfdən (Vercel infra IP) POST
 * edib cavabını qaytarır. Mövcud istifadəçi IP-lərindən FormSubmit
 * çatmadığı üçün diaqnostikadır (QERARLAR §53-54).
 */
export default async function handler(_req: any, res: any) {
  try {
    const r = await fetch('https://formsubmit.co/ajax/xeyalhuseynli06@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: 'Server test',
        message: 'FormSubmit server-side test',
        _subject: 'FormSubmit server test',
        _captcha: 'false',
      }),
    })
    const text = await r.text()
    res.status(200).json({ status: r.status, body: text.slice(0, 400) })
  } catch (e: any) {
    res.status(200).json({ error: String(e?.message ?? e).slice(0, 300) })
  }
}
