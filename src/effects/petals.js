import { $ } from '../util.js';
import { isLow } from '../quality.js';

const MAX_PETALS = 40;
const rnd = (a, b) => a + Math.random() * (b - a);
let layer;

function petal() {
  const el = document.createElement('i');
  const w = rnd(9, 15);
  el.className = 'petal';
  el.style.width = `${w.toFixed(1)}px`;
  el.style.height = `${(w * 1.3).toFixed(1)}px`;
  el.style.setProperty('--c', Math.random() < 0.5 ? 'var(--petal-1)' : 'var(--petal-2)');
  layer.append(el);
  return el;
}

function fall(el, x, y, delay = 0) {
  const h = window.innerHeight;
  const dur = rnd(6, 10) * (0.4 + (0.6 * Math.max(h - y, 0)) / h);
  gsap.set(el, { x, y, rotation: rnd(0, 360) });
  gsap.timeline({ delay, onComplete: () => el.remove() })
    .to(el, { y: h + 30, duration: dur, ease: 'none' }, 0)
    .to(el, { x: `+=${rnd(-70, 70)}`, duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
    .to(el, { rotation: `+=${rnd(-300, 300)}`, duration: dur, ease: 'none' }, 0);
}

function rain(n) {
  for (let i = 0; i < n; i++) {
    if (layer.childElementCount >= MAX_PETALS) return;
    fall(petal(), rnd(0, window.innerWidth), -30, i * 0.3);
  }
}

function burst(x, y, n) {
  for (let i = 0; i < n; i++) {
    if (layer.childElementCount >= MAX_PETALS) return;
    const el = petal();
    gsap.set(el, { x, y });
    gsap.to(el, {
      x: x + rnd(-110, 110),
      y: y - rnd(30, 100),
      duration: 0.45,
      ease: 'power2.out',
      onComplete: () => fall(el, gsap.getProperty(el, 'x'), gsap.getProperty(el, 'y')),
    });
  }
}

// 인사말이 보이면 꽃잎이 내리고, 카운트다운을 탭하면 꽃잎이 흩날린다.
export function initPetals() {
  layer = document.createElement('div');
  layer.className = 'petals';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);

  const greeting = $('#greeting');
  if ('IntersectionObserver' in window && greeting) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      rain(isLow() ? 7 : 14);
    }, { threshold: 0.5 });
    io.observe(greeting);
  }

  const count = $('#count');
  if (count) count.addEventListener('click', (e) => burst(e.clientX, e.clientY, isLow() ? 6 : 10));
}
