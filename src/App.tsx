/**
 * App — səhifə quruluşu.
 *
 * Sıra **məcburidir** və `WORLDS` ilə 1:1 üst-üstə düşür (`lib/scroll.ts`) — 11 səhnə:
 *   hero · leap · summer · hands · counterweight · sapere · speak ·
 *   work · questions · contact · signature
 *
 * ⚠️ `<Backdrop />` ən sonda: ScrollTrigger-ləri bölmələrdən SONRA yaranır → refresh düzgün.
 * ⚠️ Sıra dəyişsə `WORLDS` massivi də dəyişməlidir — `Backdrop` rəngi bölmələrin
 * `getBoundingClientRect().top`-undan hesablayır, indeks isə `WORLDS`-dən gəlir.
 * İkisi sürüşsə, rəng bir fəsil geri qalır və bunu **gözlə görmək çətindir.**
 */
import Backdrop from './components/Backdrop'
import ChapterNav from './components/ChapterNav'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import Progress from './components/Progress'
import TopBar from './components/TopBar'
import Hero from './sections/Hero'
import TheLeap from './sections/TheLeap'
import Summer from './sections/Summer'
import TheHands from './sections/TheHands'
import TheCounterweight from './sections/TheCounterweight'
import SapereAude from './sections/SapereAude'
import SpeakOrDie from './sections/SpeakOrDie'
import Work from './sections/Work'
import Questions from './sections/Questions'
import Contact from './sections/Contact'
import Signature from './sections/Signature'
import { useLang } from './lib/i18n'

export default function App() {
  const lang = useLang()
  return (
    <>
      <Preloader />
      <TopBar />
      <Progress />
      <ChapterNav />
      <Cursor />

      <main key={lang}>
        <Hero />
        <TheLeap />
        <Summer />
        <TheHands />
        <TheCounterweight />
        <SapereAude />
        <SpeakOrDie />
        <Work />
        <Questions />
        <Contact />
        <Signature />
      </main>

      <Backdrop />
    </>
  )
}
