(async () => {
  const out = {};
  const stage = document.querySelector('.ring-stage');
  const cs = getComputedStyle(stage);
  out.vw = window.innerWidth;
  out.overflowX = document.documentElement.scrollWidth - window.innerWidth;
  out.r = cs.getPropertyValue('--ring-r').trim();
  out.cardW = cs.getPropertyValue('--card-w').trim();
  out.cardH = cs.getPropertyValue('--card-h').trim();
  out.step = cs.getPropertyValue('--ring-step').trim();

  const r = parseFloat(out.r), w = parseFloat(out.cardW);
  out.chord = +(2 * r * Math.sin(Math.PI / 6)).toFixed(1);
  out.overlap = out.chord < w;
  out.slack = +(out.chord - w).toFixed(1);

  // faktiki kart qutusu (3D proyeksiya deyil — layout ölçüsü)
  const card = document.querySelector('.q-card');
  out.cardOffsetW = card.offsetWidth;
  out.cardOffsetH = card.offsetHeight;

  // dünya kartları / fəsillər
  out.sections = document.querySelectorAll('.section').length;
  out.worldCards = document.querySelectorAll('.world-card').length;
  out.worldsCols = getComputedStyle(document.querySelector('.worlds__grid')).gridTemplateColumns.split(' ').length;
  out.ringArrowW = Math.round(document.querySelector('.ring-arrow').getBoundingClientRect().width);
  out.handsZoom = getComputedStyle(document.querySelector('.hands__zoom')).transform;

  // lazy şəkillər
  const H = document.documentElement.scrollHeight;
  for (let i = 0; i <= 12; i++) { window.scrollTo(0, H * i / 12); await new Promise(r2 => setTimeout(r2, 250)) }
  await new Promise(r2 => setTimeout(r2, 1200));
  out.imgs = [...document.images].map(i => ({ f: i.currentSrc.split('/').slice(-1)[0] || '(none)', ok: i.complete && i.naturalWidth > 0 }));
  out.overflowXAfter = document.documentElement.scrollWidth - window.innerWidth;
  window.scrollTo(0, 0);
  return JSON.stringify(out);
})()
