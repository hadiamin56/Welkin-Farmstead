#!/usr/bin/env python3
"""Generates the static pages. Run:  python3 build.py   (needs Pillow for image sizes)"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
PH = os.path.join(ROOT, 'assets', 'photos')
WA_NUM = '917006901374'
SITE = 'Welkin Farmstead'

# ---------- images ----------
def make_small(file):
    base, ext = os.path.splitext(file)
    src = os.path.join(PH, file)
    im = Image.open(src)
    if im.width > 1000:
        out = os.path.join(PH, f'{base}-800{ext}')
        if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(src):
            im.convert('RGB').resize((800, round(im.height * 800 / im.width)), Image.LANCZOS).save(out, 'JPEG', quality=80, optimize=True, progressive=True)
        return f'assets/photos/{base}-800{ext} 800w, assets/photos/{file} {im.width}w'
    return None

def img(file, alt, sizes='100vw', eager=False):
    w, h = Image.open(os.path.join(PH, file)).size
    ss = make_small(file)
    srcset = f' srcset="{ss}" sizes="{sizes}"' if ss else ''
    load = 'fetchpriority="high"' if eager else 'loading="lazy" decoding="async"'
    return f'<img src="assets/photos/{file}"{srcset} alt="{alt}" width="{w}" height="{h}" {load}>'

def ph(file, cap='', cls='', alt=None, sizes='100vw', eager=False):
    c = f'<span class="cap">{cap}</span>' if cap else ''
    return f'<figure class="ph {cls}">{img(file, alt or cap or "Welkin Farmstead", sizes, eager)}{c}</figure>'

def wa(msg):
    from urllib.parse import quote
    return f'https://wa.me/{WA_NUM}?text={quote(msg)}'

def wabtn(msg, label, cls='btn btn-green'):
    return f'<a class="{cls}" href="{wa(msg)}" target="_blank" rel="noopener">{label}</a>'

# ---------- shared chrome ----------
NAV = [
    ('home', 'index.html', 'Home'),
    ('shop', 'shop.html', 'Shop'),
    ('farm', None, 'Our farm'),
    ('seasons', 'seasons.html', 'Seasons'),
    ('contact', 'contact.html', 'Contact'),
]
FARM = [
    ('orchard', 'orchard.html', 'Orchard', 'Apples, cherries, nectarines & more'),
    ('aqua', 'aquaculture.html', 'Aquaculture', 'Rainbow trout from Welkin Aquaculture'),
    ('livestock', 'livestock.html', 'Livestock', 'Sheep, bulls, milk & Qurbani'),
    ('visits', 'visits.html', 'Farm visits', 'Student days in the fields'),
]

def header(active, sub):
    items = ''
    for key, href, label in NAV:
        if key == 'farm':
            sm = ''.join(f'<a href="{h}"{" class=on aria-current=page" if s == sub else ""}>{l}</a>' for s, h, l, _ in FARM)
            items += (f'<div class="dd{" cur" if active == "farm" else ""}"><button type="button" aria-expanded="false" aria-haspopup="true">{label}'
                      f'<svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>'
                      f'<div class="dd-menu">{sm}</div></div>')
        else:
            cur = ' class="cur" aria-current="page"' if key == active else ''
            items += f'<a href="{href}"{cur}>{label}</a>'
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a href="index.html" class="brand"><img src="assets/logo.png" alt="" width="40" height="40"><span>Welkin Farmstead</span></a>
    <nav class="links" id="links" aria-label="Main">{items}</nav>
    <a class="btn btn-sm btn-green nav-cta" href="contact.html">Order</a>
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="links"><i></i><i></i></button>
  </div>
</header>'''

def footer():
    farm = ''.join(f'<a href="{h}">{l}</a>' for _, h, l, _ in FARM)
    return f'''<footer class="footer">
  <div class="wrap fgrid">
    <div class="fb"><img src="assets/logo.png" alt="Welkin Farmstead logo" width="56" height="56" loading="lazy"><div><b>Welkin Farmstead</b><span>Where goodness grows.</span></div></div>
    <div><h4>Explore</h4><a href="index.html">Home</a><a href="shop.html">Farm shop</a><a href="seasons.html">Seasons</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a></div>
    <div><h4>Our farm</h4>{farm}</div>
    <div><h4>Reach us</h4><a href="tel:+917006901374">70069 01374</a><a href="mailto:waseemhajini86@gmail.com">waseemhajini86@gmail.com</a><a href="https://www.instagram.com/welkinfarmstead/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/welkinfarmstead/" target="_blank" rel="noopener">Facebook</a><span>Sopore, Kashmir 193201</span></div>
  </div>
  <div class="wrap fcopy">© <span id="yr">2026</span> Welkin Farmstead · Managed by Waseem Anayat Hajini</div>
</footer>
<div class="mbar"><a class="m-call" href="tel:+917006901374">Call</a><a class="m-wa" href="{wa("Salaam Welkin Farmstead! I'd like to know more.")}" target="_blank" rel="noopener">WhatsApp</a></div>
<script src="script.js"></script>'''

LD = '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"Farm","name":"Welkin Farmstead","slogan":"Where Goodness Grows","telephone":"+91-7006901374","email":"waseemhajini86@gmail.com","image":"assets/photos/hero.jpg","address":{"@type":"PostalAddress","addressLocality":"Sopore","addressRegion":"Jammu & Kashmir","postalCode":"193201","addressCountry":"IN"},"sameAs":["https://www.instagram.com/welkinfarmstead/","https://www.facebook.com/welkinfarmstead/"]}</script>'''

def page(fname, title, desc, body, active='', sub='', og='hero.jpg', preload=None):
    pl = f'<link rel="preload" as="image" href="assets/photos/{preload}" fetchpriority="high">' if preload else ''
    full_title = SITE + ' — Where Goodness Grows · Sopore, Kashmir' if fname == 'index.html' else f'{title} · {SITE}'
    html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{full_title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#1f5a3a">
<meta property="og:title" content="{full_title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/photos/{og}">
<link rel="icon" href="assets/logo.png">
<link rel="apple-touch-icon" href="assets/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
{pl}
<link rel="stylesheet" href="styles.css">
{LD}
</head>
<body data-page="{active}">
{header(active, sub)}
<main id="main">
{body}
</main>
{footer()}
</body>
</html>
'''
    with open(os.path.join(ROOT, fname), 'w') as f:
        f.write(html)
    print('wrote', fname)

# ---------- components ----------
def phead(crumbs, h1, lead, banner_file, banner_alt, ctas=''):
    cr = ' <span>/</span> '.join(f'<a href="{h}">{t}</a>' if h else f'<b>{t}</b>' for t, h in crumbs)
    return f'''<section class="phead">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">{cr}</nav>
    <div class="ph-top"><h1>{h1}</h1><div><p class="lead">{lead}</p>{f'<div class="actions">{ctas}</div>' if ctas else ''}</div></div>
    {ph(banner_file, '', 'banner', banner_alt, '(min-width:1140px) 1140px, 100vw', True)}
  </div>
</section>'''

def sec(inner, tint=False, id=''):
    return f'<section class="sec{" tint" if tint else ""}"{f" id={id}" if id else ""}><div class="wrap">{inner}</div></section>'

def sh(eyebrow, h2, sub=''):
    return f'<header class="sh"><p class="eyebrow">{eyebrow}</p><h2>{h2}</h2>{f"<p class=sub>{sub}</p>" if sub else ""}</header>'

def band(h, p, btn):
    return f'<section class="sec"><div class="wrap"><div class="band"><div><h2>{h}</h2><p>{p}</p></div>{btn}</div></div></section>'

PRODUCTS = [
    ('fruit', 'orchard.jpg', 'Apples', 'From our high-density orchard blocks.', "Salaam Welkin Farmstead! I'd like to enquire about apples — availability and rates, please."),
    ('fruit', 'cherries.jpg', 'Cherries', 'Premium, Cordia and Regina varieties.', "Salaam Welkin Farmstead! I'd like to enquire about cherries (Premium / Cordia / Regina) — availability and rates, please."),
    ('fruit', 'nectarines.jpg', 'Ruby Nectarines', 'Juicy stone fruit with ruby-red flesh.', "Salaam Welkin Farmstead! I'd like to enquire about Ruby Nectarines — availability and rates, please."),
    ('fruit', 'walnuts.jpg', 'Walnuts &amp; kiwi', 'Autumn harvest, straight from the farm.', "Salaam Welkin Farmstead! I'd like to enquire about walnuts and kiwi — availability and rates, please."),
    ('fish', 'trout.jpg', 'Rainbow trout', 'Farm-fresh from Welkin Aquaculture.', "Salaam Welkin Aquaculture! I'd like to order fresh rainbow trout. Please share availability and rates."),
    ('live', 'sheep.jpg', 'Dumba sheep', 'Hardy fat-tailed sheep. Qurbani bookings open.', "Salaam Welkin Farmstead! I'd like to enquire about Dumba sheep (Qurbani). Please share weights and rates."),
    ('live', 'merino.jpg', 'Merino sheep', 'Fine-wool breed, raised on the farm.', "Salaam Welkin Farmstead! I'd like to enquire about Merino sheep. Please share details and rates."),
    ('live', 'bull.jpg', 'Bulls', 'Healthy animals for Qurbani and farm use.', "Salaam Welkin Farmstead! I'd like to enquire about bulls (Qurbani / farm). Please share details and rates."),
]

def card(p):
    cat, f, name, text, msg = p
    return (f'<article class="card" data-cat="{cat}">{ph(f, name.replace("&amp;", "&"), "", None, "(min-width:980px) 270px, 50vw")}'
            f'<div class="cb"><h3>{name}</h3><p>{text}</p><a class="link" href="{wa(msg)}" target="_blank" rel="noopener">Enquire on WhatsApp →</a></div></article>')

def steps(items):
    return '<ol class="steps">' + ''.join(f'<li><b>{i}</b><div><h3>{t}</h3><p>{d}</p></div></li>' for i, (t, d) in enumerate(items, 1)) + '</ol>'

def ticks(items):
    return '<ul class="ticks">' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>'

def split(left, right, rev=False):
    return f'<div class="split{" rev" if rev else ""}"><div class="sp-l">{left}</div><div class="sp-r">{right}</div></div>'

def tiles():
    data = [
        ('orchard.html', 'orchard.jpg', 'Orchard', 'High-density apples, stone fruit, kiwi and walnuts.'),
        ('aquaculture.html', 'tanks.jpg', 'Aquaculture', 'Rainbow trout raised in recirculating tanks.'),
        ('livestock.html', 'livestock.jpg', 'Livestock', 'Dumba &amp; Merino sheep, bulls, milk and Qurbani.'),
        ('visits.html', 'paddy.jpg', 'Farm visits', 'Hands-on field days for students.'),
    ]
    return '<div class="tiles">' + ''.join(
        f'<a class="tile" href="{h}">{img(f, t, "(min-width:980px) 270px, 50vw")}<div class="tt"><h3>{t}</h3><p>{d}</p><span>Explore →</span></div></a>'
        for h, f, t, d in data) + '</div>'

ENQ_BAND = band('Ready to order?', 'Message us on WhatsApp — tell us what you need and we\'ll reply with availability and rates.',
                wabtn("Salaam Welkin Farmstead! I'd like to place an order.", 'Order on WhatsApp', 'btn btn-light'))

# ---------- pages ----------
def home():
    hero = f'''<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="pill"><span></span> Sopore, Kashmir · 193201</p>
      <h1>Where goodness grows.</h1>
      <p class="lead">Welkin Farmstead is a family-run agricultural and aquaculture farm. High-density apple orchards, farm-fresh rainbow trout, sheep, bulls and milk — raised in Sopore, sold directly by us.</p>
      <div class="actions"><a class="btn btn-green" href="shop.html">Browse the farm shop</a>{wabtn("Salaam Welkin Farmstead! I'd like to know more about your farm products.", 'Chat on WhatsApp', 'btn btn-ghost')}</div>
    </div>
    <div class="collage">
      {ph('hero.jpg', 'Welkin orchards, Sopore', 'a', None, '(min-width:980px) 520px, 100vw', True)}
      {ph('trout.jpg', 'Rainbow trout', 'b', None, '(min-width:980px) 260px, 50vw')}
      {ph('sheep.jpg', 'Dumba sheep', 'c', None, '(min-width:980px) 260px, 50vw')}
    </div>
  </div>
  <div class="wrap facts">
    <div><b>7</b><span>orchard crops — apples to kiwi</span></div>
    <div><b>RAS</b><span>recirculating-tank rainbow trout</span></div>
    <div><b>Dumba &amp; Merino</b><span>sheep, plus bulls and milk</span></div>
    <div><b>Open farm</b><span>field visits for students</span></div>
  </div>
</section>'''
    featured = sec(sh('Farm shop', 'Fresh from the farm', 'A few things we\'re known for. See everything in the shop.') +
                   '<div class="cards">' + ''.join(card(PRODUCTS[i]) for i in (0, 1, 4, 5)) + '</div>' +
                   '<p class="more"><a class="btn btn-ghost" href="shop.html">See all products →</a></p>')
    farm = sec(sh('Our farm', 'Four ways we farm') + tiles(), tint=True)
    season = sec(sh('Seasons', "In season right now", 'Typical Kashmir timing — message us for exact availability.') +
                 '<ul class="slist" id="slist" aria-live="polite"></ul><p class="more"><a class="btn btn-ghost" href="seasons.html">Full season calendar →</a></p>')
    visit = sec(split(
        '<p class="eyebrow">Farm visits</p><h2>A day in the fields</h2><p class="sub">Schools and colleges are welcome to spend a day with us — harvesting, threshing, winnowing and touring the orchard, herd and trout tanks.</p><p><a class="btn btn-green" href="visits.html">Plan a visit</a></p>',
        ph('paddy.jpg', 'Students on a Welkin farm visit', '', None, '(min-width:980px) 560px, 100vw')), tint=True)
    return hero + featured + farm + season + visit + band('Join the Welkin team', "We're hiring for farm operations, sales, logistics, maintenance and supervision.", '<a class="btn btn-light" href="careers.html">See open roles</a>')

def shop():
    chips = '<div class="chips" role="group" aria-label="Filter products"><button class="on" data-f="all">All</button><button data-f="fruit">Fruit &amp; nuts</button><button data-f="fish">Fish</button><button data-f="live">Livestock</button></div>'
    body = sec(f'<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> <span>/</span> <b>Shop</b></nav><h1 class="ph1">Farm shop</h1><p class="lead">Tap Enquire on anything and WhatsApp opens with the message ready — we\'ll reply with availability and rates.</p>' +
               chips + '<div class="cards" id="shopGrid">' + ''.join(card(p) for p in PRODUCTS) + '</div>' +
               '<p class="also">Also from the farm: <b>pears</b> · <b>apricots</b> · <b>fresh milk</b> · <b>vegetable &amp; flower seedlings</b></p>')
    how = sec(sh('How ordering works', 'Three easy steps') + steps([
        ('Pick what you need', 'Choose products from the shop, or just tell us what you\'re after.'),
        ('Message us', 'Tap Enquire — WhatsApp opens with your message ready to send.'),
        ('We confirm', 'We reply with availability, price and how you\'ll receive your order.')]), tint=True)
    return body + how + ENQ_BAND

def orchard():
    crops = [('harvest.jpg', 'Apples &amp; pears', 'Our flagship — apples from high-density blocks, plus pears.'),
             ('cherries.jpg', 'Cherries', 'Three varieties: Premium, Cordia and Regina.'),
             ('nectarines.jpg', 'Ruby Nectarines &amp; apricots', 'Summer stone fruit, sweet and juicy.'),
             ('walnuts.jpg', 'Walnuts &amp; kiwi', 'Autumn harvest to round out the year.')]
    grid = '<div class="cards">' + ''.join(
        f'<article class="card">{ph(f, t.replace("&amp;", "&"), "", None, "(min-width:980px) 270px, 50vw")}<div class="cb"><h3>{t}</h3><p>{d}</p></div></article>' for f, t, d in crops) + '</div>'
    why = sec(split(
        '<p class="eyebrow">Why high-density</p><h2>More trees, earlier fruit</h2><p class="sub">In a high-density orchard, trees are planted close together and trained on supports. That means more fruiting trees per acre, fruit that starts earlier, and care and picking that are easier on the people doing it.</p>' +
        ticks(['More trees per acre', 'Earlier fruit', 'Easier care &amp; picking', 'Seedlings for your garden too']),
        ph('orchard.jpg', 'Welkin team working in the orchard', '', None, '(min-width:980px) 560px, 100vw')), tint=True)
    body = (phead([('Home', 'index.html'), ('Our farm', None), ('Orchard', None)], 'The Welkin orchard',
                  'High-density apple orchards, plus pears, Ruby Nectarines, apricots, cherries, kiwi and walnuts — grown in Sopore.',
                  'orchard.jpg', 'Welkin orchard in Sopore', wabtn("Salaam Welkin Farmstead! I'd like to order fruit from your orchard. Please share what's available and the rates.", 'Order fruit') + '<a class="btn btn-ghost" href="seasons.html">When is it ready?</a>')
            + sec(sh('What we grow', 'From the orchard') + grid) + why
            + sec(sh('Also', 'Seedlings for your garden', 'We raise vegetable and flower seedlings too. Message us to ask what\'s ready.') + '', False)
            + ENQ_BAND)
    return body

def aqua():
    how = steps([('Fish tanks', 'Rainbow trout swim in clean, controlled tanks.'),
                 ('Solids filter', 'Waste and uneaten feed are filtered out of the water.'),
                 ('Biofilter', 'Helpful bacteria convert harmful compounds into safer ones.'),
                 ('Oxygen &amp; reuse', 'Water is re-oxygenated and returned to the tanks to be used again.')])
    s1 = sec(split(
        '<p class="eyebrow">Welkin Aquaculture</p><h2>Something fresh is making waves</h2><p class="sub">We\'re bringing farm-fresh rainbow trout straight from our tanks in Model Town, Sopore to your kitchen — raised with care in a closed, clean loop.</p>' +
        ticks(['Raised in a Recirculating Aquaculture System (RAS)', 'Far less water than a traditional pond', 'A short farm-to-table journey', 'Expanding in Model Town, Sopore']),
        ph('trout.jpg', 'Rainbow trout in a Welkin tank', '', None, '(min-width:980px) 560px, 100vw')))
    s2 = sec(sh('How RAS works', 'A loop of clean water', 'A Recirculating Aquaculture System cleans and reuses its water instead of constantly replacing it.') + how, tint=True)
    body = (phead([('Home', 'index.html'), ('Our farm', None), ('Aquaculture', None)], 'Welkin Aquaculture',
                  'Farm-fresh rainbow trout raised in a Recirculating Aquaculture System in Sopore.',
                  'tanks-wide.jpg', 'Welkin Aquaculture trout tanks', wabtn("Salaam Welkin Aquaculture! I'd like to order fresh rainbow trout. Please share availability and rates.", 'Order fresh trout'))
            + s1 + s2 + ENQ_BAND)
    return body

def livestock():
    breeds = [('sheep.jpg', 'Dumba sheep', 'Hardy, fat-tailed sheep.'), ('merino.jpg', 'Merino sheep', 'A fine-wool breed.'), ('bull.jpg', 'Bulls', 'For Qurbani and farm use.')]
    grid = '<div class="cards c3">' + ''.join(f'<article class="card">{ph(f, t, "", None, "(min-width:980px) 360px, 50vw")}<div class="cb"><h3>{t}</h3><p>{d}</p></div></article>' for f, t, d in breeds) + '</div>'
    q = sec(split(
        '<p class="eyebrow">Eid-ul-Adha Qurbani</p><h2>Book your Qurbani early</h2><p class="sub">Qurbani spots fill early. Tell us the animal you prefer and your budget, and we\'ll come back with options.</p>' +
        steps([('Message us', 'Tell us breed, approximate weight and budget.'), ('We share options', 'We reply with what\'s available and the rates.'), ('Confirm your booking', 'Reserve your animal ahead of Eid.')]),
        ph('livestock.jpg', 'Sheep and cattle grazing at Welkin Farmstead', '', None, '(min-width:980px) 560px, 100vw')), tint=True)
    body = (phead([('Home', 'index.html'), ('Our farm', None), ('Livestock', None)], 'Livestock &amp; dairy',
                  'Healthy sheep and bulls raised on the farm, fresh milk, and early Qurbani bookings.',
                  'livestock.jpg', 'Sheep and cattle at Welkin Farmstead', wabtn("Salaam Welkin Farmstead! I'd like to book an animal for Eid-ul-Adha Qurbani. Please share breeds, weights and rates.", 'Book Qurbani'))
            + sec(sh('Our animals', 'Breeds we raise') + grid + '<p class="also">We also supply <b>fresh milk</b> from our herd — message us for details.</p>')
            + q + ENQ_BAND)
    return body

def visits():
    s1 = sec(split(
        '<p class="eyebrow">Educational visits</p><h2>A real day of agriculture</h2><p class="sub">Schools and colleges are welcome. Students join us in the paddy fields to harvest, thresh and winnow rice by hand — then see the orchard, herd and trout tanks.</p>' +
        ticks(['Paddy harvesting', 'Threshing &amp; winnowing', 'Orchard &amp; herd tour', 'Student groups welcome']),
        ph('paddy.jpg', 'Students on a Welkin farm visit', '', None, '(min-width:980px) 560px, 100vw')))
    s2 = sec(sh('The day', 'What students do') + steps([('Harvest', 'Cut ripened paddy by hand in the field.'), ('Thresh', 'Separate the grain from the stalk the traditional way.'),
                                                       ('Winnow', 'Let the wind carry the husk away.'), ('Tour', 'Walk the orchard, meet the herd and see the trout tanks.')]), tint=True)
    form = sec(split('<p class="eyebrow">Plan a visit</p><h2>Tell us about your group</h2><p class="sub">Fill this in and WhatsApp opens with your message ready.</p>',
        '''<form class="form" id="visitForm"><label class="fld"><span>School / college</span><input name="org" type="text" autocomplete="organization" placeholder="Name of your institution"></label>
<label class="fld"><span>Number of students</span><input name="n" type="text" inputmode="numeric" placeholder="e.g. 40"></label>
<label class="fld"><span>Preferred date</span><input name="d" type="text" placeholder="e.g. mid-October"></label>
<button class="btn btn-green wide" type="submit">Send on WhatsApp</button></form>'''))
    return (phead([('Home', 'index.html'), ('Our farm', None), ('Farm visits', None)], 'Farm visits for students',
                  'Hands-on field days at Welkin Farmstead — paddy harvesting, threshing, winnowing and farm tours.',
                  'paddy.jpg', 'Students on a farm visit at Welkin Farmstead', wabtn("Salaam Welkin Farmstead! We'd like to arrange an educational farm visit for students. Please share dates and details.", 'Request a visit'))
            + s1 + s2 + form)

def seasons():
    return (sec('<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> <span>/</span> <b>Seasons</b></nav><h1 class="ph1">What\'s good right now</h1><p class="lead">Choose a month to see what the valley is offering. Timings are typical for Kashmir and move with the weather — message us for exact availability.</p>'
                '<div class="season-box"><div class="months" id="months" role="tablist" aria-label="Month"></div><ul class="slist" id="slist" aria-live="polite"></ul></div>')
            + ENQ_BAND)

def careers():
    roles = [('Farm operations', 'Orchard, field and herd work.'), ('Sales', 'Talk to customers and take orders.'), ('Logistics', 'Get fresh produce where it needs to go.'),
             ('Maintenance', 'Keep equipment, tanks and facilities running.'), ('Supervision', 'Lead and coordinate farm teams.')]
    cards = '<div class="roles">' + ''.join(
        f'<div class="role"><div><h3>{t}</h3><p>{d}</p></div>{wabtn(f"Salaam Welkin Farmstead! I am interested in the {t} role. My name is ___ and I have ___ experience.", "Apply", "btn btn-ghost btn-sm")}</div>' for t, d in roles) + '</div>'
    return sec('<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> <span>/</span> <b>Careers</b></nav><h1 class="ph1">Join the Welkin team</h1><p class="lead">We\'re growing. Welkin Farmstead is hiring across farm operations, sales, logistics, maintenance and supervision. Pick a role and apply on WhatsApp.</p>' + cards)

def contact():
    return sec(split(
        '<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> <span>/</span> <b>Contact</b></nav><h1 class="ph1">Order or enquire</h1><p class="lead">Choose what you\'re after and send. WhatsApp opens with your message ready.</p>'
        '''<ul class="clist"><li><span>WhatsApp / phone</span><a href="tel:+917006901374">70069 01374</a></li>
<li><span>Email</span><a href="mailto:waseemhajini86@gmail.com">waseemhajini86@gmail.com</a></li>
<li><span>Location</span><b>Sopore, Kashmir 193201</b></li>
<li><span>Instagram</span><a href="https://www.instagram.com/welkinfarmstead/" target="_blank" rel="noopener">@welkinfarmstead</a></li>
<li><span>Facebook</span><a href="https://www.facebook.com/welkinfarmstead/" target="_blank" rel="noopener">Welkin Farmstead</a></li></ul>''',
        '''<form class="form" id="order" autocomplete="on"><label class="fld"><span>Your name</span><input name="name" type="text" autocomplete="name" placeholder="Your name"></label>
<fieldset><legend>I'm interested in</legend><div class="opts" id="opts"></div></fieldset>
<label class="fld"><span>Notes (quantity, date, city)</span><textarea name="note" rows="3" placeholder="e.g. 2 boxes of apples, deliver to Srinagar"></textarea></label>
<button class="btn btn-green wide" type="submit">Send on WhatsApp</button></form>'''))

def notfound():
    return sec('<div class="nf"><p class="eyebrow">404</p><h1 class="ph1">This page wandered off.</h1><p class="lead">The page you\'re looking for isn\'t here. Let\'s get you back to the farm.</p><p class="actions"><a class="btn btn-green" href="index.html">Go home</a><a class="btn btn-ghost" href="shop.html">Farm shop</a></p></div>')

PAGES = [
    ('index.html', 'Home', 'Welkin Farmstead in Sopore, Kashmir: apple orchards, rainbow trout, sheep, bulls, milk, Qurbani bookings and student farm visits.', home, 'home', '', 'hero-800.jpg'),
    ('shop.html', 'Farm shop', 'Shop apples, cherries, Ruby Nectarines, walnuts, rainbow trout, Dumba and Merino sheep and bulls from Welkin Farmstead, Sopore.', shop, 'shop', '', None),
    ('orchard.html', 'Orchard', 'High-density apple orchards plus pears, Ruby Nectarines, apricots, cherries, kiwi and walnuts at Welkin Farmstead, Sopore.', orchard, 'farm', 'orchard', 'orchard-800.jpg'),
    ('aquaculture.html', 'Aquaculture', 'Welkin Aquaculture: farm-fresh rainbow trout raised in a Recirculating Aquaculture System in Sopore, Kashmir.', aqua, 'farm', 'aqua', 'tanks-wide-800.jpg'),
    ('livestock.html', 'Livestock & Qurbani', 'Dumba and Merino sheep, bulls, fresh milk and Eid-ul-Adha Qurbani bookings at Welkin Farmstead, Sopore.', livestock, 'farm', 'livestock', 'livestock-800.jpg'),
    ('visits.html', 'Farm visits', 'Educational farm visits for students at Welkin Farmstead: paddy harvesting, threshing, winnowing and farm tours.', visits, 'farm', 'visits', 'paddy-800.jpg'),
    ('seasons.html', 'Seasons', 'A seasonal guide to what is ready when at Welkin Farmstead in Kashmir: cherries, apricots, nectarines, apples, walnuts, kiwi and more.', seasons, 'seasons', '', None),
    ('careers.html', 'Careers', 'Jobs at Welkin Farmstead: farm operations, sales, logistics, maintenance and supervision roles in Sopore.', careers, 'careers', '', None),
    ('contact.html', 'Contact', 'Order or enquire at Welkin Farmstead, Sopore, Kashmir. WhatsApp 70069 01374.', contact, 'contact', '', None),
    ('404.html', 'Page not found', 'Page not found.', notfound, '', '', None),
]

if __name__ == '__main__':
    for fname, title, desc, fn, active, sub, pre in PAGES:
        page(fname, title, desc, fn(), active, sub)
