#!/usr/bin/env python3
"""Tier downscale — mövcud WebP kadrlardan kiçik tier-lər yaradır.

v10 (29 sentyabr): canvasDpr=1 olduğundan 1920 kadrlar canvas-da onsuz da
kiçildilir — 1440 tier VİZUAL EYNİDIR, ~40% yüngüldür (research/11 §M1-a).
Mobil üçün leap-960 (research/11 §M6-a).

Niyə skript: 382 kadr əl ilə yox — LANCZOS + eyni keyfiyyət policy ilə.
"""
import os
import sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")

# (seqsiya, mənbə tier, hədəf tier, hədəf en)
JOBS = [
    ("leap", "frames-1920", "frames-1440", 1440),
    ("sapere", "frames-1920", "frames-1440", 1440),
    ("counterweight", "frames-1920", "frames-1440", 1440),
    ("leap", "frames-1280", "frames-960", 960),
]

QUALITY = 72   # mənbə kadr keyfiyyətinə uyğun (q82 yox — grainli kadrlarda şişir)
METHOD = 6     # ən yaxşı WebP sıxıcması (yavaş, amma bir dəfəlik iş)


def convert(args):
    seq, src_tier, out_tier, width = args
    src_dir = os.path.join(PUBLIC, seq, src_tier)
    out_dir = os.path.join(PUBLIC, seq, out_tier)
    os.makedirs(out_dir, exist_ok=True)
    files = sorted(f for f in os.listdir(src_dir) if f.endswith(".webp"))
    done = 0
    for f in files:
        out_path = os.path.join(out_dir, f)
        if os.path.exists(out_path):
            done += 1
            continue
        im = Image.open(os.path.join(src_dir, f))
        if im.width > width:
            h = round(im.height * width / im.width)
            im = im.resize((width, h), Image.LANCZOS)
        im.save(out_path, "WEBP", quality=QUALITY, method=METHOD)
        done += 1
    total = sum(os.path.getsize(os.path.join(out_dir, x)) for x in os.listdir(out_dir))
    return f"{seq}/{out_tier}: {done} kadr, {total/1e6:.1f} MB"


if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=4) as ex:
        for line in ex.map(convert, JOBS):
            print(line, flush=True)
    print("TAMAM")
