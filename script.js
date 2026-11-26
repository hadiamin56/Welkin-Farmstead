(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WA = '917006901374';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav */
  const nav = $('#nav'), links = $('#links'), burger = $('#burger');
  const onScroll = () => nav.classList.toggle('stuck', scrollY > 60);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', () => {
    const o = links.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

  /* photo slots: real photos live in assets/photos/<name>.jpg */
  $$('.ph').forEach(f => {
    const file = f.dataset.f, cap = f.dataset.cap || '';
    f.innerHTML = `<div class="tag">Photo slot<br>assets/photos/${file}</div>` +
      `<img src="assets/photos/${file}" alt="${cap.replace(/&amp;/g, '&')} — Welkin Farmstead" loading="lazy" decoding="async" onerror="this.remove()">` +
      (cap ? `<figcaption>${cap}</figcaption>` : '');
  });
  // hero photo
  const hb = $('#heroBg'), hi = new Image();
  hi.alt = 'Welkin Farmstead orchards in Sopore, Kashmir'; hi.decoding = 'async';
  hi.onload = () => hb.appendChild(hi);
  hi.src = 'assets/photos/hero.jpg';

  /* reveal */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* hero parallax */
  if (!reduce) {
    let t = false;
    addEventListener('scroll', () => {
      if (t || scrollY > innerHeight * 1.2) return; t = true;
      requestAnimationFrame(() => { hb.style.transform = `translateY(${scrollY * .28}px)`; t = false; });
    }, { passive: true });
  }

  /* manifesto word-by-word */
  const mf = $('#mf');
  mf.innerHTML = mf.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const words = $$('.w', mf);
  const fill = () => {
    const r = mf.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  addEventListener('scroll', fill, { passive: true }); addEventListener('resize', fill); fill();

  /* seasons gantt */
  const M = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  // name, note, from, to (0-indexed), type
  const CROPS = [
    ['Seedlings', 'Vegetables & flowers', 2, 4, ''],
    ['Cherries', 'Premium · Cordia · Regina', 4, 6, 'fruit'],
    ['Apricots', '', 5, 6, 'fruit'],
    ['Ruby Nectarines', '', 6, 7, 'fruit'],
    ['Pears', '', 7, 9, 'fruit'],
    ['Apples', 'High-density orchard', 7, 10, 'fruit'],
    ['Walnuts', '', 8, 9, 'fruit'],
    ['Kiwi', '', 9, 10, 'fruit'],
    ['Paddy visits', 'Student field days', 8, 9, ''],
    ['Rainbow trout', 'Welkin Aquaculture', 0, 11, 'all'],
    ['Fresh milk', 'From our herd', 0, 11, 'all'],
  ];
  const now = new Date().getMonth(), g = $('#gantt');
  g.innerHTML = `<div class="g-row head"><span></span>${M.map((m, i) => `<span class="${i === now ? 'nowm' : ''}">${m}</span>`).join('')}</div>` +
    CROPS.map(c => `<div class="g-row"><div class="g-lab">${c[0]}${c[1] ? `<small>${c[1]}</small>` : ''}</div><div class="grid"></div><div class="g-bar ${c[4]}" style="grid-column:${c[2] + 2}/${c[3] + 3}"></div></div>`).join('') +
    `<div class="g-now" style="left:calc(210px + (100% - 210px) * ${now} / 12);width:calc((100% - 210px) / 12)"></div>`;
  const mq = matchMedia('(max-width:600px)');
  const fixLabel = () => { const w = mq.matches ? '150px' : '210px'; g.querySelectorAll('.g-row').forEach(r => r.style.gridTemplateColumns = `${w} repeat(12,1fr)`);
    const n = $('.g-now', g); n.style.left = `calc(${w} + (100% - ${w}) * ${now} / 12)`; n.style.width = `calc((100% - ${w}) / 12)`; };
  fixLabel(); mq.addEventListener('change', fixLabel);

  /* order slip */
  const ITEMS = ['Apples', 'Cherries', 'Ruby Nectarines', 'Apricots / Pears', 'Kiwi', 'Walnuts', 'Rainbow trout', 'Fresh milk', 'Qurbani animal', 'Seedlings', 'A farm visit', 'Something else'];
  $('#opts').innerHTML = ITEMS.map(i => `<label class="opt"><input type="checkbox" value="${i}"><i>×</i>${i}</label>`).join('');
  $('#slipNo').textContent = 'No. ' + String(Math.floor(Math.random() * 9000) + 1000);
  const wa = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
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
