/* Shared chrome: top bar + full-screen menu overlay + language switcher + back button. */
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  const page = path.replace('.html', '');
  const isHome = page === 'index';
  const isPj = location.pathname.includes('/projects/');
  const base = isPj ? '../' : '';
  const i18n = window.__i18n;

  const items = [
    ['index', 'm.overview', 'OVERVIEW'], ['work', 'm.work', 'FIELD WORK'],
    ['projects', 'm.set', 'THE SET'], ['approach', 'm.approach', 'APPROACH'],
    ['fieldlog', 'm.log', 'FIELD LOG'], ['brand', 'm.brand', 'BRAND'], ['contact', 'm.contact', 'CONTACT']
  ];
  const nav = items.map(([id, key, fb]) => {
    const label = (i18n && i18n.DICT[key]) ? i18n.DICT[key].en : fb;
    const idx = String(items.indexOf([id, key, fb]) + 1).padStart(2, '0');
    return `<a href="${base}${id}.html" data-i18n="${key}" data-i18n-fallback="${fb}"><span class="idx">${idx}</span>${label}</a>`;
  }).join('');

  // language switcher
  const langBtns = i18n ? i18n.LANGS.map(l =>
    `<button data-lang="${l}" class="${l === i18n.getLang() ? 'active' : ''}">${i18n.LABEL[l]}</button>`).join('<span class="sep"></span>') : '';

  // back button: non-home, non-project pages (project pages already have their own back link in content)
  const backHref = isPj ? null : (isHome ? null : base + 'index.html');
  const backBtn = backHref
    ? `<a class="back" href="${backHref}" data-i18n="g.back">← BACK</a>`
    : '';

  const bar = `
  <header class="topbar">
    <a class="brand" href="${base}index.html"><img class="logo" src="${base}assets/logo.svg" alt="JM">JOHN MELEK</a>
    <span class="role" data-i18n="nav.role">· FORWARD DEPLOY ENGINEER · AI MANAGER</span>
    <span class="clk">--:--:-- UTC</span>
    <span class="sig">AVAILABLE</span>
    <span class="lang">${langBtns}</span>
    <button class="menu-btn" data-i18n="nav.menu">MENU</button>
  </header>
  <div class="nav-overlay">
    <div class="nav-top"><button class="nav-return" data-i18n="nav.return">RETURN</button></div>
    <nav class="nav-links">${nav}</nav>
    <a class="nav-li" href="https://www.linkedin.com/in/john-melek-182086256?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener" style="font-size:clamp(18px,3vw,28px);color:var(--ink-2)"><span class="idx">↗</span><span data-i18n="nav.linkedin">LINKEDIN</span></a>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', bar);

  // place the back button at the top of main content (in flow, not floating)
  if (backHref) {
    const main = document.querySelector('main');
    if (main) main.insertAdjacentHTML('afterbegin', backBtn);
  }

  // wire language buttons
  if (i18n) {
    document.querySelectorAll('.lang button').forEach(b => {
      b.addEventListener('click', () => i18n.apply(b.dataset.lang));
    });
  }

  // menu open/close + return
  const btn = document.querySelector('.menu-btn');
  const ov = document.querySelector('.nav-overlay');
  const ret = document.querySelector('.nav-return');
  const close = () => { ov.classList.remove('open'); btn.textContent = (i18n ? (i18n.DICT['nav.menu'][i18n.getLang()] || 'MENU') : 'MENU'); };
  if (btn && ov) {
    btn.addEventListener('click', () => {
      const open = ov.classList.toggle('open');
      btn.textContent = open ? (i18n ? (i18n.DICT['nav.close'][i18n.getLang()] || 'CLOSE') : 'CLOSE') : (i18n ? (i18n.DICT['nav.menu'][i18n.getLang()] || 'MENU') : 'MENU');
    });
    if (ret) ret.addEventListener('click', close);
    ov.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // re-apply current language to the freshly injected chrome
  if (i18n) i18n.apply(i18n.getLang());
})();
