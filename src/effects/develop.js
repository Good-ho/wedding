import { $, $$ } from '../util.js';

// 폴라로이드가 떨어져 놓인 뒤 실제 인스턴트 필름처럼 현상된다: 탁한 청록 → 빛바랜 흑백 → 원래 색.
// 톡 치면 흔들리고, 현상 중이면 흔드는 만큼 빨리 현상된다.
export function initDevelop() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      play(e.target);
    });
  }, { threshold: 0.3 });
  $$('[data-fx="develop"]').forEach((el) => {
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `${$('.polaroid__name', el).textContent} 사진 흔들기`);
    io.observe(el);
  });
}

function play(fig) {
  const tilt = parseFloat(fig.dataset.tilt || '0');
  const murk = $('.polaroid__murk', fig);
  const tint = $('.polaroid__tint', fig);
  const gray = $('.polaroid__gray', fig);
  const name = $('.polaroid__name', fig);
  const hint = $('.polaroid__hint', fig);

  gsap.fromTo(fig, { opacity: 0, y: -48, rotation: tilt - 7 },
    { opacity: 1, y: 0, rotation: tilt, duration: 0.75, ease: 'back.out(1.4)' });

  const dev = gsap.timeline({ delay: 0.5, onComplete: () => gsap.to(hint, { opacity: 0, duration: 0.4 }) })
    .to(hint, { opacity: 0.9, duration: 0.5 }, 0)
    .to(murk, { opacity: 0, duration: 2.4, ease: 'power1.inOut' }, 0)
    .to(tint, { opacity: 0, duration: 3.2, ease: 'power1.inOut' }, 0.8)
    .to(gray, { opacity: 0, duration: 3.4, ease: 'power1.in' }, 1.2)
    .fromTo(name, { clipPath: 'inset(-10px 100% -10px -10px)' },
      { clipPath: 'inset(-10px -10px -10px -10px)', duration: 0.9, ease: 'none' }, 1.4);

  let shaking = null;
  const shake = () => {
    if (shaking?.isActive()) return;
    if (dev.isActive()) dev.timeScale(Math.min(dev.timeScale() * 2, 6));
    shaking = gsap.timeline()
      .to(fig, { rotation: tilt - 6, x: -6, duration: 0.07, ease: 'power1.inOut' })
      .to(fig, { rotation: tilt + 6, x: 6, duration: 0.09, ease: 'power1.inOut', repeat: 3, yoyo: true })
      .to(fig, { rotation: tilt, x: 0, duration: 0.25, ease: 'back.out(3)' });
  };
  fig.addEventListener('click', shake);
  fig.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      shake();
    }
  });
}
