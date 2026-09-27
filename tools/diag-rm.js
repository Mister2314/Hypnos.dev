(async () => {
  const out = {};
  const cs = (s) => getComputedStyle(document.querySelector(s));
  out.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  out.sections = [...document.querySelectorAll('.section')].map(s => s.dataset.world);
  out.count = out.sections.length;

  out.handsTransform = {
    reach: cs('.hands__hand--reach').transform,
    open: cs('.hands__hand--open').transform,
    sparkDisplay: cs('.hands__spark').display,
    captionOpacity: cs('.hands__caption').opacity,
  };

  out.speak = {
    strike: cs('.speak__strike').transform,
    underline: cs('.speak__underline').transform,
    answer: cs('.speak__answer').opacity,
    reflect: cs('.speak__reflect').opacity,
  };

  const rv = [...document.querySelectorAll('.rv')];
  out.rv = { n: rv.length, hidden: rv.filter(e => +getComputedStyle(e).opacity < 0.9).length };

  const wc = [...document.querySelectorAll('.world-card')];
  out.worldCards = { n: wc.length, hidden: wc.filter(c => +getComputedStyle(c).opacity < 0.9).length };

  out.ring = {
    static: document.querySelector('.ring-stage').dataset.static || null,
    r: getComputedStyle(document.querySelector('.ring-stage')).getPropertyValue('--ring-r').trim(),
  };

  out.imgs = [...document.images].map(i => ({ f: i.currentSrc.split('/').slice(-1)[0], ok: i.complete && i.naturalWidth > 0 }));
  out.overflowX = document.documentElement.scrollWidth - window.innerWidth;
  out.worldsGridCols = getComputedStyle(document.querySelector('.worlds__grid')).gridTemplateColumns.split(' ').length;
  out.ringArrowW = Math.round(document.querySelector('.ring-arrow').getBoundingClientRect().width);
  out.hintDisplay = getComputedStyle(document.querySelector('.questions__hint')).display;
  return JSON.stringify(out);
})()
