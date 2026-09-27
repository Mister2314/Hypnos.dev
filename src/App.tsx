/**
 * App — səhifə quruluşu.
 *
 * Sıra **məcburidir** və `WORLDS` ilə 1:1 üst-üstə düşür (`lib/scroll.ts`) — 13 fəsil:
 *   hero · leap · summer · hands · join · counterweight · sapere · speak ·
 *   worlds · work · questions · contact · signature
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
import TheJoin from './sections/TheJoin'
import TheCounterweight from './sections/TheCounterweight'
import SapereAude from './sections/SapereAude'
import SpeakOrDie from './sections/SpeakOrDie'
import Worlds from './sections/Worlds'
import Work from './sections/Work'
import Questions from './sections/Questions'
import Contact from './sections/Contact'
import Signature from './sections/Signature'

export default function App() {
  return (
    <>
      <Preloader />
      <TopBar />
      <Progress />
      <ChapterNav />
      <Cursor />

      <main>
        <Hero />
        <TheLeap />
        <Summer />
        <TheHands />
        <TheJoin />
        <TheCounterweight />
        <SapereAude />
        <SpeakOrDie />
        <Worlds />
        <Work />
        <Questions />
        <Contact />
        <Signature />
      </main>

      <Backdrop />
    </>
  )
}
