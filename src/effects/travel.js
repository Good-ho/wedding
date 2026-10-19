import { $, $$ } from '../util.js';

const KEY = 'atw-opened';
const HOLD = 1.2; // 초
const CIRC = 276.5; // 프로그레스 링 둘레(r=44)
const AJAR = 9; // 꾹 누르는 동안 코트가 벌어지는 정도(xPercent)

// 벽장 게이트: 꾹 누르면 코트가 살짝 벌어지며 문틈이 넓어지고, 놓으면 빛의 틈으로 걸어 나가며 표지가 나타난다.
export function initTravel({ onGesture, enabled = true } = {}) {
  const root = document.documentElement;
  const gate = $('#gate');
  const ui = $('#gate-ui');
  const btn = $('#gate-btn');
  const ring = $('#gate-ring');
  const hint = $('#gate-hint');
  const skip = $('#gate-skip');
  const light = $('#gate-light');
  const coatL = $('#coats-l');
  const coatR = $('#coats-r');
  const front = $('#coats-front');
  const bg = $('.gate__bg');
  const flash = $('.intro__flash');
  const leak = $('#intro .leak');
  const scenes = $$('.cover__scene');
  const blur = $('.cover__scene--blur');
  const life = $('.cover__life');
  const swash = $('.swash path');
  const cover = $$('[data-cover]');

  let holding = false;
  let ready = false;
  let done = false;
  let holdTl = null;
  let readyTimer = 0;

  gsap.set(scenes, { scale: 1.07 });

  const unlock = () => root.classList.remove('gated');
  const remember = () => { try { sessionStorage.setItem(KEY, '1'); } catch { /* 저장 불가 환경 */ } };
  const buzz = (ms) => { if (navigator.vibrate) navigator.vibrate(ms); };

  function revealCover() {
    const [names, lead, date, dday, scroll] = cover;
    gsap.timeline({ defaults: { ease: 'power2.out' } })
      .to(scenes, { scale: 1, duration: 3.4 }, 0)
      .to(life, { opacity: 1, duration: 1.4, ease: 'power1.out' }, 0.2)
      .to(swash, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.3)
      .fromTo(names, { opacity: 0, y: 10, scale: 1.08 }, { opacity: 1, y: 0, scale: 1, duration: 1.1 }, 1.0)
      .fromTo(lead, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 1.5)
      .fromTo([date, dday], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, 1.8)
      .fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.4)
      .set(cover, { clearProps: 'transform,willChange' });
  }

  function close() {
    gate.style.display = 'none';
    window.scrollTo(0, 0);
    unlock();
    remember();
  }

  // 놓는 순간: 빛의 틈으로 밀고 들어가고(가까운 코트일수록 빨리 스쳐 지나감), 필름 빛샘이 쓸고 지나간 뒤 표지에 초점이 맞는다.
  function travel() {
    if (done) return;
    done = true;
    clearTimeout(readyTimer);
    if (holdTl) holdTl.kill();
    gsap.timeline()
      .to(ui, { opacity: 0, duration: 0.2 }, 0)
      .to(bg, { scale: 2.4, transformOrigin: '50% 45%', duration: 0.95, ease: 'power2.in' }, 0)
      .to(front, { scale: 3.4, transformOrigin: '50% 45%', duration: 0.8, ease: 'power2.in' }, 0)
      .to(coatL, { xPercent: -40, duration: 0.95, ease: 'power2.in' }, 0)
      .to(coatR, { xPercent: 40, duration: 0.95, ease: 'power2.in' }, 0)
      .to(light, { scaleX: 6, opacity: 1, duration: 0.85, ease: 'power2.in' }, 0)
      .fromTo(leak, { xPercent: -45, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.7, ease: 'power1.out' }, 0.3)
      .to(flash, { opacity: 1, duration: 0.3, ease: 'power2.in' }, 0.65)
      .add(close)
      .addLabel('open')
      .to(flash, { opacity: 0, duration: 1.4, ease: 'power2.out' }, 'open')
      .to(leak, { xPercent: 45, duration: 2, ease: 'power1.inOut' }, 'open')
      .to(leak, { opacity: 0, duration: 1.3, ease: 'power1.in' }, 'open+=0.7')
      .to(blur, { opacity: 0, duration: 1.6, ease: 'power1.out' }, 'open+=0.2')
      .add(revealCover, 'open+=0.45');
  }

  function fade() {
    if (done) return;
    done = true;
    clearTimeout(readyTimer);
    if (holdTl) holdTl.kill();
    gsap.to(blur, { opacity: 0, duration: 1.2 });
    gsap.to(gate, { opacity: 0, duration: 0.6, onComplete: close });
    gsap.delayedCall(0.25, revealCover);
  }

  function start(e) {
    if (done || holding) return;
    holding = true;
    ready = false;
    hint.textContent = '';
    btn.classList.remove('ready');
    try { btn.setPointerCapture(e.pointerId); } catch { /* 지원하지 않는 환경 */ }
    buzz(8);
    // 판정은 프레임 속도와 무관하게 벽시계 시간으로 한다(저사양 기기 대응).
    readyTimer = setTimeout(() => {
      ready = true;
      btn.classList.add('ready');
      hint.textContent = '이제 손을 놓으세요';
      buzz(20);
    }, HOLD * 1000);
    holdTl = gsap.timeline();
    holdTl
      .fromTo(ring, { strokeDashoffset: CIRC }, { strokeDashoffset: 0, duration: HOLD, ease: 'none' }, 0)
      .to(coatL, { xPercent: -AJAR, duration: HOLD, ease: 'power2.in' }, 0)
      .to(coatR, { xPercent: AJAR, duration: HOLD, ease: 'power2.in' }, 0)
      .to(front, { scale: 1.06, transformOrigin: '50% 45%', duration: HOLD, ease: 'power2.in' }, 0)
      .to(light, { scaleX: 1, opacity: 1, duration: HOLD, ease: 'power2.in' }, 0);
  }

  function release(commit) {
    if (!holding) return;
    holding = false;
    clearTimeout(readyTimer);
    if (ready && commit) {
      onGesture?.(); // 손을 뗀 이벤트 안에서 호출해야 iOS가 재생을 허용한다
      travel();
      return;
    }
    holdTl.kill();
    ready = false;
    btn.classList.remove('ready');
    gsap.to(ring, { strokeDashoffset: CIRC, duration: 0.3 });
    gsap.to([coatL, coatR], { xPercent: 0, duration: 0.4, ease: 'power2.out' });
    gsap.to(front, { scale: 1, duration: 0.4, ease: 'power2.out' });
    gsap.to(light, { scaleX: 0.05, opacity: 0.8, duration: 0.4 });
    if (commit) {
      hint.textContent = '조금만 더 꾹 눌러 주세요';
      gsap.fromTo(hint, { x: -5 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    }
  }

  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', () => release(true));
  btn.addEventListener('pointercancel', () => release(false));
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
  btn.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
      e.preventDefault();
      onGesture?.();
      travel();
    }
  });
  skip.addEventListener('click', () => {
    onGesture?.();
    fade();
  });

  // 게이트를 끄면 표지가 바로 초점을 맞추며 나타난다. BGM은 첫 터치에서 재생된다(bgm.js).
  if (!enabled) {
    done = true;
    gate.style.display = 'none';
    unlock();
    gsap.to(blur, { opacity: 0, duration: 1.6, ease: 'power1.out', delay: 0.2 });
    gsap.delayedCall(0.45, revealCover);
    return;
  }

  // 같은 세션에서 다시 열면 게이트를 건너뛴다.
  let seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch { /* 저장 불가 환경 */ }
  if (seen) {
    done = true;
    gate.style.display = 'none';
    unlock();
    gsap.set(cover, { opacity: 1 });
    gsap.set(scenes, { scale: 1 });
    gsap.set([blur], { opacity: 0 });
    gsap.set(life, { opacity: 1 });
    gsap.set(swash, { strokeDashoffset: 0 });
  }
}
