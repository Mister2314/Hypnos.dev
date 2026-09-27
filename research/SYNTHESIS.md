# SİNTEZ — v5 genişlənmə planı

> **Tarix:** 26 sentyabr 2026 · **Mərhələ:** araşdırma bitdi → qurma başlayır
> **Əhatə:** 5 sorğu, 5 araşdırma faylı, 3 ölçülmüş diaqnoz, 1 prioritetli plan
> **Vəziyyət:** `v4.1` bərpa **bitdi və yoxlanıldı** (`QERARLAR.md §22–25`). Bu fayl **v5**-dir.

---

## 1. Nə soruşuldu — 5 tələb

| # | Söz | Nə deməkdir |
|---|---|---|
| 1 | *"bu agac modelini hec beyenmedim … internetden daha orijinal CMBYN terzine uygun model gotur"* | Ağac **dəyişir** |
| 2 | *"grass olanla is it better speak or to die sanki bir birini tekrarlayir"* | Təkrar **düzəlməlidir** |
| 3 | *"grass yerinin dizaynini daha basqa cur et"* | Berm **yenidən dizayn** |
| 4 | *"input var onun sagi bos qalir … komputer ucun daha interaktiv, mobile low hali, amma template olmesin"* | Contact + **iki qat** |
| 5 | *"sayt biraz sakitdi … men hiperaktiv insanam"* | Hərəkət **canlanmalıdır** |
| + | *"ta ki master olana qeder … arasdir"* | **Əvvəl araşdır** |

---

## 2. Araşdırma — 5 fayl, hamısı mənbəli

| Fayl | Mövzu | Ölçü |
|---|---|---|
| `04-merli-sapere-aude.md` | Merlí / Sapere Aude: titr studiyası, dörd ox dizayn dili, *"Dare to know"* | 11.3 KB |
| `05-cmbyn-dizayn-dili.md` | CMBYN: tək linza fəlsəfəsi, temp, fokus, qüsur icazəsi, **×Merlí sintezi** | 15.3 KB |
| `06-3d-model-variantlari.md` | Ağac əvəzinə 10 namizəd → **gölmə** (analitik su shader) | 15.7 KB |
| `07-uiux-hekaye-interaktivlik.md` | Hekaye oxu, sakitlik diaqnozu, **iki qat**, interaktivlik növləri | 18.1 KB |
| `08-berm-grass-tekrar.md` | Təkrar diaqnozu, *Heptaméron* səhvi, **küləkli ot** texnikası | 13.9 KB |

**Qeyd:** ilk cəhddə 5 paralel agentdən **4-ü** API limitinə görə öldü (429 ×3, 402 ×1).
Qalan tək fayl diskdə yoxlanıldı, sonra qalan **4 fayl birbaşa** `WebSearch`/`WebFetch`
ilə yazıldı. Nəticə eynidir — sadəcə seriya ilə.

---

## 3. Üç ölçülmüş diaqnoz — təxmin deyil, sübut

### ① Təkrar **vardır** — və iki səbəbi var

| Sübut | Nə tapıldı | Fayl |
|---|---|---|
| **Söz** | `03` deyir *"speak, or die a little"* · `05` deyir *"Is it better to speak or to die?"* | `Berm.tsx:93` · `SpeakOrDie.tsx:101` |
| **Vaxt** | Hər ikisi **`min-height: 260svh`** — eyni uzunluq | `global.css:751`, `:1548` |

Oxucu belə yaşayır: **sitat → ara → eyni sitat**, ikisi də **eyni müddət**.
Hiss düz idi. Təxmin deyil.

### ② Mənbə **səhvdir** — canlı saytda

`Berm.tsx:106` yazır: *"the rule from **Stendhal's Armance**"*.
Filmdə sətir **The Heptaméron**-dandır — **Marguerite de Navarre**, 1558.
Stendhal 1783-də doğulub, yəni *Heptaméron* ondan **225 il əvvəl**dir.
Mənbə: Wikiquote, film, Dialogue bölməsi — *"Annella Perlman: [Reading from **The Heptaméron**]…"*

### ③ Sayt **sakit deyil — hamardır**

| Ölçmə | Nəticə |
|---|---|
| Easing əyrisi sayı | **1** — `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` (`global.css:37`) |
| 0.2–0.5s arası hərəkət | **22 / 26** |
| Ən çox işlənən müddət | **0.35s** — 13 dəfə |
| Overshoot / anticipation / snap | **yoxdur** |
| Boş vəziyyətdə hərəkət | **yoxdur** — scroll etmirsənsə, heç nə tərpənmir |

**Nəticə:** ön planda **tək sürət, tək əyri** var. Göz öyrəşir → *"sakit"* oxunur.

---

## 4. Dizayn qanunu — iki serialdan çıxan ortaq qayda

> **Merlí. Sapere Aude** titr studiyası (The Others): *"contrasting elements: analog and digital
> media, classic and contemporary styles, theoretical and emotional aspects, **light and darkness**"*
> → **hər kadrda ikisi birdən** (`04 §3`).
>
> **CMBYN:** *"I gave myself the specific limit of one lens because I did not want technology to
> interfere with the emotional flow"* (Guadagnino) → **tək alət, sona qədər** (`05 §1`).

### Ortaq qanun

| | Merlí | CMBYN |
|---|---|---|
| **Məhdudiyyət** | Ziddiyyət cütləri | Tək linza |
| **Saytda** | `Marble` (ağ) ↔ `Hero` (qara) · serif ↔ sans ↔ mono · soyuq ↔ isti | bir scroll oxu · bir yazıçı dəyişən · Three.js yox |

**İkisi də deyir: mediumu məhdudlaşdır — məna özü çıxır.**

### Və ən vacib tətbiq

> **Saytın üzü yoxdur.** Guadagnino: *"register the movement of the heart … through the way their
> **bodies moved in space**."* Saytın göstərə biləcəyi **yalnız** budur: **şeylərin məkanda hərəkəti.**
> Ona görə hər animasiya **bədən hərəkəti** kimi oxunmalıdır — dekor yox.

---

## 5. Hiperaktivlik — dürüst etiraz

> ⚠️ **Sən "daha hərəkətli" istədin. Mən "daha çox hərəkət" etməyəcəyəm — səbəbini yazıram.**

Sayt sakit görünmür, çünki hərəkət **azdır**. Sakit görünür, çünki **hamısı eyni səviyyədədir** —
hər şey 4/10. 4/10-u 7/10 etsən: **yenə hamar qalır**, üstəlik film itir.

**Düzgün həll: məsafəni aç.** Zirvə 9/10, dərə 2/10. Orta dəyişmir, sayt **canlı** oxunur.

Bu, sənin öz seçdiyin iki mənbədən gəlir — Merlí *"hər kadrda işıq və qaranlıq"*,
Fasano *"holding shots"* (uzun kadr gərginlik yaradır, çünki yanında qısa kadr var).

**Qayda: hər fəsılda bir sükut, bir partlayış.** Yalnız partlayış = səs-küy.
Yalnız sükut = ölü ekran. İkisi birgə = **canlı**.

---

## 6. İki qat — sənin tələbinin texniki qarşılığı

> **Mənbə:** `vgpu.sh/docs/guides/adaptive-quality` —
> *"Low must be a **genuinely cheaper pipeline, not just a lower resolution**."*

**Template niyə ölmür — cavab budur:**

| Template **budur** (aşağı qatda **qalır**) | Bu **deyil** (aşağı qatda **azalır**) |
|---|---|
| Tipoqrafiya — Cormorant · Inter · Italianno | Shader oktavaları |
| Palitra — 14 dünya | Hissəcik sayı |
| Layout — grid, spacing, ritm | DPR |
| Hekaye — 14 fəsıl, mətn, sıra | Blur keçidləri |
| Temp — scroll büdcəsi, easing | Qran ölçüsü |

**Yuxarı sütun pulsuzdur. Aşağı sütun bahalıdır.**
Yəni aşağı qat **dizaynı saxlayır, GPU işini azaldır.** Template GPU-da deyil — **tipoqrafiyadadır.**

### Qaydalar (mənbədən birbaşa)

| Qayda | Mətn |
|---|---|
| Başlanğıc | **Yüksəkdən başla**, ilk kadr heç nə ödəmir |
| Keçid | **Yalnız bir dəfə** High → Low. **Heç vaxt özü yuxarı qalxmır** |
| Siqnal | Hamısı **məsləhətdir** — xəta olsa, **Yüksək qalır** |
| Ölçmə | Xam `rAF` yox, **təqdim olunan** kadr · 250 ms-dən uzun boşluq **pəncərəni sıfırlayır** |
| Batareya | Boşaldır **≤ 30%** → Low · `getBattery()` **yoxlanmadan çağırılmır** (Safari/Firefox-da yoxdur) |
| DPR | Yüksək: `min(dpr, 2)` · Aşağı: **`1`** |
| Görünürlük | İstifadəçi **görsün niyə** və **dəyişə bilsin** |
| ⛔ | `detect-gpu` paketi — **~15 KB gzip**, büdcəyə dəyməz |

---

## 7. Qurma planı — prioritetli

### P0 — əvvəl bunlar (hamısı sıfır və ya mənfi xərc)

| # | İş | Fayl | Xərc |
|---|---|---|---|
| 1 | `03` ↔ `05` təkrarını ayır — **sitat yalnız `05`-də** | `Berm.tsx` · `site.ts` | **0** |
| 2 | *Heptaméron* səhvini düzəlt | `Berm.tsx:106` · `site.ts:52` | **0** |
| 3 | Büdcə: `03` `260 → 190svh` · `05` `260 → 320svh` | `global.css` | **0** |
| 4 | Üç easing ailəsi + üç müddət tieri | `global.css` | **0** |
| 5 | Boş vəziyyət hərəkəti — scroll yoxdursa da tərpənir | `global.css` + 1 komponent | ~10 sətir |
| 6 | `06 The Orchard` — ağac → **gölmə** (analitik su) | `TheOrchard.tsx` · `tree.ts` **silinir** | **−13.5 KB** |
| 7 | `03 The Berm` — **küləkli ot** (statik VBO, VS külək) | `Berm.tsx` + `grass.ts` | ~1.5 KB |
| 8 | Pointer sürüşməsi — ot açılır, su dalğalanır | hər iki shader | ~15 sətir |
| 9 | Klaviatura keçidi (interaktivlik artır → məcburi) | komponentlər | **0** |

### P1

| # | İş | Fayl | Xərc |
|---|---|---|---|
| 10 | İki qat: siqnallar + `tierDpr` + görünən nəzarət | yeni `quality.ts` | ~2 KB |
| 11 | `12 Contact` — sağ tərəf doldurulur (masaüstü zəngin, mobil təmiz) | `Contact.tsx` | ~3 KB |
| 12 | Nəticə dəyişkənliyi — *"three takes"* qaydası | ot + su shader | ~10 sətir |
| 13 | `07 The Quiet` — **həqiqi sükut** (kontrast üçün dərə lazımdır) | `global.css` | **−** |

### P2

| # | İş | Xərc |
|---|---|---|
| 14 | Mühit səsi (külək, su) — **yalnız açılıb-söndürülən**, avtomatik yox | ~2 KB |
| 15 | Analitika — hansı fəsil oxucunu itirir (indi **bilinmir**) | ~1 KB |
| 16 | Sürüşdürmə (drag) — şaftalını dartmaq | ~40 sətir |

### Büdcə

| | JS gzip |
|---|---|
| **İndi** | 135.79 KB |
| `tree.ts` silinir | −3 KB (təxmini) |
| Yeni: ot + su + qat + contact | +9 KB (təxmini) |
| **Sonra** | **~142 KB** |
| **Hədd** | 180 KB · **38 KB yer qalır** |

> ⚠️ Rəqəmlər **təxminidir**. Həqiqi rəqəm `bun run build` çıxışından götürülür.
> Qapı: `135.79 → ?` — **artım 15 KB-dan çox olarsa, dayan və yenidən düşün.**

---

## 8. Nə **edilmir** — və niyə

| ⛔ | Səbəb |
|---|---|
| **Three.js** | +150 KB gzip · və Guadagnino qaydasını pozur (`05 §1`) |
| **Shadertoy-dan su shader** | Default lisenziya **CC BY-NC-SA 3.0** — **qadağandır**. Yalnız MIT (benc-uk, LYGIA) və ya sıfırdan |
| **`detect-gpu` paketi** | ~15 KB gzip — 5 pulsuz siqnal eyni işi görür |
| **Avtomatik yuxarı qat** | Yellənmə yaradır |
| **Səsi avtomatik açmaq** | UX cinayətidir |
| **Ağacı "yaxşılaşdırmaq"** | Real villa-da şaftalı ağacı **yox idi** — bağ film üçün **əkilmişdi**. Ona görə ağac **ən az** CMBYN seçimidir (`06 §1`) |
| **`03`-dən sitatı tamamilə silmək** | Sətir gözəldir — `16 Bəyəndiyim sözlər`-ə köçürülür, atılmır |

---

## 9. Dürüst boşluqlar

| Sual | Status |
|---|---|
| CMBYN-in **rəsmi hex palitrası** | **Yoxdur** — `KONSEPT §2.3` ölçülmüş kadrlardandır |
| CMBYN başlıq **şrifti** | **Yoxdur** — Chen Li əl ilə yazıb |
| **Merlí** titr şriftinin adı | tapılmadı — studio ad çəkmir |
| İki serial arasında **rəsmi dizayn əlaqəsi** | yoxdur — yalnız ortaq yaradıcı (Héctor Lozano) |
| Mobil GPU-da **qılça həddi** | **ölçülməyib** — öz cihazda `diag.mjs` ilə yoxlanmalıdır |
| Saytın **hansı fəsli** oxucunu itirir | **bilinmir** — analitika yoxdur (P2) |
| `07 The Quiet`-in **6.5 saniyə** tələbi | ⚠️ Köhnə `SYNTHESIS`-də *"toqquşur"* yazılmışdı. **Düzəliş:** toqquşmur — **kontrast üçün lazımdır** (`07 §4`) |

---

## 10. Köhnəlmiş hissələr — bu faylın əvvəlki versiyasından

| Əvvəl yazılmışdı | İndi |
|---|---|
| *"CSP yoxdur"* | ✅ **Var** — `cspMeta()` plugini, `apply: 'build'` (`QERARLAR §22–25`) |
| *"Fontlar xarici (Google)"* | ✅ **Self-host** — `dist/fonts/` 38 fayl |
| *"The Quiet 6.5s sakitliklə toqquşur"* | ❌ **Yanlış** — sükut **kontrast** üçündür, pozulmamalıdır |
| *"Kursor izləmə ~2 KB"* | ⚠️ Zəiflədirildi — **pointer sürüşməsi** ot/su shader-də **~15 sətir**, ayrı effekt lazım deyil |
| *"Ambient particles +4 KB"* | ⚠əvəzinə **boş vəziyyət hərəkəti** — ~10 sətir, daha ucuz |
| *"3D float + cursor react"* | ✅ Daxil edildi — §4 dizayn qanununa uyğun (*"bədən məkanda"*) |

---

## 11. Növbəti addım

**P0 #1–3 — sıfır xərc, dərhal.** Üç fayl, üç dəyişiklik, heç bir KB artımı yox:

1. `Berm.tsx` — sitat silinir, *Heptaméron* səhvi düzəlir
2. `site.ts` — `SPEAK.source` → `'The Heptaméron · Marguerite de Navarre, 1558'`
3. `global.css` — `03` → `190svh`, `05` → `320svh`

Sonra **P0 #4–5** (hərəkət lüğəti) → **P0 #6–7** (gölmə + ot) → **P1**.

---

## 12. İstinadlar — fayl-fayl

| Fayl | Əsas mənbələr |
|---|---|
| `04` | `theothers.es` (studio) · Horace *Epistulae* I.2.40 · Kant 1784 · Movistar+ |
| `05` | `emanuellevy.com` · `cined.com` · `grokipedia` · `wikiquote` · `telefonorojo.mx` · `gandbmagazine.com` |
| `06` | `movie-locations.com` (Villa Albergoni) · `github.com/benc-uk/sdf-raymarch` (MIT) · LYGIA (MIT) · Shadertoy lisenziya xəbərdarlığı |
| `07` | `vgpu.sh/docs/guides/adaptive-quality` · `awesome-immersive-storytelling` · MDN `prefers-reduced-motion` · **öz kodumuz** |
| `08` | `wikiquote` (*Heptaméron*) · `litcharts` (Monet's berm) · `supersummary` · `threejsresources.com/guides/grass` · `penev.tech/labs/grass` |
