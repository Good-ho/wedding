const root = document.documentElement;

export function detectQuality() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('fx-off');
    return 'none';
  }
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const q = cores <= 4 || mem <= 2 ? 'low' : 'high';
  root.dataset.quality = q;
  return q;
}

export const isLow = () => root.dataset.quality === 'low';

// 초기 1초의 프레임 속도가 낮으면 이후 연출(파티클 수 등)을 축소한다.
export function probeFps(ms = 1000) {
  let frames = 0;
  const t0 = performance.now();
  const loop = (t) => {
    frames++;
    if (t - t0 >= ms) {
      if ((frames * 1000) / (t - t0) < 40) root.dataset.quality = 'low';
      return;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
