import { $ } from '../util.js';

let timer = 0;

export function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('show'), 1800);
}

export async function copyText(text, okMsg = '복사되었습니다') {
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('no-clipboard');
    await navigator.clipboard.writeText(text);
    toast(okMsg);
  } catch {
    toast(legacyCopy(text) ? okMsg : '복사하지 못했습니다. 직접 복사해 주세요');
  }
}

function legacyCopy(text) {
  const t = document.createElement('textarea');
  t.value = text;
  t.setAttribute('readonly', '');
  t.style.cssText = 'position:fixed;top:0;left:-9999px;font-size:16px';
  document.body.append(t);
  t.select();
  t.setSelectionRange(0, text.length);
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { /* 지원하지 않는 환경 */ }
  t.remove();
  return ok;
}
