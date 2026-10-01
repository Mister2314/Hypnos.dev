# Khayal — Hypnos.dev

Personal site: **11 scenes, many worlds, one head.**

Four scroll-driven "video" chapters rendered from WebP frame sequences
(Spider-Verse · CMBYN hands · Merli · Arcane), a procedural SVG rule, film-grade
motion — all hand-written. No 3D library, no page builder.

## Stack

- Vite + React 19 + TypeScript
- GSAP (ScrollTrigger) + Lenis smooth scroll
- 2D-canvas frame sequences (FFmpeg-generated WebP, scroll-scrubbed)
- Zero runtime dependencies beyond React + GSAP — JS ~135 KB gzip

## Develop

```bash
bun install
bun run dev
```

## Build & verify (before every push)

```bash
bun run build                                   # tsc --noEmit + vite build
bun run preview -- --port 5174 --strictPort &   # server
node tools/verify-v5.mjs http://localhost:5174/ # 28 checks → must be PASS
bun run test:contact                            # contact API guard tests
```

## Structure

```
src/lib/sequence.ts   scroll-scrub video frames (poster-first, decode-ahead)
src/lib/scroll.ts     world driver — one writer, 11 scenes
src/lib/perf.ts       fixed performance config (DPR 1, adaptive tier)
src/lib/i18n.ts       all copy — EN / AZ / TR
src/sections/         one file per scene
public/*/frames-*     frame tiers: leap 1440/960 · sapere 1440/1280 ·
                      counterweight 1440/1280 · speak 1280/854
api/contact.ts        contact form → Resend (honeypot + length caps + IP limit)
tools/                CDP verification + API guard tests
```

## Deploy

Vercel — builds from source on push. `main` = production; other branches get
preview URLs. AI workflow + untouchables: `AGENTS.md`.
