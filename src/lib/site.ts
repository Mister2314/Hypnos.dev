



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




export const HANDS = {
  line: 'Nothing ever happened in the touch. Everything happened in the gap.',
  caption: 'After Michelangelo — the spark never lands, it only almost does.',

  sparkLabel: 'the gap',
} as const


export const COUNTERWEIGHT = {
  quote: 'You were never broken.',
  source: 'Arcane · Jayce, Season 2',



  personal: 'So I keep the flaws. They are the only proof the work is mine.',
} as const


export const SPEAK = {
  question: 'Is it better to speak or to die?',



  source: 'The Heptaméron · Marguerite de Navarre, 1558',



  admission: 'I’ll never have the courage to ask a question like that.',
  answer: 'Better to speak.',

  reflection: 'I spent years picking the other one. This page is the answer I kept not giving.',
} as const


export const LEAP = {
  quote: 'Everyone keeps telling me how my story is supposed to go.',
  nah: 'Nah. I’m gonna do my own thing.',
  source: 'Miles Morales · Across the Spider-Verse',
} as const


export const WORLDS_INTRO = {
  head: 'Every version of me, none of them cancelled',
  note: 'In one of them I never left. In one of them I never started. This is the one where I did both — and I refuse to rank them.',
} as const


export const PROJECTS = [
  {
    title: 'Lunora',
    year: '2026',
    kind: 'Mobile app',
    stack: 'React Native · TypeScript · Supabase',
    blurb:
      'A habit tracker built around the idea that missing one day should not cost you the streak. Offline-first, dark only.',
    href: '',
  },
  {
    title: 'This site',
    year: '2026',
    kind: 'Web',
    stack: 'React · GSAP · hand-written WebGL',
    blurb:
      'One page, many worlds. No 3D library: the light is all code.',
    href: '',
  },
] as const
