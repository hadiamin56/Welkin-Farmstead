(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WA = '917006901374';

  /* nav */
  const links = $('#links'), burger = $('#burger');
  burger.addEventListener('click', () => {
    const o = links.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

  /* photo slots — real photos go in assets/photos/<name> */
  $$('.ph').forEach(f => {
    const file = f.dataset.f, cap = f.dataset.cap || '';
    f.innerHTML = `<span class="nophoto">photo: ${file}</span>` +
      `<img src="assets/photos/${file}" alt="${cap} — Welkin Farmstead" loading="lazy" decoding="async" onerror="this.remove()">` +
      (cap ? `<span class="cap">${cap}</span>` : '');
    const img = $('img', f);
    img.addEventListener('load', () => { const n = $('.nophoto', f); if (n) n.remove(); });
  });

  /* fade-in */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .1 });
  $$('.card,.steps li,.band,.form,.season-box,.facts').forEach(el => { el.classList.add('fade'); io.observe(el); });

  /* tabs */
  const tabs = $$('.tabs button');
  tabs.forEach(b => b.addEventListener('click', () => {
    tabs.forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
    $$('.pane').forEach(p => { const on = p.id === b.dataset.t; p.classList.toggle('on', on); p.hidden = !on; });
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
  M.forEach((m, i) => {
    const b = document.createElement('button');
    b.textContent = m; b.setAttribute('role', 'tab');
    if (i === now) b.classList.add('now');
    b.addEventListener('click', () => show(i));
    mEl.appendChild(b);
  });
  function show(i) {
    $$('button', mEl).forEach((b, j) => { b.classList.toggle('sel', j === i); b.setAttribute('aria-selected', j === i); });
    const items = CROPS.filter(c => i >= c[2] && i <= c[3]);
    out.innerHTML = items.map(c => {
      const all = c[2] === 0 && c[3] === 11;
      const tag = all ? '<span class="tag all">All year</span>' : i === c[2] ? '<span class="tag">Just in</span>' : i === c[3] ? '<span class="tag last">Last call</span>' : '<span class="tag">In season</span>';
      return `<li><div><b>${c[0]}</b>${c[1] ? `<small>${c[1]}</small>` : ''}</div>${tag}</li>`;
    }).join('') || `<li class="empty">Nothing listed for ${FULL[i]}.</li>`;
  }
  show(now);

  /* WhatsApp + order form */
  const wa = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
  $$('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
  const ITEMS = ['Apples', 'Cherries', 'Ruby Nectarines', 'Apricots / Pears', 'Kiwi', 'Walnuts', 'Rainbow trout', 'Fresh milk', 'Dumba sheep', 'Merino sheep', 'Bulls', 'Seedlings', 'A farm visit'];
  $('#opts').innerHTML = ITEMS.map(i => `<label class="opt"><input type="checkbox" value="${i}"><span>${i}</span></label>`).join('');
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
