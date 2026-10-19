import { $, h, WEEK, parseWedding, dateKo, timeKo } from './util.js';
import { copyText } from './ui/toast.js';

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const rnd = (a, b) => a + Math.random() * (b - a);

function renderPolaroid(fig, person, role, roleEn) {
  const media = () => (person.photo
    ? h('img', { src: person.photo, alt: '', loading: 'lazy', decoding: 'async' })
    : h('div', { class: 'ph-warm', text: 'photo' }));
  const main = media();
  if (person.photo) main.alt = `${role} ${person.name}`;
  fig.append(
    h('span', { class: 'tape', 'aria-hidden': 'true' }),
    h('div', { class: 'polaroid__photo' }, main,
      h('div', { class: 'polaroid__layer polaroid__gray', 'aria-hidden': 'true' }, media()),
      h('div', { class: 'polaroid__layer polaroid__tint' }),
      h('div', { class: 'polaroid__layer polaroid__murk' })),
    h('figcaption', { class: 'polaroid__cap' },
      h('span', { class: 'polaroid__role', text: roleEn }),
      h('span', { class: 'polaroid__name', text: person.name }),
      h('span', { class: 'polaroid__parents', text: `${person.father} · ${person.mother}의 ${person.order}` }),
      h('span', { class: 'polaroid__hint', 'aria-hidden': 'true', text: '톡 치면 흔들려요' })));
}

// 벽장의 먼지와 표지의 보케. 장식용이라 JS가 만든다.
function renderAmbient(cover) {
  const dust = $('#gate-dust');
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('i');
    el.style.setProperty('--x', `${rnd(34, 66).toFixed(1)}%`);
    el.style.setProperty('--s', `${rnd(2, 4.5).toFixed(1)}px`);
    el.style.setProperty('--d', `${rnd(7, 13).toFixed(1)}s`);
    el.style.setProperty('--l', `-${rnd(0, 12).toFixed(1)}s`);
    el.style.setProperty('--dx', `${rnd(-28, 28).toFixed(0)}px`);
    dust.append(el);
  }
  const bokeh = $('#bokeh');
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('i');
    el.style.setProperty('--x', `${rnd(2, 84).toFixed(1)}%`);
    el.style.setProperty('--y', `${rnd(4, 58).toFixed(1)}%`);
    el.style.setProperty('--s', `${rnd(30, 88).toFixed(0)}px`);
    el.style.setProperty('--d', `${rnd(6, 12).toFixed(1)}s`);
    el.style.setProperty('--l', `-${rnd(0, 8).toFixed(1)}s`);
    bokeh.append(el);
  }
  // 바다 위 햇빛 반사(scene.svg의 반사 띠와 같은 삼각형 영역)에 반짝임을 뿌린다.
  const glints = $('#glints');
  for (let i = 0; i < 22; i++) {
    const y = rnd(528, 690);
    const half = 23 + (126 * (y - 525)) / 147;
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    el.setAttribute('class', 'glint');
    el.setAttribute('cx', (195 + rnd(-half, half)).toFixed(1));
    el.setAttribute('cy', y.toFixed(1));
    el.setAttribute('rx', rnd(2, 5.5).toFixed(1));
    el.setAttribute('ry', rnd(0.7, 1.3).toFixed(1));
    el.style.setProperty('--d', `${rnd(1.6, 3.4).toFixed(1)}s`);
    el.style.setProperty('--l', `-${rnd(0, 3.4).toFixed(1)}s`);
    glints.append(el);
  }
  if (cover) {
    const img = $('#cover-photo');
    img.src = cover;
    img.hidden = false;
  }
}

function renderCalendar(p) {
  const cal = $('#calendar');
  const first = new Date(Date.UTC(p.y, p.m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(p.y, p.m, 0)).getUTCDate();
  cal.append(h('div', { class: 'cal__head', text: `${p.y}년 ${p.m}월` }));
  WEEK.forEach((w, i) => cal.append(h('div', { class: `cal__dow${i === 0 ? ' is-sun' : ''}`, text: w })));
  for (let i = 0; i < first; i++) cal.append(h('div'));
  for (let d = 1; d <= days; d++) {
    const cls = ['cal__day'];
    if ((first + d - 1) % 7 === 0) cls.push('is-sun');
    if (d === p.d) cls.push('is-wedding');
    cal.append(h('div', { class: cls.join(' '), text: String(d) }));
  }
}

function renderMap(w) {
  const { kakao, naver } = w.map;
  const q = new URLSearchParams({ t: kakao.timestamp, k: kakao.key, q: w.venue });
  // 지도는 별도 문서(iframe)로 격리해, 화면 근처에 올 때만 불러오고 실패해도 본문에 영향이 없다.
  $('#map-box').append(h('iframe', { src: `map.html?${q}`, title: `${w.venue} 위치 지도`, loading: 'lazy' }));

  $('#map-place').append(
    h('strong', { text: [w.venue, w.hall].filter(Boolean).join(' ') }),
    h('span', { text: w.address }));

  $('#map-links').append(
    h('button', { type: 'button', class: 'btn btn--small', text: '주소 복사',
      onclick: () => copyText(w.address, '주소가 복사되었습니다') }),
    h('a', { class: 'btn btn--small', href: naver, target: '_blank', rel: 'noopener', text: '길찾기' }));

  const list = $('#transport');
  w.transport.forEach((t) => list.append(h('li', {},
    h('b', { text: t.label }),
    h('span', {}, t.text, t.sub ? h('small', { text: t.sub }) : null))));
}

function renderAccounts(accounts) {
  const box = $('#accounts');
  [['groom', '신랑측 계좌번호'], ['bride', '신부측 계좌번호']].forEach(([key, title]) => {
    const rows = accounts[key] || [];
    if (!rows.length) return;
    const d = h('details', {}, h('summary', { text: title }));
    rows.forEach((a) => d.append(h('div', { class: 'acc' },
      h('div', {},
        h('span', { class: 'acc__role', text: `${a.role} · ${a.holder}` }),
        h('span', { class: 'acc__num', text: `${a.bank} ${a.number}` })),
      h('button', { type: 'button', class: 'btn btn--small', text: '복사',
        'aria-label': `${a.role} 계좌번호 복사`,
        onclick: () => copyText(a.number, '계좌번호가 복사되었습니다') }))));
    box.append(d);
  });
}

export function renderAll(config) {
  const { wedding: w } = config;
  const p = parseWedding(w);

  document.querySelectorAll('[data-bind]').forEach((el) => {
    el.textContent = get(config, el.dataset.bind) ?? '';
  });
  document.title = `${config.groom.name} & ${config.bride.name}, ${config.share.title}`;

  $('#intro-date').textContent = `${dateKo(p)} ${timeKo(p.hh, p.mm)}`;
  $('#greeting-title').textContent = config.greeting.title;
  $('#greeting-lines').textContent = config.greeting.lines.join('\n');

  renderAmbient(config.intro.cover);
  renderPolaroid($('#person-groom'), config.groom, '신랑', 'The groom');
  renderPolaroid($('#person-bride'), config.bride, '신부', 'The bride');
  renderCalendar(p);

  $('#info-card').append(
    h('p', { class: 'info__date', text: dateKo(p) }),
    h('p', { class: 'info__time', text: timeKo(p.hh, p.mm) }),
    h('p', { class: 'info__venue', text: [w.venue, w.hall].filter(Boolean).join(' ') }),
    h('p', { class: 'info__addr', text: w.address }),
    h('button', { type: 'button', class: 'btn btn--small', text: '주소 복사',
      onclick: () => copyText(w.address, '주소가 복사되었습니다') }));

  renderMap(w);
  renderAccounts(config.accounts);
  return p;
}
