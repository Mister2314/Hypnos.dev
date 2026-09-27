(async () => {
  const out = {};
  const secs = [...document.querySelectorAll('.section')];
  out.sections = secs.map(s => s.dataset.world);
  out.count = secs.length;
  const H = document.documentElement.scrollHeight;
  out.docH = H;
  out.vh = window.innerHeight;

  const cs = () => getComputedStyle(document.documentElement);
  const probe = async (y) => {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 340));
    const s = cs();
    return { y: Math.round(y), bg: s.getPropertyValue('--bg').trim() };
  };
  out.sweep = [];
  for (let i = 0; i <= 24; i++) out.sweep.push(await probe(H * i / 24));

  const top = (sel) => { const e = document.querySelector(sel); return e ? Math.round(e.getBoundingClientRect().top) : null; };

  // hands sticky + hand transform at 3 points
  const handsSec = document.querySelector('.section--hands');
  out.hands = { offsetTop: Math.round(handsSec.offsetTop), h: Math.round(handsSec.offsetHeight) };
  out.handsFrames = [];
  for (const f of [0.02, 0.3, 0.9]) {
    window.scrollTo(0, handsSec.offsetTop + handsSec.offsetHeight * f);
    await new Promise(r => setTimeout(r, 380));
    const r1 = document.querySelector('.hands__hand--reach');
    const o1 = document.querySelector('.hands__hand--open');
    const rect = (e) => { const b = e.getBoundingClientRect(); return { l: Math.round(b.left), r: Math.round(b.right), top: Math.round(b.top), bot: Math.round(b.bottom) }; };
    out.handsFrames.push({
      f,
      stageTop: top('.hands__stage'),
      reach: rect(r1),
      open: rect(o1),
      gapPx: Math.round(o1.getBoundingClientRect().left - r1.getBoundingClientRect().right),
      sparkOpacity: getComputedStyle(document.querySelector('.hands__spark')).opacity,
    });
  }

  // speak chapter
  const sp = document.querySelector('.section--speak');
  out.speak = { h: Math.round(sp.offsetHeight) };
  window.scrollTo(0, sp.offsetTop + sp.offsetHeight * 0.55);
  await new Promise(r => setTimeout(r, 380));
  out.speakState = {
    stageTop: top('.speak__stage'),
    strikeScale: getComputedStyle(document.querySelector('.speak__strike')).transform,
    underScale: getComputedStyle(document.querySelector('.speak__underline')).transform,
    answerOpacity: getComputedStyle(document.querySelector('.speak__answer')).opacity,
    reflectOpacity: getComputedStyle(document.querySelector('.speak__reflect')).opacity,
  };

  // worlds
  window.scrollTo(0, document.querySelector('.section--worlds').offsetTop + 300);
  await new Promise(r => setTimeout(r, 380));
  out.worldCards = document.querySelectorAll('.world-card').length;

  // questions ring
  const q = document.querySelector('.section--questions');
  window.scrollTo(0, q.offsetTop);
  await new Promise(r => setTimeout(r, 500));
  const stage = document.querySelector('.ring-stage');
  out.ring = {
    step: getComputedStyle(stage).getPropertyValue('--ring-step').trim(),
    r: getComputedStyle(stage).getPropertyValue('--ring-r').trim(),
    arrows: document.querySelectorAll('.ring-arrow').length,
    cards: document.querySelectorAll('.q-card').length,
    ringTransform: getComputedStyle(document.querySelector('.ring')).transform,
  };
  // click next arrow
  document.querySelector('.ring-arrow--next').click();
  await new Promise(r => setTimeout(r, 900));
  out.afterNext = {
    ringTransform: getComputedStyle(document.querySelector('.ring')).transform,
    activeCard: [...document.querySelectorAll('.q-card')].findIndex(c => c.dataset.front === '1'),
    count: document.querySelector('.questions__count').textContent.replace(/\s+/g, ' ').trim(),
  };

  // marble
  const m = document.querySelector('.section--marble');
  window.scrollTo(0, m.offsetTop + m.offsetHeight * 0.5);
  await new Promise(r => setTimeout(r, 380));
  out.marble = { stageTop: top('.marble__stage'), bgTransform: getComputedStyle(document.querySelector('.marble__bg')).transform };

  // images + misc
  out.imgs = [...document.images].map(i => ({
    f: i.currentSrc.split('/').slice(-1)[0], nw: i.naturalWidth, nh: i.naturalHeight, ok: i.complete && i.naturalWidth > 0,
  }));
  out.overflowX = document.documentElement.scrollWidth > window.innerWidth + 1;
  out.horizontalOverflow = document.documentElement.scrollWidth - window.innerWidth;

  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 300));
  return JSON.stringify(out);
})()
