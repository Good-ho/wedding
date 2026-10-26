import { $, h } from '../util.js';

export function initGallery(items) {
  const grid = $('#gallery-grid');
  const box = $('#lightbox');
  const track = $('#lightbox-track');
  const count = $('#lightbox-count');
  const closeBtn = $('#lightbox-close');
  const prevBtn = $('#lightbox-prev');
  const nextBtn = $('#lightbox-next');
  let built = false;
  let opener = null;
  let raf = 0;

  items.forEach((it, i) => {
    const media = it.thumb || it.src
      ? h('img', { src: it.thumb || it.src, alt: it.alt || '', loading: 'lazy', decoding: 'async', width: '300', height: '400' })
      : h('span', { class: 'ph' });
    grid.append(h('button', {
      type: 'button', class: it.wide ? 'gallery__item gallery__item--wide' : 'gallery__item', 'aria-label': `사진 ${i + 1} 확대`,
      style: `--i:${i}`,
      onclick: (e) => open(i, e.currentTarget),
    }, media));
  });

  function build() {
    items.forEach((it) => {
      const src = it.src || it.thumb;
      // 라이트박스가 숨겨진 동안에는 lazy 이미지가 로드되지 않는다.
      track.append(h('div', { class: 'lightbox__slide' },
        src ? h('img', { src, alt: it.alt || '', loading: 'lazy', decoding: 'async' }) : h('span', { class: 'ph' })));
    });
    track.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateCount();
      });
    }, { passive: true });
    built = true;
  }

  const current = () => Math.min(Math.round(track.scrollLeft / (track.clientWidth || 1)), items.length - 1);

  function updateCount() {
    const i = current();
    count.textContent = `${i + 1} / ${items.length}`;
    prevBtn.hidden = i <= 0;
    nextBtn.hidden = i >= items.length - 1;
  }

  function go(d) {
    const i = Math.max(0, Math.min(current() + d, items.length - 1));
    track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
  }

  function open(i, from) {
    if (!built) build();
    opener = from;
    box.hidden = false;
    document.body.classList.add('lock');
    track.scrollLeft = i * track.clientWidth;
    updateCount();
    closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove('lock');
    if (opener) opener.focus({ preventScroll: true });
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
  });
}
