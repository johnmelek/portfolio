/* JOHN MELEK, manifesto motion engine.
   - per-world generative canvas background (data-world on body)
   - cursor-reactive display type
   - scroll reveal + parallax
   No external deps. Respects reduced-motion. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const world = document.body.dataset.world;

  /* ---------- cursor-reactive type ---------- */
  if (fine && !reduce) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      document.documentElement.style.setProperty('--mx', cx.toFixed(3));
      document.documentElement.style.setProperty('--my', cy.toFixed(3));
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* ---------- scroll reveal + parallax ---------- */
  const io = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  const par = [...document.querySelectorAll('[data-parallax]')];
  if (par.length && fine) {
    const onScr = () => {
      const y = window.scrollY;
      par.forEach(el => {
        const f = parseFloat(el.dataset.parallax) || 0.15;
        el.style.transform = `translate3d(0, ${(y * f).toFixed(1)}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScr, { passive: true });
    onScr();
  }

  /* ---------- per-world canvas ---------- */
  const cv = document.getElementById('world-canvas');
  if (!cv || reduce) return;
  const ctx = cv.getContext('2d');
  let W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  window.addEventListener('resize', resize); resize();

  const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#ff4d2e';
  let t = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);

  const worlds = {
    edgesync() {
      ctx.fillStyle = 'rgba(244,241,234,0.06)'; ctx.fillRect(0, 0, W, H);
      ctx.font = '16px JetBrains Mono, monospace'; ctx.fillStyle = accent;
      for (let i = 0; i < 40; i++) {
        const x = (i * 53) % W; const y = (t * (1 + (i % 5)) + i * 80) % H;
        ctx.globalAlpha = 0.12 + 0.18 * Math.sin(t * 0.02 + i);
        ctx.fillText(['⟳', '✓', '≠', '=', '0', '1'][i % 6], x, y);
      }
      ctx.globalAlpha = 1;
    },
    fieldconsole() {
      const cx = W * 0.5, cy = H * 0.5;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = accent; ctx.globalAlpha = 0.18;
      for (let r = 40; r < Math.max(W, H); r += 70) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); }
      const a = t * 0.03;
      const g = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * 600, cy + Math.sin(a) * 600);
      g.addColorStop(0, accent); g.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.5; ctx.strokeStyle = g; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 700, cy + Math.sin(a) * 700); ctx.stroke();
      ctx.globalAlpha = 0.9; ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fill();
    },
    quoteforge() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < 14; i++) {
        const x = (Math.sin(t * 0.01 + i) * 0.5 + 0.5) * W;
        const y = (Math.cos(t * 0.013 + i * 1.7) * 0.5 + 0.5) * H;
        const s = 18 + Math.sin(t * 0.02 + i) * 8;
        ctx.globalAlpha = 0.10 + 0.10 * Math.sin(t * 0.02 + i);
        ctx.fillStyle = accent; ctx.beginPath(); ctx.roundRect(x - s / 2, y - 7, s, 14, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    recon() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = accent; ctx.globalAlpha = 0.12; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const sy = (t * 2) % H;
      ctx.globalAlpha = 0.5; ctx.strokeStyle = accent; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
      ctx.globalAlpha = 1;
    },
    pulse() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const n = Math.sin(x * 0.02 + t * 0.08) * 40 + Math.sin(x * 0.07 + t * 0.05) * 14;
        const y = H / 2 + n + (Math.random() < 0.001 ? rnd(-60, 60) : 0);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    },
    atlas() {
      ctx.clearRect(0, 0, W, H);
      const nodes = []; for (let i = 0; i < 10; i++) nodes.push({ x: (i * 123) % W, y: (i * 211) % H });
      ctx.strokeStyle = accent; ctx.globalAlpha = 0.15; ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
      }
      const p = (t * 1.5) % 1;
      nodes.forEach((n, i) => {
        const nx = (n.x + Math.sin(t * 0.01 + i) * 12);
        const ny = (n.y + Math.cos(t * 0.01 + i) * 12);
        ctx.globalAlpha = 0.8; ctx.fillStyle = accent;
        ctx.beginPath(); ctx.arc(nx, ny, 4 + Math.sin(t * 0.05 + i) * 1.5, 0, 7); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
  };

  const fn = worlds[world] || worlds.pulse;
  const loop = () => { t += 1; fn(); requestAnimationFrame(loop); };
  loop();
})();
