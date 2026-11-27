// Fixed structure (navigation, filters, decorative drawings). All editable text lives in src/content/defaults.js.
export const NAV = [
  { key: 'home', to: '/', label: 'Home' },
  { key: 'shop', to: '/shop', label: 'Shop' },
  { key: 'farm', label: 'Our farm' },
  { key: 'seasons', to: '/seasons', label: 'Seasons' },
  { key: 'gallery', to: '/gallery', label: 'Gallery' },
  { key: 'contact', to: '/contact', label: 'Contact' },
];

export const FARM = [
  { sub: 'orchard', to: '/orchard', label: 'Orchard', desc: 'Apples, cherries, nectarines & more', icon: 'apple' },
  { sub: 'aqua', to: '/aquaculture', label: 'Aquaculture', desc: 'Rainbow trout from Welkin Aquaculture', icon: 'fish' },
  { sub: 'livestock', to: '/livestock', label: 'Livestock', desc: 'Sheep, bulls, milk & Qurbani', icon: 'sheep' },
  { sub: 'visits', to: '/visits', label: 'Farm visits', desc: 'Student days in the fields', icon: 'wheat' },
];

export const SHOP_FILTERS = [
  { f: 'all', label: 'All' },
  { f: 'fruit', label: 'Fruit & nuts' },
  { f: 'fish', label: 'Fish' },
  { f: 'live', label: 'Livestock' },
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Background drawings. n = drawing, pos = tl|tr|bl|br, w = width px, rot = degrees, at = extra CSS.
const D = (n, pos, w, rot = 0, at = '', extra = {}) => ({ n, pos, w, rot, at, ...extra });
export const HERO_DECO = [D('sprig', 'tl', 190, -10, 'top:20px;left:-30px'), D('apple-branch', 'br', 430, 0, 'bottom:-30px;right:-50px')];
export const PAGE_DECOS = {
  '/shop': [D('cherries', 'tr', 150, 8, 'top:90px;right:5%'), D('sprig', 'tr', 170, 18, 'top:300px;right:-30px')],
  '/orchard': [D('apple-branch', 'tr', 470, 0, 'top:10px;right:-40px'), D('sprig', 'tl', 150, -12, 'top:420px;left:-30px')],
  '/aquaculture': [D('fish', 'tr', 270, 3, 'top:50px;right:70px', { cls: 'swim' }), D('fish', 'tr', 150, 0, 'top:200px;right:380px', { flip: true, cls: 'swim s2' }), D('waves', 'tr', 330, 0, 'top:330px;right:10px')],
  '/livestock': [D('sheep', 'tr', 250, 0, 'top:60px;right:60px'), D('wheat', 'tr', 90, 4, 'top:20px;right:360px')],
  '/visits': [D('wheat', 'tr', 110, 3, 'top:30px;right:50px'), D('wheat', 'tr', 80, -9, 'top:90px;right:170px'), D('sprig', 'tl', 140, -14, 'top:380px;left:-30px')],
  '/seasons': [D('sprig', 'tr', 190, 14, 'top:40px;right:20px'), D('cherries', 'tl', 140, -6, 'top:420px;left:-20px')],
  '/gallery': [D('tree', 'tr', 180, 0, 'top:50px;right:70px'), D('sprig', 'tr', 150, 20, 'top:260px;right:-20px')],
  '/careers': [D('wheat', 'tr', 120, 4, 'top:50px;right:90px'), D('tree', 'tr', 150, 0, 'top:220px;right:260px')],
  '/contact': [D('sprig', 'tr', 200, 12, 'top:30px;right:20px'), D('apple-branch', 'tl', 400, -4, 'top:640px;left:-70px')],
  '*': [D('sprig', 'tr', 220, 10, 'top:40px;right:60px'), D('apple-branch', 'tl', 360, 0, 'top:300px;left:-40px')],
};
export const BAND_DECO = [D('sprig', 'tr', 150, 20, 'top:-20px;right:150px'), D('apple-branch', 'bl', 260, 0, 'bottom:-40px;left:-40px')];
export { D };
