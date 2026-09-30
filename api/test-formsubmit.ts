/**
 * Test endpoint — FormSubmit-ə SERVER tərəfdən (Vercel infra IP) POST
 * edib cavabını qaytarır. Mövcud istifadəçi IP-lərindən FormSubmit
 * çatmadığı üçün diaqnostikadır (QERARLAR §53-54).
 */
export default async function handler(_req: any, res: any) {
  try {
    const r = await fetch('https://formsubmit.co/ajax/xeyalhuseynli06@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Origin: 'https://hypnosdev.vercel.app',
        Referer: 'https://hypnosdev.vercel.app/',
      },
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
