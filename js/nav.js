/* Shared chrome injector: status bar + left rail.
   Keeps every page identical without server includes. */
(() => {
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  const items = [
    { ix: '01', label: 'OVERVIEW', href: 'index.html', sec: 'index' },
    { ix: '02', label: 'FIELD WORK', href: 'work.html', sec: 'work' },
    { ix: '03', label: 'THE SELECTED SET', href: 'projects.html', sec: 'projects' },
    { ix: '04', label: 'APPROACH', href: 'approach.html', sec: 'approach' },
    { ix: '05', label: 'FIELD LOG', href: 'fieldlog.html', sec: 'fieldlog' },
    { ix: '06', label: 'CONTACT', href: 'contact.html', sec: 'contact' },
  ];
  const bar = document.createElement('div');
  bar.className = 'statusbar';
  bar.innerHTML = `
    <span class="dot"></span>
    <span class="mid">FORWARD DEPLOY CONSOLE</span>
    <span class="mid">v2.3 · NODE 70</span>
    <span class="sig" data-clk>SIGNAL</span>
    <span class="clk">--:--:-- UTC</span>`;
  const rail = document.createElement('aside');
  rail.className = 'rail';
  const nav = items.map((it) =>
    `<a href="${it.href}" data-sec="${it.sec}" class="${it.sec === page ? 'active' : ''}">
       <span class="ix">${it.ix}</span>${it.label}</a>`).join('');
  rail.innerHTML = `
    <div class="brand">
      <div class="nm">JOHN MELEK</div>
      <div class="role">Forward Deploy Engineer</div>
    </div>
    <nav>${nav}</nav>
    <div class="foot">Selected field work, 2021 to present.<br>Full engagement history on request.</div>`;
  document.body.prepend(rail);
  document.body.prepend(bar);
})();
