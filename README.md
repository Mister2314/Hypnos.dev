# Khayal — Hypnos.dev

Personal site: **15 chapters, many worlds, one head.**

Spider-Verse · Arcane · Call Me By Your Name · Sapere Aude — four rendered video
worlds, a procedural pond, wind-driven grass, film grain — all scroll-driven,
all hand-written. No 3D library, no page builder.

## Stack

- Vite + React 19 + TypeScript
- GSAP (ScrollTrigger) + Lenis smooth scroll
- Hand-written WebGL (film overlay, procedural pond) and 2D-canvas video
  sequences (FFmpeg-generated WebP frames, scroll-scrubbed)
- Zero runtime dependencies beyond React + GSAP — JS budget 135 KB gzip

## Develop

```bash
bun install
bun run dev
```

## Build & preview

```bash
bun run build
bun run preview
```

## Structure

```
src/lib/sequence.ts   scroll-scrub video frames (poster-first, decode-ahead)
src/lib/scroll.ts     world driver — one writer, 15 chapters
src/lib/perf.ts       fixed performance config (LOW by default)
src/sections/         one file per chapter
public/*/frames-*     WebP frame sequences per video chapter
tools/                CDP verification and diagnostics scripts
```

## Deploy

Vercel — builds from source on push.
