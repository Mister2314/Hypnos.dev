
export const SITE = {
  name: 'Khayal',
  email: 'xeyalhuseynli06@gmail.com',
  instagram: 'https://www.instagram.com/hypnos.dev',
  github: 'https://github.com/Mister2314',
  linkedin: 'https://www.linkedin.com/in/x%C9%99yal-h%C3%BCseynli-3487b91ba/',
  cv: '',
} as const

export type Social = { label: string; href: string; primary?: boolean }

export function links(): Social[] {
  const out: Social[] = []
  if (SITE.instagram) out.push({ label: 'Instagram', href: SITE.instagram, primary: true })
  if (SITE.email) out.push({ label: 'Email', href: `mailto:${SITE.email}`, primary: true })
  if (SITE.github) out.push({ label: 'GitHub', href: SITE.github })
  if (SITE.linkedin) out.push({ label: 'LinkedIn', href: SITE.linkedin })
  if (SITE.cv) out.push({ label: 'CV', href: SITE.cv })
  return out
}

// v24: HANDS, WORLDS_INTRO və SPEAK/COUNTERWEIGHT/LEAP-in mətn sahələri
// silindi — məzmun i18n.ts-də yaşayır (3 dil), burada yalnız dil-bağsız
// source sitatları + linklər qalır. Href/year üçün PROJECTS Work + Signature-da
// i18n.projects ilə İNDEKS ilə üst-üstə düşür — sırasını dəyişmə.
export const PROJECTS = [
  {
    title: 'Portfolio',
    year: '2026',
    kind: 'Web',
    stack: 'React · TypeScript',
    href: 'https://github.com/Mister2314/Portfolio-2',
  },
  {
    title: 'Lunora',
    year: '2026',
    kind: 'Mobile app',
    stack: 'React Native · TypeScript · Supabase',
    href: '',
  },
  {
    title: 'This site',
    year: '2026',
    kind: 'Web',
    stack: 'React · GSAP · hand-written WebGL',
    href: '',
  },
] as const

export const LEAP = {
  source: 'Miles Morales · Across the Spider-Verse',
} as const

export const COUNTERWEIGHT = {
  source: 'Arcane · Jayce, Season 2',
} as const

export const SPEAK = {
  source: 'The Heptaméron · Marguerite de Navarre, 1558',
} as const
