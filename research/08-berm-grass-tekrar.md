# 08 — Berm ↔ Speak or die: təkrar diaqnozu və otun yenidən dizaynı

> **Sorğu (Xəyal, 26 sentyabr):** *"gedisati tam qur bu grass olanla is it better speak or to ide
> sanki bir birini tekrarlayir… grass yerinin dizaynini daha basqa cur et amma nece ede bilersen
> bilmirem sen arasdir get web-i axtar ve mene en mukemmel professional neticelerle gel."*
>
> **Nəticə: hiss düz idi.** İki fəsıl eyni cümləni iki dəfə deyir — və üstəlik mənbə səhv yazılıb.
> Aşağıda üçü də: **diaqnoz · düzgün faktlar · yeni dizayn.**

---

## 1. Diaqnoz — kod danışır, təxmin yox

Şikayət *"mənə elə gəlir"* idi. Yoxladım — təxmin deyil, **faktdır.**

| Fəsıl | Ekranda yazı | Mənbə | Fayl |
|---|---|---|---|
| **03 The Berm** | `"On the grass there is one rule: speak, or die a little."` | `The Berm · the rule from Stendhal's Armance` | `Berm.tsx:93`, `:106` |
| **05 Speak or die** | `"Is it better to speak or to die?"` | `Call Me By Your Name` | `SpeakOrDie.tsx:101-116`, `site.ts:52-56` |

**İki fəsıl arasındaki məsafə:** bir cümlə. Biri onu yumşaq deyir (`speak, or die a little`),
digəri düz deyir (`Is it better to speak or to die?`). Oxucu üçün bu, **təkrar** görünür —
çünki elədir. Söz eynidir, yalnız qablaşdırma dəyişib.

### 1.1 Üstəgəl — mənbə səhvi (canlı saytda)

`Berm.tsx` deyir: *"the rule from **Stendhal's Armance**"*.

**Bu yanlışdır.** Filmdə həmin sətir **The Heptaméron**-dan oxunur —
**Marguerite de Navarre** (1558), Stendhal yox. Stendhal 1783-cü ildə doğulub,
yəni *Heptaméron* ondan **225 il əvvəl** yazılıb. Wikiquote filmi sözü-sözünə belə verir:

> **Annella Perlman**: *[Reading from **The Heptaméron**]* A handsome young knight is madly in
> love with a princess, and she too is in love with him, though she seems not to be entirely
> aware of it. Despite the friendship that blossoms between them, or perhaps because of that
> very friendship, the young knight finds himself so humbled and speechless that he is totally
> unable to bring up the subject of his love — until one day he asks the princess point-blank:
> **Is it better to speak or to die?**
>
> **Elio**: I'll never have the courage to ask a question like that.
>
> **Mr. Perlman**: I doubt that. Hey, Elly-Belly. You do know that you can always talk to us?

Mənbə: `en.wikiquote.org/wiki/Call_Me_By_Your_Name_(film)` → **Dialogue** bölməsi.
Filmin öz epiqrafı da bu sətirdir: *"Is it better to speak or die?"*

> **Niyə bu vacibdir:** saytın özü `KONSEPT.md`-də deyir ki, *sitat sözü-sözünə olmalıdır*.
> Burada sitat düzdür — **mənbə** səhvdir. Bu, sitat səhvi qədər bahalıdır, çünki
> oxuyan inanır və özü də yanlış öyrənir.

---

## 2. Düzgün faktlar — filmin içinə baxanda üç ayrı səhnə çıxır

Sayt üç fərqli səhnəni **iki** fəsıla sıxmışdı. Ona görə hər ikisi eyni şeyi demək məcburiyyətində qaldı.
Ayrılıq budur:

### Səhnə A — **ana oxuyur** (sualın doğulduğu yer)

| Nə | Dəyər |
|---|---|
| **Harada** | evin içi, axşam — ot yox, çöl yox |
| **Kim** | **Annella** (ana) oxuyur, **Elio**-nun başını sığallayaraq |
| **Mənbə** | *The Heptaméron* — Marguerite de Navarre, 1558 |
| **Mətn** | cəngavər + şahzadə; cəngavər danışa bilmir; *"Is it better to speak or to die?"* |
| **Elio-nun cavabı** | **"I'll never have the courage to ask a question like that."** |
| **Ata** | *"I doubt that. … You do know that you can always talk to us?"* |
| **Nə deməkdir** | sual **Elio-nun deyil** — ona **verilib**. Kitabdan gəlir. Uşaq onu hələ özünə aid etmir |

### Səhnə B — **Elio hovuzda təkrarlayır** (sualın şəxsi olduğu yer)

| Nə | Dəyər |
|---|---|
| **Harada** | hovuz kənarı, günorta, açıq hava |
| **Kim** | **Elio → Oliver** — sualı özü verir |
| **Nə edir** | oxuduğu hekayəni **öz münasibətinə** çevirir, bilmədən |
| **Nə deməkdir** | sual artıq **onun**dur. Elə bu an saytdaki sual canlanır |

Mənbə: `libbygriffiths.substack.com/p/is-it-better-to-speak-or-to-die` —
*"elio first hears … when his mother reads to him a translation from 'Heptaméron' …
later in the movie, elio revisits the meaning of the question with oliver by the poolside,
and unknowingly, speaks the question into the fate of their own relationship."*

### Səhnə C — **Monet's berm** (yer — sual deyil, məkan)

Bu, romandan gəlir, filmdə ot təpəsi kimi görünür:

| Nə | Dəyər |
|---|---|
| **Fiziki** | **Monet-nin rəsm çəkməyə getdiyi qayalıq**; kiçik meşə yolu ilə enilir; **kölgəli, tənha təpəcik** |
| **Kim deyir** | Elio: **"This is my spot."** — oxumaq üçün öz yeri |
| **Söhbət** | Oliver: *"Do you like being alone?"* → *"Us, you mean."* → **ilk öpüş** |
| **Oliver-in xətti** | *"We can't do this — I know myself. … I want to be good."* |
| **Elio-nun daxili** | *"I needed to test the test."* |
| **Nə deməkdir** | **məkan** — giriş, eniş, tənhalıq, gizlin yer. Sual yox |

Mənbə: `litcharts.com/lit/call-me-by-your-name/part-2-monet-s-berm` ·
`supersummary.com/call-me-by-your-name/part-2-pages-66-117-summary`

---

## 3. Düzəliş — ayrılıq **mövzu ilə deyil, funksiya ilə**

Səhv harada idi: iki fəsıl **eyni mövzunu** paylaşırdı (sual). Düzəliş: hər fəsıl **başqa iş** görsün.

| Fəsıl | **İşi** | Rejistr (hiss) | Sitat |
|---|---|---|---|
| **03 The Berm** | **YER** — ora necə çatırsan | ot · külək · ləkəli kölgə · eniş · tənhalıq | **YOX** |
| **05 Speak or die** | **SUAL** — sual hardan gəldi və nə oldu | kağız · səs · başda əl → su · əks · üz-üzə | **YALNIZ burada** |

**Qayda:** *sual yalnız bir fəsılda yaşayır.* Berm onu **demir** — Berm onu **gözləyir**.
Oxucu Berm-də oturur, Speak-də sualı eşidir. Təkrar yox olur, çünki **iki fərqli şey** olur.

### 3.1 Nə dəyişir — konkret

| Fayl | Əvvəl | Sonra |
|---|---|---|
| `Berm.tsx` sətri | `"On the grass there is one rule: speak, or die a little."` | yerdən danışan sətir — məs. `"There is a path down here. Almost nobody takes it."` |
| `Berm.tsx` başlığı | `"The Berm · the rule from Stendhal's Armance"` | `"The Berm · a knoll off the road, south of the villa"` — **sitat yox** |
| `SpeakOrDie.tsx` mənbəyi | `"Call Me By Your Name"` | `"The Heptaméron — read aloud, evening"` |
| `SpeakOrDie.tsx` yeni qat | — | Elio-nun **"I'll never have the courage to ask a question like that."** sətri |
| `site.ts` → `SPEAK.source` | `'Call Me By Your Name'` | `'The Heptaméron · Marguerite de Navarre, 1558'` |

> **Qeyd:** `"speak, or die a little"` gözəl sətirdir — **atmaq lazım deyil**.
> Onu `05`-ə köçürmək olar, ya da `16 Bəyəndiyim sözlər`-ə. Sadəcə **iki yerdə olmamalıdır**.

---

## 4. Otun yeni dizaynı — texniki araşdırma

### 4.1 İndi nə var

`Berm.tsx` üç qat işlədir: `.berm__slats` (işıq zolaqları sürüşür), `.berm__sun`,
`.berm__mound` (far/mid/near). Yəni ot **CSS ilə çəkilmiş statik formalardır**,
üstündən zolaqlar keçir. Hərəkət **üfüqi və mexaniki**dir — pərdə kimi.

**Niyə işləmir:** ot canlıdır, çünki **hər qılça öz vaxtında əyilir**. Zolaq isə
tək bir kütlə kimi sürüşür. Göz fərqi tutur, dilə gətirə bilmir — ona görə
*"neyse tam oturmur"* hissi yaranır.

### 4.2 Standart sənaye texnikası — və niyə bizə uyğundur

WebGL-də ot **həmişə** eyni üsulla çəkilir
(mənbə: `threejsresources.com/guides/grass`, sentyabr 2026):

1. **Bir qılça həndəsəsi** — bir neçə üçbucaq, az vertex.
2. **Minlərlə nüsxə, bir draw call** — `InstancedMesh` (Three.js-də).
3. **Külək vertex shader-də** — qılçanın **yalnız yuxarı** vertex-ləri tərpənir;
   aşağısı kökdə qalır. Sürüşən noise/sine, **dünya koordinatı + vaxt** ilə.
4. **Sıxlıq həndəsə ilə deyil, say ilə** — *"If a field looks sparse, raise the
   instance count before you reach for more detailed blade geometry."*

**Ən vacib cümlə** — bu, bütün effekti izah edir:

> *"Drive the displacement with a low-frequency sine or simplex noise sampled from
> **world-space XZ plus time**, so neighbouring blades sway together in waves rather
> than independently. **That coherence is what makes it read as wind rather than noise.**"*
>
> *"**Two octaves** (a slow broad sway plus a faster small flutter) reads far more
> convincing than one."*

Yəni: **külək dalğadır, təsadüf deyil.** Qonşu qılçalar birlikdə əyilir. İki oktava —
biri yavaş və geniş, biri sürətli və kiçik. Bu iki cümlə bütün dizaynı həll edir.

### 4.3 Bizim şərtlərimiz — Three.js **yoxdur**

Layihə **əl ilə yazılmış WebGL1** işlədir (`src/lib/webgl.ts`, 131 sətir,
`WebGLRenderingContext`). Three.js yoxdur və **əlavə etmək olmaz** — JS büdcəsi
180 KB gzip, hazırda **135.79 KB**. Three.js təxminən +150 KB gətirər.

**Həll — instancing extension lazım deyil.** Bir statik VBO qurulur:

```
Hər qılça: 7 vertex (3 seqmentli zolaq) × 3 float atribut
  aPos  (vec2) — qılçanın lokal forması
  aRoot (vec2) — dünyada kök mövqeyi
  aY    (float) — 0..1, kökdən ucuna
```

| Ölçü | Dəyər |
|---|---|
| Qılça sayı | **2 500 – 4 000** (masaüstü) · 800–1 200 (mobil) |
| Vertex | 4 000 × 7 = **28 000** |
| Bufer | 28 000 × 4 float × 4 bayt ≈ **448 KB** — bir dəfə yüklənir |
| Draw call | **1** |
| VS işi | külək + əyilmə + bükülmə ≈ **35–45 sətir GLSL** |
| FS işi | düz rəng + zəif işıq ≈ **10 sətir** |
| CPU işi kadr başına | **sıfır** — hər şey GPU-da |

**Nəticə:** `tree.ts` (13.5 KB) silinəndə bu, **xalis büdcə azalmasıdır.**

### 4.4 İnteraktivlik — ot sənə yol verir

Əlavə (mənbə: `billthedev.com/lab/gpu-instancing-interactive-foliage`,
`penev.tech/labs/grass` — 200 000 qılça real vaxtda):

**Sürüşən bir "əzilmə mərkəzi"** — siçan/scroll mövqeyi `uPush` uniform kimi ötürülür.
Ona yaxın qılçalar yana açılır, sanki kimsə otun içindən keçir. Bu:

- **1 vec2 uniform** və **3 sətir GLSL** əlavə edir — yəni **demək olar pulsuzdur**
- Saytı **baxılan** yerdən **toxunulan** yerə çevirir
- CMBYN-in öz hərəkət dilinə uyğundur: Guadagnino *"register the movement of the heart
  … through the way their bodies moved in space"* deyir — yəni **bədən məkanda hərəkət edir**
  və kamera onu qeyd edir. Otun açılması **həmin cümlənin birbaşa tərcüməsidir**

### 4.5 İşıq — "dappled shade"

Berm-in faktiki təsviri (LitCharts): *"a **shady and secluded knoll**"*,
*"down a small **wooded** path"*. Yəni ot **açıq səma altında deyil** — ağac kölgəsindədir.

Vertex shader-də ucuz həll: **iki aşağı tezlikli noise** → qılçanın rəngi yamaqlı olur
(günəş ləkələri). Alternativ: ekran üzərində `mix()` ilə kölgə maskası.

> **Nə üçün bu, "daha başqa cür" deməkdir:** indiki dizayn **işığı** çəkir (zolaqlar, günəş).
> Yeni dizayn **otu** çəkir və işıq onun **üstünə düşür**. Fərq budur — obyekt dəyişir,
> dekor yox.

---

## 5. Qiymətləndirmə — üç variant

| Variant | Nə | Xərc | Risk | Hökm |
|---|---|---|---|---|
| **A — Küləkli ot** | statik VBO + VS külək + sürüşən əzilmə + ləkəli işıq | ~1.5 KB gzip · `tree.ts` silinir | aşağı — WebGL1, extension yox | ⭐ **tövsiyə** |
| **B — Yalnız CSS** | mövcud zolaqları iki qata bölüb qılça formaları əlavə et | 0 KB | aşağı | ehtiyat |
| **C — Raymarching** | SDF ilə tam 3D relyef | 3–4 KB | orta — mobil GPU | artıq |

**A niyə qazanır:** `06 The Orchard` üçün tövsiyə olunan **gölmə** da analitik
heightfield işlədir (`research/06`). İkisi **eyni riyaziyyatı** paylaşır —
bir `noise()` funksiyası, iki fəsıl. Yəni iki effekt **bir** effektin qiymətinə gəlir.

---

## 6. Nə tapılmadı — dürüst boşluqlar

| Sual | Status |
|---|---|
| Filmdə berm səhnəsinin **dəqiq kadr uzunluğu** | tapılmadı — vaxt kodu mənbəyi yoxdur |
| *Heptaméron*-un **hansı nəşri** filmdə görünür | tapılmadı — ekran mətni yoxdur |
| Berm-in **real koordinatı** (Villa Albergoni yaxınlığında) | tapılmadı — dəqiq yer qeyd olunmayıb |
| Annella səhnəsində **işıq rəngi** (hex) | tapılmadı — kadr analizi lazımdır |
| Filmdə **berm səhnəsi** ilə **ana oxuması** arasında **neçə dəqiqə** var | tapılmadı — montaj sənədi yoxdur |

---

## 7. Mənbələr

| Mənbə | Nə üçün |
|---|---|
| `en.wikiquote.org/wiki/Call_Me_By_Your_Name_(film)` | Annella-nın *Heptaméron*-dan oxuması, sözü-sözünə |
| `litcharts.com/lit/call-me-by-your-name/part-2-monet-s-berm` | Berm-in fiziki təsviri, "This is my spot", öpüş səhnəsi |
| `supersummary.com/…/part-2-pages-66-117-summary` | Berm-in təsviri: Monet, qayalıq, tənha təpəcik |
| `libbygriffiths.substack.com/p/is-it-better-to-speak-or-to-die` | Sualın iki səhnəsi: ana oxuyur → hovuzda təkrar |
| `threejsresources.com/guides/grass` | Ot texnikası: instancing, iki oktavalı külək, koherentlik qaydası |
| `billthedev.com/lab/gpu-instancing-interactive-foliage` | Bitkilərin hərəkətə reaksiyası |
| `penev.tech/labs/grass` | 200 000 qılça — real vaxtda instancing həddi |
| `emanuellevy.com/review/call-me-by-your-name-eroticism-on-screen` | Guadagnino: *"movement of the heart … bodies moved in space"* |
| `cined.com/?p=79207` | Tək 35mm linza, Mukdeeprom-un öz sözləri |

---

**Növbəti:** `05-cmbyn-dizayn-dili.md` (dizayn dili) → `07-uiux-hekaye-interaktivlik.md`
(hekaye oxu + interaktivlik + mobil "low" qat) → sonra qurma.
