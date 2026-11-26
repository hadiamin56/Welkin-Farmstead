// One entry per page: URL, search/social metadata and which nav item is highlighted.
export const ROUTES = [
  { path: '/', file: 'index.html', key: 'home', active: 'home', sub: '', navTitle: '', title: 'Welkin Farmstead — Where Goodness Grows · Sopore, Kashmir', desc: 'Welkin Farmstead in Sopore, Kashmir: apple orchards, rainbow trout, sheep, bulls, milk, Qurbani bookings and student farm visits.' },
  { path: '/shop', file: 'shop/index.html', key: 'shop', active: 'shop', sub: '', navTitle: 'Farm shop', title: 'Farm shop · Welkin Farmstead', desc: 'Shop apples, cherries, Ruby Nectarines, walnuts, rainbow trout, Dumba and Merino sheep and bulls from Welkin Farmstead, Sopore.' },
  { path: '/orchard', file: 'orchard/index.html', key: 'orchard', active: 'farm', sub: 'orchard', navTitle: 'Orchard', title: 'Orchard · Welkin Farmstead', desc: 'High-density apple orchards plus pears, Ruby Nectarines, apricots, cherries, kiwi and walnuts at Welkin Farmstead, Sopore.' },
  { path: '/aquaculture', file: 'aquaculture/index.html', key: 'aqua', active: 'farm', sub: 'aqua', navTitle: 'Aquaculture', title: 'Aquaculture · Welkin Farmstead', desc: 'Welkin Aquaculture: farm-fresh rainbow trout raised in a Recirculating Aquaculture System in Sopore, Kashmir.' },
  { path: '/livestock', file: 'livestock/index.html', key: 'livestock', active: 'farm', sub: 'livestock', navTitle: 'Livestock & Qurbani', title: 'Livestock & Qurbani · Welkin Farmstead', desc: 'Dumba and Merino sheep, bulls, fresh milk and Eid-ul-Adha Qurbani bookings at Welkin Farmstead, Sopore.' },
  { path: '/visits', file: 'visits/index.html', key: 'visits', active: 'farm', sub: 'visits', navTitle: 'Farm visits', title: 'Farm visits · Welkin Farmstead', desc: 'Educational farm visits for students at Welkin Farmstead: paddy harvesting, threshing, winnowing and farm tours.' },
  { path: '/seasons', file: 'seasons/index.html', key: 'seasons', active: 'seasons', sub: '', navTitle: 'Seasons', title: 'Seasons · Welkin Farmstead', desc: 'A seasonal guide to what is ready when at Welkin Farmstead in Kashmir: cherries, apricots, nectarines, apples, walnuts, kiwi and more.' },
  { path: '/careers', file: 'careers/index.html', key: 'careers', active: 'careers', sub: '', navTitle: 'Careers', title: 'Careers · Welkin Farmstead', desc: 'Jobs at Welkin Farmstead: farm operations, sales, logistics, maintenance and supervision roles in Sopore.' },
  { path: '/gallery', file: 'gallery/index.html', key: 'gallery', active: 'gallery', sub: '', navTitle: 'Gallery', title: 'Gallery · Welkin Farmstead', desc: 'Photos from Welkin Farmstead in Sopore, Kashmir: orchards, fresh harvest, rainbow trout tanks, sheep, cattle and student visits.' },
  { path: '/contact', file: 'contact/index.html', key: 'contact', active: 'contact', sub: '', navTitle: 'Contact', title: 'Contact · Welkin Farmstead', desc: 'Order or enquire at Welkin Farmstead, Sopore, Kashmir. WhatsApp 70069 01374. Find us on the map.' },
];

export const NOT_FOUND = { path: '*', file: '404.html', key: 'notfound', active: '', sub: '', navTitle: 'Page not found', title: 'Page not found · Welkin Farmstead', desc: 'Page not found.' };
export const OG_IMAGE = '/assets/photos/hero.jpg';

export function findRoute(pathname) {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return ROUTES.find((r) => r.path === p) || NOT_FOUND;
}
