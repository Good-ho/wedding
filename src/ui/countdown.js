import { $, ddayOf } from '../util.js';

export function initCountdown(p, durationHours) {
  const end = p.ts + durationHours * 3600e3;
  const cells = Object.fromEntries([...document.querySelectorAll('#count [data-u]')].map((el) => [el.dataset.u, el]));
  const msg = $('#dday-msg');
  const badge = $('#intro-dday');
  let last = '';

  function set(d, h, m, s) {
    const v = [d, h, m, s].map((n) => String(n).padStart(2, '0'));
    const key = v.join(':');
    if (key === last) return;
    last = key;
    cells.d.textContent = v[0];
    cells.h.textContent = v[1];
    cells.m.textContent = v[2];
    cells.s.textContent = v[3];
  }

  function tick() {
    const now = Date.now();
    const diff = p.ts - now;
    const dd = ddayOf(p);

    if (diff > 0) {
      const t = Math.floor(diff / 1000);
      set(Math.floor(t / 86400), Math.floor((t % 86400) / 3600), Math.floor((t % 3600) / 60), t % 60);
      if (dd === 0) {
        msg.textContent = badge.textContent = '오늘 결혼식입니다';
      } else {
        badge.textContent = `D-${dd}`;
        msg.textContent = `결혼식까지 D-${dd}`;
      }
      return true;
    }
    set(0, 0, 0, 0);
    if (now < end) {
      msg.textContent = badge.textContent = '예식이 진행 중입니다';
      return true;
    }
    msg.textContent = '축복해 주셔서 감사합니다';
    badge.textContent = 'THANK YOU';
    return false;
  }

  if (!tick()) return;
  const id = setInterval(() => {
    if (document.hidden) return;
    if (!tick()) clearInterval(id);
  }, 1000);
}
