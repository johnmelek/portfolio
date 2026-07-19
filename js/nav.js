/* Shared chrome: top bar + full-screen menu overlay. */
(() => {
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html','');
  const items = [
    ['index','OVERVIEW'],['work','FIELD WORK'],['projects','THE SET'],
    ['approach','APPROACH'],['fieldlog','FIELD LOG'],['contact','CONTACT']
  ];
  const isPj = location.pathname.includes('/projects/');
  const base = isPj ? '../' : '';
  const nav = items.map(([id,label]) => `<a href="${base}${id}.html"><span class="idx">0${items.indexOf([id,label])+1}</span>${label}</a>`).join('');
  const bar = `
  <div class="topbar">
    <span>JOHN MELEK</span><span>· FORWARD DEPLOY ENGINEER</span>
    <span class="clk">--:--:-- UTC</span><span class="sig">AVAILABLE</span>
  </div>
  <button class="menu-btn">MENU</button>
  <div class="nav-overlay">${nav}</div>`;
  document.body.insertAdjacentHTML('afterbegin', bar);
})();
