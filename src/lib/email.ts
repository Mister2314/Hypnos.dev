/**
 * email.ts — kontakt formanın mail yoxlaması.
 *
 * Məqsəd: format səhvlərini hər birinə xas, saytın səsində cavablandırmaq.
 * Real poçtun mövcudluğunu yoxlamaq IMKANSIZDIR (bunun üçün SMTP yoxlaması
 * lazımdır) — ona görə "salam@gmail.com" kimi formal düzgün ünvanlar KEÇİR.
 */

export type MailIssue =
  | 'space'
  | 'noAt'
  | 'doubleAt'
  | 'noDomain'
  | 'noTld'
  | 'dots'
  | 'typo'
  | 'tempmail'

export type MailCheck = { ok: true } | { ok: false; issue: MailIssue; fix?: string }

/**
 * Birdəfəlik (tempmail) domenlər — ən çox işlənənlər.
 * Məqsəd: "salam@tempmail.com" kimi ünvanı qəbul edib səssizcə atmamaq —
 * istifadəçiyə deyirik ki, əsl ünvan gözləyirik.
 */
const DISPOSABLE = [
  'tempmail.com', 'tempmail.net', 'tempmailo.com', 'temp-mail.org', 'tempail.com',
  'tempr.email', 'tempinbox.com', 'mytemp.email', '10minutemail.com', '20minutemail.com',
  'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', 'grr.la', 'spam4.me',
  'mailinator.com', 'mailinator.net', 'yopmail.com', 'yopmail.fr', 'throwawaymail.com',
  'maildrop.cc', 'getnada.com', 'dispostable.com', 'trashmail.com', 'fakeinbox.com',
  'mailnesia.com', 'discard.email', 'mailcatch.com', 'spamgourmet.com', 'emailondeck.com',
  'moakt.com', 'burnermail.io', 'inboxkitten.com', 'mohmal.com', 'luxusmail.org',
  'mail.tm', 'mail.gw', 'tempmail.plus', '1secmail.com', '1secmail.net', '1secmail.org',
]

/** ən çox rast gəlinən domain typo-ları — düzəliş təklifi üçün */
const TYPOS: [RegExp, string][] = [
  [/gmial\.|gmai\.|gmil\.|gmeil\.|gmail\.co$|gmail\.cm$/i, 'gmail.'],
  [/hotmial\.|hotmai\.co$|hotmail\.co$|hotmsil\./i, 'hotmail.'],
  [/outlok\.|outllok\.|outook\./i, 'outlook.'],
  [/yahou\.|yahooo\.|yhaoo\./i, 'yahoo.'],
]

export function validateEmail(raw: string): MailCheck {
  const email = raw.trim()

  if (/\s/.test(email)) return { ok: false, issue: 'space' }
  if (!email.includes('@')) return { ok: false, issue: 'noAt' }
  if ((email.match(/@/g) ?? []).length > 1) return { ok: false, issue: 'doubleAt' }

  const [local, domain] = email.split('@')
  if (!local || !domain) return { ok: false, issue: 'noDomain' }
  if (!domain.includes('.') || domain.endsWith('.')) return { ok: false, issue: 'noTld' }
  if (email.includes('..') || local.startsWith('.') || local.endsWith('.') || domain.startsWith('.'))
    return { ok: false, issue: 'dots' }

  for (const [re, fixDomain] of TYPOS) {
    if (re.test(domain)) {
      const fix = `${local}@${domain.replace(re, fixDomain)}`
      return { ok: false, issue: 'typo', fix }
    }
  }

  const root = domain.toLowerCase()
  if (DISPOSABLE.some((d) => root === d || root.endsWith('.' + d)))
    return { ok: false, issue: 'tempmail' }

  // son süzgəc — praktik forma: bir @, local + nöqtəli domain
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, issue: 'noTld' }

  return { ok: true }
}
