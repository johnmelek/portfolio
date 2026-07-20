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

  const social = `
    <div class="nav-social">
      <a href="https://www.linkedin.com/in/john-melek-182086256?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.2 2.3-2.46 4.73-2.46 5.06 0 6 3.33 6 7.66V24h-5v-7.4c0-1.77-.03-4.05-2.47-4.05-2.47 0-2.85 1.93-2.85 3.92V24h-5V8z"/></svg>
        <span>LinkedIn</span>
      </a>
      <a href="mailto:john.melek@jmai.run.place" aria-label="Email">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4h20v16H2V4zm2 2v.4l8 5.2 8-5.2V6H4zm16 2.8V18h-2V9.1l-6 3.9-6-3.9V18H4V8.8l8 5.2 8-5.2z"/></svg>
        <span>Email</span>
      </a>
      <a href="https://github.com/johnmelek" target="_blank" rel="noopener" aria-label="GitHub">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
        <span>GitHub</span>
      </a>
    </div>`;

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
    ${social}
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
