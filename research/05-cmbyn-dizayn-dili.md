# 05 — CMBYN dizayn dili: filmdən sayta tərcümə

> **Sorğu (Xəyal, 26 sentyabr):** *"ta ki master olana qeder merli sapere aude dizisini onun fontunu
> dizayn dilini dizide deyilmek isteyeni arasdir ve **eynisini call me by your name ucun de arasdir**."*
>
> **Bu fayl `KONSEPT.md §2`-ni təkrarlamır — onu dərinləşdirir.**
> `KONSEPT §2` = *nə çəkilib* (texniki faktlar: stok, linza, kolorist, palitra).
> **Bu fayl = nə deməkdir və saytda necə tətbiq olunur.**
>
> Merlí tərəfi: `04-merli-sapere-aude.md`. İkisinin kəsişməsi: **§7** — saytın dizayn qanunu.

---

## 1. Tək linza qanunu — saytın öz qanunu ilə eynidir

Guadagnino bütün filmi **bir** linza ilə çəkdi: **Cooke S4 35mm**. Səbəb texniki deyil — fəlsəfədir.

> **Guadagnino:** *"I like limits. I think it's important to know the limits you are working
> within and to find the language through these limits. I gave myself the specific limit of one
> lens because **I did not want technology to interfere with the emotional flow of the film.**
> I wanted us to be concentrated on the story, on the characters, and on the flow of life."*

> **Mukdeeprom:** *"The producer asked me, should there be some other, wider lens? Just in case?
> I said 'No, no. **I want to tie my hand to this approach**, because this is how I work.
> I think if you limit yourself to something, **you struggle inside your idea**."*

> **Mukdeeprom, tək linzanın məqsədi:** *"to get the sense of the **human eye** and the simplicity."*

### 1.1 Niyə bu, saytın qanunudur

Layihə **artıq** eyni şeyi edir — sadəcə adını qoymamışdı:

| Film | Sayt |
|---|---|
| Bir linza | **Three.js yox** — əl ilə yazılmış WebGL1 |
| Bir film stoku (500T) | **Bir JS büdcəsi** — 180 KB gzip |
| Bir kolorist, bir qaralama | **Bir yazıçı CSS dəyişəni** — yalnız `applyWorld()` yazır |
| Bir kamera mövqeyi | **Bir scroll oxu** — tək hekaye xətti |
| Bir lens → *"human eye"* | **Bir ekran** — mobil və masaüstü eyni hekaye |

**Yəni:** `KONSEPT §4`-dəki *"Three.js götürmürük"* qərarı **büdcə qərarı deyil** —
Guadagnino-nun linza qərarı ilə **eyni qərardır**. Texnologiya emosiyanın axınına qarışmasın.

> **Tətbiq qaydası:** yeni bir effekt əlavə etmək istəyəndə əvvəl soruş —
> *"bu, axını gücləndirir, ya onunla rəqabət edir?"* Rəqabət edirsə, **alət səhvdir, ideya yox.**
> Mukdeeprom-un sözü ilə: **ideyanın içində mübarizə apar** — aləti dəyişmə.

---

## 2. Temp — **kəsmə yox, saxlama**

Filmin montajçısı **Walter Fasano** (Guadagnino-nun uzun illik ortağı). Metodu:

> *"allowed characters and landscapes to **breathe** without overwhelming the narrative through
> **excessive cuts**"* · *"**holding shots** to sustain emotional progression and tension"*
> · təsirlər: **Éric Rohmer** və **Bernardo Bertolucci**

Və ən konkret qərar: atanın sonda danışdığı səhnə **musiqi ilə deyil, sükutla** verildi —
**prodüser müqavimətinə baxmayaraq saxlanıldı.**

### 2.1 Saytda qarşılığı

| Film qərarı | Sayt qarşılığı | Status |
|---|---|---|
| Uzun kadrı saxlamaq | `min-height: 260svh` — scroll büdcəsi | ✅ var |
| Kəsmə yox | `position: sticky` — GSAP `pin` yerinə | ✅ var |
| Sükut (musiqi yox) | `07 The Quiet` — saytın sükut fəsli | ✅ var |
| *"breathe"* | Lenis yumşaq scroll, `--ease-out` | ✅ var |

**Nəticə:** temp düzgündür. Problem temp deyil — **§3 və §4**-dədir.

---

## 3. Diqqət — fokus bir **bəyanatdır**

Mukdeeprom-un metodunda ən az danışılan, ən güclü cihaz: **seçici fokus**.

> *"Scenes that feature dynamic manual focus **directs the eye** to characters or spaces that
> otherwise would have been overlooked. This use of **selective focus casually makes certain
> suggestions to the viewer**."*

Yəni: **bulanıqlıq diqqəti idarə edir** — və bunu *"casually"*, yəni hiss etdirmədən edir.
Seyrçi fərqinə varmır ki, ona nə göstərildiyini kimsə seçib.

### 3.1 Saytda qarşılığı

**İndi:** sayt demək olar ki, hər şeyi **eyni dəqiqliklə** göstərir. Fokus yoxdur —
hər element kəskin, hər şey bərabər dərəcədə vacib. Bu, **işıqlandırma deyil, kataloq**dur.

**Olmalı:** hər fəsılda **bir** şey kəskin, qalanı yumşaq. Texniki olaraq ucuz:

| Cihaz | Nə edir | Xərc |
|---|---|---|
| `filter: blur(2px)` + `opacity` | arxa plan qatı yumşalır | 0 KB — CSS |
| `--depth` dəyişəni | scroll-a görə fokus dərinliyi dəyişir | ~5 sətir JS |
| `backdrop-filter` | şüşə səthlər arxasını yumşaldır | 0 KB — CSS |

> **Qayda:** hər fəsılda **bir** kəskin element. İki olsa — seyrçi seçim etməlidir, sən etməmisən.

---

## 4. Qüsur — qəsdən saxlanılan səhv

Çəkilişdə **laboratoriya səhvləri** oldu — işıq sızmaları. Onlar **düzəldilmədi**,
**şeir kimi saxlanıldı**: *"incidental lab errors like light leaks in certain scenes
were **embraced for their poetic authenticity** rather than corrected."*

Və bütün "təbii işıq" hekayəsi də belədir: çəkilişin **28 günü ağır yağış** oldu.
Komanda *"yayı istehsal etdi"* — 4K–18K ARRI Fresnel, 6×6 m silk/bounce çərçivələr —
və bunu o qədər **gizli** etdi ki, heç kim təxmin etməz.

### 4.1 İki dərs

1. **"Təbii" görünən şey mühəndislikdir.** Saytın asan görünən hissələri **ən çox hesablanmış** hissələridir. Asanlıq səhvən asan hesab edilir.
2. **Qüsur buraxmaq icazədir.** Sayt **piksel-mükəmməl olmamağa** haqqı var —
   bir qran sürüşməsi, bir yarım kadr gecikmə, bir hərfin bir az yanlış yerdə durması.
   Bu, keyfiyyətsizlik deyil — **imzadır.**

> **Tətbiq:** saytın qran qatı (`grain`) artıq var. Ona **statik olmamaq** icazəsi ver —
> hər kadrda bir az dəyişsin. Film qranı canlıdır, çap qranı deyil.

---

## 5. Səs — musiqi deyil, **mühit**

Filmin səs dizaynı **təbii elementləri gücləndirdi** — su, ətraf səsi —
*"to underscore the story's sensory intimacy **without overpowering** the dialogue or score."*

Yəni iyerarxiya: **söz → mühit → musiqi.** Musiqi ən sonda gəlir, həmişə yox.

### 5.1 Saytda qarşılığı — **diqqətli**

| Etməli | Etməməli |
|---|---|
| Səsi **istifadəçi açsın** (düymə) | Avtomatik səsləndirmə — **qadağandır** |
| Mühit: külək, su, addım | Fon musiqisi |
| Səs söndürüldükdə sayt **tam işləsin** | Səssiz rejimdə hekaye yarımçıq qalsın |

> ⚠️ **`prefers-reduced-motion` yox, ayrı qat:** səs `prefers-reduced-motion`-dan asılı deyil.
> Ayrıca açılıb-söndürülən olmalıdır və **yadda saxlanmalıdır** (bir dəfə açan yenidən açmasın).

---

## 6. CMBYN nə demək istəyir — dəqiq mənbələrlə

### 6.1 Sitat **hardan** gəlir

| Kitab | Müəllif | İl | Saytda rolu |
|---|---|---|---|
| **The Heptaméron** | Marguerite de Navarre | 1558 | **"Is it better to speak or to die?"** — ana səslə oxuyur |
| **Armance** | Stendhal | 1827 | Saytın `Berm.tsx`-ində **səhvən** bu göstərilib → `08`-ə bax |

Filmdə sətir **The Heptaméron**-dandır (Wikiquote, Dialogue bölməsi, sözü-sözünə).
Filmin öz epiqrafı: *"Is it better to speak or die?"*

### 6.2 Filmin öz sözləri — Guadagnino

| Sitat | Mənbə | Nə deyir |
|---|---|---|
| *"I've never made a historical film, but I like the idea of having a little **distance of time** to provide perspective."* | Emanuel Levy | 1983 — təsadüfi deyil; **məsafə** perspektiv yaradır |
| *"**the look of the movie is decided in-camera**"* | Kodak | Effekt sonra əlavə olunmur |
| *"We wanted to **register the movement of the heart** of these characters not only through their faces, but also through **the way their bodies moved in space**."* | Emanuel Levy | ⬇ **§6.3** |
| *"Sex on screen can be the most boring thing to watch. … if the lovemaking is a way to **investigate behavior** … then I'm interested."* | Emanuel Levy | Formalı ehtiras deyil, **davranış** |

### 6.3 Ən vacib cümlə — və saytın niyə bu mediumda olduğu

> *"We wanted to register the movement of the heart of these characters not only through
> their faces, but also through **the way their bodies moved in space**."*

**Saytın üzü yoxdur.** Saytın göstərə biləcəyi **yalnız** budur: **şeylərin məkanda hərəkəti.**

Yəni Guadagnino-nun ikinci yarısı — *"the way their bodies moved in space"* —
**saytın yeganə ifadə vasitəsidir.** Bu, məhdudiyyət kimi görünür, amma əslində
**filmin öz metodunun tam mərkəzidir.** Ona görə sayt filmi **təqlid etmir** —
filmin **ikinci yarısını** davam etdirir.

> **Nəticə:** saytda hər hərəkət **məkanda bədən hərəkəti** kimi oxunmalıdır —
> gəlmə, uzanma, geri çəkilmə, dönmə. Dekorativ animasiya deyil.

### 6.4 Aktyorların öz sözləri — gözlənilməzlik

| Sitat | Nə deyir |
|---|---|
| **Chalamet** (son kadr): *"There were **three takes** … all wildly different. I'm so happy with the one Luca went with because it seems to me to be the **most truthful** one."* | Doğru olan **planlanmış** deyil |
| **Hammer**: *"there's **uncertainty**, there's that unknown, there's all those things that you're figuring out as you go."* | Ehtiras = **bilməmək** |
| **Stuhlbarg** (Timothée haqqında): *"He was **different every time** he did things. You never knew what was going to happen."* | Təkrarsızlıq **keyfiyyətdir** |

> **Tətbiq:** saytın interaksiyaları **hər dəfə eyni olmamalıdır.** Bir qılçanın əyilməsi,
> bir ləkənin yeri, bir gecikmənin uzunluğu — kiçik təsadüfilik. Seyrçi ikinci dəfə
> baxanda **eyni şeyi görməməlidir.** Bu, *"three takes"*-in sayt qarşılığıdır.

---

## 7. CMBYN × Merlí — eyni metod, iki ifadə

Bu, saytın **dizayn qanunudur** və heç yerdə yazılmamışdı.

| | **Merlí. Sapere Aude** | **Call Me By Your Name** |
|---|---|---|
| **Məhdudiyyət növü** | **Ziddiyyət cütləri** | **Tək linza** |
| **Cihaz** | *"analog və rəqəmsal, klassik və müasir, nəzəri və emosional, işıq və qaranlıq"* — hər kadrda **ikisi birdən** | bir linza, bir stok, bir kolorist |
| **Titrdan gələn** | `Merlí.` (qısa, nöqtəli) **+** `Sapere Aude` (latın, böyük) — klassik↔müasir **titrın öz içində** | Chen Li əl yazısı ↔ mexaniki billing block |
| **Mənası** | *"Dare to know"* — mentorun yolunu davam etdirmək | *"Is it better to speak or to die?"* — danışmaq cəsarəti |
| **Ortaq kök** | **Hər ikisi eyni şeyi deyir: danışmaq cəsarətdir.** | |

### 7.1 Ortaq qanun

> **Hər ikisi deyir: mediumu məhdudlaşdır — sonra məna özü çıxır.**
> Merlí bunu **ziddiyyət cütləri** ilə edir (hər kadrda ikisi birgə),
> CMBYN bunu **tək alət** ilə edir (bir linza, sona qədər).

**Sayt hər ikisini işlədir:**

| Cihaz | Hansı tərəfdən | Saytda harada |
|---|---|---|
| **Ziddiyyət cütləri** | Merlí | `Marble` (ağ) ↔ `Hero` (qara) · sans (Inter) ↔ serif (Cormorant) · əl yazısı ↔ mono · soyuq ↔ isti |
| **Tək alət** | CMBYN | bir scroll oxu · bir yazıçı dəyişən · bir linza (Three.js yox) |

### 7.2 Titr quruluşunun tətbiqi

Merlí titrı **iki registr** işlədir: qısa + nöqtə, sonra uzun + böyük hərf.
Bu **birbaşa köçürülə bilər** — və köçürülməlidir, çünki saytın fəsıl başlıqları
artıq `eyebrow()` ilə nömrə + başlıq verir:

```
03 · The Berm          ← nömrə (qısa, texniki) — mono, kiçik, səssiz
The Berm               ← başlıq — serif, böyük, danışan
```

Bu, **təsadüfən** Merlí strukturudur. İndi **qəsdən** olmalıdır: nömrə registri
**mexaniki** (mono, sıx hərf aralığı), başlıq registri **emosional** (serif, geniş).
İkisi **həmişə birgə** — Merlí qaydası: hər kadrda ikisi birdən.

---

## 8. Tətbiq cədvəli — film faktı → sayt qərarı

| # | Film faktı | Sayt qərarı | Xərc | Prioritet |
|---|---|---|---|---|
| 1 | Tək linza fəlsəfəsi | `KONSEPT`-ə yaz: büdcə deyil, **metod**. Yeni effekt yalnız axını gücləndirirsə | 0 | **P0** |
| 2 | Seçici fokus | Hər fəsılda **bir** kəskin element; qalanı yumşaq | 0 KB CSS | **P0** |
| 3 | `Heptaméron` / `Armance` səhvi | `Berm.tsx` mənbəyini düzəlt | 0 | **P0** |
| 4 | Qüsur icazəsi | Qran **canlı** olsun — hər kadrda dəyişsin | ~0 | **P1** |
| 5 | *"movement of the heart … in space"* | Hər animasiya **bədən hərəkəti** kimi oxunsun — dekor yox | 0 | **P1** |
| 6 | *"three takes, all different"* | Kiçik təsadüfilik: qılça, ləkə, gecikmə hər dəfə başqa | ~0 | **P1** |
| 7 | Sükut (musiqi yox) | `07 The Quiet` **tam sükut** olsun — sıfır hərəkət | 0 | **P1** |
| 8 | Merlí titr quruluşu | Nömrə = mono/mexaniki · başlıq = serif/emosional, həmişə birgə | ~0 | **P1** |
| 9 | Mühit səsi | Açılıb-söndürülən səs qatı (külək, su) — **avtomatik yox** | ~2 KB | **P2** |
| 10 | Merlí ziddiyyət cütləri | Yeni fəsıl əlavə edəndə cütü yoxla | 0 | **P2** |

---

## 9. Nə tapılmadı — dürüst boşluqlar

| Sual | Status |
|---|---|
| Filmin **rəsmi hex palitrası** | **Yoxdur** — kolorist sənədi yayımlanmayıb. `KONSEPT §2.3`-dəki dəyərlər **ölçülmüş** kadrlardandır, rəsmi deyil |
| Başlıq **şrifti** | **Yoxdur** — Chen Li əl ilə yazıb (`KONSEPT §2.1`) |
| Titr animasiyasının **dəqiq vaxtı** | tapılmadı |
| **Rəsmi** səs dizaynı sənədi | tapılmadı — yalnız *"ambient gücləndirildi"* təsviri var |
| Fasano-nun **dəqiq kadr uzunluqları** | tapılmadı — *"holding shots"* prinsipdir, rəqəm yox |
| **Merlí** titr şriftinin adı | tapılmadı — studio (The Others) ad çəkmir → `04 §3.1` |
| İki serial arasında **rəsmi əlaqə** | Yalnız: eyni yaradıcı (**Héctor Lozano**), spin-off. Ortaq **dizayn sənədi yoxdur** |

---

## 10. Mənbələr

| Mənbə | Nə üçün |
|---|---|
| `emanuellevy.com/review/call-me-by-your-name-eroticism-on-screen` | Guadagnino + aktyorların sitatları: tək linza, *"movement of the heart"*, *"distance of time"*, *"three takes"* |
| `cined.com/?p=79207` | Mukdeeprom-un öz sözləri: *"tie my hand"*, *"struggle inside your idea"*, *"human eye"* |
| `grokipedia.com/page/Call_Me_by_Your_Name_(film)` | Fasano-nun montaj metodu, kolorist, işıq sızmaları, səs dizaynı |
| `en.wikiquote.org/wiki/Call_Me_By_Your_Name_(film)` | *Heptaméron* səhnəsi, sözü-sözünə |
| `telefonorojo.mx/why-sayombhu-mukdeeprom-…` | *"manufacture summer"* — yağış, Fresnel, gizli mühəndislik |
| `gandbmagazine.com/article/2018/03/cmbyn-review` | Seçici fokus: *"casually makes certain suggestions"* |
| `04-merli-sapere-aude.md` | Merlí tərəfi — dörd ox cədvəli, *"Dare to know"* |
| `KONSEPT.md §2` | Texniki faktlar (stok, linza, palitra) — **təkrarlanmır** |

---

**Növbəti:** `07-uiux-hekaye-interaktivlik.md` — hekaye oxu, interaktivlik,
mobil "low" qat, və saytın **sakitliyi** (`--ease-out` diaqnozu).
