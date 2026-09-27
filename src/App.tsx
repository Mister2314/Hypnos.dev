
import { Analytics } from '@vercel/analytics/react'

import Backdrop from './components/Backdrop'
import ChapterNav from './components/ChapterNav'
import Cursor from './components/Cursor'
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

      <Backdrop />
      <Analytics />
    </>
  )
}
