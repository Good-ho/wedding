export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// textContent만 사용하므로 config 값이 HTML로 해석되지 않는다.
export function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  kids.flat().forEach((c) => c != null && el.append(c));
  return el;
}

export const pad = (n) => String(n).padStart(2, '0');
export const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

// 날짜/시간은 모두 KST 기준. 기기 시간대와 무관하게 계산한다.
export function parseWedding(w) {
  const [y, m, d] = w.date.split('-').map(Number);
  const [hh, mm] = w.time.split(':').map(Number);
  return {
    y, m, d, hh, mm,
    ts: Date.parse(`${w.date}T${w.time}:00+09:00`),
    dow: new Date(Date.UTC(y, m - 1, d)).getUTCDay(),
  };
}

export function ddayOf(p) {
  const n = new Date(Date.now() + 9 * 3600e3);
  const today = Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate());
  return Math.round((Date.UTC(p.y, p.m - 1, p.d) - today) / 86400000);
}

export function timeKo(hh, mm) {
  const label = hh < 12 ? '오전' : hh === 12 ? '낮' : '오후';
  const h12 = hh > 12 ? hh - 12 : hh === 0 ? 12 : hh;
  return `${label} ${h12}시${mm ? ` ${mm}분` : ''}`;
}

export function dateKo(p) {
  return `${p.y}년 ${p.m}월 ${p.d}일 ${WEEK[p.dow]}요일`;
}
