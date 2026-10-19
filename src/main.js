import { config } from './config.js';
import { detectQuality, probeFps } from './quality.js';
import { renderAll } from './render.js';
import { initCountdown } from './ui/countdown.js';
import { initGallery } from './ui/gallery.js';
import { initBgm } from './ui/bgm.js';
import { initFab, initShare, initReveal, initLoopPause } from './ui/misc.js';
import { initTravel } from './effects/travel.js';
import { initDevelop } from './effects/develop.js';
import { initSunset } from './effects/sunset.js';
import { initPetals } from './effects/petals.js';

const root = document.documentElement;
window.__ready = true;

try {
  const wedding = renderAll(config);
  initCountdown(wedding, config.wedding.durationHours);

  const gallery = config.gallery.length
    ? config.gallery
    : Array.from({ length: config.galleryPlaceholderCount }, () => ({}));
  initGallery(gallery);
  const bgm = initBgm(config.bgm.src);
  initFab();
  initShare(config.share);
  initReveal();
  initLoopPause(['#intro']);

  const quality = detectQuality();
  if (quality === 'none' || !window.gsap) {
    root.classList.add('fx-off');
  } else {
    if (config.intro.gate) root.classList.add('gate-on');
    initTravel({ onGesture: () => bgm.play(), enabled: config.intro.gate });
    initDevelop();
    initSunset();
    initPetals();
    probeFps();
  }
} catch (err) {
  // 연출/렌더 중 오류가 나도 콘텐츠는 보이도록 한다.
  console.error(err);
  root.classList.add('fx-off');
}
