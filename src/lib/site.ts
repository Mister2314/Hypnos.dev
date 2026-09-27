



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


export const JOIN = {
  line: 'In one of them, it lands.',
  sub: 'The gap stays open here. Somewhere else, the spark crosses it.',
} as const


export const WORLDS_INTRO = {
  head: 'Every version of me, none of them cancelled',
  note: 'In one of them I never left. In one of them I never started. This is the one where I did both — and I refuse to rank them.',
} as const


export const SIGNATURE = {
  close: "Thanks for scrolling. Now go do something you'll remember.",

  colophon:
    'One page, many worlds. Hand-written WebGL, no 3D library, no page builder. The grain is all code.',
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
      'One page, many worlds. No 3D library: the light and the grain are all code.',
    href: '',
  },
] as const


export const FAQ = [
  {
    q: 'Who are you, exactly?',
    a: 'Nineteen. Azerbaijani. Second year of an IT degree. I build things and I read too much.',
  },
  {
    q: 'What do you actually do?',
    a: 'Interface work mostly — the part where a screen starts feeling like something. Some front-end, some mobile, some shaders.',
  },
  {
    q: 'Why so many worlds on one page?',
    a: 'Because a single tidy summary of a person is a lie. These are the ones that made me, and I refuse to rank them.',
  },
  {
    q: 'Are you available for work?',
    a: 'For remote, part-time, and anything I can learn from. I will say no to what I cannot do well.',
  },
  {
    q: 'What are you learning right now?',
    a: 'WebGL properly, and how to finish things instead of only starting them.',
  },
  {
    q: 'What is the deal with the hands?',
    a: 'Michelangelo put the whole of creation in the space between two fingers. I think he was right about that and wrong about nothing else.',
  },
] as const
