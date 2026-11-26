(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WA = '917006901374';
  const wa = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

  /* mobile drawer + dropdown */
  const links = $('#links'), burger = $('#burger');
  const setMenu = o => {
    links.classList.toggle('open', o);
    burger.setAttribute('aria-expanded', o);
    burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', o);
  };
  burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); $$('.dd.open').forEach(d => d.classList.remove('open')); } });
  matchMedia('(min-width:861px)').addEventListener('change', () => setMenu(false));
  $$('.dd > button').forEach(b => b.addEventListener('click', () => {
    if (matchMedia('(max-width:860px)').matches) return;
    const d = b.parentElement, o = !d.classList.contains('open');
    d.classList.toggle('open', o); b.setAttribute('aria-expanded', o);
  }));
  document.addEventListener('click', e => { if (!e.target.closest('.dd')) $$('.dd.open').forEach(d => d.classList.remove('open')); });

  /* fade-in */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .08 });
    $$('.card,.tile,.steps li,.band,.form,.season-box,.facts,.role').forEach(el => { el.classList.add('fade'); io.observe(el); });
  }

  /* shop filter */
  const chips = $$('.chips button');
  chips.forEach(b => b.addEventListener('click', () => {
    chips.forEach(x => x.classList.toggle('on', x === b));
    $$('#shopGrid .card').forEach(c => c.hidden = b.dataset.f !== 'all' && c.dataset.cat !== b.dataset.f);
  }));

  /* seasons */
  const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const CROPS = [
    ['Cherries', 'Premium · Cordia · Regina', 4, 6],
    ['Apricots', '', 5, 6],
    ['Ruby Nectarines', '', 6, 7],
    ['Pears', '', 7, 9],
    ['Apples', 'High-density orchard', 7, 10],
    ['Walnuts', '', 8, 9],
    ['Kiwi', '', 9, 10],
    ['Seedlings', 'Vegetables & flowers', 2, 4],
    ['Paddy field visits', 'Student days', 8, 9],
    ['Rainbow trout', 'Welkin Aquaculture', 0, 11],
    ['Fresh milk', 'From our herd', 0, 11],
  ];
  const now = new Date().getMonth(), mEl = $('#months'), out = $('#slist');
  function show(i) {
    if (mEl) $$('button', mEl).forEach((b, j) => { b.classList.toggle('sel', j === i); b.setAttribute('aria-selected', j === i); });
    const items = CROPS.filter(c => i >= c[2] && i <= c[3]);
    out.innerHTML = items.map(c => {
      const all = c[2] === 0 && c[3] === 11;
      const tag = all ? '<span class="tag all">All year</span>' : i === c[2] ? '<span class="tag">Just in</span>' : i === c[3] ? '<span class="tag last">Last call</span>' : '<span class="tag">In season</span>';
      return `<li><div><b>${c[0]}</b>${c[1] ? `<small>${c[1]}</small>` : ''}</div>${tag}</li>`;
    }).join('') || `<li class="empty">Nothing listed for ${FULL[i]}.</li>`;
  }
  if (out) {
    if (mEl) M.forEach((m, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = m; b.setAttribute('role', 'tab');
      if (i === now) b.classList.add('now');
      b.addEventListener('click', () => show(i));
      mEl.appendChild(b);
    });
    show(now);
    const sel = $('.months .sel'); if (sel) sel.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  /* forms → WhatsApp */
  const open = t => window.open(wa(t), '_blank', 'noopener');
  const order = $('#order');
  if (order) {
    const ITEMS = ['Apples', 'Cherries', 'Ruby Nectarines', 'Apricots / Pears', 'Kiwi', 'Walnuts', 'Rainbow trout', 'Fresh milk', 'Dumba sheep', 'Merino sheep', 'Bulls', 'Seedlings', 'A farm visit'];
    $('#opts').innerHTML = ITEMS.map(i => `<label class="opt"><input type="checkbox" value="${i}"><span>${i}</span></label>`).join('');
    order.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target, name = f.name.value.trim(), note = f.note.value.trim();
      const picks = $$('input:checked', f).map(i => i.value);
      let msg = `Salaam Welkin Farmstead! ${name ? `I'm ${name}. ` : ''}`;
      msg += picks.length ? `I'd like to enquire about: ${picks.join(', ')}.` : `I'd like to know more about your farm.`;
      if (note) msg += ` ${note}`;
      open(msg);
    });
  }
  const vf = $('#visitForm');
  if (vf) vf.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, o = f.org.value.trim(), n = f.n.value.trim(), d = f.d.value.trim();
    open(`Salaam Welkin Farmstead! We'd like to arrange a farm visit${o ? ` for ${o}` : ''}${n ? ` — about ${n} students` : ''}${d ? `, around ${d}` : ''}. Please share availability and details.`);
  });

  const y = $('#yr'); if (y) y.textContent = new Date().getFullYear();
})();

/* ===== additions: progress bar, back-to-top, lightbox ===== */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
  const top = document.createElement('button'); top.className = 'totop'; top.type = 'button'; top.setAttribute('aria-label', 'Back to top'); top.textContent = '↑';
  document.body.append(bar, top);
  let tick = false;
  const upd = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
    top.classList.toggle('show', scrollY > 700);
    tick = false;
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  upd();

  /* lightbox */
  const items = $$('.gal a');
  if (!items.length) return;
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = '<button class="x" aria-label="Close">✕</button><button class="pv" aria-label="Previous">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="nx" aria-label="Next">›</button>';
  document.body.appendChild(lb);
  const im = $('img', lb), cap = $('figcaption', lb);
  let i = 0;
  const show = n => {
    i = (n + items.length) % items.length;
    const a = items[i];
    im.src = a.getAttribute('href'); im.alt = a.dataset.cap || '';
    cap.textContent = (a.dataset.cap || '').replace(/&amp;/g, '&');
  };
  const openLb = n => { show(n); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('.x', lb).focus(); };
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  items.forEach((a, n) => a.addEventListener('click', e => { e.preventDefault(); openLb(n); }));
  $('.x', lb).addEventListener('click', closeLb);
  $('.pv', lb).addEventListener('click', () => show(i - 1));
  $('.nx', lb).addEventListener('click', () => show(i + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(i + (d < 0 ? 1 : -1)); });
})();

/* ===== real map (Leaflet + OpenStreetMap tiles) ===== */
(() => {
  const el = document.getElementById('locmap');
  if (!el) return;
  // Edit coordinates here. Both sites currently use the centre of Sopore until exact pins are confirmed.
  const LOCS = [
    { name: 'Welkin Farmstead', lat: 34.301, lng: 74.466, text: 'Orchards, livestock and paddy fields, Sopore, Kashmir 193201. Message us before you visit so we can guide you in.' },
    { name: 'Welkin Aquaculture', lat: 34.301, lng: 74.466, text: 'Rainbow trout in recirculating tanks — expanding in Model Town, Sopore.' },
  ];
  let started = false;
  const start = () => {
    if (started || !window.L) return;
    started = true;
    const mobile = L.Browser.mobile;
    const map = L.map(el, { zoomControl: false, scrollWheelZoom: false, dragging: !mobile, tap: false, attributionControl: true })
      .setView([LOCS[0].lat, LOCS[0].lng], 13);
    map.attributionControl.setPrefix(false);
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    }).addTo(map);
    const area = L.circle([LOCS[0].lat, LOCS[0].lng], { radius: 650, color: '#f26a21', weight: 1.5, fillColor: '#f26a21', fillOpacity: .12 }).addTo(map);
    const pin = n => L.divIcon({ className: 'lm-pin', html: `<span><b>${n}</b></span>`, iconSize: [34, 34], iconAnchor: [17, 40] });
    const marker = L.marker([LOCS[0].lat, LOCS[0].lng], { icon: pin(1), keyboard: false, title: LOCS[0].name }).addTo(map);
    const tabs = [...document.querySelectorAll('.lm-tabs button')];
    const nm = document.getElementById('lmName'), tx = document.getElementById('lmText');
    const select = i => {
      const l = LOCS[i];
      tabs.forEach((t, j) => { t.classList.toggle('on', j === i); t.setAttribute('aria-selected', j === i); });
      nm.textContent = l.name; tx.textContent = l.text;
      marker.setIcon(pin(i + 1)); marker.options.title = l.name;
      marker.setLatLng([l.lat, l.lng]); area.setLatLng([l.lat, l.lng]);
      map.flyTo([l.lat, l.lng], map.getZoom(), { duration: .6 });
    };
    tabs.forEach((t, i) => t.addEventListener('click', () => select(i)));
    tx.textContent = LOCS[0].text;
    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());
    setTimeout(() => map.invalidateSize(), 300);
  };
  document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); start(); } }, { rootMargin: '300px' });
      io.observe(el);
    } else start();
  });
})();

/* ===== journey: road + swipeable stage cards ===== */
(() => {
  const jt = document.getElementById('jt');
  if (!jt) return;
  const $$ = (s, c = jt) => [...c.querySelectorAll(s)];
  const prog = jt.querySelector('.jp'), sl = document.getElementById('jslides'), cnt = document.getElementById('jcount');
  const nodes = $$('.jn'), slides = $$('.jslide'), n = slides.length;
  let cur = 0, lens = [], L = prog.getTotalLength(), lock = false;

  const place = () => {
    L = prog.getTotalLength();
    lens = nodes.map((_, i) => L * (.05 + .9 * i / (n - 1)));
    nodes.forEach((nd, i) => {
      const p = prog.getPointAtLength(lens[i]);
      nd.style.left = (p.x / 1000 * 100) + '%';
      nd.style.top = (p.y / 120 * 100) + '%';
    });
    prog.style.strokeDasharray = L;
    paint();
  };
  const paint = () => {
    nodes.forEach((nd, i) => { nd.classList.toggle('on', i === cur); nd.classList.toggle('done', i < cur); });
    prog.style.strokeDashoffset = L - lens[cur];
    cnt.textContent = `${cur + 1} / ${n}`;
  };
  const stride = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : sl.clientWidth);
  const go = i => {
    cur = Math.max(0, Math.min(n - 1, i));
    paint();
    lock = true;
    sl.scrollTo({ left: cur * stride(), behavior: 'smooth' });
    setTimeout(() => { lock = false; }, 600);
  };
  sl.addEventListener('scroll', () => {
    if (lock) return;
    const i = Math.round(sl.scrollLeft / stride());
    if (i !== cur && i >= 0 && i < n) { cur = i; paint(); }
  }, { passive: true });
  nodes.forEach((nd, i) => nd.addEventListener('click', () => go(i)));
  document.getElementById('jprev').addEventListener('click', () => go(cur - 1));
  document.getElementById('jnext').addEventListener('click', () => go(cur + 1));
  sl.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  });
  addEventListener('resize', () => { place(); sl.scrollLeft = cur * stride(); });
  place();
})();

/* ===== app shell: bottom sheets + back button ===== */
(() => {
  const sheets = [...document.querySelectorAll('.sheet')];
  if (!sheets.length) return;
  const close = () => { sheets.forEach(s => { s.hidden = true; }); document.body.style.overflow = ''; };
  document.querySelectorAll('[data-sheet]').forEach(b => b.addEventListener('click', () => {
    const s = document.getElementById('sheet-' + b.dataset.sheet);
    const wasOpen = !s.hidden;
    close();
    if (!wasOpen) { s.hidden = false; document.body.style.overflow = 'hidden'; }
  }));
  sheets.forEach(s => s.addEventListener('click', e => { if (e.target.closest('[data-close]') || e.target.closest('a')) close(); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  matchMedia('(min-width:861px)').addEventListener('change', close);

  const back = document.querySelector('.ab-back');
  if (back) back.addEventListener('click', e => {
    try {
      if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) { e.preventDefault(); history.back(); }
    } catch (_) { /* fall through to the link */ }
  });
})();
