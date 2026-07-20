/* JOHN MELEK, portfolio interactions: loader, cursor, nav, reveal, parallax, progress, clock */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // loader: hide once the window has loaded (with a small minimum so it never flashes)
  const loader = document.getElementById('loader');
  if (loader) {
    const minShow = new Promise(r => setTimeout(r, 650));
    const loaded = new Promise(r => {
      if (document.readyState === 'complete') r();
      else window.addEventListener('load', r, { once: true });
      // safety: never trap the user behind the loader
      setTimeout(r, 2500);
    });
    Promise.all([minShow, loaded]).then(() => loader.classList.add('done'));
  }

  // scroll progress bar
  const prog = document.createElement('div'); prog.className = 'progress';
  document.body.appendChild(prog);
  const topbar = document.querySelector('.topbar');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    if (topbar) topbar.classList.toggle('scrolled', scrollY > 40);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

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

  // reveal on scroll
  const els = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); }
  else {
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .14, rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
  }

  // hero photo parallax
  const photo = document.querySelector('.hero .photo img');
  if (photo && !reduce) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { const y = scrollY; photo.style.transform = `scale(1.04) translateY(${y * 0.06}px)`; ticking = false; });
    }, { passive: true });
  }

  // scramble on hover
  if (!reduce) {
    document.querySelectorAll('[data-scramble]').forEach(el => {
      const target = el.dataset.scramble; const ch = '!<>-_\\/[]{}#%&';
      let frame = 0;
      const run = () => { let out=''; for (let i=0;i<target.length;i++){ out += Math.random()<.32 ? ch[Math.floor(Math.random()*ch.length)] : target[i]; } el.textContent = out; if (frame++<14) setTimeout(run, 30); else el.textContent = target; };
      el.addEventListener('mouseenter', () => { frame=0; run(); });
    });
  }

  // marquee pause on hover
  document.querySelectorAll('.marq').forEach(m => m.addEventListener('mouseenter', () => m.querySelector('.track').style.animationPlayState = 'paused'));
  document.querySelectorAll('.marq').forEach(m => m.addEventListener('mouseleave', () => m.querySelector('.track').style.animationPlayState = 'running'));
})();
