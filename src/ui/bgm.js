import { $ } from '../util.js';

export function initBgm(src) {
  const btn = $('#fab-bgm');
  if (!src) return { play() {} };
  btn.hidden = false;

  let audio = null;
  let playing = false;
  let resumeOnShow = false;

  const set = (v) => {
    playing = v;
    btn.setAttribute('aria-pressed', String(v));
    btn.setAttribute('aria-label', v ? '배경음악 일시정지' : '배경음악 재생');
  };

  async function play() {
    if (!audio) {
      audio = new Audio(src);
      audio.loop = true;
      audio.preload = 'none';
    }
    try {
      await audio.play();
      set(true);
      return true;
    } catch {
      set(false);
      return false;
    }
  }

  function pause() {
    if (audio) audio.pause();
    set(false);
  }

  btn.addEventListener('click', () => {
    disarm();
    playing ? pause() : play();
  });

  // 스크롤 제스처는 재생 권한을 주지 않으므로, 탭(click/touchend)이 성공할 때까지 재시도한다.
  const arm = ['click', 'touchend'];
  const onFirst = async (e) => {
    if (e.target.closest && e.target.closest('#fab-bgm')) return;
    if (await play()) disarm();
  };
  function disarm() { arm.forEach((t) => document.removeEventListener(t, onFirst)); }
  arm.forEach((t) => document.addEventListener(t, onFirst, { passive: true }));

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resumeOnShow = playing;
      if (playing) pause();
    } else if (resumeOnShow) {
      resumeOnShow = false;
      play();
    }
  });

  return { play };
}
