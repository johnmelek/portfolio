/* ============================================================
   JOHN MELEK, portfolio interactions
   Custom cursor · marquee · magnetic · scramble · spotlight · reveal
   ============================================================ */
(() => {
  document.documentElement.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(min-width:821px)').matches;

  /* ---------- PROGRESS BAR ---------- */
  const prog = document.getElementById('progress');
  const onScroll = () => {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    prog.style.width = (p * 100) + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- CUSTOM CURSOR ---------- */
  if (fine && !reduce) {
    const cur = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor-dot');
    const label = document.querySelector('.cursor-label');
    let mx = innerWidth / 2, my = innerHeight / 2;
    let cx = mx, cy = my, dx = mx, dy = my;

    addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dx = mx; dy = my;
      label.style.left = mx + 'px'; label.style.top = (my + 34) + 'px';
    });

    const loop = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    const setLabel = (t) => {
      if (t) { cur.classList.add('has-label'); cur.textContent = t; label.textContent = t; label.style.opacity = 1; }
      else { cur.classList.remove('has-label'); cur.textContent = ''; label.style.opacity = 0; }
    };

    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => { cur.classList.add('is-hover'); setLabel(el.getAttribute('data-cursor')); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('is-hover'); setLabel(null); });
    });
  }

  /* ---------- MAGNETIC ---------- */
  if (fine && !reduce) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 0.35;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px,${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- SCRAMBLE ---------- */
  const CHARS = '!<>-_\\/[]{}*=+?~#________';
  function scramble(el) {
    const target = el.getAttribute('data-scramble') || el.textContent;
    if (reduce) { el.textContent = target; return; }
    let frame = 0;
    const queue = [];
    for (let i = 0; i < target.length; i++) {
      const start = Math.floor(Math.random() * 18);
      const end = start + Math.floor(Math.random() * 18);
      queue.push({ ch: target[i], start, end });
    }
    const tick = () => {
      let out = '';
      let done = 0;
      for (const q of queue) {
        if (frame >= q.end) { out += q.ch; done++; }
        else if (frame >= q.start) { out += CHARS[Math.floor(Math.random() * CHARS.length)]; }
        else { out += ''; }
      }
      el.textContent = out;
      if (done < queue.length) { frame++; requestAnimationFrame(tick); }
      else { el.textContent = target; }
    };
    tick();
  }
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    scramble(el);
    if (!reduce) el.addEventListener('mouseenter', () => scramble(el));
  });

  /* ---------- SPOTLIGHT on project cards ---------- */
  if (fine && !reduce) {
    document.querySelectorAll('[data-spotlight]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- REVEAL ---------- */
  function revealAll(){ document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in')); }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    // Fallback: if something prevents the observer from firing, reveal anyway.
    setTimeout(revealAll, 1500);
  } else {
    revealAll();
  }

  /* ---------- COUNT-UP NUMBERS ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const raw = parseInt(el.getAttribute('data-count'), 10);
      el.textContent = '0';
      let v = 0;
      const step = Math.max(1, Math.round(raw / 38));
      const tick = () => {
        v += step;
        if (v >= raw) { el.textContent = el.getAttribute('data-count').replace(/\d/, raw.toLocaleString()); v = raw; }
        else { el.textContent = v.toLocaleString(); }
        if (v < raw) requestAnimationFrame(tick);
        else el.textContent = el.getAttribute('data-count');
      };
      if (reduce) el.textContent = el.getAttribute('data-count');
      else tick();
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.bn-n[data-count]').forEach((el) => cio.observe(el));

  /* ---------- LIVE MODAL ---------- */
  const modal = document.getElementById('modal');
  const frame = document.getElementById('modal-frame');
  const mtitle = document.getElementById('modal-title');
  document.querySelectorAll('[data-live]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const port = a.getAttribute('data-live');
      mtitle.textContent = 'Live preview · localhost:' + port;
      frame.src = 'http://localhost:' + port;
      modal.classList.add('open');
    });
  });
  document.getElementById('modal-close').addEventListener('click', () => {
    modal.classList.remove('open'); frame.src = 'about:blank';
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.remove('open'); frame.src = 'about:blank'; } });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { modal.classList.remove('open'); frame.src = 'about:blank'; } });
})();
