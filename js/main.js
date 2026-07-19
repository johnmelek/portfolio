/* JOHN MELEK, portfolio interactions: cursor, nav overlay, reveal, clock */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // cursor
  if (!reduce && matchMedia('(min-width: 821px)').matches) {
    const c = document.createElement('div'); c.className = 'cur';
    document.body.appendChild(c);
    let x = innerWidth/2, y = innerHeight/2, tx = x, ty = y;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function loop(){ x += (tx-x)*.22; y += (ty-y)*.22; c.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => { c.classList.toggle('big', !!e.target.closest('a,button,[data-hover]')); });
  }

  // nav overlay
  const btn = document.querySelector('.menu-btn');
  const ov = document.querySelector('.nav-overlay');
  if (btn && ov) {
    btn.addEventListener('click', () => { ov.classList.toggle('open'); btn.textContent = ov.classList.contains('open') ? 'CLOSE' : 'MENU'; });
    ov.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { ov.classList.remove('open'); btn.textContent = 'MENU'; }));
  }

  // clock
  const clk = document.querySelector('.clk');
  if (clk) setInterval(() => { clk.textContent = new Date().toISOString().slice(11,19) + ' UTC'; }, 1000);

  // reveal
  const els = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  els.forEach(e => io.observe(e));

  // scramble hero
  if (!reduce) {
    document.querySelectorAll('[data-scramble]').forEach(el => {
      const target = el.dataset.scramble; const ch = '!<>-_\\/[]{}#%&';
      let frame = 0;
      const run = () => { let out=''; for (let i=0;i<target.length;i++){ out += Math.random()<.3 ? ch[Math.floor(Math.random()*ch.length)] : target[i]; } el.textContent = out; if (frame++<14) setTimeout(run, 32); else el.textContent = target; };
      el.addEventListener('mouseenter', () => { frame=0; run(); });
    });
  }
})();
