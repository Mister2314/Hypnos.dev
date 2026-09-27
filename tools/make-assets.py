#!/usr/bin/env python3
"""Xam generasiya PNG-lərini sayt üçün WebP-ə çevirir.

Nə edir:
  * əllər  → alfa kanalı var; ətrafı kəsilir (bbox), kəsilmiş ölçü + bilək tərəfi
              hesablanır → `public/hands/*.webp` + `hands.json` metadata
  * səhnələr → alfa yoxdur; sadəcə ölçü kiçildilir → `public/scenes/*.webp`

Niyə skript: əlverişli ölçü/pozisiya əl ilə təxmin edilməsin — rəqəm hesablanır.
"""
import json
import os
from PIL import Image

ROOT = r"C:\Users\Morpheus\Desktop\khayal-site"
GEN = os.path.join(ROOT, "source", "gen")
OUT_HANDS = os.path.join(ROOT, "public", "hands")
OUT_SCENES = os.path.join(ROOT, "public", "scenes")
os.makedirs(OUT_HANDS, exist_ok=True)
os.makedirs(OUT_SCENES, exist_ok=True)


def edge_mass(alpha, w, h, band=24):
    """-> (sol kənar sıxlığı, sağ kənar sıxlığı) 0..1"""
    px = alpha.load()
    step_y = max(1, h // 200)
    left = right = 0
    n = 0
    for y in range(0, h, step_y):
        for x in range(band):
            if px[x, y] > 32:
                left += 1
            if px[w - 1 - x, y] > 32:
                right += 1
        n += 1
    denom = max(1, n * band)
    return left / denom, right / denom


def trim_alpha(im, pad=8):
    """Alfa bbox-ına kəs, ətrafına `pad` şəffaf boşluq qoy."""
    a = im.getchannel("A")
    bbox = a.getbbox()
    if not bbox:
        return im, (0, 0, im.width, im.height)
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width, x1 + pad)
    y1 = min(im.height, y1 + pad)
    return im.crop((x0, y0, x1, y1)), (x0, y0, x1, y1)


def fit(im, max_w):
    if im.width <= max_w:
        return im
    h = round(im.height * max_w / im.width)
    return im.resize((max_w, h), Image.LANCZOS)


def do_hand(src, name, max_w=1200):
    im = Image.open(src).convert("RGBA")
    im, bbox = trim_alpha(im, pad=10)
    l, r = edge_mass(im.getchannel("A"), im.width, im.height)
    im = fit(im, max_w)
    dst = os.path.join(OUT_HANDS, name + ".webp")
    im.save(dst, "WEBP", quality=88, method=6, lossless=False)
    return {
        "file": name + ".webp",
        "w": im.width,
        "h": im.height,
        "kb": round(os.path.getsize(dst) / 1024, 1),
        "wrist": "left" if l > r else "right",
        "edgeL": round(l, 3),
        "edgeR": round(r, 3),
        "srcBBox": list(bbox),
    }


def do_scene(src, name, max_w=1600, quality=80):
    im = Image.open(src).convert("RGB")
    im = fit(im, max_w)
    dst = os.path.join(OUT_SCENES, name + ".webp")
    im.save(dst, "WEBP", quality=quality, method=6)
    return {"file": name + ".webp", "w": im.width, "h": im.height,
            "kb": round(os.path.getsize(dst) / 1024, 1)}


files = sorted(os.listdir(GEN))
hands = [f for f in files if "classical_white" in f]
scenes = [f for f in files if "classical_white" not in f]

report = {"hands": [], "scenes": []}

# generasiya sırası: [0] = soldan gələn (reaching), [1] = sağdan gələn (receiving)
names = ["hand-reach", "hand-open"]
for i, f in enumerate(hands[:2]):
    report["hands"].append(do_hand(os.path.join(GEN, f), names[i]))

for f in scenes:
    if "colonnade" in f:
        report["scenes"].append(do_scene(os.path.join(GEN, f), "rome-colonnade", 1600, 80))
    else:
        report["scenes"].append(do_scene(os.path.join(GEN, f), "summer-apricots", 1500, 80))

with open(os.path.join(OUT_HANDS, "hands.json"), "w", encoding="utf-8") as fh:
    json.dump(report, fh, indent=2, ensure_ascii=False)

print(json.dumps(report, indent=2, ensure_ascii=False))
