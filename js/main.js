/* ============================================================
   JOHN MELEK, deployment console interactions
   cursor · typewriter command line · reveal · clock
   ============================================================ */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(min-width: 821px)').matches;

  /* ---- cursor ---- */
  if (fine && !reduce) {
    const dot = document.createElement('div');
    dot.className = 'cur';
    const ring = document.createElement('div');
    ring.className = 'cur ring';
    document.body.append(dot, ring);
    let tx = 0, ty = 0, rx = 0, ry = 0, raf;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.left = tx + 'px'; dot.style.top = ty + 'px';
      if (!raf) loop();
    });
    function loop() {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      if (Math.abs(tx - rx) > 0.4 || Math.abs(ty - ry) > 0.4) raf = requestAnimationFrame(loop);
      else raf = null;
    }
    const over = () => { dot.classList.add('ring'); ring.style.opacity = '1'; };
    const out = () => { dot.classList.remove('ring'); ring.style.opacity = '.8'; };
    document.querySelectorAll('a, button, [data-hover]').forEach((el) => {
      el.addEventListener('mouseenter', over); el.addEventListener('mouseleave', out);
    });
  }

  /* ---- clock in status bar ---- */
  const clk = document.querySelector('[data-clk]');
  if (clk) {
    const t = () => { const d = new Date(); clk.textContent = d.toUTCString().slice(17, 25) + ' UTC'; };
    t(); setInterval(t, 1000);
  }

  /* ---- typewriter command line ---- */
  const tgt = document.querySelector('[data-type]');
  if (tgt && !reduce) {
    const full = tgt.getAttribute('data-type');
    let i = 0;
    const tick = () => {
      tgt.textContent = full.slice(0, i);
      i++;
      if (i <= full.length) setTimeout(tick, 38 + Math.random() * 50);
      else setTimeout(() => { i = 0; tick(); }, 3800);
    };
    setTimeout(tick, 600);
  }

  /* ---- reveal ---- */
  const revealAll = () => document.querySelectorAll('.rv').forEach((e) => e.classList.add('in'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach((el) => io.observe(el));
    setTimeout(revealAll, 1400);
  } else revealAll();

  /* ---- active nav link on scroll ---- */
  const links = [...document.querySelectorAll('.rail nav a')];
  const map = new Map(links.map((l) => [l.getAttribute('href').replace('.html', '') || 'index', l]));
  const secs = [...document.querySelectorAll('[data-sec]')];
  if (secs.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          const a = map.get(e.target.getAttribute('data-sec'));
          if (a) a.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    secs.forEach((s) => so.observe(s));
  }
})();
