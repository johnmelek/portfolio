/* JOHN MELEK, project pages: live interactive components.
   Each project page includes this file. Only the component whose root
   element is present on the page gets wired up. No external deps. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- EdgeSync: live reconcile table ---------- */
  const rec = $('#x-reconcile');
  if (rec) {
    const rows = $$('.rrow', rec);
    const counter = $('.rec-count', rec);
    const done = $('.rec-done', rec);
    const tick = () => {
      const left = rows.filter(r => !r.classList.contains('resolved')).length;
      if (counter) counter.textContent = left;
      if (left === 0 && done) { done.hidden = false; }
    };
    $$('.resolve', rec).forEach(btn => btn.addEventListener('click', () => {
      const row = btn.closest('.rrow');
      row.classList.add('resolved');
      $$('.conflict', row).forEach(c => c.classList.remove('conflict'));
      btn.textContent = 'MATCHED';
      btn.disabled = true;
      tick();
    }));
    tick();
  }

  /* ---------- FieldConsole: fleet HUD + live log ---------- */
  const con = $('#x-console');
  if (con) {
    const log = $('.con-log', con);
    const stamp = () => new Date().toISOString().slice(11, 19);
    const say = (m) => {
      const line = document.createElement('div');
      line.className = 'log-line';
      line.innerHTML = `<span class="lt">${stamp()}</span> ${m}`;
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    };
    $$('.node', con).forEach(n => n.addEventListener('click', () => {
      const up = n.classList.toggle('down');
      const id = n.dataset.id;
      say(up ? `SITE ${id} marked OFFLINE` : `SITE ${id} back ONLINE`);
    }));
    const syncing = $('.con-sync', con);
    if (syncing) setInterval(() => {
      const id = String(Math.floor(Math.random() * 6) + 1).padStart(2, '0');
      say(`SITE ${id} metrics synced (${(Math.random() * 40 + 10).toFixed(0)}ms)`);
    }, 2600);
    say('Console linked. 6 sites in range.');
  }

  /* ---------- QuoteForge: type to generate a real app ---------- */
  const forge = $('#x-forge');
  if (forge) {
    const input = $('.forge-in', forge);
    const go = $('.forge-go', forge);
    const out = $('.forge-out', forge);
    const build = () => {
      const text = input.value.trim() || 'a contact form';
      const words = text.replace(/[^a-z0-9 ]/gi, '').split(/\s+/).filter(Boolean);
      const fields = words.slice(0, 6).map(w => w.charAt(0).toUpperCase() + w.slice(1));
      if (!fields.length) fields.push('Field');
      out.hidden = false;
      out.innerHTML = `<div class="gen-card"><div class="gen-h">${escapeHtml(words.join(' ').slice(0, 60) || 'Generated app')}</div>` +
        fields.map(f => `<label class="gen-f">${escapeHtml(f)}<input type="text" placeholder="enter ${escapeHtml(f.toLowerCase())}"></label>`).join('') +
        `<button class="gen-sub" type="button">Submit</button><div class="gen-note">Single-file app generated in-browser. No server, no key.</div></div>`;
      out.querySelector('.gen-sub').addEventListener('click', e => {
        e.target.textContent = 'Saved locally ✓';
      });
    };
    go.addEventListener('click', build);
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) build(); });
  }

  /* ---------- Recon: clickable surface map ---------- */
  const recon = $('#x-recon');
  if (recon) {
    const panel = $('.recon-panel', recon);
    $$('.pin', recon).forEach(p => p.addEventListener('click', () => {
      $$('.pin', recon).forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      panel.hidden = false;
      panel.innerHTML = `<div class="rp-h">${escapeHtml(p.dataset.name)}</div>` +
        `<div class="rp-b">${escapeHtml(p.dataset.find)}</div>` +
        `<div class="rp-m">Scope: ${escapeHtml(p.dataset.scope)}</div>`;
    }));
  }

  /* ---------- Pulse: live heartbeat sparkline ---------- */
  const pulse = $('#x-pulse');
  if (pulse) {
    const bars = $$('.pbar', pulse);
    const ms = $('.pulse-ms', pulse);
    let v = bars.map(() => 40 + Math.random() * 40);
    const render = () => {
      bars.forEach((b, i) => { b.style.height = v[i] + '%'; });
      if (ms) ms.textContent = Math.round(v[v.length - 1] * 4) + 'ms';
    };
    render();
    setInterval(() => {
      v = v.slice(1).concat(40 + Math.random() * 55);
      render();
    }, 700);
  }

  /* ---------- AtlasDeploy: clickable deploy waves ---------- */
  const atlas = $('#x-atlas');
  if (atlas) {
    const run = $('.atlas-go', atlas);
    const log = $('.atlas-log', atlas);
    const nodes = $$('.wnode', atlas);
    let wave = 0;
    run.addEventListener('click', () => {
      if (wave >= 3) { wave = 0; nodes.forEach(n => n.classList.remove('live')); log.innerHTML = ''; }
      const w = ++wave;
      const grp = nodes.filter(n => +n.dataset.wave === w);
      grp.forEach((n, i) => setTimeout(() => {
        n.classList.add('live');
        const line = document.createElement('div');
        line.className = 'log-line';
        line.textContent = `[wave ${w}] ${n.dataset.id} deployed OK`;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
      }, i * 450));
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
})();
