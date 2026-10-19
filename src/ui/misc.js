import { $ } from '../util.js';
import { copyText } from './toast.js';

export function initFab() {
  const top = $('#fab-top');
  const bar = $('#progress');
  let raf = 0;
  const update = () => {
    raf = 0;
    top.hidden = window.scrollY < 600;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function loadKakao({ sdkVersion, integrity }) {
  return new Promise((resolve, reject) => {
    if (window.Kakao) { resolve(window.Kakao); return; }
    const s = document.createElement('script');
    s.src = `https://t1.kakaocdn.net/kakao_js_sdk/${sdkVersion}/kakao.min.js`;
    if (integrity) s.integrity = integrity;
    s.crossOrigin = 'anonymous';
    s.onload = () => resolve(window.Kakao);
    s.onerror = reject;
    document.head.append(s);
  });
}

function initKakao(share) {
  const { key } = share.kakao || {};
  if (!key) return;
  loadKakao(share.kakao).then((Kakao) => {
    if (!Kakao.isInitialized()) Kakao.init(key);
    const url = share.url || location.origin + location.pathname;
    const link = { mobileWebUrl: url, webUrl: url };
    const btn = $('#btn-kakao');
    btn.hidden = false;
    btn.addEventListener('click', () => {
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: { title: share.title, description: share.text, imageUrl: share.image || undefined, link },
        buttons: [{ title: '청첩장 보기', link }],
      });
    });
  }).catch(() => {});
}

export function initShare(share) {
  $('#btn-copy-link').addEventListener('click', () => copyText(location.href, '링크가 복사되었습니다'));
  initKakao(share);
  if (!navigator.share) return;
  const btn = $('#btn-share');
  btn.hidden = false;
  btn.addEventListener('click', () => {
    navigator.share({ title: share.title, text: share.text, url: location.href }).catch(() => {});
  });
}

export function initReveal() {
  const targets = [...document.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window)) {
    document.documentElement.classList.add('fx-off');
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  targets.forEach((t) => io.observe(t));
}

// 화면 밖의 CSS 루프(먼지, 보케, 비)를 멈춘다.
export function initLoopPause(selectors) {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-paused', !e.isIntersecting));
  });
  selectors.forEach((s) => { const el = $(s); if (el) io.observe(el); });
}
