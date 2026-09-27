(async () => {
  const out = {};
  const cs = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null };
  out.vw = window.innerWidth;
  out.vh = window.innerHeight;
  out.overflowX = document.documentElement.scrollWidth - window.innerWidth;

  out.sections = [...document.querySelectorAll('.section')].map(s => s.dataset.world).length;
  out.worldsGridCols = cs('.worlds__grid').gridTemplateColumns.split(' ').length;
  out.ringArrowW = Math.round(document.querySelector('.ring-arrow').getBoundingClientRect().width);
  out.hintDisplay = cs('.questions__hint').display;
  out.handsZoom = cs('.hands__stage').transform;
  out.ringR = cs('.ring-stage').getPropertyValue('--ring-r').trim();
  out.speakFont = cs('.speak__question').fontSize;
  out.chapterNavLabels = cs('.chapter-nav__label').opacity;

  // lazy şəkilləri yükləmək üçün səhifəni sona qədər sürüşdür
  const H = document.documentElement.scrollHeight;
  for (let i = 0; i <= 12; i++) {
    window.scrollTo(0, H * i / 12);
    await new Promise(r => setTimeout(r, 260));
  }
  await new Promise(r => setTimeout(r, 1200));
  out.imgs = [...document.images].map(i => ({
    f: i.currentSrc.split('/').slice(-1)[0] || '(none)',
    ok: i.complete && i.naturalWidth > 0,
  }));
  out.overflowXAfter = document.documentElement.scrollWidth - window.innerWidth;

  // əl vəziyyəti mobil ekranda
  const hs = document.querySelector('.section--hands');
  window.scrollTo(0, hs.offsetTop + hs.offsetHeight * 0.32);
  await new Promise(r => setTimeout(r, 500));
  const rr = document.querySelector('.hands__hand--reach').getBoundingClientRect();
  const oo = document.querySelector('.hands__hand--open').getBoundingClientRect();
  out.handsMobile = {
    reach: [Math.round(rr.left), Math.round(rr.right), Math.round(rr.top), Math.round(rr.bottom)],
    open: [Math.round(oo.left), Math.round(oo.right), Math.round(oo.top), Math.round(oo.bottom)],
    gapPx: Math.round(oo.left - rr.right),
    heightPx: Math.round(rr.height),
  };
  window.scrollTo(0, 0);
  return JSON.stringify(out);
})()
