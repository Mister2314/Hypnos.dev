# 07 — Hekaye oxu, interaktivlik, «low» qat və saytın sakitliyi

> **Sorğu (Xəyal, 26 sentyabr):**
> *"ui ux olaraq da umumi sayt ve saytdaki bu hekaye axisini ve nece interaktiv etmek olar onu arasdir."*
> *"sayt biraz sakitdi beziyerlerde ve men daha hereketli ve hiperaktiv olmasini isteyirem cunki men hiperaktiv insanam."*
> *"komputer ucun daha interaktiv … ve mobile bunun daha bir qeder low hali … amma onun qrafikinin ve
> template in o mukemelliyin olmesi menasina gelmri, daha qeseng birsey olsun. yeni her iki curde de mukemmel."*
>
> **Üç sual, üç cavab:** hekaye oxu (§1–2) · sakitlik diaqnozu (§3–4) · iki qat: masaüstü/mobil (§5–6).
> Sonda tətbiq planı (§7).

---

## 1. Hekaye oxu — 14 fəsıl, ölçülmüş temp

Hekaye `WORLDS[]` (`src/lib/scroll.ts`) ilə idarə olunur — 14 dünya, bir scroll oxu.
Hər fəslin ekranda qalma müddəti CSS `min-height` ilə verilir
(`position: sticky`, GSAP `pin` deyil).

| # | Fəsıl | `min-height` | Nisbi uzunluq | Rolu |
|---|---|---|---|---|
| — | **Overture** | 100svh | ▓ | Qapı |
| 01 | Summer | — | ▓▓ | İstiqamət |
| 02 | **The Hands** | **340svh** | ▓▓▓▓▓▓▓ | Toxunma |
| 03 | **The Berm** | **260svh** | ▓▓▓▓▓ | Yer |
| 04 | Sapere aude | — | ▓▓▓ | Cəsarət |
| 05 | **Speak or die** | **260svh** | ▓▓▓▓▓ | Sual |
| 06 | **The Orchard** | **380svh** | ▓▓▓▓▓▓▓▓ | Ən uzun |
| 07 | **The Quiet** | **210svh** | ▓▓▓▓ | Sükut |
| 08 | **Worlds** | **150svh** | ▓▓▓ | Ən qısa |
| 09 | **Marble** | **320svh** | ▓▓▓▓▓▓ | Dönüş |
| 10–13 | Work · Questions · Contact · Signature | — | ▓▓–▓▓▓ | Yekun |

### 1.1 Ölçülmüş problem — **`03` və `05` eyni uzunluqdadır**

```
03 The Berm      min-height: 260svh
05 Speak or die  min-height: 260svh      ← EYNİ
```

`08-berm-grass-tekrar.md`-də sübut etdim ki, bu iki fəsıl **eyni cümləni** deyir.
İndi ikinci sübut: **eyni müddət** də ekranda qalır.

Yəni oxucunun təcrübəsi belədir:

> **sitat → ara → eyni sitat**, hər ikisi **eyni uzunluqda**.

Bu, təkrar hissinin **iki** səbəbidir: söz eynidir **və** vaxt eynidir. Biri düzəlsə,
digəri qalır. **İkisi də düzəlməlidir.**

**Qərar:** `03` → **`190svh`** (qısa, keçid), `05` → **`320svh`** (uzun, mərkəz).
Fərq **1.7×** olur və təkrar yox olur — çünki oxucu birini **keçir**, o birində **dayanır**.

---

## 2. Hekaye oxu — struktur düzgündür, temp düzdür, **kontrast yoxdur**

Fəsıl sırası professionaldır:

| Mərhələ | Fəsıllar | İşi |
|---|---|---|
| **Açılış** | Overture → 01 → 02 | Dünyanı tanıt |
| **Yüksəliş** | 03 → 04 → 05 | Gərginlik qur |
| **Zirvə** | 06 The Orchard | Ən uzun, ən çox qarşılıqlı |
| **Düşüş** | 07 The Quiet | **Sükut** — film də belə edir |
| **Dönüş** | 08 → 09 Marble | Ağ işıq — ton dəyişir |
| **Yekun** | 10 → 13 | Geri dönüş |

Bu, **düzgün dramaturgiyadır.** Problem quruluşda deyil — **§3**-dədir.

---

## 3. Sakitlik diaqnozu — **ölçülmüş**, hiss deyil

Şikayət: *"sayt biraz sakitdi beziyerlerde."* Ölçdüm.

### 3.1 Bütün saytda **bir** easing əyrisi var

```css
/* src/styles/global.css:37 */
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
```

Bu, **təmiz yavaşlama** əyrisidir: sürətli başlayır, sona doğru **yumşaq dayanır**.
Özü pisdir deyil — CMBYN üçün **doğru** əyridir. Problem: **başqa əyri yoxdur.**

**Nəticə:** saytda hər hərəkət **eyni şəkildə** dayanır. Göz öyrəşir. Hərəkət
*"olur"*, amma *"danışmır"* — çünki hamısı eyni ahəngdədir. Bu, **vizual monotoniya**dır.

### 3.2 Müddətlər bir yerdə yığılıb

`src/styles/*.css` + `src/sections/*.tsx` içindəki bütün müddətlər:

| Müddət | Say | Nə üçün |
|---|---|---|
| 0.35s | **13** | ← ən çox |
| 0.5s | 4 | |
| 0.4s | 4 | |
| 0.3s | 3 | |
| 0.2s | 2 | |
| 0.9s | 2 | |
| 1.4s | 3 | |
| 3s · 6s · 9s · 11s | 1+1+1+1 | uzun mühit hərəkətləri |

**Oxu:** **26 hərəkətin 22-si 0.2–0.5 saniyə arasındadır.** Yəni ön plandaki hər şey
**eyni sürətdə** hərəkət edir. Uzun olanlar (3–11s) isə **fon** hərəkətləridir —
onları göz saymır.

**Nəticə:** ön planda **tək sürət** var. Sayt *"sakit"* deyil — **hamar**dır.
Hamar və sakit fərqli şeylərdir, amma göz ikisini qarışdırır.

### 3.3 Nə yoxdur

| Yoxdur | Nə üçün lazımdır |
|---|---|
| **Overshoot** (hədəfi keçib geri qayıtma) | *"canlı"* hissi verir — yay, tullanma |
| **Anticipation** (əvvəlcə geri, sonra irəli) | *"güc yığma"* — bədən hərəkətinin qrammatikası |
| **Snap** (sürətli girib bərk oturma) | *"cavab"* hissi — sayt reaksiya verir |
| **Gecikmə müxtəlifliyi** | Bərabər stagger **mexaniki** oxunur |
| **Boş vəziyyətdə hərəkət** | Scroll etməyəndə sayt **tam dayanır** |
| **Yarıda kəsmə** | Hərəkət başlayıb bitməlidir; iştirakçı ona mane ola bilmir |

> **Ən vacib sətir:** scroll etmirsənsə, **heç nə tərpənmir.** Hiperaktiv insan üçün bu,
> ölü ekrandır. Film kadrı həmişə tərpənir — qran, işıq, yarpaq. Saytın **boş vəziyyəti yoxdur.**

---

## 4. Düzəliş — **səs artırmaq yox, məsafə açmaq**

> ⚠️ **Bu, sorğuya qarşı dürüst bir etirazdır. Səbəbini yazıram.**

Sən *"daha hərəkətli, hiperaktiv"* istədin. Ən asan cavab: **hər şeyi sürətləndir.**
Bu, **yanlış** olar — və səbəbi var:

Sayt **sakit görünmür**, çünki hərəkət azdır. Sakit görünür, çünki **hamısı eyni səviyyədədir.**
Hər şey 4/10-dadır. 4/10-u 7/10 etsən — **yenə hamar qalır**, üstəlik film itir.

**Düzgün həll: məsafəni aç.** Zirvəni 9/10, dərəni 2/10 et. Orta dəyişməz,
amma sayt **canlı** oxunar — çünki kontrast yaranır.

Bu, sənin öz seçdiyin iki mənbədən **birbaşa** gəlir:

> **Merlí. Sapere Aude** titr studiyası (The Others): *"visuals that merged contrasting elements:
> analog and digital media, classic and contemporary styles, theoretical and emotional aspects,
> **light and darkness**."* → **hər kadrda ikisi birdən** (`04 §3`).
>
> **CMBYN** montajçısı Walter Fasano: *"holding shots to sustain emotional progression"* —
> uzun kadr **gərginlik** yaradır, çünki yanında **qısa** kadr var (`05 §2`).

**Qayda: hər fəsılda bir sükut, bir partlayış.** İkisi birgə — Merlí qaydası.
Yalnız partlayış = səs-küy. Yalnız sükut = ölü.

### 4.1 Nə edilir — konkret

| # | Nə | Nə üçün | Xərc |
|---|---|---|---|
| 1 | **İki yeni easing ailəsi** | Hərəkət lüğəti bir sözdən üç sözə çıxır | 0 KB — CSS |
| 2 | **Müddət kontrastı** | 0.12s (snap) + 0.9s (oturma) tierləri | 0 KB |
| 3 | **Boş vəziyyət hərəkəti** | Scroll etməyəndə sayt tərpənsin | ~10 sətir JS |
| 4 | **Qeyri-bərabər stagger** | Mexaniki görünüşü silir | ~0 |
| 5 | **Pointer cavabı** | Sayt **toxunulur**, baxılmır | ~15 sətir |
| 6 | **`07 The Quiet` — tam sükut** | Kontrast yaratmaq üçün dərən lazımdır | **silinir** |
| 7 | **`03` qısaldılır** | §1.1 təkrar diaqnozu | CSS |

### 4.2 Yeni hərəkət lüğəti

```css
/* Üç ailə — hər birinin işi var, hamısı bir yerdə işlədilmir. */
--ease-snap:  cubic-bezier(0.20, 0, 0, 1);      /* cavab: sürətli girir, bərk oturur  */
--ease-out:   cubic-bezier(0.22, 1, 0.36, 1);   /* mühit: yumşaq dayanır (mövcud)     */
--ease-over:  cubic-bezier(0.34, 1.56, 0.64, 1); /* canlı: hədəfi keçib qayıdır       */
```

| Hansı | Nə vaxt | Nümunə |
|---|---|---|
| `--ease-snap` | Sayt **reaksiya verəndə** — klik, pointer, fəsıl keçidi | Şaftalı düşəndə, ot açılanda |
| `--ease-out` | **Mühit** — uzun, sakit, fon | İşıq, qran, halo (dəyişmir) |
| `--ease-over` | **Canlı** — kiçik element, diqqət çəkən | Söz vurğusu, xətt çəkilməsi, ikon |

**Müddət kontrastı** — sürətdən vacibdir:

| Tier | Müddət | Nə üçün |
|---|---|---|
| **snap** | **0.12s** | Barmaq/düymə cavabı. Yoxdursa, sayt *"gecikmiş"* oxunur |
| **normal** | 0.35s | Mövcud (qalır) |
| **settle** | **0.9s** | Ağır şeyin oturması — kütlə hissi |

**Qayda:** bir jestdə **iki** fərqli tier işlət (məs. snap + settle).
Tək tier = mexaniki. İki tier = canlı.

---

## 5. İki qat — masaüstü **yüksək**, mobil **aşağı**

> **Sənin sözün:** *"komputer ucun daha interaktiv ve qaldira bileceyi gucde birsey,
> mobile bunun bir az low hali … amma template in o mukemmeliyin olmesi menasina gelmesin.
> her iki curde de mukemmel."*

**Bu, oyun dünyasında adı olan bir problemdir** və həlli də var: **adaptive quality.**
Mənbə: `vgpu.sh/docs/guides/adaptive-quality` (2026).

### 5.1 Əsas prinsip — **sənin tələbinin texniki qarşılığı**

> *"Low must be a **genuinely cheaper pipeline, not just a lower resolution**."*

**Bu cümlə sənin tələbini tərsinə tərcümə edir:** mobil *"kiçik ekran"* demək deyil —
**başqa boru kəməri** deməkdir. Sadəcə ölçü kiçiltmək **həqiqi** aşağı qat deyil.

Və **template niyə ölmür** — cavab budur:

| Template **nədir** | Template **nə deyil** |
|---|---|
| Tipoqrafiya (Cormorant · Inter · Italianno) | Shader addımları |
| Palitra (14 dünya, `bg`/`text`/`accent`) | Hissəcik sayı |
| Layout (grid, spacing, ritm) | DPR |
| Hekaye (14 fəsıl, sıra, mətn) | Blur keçidləri |
| Temp (scroll büdcəsi, easing) | Qran ölçüsü |

**Yuxarı sütun pulsuzdur.** Aşağı sütun bahalıdır.
Yəni: **aşağı qat tipografiyanı, palitranı, hekayəni, tempi saxlayır — yalnız GPU işini azaldır.**
Ona görə template ölmür: **template GPU-da deyil.**

### 5.2 Konkret qat cədvəli

| Element | **Yüksək** (masaüstü) | **Aşağı** (mobil/zəif) | Gözlə görünür? |
|---|---|---|---|
| **Şriftlər** | Cormorant · Inter · Italianno | **eyni** | ❌ yox |
| **Palitra** | 14 dünya | **eyni** | ❌ yox |
| **Layout** | tam | **eyni** | ❌ yox |
| **Mətn** | tam | **eyni** | ❌ yox |
| **Scroll büdcəsi** | tam | **eyni** | ❌ yox |
| Ot qılçaları | 4 000 | 900 | ⚠️ az |
| Ot küləyi | 2 oktava | 1 oktava | ⚠️ az |
| Gölmə dalğası | 5 oktava | 3 oktava | ⚠️ az |
| DPR | `min(dpr, 2)` | **`1`** | ⚠️ az |
| Hissəcik (toz) | 500 | 120 | ⚠️ az |
| Qran | canlı, hər kadr | **statik** | ❌ yox |
| Blur keçidləri | var | yox | ⚠️ az |

**"⚠️ az" nə deməkdir:** eyni **dizayn**, az **sıxlıq**. Yan-yana qoymasan,
fərqi görmək mümkün deyil. Ot 4 000, ya 900 qılça ilə — **eyni ot**dur.

### 5.3 Siqnallar — nə vaxt aşağı qata keçilir

**Qayda: yüksəkdən başla, yalnız bir dəfə aşağı düş, heç vaxt özü yuxarı qalxma.**

| Sıra | Siqnal | Şərt | Qiymət |
|---|---|---|---|
| 1 | `navigator.hardwareConcurrency` | `≤ 4` | 0 |
| 2 | `navigator.deviceMemory` | `≤ 4` (GB) | 0 |
| 3 | `navigator.connection.saveData` | `true` | 0 |
| 4 | `navigator.getBattery()` | **boşaldır və ≤ 30%** | 0 — ⚠️ Safari/Firefox-da **yoxdur**, `if` ilə yoxla |
| 5 | **Kadr sağlamlığı** | təqdim olunan FPS hədəfin **80%-dən aşağı**, **2 saniyə** | 0 |

Mənbədən **birbaşa** götürülmüş 4 qayda:

> **1.** *"Signals are started **only after the first High frame has been presented**"* —
> yəni ilk ekran **heç nə ödəmir**.
> **2.** *"every signal is **advisory** (a failure keeps High)"* — siqnal xəta versə, **Yüksək qalır**.
> **3.** *"the only automatic transition is **High → Low, once**. Nothing ever upgrades on its
> own, so **there is no oscillation**."*
> **4.** *"Do not measure the raw `requestAnimationFrame` rate; measure **presented** frames
> against the target the workload actually has."* · *"Gaps over **250 ms** (hidden tab, idle)
> **reset** the window instead of counting as drops."*

**Niyə özü yuxarı qalxmır:** aşağı qat işə düşəndə FPS **dərhal yaxşılaşır** —
bu, avtomatik yuxarı qalxmağa səbəb olar və sayt **iki qat arasında yellənər**.
Ona görə: **yalnız istifadəçi geri qaldıra bilər.**

### 5.4 Görünən olsun

Mənbə: *"Expose `{ preference, effective, reason }` to the UI … Users can then see
**why** they got Low."*

**Tətbiq:** `13 Signature`-də kiçik bir sətir —

```
quality: high · auto
quality: low · battery          ← istifadəçi görür NİYƏ
[ high ] [ low ] [ auto ]       ← və istəsə dəyişir
```

Bu, sənin *"her iki curde de mukemmel"* tələbini **görünən** edir. İstifadəçi
*"mobilə pis versiya verdilər"* deməz — çünki **seçimi görür**.

### 5.5 Nə **edilmir** — anti-nümunələr

| ⛔ | Niyə |
|---|---|
| Avtomatik yuxarı qalxma | Yellənmə yaradır |
| `detect-gpu` paketi | **~15 KB gzip** — büdcəmiz 180 KB, buna dəyməz. Yuxarıdaki 5 siqnal pulsuzdur |
| `getBattery()`-i yoxlamadan çağırmaq | Safari/Firefox-da **xəta atır** |
| Xam `rAF` sürətini ölçmək | 120 Hz ekran **yalançı aşağı** verir |
| Səth özünü ölçsün | `devicePixelRatio`-nu hər kadr oxuyur və aşağı DPR-ı **üzərinə yazır** |
| Kəskinliyi də aşağı salmaq | **Template elə budur** — ölürsə, hər şey ölür |

---

## 6. İnteraktivlik — nə var, nə çatmır

### 6.1 İndi

| Növ | Harada |
|---|---|
| **Scroll-gedişli** | 14 fəsıl — `ScrollTrigger` |
| **Klik** | `06 The Orchard` — şaftalı dərmə |
| **Hover** | Düymələr, linklər |
| **Vaxt** | Fon animasiyaları (3–11s) |

### 6.2 Çatmır

| Növ | Nə edir | Xərc | Prioritet |
|---|---|---|---|
| **Pointer sürüşməsi** | Ot açılır, su dalğalanır — sayt **toxunulur** | ~15 sətir | **P0** |
| **Nəticə dəyişkənliyi** | *"three takes"* qaydası (`05 §6.4`) — hər dəfə bir az başqa | ~10 sətir | **P1** |
| **Boş vəziyyət** | Scroll yoxdursa da tərpənir | ~10 sətir | **P0** |
| **Yarıda kəsmə** | Hərəkət bitməmiş pointer dəyişsə, **yeni hədəfə keçir** | ~20 sətir | **P1** |
| **Sürüşdürmə (drag)** | Şaftalını **özün** dərmək — klik yox, dartmaq | ~40 sətir | **P2** |
| **Klaviatura** | Hər interaktiv element `Tab` ilə çatılsın | ~0 | **P0** |

> **P0 səbəbi:** `Pointer sürüşməsi` və `Boş vəziyyət` — bu ikisi **birgə** saytın
> *"ölü ekran"* problemini həll edir və **§4**-ün mərkəzidir.
> `Klaviatura` — interaktivlik artıranda əlçatanlıq **məcburi** olur, sonra yox.

---

## 7. Tətbiq planı — prioritetlə

| # | İş | Fayl | Xərc | Prioritet |
|---|---|---|---|---|
| 1 | `03 The Berm` ↔ `05` təkrarını ayır | `Berm.tsx` · `site.ts` · CSS | 0 | **P0** |
| 2 | `Heptaméron` / `Armance` səhvini düzəlt | `Berm.tsx:106` · `site.ts:52` | 0 | **P0** |
| 3 | `03` büdcəsi `260svh → 190svh` · `05` → `320svh` | CSS | 0 | **P0** |
| 4 | Üç easing ailəsi + üç müddət tieri | `global.css` | 0 | **P0** |
| 5 | Boş vəziyyət hərəkəti | `global.css` + 1 komponent | ~10 sətir | **P0** |
| 6 | `06 The Orchard` — ağacı gölmə ilə əvəz et | `TheOrchard.tsx` · `tree.ts` silinir | **−13.5 KB** | **P0** |
| 7 | `03 The Berm` — küləkli ot | `Berm.tsx` + yeni `grass.ts` | ~1.5 KB | **P0** |
| 8 | Pointer sürüşməsi (ot + su) | hər iki shader | ~15 sətir | **P0** |
| 9 | İki qat: siqnallar + `tierDpr` + görünən nəzarət | yeni `quality.ts` | ~2 KB | **P1** |
| 10 | `12 Contact` — sağ tərəf doldurulur | `Contact.tsx` | ~3 KB | **P1** |
| 11 | Nəticə dəyişkənliyi | ot + su shader | ~10 sətir | **P1** |
| 12 | `07 The Quiet` — həqiqi sükut | CSS | **−** | **P1** |
| 13 | Klaviatura keçidi | komponentlər | 0 | **P1** |
| 14 | Mühit səsi (açılıb-söndürülən) | yeni | ~2 KB | **P2** |

**Büdcə yekunu:** `tree.ts` silinir (**−13.5 KB**), əlavə olunur ~6.5 KB →
**xalis −7 KB**. JS həddi `135.79 → ~129 KB` (limit 180). **Yer var.**

---

## 8. Dürüst boşluqlar

| Sual | Status |
|---|---|
| Scroll uzunluğunun **oxucu diqqətinə** təsiri — ölçülmüş tədqiqat | tapılmadı — yalnız prinsip səviyyəsində mənbələr var |
| `deviceMemory` **real dəqiqliyi** | ⚠️ Chrome yuvarlaqlaşdırır (0.25/0.5/1/2/4/8) — **kobud** siqnaldır, tək başına qərar verməməlidir |
| Mobil GPU-larda **qılça həddi** | tapılmadı — öz cihazında ölçmək lazımdır (`diag.mjs` ilə) |
| *"three takes"* prinsipinin **ölçülə bilən** effekti | yoxdur — dizayn qərarıdır, metriki yox |
| Saytın **hansı fəsli** istifadəçini ən çox itirir | **ölçülməyib** — analitika yoxdur. Əlavə olunmalıdır (P2) |

---

## 9. Mənbələr

| Mənbə | Nə üçün |
|---|---|
| `vgpu.sh/docs/guides/adaptive-quality` | İki qat modeli: siqnallar, `tierDpr`, "High → Low, once", anti-nümunələr |
| `github.com/vaitko/awesome-immersive-storytelling` | Scrollytelling kitabxanaları, temp mənbələri (NYT Snowfall, SBS The Boat) |
| `reallygooddesigns.com/scrollytelling-website-examples` | Hekaye oxu nümunələri |
| `developer.mozilla.org/…/@media/prefers-reduced-motion` | Hərəkət azaltma — məcburi əlçatanlıq qatı |
| `threejsresources.com/guides/grass` | Ot sıxlığı ↔ performans əlaqəsi (qat cədvəlinin §5.2 əsası) |
| `05-cmbyn-dizayn-dili.md §2` | Fasano: *"holding shots"* — kontrast prinsipi |
| `04-merli-sapere-aude.md §3` | The Others: *"light and darkness"* — hər kadrda ikisi |
| `src/lib/scroll.ts` · `src/styles/global.css` | **Öz kodumuz** — temp və hərəkət ölçmələri |

---

**Növbəti addım:** üç fayl hazırdır (`05`, `07`, `08`). İndi **`SYNTHESIS.md`-ə yekun vurmaq** →
sonra `src/`-ə toxunmaq. Sıra: **P0 #1–3** (təkrar + fakt səhvi, sıfır xərc) →
**P0 #4–5** (hərəkət lüğəti) → **P0 #6–7** (gölmə + ot) → **P1**.
