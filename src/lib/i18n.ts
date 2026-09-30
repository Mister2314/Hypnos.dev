// ─────────────────────────────────────────────────────────────────────────────
// i18n — üç dilli məzmun: EN (orijinal) · AZ · TR.
//
// Qayda: baxılan mətn burada; **sitat mənbələri** orijinal saxlanılır.
// Fəsil başlıqları da tərcümə olunur (v13 — onun istəyi); yalnız
// "Sapere aude" Latin mottodur — hər üç dildə eyni qalır.
// Dil seçimi localStorage-da saxlanılır; yoxdursa **EN** (onun qərarı).
// ─────────────────────────────────────────────────────────────────────────────

import { useSyncExternalStore } from 'react'
import { ScrollTrigger } from './scroll'

export type Lang = 'en' | 'az' | 'tr'

export const LANGS: Lang[] = ['en', 'az', 'tr']

const KEY = 'khayal-lang'

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'en' || saved === 'az' || saved === 'tr') return saved
  } catch {
    /* storage bloklanıb — EN ilə davam et */
  }
  return 'en'
}

let lang: Lang = detect()
const listeners = new Set<() => void>()

export function getLang(): Lang {
  return lang
}

export function setLang(l: Lang): void {
  if (l === lang) return
  lang = l
  try {
    localStorage.setItem(KEY, l)
  } catch {
    /* storage yazıla bilmir — sessiya daxilində yenə də işləyir */
  }
  document.documentElement.lang = l === 'az' ? 'az' : l
  listeners.forEach((fn) => fn())
  // v13: key={lang} remount-u getdi — bölmə hündürlükləri dəyişir, ona görə
  // ölçülər yenilənməlidir (Backdrop 'refresh' event-inə qoşuludur).
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** re-render-ə səbəb olan dil abunəliyi (TopBar-da dil düymələri üçün) */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, getLang)
}

// ── Məzmun tipləri ───────────────────────────────────────────────────────────

export type SpeakQ = {
  /** söz-söz render olunur; `speak`/`die` — xüsusi vurğu (alt xətt / üst xətt) indeksləri */
  words: string[]
  speak: number
  die: number
  qmark: string
}

export type ProjectCopy = {
  title: string
  kind: string
  stack: string
  blurb: string
}

export type FaqItem = { q: string; a: string }

export type Copy = {
  navHello: string
  heroTitle: [string, string, string]
  heroSub: string
  heroCue: string
  summerLine: string
  summerCaptionFilm: string
  summerCaptionRest: string
  handsLine: string
  handsCaption: string
  cwQuote: string
  cwPersonal: string
  sapereLine: string
  sapereSubEm: string
  sapereSubRest: string
  sapereCaption: string
  leapQuote: string
  leapNah: string
  speakQ: SpeakQ
  speakAdmission: string
  speakAnswer: string
  speakReflection: string
  workLine: string
  workFoot: string
  projects: ProjectCopy[]
  questionsHead: string
  faq: FaqItem[]
  questionsHint: string
  contactLine: string
  nameLabel: string
  emailLabel: string
  messageLabel: string
  send: string
  statusInvalid: string
  statusSending: string
  statusError: string
  statusOk: string
  sideLabel: string
  signatureClose: string
  /** fəsil başlıqları — eyebrow + ChapterNav üçün (v13: tərcümə olunur) */
  titles: Record<string, string>
}

// ── EN — orijinal mətn ───────────────────────────────────────────────────────

const EN: Copy = {
  navHello: 'Say hello',
  heroTitle: ['Hi,', "I'm", 'Khayal.'],
  heroSub: 'I keep more worlds than one head should hold. Scroll — I’ll show you a few.',
  heroCue: 'scroll',
  summerLine: 'I was born in August. That probably explains everything.',
  summerCaptionFilm: 'Call Me By Your Name',
  summerCaptionRest: ' — the summer that never really ended.',
  handsLine: 'Nothing ever happened in the touch. Everything happened in the gap.',
  handsCaption: 'After Michelangelo — the spark never lands, it only almost does.',
  cwQuote: 'You were never broken.',
  cwPersonal: 'So I keep the flaws. They are the only proof the work is mine.',
  sapereLine: 'A teacher I never met taught me to question everything, including myself.',
  sapereSubEm: 'Sapere aude.',
  sapereSubRest: ' I dared. Now I can’t stop asking.',
  sapereCaption: 'Merli · dare to know',
  leapQuote: 'Everyone keeps telling me how my story is supposed to go.',
  leapNah: 'Nah. I’m gonna do my own thing.',
  speakQ: {
    words: ['Is', 'it', 'better', 'to', 'speak', 'or', 'to', 'die'],
    speak: 4,
    die: 7,
    qmark: '?',
  },
  speakAdmission: "I don't think I'll ever be the kind of person who could ask a question like that.",
  speakAnswer: 'Better to speak.',
  speakReflection: 'I spent years picking the other one. This page is the answer I kept not giving.',
  workLine: 'I would rather show you two real things than ten neat ones.',
  workFoot:
    'More in progress. The rest of it lives in the chapters above, which is the honest portfolio anyway.',
  projects: [
    {
      title: 'Portfolio',
      kind: 'Web',
      stack: 'React · TypeScript',
      blurb: 'My second portfolio — mostly a design playground while I tested layouts. A template of sorts.',
    },
    {
      title: 'Lunora',
      kind: 'Mobile app',
      stack: 'React Native · TypeScript · Supabase',
      blurb: 'Coming soon.',
    },
    {
      title: 'This site',
      kind: 'Web',
      stack: 'React · GSAP · hand-written WebGL',
      blurb: 'Not built to show off — the first site that is entirely me.',
    },
  ],
  questionsHead: 'Things people ask me',
  faq: [
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
      a: 'For remote, part-time, and anything I can learn from.',
    },
    {
      q: 'What are you learning right now?',
      a: 'Front-end properly, working with AI, and vibe coding. AI genuinely pulls me in.',
    },
    {
      q: 'What is the deal with the hands?',
      a: 'Michelangelo put the whole of creation in the space between two fingers. I think he was right about that and wrong about nothing else.',
    },
  ],
  questionsHint: 'drag or ← →',
  contactLine: 'Say something. At best, we get to know each other.',
  nameLabel: 'Name',
  emailLabel: 'Email',
  messageLabel: 'Message',
  send: 'Send',
  statusInvalid: 'Fill in all three fields first.',
  statusSending: 'Sending…',
  statusError: 'Something broke on the way — email me directly instead.',
  statusOk: 'Message sent — talk soon.',
  sideLabel: 'Other ways in',
  signatureClose: 'Thanks for scrolling. Now go do something you’ll remember.',
  titles: {
    hero: 'Overture',
    leap: 'The Leap',
    summer: 'Summer',
    hands: 'The Hands',
    counterweight: 'The Counterweight',
    sapere: 'Sapere aude',
    speak: 'Speak or die',
    work: 'Work',
    questions: 'Questions',
    contact: 'Contact',
    signature: 'Signature',
  },
}

// ── AZ ───────────────────────────────────────────────────────────────────────

const AZ: Copy = {
  navHello: 'Salam de',
  heroTitle: ['Salam,', 'mən', 'Xəyalam.'],
  heroSub: 'Bir başın daşıya bildiyindən çox dünya saxlayıram. Sürüşdür — sənə bir neçəsini göstərəcəyəm.',
  heroCue: 'sürüşdür',
  summerLine: 'Avqustda doğulmuşam. Bu, bəlkə də hər şeyi izah edir.',
  summerCaptionFilm: 'Call Me By Your Name',
  summerCaptionRest: ' — heç bitməyən yay.',
  handsLine: 'Toxunuşda heç nə baş vermədi. Hər şey boşluqda baş verdi.',
  handsCaption: 'Michelangelo-dan sonra — qığılcım heç vaxt düşmür, düşməyə az qalır.',
  cwQuote: 'Sən heç vaxt qırılmamışdın.',
  cwPersonal: 'Ona görə qüsurlarımı saxlayıram. Onlar işin mənim olduğunun yeganə sübutudur.',
  sapereLine: 'Heç görüşmədiyim bir müəllim mənə hər şeyi — özümü də — sorğulamağı öyrətdi.',
  sapereSubEm: 'Sapere aude.',
  sapereSubRest: ' Cəsarət etdim. Artıq soruşmağı dayandıra bilmirəm.',
  sapereCaption: 'Merli · bilməyə cəsarət et',
  leapQuote: 'Ağzı olan hekayəmin necə olmalı olduğunu deyir.',
  leapNah: 'Yox! Mən öz bildiyimi edəcəyəm.',
  speakQ: {
    words: ['Danışmaq', 'yaxşıdır,', 'yoxsa', 'ölmək'],
    speak: 0,
    die: 3,
    qmark: '?',
  },
  speakAdmission: 'Belə bir sual verməyə uyğun bir insan olacağıma inanmıram.',
  speakAnswer: 'Danışmaq daha yaxşıdır.',
  speakReflection: 'İllər boyu digərini seçdim. Bu səhifə, vermədiyim cavabdır.',
  workLine: 'On səliqəli şey yerinə sizə iki real şey göstərmək istəyirəm.',
  workFoot:
    'Daha çoxu yoldadır. Qalanı yuxarıdakı fəsillərdə yaşayır — ən səmimi portfolyo onsuz da odur.',
  projects: [
    {
      title: 'Portfolio',
      kind: 'Veb',
      stack: 'React · TypeScript',
      blurb: 'İkinci portfoliom — əsasən dizayn ideyalarını sınağım yer. Bir növ şablon.',
    },
    {
      title: 'Lunora',
      kind: 'Mobil tətbiq',
      stack: 'React Native · TypeScript · Supabase',
      blurb: 'Tezliklə.',
    },
    {
      title: 'Bu sayt',
      kind: 'Veb',
      stack: 'React · GSAP · əl ilə yazılmış WebGL',
      blurb: 'Nümayiş üçün deyil — ürəyimə ilk dəfə “mən budam” dedirən saytdır: tamamilə məni əks etdirir.',
    },
  ],
  questionsHead: 'Məndən soruşulanlar',
  faq: [
    {
      q: 'Dəqiq kiməsən?',
      a: 'On doqquz yaşım var. Azərbaycanlıyam. İT ixtisasının 2-ci kursunda oxuyuram. Şeylər qururam və çox oxuyuram.',
    },
    {
      q: 'Əslində nə edirsən?',
      a: 'Əsasən interfeys işləri — ekranın nəsə hiss etdirməyə başladığı hissə. Bir az front-end, bir az mobil, bir az şader.',
    },
    {
      q: 'Bir səhifədə bu qədər dünya nə üçündür?',
      a: 'Çünki insanın tək səliqəli xülasəsi yalandır. Bunlar məni meydana gətirənlərdir və onları dərəcələməkdən imtina edirəm.',
    },
    {
      q: 'İş üçün mövcudsan?',
      a: 'Remote, yarımştat, öyrənə biləcəyim hər şey üçün.',
    },
    {
      q: 'İndi nə öyrənirsən?',
      a: 'Front-end-i düzgün öyrənirəm, AI ilə işləməyi və vibe coding-i öyrənirəm — AI-a ciddi marağım var.',
    },
    {
      q: 'Əllərin məsələsi nədir?',
      a: 'Michelangelo bütün yaradılışı iki barmağın arasındakı məsafəyə sığışdırdı. Bu məsələdə haqlı olduğunu, başqa heç nədə haqlı olmadığını düşünürəm.',
    },
  ],
  questionsHint: 'çək və ya ← →',
  contactLine: 'Bir şey de. Ən yaxşı halda bir-birimizi tanıyarıq.',
  nameLabel: 'Ad',
  emailLabel: 'Email',
  messageLabel: 'Mesaj',
  send: 'Göndər',
  statusInvalid: 'Əvvəl üç sahəni də doldur.',
  statusSending: 'Göndərilir…',
  statusError: 'Yolda bir şey pozuldu — birbaşa poçtla yaz.',
  statusOk: 'Mesaj göndərildi — danışarıq.',
  sideLabel: 'Başqa yollarla',
  signatureClose: 'Sürüşdürdiyin üçün təşəkkür. İndi gedib xatırlayacağın bir şey et.',
  titles: {
    hero: 'Uvertüra',
    leap: 'Tullanış',
    summer: 'Yay',
    hands: 'Əllər',
    counterweight: 'Əks çəki',
    sapere: 'Sapere aude',
    speak: 'Danış və ya öl',
    work: 'İşlər',
    questions: 'Suallar',
    contact: 'Əlaqə',
    signature: 'İmza',
  },
}

// ── TR ───────────────────────────────────────────────────────────────────────

const TR: Copy = {
  navHello: 'Merhaba de',
  heroTitle: ['Merhaba,', 'ben', 'Khayal.'],
  heroSub: 'Bir kafanın taşıyabileceğinden çok dünya taşıyorum. Kaydır — sana birkaçını göstereceğim.',
  heroCue: 'kaydır',
  summerLine: 'Ağustos ayında doğdum. Bu, her şeyi açıklıyor galiba.',
  summerCaptionFilm: 'Call Me By Your Name',
  summerCaptionRest: ' — hiç bitmeyen yaz.',
  handsLine: 'Dokunuşta hiçbir şey olmadı. Her şey boşlukta oldu.',
  handsCaption: 'Michelangelo’dan sonra — kıvılcım asla düşmez, sadece düşmeye yaklaştır.',
  cwQuote: 'Sen hiçbir zaman kırılmadın.',
  cwPersonal: 'Bu yüzden kusurları tutuyorum. Onlar işin bana ait olduğunun tek kanıtı.',
  sapereLine: 'Hiç tanışmadığım bir öğretmen bana her şeyi — kendimi de — sorgulamayı öğretti.',
  sapereSubEm: 'Sapere aude.',
  sapereSubRest: ' Cesaret ettim. Artık sormayı bırakamıyorum.',
  sapereCaption: 'Merli · bilmeye cesaret et',
  leapQuote: 'Herkes bana hikayemin nasıl olması gerektiğini söyleyip duruyor.',
  leapNah: 'Yok ya. Ben kendi bildiğimi yapacağım.',
  speakQ: {
    words: ['Konuşmak', 'mı', 'iyi,', 'yoksa', 'ölmek', 'mi'],
    speak: 0,
    die: 4,
    qmark: '?',
  },
  speakAdmission: 'Böyle bir soru sormaya uygun bir insan olacağıma inanmıyorum.',
  speakAnswer: 'Konuşmak daha iyi.',
  speakReflection: 'Yıllarca diğerini seçtim. Bu sayfa, vermediğim cevaptır.',
  workLine: 'On düzgün şey yerine size iki gerçek şey göstermeyi tercih ederim.',
  workFoot:
    'Dahası yolda. Gerisi yukarıdaki bölümlerde yaşıyor — en dürüst portfolyo zaten o.',
  projects: [
    {
      title: 'Portfolio',
      kind: 'Web',
      stack: 'React · TypeScript',
      blurb: 'İkinci portfolyom — ağırlıklı olarak tasarım fikirlerini denediğim yer. Bir nevi şablon.',
    },
    {
      title: 'Lunora',
      kind: 'Mobil uygulama',
      stack: 'React Native · TypeScript · Supabase',
      blurb: 'Yakında.',
    },
    {
      title: 'Bu site',
      kind: 'Web',
      stack: 'React · GSAP · elle yazılmış WebGL',
      blurb: 'Gösteriş için değil — kalbime ilk defa “ben budum” dedirtiren site: tamamen beni yansıtıyor.',
    },
  ],
  questionsHead: 'Bana sorulanlar',
  faq: [
    {
      q: 'Tam olarak kimsin?',
      a: 'On dokuz yaşındayım. Azerbaycanlıyım. BT bölümünün ikinci yılında okuyorum. Şeyler inşa ediyorum ve çok fazla okuyorum.',
    },
    {
      q: 'Aslında ne yapıyorsun?',
      a: 'Çoğunlukla arayüz işi — ekranın bir şey hissettirmeye başladığı kısım. Biraz front-end, biraz mobil, biraz shader.',
    },
    {
      q: 'Tek sayfada bu kadar dünya neden?',
      a: 'Çünkü bir insanın tek derli toplu özeti yalandır. Bunlar beni yapan şeyler ve onları sıralamayı reddediyorum.',
    },
    {
      q: 'İşe müsait misin?',
      a: 'Uzaktan, yarı zamanlı ve öğrenebileceğim her şeye.',
    },
    {
      q: 'Şu anda ne öğreniyorsun?',
      a: 'Front-end’i düzgün öğreniyorum, AI ile çalışmayı ve vibe coding’i öğreniyorum — AI’ya gerçekten ilgi duyuyorum.',
    },
    {
      q: 'Eller meselesi ne?',
      a: 'Michelangelo bütün yaratılışı iki parmağın arasındaki boşluğa yerleştirdi. O konuda haklı olduğunu, başka hiçbir konuda haklı olmadığını düşünüyorum.',
    },
  ],
  questionsHint: 'sürükle ya da ← →',
  contactLine: 'Bir şey söyle. En iyi ihtimalle birbirimizi tanırız.',
  nameLabel: 'İsim',
  emailLabel: 'E-posta',
  messageLabel: 'Mesaj',
  send: 'Gönder',
  statusInvalid: 'Önce üç alanı da doldur.',
  statusSending: 'Gönderiliyor…',
  statusError: 'Yolda bir şey bozuldu — doğrudan e-posta yaz.',
  statusOk: 'Mesaj gönderildi — yakında konuşuruz.',
  sideLabel: 'Diğer yollarla',
  signatureClose: 'Kaydırdığın için teşekkürler. Şimdi gidip hatırlayacağın bir şey yap.',
  titles: {
    hero: 'Uvertür',
    leap: 'Atılım',
    summer: 'Yaz',
    hands: 'Eller',
    counterweight: 'Karşı ağırlık',
    sapere: 'Sapere aude',
    speak: 'Konuş ya da öl',
    work: 'İşler',
    questions: 'Sorular',
    contact: 'İletişim',
    signature: 'İmza',
  },
}

const DICT: Record<Lang, Copy> = { en: EN, az: AZ, tr: TR }

export function getCopy(l: Lang = lang): Copy {
  return DICT[l]
}

/** komponent içində: dil dəyişəndə re-render edən hook */
export function useCopy(): Copy {
  return useSyncExternalStore(subscribe, () => DICT[lang], () => DICT[lang])
}

// başlanğıcda <html lang> düzülür
if (typeof document !== 'undefined') document.documentElement.lang = lang
