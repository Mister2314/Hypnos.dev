/**
 * Saytın tək məlumat mənbəyi.
 *
 * ⚠️ Bütün placeholder-lər YALNIZ buradadır. Başqa faylda `'#'` href axtarma —
 * burada tapılmırsa, deməli unudulub.
 *
 * Boş qalan sahələr `''`-dir və UI onları **gizlədir**, saxta link göstərmir.
 * Səbəb: işləməyən link portfolio-da yalandan pisdir.
 */

export const SITE = {
  /** Ekranda görünən yeganə ad. Azərbaycanca tam yazılış **çıxarıldı** —
   *  Khayal özü istədi (26 sentyabr): *"azerbaycanca tam adimi da silsen olar, cox sevmedim."* */
  name: 'Khayal',
  email: '', // TODO: Khayal-dan gözlənir
  instagram: '', // TODO: handle gözlənir
  github: '', // TODO
  linkedin: '', // TODO
  cv: '', // TODO
} as const

export type Social = { label: string; href: string; primary?: boolean }

/**
 * Yalnız doldurulmuş ünvanları qaytarır. Boş olanlar UI-da görünmür.
 */
export function links(): Social[] {
  const out: Social[] = []
  if (SITE.instagram) out.push({ label: 'Instagram', href: SITE.instagram, primary: true })
  if (SITE.email) out.push({ label: 'Email', href: `mailto:${SITE.email}`, primary: true })
  if (SITE.github) out.push({ label: 'GitHub', href: SITE.github })
  if (SITE.linkedin) out.push({ label: 'LinkedIn', href: SITE.linkedin })
  if (SITE.cv) out.push({ label: 'CV', href: SITE.cv })
  return out
}

/* ---------------------------------------------------------------- fəsillər */

/** 02 — The Hands. Creation of Adam kompozisiyası; əllər scroll-la ayrılır. */
export const HANDS = {
  line: 'Nothing ever happened in the touch. Everything happened in the gap.',
  caption: 'After Michelangelo — the spark never lands, it only almost does.',
  /** Təmas nöqtəsində yanan kiçik işıq — ayrıldıqca sönür. */
  sparkLabel: 'the gap',
} as const

/**
 * 03 — The Counterweight. Arcane S2 finalı: Jayce Viktora qayıdır.
 *
 * Arxa plan: Khayalın klipi (astral səhnə) — scroll-scrub frame ardıcıllığı.
 * Sitat filmdən: *"You were never broken."* — Jayce, uşaq Viktoru xilas
 * edəndə deyilən sözün cavabı (S2E9; onun fərqləri gücü idi).
 */
export const COUNTERWEIGHT = {
  quote: 'You were never broken.',
  source: 'Arcane · Jayce, Season 2',
  /**
   * ⚠️ YERİNƏ ÖZ SÖZÜ GƏLƏCƏK — bu, onun *"insanlığı qusurlu görürəm, amma ki…"*
   * cümləsinin davamıdır. Aşağıdakı CIZMAdır (AI təklifi); o öz sözünü yazanda
   * buranı əvəz et. Yer: fəslin SON şəxsi sətri, pıçıltı kimi görünür.
   */
  personal: 'So I keep the flaws. They are the only proof the work is mine.',
} as const

/** 05 — Speak or die. CMBYN sualı, onun mənbəyi və cavabı. */
export const SPEAK = {
  question: 'Is it better to speak or to die?',
  /**
   * ⚠️ MƏNBƏ DÜZGÜNDÜR — əvvəl `'Call Me By Your Name'` yazılırdı, bu **yarımçıq** idi.
   *
   * Sətir filmdən gəlir, amma filmdəki **kitab** budur: *The Heptaméron*,
   * **Marguerite de Navarre**, 1558. Filmdə onu **ana (Annella)** səslə oxuyur —
   * Elio-nun başını sığallayaraq (Wikiquote, film, Dialogue bölməsi, sözü-sözünə).
   *
   * `Berm.tsx` isə əvvəl səhvən *Stendhal'ın Armance*-ını göstərirdi. Stendhal 1783-də
   * doğulub — yəni *Heptaméron* ondan **225 il əvvəl** yazılıb. Diaqnoz:
   * `research/08-berm-grass-tekrar.md §1.1`.
   */
  source: 'The Heptaméron · Marguerite de Navarre, 1558',
  /**
   * Filmdə sualı eşidəndən sonra Elio **dərhal** bunu deyir — və bu, sualın bütün
   * ağırlığını bir sətirdə göstərir. Atası cavab verir: *"I doubt that."*
   *
   * ⚠️ Niyə bu sətir buradadır: `03 The Berm` əvvəl **eyni sualı** deyirdi, yəni
   * iki fəsıl təkrarlanırdı. İndi `03` **yerdən** danışır, `05` isə sualı **tam** verir —
   * sual + onun doğurduğu qorxu + cavab. Təkrar yerinə **dərinlik**.
   */
  admission: 'I’ll never have the courage to ask a question like that.',
  answer: 'Better to speak.',
  /** Şəxsi qat — saytın ən birbaşa cümləsi. */
  reflection: 'I spent years picking the other one. This page is the answer I kept not giving.',
} as const

/**
 * 06 — The Pond. CMBYN-in gölməçəsi (Laghetto dei Riflessi).
 *
 * ⚠️ Fakt yoxlaması (26 sentyabr): filmdə su 5+ səhnənin şahididir — gecə
 * üzgüçülüyü, ilk gecədən sonra səhər, dostlarla üzmə (almostginger.com).
 * Ağac isə filmdə belə yox idi: bağ çəkiliş üçün əkilmişdi. Ona görə 06
 * fəsli indi suyu göstərir — `research/06-3d-model-variantlari.md`.
 */
export const POND = {
  head: 'The pond is at the end of the path.',
  sub: 'In the film, the scenes keep returning to this water. The night swim, the morning after, the afternoons that asked for nothing. The surface keeps whatever is not said.',
  hint: 'Touch the water.',
} as const

/**
 * 13 — The Leap. Spider-Verse: Across-in üsyanı + Into-nun sıçrayışı.
 *
 * Klip: Khayalın kəsdiyi səhnə (bio-elektrik Miles, Arcane-terz render).
 * Üsyan sözü ONUNDUR («men oz bildiyimi edecem») — filmdəki sitat onun
 * cümləsi ilə eyni mənanı daşıyır, ona görə birbaşa qalır.
 *
 * ⚠️ Şəxsi sətir YOXDUR — bu fəsildə iki sitat kifayətdir (onun seçimi:
 * «giriş sitatı + üsyan burda da olsun»).
 */
export const LEAP = {
  quote: 'Everyone keeps telling me how my story is supposed to go.',
  nah: 'Nah. I’m gonna do my own thing.',
  source: 'Miles Morales · Across the Spider-Verse',
} as const

/**
 * 07 — The Quiet. Saytın sükut fəsli.
 *
 * Mexanizm CMBYN-dən götürülüb: **uzadılmış müddət + verilməyən nəticə**.
 * Film final kadrı dörd dəqiqə saxlayır və heç nə izah etmir. Bu fəsil də
 * heç nə vəd etmir — sadəcə dayanmağı xahiş edir. Altı saniyə hərəkətsiz
 * qalsan, açılır. Scroll etsən, geri bağlanır.
 */
export const QUIET = {
  head: 'Stay still.',
  sub: 'Nothing is coming. That is the arrangement.',
  hold: 'hold still',
  reward: 'One film I love ends on a four-minute shot that explains nothing. This is me learning that patience.',
} as const

/**
 * 08 — Worlds. Multiverse indeksi: hər fəsil bir paralel dünya.
 *
 * ⚠️ Başlıq dəyişdi (26 sentyabr): əvvəl *"Every version of me, in one list"*
 * idi — düz, amma dişsiz. Khayal özü düzəltməyi tələb etdi. Yenisi multiverse
 * dilində danışır: heç bir budaq **ləğv olunmur**, heç biri digərindən üstün
 * sayılmır. Say yazılmır — fəsil əlavə olunsa başlıq köhnəlməsin.
 */
export const WORLDS_INTRO = {
  head: 'Every version of me, none of them cancelled',
  note: 'In one of them I never left. In one of them I never started. This is the one where I did both — and I refuse to rank them.',
} as const

/** 13 — Signature. Çıxış. */
export const SIGNATURE = {
  close: "Thanks for scrolling. Now go do something you'll remember.",
  /** Say yazılmır — fəsil əlavə olunsa bu sətir köhnəlməsin. */
  colophon:
    'One page, many worlds. Hand-written WebGL, no 3D library, no page builder. The water, the grass and the grain are all code.',
  ringsNone: 'You passed the pond without touching it. More restraint than I have.',
} as const

export const PROJECTS = [
  {
    title: 'Lunora',
    year: '2026',
    kind: 'Mobile app',
    stack: 'React Native · TypeScript · Supabase',
    blurb:
      'A habit tracker built around the idea that missing one day should not cost you the streak. Offline-first, dark only.',
    href: '', // TODO: repo / store linki
  },
  {
    title: 'This site',
    year: '2026',
    kind: 'Web',
    stack: 'React · GSAP · hand-written WebGL',
    blurb:
      'One page, many worlds. No 3D library: the water and the grass are generated from code, and the film grain is two shaders.',
    href: '', // TODO: repo
  },
] as const

/** Fəsil 09 — FAQ. Cavablar qısa, dürüst, yaltaqlıq yox. */
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
  {
    q: 'Is the water real?',
    a: 'As real as code makes it. Every wave is math, no textures and no video. It gives a slightly different pond on every visit, which felt more honest than a borrowed one.',
  },
] as const
