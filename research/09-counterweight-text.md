# 09 — Counterweight mətn effekti: dərin araşdırma (v6.4 post-mortem)

> **Tarix:** 27 sentyabr 2026 · **Status:** araşdırma bitdi — **kod YOX** (ortaq qərar gözləyir)
> **Tapşırıq:** *"hazirki stili hec beyenmedim… suni birsey olmasin, o dizaynin o hissini
> derinden hiss etdirsin… 1-2 dene saytla yetinme, cox sey gor, cox sey anla, sonra
> ortaq qerara gel."*

---

## 1. Post-mortem — v6.4 niyə süni oxundu

Üç səbəb, hamısı dizayn-dil səhvi:

| # | Səhv | Niyə süni oxunur |
|---|---|---|
| 1 | **Xromatik RGB-split** (`text-shadow` çəhrayı/cyan) | Bu, **glitch/kiberpank dilidir** — Arcane-in əks qütbləri. Arcane-in dili RƏNGdir: paint, işıq, duman. Saya qızıl yay dünyasına neon glitch qoymaq kimi oldu |
| 2 | **İki organik sistem döyüşürdü** | Video-nun işığı + mətnin ink-bleed-i eyni anda nəfəs alırdı — göz ikisini ayıda bilmirdi. Dərinlik **tək mənbədən** gəlir (CMBYN: tək linza) |
| 3 | **Effekt mətni bəzəyirdi, anı SAHNƏLƏMİRDİ** | Filmdə hiss gələn şey: nəhəng boşluq + iki balaca fiqur + SÜKUT + tək işıq. Web versiyası əvəzinə sözə dekor taxdı. Hiss = xoreoqrafiya, dekor yox |

**Dərs:** effekt seçiləndə sual *"nə gözəldir?"* deyil — *"filmin bu anı NECƏ danışır?"*
Cavab: **dumandan fərdi çıxarılır** (Viktorun kommuna dumanından Jayce onu BÜTÜN
şəkildə qaytarır). Effekt bu cümləni yerinə yetirməlidir.

---

## 2. Araşdırma — mənbələr və nə verdilər

| Mənbə | Nə verdi |
|---|---|
| **ICS Media — text particles (WebGPU/JS)** (`ics.media/en/entry/221216`) | Əsas texnika: mətn gizli canvas-a yazılır → `getImageData` → piksel başına hissəcik → converger/scatter. «Dust to text»-in sənaye standardı |
| **CodePen — «particle text» tag** (`codepen.io/tag/particle%20text`) + **Jotform top-20** + **Speckyboy top-10** | Onlarla hazır demo — texnikanın uc və bahalı icraları arasındakı fərq: **fizika keyfiyyəti** (drift noise vs təsadüfi jitter) |
| **GSAP forum — «Particle dissolving from text»** (`gsap.com/community/forums/topic/14541`) | GSAP ilə dissolve/assemble — bizim stack-ə birbaşa uyğun |
| **GSAP 3.13 — SplitText PULSUZ** (29 aprel 2025, Webflow; `gsap.com`, `css-tricks.com`) | Bütün bonus pluginlər pulsuz oldu; SplitText **tam yenidən yazıldı** — per-char/line masked xoreoqrafiya artıq standart alətdir |
| **Obys Agency** — Awwwards Studio of the Year 2023 (`obys.agency`) | Eksperimental tipoqrafiyanın keyfiyyət xətti: tipografiya özü səhnədir, dekor yox |
| **Unseen Studio** (`unseen.co`) · **Lusion** (`lusion.co`) | Kinetic type + WebGL fizika — «text that behaves like matter» məktəbi |
| **RiotX Arcane / Progress Days** (`riotgames.com/en/news/welcome-to-riotx-arcane`) | **Rəsmi Arcane web dili:** təcrid olunmuş text-trick YOX — **atmosfer ilk**, kəşfiyyat, fazalar, mükafatlar. Arcane brendi web-də «dünya» satır, «effekt» yox |
| **Fortiche prinsipləri** (öncəki araşdırma, `research/05`) | Painted light · 2D FX kadrın ÜSTÜNDƏ · broken realism — hər kadr rəsm kimi |

---

## 3. Variantlar — hiss, xərc, risk

### A — «Dust to whole» — hissəciklərdən BÜTÜN söz ⭐ tövsiyə
**Nə olur:** sətir başlanğıcda **duman**dır — 2 500–3 500 işıq hissəcikləri ləng
sürüşür, söz çətin oxunur (kommunanın dumanı). Scroll irəlilədikcə hissəciklər
hərf piksellərinə **yığılır** — zirvə anında (bloom alın-çırpmа, ~0.68) sətir
TAM BÜTÜN görünür: *"You were never broken."* Artıq dağılmır — **bütün qalır**
(filmdən fərq: biz onu geri buraxmırıq).
**Niyə hiss:** bu, səhnənin öz metaforudur — çoxdan bir, dumanın içindən adam.
Söz cümləni deyir, effekt onu YAŞADIR.
**Xərc:** ~2.5–3 KB JS, bir canvas qatı, 2D (uc — GPU şader lazım deyil).
**Risk:** hissəcik fizikası zövq işidir — təsadüfi jitter texnoloji, ləng drift
isə şeiri. Texniki deyil, **bədii** risk. `research/09 §2`-dəki bütün icralar
bunun uc halıdır — biz uc halı deyil, bədii halını yazacağıq.
**Mobil:** hissəcik 900–1 200, `quality.ts` aşağı qatı ilə eyni model.

### B — «Held line» — teatr sükutu (SplitText xoreoqrafiyası)
**Nə olur:** effekt yox — **xoreoqrafiya**. SplitText (pulsuz) ilə hərf-hərf
maskalı açılış, UZUN dayanmalar, şəxsi sətir çox gec. Dərinlik vaxtdan gəlir —
filmin «holding shot» cihazı (Fasano — bizim SYNTHESIS-də artıq var).
**Niyə hiss:** filmin öz dilidir; heç nə süni deyil, çünki heç nə YOXDUR.
**Xərc:** ~0.5 KB. **Risk:** sənin tələbin «xüsusi effekt» idi — bu, «effektsizlik»
kimi oxuna bilər. Amma ən dürüst variant budur.

### C — «Painted letters» — əl ilə çəkilmiş tipoqrafiya
**Nə olur:** Obys məktəbi — mətn SVG konturu ilə çəkilir, üstünə paint dolur.
**Risk (ağır):** Cormorant italic-ın serif konturu çəkiləndə tel kimi zəif
görünür, paint deyil. v6.4-in xəstəliyinin eyni ailəsidir. ⛔ tövsiyə edilmir.

### D — «The haze veil» — mətn dəyişmir, İŞIQ dəyişir
**Nə olur:** mətn sadə qalır; işıq qatı (bloom) mətnin ÜZÜNDƏN keçəndə hərf-lər
keçdiyi yerdə parlayır (luminance mask). Mətni effekt deyil, **İŞIQ** aşkar
edir — filmdə işıq Viktorun üzünə necə düşürsə.
**Niyə hiss:** ən gizli variant — heç nə «edir», hər şey baş verir.
**Xərc:** ~1 KB. **Risk:** ilk baxışda «heç nə dəyişməyib» kimi oxuna bilər.

---

## 4. Tövsiyə — A + D birləşməsi (ortaq qərara təqdim)

**A** ana hissdir: duman → bütün söz (kommuna → Jaycenin qaytardığı adam).
**D** onun üzərinə nəfəs verir: işıq keçdikcə hərflər parlayır.
Biri digərini əvəz etmir — **tək mənbə hissi** qorunur: hissəciklər həm sözü
qurur, həm işığı tutur (hissəcik rəngi bloom ilə eyni mənbədən).

**Müstəqil olaraq qalır (v6.4-dən):** scroll büdcəsinin artması — 260 → **~400svh**
(xronologiya: duman → yığılma → zirvə → şəxsi sətir → dayanma; hər vəziyyət öz
nəfəsində). Bu, effekt seçimindən asılı deyil — v6.4-də səhv eyni anda edilib,
amma özü səhv deyildi.

## 5. Qərar — Khayalın sözü lazımdır

Variantlar: **A** · **B** · **C (⛔)** · **D** · **A+D (tövsiyə)**.
Sual biridir: hansı hiss? — qalanı mən yazaram.

---

*Mənbələr §2-də. Kod bu fayldan SONRA, ortaq qərardan sonra yazılır.*
