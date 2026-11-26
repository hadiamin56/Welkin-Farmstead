#!/usr/bin/env python3
"""Generates the static pages. Run:  python3 build.py   (needs Pillow for image sizes)"""
import os
import re
from PIL import Image
from art import SPRITE, SKYLINE
import botanicals as bt
from botanicals import d as deco, icon as aicon

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
    ('gallery', 'gallery.html', 'Gallery'),
    ('contact', 'contact.html', 'Contact'),
]
FARM = [
    ('orchard', 'orchard.html', 'Orchard', 'Apples, cherries, nectarines & more'),
    ('aqua', 'aquaculture.html', 'Aquaculture', 'Rainbow trout from Welkin Aquaculture'),
    ('livestock', 'livestock.html', 'Livestock', 'Sheep, bulls, milk & Qurbani'),
    ('visits', 'visits.html', 'Farm visits', 'Student days in the fields'),
]

def header(active, sub, title=''):
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
<div class="annc" id="annc"><div class="wrap"><span>Eid-ul-Adha Qurbani bookings are open</span><a href="{wa("Salaam Welkin Farmstead! I'd like to book an animal for Eid-ul-Adha Qurbani.")}" target="_blank" rel="noopener">Book on WhatsApp →</a></div></div>
<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a href="index.html" class="brand"><img src="assets/logo.png" alt="" width="40" height="40"><span>Welkin Farmstead</span></a>
    <a class="ab-back" href="index.html" aria-label="Back">{AB_BACK}</a><span class="ab-title">{title}</span>
    <nav class="links" id="links" aria-label="Main">{items}</nav>
    <a class="btn btn-sm btn-green nav-cta" href="contact.html">Order</a>
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="links"><i></i><i></i></button>
    <a class="ab-act" href="tel:+917006901374" aria-label="Call Welkin Farmstead">{AB_CALL}</a>
  </div>
</header>'''

def footer(active='', sub=''):
    farm = ''.join(f'<a href="{h}">{l}</a>' for _, h, l, _ in FARM)
    return SKYLINE + f'''<footer class="footer">
  <div class="wrap fgrid">
    <div class="fb"><img src="assets/logo.png" alt="Welkin Farmstead logo" width="56" height="56" loading="lazy"><div><b>Welkin Farmstead</b><span>Where goodness grows.</span></div></div>
    <div><h4>Explore</h4><a href="index.html">Home</a><a href="shop.html">Farm shop</a><a href="seasons.html">Seasons</a><a href="gallery.html">Gallery</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a></div>
    <div><h4>Our farm</h4>{farm}</div>
    <div><h4>Reach us</h4><a href="tel:+917006901374">70069 01374</a><a href="mailto:waseemhajini86@gmail.com">waseemhajini86@gmail.com</a><span>Sopore, Kashmir 193201</span><div class="social">{SOCIAL}</div></div>
  </div>
  <div class="wrap fcopy">© <span id="yr">2026</span> Welkin Farmstead · Managed by Waseem Anayat Hajini</div>
</footer>
{appnav(active, sub)}
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
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
{pl}
<link rel="stylesheet" href="styles.css">
{MAPHEAD if "data-locmap" in body else ""}
{LD}
</head>
<body data-page="{active}">
{SPRITE}
{bt.sprite()}
{header(active, sub, '' if fname == 'index.html' else title)}
<main id="main">
{pdeco(fname)}
{body}
</main>
{footer(active, sub)}
</body>
</html>
'''
    with open(os.path.join(ROOT, fname), 'w') as f:
        f.write(html)
    print('wrote', fname)


# ---------- icons & extra components ----------
def svg(path, vb='0 0 24 24', stroke=True):
    a = 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"' if stroke else 'fill="currentColor"'
    return f'<svg viewBox="{vb}" width="24" height="24" {a} aria-hidden="true">{path}</svg>'

ICON = {
    'leaf': svg('<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19c3-5 6-8 10-10"/>'),
    'fish': svg('<path d="M3 12c3-5 9-6 13-2l5-3v10l-5-3c-4 4-10 3-13-2z"/><circle cx="8" cy="11" r=".6" fill="currentColor"/>'),
    'hand': svg('<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/>'),
    'cap': svg('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.500 6-3v-4.500"/>'),
    'pin': svg('<path d="M12 21s7-6.200 7-11.500A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/>'),
    'phone': svg('<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    'mail': svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    'ig': svg('<rect x="3.500" y="3.500" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".8" fill="currentColor"/>'),
    'fb': svg('<path d="M14 8h2V5h-2.500C11 5 10 6.500 10 8.500V10H8v3h2v6h3v-6h2.300l.4-3H13V8.800c0-.5.2-.8 1-.8z"/>', stroke=False),
    'wa': svg('<path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm0 1.800a8.200 8.200 0 1 1-4.200 15.300l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 0 1 12 3.800zM8.600 7.600c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.400s1 2.800 1.200 3c.1.200 2 3.200 5 4.400 2.400 1 2.900.8 3.400.7.600-.1 1.700-.7 1.900-1.400.2-.7.2-1.200.2-1.400-.1-.1-.3-.2-.6-.3l-1.800-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.1.200-.3.2-.6.1-.3-.1-1.200-.4-2.200-1.400-.8-.7-1.400-1.600-1.500-1.900-.2-.3 0-.4.1-.6l.4-.4.3-.5v-.5l-.8-2c-.2-.5-.4-.5-.6-.5z"/>', stroke=False),
}
SOCIAL = (f'<a href="https://www.instagram.com/welkinfarmstead/" target="_blank" rel="noopener" aria-label="Instagram">{ICON["ig"]}</a>'
          f'<a href="https://www.facebook.com/welkinfarmstead/" target="_blank" rel="noopener" aria-label="Facebook">{ICON["fb"]}</a>'
          f'<a href="{wa("Salaam Welkin Farmstead! I\'d like to know more.")}" target="_blank" rel="noopener" aria-label="WhatsApp">{ICON["wa"]}</a>')

MAPQ = 'Welkin+Farmstead,+Sopore,+Kashmir+193201'
AB_BACK = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'
AB_CALL = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>'
MAPHEAD = '<link rel="stylesheet" href="assets/vendor/leaflet/leaflet.css">\n<script src="assets/vendor/leaflet/leaflet.js" defer></script>'

def findus(compact=False):
    return f'''<div class="map-grid">
  <div class="map-info">
    <p class="eyebrow">Find us</p><h2>Visit Welkin Farmstead</h2>
    <p class="sub">We\'re in Sopore, Kashmir — the apple town of the valley. Welkin Aquaculture is expanding in Model Town, Sopore. Message us before you come so we can guide you in.</p>
    <ul class="info">
      <li>{ICON["pin"]}<div><b>Address</b><span>Sopore, Jammu &amp; Kashmir 193201</span></div></li>
      <li>{ICON["phone"]}<div><b>Call / WhatsApp</b><a href="tel:+917006901374">70069 01374</a></div></li>
      <li>{ICON["mail"]}<div><b>Email</b><a href="mailto:waseemhajini86@gmail.com">waseemhajini86@gmail.com</a></div></li>
    </ul>
    <div class="actions"><a class="btn btn-green" href="https://www.google.com/maps/dir/?api=1&destination={MAPQ}" target="_blank" rel="noopener">Get directions</a><a class="btn btn-ghost" href="https://www.openstreetmap.org/search?query=Sopore%2C%20Kashmir" target="_blank" rel="noopener">Open full map</a></div>
  </div>
  <div class="locmap" data-locmap>
    <div class="lm-head"><span>Find us · Geographic map</span><span class="osm"><i></i>OpenStreetMap</span></div>
    <div class="lm-wrap"><div class="lm-map" id="locmap" role="region" aria-label="Map showing Welkin Farmstead in Sopore, Kashmir"></div><div class="lm-chip"><span>Kashmir</span><span>2 sites</span></div></div>
    <noscript><p class="lm-ns">Enable JavaScript to see the interactive map, or <a href="https://www.openstreetmap.org/search?query=Sopore%2C%20Kashmir" target="_blank" rel="noopener">open it on OpenStreetMap</a>.</p></noscript>
    <div class="lm-tabs" role="tablist" aria-label="Locations"><button role="tab" class="on" aria-selected="true" data-i="0"><b>1</b>Welkin Farmstead</button><button role="tab" aria-selected="false" data-i="1"><b>2</b>Welkin Aquaculture</button></div>
    <div class="lm-detail" aria-live="polite"><h3 id="lmName">Welkin Farmstead</h3><p id="lmText"></p></div>
  </div>
</div>'''

def features():
    data = [('leaf', 'Grown in Sopore', 'Orchards and tanks in the apple town of Kashmir.'),
            ('fish', 'Farm-fresh trout', 'Raised in clean recirculating tanks, a short trip to your kitchen.'),
            ('hand', 'Straight from the farm', 'Apples, fish, sheep and milk — sold directly by the people who raise them.'),
            ('cap', 'Open to learn', 'Student farm visits: paddy harvest, threshing, winnowing and tours.')]
    return '<div class="feats">' + ''.join(f'<div class="feat"><span class="num">0{n}</span><span class="ic">{ICON[i]}</span><h3>{t}</h3><p>{d}</p></div>' for n, (i, t, d) in enumerate(data, 1)) + '</div>'

FAQ = [
    ('How do I order?', "Tap any Enquire or Order button — WhatsApp opens with your message ready. We reply with availability, price and how you'll receive your order."),
    ('Do you take Qurbani bookings?', 'Yes. Eid-ul-Adha Qurbani bookings are taken ahead of time. Message us the breed (Dumba, Merino or bull), approximate weight and budget, and we\'ll share options.'),
    ('When is each fruit available?', 'See our Seasons page for typical Kashmir timing. It shifts with the weather, so message us for exact availability.'),
    ('Can my school or college visit?', 'Yes — student groups are welcome for paddy harvesting, threshing, winnowing and a farm tour. Fill in the form on the Farm visits page.'),
    ('Where are you located?', 'Welkin Farmstead is in Sopore, Kashmir 193201. Welkin Aquaculture is expanding in Model Town, Sopore.'),
    ('Are you hiring?', 'We hire for farm operations, sales, logistics, maintenance and supervision. See the Careers page and apply on WhatsApp.'),
]
def faq():
    return '<div class="faq">' + ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in FAQ) + '</div>'

def follow_band():
    return (f'<section class="sec"><div class="wrap"><div class="follow"><div><h2>Follow the farm</h2><p>Daily updates, harvests and new arrivals on Instagram and Facebook.</p></div>'
            f'<div class="social big">{SOCIAL}</div></div></div></section>')

GALLERY = [('hero.jpg', 'Aerial view of the farm'), ('orchard.jpg', 'In the orchard'), ('harvest.jpg', 'Fresh harvest'), ('tanks-wide.jpg', 'Welkin Aquaculture'),
           ('livestock.jpg', 'Sheep and cattle'), ('paddy.jpg', 'Student farm visit'), ('cherries.jpg', 'Cherries'), ('trout.jpg', 'Rainbow trout'),
           ('merino.jpg', 'Merino sheep'), ('nectarines.jpg', 'Ruby Nectarines'), ('bull.jpg', 'Bulls'), ('walnuts.jpg', 'Walnuts &amp; kiwi')]
def gallery_grid():
    return '<div class="gal">' + ''.join(
        f'<a href="assets/photos/{f}" data-cap="{c}"><span class="gimg">{img(f, c, "(min-width:980px) 360px, 50vw")}</span><span class="gcap">{c}</span></a>' for f, c in GALLERY) + '</div>'


# ---------- background graphics ----------
VB = {'apple': (100, 100), 'fish': (140, 80), 'sheep': (120, 100), 'wheat': (80, 120), 'cherry': (100, 100), 'walnut': (100, 100), 'tree': (100, 120), 'branch': (160, 100)}
def strip():
    words = ['Apples', 'Rainbow Trout', 'Ruby Nectarines', 'Cherries', 'Apricots', 'Kiwi', 'Walnuts', 'Pears', 'Dumba &amp; Merino', 'Fresh Milk']
    icons = ['apple', 'fish', 'apple', 'cherry', 'apple', 'apple', 'walnut', 'apple', 'sheep', 'wheat']
    def one(prefix=''):
        return ''.join(f'<span><svg viewBox="0 0 {VB[ic][0]} {VB[ic][1]}" aria-hidden="true"><use href="#d-{ic}"/></svg>{w}</span>' for w, ic in zip(words, icons))
    return f'<div class="strip" aria-hidden="true"><div class="stk">{one()}{one()}</div></div>'

def journey_section():
    stages = [
        ('tree', 'orchard.jpg', 'Orchards take root', 'High-density apple blocks in Sopore — closely planted rows built for early, generous fruit.'),
        ('apple', 'harvest.jpg', 'A fuller basket', 'Pears, Ruby Nectarines, apricots, three cherry varieties, kiwi and walnuts join the apples.'),
        ('sheep', 'livestock.jpg', 'A herd on the green', 'Dumba and Merino sheep, bulls and fresh milk — raised on open pasture, with Qurbani bookings each Eid-ul-Adha.'),
        ('fish', 'tanks-wide.jpg', 'Welkin Aquaculture', 'Rainbow trout in clean recirculating tanks, now expanding in Model Town, Sopore.'),
        ('wheat', 'paddy.jpg', 'Fields that teach', 'Students arrive to harvest, thresh and winnow — the farm becomes a classroom.'),
        ('sprig', 'hero.jpg', 'Growing together', 'A growing team across operations, sales, logistics and more — and the next stage still to be written.'),
    ]
    n = len(stages)
    nodes = ''.join(f'<button class="jn" type="button" data-i="{i}" aria-label="Stage {i+1}: {t}">{aicon(pin)}</button>' for i, (pin, f, t, dsc) in enumerate(stages))
    slides = ''.join(
        f'<article class="jslide" id="stage{i+1}" aria-label="Stage {i+1} of {n}">'
        f'<div class="jimg">{img(f, t, "(min-width:980px) 600px, 86vw")}</div>'
        f'<div class="jtxt"><span class="stage">Stage {i+1} of {n}</span><h3>{t}</h3><p>{dsc}</p></div></article>'
        for i, (pin, f, t, dsc) in enumerate(stages))
    mtn = ('<svg class="mtn" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">'
           '<path fill="#d9e6dc" d="M0 200V130L130 66 230 112 360 44 480 104 610 58 760 130 900 52 1040 112 1180 76 1320 122 1440 90V200Z"/>'
           '<path fill="#c6dbc9" d="M0 200V156L160 108 300 146 470 94 640 154 820 114 1000 160 1180 122 1320 154 1440 138V200Z"/></svg>')
    hills = ('<svg class="hills" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">'
             '<path fill="#dcebcf" d="M0 100C240 40 480 50 720 90S1200 130 1440 70V220H0Z"/>'
             '<path fill="#c8e0b8" d="M0 140C300 90 600 120 840 150S1260 160 1440 120V220H0Z"/>'
             '<path fill="#f3efe3" d="M0 182C320 152 640 172 900 186S1300 180 1440 170V220H0Z"/></svg>')
    scene = (f'<div class="deco-wrap jscene"><span class="sun"></span>{mtn}{deco("cloud","tl",140,at="top:50px;left:8%")}{hills}</div>')
    road = '<svg class="jroad" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path class="jb" d="M18 70C130 8 240 8 340 62S560 112 660 58 880 6 982 62"/><path class="jd" d="M18 70C130 8 240 8 340 62S560 112 660 58 880 6 982 62"/><path class="jp" d="M18 70C130 8 240 8 340 62S560 112 660 58 880 6 982 62"/></svg>'
    head = sh('How Welkin grows', 'Six stages, one farm', 'Tap a stop on the road, or swipe through the stages.')
    return (f'<section class="sec journey" id="journey">{scene}<div class="wrap">{head}'
            f'<div class="jt" id="jt"><div class="jtrack">{road}{nodes}</div>'
            f'<div class="jslides" id="jslides" tabindex="0" aria-label="Farm stages">{slides}</div>'
            f'<div class="jctl"><button class="jbtn" id="jprev" type="button" aria-label="Previous stage">‹</button><span class="jcount" id="jcount">1 / {n}</span><button class="jbtn" id="jnext" type="button" aria-label="Next stage">›</button></div></div>'
            f'</div></section>')

# ---------- Android-style app shell (phones) ----------
def _mi(path):
    return f'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{path}</svg>'

MI = {
    'home': _mi('<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>'),
    'shop': _mi('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
    'farm': _mi('<path d="M12 21v-9"/><path d="M12 13c0-4-3-6-7-6 0 4 3 6 7 6z"/><path d="M12 15c0-3 2-5 6-5 0 3-2 5-6 5z"/>'),
    'seasons': _mi('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>'),
    'more': _mi('<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>'),
    'gallery': _mi('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 9"/>'),
    'jobs': _mi('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>'),
    'mail': _mi('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    'phone': AB_CALL,
}

def appnav(active, sub):
    cur = {'home': 'home', 'shop': 'shop', 'farm': 'farm', 'seasons': 'seasons'}.get(active, 'more')
    def item(key, label, href=None, sheet=None):
        on = ' on' if key == cur else ''
        attr = f'href="{href}"' if href else f'type="button" data-sheet="{sheet}"'
        tag = 'a' if href else 'button'
        return f'<{tag} class="bn{on}" {attr}{" aria-current=page" if on and href else ""}><span class="bpill">{MI[key]}</span><span class="lbl">{label}</span></{tag}>'
    nav = ('<nav class="bnav" aria-label="Primary">' + item('home', 'Home', 'index.html') + item('shop', 'Shop', 'shop.html')
           + item('farm', 'Farm', sheet='farm') + item('seasons', 'Seasons', 'seasons.html') + item('more', 'More', sheet='more') + '</nav>')
    def row(href, icon, label, sub_, ext=False):
        t = ' target="_blank" rel="noopener"' if ext else ''
        return f'<a class="srow" href="{href}"{t}><span class="sic">{icon}</span><span><b>{label}</b><small>{sub_}</small></span></a>'
    farm = ''.join(row(h, aicon(ic), l, d) for (h, ic, l, d) in [
        ('orchard.html', 'apple', 'Orchard', 'Apples, cherries, nectarines & more'),
        ('aquaculture.html', 'fish', 'Aquaculture', 'Rainbow trout from Welkin Aquaculture'),
        ('livestock.html', 'sheep', 'Livestock', 'Sheep, bulls, milk & Qurbani'),
        ('visits.html', 'wheat', 'Farm visits', 'Student days in the fields')])
    more = (row('gallery.html', MI['gallery'], 'Gallery', 'Photos from the farm') + row('careers.html', MI['jobs'], 'Careers', 'Join the Welkin team')
            + row('contact.html', MI['mail'], 'Contact & map', 'Order, enquire, find us')
            + row('tel:+917006901374', MI['phone'], 'Call us', '70069 01374')
            + row('https://www.instagram.com/welkinfarmstead/', ICON['ig'], 'Instagram', '@welkinfarmstead', True)
            + row('https://www.facebook.com/welkinfarmstead/', ICON['fb'], 'Facebook', 'Welkin Farmstead', True))
    def sheet(sid, title, rows):
        return (f'<div class="sheet" id="sheet-{sid}" role="dialog" aria-modal="true" aria-label="{title}" hidden><div class="sheet-bd" data-close></div>'
                f'<div class="sheet-p"><span class="grab" aria-hidden="true"></span><h2>{title}</h2><div class="srows">{rows}</div></div></div>')
    fab = f'<a class="fab" href="{wa("Salaam Welkin Farmstead! I\'d like to know more.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">{ICON["wa"]}</a>'
    return nav + sheet('farm', 'Our farm', farm) + sheet('more', 'More', more) + fab

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

def style(html, kind='', decos=''):
    # Give an existing section a colour kind (tint/dark/aqua) and/or background drawings.
    m = re.search(r'<section class="sec([^"]*)"([^>]*)>', html)
    cls = m.group(1).split()
    if kind:
        cls = [c for c in cls if c not in ('tint', 'dark', 'aqua')] + [kind]
    new = f'<section class="sec {" ".join(cls)}"{m.group(2)}>' + (f'<div class="deco-wrap" aria-hidden="true">{decos}</div>' if decos else '')
    return html[:m.start()] + new + html[m.end():]

PAGE_DECOS = {
    'shop.html': deco('cherries', 'tr', 150, 8, at='top:90px;right:5%') + deco('sprig', 'tr', 170, 18, at='top:300px;right:-30px'),
    'orchard.html': deco('apple-branch', 'tr', 470, at='top:10px;right:-40px') + deco('sprig', 'tl', 150, -12, at='top:420px;left:-30px'),
    'aquaculture.html': deco('fish', 'tr', 270, 3, cls='swim', at='top:50px;right:70px') + deco('fish', 'tr', 150, 0, True, 'swim s2', at='top:200px;right:380px') + deco('waves', 'tr', 330, at='top:330px;right:10px'),
    'livestock.html': deco('sheep', 'tr', 250, at='top:60px;right:60px') + deco('wheat', 'tr', 90, 4, at='top:20px;right:360px'),
    'visits.html': deco('wheat', 'tr', 110, 3, at='top:30px;right:50px') + deco('wheat', 'tr', 80, -9, at='top:90px;right:170px') + deco('sprig', 'tl', 140, -14, at='top:380px;left:-30px'),
    'seasons.html': deco('sprig', 'tr', 190, 14, at='top:40px;right:20px') + deco('cherries', 'tl', 140, -6, at='top:420px;left:-20px'),
    'gallery.html': deco('tree', 'tr', 180, at='top:50px;right:70px') + deco('sprig', 'tr', 150, 20, at='top:260px;right:-20px'),
    'careers.html': deco('wheat', 'tr', 120, 4, at='top:50px;right:90px') + deco('tree', 'tr', 150, at='top:220px;right:260px'),
    'contact.html': deco('sprig', 'tr', 200, 12, at='top:30px;right:20px') + deco('apple-branch', 'tl', 400, -4, at='top:640px;left:-70px'),
    '404.html': deco('sprig', 'tr', 220, 10, at='top:40px;right:60px') + deco('apple-branch', 'tl', 360, at='top:300px;left:-40px'),
}

def pdeco(fname):
    d = PAGE_DECOS.get(fname)
    return f'<div class="pdeco deco-wrap" aria-hidden="true">{d}</div>' if d else ''

def sh(eyebrow, h2, sub=''):
    return f'<header class="sh"><p class="eyebrow">{eyebrow}</p><h2>{h2}</h2>{f"<p class=sub>{sub}</p>" if sub else ""}</header>'

def band(h, p, btn):
    return f'<section class="sec"><div class="wrap"><div class="band">{deco("sprig", "tr", 150, 20, at="top:-20px;right:150px")}{deco("apple-branch", "bl", 260, at="bottom:-40px;left:-40px")}<div><h2>{h}</h2><p>{p}</p></div>{btn}</div></div></section>'

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
HERO_DECO = deco('sprig', 'tl', 190, -10, at='top:20px;left:-30px') + deco('apple-branch', 'br', 430, at='bottom:-30px;right:-50px') + '<span class="blob b1"></span><span class="blob b2"></span>'

def home():
    hero = f'''<section class="hero"><div class="deco-wrap" aria-hidden="true">{HERO_DECO}</div>
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="pill"><span></span> Sopore, Kashmir · 193201</p>
      <h1>Where goodness grows.</h1>
      <p class="lead">Welkin Farmstead is an agricultural and aquaculture farm. High-density apple orchards, farm-fresh rainbow trout, sheep, bulls and milk — raised in Sopore, sold directly by us.</p>
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
    why = style(sec(sh('Why Welkin', 'Goodness you can <em>trace.</em>') + features()), 'dark', deco('sprig', 'tl', 280, -6, at='top:-20px;left:-40px') + deco('apple-branch', 'br', 520, at='bottom:-60px;right:-60px'))
    story = journey_section()
    farm = style(sec(sh('Our farm', 'Four ways we farm') + tiles(), tint=True), 'tint', deco('wheat', 'br', 190, 6, at='bottom:-10px;right:2%') + deco('cherries', 'tr', 130, 10, at='top:30px;right:5%'))
    season = sec(sh('Seasons', "In season right now", 'Typical Kashmir timing — message us for exact availability.') +
                 '<ul class="slist" id="slist" aria-live="polite"></ul><p class="more"><a class="btn btn-ghost" href="seasons.html">Full season calendar →</a></p>')
    visit = sec(split(
        '<p class="eyebrow">Farm visits</p><h2>A day in the fields</h2><p class="sub">Schools and colleges are welcome to spend a day with us — harvesting, threshing, winnowing and touring the orchard, herd and trout tanks.</p><p><a class="btn btn-green" href="visits.html">Plan a visit</a></p>',
        ph('paddy.jpg', 'Students on a Welkin farm visit', '', None, '(min-width:980px) 560px, 100vw')), tint=True)
    find = sec(findus())
    season = style(season, '', deco('sprig', 'tr', 200, 14, at='top:10px;right:0'))
    visit = style(visit, 'tint', deco('tree', 'bl', 150, at='bottom:10px;left:2%') + deco('wheat', 'tr', 110, 8, at='top:20px;right:3%'))
    qb = f'<div class="wrap qb"><div class="qb-card"><div><b>Eid-ul-Adha Qurbani bookings are open</b><span>Dumba, Merino and bulls — reserve early.</span></div>{wabtn("Salaam Welkin Farmstead! I\'d like to book an animal for Eid-ul-Adha Qurbani.", "Book", "btn btn-sm btn-green")}</div></div>'
    return hero + qb + strip() + featured + why + story + farm + season + visit + find + follow_band() + band('Join the Welkin team', "We're hiring for farm operations, sales, logistics, maintenance and supervision.", '<a class="btn btn-light" href="careers.html">See open roles</a>')

def shop():
    chips = '<div class="chips" role="group" aria-label="Filter products"><button class="on" data-f="all">All</button><button data-f="fruit">Fruit &amp; nuts</button><button data-f="fish">Fish</button><button data-f="live">Livestock</button></div>'
    body = sec(f'<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> <span>/</span> <b>Shop</b></nav><h1 class="ph1">Farm shop</h1><p class="lead">Tap Enquire on anything and WhatsApp opens with the message ready — we\'ll reply with availability and rates.</p>' +
               chips + '<div class="cards" id="shopGrid">' + ''.join(card(p) for p in PRODUCTS) + '</div>' +
               '<p class="also">Also from the farm: <b>pears</b> · <b>apricots</b> · <b>fresh milk</b> · <b>vegetable &amp; flower seedlings</b></p>')
    how = sec(sh('How ordering works', 'Three easy steps') + steps([
        ('Pick what you need', 'Choose products from the shop, or just tell us what you\'re after.'),
        ('Message us', 'Tap Enquire — WhatsApp opens with your message ready to send.'),
        ('We confirm', 'We reply with availability, price and how you\'ll receive your order.')]), tint=True)
    return body + style(how, 'tint', deco('cherries', 'br', 170, 8, at='bottom:-10px;right:4%') + deco('sprig', 'tl', 170, -16, at='top:-10px;left:-20px')) + ENQ_BAND

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
            + sec(sh('What we grow', 'From the orchard') + grid) + style(why, 'dark', deco('sprig', 'tl', 260, -8, at='top:-20px;left:-40px') + deco('apple-branch', 'br', 480, at='bottom:-50px;right:-60px'))
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
            + s1 + style(s2, 'aqua', deco('fish', 'tr', 220, 2, cls='swim', at='top:40px;right:6%') + deco('fish', 'tl', 150, 0, True, 'swim s2', at='top:120px;left:3%') + deco('waves', 'br', 460, at='bottom:10px;right:-20px') + deco('waves', 'bl', 360, at='bottom:60px;left:-20px')) + ENQ_BAND)
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
            + style(q, 'tint', deco('wheat', 'br', 150, 5, at='bottom:0;right:3%') + deco('sheep', 'tl', 190, at='top:20px;left:3%')) + ENQ_BAND)
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
            + s1 + style(s2, 'dark', deco('wheat', 'tl', 150, -4, at='top:10px;left:2%') + deco('wheat', 'tr', 150, 6, True, at='top:10px;right:2%') + deco('sprig', 'br', 220, 10, at='bottom:-30px;right:20%')) + form)

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

def gallery():
    return sec('<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> <span>/</span> <b>Gallery</b></nav><h1 class="ph1">Life at Welkin</h1><p class="lead">Orchards, harvests, trout tanks, flocks and student days. Tap a photo to view it full size.</p>' + gallery_grid()) + follow_band()

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

def contact_extra():
    return style(sec(findus(), tint=True), 'tint', deco('sprig', 'tr', 170, 16, at='top:10px;right:1%') + deco('cherries', 'bl', 130, -8, at='bottom:10px;left:2%')) + sec(sh('FAQ', 'Good to know') + faq())

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
    ('gallery.html', 'Gallery', 'Photos from Welkin Farmstead in Sopore, Kashmir: orchards, fresh harvest, rainbow trout tanks, sheep, cattle and student visits.', gallery, 'gallery', '', None),
    ('contact.html', 'Contact', 'Order or enquire at Welkin Farmstead, Sopore, Kashmir. WhatsApp 70069 01374. Find us on the map.', lambda: contact() + contact_extra(), 'contact', '', None),
    ('404.html', 'Page not found', 'Page not found.', notfound, '', '', None),
]

if __name__ == '__main__':
    for fname, title, desc, fn, active, sub, pre in PAGES:
        page(fname, title, desc, fn(), active, sub)
