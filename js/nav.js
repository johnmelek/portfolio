/* Shared chrome: top bar + full-screen menu overlay. */
(() => {
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html','');
  const items = [
    ['index','OVERVIEW'],['work','FIELD WORK'],['projects','THE SET'],
    ['approach','APPROACH'],['fieldlog','FIELD LOG'],['brand','BRAND'],['contact','CONTACT']
  ];
  const isPj = location.pathname.includes('/projects/');
  const base = isPj ? '../' : '';
  const nav = items.map(([id,label]) => `<a href="${base}${id}.html"><span class="idx">0${items.indexOf([id,label])+1}</span>${label}</a>`).join('');
  const isHome = page === 'index';
  const bar = `
  <header class="topbar">
    <a class="brand" href="${base}index.html"><img class="logo" src="${base}assets/logo.svg" alt="JM">JOHN MELEK</a>
    <span class="role">· FORWARD DEPLOY ENGINEER · AI MANAGER</span>
    <span class="clk">--:--:-- UTC</span>
    <span class="sig">AVAILABLE</span>
    <button class="menu-btn">MENU</button>
  </header>
  <div class="nav-overlay">${nav}<a href="https://www.linkedin.com/in/john-melek-182086256?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener" style="font-size:clamp(18px,3vw,28px);color:var(--ink-2)"><span class="idx">↗</span>LINKEDIN</a></div>`;
  document.body.insertAdjacentHTML('afterbegin', bar);
})();
