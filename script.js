(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const WA = '917006901374';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav ---------- */
  const nav = $('#nav'), links = $('#links'), burger = $('#burger');
  const onScroll = () => nav.classList.toggle('stuck', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A') { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
  });

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (el.closest('.hero') ? i * 0.1 : 0) + 's';
    io.observe(el);
  });

  /* ---------- count up ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.count; let n = 0;
    const t = setInterval(() => { el.textContent = ++n; if (n >= to) clearInterval(t); }, 110);
    cio.unobserve(el);
  }));
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- orchard generator ---------- */
  function tree(x, y, s, seed) {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('transform', `translate(${x} ${y}) scale(${s})`);
    const rnd = (n) => { const v = Math.sin(seed * 999 + n * 77) * 10000; return v - Math.floor(v); };
    let h = `<rect x="-3" y="-4" width="6" height="22" rx="2" fill="#5a3b24"/>`;
    h += `<circle cx="0" cy="-22" r="22" fill="#2f6b32"/><circle cx="-13" cy="-12" r="14" fill="#3a7d38"/><circle cx="13" cy="-13" r="15" fill="#357535"/><circle cx="0" cy="-34" r="13" fill="#438a40"/>`;
    for (let i = 0; i < 7; i++) {
      const a = rnd(i) * 6.28, r = 6 + rnd(i + 9) * 20;
      h += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(-20 + Math.sin(a) * r * .8).toFixed(1)}" r="3.2" fill="${rnd(i + 3) > .15 ? '#d8352f' : '#f0a030'}"/>`;
    }
    g.innerHTML = h; return g;
  }
  function orchard(sel, rows, y0, dy, s0, ds, startX, gap, seed) {
    const host = $(sel); if (!host) return;
    for (let r = 0; r < rows; r++) {
      const s = s0 + r * ds, y = y0 + r * dy, step = gap * s / s0;
      for (let x = startX - (r % 2) * step / 2; x < 1500; x += step) host.appendChild(tree(x, y, s, seed + r + x));
    }
  }
  orchard('#orchardFar', 2, 458, 14, .42, .08, -10, 74, 1);
  orchard('#orchardNear', 2, 540, 20, .85, .22, 20, 150, 7);

  /* ---------- parallax ---------- */
  if (!reduce) {
    const pars = $$('.par'), sun = $('.sun'), hero = $('#hero');
    let ticking = false, mx = 0;
    const upd = () => {
      const y = Math.min(scrollY, innerHeight);
      pars.forEach(p => p.style.transform = `translate(${(-mx * p.dataset.depth * 18).toFixed(1)}px,${(-y * p.dataset.depth * .12).toFixed(1)}px)`);
      sun.style.transform = `translateY(${y * .25}px)`;
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    hero.addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - .5) * 2; if (!ticking) { ticking = true; requestAnimationFrame(upd); } });
  }

  /* ---------- panels ---------- */
  const panels = $$('.panel');
  const activate = p => panels.forEach(x => x.classList.toggle('active', x === p));
  panels.forEach(p => {
    p.addEventListener('click', () => activate(p));
    p.addEventListener('focus', () => activate(p));
    p.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover) and (min-width:981px)').matches) activate(p); });
    p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(p); } });
  });

  /* ---------- seasons ---------- */
  const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // [name, icon, from, to (0-indexed, inclusive), note, alt]
  const CROPS = [
    ['Cherries', 'i-cherry', 4, 6, 'Premium · Cordia · Regina'],
    ['Apricots', 'i-pear', 5, 6, 'Sun-sweet summer fruit'],
    ['Ruby Nectarines', 'i-apple', 6, 7, 'Juicy, ruby-red flesh'],
    ['Pears', 'i-pear', 7, 9, 'Crisp valley pears'],
    ['Apples', 'i-apple', 7, 10, 'High-density orchard harvest'],
    ['Walnuts', 'i-walnut', 8, 9, 'Freshly harvested'],
    ['Kiwi', 'i-kiwi', 9, 10, 'Late-autumn tang'],
    ['Veg & flower seedlings', 'i-wheat', 2, 4, 'Ready for your garden'],
    ['Paddy harvest visits', 'i-wheat', 8, 9, 'Student field days', true],
    ['Rainbow trout', 'i-fish', 0, 11, 'Fresh, all year round', true],
    ['Fresh milk', 'i-bull', 0, 11, 'From our own herd', true],
  ];
  const mEl = $('#months'), out = $('#seasonOut'), nowM = new Date().getMonth();
  M.forEach((m, i) => {
    const b = document.createElement('button');
    b.textContent = m; b.setAttribute('role', 'tab');
    if (i === nowM) b.classList.add('now');
    b.addEventListener('click', () => show(i));
    mEl.appendChild(b);
  });
  function show(i) {
    $$('button', mEl).forEach((b, j) => { b.classList.toggle('sel', j === i); b.setAttribute('aria-selected', j === i); });
    const items = CROPS.filter(c => i >= c[2] && i <= c[3]);
    const seasonal = items.filter(c => !(c[2] === 0 && c[3] === 11));
    out.innerHTML = items.map(c => {
      const peak = c[2] !== 0 && (i === c[2] || i === c[3]);
      const badge = c[2] === 0 && c[3] === 11 ? '' : (i === c[2] ? '<em class="badge">Just in</em>' : i === c[3] ? '<em class="badge">Last call</em>' : '');
      return `<div class="sc ${c[5] ? 'alt' : ''}">${badge}<svg viewBox="0 0 ${c[1] === 'i-fish' ? '140 80' : c[1] === 'i-wheat' ? '80 120' : c[1] === 'i-bull' ? '120 110' : '100 100'}"><use href="#${c[1]}"/></svg><b>${c[0]}</b><span>${c[4]}</span></div>`;
    }).join('') + (seasonal.length ? '' : `<p class="empty">The orchards rest in ${FULL[i]} — but the trout and milk keep coming.</p>`);
  }
  show(nowM);

  /* ---------- bubbles ---------- */
  const bub = $('#bubbles');
  if (bub && !reduce) for (let i = 0; i < 14; i++) {
    const s = document.createElement('span'), d = 8 + Math.random() * 26;
    s.style.cssText = `left:${Math.random() * 100}%;width:${d}px;height:${d}px;animation-duration:${9 + Math.random() * 12}s;animation-delay:${-Math.random() * 15}s`;
    bub.appendChild(s);
  }

  /* ---------- gallery (swap in real photos from assets/photos/) ---------- */
  const TILES = [
    ['Apple season', 'i-apple', '#c8302b', 'w2 h2', 'apple'],
    ['Cherries', 'i-cherry', '#6b2a52', '', 'cherries'],
    ['Fresh trout', 'i-fish', '#1d5c66', '', 'trout'],
    ['Dumba sheep', 'i-sheep', '#7a8f4a', 'h2', 'sheep'],
    ['Paddy fields', 'i-wheat', '#b78a2a', '', 'paddy'],
    ['Walnuts', 'i-walnut', '#8a5a3a', '', 'walnuts'],
    ['Kiwi', 'i-kiwi', '#4f7a3a', 'w2', 'kiwi'],
    ['Pears', 'i-pear', '#a3a83a', '', 'pears'],
  ];
  const vb = { 'i-fish': '0 0 140 80', 'i-wheat': '0 0 80 120', 'i-sheep': '0 0 120 100', 'i-bull': '0 0 120 110' };
  $('#mosaic').innerHTML = TILES.map(t => `
    <figure class="tile ${t[3]}" style="background:${t[2]}">
      <svg class="ill" viewBox="${vb[t[1]] || '0 0 100 100'}"><use href="#${t[1]}"/></svg>
      <img class="ph" src="assets/photos/${t[4]}.jpg" alt="${t[0]} at Welkin Farmstead" loading="lazy" onerror="this.remove()">
      <figcaption>${t[0]}</figcaption>
    </figure>`).join('');

  /* ---------- WhatsApp ---------- */
  const wa = txt => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
  $$('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
  $('#order').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, name = f.name.value.trim(), note = f.note.value.trim();
    const picks = $$('input:checked', f).map(i => i.value);
    let msg = `Salaam Welkin Farmstead! ${name ? `I'm ${name}. ` : ''}`;
    msg += picks.length ? `I'd like to enquire about: ${picks.join(', ')}.` : `I'd like to know more about your farm.`;
    if (note) msg += ` ${note}`;
    window.open(wa(msg), '_blank', 'noopener');
  });

  $('#yr').textContent = new Date().getFullYear();
})();
