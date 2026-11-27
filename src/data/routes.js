// Pages: URL, which nav item is highlighted, and the file each is prerendered to. Titles and descriptions are
// editable in the admin (content.seo), so they are looked up from the current content.
export const ROUTES = [
  { path: '/', file: 'index.html', key: 'home', active: 'home', sub: '', seo: 'home', navTitle: '' },
  { path: '/shop', file: 'shop/index.html', key: 'shop', active: 'shop', sub: '', seo: 'shop', navTitle: 'Farm shop' },
  { path: '/orchard', file: 'orchard/index.html', key: 'orchard', active: 'farm', sub: 'orchard', seo: 'orchard', navTitle: 'Orchard' },
  { path: '/aquaculture', file: 'aquaculture/index.html', key: 'aqua', active: 'farm', sub: 'aqua', seo: 'aquaculture', navTitle: 'Aquaculture' },
  { path: '/livestock', file: 'livestock/index.html', key: 'livestock', active: 'farm', sub: 'livestock', seo: 'livestock', navTitle: 'Livestock & Qurbani' },
  { path: '/qurbani', file: 'qurbani/index.html', key: 'qurbani', active: 'farm', sub: 'livestock', seo: 'qurbani', navTitle: 'Book Qurbani' },
  { path: '/visits', file: 'visits/index.html', key: 'visits', active: 'farm', sub: 'visits', seo: 'visits', navTitle: 'Farm visits' },
  { path: '/seasons', file: 'seasons/index.html', key: 'seasons', active: 'seasons', sub: '', seo: 'seasons', navTitle: 'Seasons' },
  { path: '/careers', file: 'careers/index.html', key: 'careers', active: 'careers', sub: '', seo: 'careers', navTitle: 'Careers' },
  { path: '/gallery', file: 'gallery/index.html', key: 'gallery', active: 'gallery', sub: '', seo: 'gallery', navTitle: 'Gallery' },
  { path: '/contact', file: 'contact/index.html', key: 'contact', active: 'contact', sub: '', seo: 'contact', navTitle: 'Contact' },
];

export const NOT_FOUND = { path: '*', file: '404.html', key: 'notfound', active: '', sub: '', seo: null, navTitle: 'Page not found' };

/** Resolve a URL to its route, with title/description/share image filled in from the content. */
export function findRoute(pathname, content) {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const r = ROUTES.find((x) => x.path === p) || NOT_FOUND;
  const seo = r.seo ? content.seo[r.seo] : { title: `Page not found · ${content.site.name}`, desc: 'Page not found.' };
  return { ...r, title: seo.title, desc: seo.desc, og: content.seo.shareImage };
}
