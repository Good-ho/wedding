import { $, $$ } from '../util.js';

// 페이지 끝: 표지의 해변으로 돌아와 해가 수평선 아래로 지고 하늘이 저물며 별이 뜬다.
export function initSunset() {
  if (!('IntersectionObserver' in window)) return;
  const footer = $('#footer');
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    play(footer);
  }, { threshold: 0.45 });
  io.observe(footer);
}

function play(footer) {
  const sun = $('.sunset__sun', footer);
  const red = $('.sunset__disc--red', footer);
  const sky = $('.sunset__sky', footer);
  const sea = $('.sunset__sea', footer);
  const stars = $$('.sunset__stars circle', footer);

  gsap.set($('.sunset__stars', footer), { opacity: 1 });
  gsap.set(stars, { opacity: 0 });
  gsap.timeline({ defaults: { ease: 'sine.inOut' } })
    .to(sun, { y: 48, duration: 5 }, 0)
    .to(red, { opacity: 1, duration: 3 }, 0.5)
    .to(sky, { opacity: 0.62, duration: 5.5 }, 0.6)
    .to(sea, { opacity: 0.3, duration: 5 }, 1)
    .to(stars, { opacity: 0.9, duration: 1.2, stagger: 0.35, ease: 'power1.out' }, 4.2);
}
