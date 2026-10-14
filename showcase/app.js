// 쇼케이스 동작 - 토큰(dist/<테마>/dtcg/tokens.json)을 읽어 견본을 그리고, 메뉴·탭·트리·대화상자를 시연한다.
// 값은 화면에 하드코딩하지 않는다. 테마를 바꾸면 tokens.css 링크와 견본을 함께 다시 읽는다.

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* 저장소를 못 쓰면 무시 */
    }
  },
};

let themes = [];
let theme = 'classic';
let tokens = null;
let exportTab = store.get('sh-export-tab') ?? 'design';

const EXPORTS = [
  { id: 'design', label: 'DESIGN.md', path: () => '../references/sh-classic/DESIGN.md', file: 'DESIGN.md' },
  { id: 'tw4', label: 'Tailwind v4', path: (t) => `../dist/${t}/tailwind4/theme.css`, file: 'theme.css' },
  { id: 'css', label: 'CSS 변수', path: (t) => `../dist/${t}/css/tokens.css`, file: 'tokens.css' },
  { id: 'dtcg', label: 'DTCG JSON', path: (t) => `../dist/${t}/dtcg/tokens.json`, file: 'tokens.json' },
  { id: 'wpf', label: 'WPF', path: (t) => `../dist/${t}/wpf/ShTokens.xaml`, file: 'ShTokens.xaml' },
  { id: 'avalonia', label: 'Avalonia', path: (t) => `../dist/${t}/avalonia/ShTokens.axaml`, file: 'ShTokens.axaml' },
  { id: 'components', label: '부품 CSS', path: () => '../components/css/sh-classic.css', file: 'sh-classic.css' },
];

// -- 상태 줄 ----------------------------------------
let msgTimer;
function status(text) {
  $('#st-msg').textContent = text;
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => ($('#st-msg').textContent = '준비'), 4000);
}

// -- 토큰 읽기 --------------------------------------
const leaves = (obj, path = []) =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && '$value' in v
      ? [{ path: [...path, k], ...v }]
      : v && typeof v === 'object'
        ? leaves(v, [...path, k])
        : [],
  );
const cssVar = (path) => `--sh-${path.join('-')}`;

async function loadTheme(id) {
  theme = id;
  $('#sh-tokens').href = `../dist/${id}/css/tokens.css`;
  document.documentElement.dataset.shTheme = id;
  store.set('sh-theme', id);
  tokens = await (await fetch(`../dist/${id}/dtcg/tokens.json`)).json();
  $('#theme-picker').value = id;
  $('#st-theme').textContent = `테마 ${id}`;
  $('#st-count').textContent = `토큰 ${leaves(tokens).length}개`;
  $$('#m-theme .sh-menu__check').forEach((c) => (c.textContent = c.dataset.theme === id ? '✓' : ''));
  renderPalette();
  renderTypography();
  renderSpacing();
  renderExport();
}

// -- 01 색 ------------------------------------------
const COLOR_GROUPS = [
  ['강조·선택', (p) => /^accent|^hover-edge|^link$/.test(p)],
  ['면', (p) => /^(canvas|sunken|hover|scrim)$/.test(p)],
  ['선', (p) => /^(border|border-strong|grid)$/.test(p)],
  ['글자', (p) => /^(text|on-accent)/.test(p)],
  ['의미', (p) => /^(danger|success|warning)/.test(p)],
  ['베벨 버튼', (p) => p.startsWith('control.')],
  ['크롬 (스킨)', (p) => p.startsWith('chrome.')],
  ['스테이지·트리', (p) => /^(stage|tree)\./.test(p)],
];
const h3 = (t) => Object.assign(document.createElement('h3'), { textContent: t });

function renderPalette() {
  const colors = leaves(tokens.color).map((t) => ({ ...t, key: t.path.join('.') }));
  const box = $('#palette');
  box.replaceChildren();
  for (const [title, test] of COLOR_GROUPS) {
    const list = colors.filter((c) => test(c.key));
    if (!list.length) continue;
    const grid = document.createElement('div');
    grid.className = 'swatches';
    for (const c of list) {
      const name = cssVar(['color', ...c.path]);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch';
      b.title = c.$description ? `${name}\n${c.$description}` : name;
      b.innerHTML =
        '<span class="swatch__chip"></span><span class="swatch__name"></span><span class="swatch__val"></span>';
      b.children[0].style.background = `var(${name})`;
      b.children[1].textContent = c.key;
      b.children[2].textContent = c.$value;
      b.addEventListener('click', () => copy(`var(${name})`, `${name} 를 복사했습니다.`));
      grid.append(b);
    }
    box.append(h3(title), grid);
  }
  const gl = document.createElement('div');
  gl.style.display = 'grid';
  gl.style.gap = 'var(--sh-space-4)';
  for (const g of leaves(tokens.gradient)) {
    const d = document.createElement('div');
    d.className = 'grad';
    d.style.background = `var(${cssVar(['gradient', ...g.path])})`;
    d.textContent = `${cssVar(['gradient', ...g.path])} · ${g.$description ?? ''}`;
    gl.append(d);
  }
  box.append(h3('그라데이션'), gl);
}

// -- 02 타이포 --------------------------------------
function typeRow(meta, text, style) {
  const row = document.createElement('div');
  row.className = 'type-sample';
  row.innerHTML = '<span class="meta"></span><span></span>';
  row.firstChild.textContent = meta;
  row.lastChild.textContent = text;
  Object.assign(row.lastChild.style, style);
  return row;
}
function renderTypography() {
  const box = $('#typography');
  const f = tokens.font;
  const sample = '가나다라 동의서 작성 ABC 0123456789';
  box.replaceChildren(h3('크기'));
  for (const s of leaves(f.size)) {
    const v = cssVar(['font', 'size', ...s.path]);
    box.append(typeRow(`${v} ${s.$value}`, `${sample}  ${s.$description ?? ''}`, { fontSize: `var(${v})` }));
  }
  box.append(h3('굵기'));
  for (const w of leaves(f.weight))
    box.append(
      typeRow(`${w.path[0]} ${w.$value}`, `버튼 라벨 Button  ${w.$description ?? ''}`, { fontWeight: w.$value }),
    );
  box.append(h3('글꼴'));
  for (const fam of leaves(f.family)) {
    const v = cssVar(['font', 'family', ...fam.path]);
    box.append(
      typeRow(v, `${sample}  (${[].concat(fam.$value).slice(0, 3).join(', ')} ...)`, { fontFamily: `var(${v})` }),
    );
  }
}

// -- 03 간격·크기·모양 ------------------------------
function specTable(rows) {
  const t = document.createElement('table');
  t.className = 'sh-table specs';
  t.innerHTML = '<thead><tr><th>변수</th><th>값</th><th>설명</th><th>견본</th></tr></thead><tbody></tbody>';
  for (const r of rows) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td></td><td class="sh-tnum"></td><td></td><td></td>';
    tr.children[0].textContent = r.name;
    tr.children[1].textContent = r.value;
    tr.children[2].textContent = r.desc ?? '';
    if (r.sample) tr.children[3].append(r.sample);
    t.tBodies[0].append(tr);
  }
  const wrap = document.createElement('div');
  wrap.style.overflowX = 'auto';
  wrap.append(t);
  return wrap;
}
function renderSpacing() {
  const box = $('#spacing');
  const bar = (name) => {
    const b = document.createElement('span');
    b.className = 'bar';
    b.style.width = `var(${name})`;
    return b;
  };
  const rows = (group, withBar) =>
    leaves(tokens[group]).map((s) => ({
      name: cssVar([group, ...s.path]),
      value: s.$value,
      desc: s.$description,
      sample: withBar ? bar(cssVar([group, ...s.path])) : null,
    }));
  const sh = document.createElement('div');
  sh.className = 'demo-row';
  for (const s of leaves(tokens.shadow)) {
    const d = document.createElement('div');
    d.className = 'shadow-box';
    d.style.boxShadow = `var(${cssVar(['shadow', ...s.path])})`;
    d.textContent = `${s.path[0]} · ${s.$description ?? ''}`;
    sh.append(d);
  }
  box.replaceChildren(
    h3('간격'),
    specTable(rows('space', true).sort((a, b) => parseFloat(a.value) - parseFloat(b.value))),
    h3('크기'),
    specTable(rows('size')),
    h3('반경·선'),
    specTable([...rows('radius'), ...rows('border')]),
    h3('그림자 (세 가지뿐)'),
    sh,
  );
}

// -- 05 지침 (DESIGN.md 에서 읽음) ------------------
function richLi(text) {
  const el = document.createElement('li');
  for (const part of text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)) {
    if (part.startsWith('**'))
      el.append(Object.assign(document.createElement('b'), { textContent: part.slice(2, -2) }));
    else if (part.startsWith('`'))
      el.append(Object.assign(document.createElement('code'), { textContent: part.slice(1, -1) }));
    else el.append(part);
  }
  return el;
}
async function renderGuidelines() {
  const md = await (await fetch('../references/sh-classic/DESIGN.md')).text();
  const section = (title) => {
    const i = md.indexOf(`## ${title}`);
    if (i < 0) return '';
    const rest = md.slice(i + title.length + 3);
    const j = rest.search(/\n## /);
    return j < 0 ? rest : rest.slice(0, j);
  };
  const items = (txt) =>
    txt
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => /^(\d+\.|-) /.test(l))
      .map((l) => l.replace(/^(\d+\.|-) /, ''));
  const principles = document.createElement('ol');
  items(section('12. Principles')).forEach((t) => principles.append(richLi(t)));
  const [doPart = '', dontPart = ''] = section("16. Do's and Don'ts").split("**Don't**");
  const panel = (title, list) => {
    const p = document.createElement('div');
    p.className = 'sh-panel';
    p.innerHTML = '<div class="sh-panel__title"></div><ul></ul>';
    p.firstChild.textContent = title;
    list.forEach((t) => p.lastChild.append(richLi(t)));
    return p;
  };
  const dos = document.createElement('div');
  dos.className = 'dos';
  dos.append(panel('Do', items(doPart)), panel("Don't", items(dontPart)));
  $('#guidelines').replaceChildren(h3('원칙'), principles, h3("Do · Don't"), dos);
}

// -- 내보내기 패널 ----------------------------------
let exportText = '';
const currentExport = () => EXPORTS.find((x) => x.id === exportTab) ?? EXPORTS[0];
function renderExportTabs() {
  const bar = $('#export-tabs');
  bar.replaceChildren();
  for (const e of EXPORTS) {
    const b = document.createElement('button');
    b.className = 'sh-tab';
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.textContent = e.label;
    b.setAttribute('aria-selected', String(e.id === currentExport().id));
    b.addEventListener('click', () => {
      exportTab = e.id;
      store.set('sh-export-tab', e.id);
      renderExportTabs();
      renderExport();
    });
    bar.append(b);
  }
}
async function renderExport() {
  const e = currentExport();
  const res = await fetch(e.path(theme));
  exportText = res.ok ? await res.text() : `${e.path(theme)} 을(를) 읽을 수 없습니다.`;
  $('#export-code').textContent = exportText;
}
async function copy(text, msg) {
  try {
    await navigator.clipboard.writeText(text);
    status(msg);
  } catch {
    status('클립보드를 쓸 수 없습니다. 내보내기 패널에서 직접 선택해 복사하세요.');
  }
}
function download() {
  const e = currentExport();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([exportText], { type: 'text/plain;charset=utf-8' }));
  a.download = ['design', 'components'].includes(e.id) ? e.file : `${theme}-${e.file}`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  status(`${a.download} 을(를) 내려받았습니다.`);
}

// -- 메뉴바 -----------------------------------------
let openMenu = null;
function closeMenus() {
  $$('#menubar [data-menu]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  $$('.sh-menu--float').forEach((m) => (m.hidden = true));
  openMenu = null;
}
function showMenu(btn) {
  closeMenus();
  const m = document.getElementById(btn.dataset.menu);
  const r = btn.getBoundingClientRect();
  m.hidden = false;
  m.style.left = `${Math.min(r.left, innerWidth - m.offsetWidth - 4)}px`;
  m.style.top = `${r.bottom}px`;
  btn.setAttribute('aria-expanded', 'true');
  openMenu = btn;
  m.querySelector('.sh-menu__item:not(:disabled)')?.focus({ preventScroll: true });
}
function setupMenus() {
  for (const btn of $$('#menubar [data-menu]')) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (openMenu === btn) closeMenus();
      else showMenu(btn);
    });
    btn.addEventListener('mouseenter', () => {
      if (openMenu && openMenu !== btn) showMenu(btn);
    });
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.sh-menu--float') && !e.target.closest('#menubar')) closeMenus();
  });
  window.addEventListener('resize', closeMenus);
  // 메뉴 안 ↑↓ 이동
  document.addEventListener('keydown', (e) => {
    const menu = e.target.closest?.('.sh-menu--float');
    if (!menu || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const items = $$('.sh-menu__item:not(:disabled)', menu);
    const i = items.indexOf(e.target);
    const next = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key];
    items[(next + items.length) % items.length].focus();
  });
  const tm = $('#m-theme');
  for (const t of themes) {
    const b = document.createElement('button');
    b.className = 'sh-menu__item';
    b.setAttribute('role', 'menuitemradio');
    b.innerHTML = '<span class="sh-menu__check"></span><span class="sh-menu__label"></span>';
    b.firstChild.dataset.theme = t.id;
    b.lastChild.textContent = t.id;
    b.title = t.description;
    b.addEventListener('click', () => {
      closeMenus();
      loadTheme(t.id);
    });
    tm.append(b);
    if (t.id === 'classic') tm.append(Object.assign(document.createElement('div'), { className: 'sh-menu__sep' }));
  }
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-action],[data-goto],[data-href]');
    if (!item || item.disabled) return;
    if (item.closest('.sh-menu--float')) closeMenus();
    if (item.dataset.goto) document.getElementById(item.dataset.goto).scrollIntoView();
    if (item.dataset.href) window.open(item.dataset.href, '_blank', 'noopener');
    const a = item.dataset.action;
    if (a === 'copy') copy(exportText, `${currentExport().label} 을(를) 복사했습니다.`);
    if (a === 'download') download();
    if (a === 'toggle-export') toggleExport();
    if (a === 'about')
      openDialog('정보', 'SH Classic 디자인 시스템\n© 2026 이성현 (SeongHyun Lee). All rights reserved.');
  });
}
function toggleExport() {
  const p = $('#export-panel');
  p.hidden = !p.hidden;
  $('#chk-export').textContent = p.hidden ? '' : '✓';
  $('.app__main').classList.toggle('no-export', p.hidden);
}

// -- 트리 -------------------------------------------
function tree(el, nodes, onSelect) {
  const build = (list) =>
    list.map((n) => {
      const li = document.createElement('li');
      const row = document.createElement('div');
      row.className = 'sh-tree__row';
      if (n.children) {
        li.setAttribute('aria-expanded', String(n.open ?? true));
        const t = document.createElement('button');
        t.type = 'button';
        t.className = 'sh-tree__toggle';
        t.setAttribute('aria-label', '펼치기 또는 접기');
        t.addEventListener('click', () =>
          li.setAttribute('aria-expanded', String(li.getAttribute('aria-expanded') !== 'true')),
        );
        row.append(t);
      }
      const lab = document.createElement('span');
      lab.className = 'sh-tree__label';
      lab.textContent = n.label;
      lab.setAttribute('aria-selected', String(!!n.selected));
      lab.addEventListener('click', () => {
        $$('.sh-tree__label', el).forEach((x) => x.setAttribute('aria-selected', 'false'));
        lab.setAttribute('aria-selected', 'true');
        onSelect?.(n);
      });
      lab.addEventListener('dblclick', () => li.querySelector(':scope > .sh-tree__row > .sh-tree__toggle')?.click());
      row.append(lab);
      li.append(row);
      if (n.children) {
        const ul = document.createElement('ul');
        ul.append(...build(n.children));
        li.append(ul);
      }
      return li;
    });
  el.replaceChildren(...build(nodes));
}

// -- 대화상자 ---------------------------------------
function openDialog(title, body) {
  const scrim = document.createElement('div');
  scrim.className = 'sh-scrim';
  const d = document.createElement('div');
  d.className = 'sh-dialog';
  d.setAttribute('role', 'dialog');
  d.setAttribute('aria-modal', 'true');
  d.innerHTML = `<div class="sh-dialog__title"><span></span><button class="sh-winbtn sh-winbtn--close" type="button" aria-label="닫기" style="width: 24px; height: 22px"><svg><use href="#i-close"/></svg></button></div>
    <div class="sh-dialog__body" style="white-space: pre-line"></div>
    <div class="sh-dialog__buttons"><button class="sh-btn sh-btn--dialog" type="button" data-r="cancel">취소</button><button class="sh-btn sh-btn--primary sh-btn--dialog" type="button" data-r="ok">확인</button></div>`;
  d.querySelector('.sh-dialog__title span').textContent = title;
  d.querySelector('.sh-dialog__body').textContent = body;
  d.setAttribute('aria-label', title);
  scrim.append(d);
  document.body.append(scrim);
  d.style.left = `${Math.max(8, (innerWidth - d.offsetWidth) / 2)}px`;
  d.style.top = `${Math.max(8, (innerHeight - d.offsetHeight) / 3)}px`;
  const close = (r) => {
    scrim.remove();
    document.removeEventListener('keydown', key, true);
    if (r === 'ok') status('확인을 눌렀습니다.');
  };
  const key = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close('cancel');
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      close('ok');
    }
  };
  document.addEventListener('keydown', key, true);
  d.querySelector('.sh-winbtn').addEventListener('click', () => close('cancel'));
  d.querySelectorAll('[data-r]').forEach((b) => b.addEventListener('click', () => close(b.dataset.r)));
  d.querySelector('[data-r="ok"]').focus();
  const bar = d.querySelector('.sh-dialog__title');
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    const sx = e.clientX - d.offsetLeft;
    const sy = e.clientY - d.offsetTop;
    bar.setPointerCapture(e.pointerId);
    const move = (ev) => {
      d.style.left = `${Math.min(innerWidth - 40, Math.max(0, ev.clientX - sx))}px`;
      d.style.top = `${Math.min(innerHeight - 28, Math.max(0, ev.clientY - sy))}px`;
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', () => bar.removeEventListener('pointermove', move), { once: true });
  });
}

// -- 상태 펼침 --------------------------------------
function setStates(mode) {
  $$('[data-force]').forEach((el) => {
    if (mode === 'forced') el.dataset.state = el.dataset.force;
    else delete el.dataset.state;
  });
  $$('[data-states]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.states === mode)));
  store.set('sh-states', mode);
}

// -- 시작 -------------------------------------------
async function main() {
  themes = await (await fetch('../dist/themes.json')).json();
  const picker = $('#theme-picker');
  for (const t of themes)
    picker.append(
      Object.assign(document.createElement('option'), { value: t.id, textContent: t.id, title: t.description }),
    );
  picker.addEventListener('change', () => loadTheme(picker.value));
  setupMenus();
  renderExportTabs();

  const comps = [
    ['앱 골격', 'c-window'],
    ['버튼', 'c-button'],
    ['도구 버튼·툴바', 'c-tool'],
    ['메뉴', 'c-menu'],
    ['탭', 'c-tabs'],
    ['입력·콤보', 'c-input'],
    ['체크·세그먼트', 'c-check'],
    ['표', 'c-table'],
    ['트리', 'c-tree'],
    ['대화상자', 'c-dialog'],
    ['툴팁·알림', 'c-feedback'],
    ['스크롤바', 'c-scroll'],
  ];
  tree(
    $('#nav-tree'),
    [
      { label: '01 색 팔레트', id: 'sec-color' },
      { label: '02 타이포그래피', id: 'sec-type' },
      { label: '03 간격·크기·모양', id: 'sec-space' },
      { label: '04 부품', id: 'sec-comp', children: comps.map(([label, id]) => ({ label, id })) },
      { label: '05 지침', id: 'sec-guide' },
    ],
    (n) => document.getElementById(n.id).scrollIntoView(),
  );

  const forms = [
    { label: '수술', children: [{ label: '수술 동의서', selected: true }, { label: '마취 동의서' }] },
    { label: '검사', open: false, children: [{ label: 'CT 조영제 동의서' }, { label: 'MRI 동의서' }] },
    { label: '개인정보 수집 동의서' },
  ];
  $$('.demo-tree').forEach((el) => tree(el, structuredClone(forms)));

  for (const group of [$('#demo-tabs'), $('#demo-seg')])
    group.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const attr = group.id === 'demo-tabs' ? 'aria-selected' : 'aria-checked';
      [...group.children].forEach((x) => x.setAttribute(attr, String(x === b)));
    });
  $('#indet').indeterminate = true;
  $('#open-dialog').addEventListener('click', () =>
    openDialog('파일 저장', '변경한 내용을 저장할까요?\n저장하지 않으면 마지막 저장 이후의 작업이 사라집니다.'),
  );
  $$('[data-states]').forEach((b) => b.addEventListener('click', () => setStates(b.dataset.states)));
  setStates(store.get('sh-states') ?? 'forced');

  let altAlone = false;
  document.addEventListener('keydown', (e) => {
    altAlone = e.key === 'Alt';
    if (e.key === 'Escape') closeMenus();
    if (e.key === 'F4') {
      e.preventDefault();
      toggleExport();
    }
    if (e.ctrlKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      download();
    }
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Alt' && altAlone && !openMenu) {
      e.preventDefault();
      showMenu($('#menubar [data-menu]'));
    }
  });

  const saved = store.get('sh-theme');
  await loadTheme(themes.some((t) => t.id === saved) ? saved : 'classic');
  await renderGuidelines();
}
main().catch((err) => status(`쇼케이스를 불러오지 못했습니다. ${err.message}`));
