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
