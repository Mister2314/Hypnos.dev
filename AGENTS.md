# AGENTS.md — khayal-site (Hypnos.dev) · AI iş təlimatı

> Bu fayl repo-nun yol göstəricisidir — anbar deyil. Hər AI buradan başlayır.
> Mənbə həqiqəti: `QERARLAR.md` (lokal, gitignored) + vault: `C:/Ikinci beyin/Layihə/10 Şəxsi sayt — master brief.md` → son **AKTUAL** bölmə.
> Saytın sahibi **Xəyal**dır. Vibe toxunulmazdır, hər şey müzakirəyə açıqdır.

## Bu nədir

- Xəyalın şəxsi saytı — **canlı: hypnosdev.vercel.app** (Vercel proyekti `hypnos.dev`, Git auto-deploy)
- Vite + React 19 + TS · GSAP + Lenis · kadrlardan yığılan "video" səhnələr (WebP frame sequence, FFmpeg)
- 11 səhnə: hero · leap · summer · speak · hands · counterweight · sapere · work · questions · contact · signature
- Məzmun **yalnız** `src/lib/i18n.ts` (EN default, AZ, TR — üçü paralel) + `src/lib/site.ts` (linklər, source sitatları)

## Deploy — branch iş axını (AI BUNA UYĞUN DAVAM EDİR)

Reponun **tək branch-i var: `main` = PRODUCTION.** Push → Vercel dərhal canlı verir.

Riskli dəyişiklikdə belə işlə:

```bash
git checkout -b v24/<qisa-ad>     # 1. branch aç
# ... iş, build, verify (aşağıda) ...
git push -u origin v24/<qisa-ad>  # 2. push → Vercel PREVIEW deployment yaradır
# 3. Vercel dashboard-da Preview URL-i yoxla (dəyişməz zövq + verify)
git checkout main && git merge --no-ff v24/<qisa-ad> && git push  # 4. production
git branch -d v24/<qisa-ad>       # 5. branch sil
```

- **Preview vs Production nədir:** Vercel hər branch push-u üçün ayrıca **Preview** URL verir (main-ə toxunmur). `main`-ə merge = **Production**. Bu, səhvlərin canlını sındırmadan sınaq yolidir.
- Kiçik, təhlükəsiz düzəliş (mətn typo-su, tək fayl) → birbaşa `main`, amma verify PASS olmalıdır.
- ⛔ Vercel-də **`hypnos.dev` proyektini silmək/dəyişmək = DOMAIN İTİRMƏK** (sahibinin qəti qadağası). `hypnosdev` dublikatı artıq silinib — 1 proyekt qalıb.
- ⛔ `.env*` repoya düşmür (`RESEND_API_KEY` Vercel env-dədir, Production).

## Push-dan əvvəl — MƏCBURİ yoxlama (RED→GREEN)

```bash
bun run build                                   # tsc --noEmit + vite build
bun run preview -- --port 5174 --strictPort &   # server (arxada)
node tools/verify-v5.mjs http://localhost:5174/ # 28 yoxlama → VERDICT: PASS olmalıdır
bun run test:contact                            # api/contact qoruma testləri (9/9)
```

- Verify FAIL = **əvvəl serveri yoxla** (curl http://localhost:5174/), sonra kodu şübhələn.
- Dil dəyişimi + mobil yükləmə + preloader regressiyaları bu skriptdədir — "mən bilirəm, lazım deyil" DEYİL.

## Toxunulmazlar — köhnə AI-ların qan ilə öyrəndikləri

1. **Pərdə BÜTÜN kadrları gözləyir** (failsafe yalnız 20s). "Yükləməni optimallaşdırıb" pərdəni gözləmədən buraxmaq olmaz — sahibinin açıq qaydası.
2. **Dil dəyişimi = `key={lang}` TAM REMOUNT** (App.tsx). GSAP-i remount-dan qaçmağa məcbur ETMƏ (`dependencies:[copy]` həlləri textləri əbədi gizlədib). Video bərpası data layında həll olunur (blobCache + smooth=st.progress).
3. **blob keş + sinxron loadChunk rekursiyası = thread kilidi.** Zəncir async/iterativ qalır.
4. **Form: yalnız `/api/contact` + Resend.** FormSubmit/Web3Forms onun şəbəkəsindən bloklanıb (500/403) — istifadə ETMƏ.
5. **Breather / Interlude / Worlds grid — 2 dəfə rədd edilib.** Bir daha təklif ETMƏ.
6. **Lenis ikən proqramatik `scrollIntoView/scrollBy` ETMƏ** — `lenis.scrollTo` işlət.
7. **Kadrların tier xəritəsi:** leap `1440/960` · sapere `1440/1280` · counterweight `1440/1280` · speak `1280/854`. Başqa `frames-*` qovluqları istifadəsizdir.
8. **Sahibinin diktə etdiyi cümlələr müqəddəsdir** (QERARLAR §30 siyahısı) — mənasına toxunma, yazılışını hamarla.

## Yeni işdə qaydalar

- **Yeni fəsil:** `WORLDS` (lib/scroll.ts) + `App.tsx` sırası 1:1 — ikisi sürüşsə Backdrop rəngi bir fəsil geri qalır və bunu gözlə görmək çətindir.
- **Yeni "video":** mp4 → ffmpeg → WebP kadrlar (2 tier + poster + manifest.json) → `mountSequence`. Kadrlar ≤80 KB/frame, `n` sayı manifestdə. Detail: vault brief §3.4 + §5.1.
- **Mətn dəyişikliyi üç dildə paralel gedir** — EN dəyişirsə, AZ və TR də mənaca izləyir. `titles` də tərcümə olunur (Sapere aude istisna — Latin motto).
- `QERARLAR.md` + `KONSEPT.md` + `research/` gitignored-dır (lokal jurnal) — repoya əlavə ETMƏ.
- Hər sessiya sonunda: qərarları `QERARLAR.md`-ə və vault brief-in yeni nömrəli bölməsinə yaz, sahibin dediklərini onun sözləri ilə köçür.
