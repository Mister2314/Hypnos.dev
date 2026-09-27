# KONSEPT — Khayal · «Three Worlds» v2

> **Referans:** [pear.no](https://pear.no/) (səviyyə) + *Call Me By Your Name* (görkəm dili)
> **Araşdırma:** 26 sentyabr 2026 · 3 paralel agent + 1 birbaşa fetch · mənbələr aşağıda
> **Status:** v1 (5 bölmə + scroll animasiyası) → **v2** (böyük layihə)

---

## 1. pear.no — nə edir, niyə güclüdür

Vahid səhifə, anchor nav (`#model` `#work` `#terms` `#questions`). Oslo, revenue-share SEO firması.

| Texnika | Nə edir | Nə üçün çətindir |
|---|---|---|
| **Video → WebGL tekstura** | 4 film (`signal` `reveal` `colossus` `footer-loop`) shader-də tekstura kimi; scroll-la dissolve (`uT`, `uMode`) | Kadr decode + GPU upload əsas ipi tıxayır → poster + `preload="none"` + DPR limiti lazım |
| **Bespoke smooth scroll** | `wheel` + `preventDefault`, lerp edilmiş `{target, current, velocity}` | `preventDefault` native a11y-ni pozur; trackpad/touch ayrı yol; reduced-motion tam opt-out |
| **Halftone / ASCII reveal** | Şəkil nöqtələrdən həqiqi kadra "həll olur" (`uDot`, `uBlk`, `uAsc`) | Nöqtə şəbəkəsi rezolyusiyadan asılı olmamalıdır |
| **SVG ink-draw** | `stroke-dashoffset` + `feTurbulence`/`feDisplacementMap` mürəkkəb yırtığı | `dasharray` hər yol üçün ölçülməlidir; `feDisplacementMap` hər kadrda bahadır |
| **3D silindr FAQ** | 5 kart `rotateY(72deg) translateZ(360px)`, depth blur, scroll-la fırlanır | Hit-test + klaviatura fokusu transform olunmuş kartlarla düzülməlidir |
| **Sətir maskası** | Daxili `<i>` `translateY(0%)`, `overflow: hidden` | — |
| **Liquid-glass forma** | `--rim/--bev/--spec/--sat/--ins` CSS dəyişənləri | — |

**Stack:** Vite + React 19 + Tailwind v4 · **əl ilə yazılmış WebGL** (Three.js **yox**) · **bespoke smooth scroll** (Lenis/GSAP **yox**) · Cloudflare.
**Şriftlər:** **Flecha** (serif display, Light 300 / Regular 400, optik ölçülər) · GT Standard L · GT Standard Mono — hamısı self-hosted.
**Palitra:** `#0b0a09` press · `#f2f1ed` paper · `#1d1c19` ink · `#33322d` ink-soft · `#015186` sky. **Yalnız işıq tema.**
**Easing:** quintic **smoothstep / smootherstep** + `cubic-bezier(.22,1,.36,1)`. Hiss: ağır, gec oturan, **0.6–1.2 s**.
**A11y:** `prefers-reduced-motion` həm JS-də, həm CSS-də; dekorativ qatlar `aria-hidden`; FAQ `FAQPage` JSON-LD.

> **Çıxarılan dərs:** səviyyə kitabxanadan gəlmir — **əl ilə yazılmış shader + ölçülmüş easing**-dən gəlir.

---

## 2. CMBYN — görkəm dili (təsdiqlənmiş faktlar)

### 2.1 Tipoqrafiya — ƏN VACİB TAPINTI

**Poster və titrlər FONT DEYİL — əl ilə yazılmış hərflərdir.**
Müəllif: **Chen Li (陈莉)**, Turin. Öz sözləri: *"The titles are all handwritten, no fonts… Thanks to director Luca Guadagnino who asked me to work on his project."* (chenli.it)

**Nəticə:** «CMBYN fontu» **yoxdur**. Axtarmaq vaxt itkisidir. Yaxınlaşmaq üçün **əl yazısı şrifti** seçilir və **heç vaxt «rəsmi CMBYN şrifti» adlandırılmır**.

> Film titrı **açılışda yox, bağlanış kreditlərində** görünür (IMDb Crazy Credits).

### 2.2 Poster kompozisiyası (təsdiqlənmiş)

Poster: **Cardinal Communications USA** (Sony Classics). Kompozisiya qaydaları:

1. **Tək tam-bleed fotoqrafiya** — illüstrasiya yox
2. İsti yüksək-aksiyalı təbii işıq — **yaşıl-qızıl** palitra
3. **Ağ əl yazısı başlıq, mərkəzdə, yuxarı üçdə-bir**
4. Subyektlər **uzanmış/aşağı, yaxın krop** → **üfüqilik**
5. Əl yazısı başlıq ↔ **mexaniki sans billing block** (kontrast qəsdəndir)
6. **Təmkin** — əsas posterde taqline yoxdur

### 2.3 Rəng və işıq

- **Kolorist:** Chaitawat Thrisansri (White Light, Banqkok). *"My first direction was a more blue tone. We slowly adjusted…"*
- **Guadagnino:** *"the look of the movie is decided in-camera"* (Kodak)
- **Ölçülmüş** (FrameThrower, 65 kadr): `#30312D` (10.2%) · `#55544D` · `#0C1512` · `#D1CCAF` · `#F1F1EA` · `#D2D2CC`
- **Mononodes oxusu:** tamamlayıcı after-image — günəşli dünya o qədər istidir ki, göz onu «ağardır» və **yaşıl** içəri axır: *«yayda gözlərini yumub günəşdə uzandığın kimi»*
- **İşıq məntiqi:** 35 çəkiliş gününün **28-i ağır yağış** → 18K HMI-dan 2.5K fresnelə, **6×6 m silk/bounce/diffusion** çərçivələr, isti gel, 500T bir stop push. Mukdeeprom: *«Italiyada işığın keyfiyyəti təəccüblüdür, çünki quru olur»*
- **Struktur cihaz:** **pəncərələr və qəfəsli qapaqlar** — Guadagnino-nun dayaq nöqtəsi Renoirin *A Day in the Country*-si

### 2.4 Tekstura

**35 mm Kodak VISION3 500T 5219** (yeganə stok) · Arricam LT · **tək linza: Cooke S4 35mm** · **sferik** · Super 35 3-perf · **1.85:1**
Hala: *«Highlight-lər partlayanda belə təbii qalır. Kənarlar yenə yumşaq və təmiz ağdır.»* → **incə qran, qaymaqlı highlight, yumşaq bloom — anamorfik flare YOX**

### 2.5 Motivlər (təsdiqlənmiş yerlər)

Villa Albergoni (Moscazzano) · **«Monet's Berm»** (bağdaki ot təpəsi — «danış, ya da öl» söhbəti) · velosipedlər · şaftalı/ərik · Laghetto dei Riflessi (üzgü yeri) · I Dünya müharibəsi abidəsi (Pandino) · Grottoes of Catullus (Sirmione) · tennis kortu · Pizzighettone platforması · Stendhal *Armance* + *Heptaméron* («speak or die») · piano transkripsiyaları

### 2.6 Hüquq — nə təsvir oluna bilər

| ✅ Sərbəst | ⛔ Qorunur |
|---|---|
| Ərik, şaftalı (meyvə kimi) | Filmin hər hansı kadrı |
| Velosiped, tennis kortu, qatar platforması | Chalamet / Hammer **üzü və ya silueti** |
| Ümumi italyan villa arxitekturası (loja, qapaqlar, çınqıl yol, sərv) | Poster / loqo əsəri |
| Klassik/Roma heykəltəraşlığı **tip kimi** (öz çəkilişin) | Sufjan Stevens sinql/albom qapaqları |
| Bağ yaşıllığı, gölməçə, notlar, kitab səhifələri | Titrın **fərqləndirici tipoqrafik quruluşu** |
| Öz əl yazınla mürəkkəb qeydlər | — |

**Qayda:** filmin **kadrını təkrarlamaq, izləmək, AI ilə «bərpa etmək» törəmə əsərdir.** Yaxınlaşma **palitra + işıq keyfiyyəti + obyekt + qran** ilə olur.

---

## 3. v2 — yeni arxitektura

v1: 5 bölmə, tək scroll. → **v2: 9 fəsil + WebGL qatı + fəsil naviqasiyası.**

| # | Fəsil | Nə var | Texnika |
|---|---|---|---|
| 0 | **Hero** | Ad, əl yazısı imza | Sətir maskası, əl yazısı reveal |
| 1 | **Summer** | Əl motivi, isti işıq | **Halftone reveal** (WebGL) |
| 2 | **The Berm** | «Danış, ya da öl» — ot təpəsi, qəfəs kölgəsi | Pinned, qəfəs işıq qatı, əl yazısı qeyd |
| 3 | **Sapere aude** | Merli, qızıl xətt | SVG ink-draw |
| 4 | **Marble** | 2.5D büst, 101 kadr | Canvas sequence + pin |
| 5 | **Work** | Lunora + layihələr | Sətir maskası, hover |
| 6 | **Questions** | FAQ | **3D silindr halqa** |
| 7 | **Contact** | Liquid-glass forma | CSS 3D + blur |
| 8 | **Signature** | Sosiallar, bağlayış | Stagger |

**Qlobal qatlar:**
- **`FilmOverlay`** — tam ekran WebGL: **qran + halation + vinyetka**, scroll-la istilik dəyişir (pear.no imzası)
- **`ChapterNav`** — sağ kənarda fəsil relsi, `data-at` offset-ləri ilə
- **`Cursor`** — xüsusi kursor, hover-də böyüyür
- **Smooth scroll** — Lenis, pear.no həssaslığına köklənmiş (`duration: 1.15`, custom ease)

**Easing:** `cubic-bezier(.22,1,.36,1)` + quintic smoothstep — ağır, gec oturan, **0.6–1.2 s**

---

## 4. Texnologiya qərarı — nə götürürük, nə götürmürük

| pear.no edir | Biz edirik | Niyə |
|---|---|---|
| Bespoke smooth scroll | **Lenis** | Lenis onsuz da lerp edilmiş `target/current` + `raf`-dır; əl ilə yazmaq a11y-ni pozur, qazanc yox |
| Əl ilə WebGL | **Əl ilə WebGL** ✅ | Bu **imzadır** — Three.js 150 KB gətirir, bizə 2 shader lazımdır |
| Video → WebGL tekstura | **Şəkil → WebGL tekstura** | 38 MB video büdcəsi yoxdur; halftone reveal eyni effekti verir |
| 3D silindr FAQ | **CSS 3D silindr** | Eyni nəticə, WebGL mürəkkəbliyi yox |
| Self-hosted display serif | **Google Fonts** | Flecha kommersiyadır; Cormorant Garamond yaxın əvəzdir |

**Büdcə həddi:** JS ≤ **180 KB gzip** (v1: 122 KB) · CSS ≤ 12 KB gzip · qran/halation GPU-da, fayl yoxdur.

---

## 5. Rəng sistemi v2

```
# 0 Hero        press   #0e100f   ink #fffce1   accent #b08d57
# 1 Summer      berm    #30312d   text #f1f1ea  peach #ffc2ae  apricot #ffa07a  cream #ffdab9
# 2 The Berm    shade   #2b2a22   straw #d8c08a  olive #7c8a55
# 3 Sapere      press   #0e100f   gold #b08d57   gold-dim #6f6759
# 4 Marble      marble  #e8e3da   text #1b1a19   dim #8c8377
# 5-8 Signature press   #0e100f
```

Ölçülmüş CMBYN ankerləri: `#30312D` · `#55544D` · `#0C1512` · `#D1CCAF` · `#F1F1EA` — v1 palitrası **artıq uyğundur** (təsadüf deyil, `Layihə/10` §3 onları mənbədən götürüb).

---

## 6. Mənbələr

- `chenli.it/cinema.html` — Chen Li, əl yazısı titrlar
- `impawards.com/2017/call_me_by_your_name.html` + `cardinalcommusa.com` — poster müəllifi
- `imdb.com/title/tt5726616/crazycredits/` — titr bağlanışda
- `liftoff.network` (2019) — kolorist müsahibəsi
- Kodak (2018) — Guadagnino + Mukdeeprom, stok və işıq
- `framethrower.io` + `mononodes.com` — ölçülmüş palitra və qrade oxusu
- `movie-locations.com` — məkan inventarı
- `discogs.com` — «Peach Season» vinil buraxılışı
- pear.no — HTML/CSS/JS bundle-ları (birbaşa oxundu)

**Yoxlanılmadı:** rəsmi hex dəyərləri (heç bir mənbə dərc etmir) · italyan bir-vərəqi · FYC key-art · 10-cu il buraxılışı · «postcard» motiv kimi

---

## 7. Tətbiq qeydi — plana qarşı nə dəyişdi (26 sentyabr, qurulub)

Plan yazıldı, sonra quruldu. **Üç yerdə plandan kənara çıxıldı — səbəbi ilə:**

| Plan (§3/§4) | Realda | Niyə |
|---|---|---|
| Halftone reveal **WebGL**-də | **CSS** nöqtə qatı, `opacity` + `scale` | Yalnız `opacity`/`transform` animasiya olunur → GPU kompozisiyası. `mask-size` tween-i hər kadrda maskanı yenidən rastrlaşdırır (~10× baha). Oxunuş eynidir |
| Şəkil → WebGL **tekstura** | **CSS** qatı | Eyni səbəb; `FilmOverlay` onsuz da əl ilə yazılmış GLSL-dir — WebGL imzası qalır |
| 3D silindr **scroll-la fırlanır** | scroll **hədəfi** verir, klik **kilidləyir**; tək yazan ticker-dir | İki yazan (scroll + klik) bir `transform`-a yazsa biri sükutla uduzar — v1-də eyni xəta artıq bir dəfə olub |

**Dəyişməyən:** 9 fəsil · rəng sistemi (§5) · `FilmOverlay` əl ilə WebGL · `cubic-bezier(.22,1,.36,1)` · hüquq sərhədləri (§2.6 — filmin heç bir kadrı, aktyor üzü, poster əsəri istifadə olunmadı).

**Büdcə:** JS **127.5 KB** gzip (hədd 180) · CSS **4.9 KB** gzip (hədd 12).
**Scroll saxlayıcı dəyişdi:** GSAP `pin` → **native `position: sticky`** (səbəb: `QERARLAR.md` §12 ①).


---

## 8. Konsept genişləndi: «üç dünya» → **many worlds, one head** (26 sentyabr)

Khayal: *"men hiperaktivem ve multiverse kimi seyler sevirem … cimde bir cox xeyal var."*

Bu, konseptin mərkəzini dəyişir, amma **zəiflətmir — dəqiqləşdirir.** Əvvəl sayt *üç* dünya
göstərirdi və bununla "mən üç şeyəm" deyirdi. Amma o, üç şey deyil — **çox şeydir**, və
"üç" rəqəmi özü bir yalandır (sadələşdirmə). İndi sayt bunu açıq deyir:

> *"I keep more worlds than one head should hold."*
> *"In one of them I never left. In one of them I never started. This is the one where I did both."*

**06 — Worlds** fəsli bunun görünən formasıdır: 12 fəsil, 12 kart, hər biri **öz palitrası ilə**
çəkilir. Kart dekorativ deyil — `WORLDS` massivindən gəlir, yəni palitra dəyişsə kart da dəyişir.
Heç bir dünya digərindən üstün sayılmır; sıra sadəcə **gəzinti** sırasıdır.

**Hiperaktivlik** tərzdə görünür, məzmunda deyil: kart girişi `stagger: 0.028s` — dalğa kimi,
təntənəsiz. Yavaş stagger "təqdimat" hissi verir; bu saytın tonu o deyil.

**Dəyişməyən:** hüquq sərhədləri (§2.6) · CMBYN + Merli xətti · tək-yazan rəng modeli ·
`cubic-bezier(.22,1,.36,1)` · əl ilə yazılmış WebGL.

**Yeni fəsillərin konsept əsası:**

| Fəsil | Mənbə | Niyə |
|---|---|---|
| 02 The Hands | Mikelancelo, *Adəmin Yaradılışı* | Qığılcım **toxunuşda deyil, boşluqda** keçir — saytın bütün ideyası budur |
| 05 Speak or die | CMBYN (Stendhal, *Armance*) | Sual sitat kimi qalmır: **seçim icra olunur** — «die» üstündən xətt çəkilir |
| 06 Worlds | multiverse | Bir adam bir xülasəyə sığmır; sayt bunu etiraf edir, gizlətmir |

**Hüquq:** heç bir film kadrı, aktyor üzü, poster əsəri və ya başlıq lockup-u istifadə olunmadı.
Əllər **orijinal generasiyadır** (klassik gips heykəl *tipi* — qorunmur). Kolonnada — Roma
arxitekturası, konkret bina deyil. Ərik/şaftalı — film detalı, amma kadr deyil.

---

**v4 — iki yeni fəsil (12 → 14).**

| Fəsil | Konsept əsası | Niyə |
|---|---|---|
| **06 The Orchard** | Bağ **qurulmuşdu** — landşaft dizayneri ərik və şaftalını yan-yana əkib. Scroll etdikcə şaftalı yetişir, budaqdan ayrılıb düşür; kliklə **əllə dərilir**. | Filmin ən yadda qalan detalı **meyvədir**, kadr deyil. Sayt onu interaktiv edir: dərməsən, **vaxt onu səndən alır** — sayğac bunu dürüst deyir (`0/16 taken by hand`, yerdə isə topa). |
| **07 The Quiet** | Heç nə vəd etməyən fəsil. **6.5 saniyə hərəkətsizlik** tələb edir; scroll edərsə yenidən bağlanır. | CMBYN-in **əsl mexanizmi**: gecikdirilmiş həll + uzun müddət + diegetik sükut. Film 4 dəqiqəlik kadrı saxlayır və başlığı yalnız son dəqiqədə göstərir. Nostalji deyil — **gözləmə**. |

**«Every version of me» yeniləndi.** `WORLDS_INTRO.head` → *"Every version of me, none of them
cancelled"*, alt sətri → *"In one of them I never left. In one of them I never started. This is
the one where I did both — and I refuse to rank them."* Səbəb: əvvəlki mətn siyahını
**sıralayırdı**, halbuki saytın bütün ideyası sıralamamaqdır. Fəsillər siyahısı da 14-ə çıxdı —
`00 Overture`-dən `13 Signature`-a qədər, hamısı bir yerdə.

**Fəsil nömrəsi artıq tək mənbədə** (`eyebrow()`). İki yerdə saxlanan həqiqət **səssizcə**
sınırdı: `Marble` 07 yazırdı, `WORLDS`-də isə 09 idi — heç bir yoxlayıcı tutmadı, çünki səhv
rəqəmdə deyil, **təkrarda** idi.

**Dəyişməyən:** hüquq sərhədləri · CMBYN xətti · tək-yazan rəng modeli · əl ilə yazılmış WebGL
(Three.js ölçü ilə kənarlaşdırıldı — 89.8 KB gzip, büdcədə 51 KB qalmışdı).

---

## 9. İki mühit — dev və prod **eyni şey deyil** (26 sentyabr, v4.1)

**Qayda: `index.html`-ə `<meta http-equiv="Content-Security-Policy">` ƏLAVƏ ETMƏ.** CSP
`vite.config.ts`-dəki `cspMeta()` pluginindən gəlir və **yalnız `apply: 'build'`** ilə işləyir —
yəni yalnız `dist/index.html`-ə düşür.

**Niyə:** dev-də Vite stilləri `<style>` teqi ilə yeridir, `style-src 'self'` onları bloklayır →
sayt **tam stilsiz** açılır (ölçülmüş: `h1` 32px Times New Roman, fon şəffaf). Prod-da problem
yoxdur, çünki CSS `/assets/*.css` kimi fayl gəlir — ona görə bu səhv **yalnız dev-də görünür**
və prod-da özünü göstərmir.

**`Referrer-Policy` + `X-Content-Type-Options`** hər iki rejimdə `index.html`-də qalır — onlar
zərərsizdir. **CSP tək istisnadır.**

**İkinci təl:** WebGL cleanup-ında **`WEBGL_lose_context.loseContext()` çağırma.** React
StrictMode dev-də effect-i iki dəfə işlədir (mount → cleanup → mount); ikinci mount **eyni**
kontekst obyektini alır — o isə artıq itirilmişdir → ağac və film qatı **ölü** açılır.
`deleteBuffer`/`deleteProgram` resursları onsuz da azad edir. Detallar: `QERARLAR.md` §22–25.
