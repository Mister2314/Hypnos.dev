# Khayal — şəxsi sayt · Qərarlar jurnalı

> **Başladı:** 26 sentyabr 2026 · **Master brief (vault):** `C:\Ikinci beyin\Layihə\10 Şəxsi sayt — master brief.md`
> Qayda: yeni qərar → bu fayla bir sətir. Bu jurnal layihənin qərar siyahısıdır.

## 1. Layihə nədir

Instagram bio üçün bir-səhifəlik scroll-sayt — eyni zamanda universitet/iş üçün qapı.
Konsept: **üç dünya, bir adam** — Yay (CMBYN) · Sapere aude (Merli) · Mərmər (Roma) + imza.
İngilis mətn, səs yox (maks. SFX). Stek: **Vite + React + TS + GSAP + ScrollTrigger + Lenis**. Deploy: **Vercel**.

## 2. Qovluq quruluşu

```text
khayal-site/
├── QERARLAR.md          ← bu fayl
├── public/bust/         ← saytın yüklədiyi fayllar
│   ├── frames-1920/     ← 101 kadr (desktop)
│   ├── frames-1024/     ← 101 kadr (mobil)
│   └── poster-1920.webp
├── public/hands/        ← əl motivi (v1 əsas · v2 ehtiyat)
├── src/
│   ├── lib/scroll.ts    ← ortaq hərəkət qatı (GSAP + ScrollTrigger + useGSAP)
│   ├── components/      ← Backdrop · Progress · Sequence · Line
│   ├── sections/        ← Hero · Summer · SapereAude · Marble · Signature
│   └── styles/global.css
├── dist/                ← build çıxışı (portativ — `base: './'`)
└── source/              ← mənbə — deploy olunmur
    ├── hands/           ← əl şəkillərinin PNG-ləri
    ├── The_classical_marble_bust_slow_*.mp4
    ├── bust-v1-ucdebir.png
    ├── bust-v3-on.png
    └── bust-v4-dramatik.png
```

## 3. Fayllar — nə üçündür

| Fayl | Nə üçün | Saytda? |
|---|---|---|
| `frames-1920/` (101 kadr) | Mərmər büst sequence — desktop | ✅ |
| `frames-1024/` (101 kadr) | Eyni sequence — mobil | ✅ |
| `poster-1920.webp` | İlk görünüş (LCP) | ✅ |
| `*.mp4` | Xam video — mənbə | ❌ |
| `bust-v1-ucdebir.png` | Seçilmiş büst — videonun mənbəyi | ❌ |
| `bust-v3-on.png` · `bust-v4-dramatik.png` | Alternativlər — yedək | ❌ |
| `hands-v1-temas.webp` | Əl motivi — əsas (Yay bölməsi) | ✅ |
| `hands-v2-divar.webp` | Əl motivi — ehtiyat variant | ✅ |
| `source/hands/*.png` | Əl şəkillərinin PNG mənbəyi | ❌ |
| `src/components/Sequence.tsx` | 2.5D büst — canvas + pin + scrub | ✅ |
| `src/components/Backdrop.tsx` | Dünya rəng keçidi (tək-yazan) | ✅ |
| `src/components/Progress.tsx` | Yuxarı scroll gedişatı xətti | ✅ |
| `src/lib/scroll.ts` | GSAP/ScrollTrigger/useGSAP + `WORLDS` | ✅ |

## 4. Verilmiş qərarlar

| # | Qərar | Niyə | Alternativ |
|---|---|---|---|
| 1 | Hekayə: 3 dünya + imza | Khayalın öz sıralaması: CMBYN → Merli → Roma | əlavə otaqlar — lazım deyil |
| 2 | Dil: ingilis, yalnız mətn | səs yox, maks. SFX | — |
| 3 | Baza: qara `#0e100f` + krem `#fffce1`, kölgə yox | GSAP + Hyperstudio referansları | — |
| 4 | Rəng keçidi scroll-la | "dünya dəyişir" hissi — saytın əsas hərəkəti | — |
| 5 | Tipo: serif + grotesk (+ mono az dozda) | kitab + ekran qarışığı; maks. 2 ailə | — |
| 6 | Motion: GSAP + ScrollTrigger + Lenis, `scrub: 0.5` | real-time 3D yox — pre-render 2.5D | — |
| 7 | Video yolu: **Yol 1 — AI generasiya** | büst AI ilə yaxşı çıxır | real çəkiliş · Blender · statik |
| 8 | Büst: **V1 (üçdə-bir)** | baş yana baxır → "kameraya çevrilmə" hərəkəti oradan çıxır | V3 ön · V4 yarı qaranlıq · V2 profil itdi (fayl toqquşması) |
| 9 | Video: 5 san, səssiz, kamera statik | sequence üçün sabit kadr lazımdır | — |
| 10 | Kadrlar: 101 kadr @ 20fps | 24fps dəsti 6.4 MB idi → sıxıldı | — |
| 11 | Ölçü: 1920 → 5.2 MB · 1024 → 2.5 MB | q66 / q72; 4 MB büdcədən yuxarı — qəbul edildi | perf testi problem göstərsə yenidən sıxılır |
| 12 | Əl motivi: 2 şəkil (v1 təmas · v2 divar) | Yay bölməsi — Elio–Oliver → Creation of Adam fikri; v1 seçildi | gələcəkdə real çəkiliş (Yol 2) |
| 13 | Build steki: Vite 8 · React 19 · TS 7 · GSAP 3.15 · Lenis 1.3 | brief §4 tələbi | — |
| 14 | **Rəsmi GSAP skilləri quruldu** — `greensock/gsap-skills` (commit `aed9cfd`, MIT), 8 skill | Khayal tələb etdi: *"gir internetden skillerini tap"*. Marketplace-də yox idi (0 nəticə) → GitHub. `skill-vetter` auditi: **P2 təhlükəsiz** (0 şəbəkə icrası, yalnız markdown). 11/11 fayl git-blob SHA ilə təsdiqləndi | `frontend-dev` + `impeccable` qismən örtürdü — tam örtük üçün rəsmi paket |
| 15 | **2.5D sequence: canvas + qaba-sonra-sıx yükləmə** | `Sequence.tsx` — əvvəl hər 8-ci kadr, sonra boşluqlar (`requestIdleCallback`). Yüklənməmiş kadr istənəndə ən yaxını çəkilir → heç vaxt boş ekran yox. DPR cap 2. `pin: true`, `end: +=300%` | `<img>` dəyişdirmə — titrəyir; video scrub — iOS-da işləmir |
| 16 | **Rəng keçidi: TƏK-YAZAN model** | ⚠️ **Buq tapıldı və düzəldildi.** Əvvəl 4 ayrı `fromTo` tween eyni `--bg`/`--text`/`--accent`-i yazırdı; hamısı progress 0-da idi → `immediateRender` səbəbindən **sonuncu qalib gəlirdi** → səhifə açılışda mərmər (işıq) görünürdü. İndi yalnız `Backdrop.update()` yazır, sərhədlər animasiyasız ScrollTrigger-lərdən oxunur | ayrı tween-lər — toqquşur |
| 17 | `base: './'` + `import.meta.env.BASE_URL` | `dist` portativ olsun: Vercel-də də, fayl kimi (`file://`) də işləyir | mütləq `/` yollar — yalnız kökdən işləyir |

## 5. Mərhələlər

1. ✅ **Hekayə lock** — 3 dünya + imza təsdiqləndi (işçi sətirlər sonra düzəldiləcək)
2. ✅ **Dizayn lock** — baza + 3 palitra + tipo + motion
3. ✅ **Büst istehsalı** — 4 şəkil → V1 → video → 101 kadr + poster
4. ✅ **Əl motivi** — 2 şəkil (v1 seçildi, WebP 87 KB; v2 ehtiyatda)
5. ✅ **Hərəkət qatı** — scroll animasiyası tam işləyir:
   - rəng keçidi (5 dünya, davamlı interpolyasiya)
   - 2.5D büst sequence (101 kadr, pin 300%)
   - bölmə motion-ları (ad yox olur · əl parallaksı · qızıl xətt yazılır · sosiallar düşür)
   - `prefers-reduced-motion` → hamısı statik
6. ⏳ **Deploy** — Vercel

## 6. Yoxlama — nə ölçüldü (26 sen)

Chrome DevTools Protocol ilə real scroll testi (headless, 1440×900):

| Scroll | `--bg` | Nəticə |
|---|---|---|
| 0% | `#0e100f` | Hero tünd ✓ (əvvəl buq: mərmər açılırdı) |
| 25% | `#30312d` | Yay — dəqiq |
| 50% | `rgba(19,21,20,1)` | Sapere aude |
| 75% | `rgba(215,210,202,1)` | Mərmərə keçid |
| 100% | `#0e100f` | İmza |

- **101/101 kadr yükləndi**, şəbəkə xətası yox
- Canvas çəkilir: `minLum 0 · maxLum 229 · meanLum 47` (boş deyil); scroll 55%→85% arası kadr dəyişir
- Konsol: **xəta yoxdur**
- Build: JS **121.7 KB gzip** (büdcə 250 KB ✓) · CSS 2.25 KB gzip

## 7. Xərc

Büst: 4 şəkil + 1 video ≈ **70–140 kredit**.

## 8. Gözləyən (Khayaldan)

- Instagram handle
- İşçi sətirlərin təsdiqi (brief §2 — 5 sətir)
- CV + portfolio linkləri

## 9. Texniki qeydlər

- **ffmpeg 9.0.2** — tam yol: `C:\Users\Morpheus\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe` (Links qısayolu bash-dan işləmir)
- Sequence spec: coarse-first yükləmə · DPR cap 2 · poster · `prefers-reduced-motion` → statik kadr · pin ~3×vh
- Köhnə nüsxə: `C:\Ikinci beyin\.workbuddy-ai\sayt\` — yedək, silinməyib
- İşlətmə: `bun run dev` (lokal) · `bun run build` (yoxlama) · `bun run preview` (build-i yoxla)
- **GSAP skilləri:** `~/.workbuddy-ai/skills/gsap-{core,scrolltrigger,timeline,react,plugins,performance,utils,frameworks}/` — hər birində `PROVENANCE.txt`
- **ScrollTrigger qaydası:** `pin` yaradan trigger-dən ƏVVƏL aşağıdakı trigger yaranmasın → `App.tsx`-də `<Backdrop />` `<main>`-dən **sonra** durur
- **Doğrulama alətləri:** `.workbuddy-ai/tmp/smoke.mjs` (rəng keçidi) · `canvas.mjs` (kadr + piksel) — Chrome CDP ilə

---

# v2 — «Three Worlds» (26 sentyabr)

**İstək:** *"daha böyük bir layihə görməyini istəyirəm… call me by your name tərzini afişlerini filan hamisini araşdır… https://pear.no/ bu sayt kimi bir iş istəyirəm."*

Araşdırma: 3 paralel agent + 1 fetch → tam nəticə **`KONSEPT.md`**-də (mənbələrlə).

## 11. v1 → v2: nə dəyişdi

| | v1 | v2 |
|---|---|---|
| Fəsil | 5 | **9** |
| Qlobal qat | — | `FilmOverlay` (WebGL qran/halation) · `ChapterNav` · `Cursor` · `TopBar` |
| Scroll saxlayıcı | GSAP `pin` | **native `position: sticky`** |
| Rəng sürücüsü | 4 ayrı tween | **tək yazan** `applyWorld()` + native scroll hadisəsi |
| Halftone | — | CSS nöqtə qatı, `opacity`+`scale` (WebGL deyil — səbəb aşağıda) |
| JS büdcə | 121.7 KB gzip | **127.5 KB** (hədd 180) · CSS 4.9 KB (hədd 12) |

Fəsillər: `0 Overture · 1 Summer · 2 The Berm · 3 Sapere aude · 4 Marble · 5 Work · 6 Questions · 7 Contact · 8 Signature`

## 12. ÜÇ REAL SƏHV — hər biri ölçüldü, hər biri səbəbi ilə yazıldı

**① `pin` + `+=N%` → scroll məsafəsi 0 çıxırdı.**
`pin: true` + `end: '+=170%'` pin-spacer yaradırdı, amma hündürlüyü elementin hündürlüyünə bərabər idi (**ölçüldü: 748px**, gözlənilən 2020px). İzolyasiya testi göstərdi ki **GSAP günahsızdır** (`+=170%` tək səhifədə 1272px verir) — səhv bizim quruluşda idi.
**Həll:** pin tamamilə atıldı → `min-height` (büdcə) + `position: sticky` (saxlama) + `start: 'top top', end: 'bottom bottom'`.
**Yan qazanc:** sticky layout-a toxunmur — spacer yox, refresh sırası problemi yox, `anticipatePin` hiyləsi yox.
**⚠️ Tələ:** sticky-ni əhatə edən `overflow: hidden` sticky-ni **sındırır** → kəsmə sticky elementin özünə keçirildi.

**② Səhifənin ən dibində son fəsil tətbiq olunmurdu.**
`window.scrollY` **kəsr** ədəddir (9851.6), `starts[i]` isə tam (9852) → `y >= starts[8]` **false** → `signature` yerinə `contact` rəngi qalırdı.
**Həll:** 1px tolerantlıq (`y >= starts[i] - 1`). Ölçülmüş: `idx=7`, gözlənilən `8`.
Həmçinin sürücü ScrollTrigger `onUpdate`-dən **native `scroll` hadisəsinə** keçirildi — `onUpdate` son sərhəddə işə düşmür.

**③ `prefers-reduced-motion` yolunda hər kadrda `TypeError`.**
`gsap.set([q('.rv'), q('.socials li'), q('.signature__work li')], {opacity: 1})` → `.socials li` **boş** qaytarırdı (linklər hələ doldurulmayıb) → GSAP `undefined` hədəf alırdı.
**Həll:** tək selector sətri (`querySelectorAll` heç vaxt `undefined` vermir). Bütün 8 bölmədə tətbiq olundu — digərləri sadəcə təsadüfən işləyirdi.

## 13. Yoxlama (hamısı CDP ilə, gözlə yox)

- **9/9 dünya düzgün sıra ilə**: `#0e100f → #30312d → #2b2a22 → #0e100f → #e8e3da → #14150f → #101210 → #0b0c0b → #0e100f`
- **Sticky saxlayır**: `bermTop=0` öz aralığında, `seqTop=0` mərmər aralığında
- **101 kadr irəliləyir** (canvas parlaqlığı 47 → 52 → 57)
- **Konsol təmiz** — normal və reduced-motion rejimlərində
- **Reduced-motion**: silindr sökülür (`transform: none`), halftone söndürülür, kursor gizlədilir
- **Mobil 504px**: sticky işləyir, üfüqi daşma yox, rels yazıları gizlədilir

## 14. Növbəti addım

Publish → link Instagram bio-ya.
Əvvəl: Khayaldan **Instagram handle** + **CV/portfolio linkləri** → `src/lib/site.ts` (tək yer, bir sətir).


---

# v3 — 26 sentyabr (07:00–07:35) · 12 fəsil, «many worlds, one head»

Khayalın ikinci turu. Tələblər birbaşa onun sözləri ilə:

| # | Tələb | Nə edildi |
|---|---|---|
| 1 | *"1ci bolmedeki sekli sil"* | Yay fəslindəki tək əl şəkli **silindi** |
| 2 | *"sol el ve sag el ... ilk anda eller yaxinlasmis, scroll etdikce uzaqlassin"* | **02 — The Hands**: iki şəffaf əl, yaxınlaşır → az qalır toxunsun → ayrılır |
| 3 | *"cmbyn dan is it better speak or to die barede de birsey"* | **05 — Speak or die**: sual + cavab, seçim **icra olunur** |
| 4 | *"sectionlari ve konsepti daha da artir"* | 9 → **12 fəsil** |
| 5 | *"3D formatda onlari saga sola cevirmek ucun left right iconlari"* | Halqaya ← / → oxları, klaviatura, sürüşdürmə, snap |
| 6 | *"azerbaycanca tam adimi da silsen olar"* | `displayName: 'Xəyal Hüseynli'` **silindi** → yalnız `Khayal` |
| 7 | *"heykel videosu cox okey deyil"* | 101 kadrlı büst ardıcıllığı **silindi** → Roma kolonnadası |
| 8 | *"multiverse kimi seyler sevirem"* | **06 — Worlds**: 12 dünyanın rəng xəritəsi, kliklə keçid |
| 9 | *"hiperaktivem"* | Giriş stagger-i **0.028 s** — kartlar dalğa kimi, təntənəsiz |

## 15. Yeni fəsillər

| # | Fəsil | Dünya | İmza hərəkəti |
|---|---|---|---|
| 02 | **The Hands** | `#12100c` | Əllər yaxınlaşır → qığılcım yanır → ayrılır |
| 05 | **Speak or die** | `#0c1512` | «die» üstündən xətt çəkilir, «speak» altından qızıl xətt açılır |
| 06 | **Worlds** | `#0b0d0c` | 12 dünya kartı — hər kart öz palitrası ilə çəkilir |

**Berm → 03 · Sapere → 04 · Marble → 07 · Work → 08 · Questions → 09 · Contact → 10 · Signature → 11.**

## 16. ⚠️ Dörd yeni buq — hamısı ölçmə ilə tapıldı

**① Halqanın radiusu alt həddə düşürdü → kartlar üst-üstə mindi.**
`.ring-stage` flex elementi idi, eni məzmuna görə yığılırdı (`≈340px`) → `clientWidth * 0.48 = 163` → `max(185, …)` = **185px**. 6 kart 60° aralıqla akkord = **185px**, kart eni isə **340px**.
**Həll:** `flex: 1 1 auto; width: 100%; max-width: 1080px` → radius **430px** tavanına çatdı.
**Necə tapıldı:** CDP `--ring-r`-i `185px` oxudu. Gözlə "kartlar bir az sıxdır" kimi görünürdü — rəqəm isə dəqiq səhv idi.

**② Kart eni CSS-də SƏRT yazılmışdı və köhnə data uzunluğunu güman edirdi.**
Mobil blokda `min(52vw, 260px)` + şərh: *"72° addımda akkord = 2·185·sin36° ≈ 217px"* — yəni **5 sual** fərziyyəsi. Altıncı sual əlavə olunanda addım 60° oldu, akkord 185px-ə düşdü, kart 260px qaldı → **səssiz sınma.** Heç bir yoxlayıcı tutmadı, çünki səhv rəqəmdə deyil, **iki yerdə saxlanan həqiqətdə** idi.
**Həll:** `Questions.tsx` akkordu hesablayır (`2·r·sin(π/N) − 18`) və `--card-w` kimi verir. CSS yalnız oxuyur. `--ring-step` də eyni yolla gəlir.

**③ `transform: scale()` kəsən elementdə → `overflow: hidden` onu TUTMUR.**
Mobil ölçüdə `scrollWidth` **151px = 504 × 0.3** artıq çıxdı. Səbəb: `overflow: hidden` kəsməni elementin **lokal** fəzasında edir, `transform` isə ondan **sonra** tətbiq olunur → boyanmış qutu 1.6× böyüyür.
**Həll:** zoom daxili sarğıya (`.hands__zoom`) keçirildi — kəsən səhnə, böyüyən qat.

**④ `--window-size` viewport deyil.**
`--window-size=390,844` verildi, `window.innerWidth` **504** çıxdı → `max-width: 720px` sorğusu işə düşdü, amma **390-a xas heç nə ölçülmədi**. Test "mobil keçdi" deyəcəkdi, halbuki mobil heç ölçülməmişdi.
**Həll:** `Emulation.setDeviceMetricsOverride` → `diag.mjs`-ə əlavə olundu.

> **Beşinci, yalançı buq:** oxların fırlanması ilk ölçüdə yalnız **+2.45°** göründü və "sınıq" kimi oxundu. Əsl səbəb test mühiti idi: headless rAF **~10 fps** işləyir (2.2 s-də 23 kadr), `window.scrollTo` isə Lenis-i oyadıb saxta `scroll` hadisələri yaradır və `onScroll` kilid bitəndə hədəfi əzir. Təmiz ölçmə (heç scroll etmədən, yalnız kliklə) göstərdi: **hər klik = +60.0°** (`60.07 · 59.97 · +60 (dolanmış)`), geri oxu **−59.8°**. Mexanizm düzgündür.

## 17. Yoxlama — v3

| Yoxlama | Nəticə |
|---|---|
| Fəsil sayı və sırası | **12/12** — `hero·summer·hands·berm·sapere·speak·worlds·marble·work·questions·contact·signature` |
| Dünya keçidi (24 nöqtə) | **12 fərqli dünya**, düzgün sıra ilə |
| Əllər | boşluq **25px → 126px → 443px**; qığılcım təmas anında **0.82**, sonra **0** |
| «Speak or die» | xətt `scaleX=1`, qızıl xətt `scaleX=1`, cavab `opacity=1` |
| Halqa | `--ring-r 430px` · `--card-w 340px` · akkord 430 → **üst-üstə yox** · 2 ox · 6 kart |
| Oxlar | hər klik **+60.0°**, aktiv indeks irəliləyir, sayğac `05 / 06` |
| Klaviatura | fokussuz **dəyişmir** ✓ · fokusda **+57.9°** ✓ |
| Sürüşdürmə | **+60.9°** və snap ✓ |
| Marble parallaks | `scale 1.2 → 1.0` (50% nöqtədə 1.038 ölçüldü) |
| Reduced-motion | əl statik «az qalıb» pozu, xətlər açıq, 80/80 `.rv` görünür, halqa sökülür |
| Mobil 390×844 | üfüqi daşma **0**, grid 2 sütun, ox 40px, zoom 1.6 |
| Şəkillər | **4/4** yüklənir |
| Konsol | **təmiz** — normal, reduced, mobil |
| Büdcə | JS **129.0 KB** gzip (hədd 180) · CSS **6.2 KB** gzip (hədd 12) |

---

# v4 — 26 sentyabr (08:00) · 14 fəsil, «The Orchard» + «The Quiet»

## 18. v4 — iki yeni fəsil

| # | Fəsil | Dünya | İmza hərəkəti |
|---|---|---|---|
| 06 | **The Orchard** | `#161009` | Şaftalı scroll-la yetişir → budaqdan düşür; kliklə **əl ilə dərilir** |
| 07 | **The Quiet** | `#0a0b0a` | **6.5 s hərəkətsizlik** tələb edir — scroll edərsə yenidən bağlanır |

**Worlds → 08 · Marble → 09 · Work → 10 · Questions → 11 · Contact → 12 · Signature → 13.**

Orchard — prosedural 3D ağac: L-sistem, **2 draw call**, 0 tekstura, işıq CPU-da bişirilir. Quiet — saytın **ƏN sakit** dünyası: CMBYN-in gecikdirilmiş həll mexanizmi.

## 19. v4 — dörd real buq (hamısı ölçmə ilə)

**① Reduced-motion bütün rəng yolçuluğunu itirirdi.** `Backdrop.tsx`-də `if (prefersReducedMotion) return` **bütün dünya sürücüsünü** söndürürdü — rəng də daxil. Ölçülmüş: 8 scroll addımının **8-də** `--bg` `#0e100f` qaldı. Rəng dəyişməsi **hərəkət deyil, məlumatdır** → indi dünya birbaşa dəyişir (animasiya yox, keçid yox). `setWorld()` məhz bunun üçün yazılmışdı və **heç vaxt çağırılmırdı**.

**② Sayğac dərimi deyil, avtomatik düşməni sayırdı.** `pick()` həm klikdən (`onDown`), həm `pMax >= due`-dən çağırılırdı. Ölçülmüş: 60% sürüşdə `16/16`, **klik sayı sıfır** — yəni sayğac əslində scroll göstəricisi idi, dərim deyil. Nəticə: `SIGNATURE.harvestNone` (*"Not one peach. You have more restraint than I do."*) **ölü mətn** idi — heç vaxt görünə bilmirdi. Həll: iki ayrı sayğac — `fallen` (mövqe; topa yuvası paylayır) və `taken` (yalnız əl; HUD + `journey` bunu oxuyur).

**③ HUD etiketi tərs idi.** `label: 'on the branch'`, amma sayğac artırdı → "16/16 on the branch" o anda yazılırdı ki, budaqda heç nə qalmayıb. Həll: `'taken by hand'`.

**④ Reduced-motion-da ağac yarı-yetişmiş donurdu.** `progressRef = 0.42` → `hud: "8/16"` bütün sürüş boyu sabit, sürüş heç nəyi dəyişmirdi — sınıq görünürdü. Həll: `0` → ağac toxunulmaz (16 şaftalı budaqda), kliklər işləyir.

> **⑤ Yalançı buq — ölçmə alətinin özü.** `Page.captureScreenshot`-a `clip` verildi → 1440×900 sahə **tək rəng** (`uniqueColors: 1`) qaytardı, halbuki həmin sahədə görünən başlıq var idi (`copyOpacity: "1"`, `headRect [86,155,380]`, `topbar: "1|flex"`). Clipsiz eyni kadr: **`uniqueColors: 26861`**. **Dərs: alət ziddiyyətli rəqəm verəndə şübhəni əvvəl alətdə axtar — saytda yox.**

## 20. Yoxlama — v4

| Yoxlama | Nəticə |
|---|---|
| Fəsil sayı və eyebrow sırası | **14/14** — `01 Summer → … → 06 The Orchard → 07 The Quiet → … → 13 Signature`; boşluq və təkrar yox |
| `scrollH` | **24074** = bölmələrin cəmi (**tam uyğun**) |
| Dünya keçidi | **hər addımda fərqli** — normal, mobil və reduced rejimlərində |
| Sticky (həqiqi) | 52%-də `orcStickyTop = 0` · 62%-də `quietStickyTop = 0` — **yapışır** (computed dəyər sübut deyil) |
| Klik | **589** sintetik `pointerdown` → `0/16 → 5/16` |
| Sükut fəsli | 5 s-də açılmır, ~10 s-də **açılır** (`quietOpen: true`) |
| HUD kliksiz | **`0/16`** bütün sürüş boyu |
| İmza fəsli | `harvestNone` **çıxır** · başlıq, kolofon, layihələr render olunur |
| Worlds şəbəkəsi | `cols: 7`, `cards: 14` |
| Konsol | **təmiz** — normal + mobil 390×844 + reduced |
| Büdcə | JS **135.8 KB** gzip (hədd 180) · CSS **7.25 KB** gzip (hədd 12) |

**Açıq qalan:** `scrollWidth − innerWidth = 258px`. Səbəb **9 dekorativ fon elementidir** (`berm__mound-near` 331px, `hands__hand--open` 198px, `marble__shafts`…) — v1-dən bəri belədir, `html { overflow-x: hidden }` kəsir. Üfüqi scrollbar **yoxdur**, sticky **işləyir**. Toxunulmadı: üç versiyadan keçmiş qəsdən dizayn qərarıdır.

## 21. Növbəti addım

Nəşr (publish) — **Khayalın təsdiqi gözləyir.**
Əvvəl: **Instagram handle** + **CV/portfolio linkləri** → `src/lib/site.ts`.

---

# v4.1 — 26 sentyabr · dev rejimi bərpa

## 22. «Pis günə düşdü» — diaqnoz ölçmə ilə

Şikayət: *sayt pis günə düşdü.* İlk ölçmə göstərdi ki, **production build artıq düzgün idi** — 14/14 fəsil, konsol təmiz, `--bg` yolçuluğu işləyir, ağac canlı. Qüsur **yalnız `npm run dev`-də** idi.

| Rejim | `h1` ölçüsü | `h1` şrifti | `body` fonu | Orchard | Film |
|---|---|---|---|---|---|
| prod | **187.2px** | Cormorant Garamond | `rgb(14,16,15)` | canlı | canlı |
| dev (əvvəl) | **32px** | **Times New Roman** | `rgba(0,0,0,0)` | **ölü** | **ölü** |
| dev (sonra) | **187.2px** | Cormorant Garamond | `rgb(14,16,15)` | canlı | canlı |

İki ayrı səbəb vardı — biri görünən (stil), biri səssiz (WebGL).

## 23. Dörd düzəliş

**① CSP meta teqi dev-i kor edirdi.** `index.html`-də `<meta http-equiv="Content-Security-Policy">` vardı. Prod-da zərərsizdir, çünki CSS fayl kimi gəlir (`/assets/*.css`). Dev-də isə Vite stilləri **`<style>` teqi ilə** yeridir — `style-src 'self'` onları bloklayır, sayt tam stilsiz qalır. Ölçülmüş: `h1` **32px Times New Roman**, fon şəffaf.
**Həll:** CSP `index.html`-dən çıxarıldı; `vite.config.ts`-ə **build-only** plugin əlavə olundu (`apply: 'build'`) — meta teq yalnız `dist/index.html`-ə düşür. `Referrer-Policy` və `nosniff` hər iki rejimdə qaldı (onlar zərərsizdir).

**② `loseContext()` StrictMode altında konteksti həmişəlik öldürürdü.** `TheOrchard.tsx` və `FilmOverlay.tsx` cleanup-ında `WEBGL_lose_context.loseContext()` çağırılırdı. React StrictMode dev-də effect-i iki dəfə işlədir: mount → cleanup → mount. İkinci mount **eyni** `WebGLRenderingContext` obyektini alır — o isə artıq itirilmişdir. Ölçülmüş: dev-də `isContextLost() === true`, konsolda 5 shader xətası, ağac tamamilə ölü.
**Həll:** `loseContext()` hər iki fayldan çıxarıldı. `deleteBuffer`/`deleteProgram` resursları onsuz da azad edir; bölmələr heç vaxt unmount olmur.

**③ Yeddi yetim şrift faylı `public/fonts/`-də qalmışdı.** `fonts.css`-də istinadı yox idi — yəni heç vaxt yüklənmirdi. Biri xüsusilə qəribə: `CormorantGaramond-Medium.woff2` **1637 bayt** və `<!DO` ilə başlayır — **HTML xəta səhifəsi şrift kimi saxlanmış** (pozuq yükləmə).
**Həll:** hamısı `source/_retired/fonts/`-ə köçürüldü. Yoxlanıldı: `fonts.css`-in istinad etdiyi **38/38** fayl yerindədir.

**④ `probe.mjs` səssizcə `--cssvar` qəbul etmirdi** — skript `--vars` gözləyir. İlk probe yalnız `y`/`scrollH` qaytardı. Bu saytın deyil, **alətin** səhvi idi — eyni dərs (§19 ⑤): ziddiyyətli rəqəm → şübhəni əvvəl alətdə axtar.

## 24. Yoxlama — v4.1

| Yoxlama | Nəticə |
|---|---|
| prod — başlıq | `187.2px` · Cormorant Garamond · fon `rgb(14,16,15)` |
| prod — fəsillər | **14/14** |
| prod — WebGL | `orchard [1440,900] lost:false` · `film [1440,900] lost:false` |
| dev — başlıq | `187.2px` · fon `rgb(14,16,15)` |
| dev — WebGL | `orchardLost:false` · `filmLost:false` · kanvas piksel `nz: 35707, mean: 30.3` |
| reduced-motion | rəng dəyişir `["#0e100f","#2b2a22","#161009","#14150f"]` · ağac canlı, `treeLost:false` |
| mobil 390×844 | `scrollWidth 390` · kəsilmiş daşma **0** · 14 fəsil · `h1 54.4px` |
| Build | `dist/index.html` 0.92 kB · CSS **39.83 / 7.97 gzip** (hədd 12) · JS **410.68 / 135.79 gzip** (hədd 180) |
| CSP | `dist/index.html`-də **var** · dev-də **yox** (qəsdən) |
| Şriftlər | `dist/fonts/` — **38 fayl** |

## 25. Növbəti addım

Dəyişməyib (§21): nəşr — **Khayalın təsdiqi gözləyir**; əvvəl `src/lib/site.ts`-ə Instagram handle + CV/portfolio linkləri.

## 26. v6 — AĞAC GETDİ, GÖLMƏ GƏLDİ + İKİ QAT (26 sentyabr, gündüz)

Khayalın sorğusu v5 SYNTHESIS-in qalanı idi. Əvvəlki sessiya P0 #1–5-i bitirmişdi (təkrar + mənbə + büdcə + easing + ambient) — **amma `Berm.tsx`-də `ScrollTrigger` importu əskik qalmışdı** (runtime-da ReferenceError verəcəkdi). Bu sessiya qalanı qurdu:

| # | İş | Fayl |
|---|---|---|
| 1 | `06 The Orchard` → **`06 The Pond`** — ağac (2 draw call) silindi, yerinə **analitik heightfield su şaderi**: yönəlmiş sin-lər, analitik qradiyent (normal «pulsuz»), Schlick fresnel, `reflect(-V,n)·L` günəş parıltısı, iki sərv silueti, günəş scroll ilə batır | `ThePond.tsx` (yeni) · `tree.ts` (silindi) |
| 2 | **«Üç dubl»** — hər ziyarətdə dalğa fazaları `uSeed` (1\|2\|3) ilə dəyişir | `ThePond.tsx` |
| 3 | **Halqalar** — pointerdown (sayğa düşür) + sürüşmə (düşmür) + avtomatik (düşmür), 8 yuva. Sayğac yalnız imzada: *«N ring(s) on the water»* / sıfırsa: *«You passed the pond without touching it…»* | `journey.ts` (rewrite: peach → rings) · `Signature.tsx` · `site.ts` |
| 4 | **İki qat** — `quality.ts` (yeni): 5 siqnal (cpu · memory · save-data · battery · slow frames), High→Low **bir dəfə**, özü qalxmır, `data-tier` HTML-də, nəzarət 13-də: *«quality: high · manual — high low auto»*. Low: qılça 4500→1600 (mobil 1300→900) · su 7→4 oktava · DPR 1.75→1 · `.glass` blur yox | `quality.ts` (yeni) · `Berm.tsx` · `ThePond.tsx` · `Signature.tsx` |
| 5 | **Contact sağ panel** — desktop şüşə iki sütun (forma + «Other ways in»), mobil tək. Köhnə `.glass__links` getdi | `Contact.tsx` · CSS |
| 6 | **The Quiet — həqiqi sükut** — 3 halqa/9s → 1 halqa/14s (dərə dərinləşdi, SYNTHESIS §5) | CSS |
| 7 | **Berm kamera** — ot yalnız üfüqi zolaq idi, ekranın altı boş qalırdı: göz alçaldı (1.38→1.05), sona doğru otun içrinə, `NEAR` 2.4→1.2 — sahə kadrlı doldurur | `Berm.tsx` · `grass.ts` |
| 8 | **Berm idxalı** — `ScrollTrigger` importu bərpa edildi | `Berm.tsx` |

**Ekran yoxlaması (2 tur — `tools/diag-v6.mjs` → `tools/shots-v6/`, desktop 6 + mobil 3):**
Tur 1 tapdı: berm-in altı boş · mobil mətn günəş üzərində oxunmur · «1 rings» qramması · halqa zəif görünür. Düzəliş: kamera + `NEAR` · `text-shadow` · cəm · halqa ampüditü. Tur 2: hamısı oturdu.

**Yoxlama:** `tsc` təmiz · `verify-v5.mjs` **23/23 PASS** (14 dünya · pond head/hint/380svh · quality nəzarəti + `data-tier` · glass side · berm 190 / speak 320 · ambient vaxtla dəyişir · mobil daşma 0) · **JS 137.97 KB gzip** (hədd 180) · **CSS 8.44 KB** (hədd 12).

**Hüquq:** su + sərv ümumi təbiət formalarıdır; şader sıfırdan yazıldı — Shadertoy (CC BY-NC-SA) heç nə götürülmədi (`research/06 §5`).

**Növbəti addım:** dəyişməyib (§21) — nəşr: Khayalın təsdiqi; əvvəl `site.ts` linkləri.

## 27. v6.1 — speak fonuna qatar səhnəsi (26 sentyabr)

Khayalın klipi (`Downloads/New project.mp4` — 1280×720, 25fps, 8.68s) 05 «Speak or die» fəslinin arxa planına quraşdırıldı — **scroll ilə scrub** (§5.1 qərarı: video yox, frame ardıcıllığı).

- **Çıxarış:** `ffmpeg fps=20` → **174 kadr**, iki qat: `public/speak/frames-1280` (q66, 5.4 MB) + `frames-854` (q72, 3.6 MB) + `poster-1280.webp` (40 KB) + `manifest.json`. `ffmpeg` winget-də idi (Gyan.FFmpeg) — PATH-də yoxdur, tam yol ilə çağırılır.
- **Player:** `SpeakOrDie.tsx` — poster dərhal; `manifest.json` → ardıcıl yükləmə (pəncərə = 8); scrub **ardıcıl yüklənmiş son kadra** qədər gedir — yarı-yüklü video atlamır. Canvas 2D, cover-fit, `IntersectionObserver` ilə yalnız görünəndə. Reduced-motion: tək poster. ⚠️ `<video>` YOX — `currentTime` scrub-u iOS-da təkanlıdır; frame swap piksel-dəqiqdir.
- **Qatlar:** `narrow || low → 854`, əks halda 1280 (`quality.ts` ilə eyni model).
- **CSS:** `.speak__video` + `.speak__scrim` (sol ağır — mətn soldadır, sağ yüngül — qatar sağdan keçir; mobil bərabər). Timeline-a **video `opacity 0.5 → 1`** — karadan başlayır, qərar verdikcə açılır.
- **Yoxlama:** `verify-v5.mjs` **24/24 PASS** (yeni: «qatar kadrı canvas-da çəkilib» — piksel yoxlaması) · ekran `d2b`/`m2b`: mətn oxunaqlı, kompozisiya hər iki ekranda işləyir · **JS 138.57 KB gzip** (hədd 180) · CSS 8.52 (hədd 12).

**⚠️ Hüquqi qeyd:** bu, filmin **real kadrıdır** — layihənin öz köhnə qaydası («film kadrı qadağan», `research/06 §5`) Khayalın bu birbaşa istəyi ilə üstələndi. Personal, qeyri-kommersial sayt üçün onun qərarı və riskidir; **nəşrdən əvvəl bir daha xatırlat.**

## 28. v6.2 — sapere fonuna həyət səhnəsi + umumi player (26 sentyabr)

Khayalın ikinci klipi (`Downloads/New project (1).mp4` — *Sapere Aude* seriyası, 1920×1080, 21fps, 5.57s) 04 fəslinə quraşdırıldı.

- **Çıxarış:** `ffmpeg fps=20` → **111 kadr**, iki qat: `public/sapere/frames-1920` (q66, 7.7 MB) + `frames-1280` (q72, 5.4 MB) + poster + manifest.
- **Umumi player — `lib/sequence.ts` (yeni):** speak-dəki player çıxarıldı — **ikinci istifadəçi** peydə oldu, abstraksiya haqlıdır. Spec: `highDir / lowDir / poster / ease / focusX`. İki fəsil eyni kodu işlədir, üçüncü gəlsə spec kifayətdir.
- **`04 SapereAude` scroll büdcəsi aldı:** `100svh → 240svh` + sticky stage (`.sapere__stage`) — scrub üçün yol lazımdır. Mətn, qızıl xətt, caption — hamısı qalır.
- **`focusX` (yeni parametr):** mobil ekran yoxlaması (m2c, tur 1) göstərdi ki, 16:9 klipdən portret dilimi kadrlın ORTASINA düşür — süjet kənarda qalırdı, ekran qara oxunurdu. `focusX: 0.7` (tələbə profili) + mobil kölgə 0.72→0.55. Tur 2: süjet kadrdadır, mətn oxunaqlı.
- **Yoxlama:** `verify-v5.mjs` **25/25 PASS** (yeni: «04 — həyət kadrı canvas-da çəkilib») · ekranlar d2c/m2c baxıldı · **JS 138.77 KB gzip** (hədd 180) · CSS 8.59 (hədd 12).
- **Hüquqi qeyd §27-ninki keçərlidir:** seriyadan real kadr — onun qərarı/riski, nəşrdən əvvəl xatırlat.

## 29. v6.3 — berm → The Counterweight (Arcane astral) (26 sentyabr)

Khayalın üçüncü klipi (`Downloads/New project (2).mp4` — Arcane S2 finalının astral səhnəsi, 1920×1080, 30fps, 6.17s, sabit letterbox) **03 fəslini tam dəyişdi**: `The Berm` → **`The Counterweight`**.

- **Məzmun:** sitat *"You were never broken."* (Jayce, S2E9) + şəxsi sətir *"So I keep the flaws. They are the only proof the work is mine."* — ⚠️ **bu CIZMAdır**: onun *"insanlığı qusurlu görürəm, amma ki…"* cümləsinin davamını O yazacaq (`site.ts` → `COUNTERWEIGHT.personal`, işarəsi oradadır).
- **Çıxarış:** `cropdetect` → `crop=1920:816:0:132` (2.35:1, letterbox kəsildi) → `fps=20` → **123 kadr**, iki qat: `frames-1920` (4.2 MB) + `frames-1280` (2.9 MB) + poster + manifest.
- **Player:** eyni `lib/sequence.ts` — **üçüncü istifadəçi** (speak · sapere · counterweight).
- **Arcane üslubunun sayt tərcüməsi** (Fortiche prinsipləri — painted light · 2D FX kadrın üstündə · color script; mənbələr: School of Motion MoGraph 2021, ComicBook Fortiche interview): `.cw__bloom` — screen-blend işıq qatı, scroll ilə nəfəs alır və **alın-çırpma anında (~0.68) zirvəyə çatır** · qlobal film qranı · dünya rəngi: bənövşəyi-qara `#0f0a16` + lilac `#cfa9e8` · mətn brush-reveal (söz-söz + blur).
- **Struktur:** `WORLDS` id `berm → counterweight` · `Berm.tsx` silindi → **`src/retired/TheBerm.tsx`** (kuləkli ot playeri qorunur; bərpa təlimatı faylın başlığında) · `grass.ts` yalnız retired-də işlədilir · scroll büdcəsi `190svh → 260svh` · `verify` berm yoxlamaları counterweight ilə əvəz olundu (1.7× fərq yoxlaması arxivə — səbəbi olan təkrar artıq mövcud deyil).
- **Yoxlama:** `tsc` təmiz · `verify-v5.mjs` **24/24 PASS** · ekranlar (`tools/diag-v6.mjs`): `d2-cw-entry` (geniş kadr, sitat) · `d2-cw-peak` (yaxın kadr, zirvə) · `m2a-cw` (portret kəsim — süjet mərkəzdədir, `focusX` lazım olmadı) · **JS 135.63 KB gzip** (hədd 180 — ot playeri çıxdıqca azaldı) · CSS 8.60 (hədd 12).
- **Narrativ qeyd:** counterweight indi 03-dədir (sualın 05-dən ƏVVƏL gəlməsi onun seçimidir). Yerin dəyişdirilməsi istənilsə — `WORLDS` sırası + `App.tsx` sırası birlikdə dəyişməlidir (1:1 qaydası).

**Növbəti addım:** dəyişməyib (§21) — nəşr: Khayalın təsdiqi; əvvəl `site.ts` linkləri + `COUNTERWEIGHT.personal` üçün onun sözü.

## 30. v6.4 RƏDD + revert + dərin araşdırma (27 sentyabr)

v6.4 (xromatik split + ink-bleed + light sweep + 420svh) Khayal tərəfindən **rədd edildi**: *"hazirki stili hec beyenmedim… suni birsey olmasin, o dizaynin o hissini derinden hiss etdirsin."*

- **Revert:** 03 v6.3-ə qaytarıldı — `TheCounterweight.tsx` (Line + scrub + bloom), CSS (260svh, gradient/letter blokları silindi), verify (260svh), diag. Build hash v6.3-ün dəqiq özü: **JS 135.63 KB** / CSS 8.60 · `verify` **24/24 PASS**.
- **Post-mortem (3 səbəb):** ① RGB-split **glitch dilidir**, Arcane-in paint dili deyil ② video işığı + mətn bleed-i iki döyüşən sistem oldu — dərinlik tək mənbədən gəlir ③ effekt mətni bəzədi, anı SAHNƏLƏMƏDİ.
- **Dərin araşdırma** → `research/09-counterweight-text.md`: ICS Media (text-particles texnikası) · CodePen/Jotform/Speckyboy demo korpusu · GSAP forum dissolve · **GSAP 3.13 SplitText pulsuz** (Webflow, 29.04.2025) · Obys (Awwwards SotY 2023) / Unseen / Lusion · **RiotX Arcane / Progress Days** (rəsmi Arcane web dili: atmosfer ilk) · Fortiche prinsipləri.
- **Variantlar:** A «Dust to whole» (hissəciklərdən söz — kommuna metaforu) ⭐ · B «Held line» (SplitText, effektsiz teatr) · C «Painted letters» ⛔ · D «Haze veil» (işıq aşkar edir). **Tövsiyə: A+D.** Scroll artımı (260 → ~400svh) variantdan asılı olaraq qalır.
- **Status: KOD YOXDUR** — ortaq qərar Khayaldan gözlənir.

**Növbəti addım:** variant seçimi (A · B · D · A+D) → sonra kod.

## 31. v6.5 final — Variant B rədd, FROZEN: v6.3 + 360svh (27 sentyabr)

Variant B («Held line», SplitText `mask:'chars'` + uzun dayanmalar + 400svh) quruldu, `verify` 24/24 keçdi — amma Khayal baxdıqdan sonra dedi: *"xoşum gelmedi, ele evvelki halina getir. sadece biraz scrollu 2-3 saniye artir ki text tamamlananda biraz qalim gormus olum textleri, amma cox uzatma da."*

- **Revert:** `TheCounterweight.tsx` v6.3-ün dəqiq özü (Line + scrub + bloom, SplitText yox) · CSS mask sarğısı silindi · 400 → **360svh**.
- **Yalnız scroll artımı qaldı:** 260 → **360svh**. Mətn 0.66–0.84-də tamamlanır → 0.16 × 260svh ≈ **~2s dayanma** — onun sözü: *"biraz qalım, amma cox uzatma da."*
- **Yoxlama:** `verify` **24/24 PASS** · JS **135.63 KB** gzip (hədd 180) · CSS 8.60 (hədd 12) · ekranlar `d2-cw-entry` / `d2-cw-peak` / `m2a-cw` baxıldı · mobil daşma 0.
- **⚠️ FROZEN:** 03 fəsli bu formadadır — v6.4 (süni effekt) və v6.5-B (SplitText) rədd edilib. Yeni effekt təklifi YOXDUR: o istəməyənə qədər toxunulmur. Araşdırma arxiv: `research/09-counterweight-text.md`.

## 32. v6.6 — Sapere aude: scrub mətn + işıq kometası + mobil tam ekran (27 sentyabr)

Khayalın üç şikayəti: *"text effekti men ora gelmeden gelir bitir gormurem — her defe section-a gelende yeniden tetiklensin, sadece o section-da olanda"* · *"rule svg soldan saga effektle, yeni effektle daha gozel"* · *"mobilde full scren deyile video, sanki cercive icindedi."*

1. **Mətn effektində köklü dəyişiklik — hamısı scrub-dadır.** Əvvəl `gsap.from` + `top 80%` trigger: bir dəfə oynayır, sticky səhnədə trigger fəsildən ƏVVƏL keçirdi → o çatanda bitmişdi, heç vaxt təkrarlanmadı. İndi **bütün mətn hərəkətləri (söz-reveal · sub · caption · rule) fəsilin scrub timeline-dadır**: yalnız fəsil daxilində mövcuddur, hər girişdə yenidən oynayır, geri sarsan geriyə döyünür. `SapereAude.tsx` tam yenidən yazıldı.
2. **`.sapere__rule` — işıq kometası.** Xətt iki qat oldu: **base** (qızıl, `dashoffset` scrub ilə soldan sağa çəkilir) + **spark** (26px parlaq pəncərə — `stroke-dasharray: 26 371`, `drop-shadow` glow — base-dən ÖNDƏ yolu gəzir, sona çatanda sönmür, yox olur). Rəng: `#ecd7a8` + lilac glow — palitra ilə eyni dil.
3. **Mobil «çərçivə» — İKİ qatlı kök səbəb, biri Khayalın F12 tapıntısıdır.**
   **① ƏSAS (onu tapdı):** `@media (max-width: 720px) { .section { padding: 10vh 7vw } }` (619-cu sətir) `.section--sapere { padding: 0 }`-dan (372-ci sətir) SONRA gəlir → eyni spesifiklikdə media qalib gəlir → **yalnız sapere** mobilde 7vw çərçivədə idi (digər video fəsillərinin `padding: 0`-ı mediadan SONRADIR). Həll: media blokuna video fəsilləri üçün `padding: 0` qrupu əlavə olundu (sapere · speak · pond · counterweight · hands · marble · quiet — gələcək dəyişikliklərə davamlı).
   **② Əlavə:** toolbar yıxılanda görünən sahə 100svh-dan böyüyür + universal `dvh`/overscan qaydası faylın ortasında sonrakı bloklar tərəfindən üstələnirdi → qayda faylın ƏN SONUNA (`v6.6b`): `height: 100dvh` + canvas `calc(100% + 30svh)` overscan.
   **③ viewport-fit=cover** (Khayalın «padding» göründüyü yer): notchlu telefonlarda sistem səhifəni çərçivəyə alırdı — meta əlavə olundu, video notchun ALTINA keçir; mətn `max(6vw, env(safe-area-inset-*))` + topbar safe-area ilə qorunur (`.speak__inner` · `.sapere__stage` · `.cw__inner` · `.topbar`).

**Yoxlama:** `verify` **25/25 PASS** (yeni: spark elementi) · ekranlar: `d2c-spark` (xətt yarı-çəkili) · `d2c-sapere` · `m2a-cw` · `m2c-sapere` — mobil video tam kənar-kənarına · **JS 135.71 KB** · CSS 8.72.

**Dərs (alət üçün):** verify iki dəfə «bütün null» verdi — səbəb KOD DEYİL, **ölmüş preview serveri** idi. Artıq yoxlamadan əvvəl serverin yaşadığını yoxla. `verify`-ə `Runtime.exceptionThrown` dinləyicisi əlavə olundu — gələcəkdə səhifə xətaları birbaşa çap olunur.

**Növbəti addım:** dəyişməyib (§21) — nəşr: Khayalın təsdiqi; əvvəl `site.ts` linkləri + `COUNTERWEIGHT.personal` üçün onun sözü.

## 33. v6.7/v6.8 — 13 The Leap (Spider-Verse, C variantı) (27 sentyabr)

Khayal Variant C-ni seçdi: **imzadan ƏVVƏL sıçrayış fəsli**. Məzmun onun spec-idir: giriş sitatı *"Everyone keeps telling me how my story is supposed to go."* (Miles, Across the Spider-Verse) + üsyan *"Nah. I'm gonna do my own thing."* — **onun öz cümləsidir** («men oz bildiyimi edecem»). Klip: `New project (5).mp4` (bio-elektrik Miles, 1920×1080, 24fps, 12.1s, letterbox `crop=1920:896:0:92`).

- **Kadrlar:** 16fps → **194 kadr**, iki qat: `public/leap/frames-1920` + `frames-1280` + poster + manifest. Sayt **14 → 15 fəsil** (leap n=13, signature n=14).
- **Effekt dili — Spider-Verse NATIV** (mənbələr: beforesandafters Sony Imageworks deep-dive · Film-East/CinemaSolace «on twos» retrospektivləri): `.leap__halftone` (Ben-Day nöqtələri, overlay blend) · «Nah» sözləri **CMYK misregistration** ilə parçalanmış düşür və scroll ilə BÜTÜN qayıtır · sitat **steps(3) ease** ilə «on twos» düşür · **SICRAYIŞ: səhnə yuxarı qalxır** (0.80) — düşmə tərsinə çevrilir.
- **v6.8 — «Nah» GEÇ GƏLİR:** onun istəyi (1.5-2.5s gecikmə) → fəsil 380 → **540svh** (mobil 460), üsyan beat-i 0.30 → **0.50**.
- **Buq (ekran yoxlaması tutdu):** «Nah.I'mgonna» — boşluq inline-block span-ın İÇİNDƏ idi və render olunmurdu → boşluq span-lar ARASINA (Fragment).
- **Yoxlama:** `verify` **27/27 PASS** (15 dünya · leap nah/540svh) · ekranlar `d5b/d5c/m3b` · Worlds grid: 15 element / 7 sütun → son sıra 1 kart (sənədləşdirilib).

## 34. v6.9 — PERFORMANS: ölçmə → iki səhv bərpa → dərs (27 sentyabr)

Khayal: *"butun ozellikleri low-a yaz, sadece low qualityde islesin, qrafik secimini sil… donmasin… keyfiyyetden odun verme."* Skill-lər: `diagnosing-bugs` + `improve-codebase-architecture`.

**Feedback loop quruldu** (`tools/perf-loop.mjs` — wheel-input real scroll + rAF delta + longtask). **Bazа QIRMIZI:** dropped **33.3%**, max **600ms** donma, 21 longtask.

**Tətbiq olunan düzəlişlər (hamısı GÖRÜNÜŞÜ DƏYİŞMƏYİN):**
1. **`lib/sequence.ts` — ImageBitmap pəncərəsi (əsas düzəliş).** 651 kadr `<img>` cache-ində evik olunur → hər drawImage vaxtaşırı MAIN-thread sync-dekod = 0.5s donmalar. İndi: scrub pəncərəsindəki kadr-lar `createImageBitmap` (off-main dekod, evik olunmayan bitmap), köhnələr `close()` — yaddaş pəncərə ilə məhduddur. DPR 1 foto canvas-larda.
2. **`quality.ts` → `perf.ts`** — adaptiv tier sistemi SİLİNDİ (siqnallar + High→Low + localStorage + Signature seçim UI + `data-tier` CSS). Sayt həmişə sabit konfiqurasiyada: DPR 1 canvas, enə görə kadr qovluğu. Deletion testi: müsbət.
3. **SapereAude/Speak/Leap** — eyni sequence arxitekturası.

**İKİ SƏHV → BƏRPA (dərs):**
- ① Film qatını alpha-speck ilə əvəz etdim + halation-u Backdrop-a köçürdüm → Khayal: *"silmisen kimi gozukur… hecne deyismeden sadece performans duzelmesi et."* → **FilmOverlay DƏQİQ bərpa edildi** (mix-blend overlay + hər kadr + DPR 1.5 + shader halation/vinyetka). Glass blur da bərpa edildi.
- ② `.film-halo` blobu **130vmax** (18720px GPU qatı) yazdım → leap girişində **551ms** spike. → **160vmin**. Dərs: `will-change` qatının ölçüsü = raster xərci.

**Perf-loop nəticələri (baza → son):** decode donmaları (600ms sinxron dekod) **arxitektura ilə aradan qalxdı**; qalan dropped faizlər əsasən headless/SwiftShader mühitinin teleport-scroll raster xərcidir (wheel-input real scroll ilə ölçülür). Qran canvas (overlay blend, hər kadr, DPR 1.5) qalır — **görünüş Khayalda qalır**; əgər gələcəkdə yenə donma olsa, ilk knob: `film-overlay` DPR 1.5 → 0.75 (dənə 2× chunky, ton eyni).

**Yoxlama:** `verify` **27/27 PASS** · build **JS 135.73 KB** / CSS 8.89 KB (həddlər 180/12) · `tsc` təmiz.

**Növbəti addım:** dəyişməyib (§21) — nəşr + linklər + `COUNTERWEIGHT.personal`.

## 35. v6.10 — Leap köçürülür + yekun performans (27 sentyabr)

1. **Sıra dəyişdi (Khayalın istəyi):** Leap hero-dan SONRA köçürüldü — `hero · leap · summer · hands · … · contact · signature`. Nömrələr avtomatik (WORLDS): leap **01**, summer 02 … contact 13, signature 14. App.tsx sırası 1:1 yeniləndi.
2. **Yükləmə yaxınlıq gate-i:** 4 sequence-in ~650 faylı səhifə açılışında birdən yüklənməsin — bölmə viewport-a 2 viewport yanaşanda (`rootMargin: '250%'`, bir dəfə) yüklənməyə başlayır. İlkin yükləmə yalnız hero + leap.
3. **Lazımsızlar silindi:** `journey.getRings/getPondVisited` (istifadəsiz getterlər) · `site.linksPending` · `quality.ts`/`QualityControl` (§34) — təmiz.
4. **Perf-loop yekun (wheel-input, real input yolu):** idle **0 dropped** · **realistik sürət (1.9k px/s): 1479 kadr, orta 18ms, max 18.5ms, dropped 0 — tam stabil 60fps** · teleport referansı (5.4k px/s): 30.3% dropped, max 260ms (headless raster xərci — real cihazda yox).
5. **Yoxlama:** `verify` **27/27 PASS** · build **JS 135.26 KB** / CSS 8.87 KB · `tsc` təmiz.

## 36. v6.11 — Açılış pərdəsi + dekod-gated draw (27 sentyabr)

Khayal: *"loading qoy bu sayt terzinde… o loading olana qeder arxada hersey yuklensin ve donmalar 0-a ensin — donmanin kok sebebini tap."*

**Kök səbəb (diaqnoz):** `drawImage` dekod olunmamış `<img>`-yə düşəndə brauzer main-thread-də **sinxron dekod** edir (1280×896 WebP ≈ 100–300ms). Bitmap pəncərəsi girişdə tədricən dolur — fəsil girişlərində ilk kadrlar hələ bitmap-siz olur → sync-dekod → donma. Ölçmə: mobile realistic max 250ms spike.

**Üç düzəliş:**
1. **Dekod-gated draw** (`lib/sequence.ts`): draw **heç vaxt** dekod olunmamış `<img>`-yə düşmür — target-dan geriyə ilk hazır bitmap (yoxsa poster). Video bir an «qalır», DONMUR. Sync-dekod main-thread-də **sıfıra** enir.
2. **`decodeAhead` 12 → 20** + ilkin pəncərə: yükləmə bitən kimi ilk 20 kadr dərhal dekod olunur — fəsil girişində pəncərə dolu.
3. **Preloader** (`components/Preloader.tsx` + `lib/loader.ts`): sayt terzində (tünd + serif *Khayal* + nazik accent xətti + mono %). REAL progress: **70% leap kadr dekodu + 30% şriftlər**. `html.is-loading` scroll-u bloklayır; 8s failsafe (şəbəkə ölü olsa pərdə açılır); reduced-motion: transition yox. Bitəndə pərdə 0.7s qalxır.

**Yoxlama:** `verify` **28/28 PASS** (yeni: preloader bağlanıb) · perf-loop: desktop realistic **0 dropped / max 18.5ms** · mobile realistic **1.1%** (tək giriş spike-ı) · build **JS 136.44 KB** / CSS 9.02 KB.

**Növbəti addım:** dəyişməyib (§21) — nəşr: Khayalın təsdiqi; əvvəl `site.ts` linkləri + `COUNTERWEIGHT.personal` üçün onun sözü.
