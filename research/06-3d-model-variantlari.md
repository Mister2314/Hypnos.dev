# 06 — «The Orchard» üçün model variantları (CMBYN araşdırması)

> **Tapşırıq:** `src/sections/TheOrchard.tsx`-dəki prosedural şaftalı ağacı bəyənilmədi.
> Tələb: internetdən daha orijinal, *Call Me By Your Name* (2017) estetikasına uyğun «model».
> **Məhdudiyyət:** əl ilə WebGL (Three.js yox), 0 tekstura, ~15 KB kod, JS ≤ 180 KB gzip (135.8 KB işlənmiş).
> **Metod:** CDP proxy bağlı olmadığı üçün `WebSearch` + `WebFetch` (web-access skill-in icazə verdiyi statik qat).
> Hər faktın mənbəyi linklə verilir. Mənbəsiz mülahizələr açıq şəkildə **«təxmin»** kimi işarələnir.

---

## 0. Xülasə (qərar üçün 3 cümlə)

Ən güclü variant **gölməçə (Laghetto dei Riflessi) — tektonik olaraq filmin ən çox qayıtdığı məkan**, suyun özü isə WebGL-də **tekstdən asılı olmayan, analitik şader**lə qurulur.
Ən yaxşı nisbət **BİR əsas (gölməçə + işıq/shadow pass)** + **BİR ehtiyat (sərv ağacı silueti və ya villanın kolonnadası — «işıq və kölgə» şaderi)**-dir.
Hər iki halda **filmdən heç bir kadr, aktyor üzü, afiş, musiqi, replika təkrarlanmır** — yalnız real təbiət formaları və işıq hadisəsi prosedural şəkildə yenidən qurulur.

---

## 1. CMBYN-də ikonik olan nədir — namizəd xəritəsi

Mənbə bazası: [movie-locations.com — CMBYN](https://www.movie-locations.com/movies/c/Call-Me-By-Your-Name.php), [almostginger.com — CMBYN locations](https://almostginger.com/call-me-by-your-name-locations/), [BSU DLR jurnalı — «Life's a Peach»](https://openjournals.bsu.edu/dlr/article/view/3498).

| # | Namizəd | Nə qədər ikonik (mənbə) | Hüquqi status | Texniki (0 tekstura, <15 KB) |
|---|---------|--------------------------|---------------|-------------------------------|
| 1 | **Gölməçə** (Laghetto dei Riflessi, Ricengo — kiçik karxana gölü, otlu sahil) | Filmin «emosional barometri»: 5+ səhnə eyni suya qayıdır — Marzia ilə gecə üzgüçülüyü, Oliver-lə ilk gecədən sonra, dostlarla üzmə ([almostginger](https://almostginger.com/call-me-by-your-name-locations/)) | Real təbiət qoruğu; **heç bir film elementi tələb etmir** → təmiz | ★★★★☆ — SDF/heightfield su, 1 quad, 0 vertex; ~150 sətir FS. Ripple + günəş parıltısı |
| 2 | **Şaftalı/ərik — TƏK MEYVƏ** | Filmin ən məşhur səhnəsi; akademik məqalə belə adlanır: «Life's a Peach» ([BSU](https://openjournals.bsu.edu/dlr/article/view/3498)) | Meyvə forması ümumi; **konkret səhnə təsviri qadağan** → təmiz | ★★★★★ — SDF sfera+dilim, ~40 sətir; saytda **artıq var** (`PEACH_FS`) → təkrar olardı |
| 3 | **Velosiped** (E&O-nun Crema-ya gedişi; çınqıl yol, qarğıdalı tarlası) | Filmin «birləşdirici toxuması» — hər keçid velosipedlədir ([almostginger](https://almostginger.com/call-me-by-your-name-locations/)) | Ümumi obyekt; təmiz | ★★★☆☆ — nazik borular + təkər spikaları; aliasing riski yüksək |
| 4 | **Villa lojası/kolonnada** (16-cı əsr palazzo, «solğun əzəmət») | Filmin gündəlik həyatı: səhər yeməyi, piano, kitabxana ([almostginger](https://almostginger.com/call-me-by-your-name-locations/)) | Memarlıq formaları (sütun, tağ) ümumi; **Villa Albergoni-nin özünün dəqiq kopyası riskli** | ★★★★☆ — SDF box+cylinder repeat; kölgə zolaqları əsas effekt |
| 5 | **Qatar platforması** (Pizzighettone) | «Ürəkqıran vida səhnəsi» ([movie-locations](https://www.movie-locations.com/movies/c/Call-Me-By-Your-Name.php)) | Real stansiya; təmiz | ★★☆☆☆ — statik qutular; **emosiya mətndən gəlir, obyektdən yox** → zəif |
| 6 | **Roma heykəli / Qrottae di Catullo** (Sirmione, Gardsko gölü) | Arxeoloji ekskursiya səhnəsi; Perlman Sr. antik dövr mütəxəssisidir ([movie-locations](https://www.movie-locations.com/movies/c/Call-Me-By-Your-Name.php)) | Real xarabalıq; təmiz | ★★☆☆☆ — insan fiquru SDF-də inandırıcı çıxmır |
| 7 | **Su səthi (tək başına)** | Yuxarıdakı 1-in alt-hissəsi | Təmiz | ★★★★★ — ən ucuz yol (bax §2) |
| 8 | **Çınqıl yol + günəş tozu** | Velosiped marşrutlarının «ağarmış Lombardiya» dokusu ([almostginger](https://almostginger.com/call-me-by-your-name-locations/)) | Təmiz | ★★★★★ — 1 quad + 300–800 zərrəcik; ~3 KB |
| 9 | **Sərv ağacı** | İtalyan yayının postkart silueti (filmdə var, amma mənbələr onu ayrıca vurğulamır — **təxmin: vizual uyğunluq yüksək**) | Təmiz | ★★★★★ — SDF konus/kapsul; ~30 sətir |
| 10 | **Pəncərə/qəfəs kölgəsi** | Final kadrı: kamera pəncərədən yayınır ([movie-locations](https://www.movie-locations.com/movies/c/Call-Me-By-Your-Name.php)) | Təmiz | ★★★★★ — düz müstəvi + animasiyalı kölgə; ~20 sətir |

**Fərq mühümdür:** mövcud fəsil **«şaftalı ağacı»**nı göstərir — amma filmdə **ağac deyil, MEYVƏ** ikonikdir. Real çəkiliş villasında şaftalı ağacı **heç olmayıb** — bağ film üçün xüsusi salınmışdı ([movie-locations](https://www.movie-locations.com/movies/c/Call-Me-By-Your-Name.php): *«there are really no peach trees on the estate»*). Yəni ağac **ən az CMBYN olan** seçimdir; Xəyalın bəyənməməsi təsadüf deyil.

---

## 2. «Model» yanaşması — 5 alternativ

3D model mütləq mesh deyil. Büdcəyə görə sıralama:

### 2.1 Raymarching / SDF — *həcm, su, işıq üçün*
Kamera şüası hər piksel üçün səhnədən keçirilir; həndəsə **riyazi funksiya**larla təsvir olunur.
- **Minimum işləyən nümunə: 100 sətir** — tam ekran quad + `map()` + 40 addım + SDF normal ([benc-uk/sdf-raymarch, mini-comments](https://github.com/benc-uk/sdf-raymarch/blob/main/public/mini-comments/index.html), MIT lisenziyalı repo).
- Primitivlər: [Inigo Quilez — distance functions](https://iquilezles.org/articles/distfunctions/).
- **CMBYN hissi:** su üzərində işıq qırılması, tağ kölgələri, yumşaq sərhədlər — hamısı «yay işığı» effekti verir. **Büdcə: ★★★☆☆** (addım sayı 32-yə endirilə bilər; mobil üçün yarım rezolyusiya mütləqdir).

### 2.2 GPU particles / instancing — *toz, yarpaq, su damlası*
Minlərlə eyni primitiv, 1 draw call. 200 000 zərrəcik WebGL2 instancing ilə **1 draw call**-da ([m2-md/webgl2-instanced-particles](https://github.com/m2-md/webgl2-instanced-particles)).
- **CMBYN hissi:** günəş şüasında üzən toz, qarğıdalı tarlası, yay «hər şey yavaşdır» hissi. **Büdcə: ★★★★★** — 800 zərrəcik ~1 KB JS + 20 sətir şader.

### 2.3 Vertex shader deformasiyası — *sadə mesh, mürəkkəb hərəkət*
Hərəkət CPU-da yox, GPU-da: `p += sin(uTime + aPhase) * aSway`. **Mövcud ağac artıq bunu edir** (bax `TREE_VS`).
- **CMBYN hissi:** yarpaq xışıltısı, su dalğası, pərdə. **Büdcə: ★★★★★** (artıq işləyir — sıfır əlavə xərc).

### 2.4 Reaksiya-diffuziya / noise teksturaları — *şader içində generasiya*
Prosedural noise (`snoise`, fbm) ilə su, duman, çınqıl, dəri teksturası. Hazır kitabxanalar: [LYGIA](https://lygia.xyz/generative/snoise) (MIT), [The Book of Shaders](https://thebookofshaders.com/).
- **CMBYN hissi:** suyun üzü, köhnə divar, əsən yarpaq. **Büdcə: ★★★★☆** — 15 sətir noise = 300 sətir əvəz edir.

### 2.5 2.5D parallaks — *dərinlik hissi, 0 WebGL*
Layihələr scroll-a görə müxtəlif sürətlə hərəkət edir. Hazır mühərrik: [izure1/leviar](https://github.com/izure1/leviar).
- **CMBYN hissi:** «postkart» — amma **filmin kamerası 2D deyil**, ona görə bu ən zəif uyğunluqdur. **Büdcə: ★★★★★** (sıfır WebGL).

**Büdcə nəticəsi:** 2.4 (noise) + 2.1 (SDF) + 2.2 (zərrəcik) kombinasiyası 15 KB-a sığır; 2.5 zəif, 2.3 artıq mövcuddur.

---

## 3. İstinadlar — bunu kim edib, necə

| Resurs | Link | Nə öyrədir | Lisenziya |
|--------|------|-----------|-----------|
| **Evan Wallace — WebGL Water** | [madebyevan.com/webgl-water](https://madebyevan.com/webgl-water/) | Raytraced əks-əks olunma + refraksiya + heightfield simulyasiya; klassik referans | Saytda açıq lisenziya yoxdur → **kod kopyalamaq OLMAZ**, texnika oxunur |
| **benc-uk/sdf-raymarch** | [GitHub](https://github.com/benc-uk/sdf-raymarch) | 100 sətirlik minimal raymarcher; `smoothMin`, SDF normal; canlı demo | **MIT** → götürmək mümkündür |
| **Inigo Quilez — articles** | [iquilezles.org/articles](https://iquilezles.org/articles/) | SDF primitivləri, normallar, palitralar, fbm | Məqalələr açıq; **kod Shadertoy-dadırsa default lisenziya CC BY-NC-SA 3.0** ([Godot Shaders qeydi](https://godotshaders.com/shader/seascape-shader/)) → **kommersiya üçün YOX** |
| **LYGIA shader library** | [lygia.xyz](https://lygia.xyz/), [GitHub](https://github.com/patriciogonzalezvivo/lygia) | Hazır `snoise`, `fbm`, ripple funksiyaları | **MIT/BSD** → təmiz |
| **The Book of Shaders** | [thebookofshaders.com](https://thebookofshaders.com/) | Noise, shape, color — addım-addım | Açıq təhsil resursu |
| **m2-md/webgl2-instanced-particles** | [GitHub](https://github.com/m2-md/webgl2-instanced-particles) | 200k zərrəcik, 1 draw call sübutu | Açıq repo |
| **Codrops — tutoriyallar** | [tympanus.net/codrops](https://tympanus.net/codrops/) | Veb-təcrübə sənətkarlığı: şader, scroll, particle | Tutorial kodları öz layihələrində istifadə üçün nəzərdə tutulub |

**Vacib hüquqi detal:** Shadertoy-un **default lisenziyası CC BY-NC-SA 3.0**-dur ([Godot Shaders izahı](https://godotshaders.com/shader/seascape-shader/)). Yəni «Shadertoy-dan su şaderi götürüm» **kommersiya/portfel saytı üçün yolverilməzdir**. Ona görə seçim yalnız **MIT lisenziyalı** (benc-uk, LYGIA) və ya **sıfırdan öz kodu**dur.

---

## 4. Tövsiyə — BİR əsas + BİR ehtiyat

### 4.1 ƏSAS: «Gölməçə» — analitik su səthi (Laghetto dei Riflessi)

**Nə görünür:** ekranın alt yarısı tünd-yaşıl su; üzərində yavaş dalğa, günəş parıltısı, sahilə yaxın daşların bulanıq əksi. Yuxarıda solğun səma, sağda sərv silueti. Siçan su üzərində hərəkət edəndə **dalğa mərkəzi** yaranır — Xəyalın filmdəki «gecə üzgüçülüyü» anına birbaşa toxunan interaksiya.

**Necə qurulur (texnika):** tam ekran quad + **analitik heightfield** (raymarching yox!):
1. `fbm` noise ilə yüksəklik → normal riyazi törəmə ilə hesablanır (dəqiq, 4 `map()` çağırışına qənaət).
2. Fresnel: baxış bucağı dayazdıqca su daha çox səmanı əks etdirir.
3. Günəş parıltısı: `pow(max(dot(reflect(-L, n), -rd), 0.0), 90.0)` — mövcud `PEACH_FS`-dəki Blinn-Phong naxışının davamı.
4. Dərinlik qradiyenti: sahilə yaxın açıq-yaşıl → mərkəzdə tünd.
5. `uProgress` (scroll) → günəş bucağı və dalğa amplitudası dəyişir; günəş batır.

**Nə qədər kod (təxmin):** FS ~140–170 sətir (~2.5–3 KB gzip), JS setup ~60 sətir — **mövcud `webgl.ts`, `mat4.ts` yenidən istifadə olunur, yeni asılılıq yoxdur**. `tree.ts` (13.5 KB mənbə) tamamilə silinir → **xalis büdcə azalır**.

**Riski:** mobil GPU-da tam ekran FS bahalıdır. **Azaltma:** `sizeCanvas(canvas, 1)` (hazırkı 1.5 əvəzinə) + `IntersectionObserver` artıq var (yalnız görünəndə çəkir). 30 FPS-də belə su «yavaş» görünür — **bu filmdə də belədir**, dizayn qərarı kimi qəbul edilə bilər.

**Niyə CMBYN-dir:** su filmin **5+ səhnəsinin şahidi**dir ([almostginger](https://almostginger.com/call-me-by-your-name-locations/)); «Laghetto dei Riflessi» adı özü **«əkslər gölməçəsi»** deməkdir — saytın 06 fəsli üçün məna dəqiqdir. Eyni zamanda **heç bir konkret kadr təkrarlanmır** — yalnız su + işıq.

### 4.2 EHTİYAT: «Villa kölgəsi» — kolonnada + işıq zolaqları

**Nə görünür:** qaranlıq otaqdan baxan kamera; tağlı sütunlar arasından düşən günəş işığı döşəmədə **hərəkət edən kölgə zolaqları** yaradır. Toz zərrəcikləri işıq şüasında üzür. Musiqi yoxdur — yalnız yavaş işıq sürüşməsi.

**Necə qurulur:** SDF `repeat()` ilə sütun sırası + `box` tağ kəsimi; kölgə **ray-march edilmiş soft shadow** ([benc-uk nümunəsi](https://github.com/benc-uk/sdf-raymarch) + [IQ normalsSDF](https://iquilezles.org/articles/normalsSDF/)) + 500 zərrəcik (instancing yox, `POINTS` kifayətdir — mövcud `PEACH_VS` naxışı).
**Kod:** ~120 sətir FS + ~80 sətir JS → ~4 KB. **Riski:** tağ SDF-də çətin ola bilər (kəsim sərhədləri); zərrəciklər + kölgə iki pass tələb edir.
**Niyyə CMBYN-dir:** filmin «solğun əzəmət» villası + final kadrındakı pəncərə kölgəsi ([movie-locations](https://www.movie-locations.com/movies/c/Call-Me-By-Your-Name.php)). **Üstünlük:** əsas variantdan sonra ikinci fəsil kimi qoyula bilər; su ilə eyni texnikanı (SDF + işıq) paylaşır.

> **Qeyd:** §1-dəki 7 və 8-ci namizədlər (su səthi təkbaşına, çınqıl+toz) bu iki variantın **tərkib hissəsi**dir — ayrıca fəsil açmağa dəyməz.

---

## 5. Legal yoxlama

Seçilmiş hər iki variant üçün **filmdən heç nə təkrarlanmır**:

1. **Kadr yoxdur** — heç bir film still-i, aktyor üzü, afiş, poster, titr kadrı istifadə olunmur və təqlid edilmir. Su səthi **ümumi təbiət hadisəsi**dir; kolonnada **ümumi memarlıq forması**dır (sütun + tağ antik dövrdən bəri ümumi domendir).
2. **Musiqi/replika yoxdur** — saytda film musiqisi, səs, replika yoxdur; şader səssizdir.
3. **Ad/brend yoxdur** — fəsil «The Orchard», «Laghetto», «villa» kimi **ümumi coğrafi/memarlıq terminləri** ilə adlanır; film adı UI-da çıxmır (yalnız daxili `research/` və kod şərhlərində istinad kimi).
4. **Coğrafi faktlar qorunmur** — real yerlər (Ricengo gölü, Moscazzano villası) **ideyalar/faktlar**dır; onların özü müəllif hüququ obyekti deyil ([Houston Law Review — scènes à faire](https://houstonlawreview.org/article/92128-grounding-the-scenes-a-faire-doctrine): ümumi səhnə elementləri qorunmur). Risk yalnız **konkret ifadə forması**nın (kadr kompozisiyası, xüsusi dizayn) kopyalanmasından yaranır — biz ondan qaçırıq.
5. **Kod təmizdir** — bütün şaderlər sıfırdan yazılacaq və ya **MIT lisenziyalı** mənbədən (benc-uk, LYGIA); Shadertoy-dan (default CC BY-NC-SA) **heç bir kod götürülmür**.
6. **Təbii elementlər ümumi domendir** — su, işıq, sərv ağacı, çınqıl heç kimin müəllif hüququ deyil.

**Nəticə:** legal risk **aşağı-sıfır**; əsas qorunma — «ümumi təbiət + sıfırdan kod» prinsipi.

---

## 6. Növbəti addım (təklif)

1. `QERARLAR.md`-ə §20 kimi qeyd: *ağac modeli götürülür, gölməçə şaderi gəlir*.
2. Prototip: tək `research/` qovluğunda deyil — `src/sections/TheLake.tsx` eskizi (kod yazmadan əvvəl Xəyalın baxması üçün statik kadr).
3. Ölçmə: `bun run build` → JS gzip hədəfi **≤ 180 KB** qalmalıdır; `tree.ts` silinməsi ~4 KB qazandırır.
4. Mobil test: `sizeCanvas(canvas, 1)` + 30 FPS həddi; `prefers-reduced-motion` üçün **statik kadr** (mövcud naxış artıq var, `TheOrchard.tsx` sətir 595–616).

---

*Mənbələr yuxarıda inline verilib. «Təxmin» işarəli yeganə iddia: sərv ağacının filmdəki vizual çəkisi (mənbələr onu ayrıca vurğulamır). Bütün digər faktlar linklənmiş mənbələrdən götürülüb.*
