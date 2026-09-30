/**
 * App — səhifə quruluşu.
 *
 * Sıra **məcburidir** və `WORLDS` ilə 1:1 üst-üstə düşür (`lib/scroll.ts`) — 11 səhnə:
 *   hero · leap · summer · speak · hands · counterweight · sapere ·
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
import SpeakOrDie from './sections/SpeakOrDie'
import TheHands from './sections/TheHands'
import TheCounterweight from './sections/TheCounterweight'
import SapereAude from './sections/SapereAude'
import Work from './sections/Work'
import Questions from './sections/Questions'
import Contact from './sections/Contact'
import Signature from './sections/Signature'
import { useLang } from './lib/i18n'

export default function App() {
  // v14: key={lang} QAYTARILDI — dil dəyişəndə tam remount GSAP vəziyyətini
  // sıfırdan qurur (stale trigger/text-itməsi sinifi mümkün deyil).
  // Video sıçraması blob keşi ilə həll olunur: kadrlar lokal keşdən 1-2
  // kadrda bərpa olunur (sequence.ts blobCache). Videolara başqa dəymir.
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
        <SpeakOrDie />
        <TheHands />
        <TheCounterweight />
        <SapereAude />
        <Work />
        <Questions />
        <Contact />
        <Signature />
      </main>

      <Backdrop />
    </>
  )
}
