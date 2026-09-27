/**
 * Backdrop — dünya sürücüsü + fon qatı.
 *
 * İki işi var:
 *  1. **Sürücü:** scroll mövqeyinə görə hansı dünyada olduğumuzu hesablayır və
 *     `applyWorld()` ilə CSS dəyişənlərini + `worldState`-i yazır. **Yeganə yazıcı.**
 *  2. **Fon:** dənə (grain) və vinyetka div-ləri. Ağır film qranı WebGL-dədir (`FilmOverlay`).
 *
 * ⚠️ Ölçmə `getBoundingClientRect()` ilə **keşlənir**, ScrollTrigger-in `.start`-ı ilə YOX.
 * Səbəb: trigger dəyərləri refresh sırasına bağlıdır; `rect` isə birbaşa layout-dur.
 * Keş `ScrollTrigger` `refresh` hadisəsində yenilənir — yəni **hamısı hesablandıqdan sonra**.
 *
 * ⚠️ Sürücü native `scroll` hadisəsidir (aşağıda izah).
 * ⚠️ `App.tsx`-də `<main>`-dən SONRA render olunur — ölçmə bütün bölmələr mount olandan sonra.
 */
import { ScrollTrigger, WORLDS, applyWorld, gsap, prefersReducedMotion, setWorld, useGSAP } from '../lib/scroll'

export default function Backdrop() {
  useGSAP(() => {
    setWorld(WORLDS[0])

    const sections = WORLDS.map((w) =>
      document.querySelector<HTMLElement>(`[data-world="${w.id}"]`),
    )
    const missing = WORLDS.filter((_, i) => !sections[i]).map((w) => w.id)
    if (missing.length) {
      console.warn('[Backdrop] bölmə tapılmadı:', missing)
      return
    }
    const els = sections as HTMLElement[]

    /** Fəsil başlanğıcları — scroll koordinatında. Pin boşluqları daxildir. */
    let starts: number[] = []
    let vh = window.innerHeight

    const measure = () => {
      vh = window.innerHeight
      starts = els.map((el) => el.getBoundingClientRect().top + window.scrollY)
      // Sazlama: sürücünün gördüyü fəsil sərhədləri. `probe.mjs`/`diag.mjs` bunu oxuyur —
      // "rəng niyə dəyişmir" sualına gözlə yox, rəqəmlə cavab vermək üçün.
      document.documentElement.dataset.worldStarts = starts.map((n) => Math.round(n)).join(',')
    }

    /**
     * `y` → cari fəsil indeksi.
     *
     * ⚠️ 1px tolerantlıq MƏCBURİDİR. Səbəb: `window.scrollY` kəsr ədəddir (məs. 9851.6),
     * `starts[i]` isə tam sərhəddir (9852). Səhifənin ən dibində `y >= starts[8]` **false**
     * çıxır → son fəsil (`signature`) heç vaxt tətbiq olunmur, səhifə `contact` rəngində
     * qalır. Ölçülmüş: `idx=7`, gözlənilən `8`. 1px heç nəyi dəyişmir, sərhədi düzəldir.
     */
    const indexAt = (y: number): number => {
      let idx = 0
      for (let i = 1; i < starts.length; i++) if (y >= starts[i] - 1) idx = i
      return idx
    }

    const update = (y: number) => {
      if (!starts.length) return
      const idx = indexAt(y)

      /**
       * ⚠️ Reduced-motion: rəng dəyişməsi HƏRƏKƏT deyil — MƏLUMATDIR.
       *
       * Əvvəl burada `if (prefersReducedMotion) return` idi və **bütün sürücü**
       * söndürülürdü. Nəticə: reduced-motion istifadəçisi saytı tək rəngdə görürdü —
       * `--bg` bütün sürüş boyu `#0e100f` (hero palitrası) qalırdı, fəsil keçidi isə
       * tamamilə itirdi. Ölçülmüş: 8 scroll addımının 8-də eyni rəng.
       *
       * Düzəliş: animasiya yox, keçid yox — dünya **birbaşa** dəyişir.
       * `setWorld()` məhz bunun üçün yazılmışdı, amma heç vaxt çağırılmırdı.
       */
      if (prefersReducedMotion) {
        setWorld(WORLDS[idx])
        return
      }

      if (idx === 0) {
        applyWorld(WORLDS[0], WORLDS[0], 0)
        return
      }
      // Keçid zolağı: əvvəlki ekranın sonundan bu fəslin başlanğıcına qədər.
      const t = gsap.utils.clamp(0, 1, (y - (starts[idx] - vh)) / Math.max(1, vh))
      applyWorld(WORLDS[idx - 1], WORLDS[idx], t)
    }

    measure()

    // ⚠️ Sürücü — **native `scroll` hadisəsi**, ScrollTrigger `onUpdate` DEYİL.
    // Səbəb: `ScrollTrigger.create({trigger: documentElement, end: 'bottom bottom'})`-in
    // `onUpdate`-i son sərhəddə (səhifənin ən dibi) **işə düşmür** → son fəsil
    // (`signature`) heç vaxt tam tətbiq olunmur, səhifə `contact` rəngində qalır.
    // Ölçülmüş: y=9852 (= max) → gözlənilən `#0e100f`, alınan `#0b0c0b`.
    // Native hadisə həmişə işləyir və Lenis onsuz da hər kadrda onu göndərir.
    const onScroll = () => update(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })

    // Ölçməni yenilə — bütün ScrollTrigger-lər hesablandıqdan SONRA işləyir.
    const remeasure = () => {
      measure()
      update(window.scrollY)
    }
    ScrollTrigger.addEventListener('refresh', remeasure)
    window.addEventListener('resize', remeasure)

    update(window.scrollY)

    return () => {
      window.removeEventListener('scroll', onScroll)
      ScrollTrigger.removeEventListener('refresh', remeasure)
      window.removeEventListener('resize', remeasure)
    }
  }, [])

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  )
}
