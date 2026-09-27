(async () => {
  const out = {};
  const ring = document.querySelector('.ring');
  const deg = (t) => {
    const m = t && t.match(/matrix3d\(([^)]+)\)/);
    if (!m) return null;
    const v = m[1].split(',').map(Number);
    return +(Math.atan2(-v[2], v[0]) * 180 / Math.PI).toFixed(2);
  };
  const now = () => deg(getComputedStyle(ring).transform);
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  // ⚠️ SCROLL ETMİRİK. Səbəb: `window.scrollTo` + Lenis rAF-ı birlikdə saxta
  // `scroll` hadisələri yaradır və `onScroll` kilid bitəndə hədəfi əzir.
  // Təmiz ölçmə üçün səhifə heç tərpənmir — yalnız oxlara kliklənir.
  out.startScrollY = Math.round(window.scrollY);
  out.r = getComputedStyle(document.querySelector('.ring-stage')).getPropertyValue('--ring-r').trim();

  const steps = [];
  for (let i = 0; i < 4; i++) {
    document.querySelector('.ring-arrow--next').click();
    await wait(3000);
    steps.push({
      click: i + 1,
      deg: now(),
      active: [...document.querySelectorAll('.q-card')].findIndex(c => c.dataset.front === '1'),
      count: document.querySelector('.questions__count').textContent.replace(/\s+/g, ' ').trim(),
    });
  }
  out.next = steps;
  out.nextDeltas = steps.slice(1).map((s, i) => +(s.deg - steps[i].deg).toFixed(2));

  // geri oxu
  document.querySelector('.ring-arrow--prev').click();
  await wait(3000);
  out.afterPrev = { deg: now(), active: [...document.querySelectorAll('.q-card')].findIndex(c => c.dataset.front === '1') };

  // klaviatura — fokus olmadan işləməməlidir, fokusla işləməlidir
  const stage = document.querySelector('.ring-stage');
  const before = now();
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  await wait(1500);
  out.keyWithoutFocus = { deg: now(), changed: Math.abs(now() - before) > 1 };

  stage.focus();
  const before2 = now();
  stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  await wait(3000);
  out.keyWithFocus = { deg: now(), delta: +(now() - before2).toFixed(2), changed: Math.abs(now() - before2) > 1 };

  // sürüşdürmə (drag) — sintetik pointer hadisələri
  const before3 = now();
  const r0 = stage.getBoundingClientRect();
  const cx = r0.left + r0.width / 2, cy = r0.top + r0.height / 2;
  stage.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, bubbles: true, button: 0, pointerType: 'mouse' }));
  for (let i = 1; i <= 8; i++) {
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx - i * 20, clientY: cy, bubbles: true, pointerType: 'mouse' }));
    await wait(40);
  }
  window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx - 160, clientY: cy, bubbles: true, pointerType: 'mouse' }));
  await wait(3000);
  out.drag = { before: before3, after: now(), delta: +(now() - before3).toFixed(2), moved: Math.abs(now() - before3) > 5 };

  out.finalScrollY = Math.round(window.scrollY);
  out.scrolled = out.finalScrollY !== out.startScrollY;
  return JSON.stringify(out);
})()
