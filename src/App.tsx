/**
 * App — səhifə quruluşu.
 *
 * Sıra **məcburidir** və `WORLDS` ilə 1:1 üst-üstə düşür (`lib/scroll.ts`) — 15 fəsil:
 *   hero · leap · summer · hands · counterweight · sapere · speak · pond · quiet ·
 *   worlds · marble · work · questions · contact · signature
 *
 * ⚠️ `<Backdrop />` ən sonda: ScrollTrigger-ləri bölmələrdən SONRA yaranır → refresh düzgün.
 * ⚠️ Backdrop halation blobu kontentin ÜSTÜNDƏDIR (z-10) — film qatının varisi.
 *
 * ⚠️ Sıra dəyişsə `WORLDS` massivi də dəyişməlidir — `Backdrop` rəngi bölmələrin
 * `getBoundingClientRect().top`-undan hesablayır, indeks isə `WORLDS`-dən gəlir.
 * İkisi sürüşsə, rəng bir fəsil geri qalır və bunu **gözlə görmək çətindir.**
 */
import Backdrop from './components/Backdrop'
import ChapterNav from './components/ChapterNav'
import Cursor from './components/Cursor'
import FilmOverlay from './components/FilmOverlay'
import Preloader from './components/Preloader'
import Progress from './components/Progress'
import TopBar from './components/TopBar'
import Hero from './sections/Hero'
import Summer from './sections/Summer'
import TheHands from './sections/TheHands'
import TheCounterweight from './sections/TheCounterweight'
import SapereAude from './sections/SapereAude'
import SpeakOrDie from './sections/SpeakOrDie'
import ThePond from './sections/ThePond'
import TheQuiet from './sections/TheQuiet'
import Worlds from './sections/Worlds'
import Marble from './sections/Marble'
import Work from './sections/Work'
import Questions from './sections/Questions'
import Contact from './sections/Contact'
import TheLeap from './sections/TheLeap'
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
        <TheCounterweight />
        <SapereAude />
        <SpeakOrDie />
        <ThePond />
        <TheQuiet />
        <Worlds />
        <Marble />
        <Work />
        <Questions />
        <Contact />
        <Signature />
      </main>

      <FilmOverlay />
      <Backdrop />
    </>
  )
}
