(async () => {
  const out = {};
  const q = document.querySelector('.section--questions');
  const stage = document.querySelector('.ring-stage');
  const ring = document.querySelector('.ring');

  out.qOffsetTop = Math.round(q.offsetTop);
  out.qRectTopPlusScroll = Math.round(q.getBoundingClientRect().top + window.scrollY);
  out.qHeight = Math.round(q.offsetHeight);
  out.vh = window.innerHeight;

  // rAF kadr sayğacı — gsap.ticker-in işləyib-işləmədiyini bilmək üçün
  let frames = 0;
  let stop = false;
  const count = () => { if (!stop) { frames++; requestAnimationFrame(count) } };
  requestAnimationFrame(count);

  const deg = (t) => {
    if (!t || t === 'none') return null;
    const m = t.match(/matrix3d\(([^)]+)\)/);
    if (m) {
      const v = m[1].split(',').map(Number);
      return +(Math.atan2(-v[2], v[0]) * 180 / Math.PI).toFixed(2); // m31 = -sin, m11 = cos
    }
    const m2 = t.match(/matrix\(([^)]+)\)/);
    if (m2) { const v = m2[1].split(',').map(Number); return +(Math.atan2(v[1], v[0]) * 180 / Math.PI).toFixed(2) }
    return null;
  };

  window.scrollTo(0, q.offsetTop);
  await new Promise(r => setTimeout(r, 900));
  out.scrollYAfterSet = Math.round(window.scrollY);
  out.r = getComputedStyle(stage).getPropertyValue('--ring-r').trim();
  out.stageW = stage.clientWidth;
  out.before = deg(getComputedStyle(ring).transform);

  const f0 = frames;
  const t0 = performance.now();
  document.querySelector('.ring-arrow--next').click();
  out.poll = [];
  for (let i = 0; i < 8; i++) {
    await new Promise(r => setTimeout(r, 250));
    out.poll.push({ ms: Math.round(performance.now() - t0), deg: deg(getComputedStyle(ring).transform), frames: frames - f0 });
  }
  out.activeCard = [...document.querySelectorAll('.q-card')].findIndex(c => c.dataset.front === '1');
  out.count = document.querySelector('.questions__count').textContent.replace(/\s+/g, ' ').trim();

  // ikinci klik
  document.querySelector('.ring-arrow--next').click();
  await new Promise(r => setTimeout(r, 2000));
  out.after2 = deg(getComputedStyle(ring).transform);

  // kart eni / radius nisbəti — üst-üstə düşmə yoxlaması
  const card = document.querySelector('.q-card');
  out.cardW = Math.round(card.getBoundingClientRect().width);
  out.cardH = Math.round(card.getBoundingClientRect().height);
  const r = parseFloat(out.r);
  out.chord = +(2 * r * Math.sin(Math.PI / 6)).toFixed(1);
  out.overlap = out.chord < out.cardW;

  stop = true;
  window.scrollTo(0, 0);
  return JSON.stringify(out);
})()
