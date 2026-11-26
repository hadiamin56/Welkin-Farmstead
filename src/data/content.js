// Site content lives here so copy can be edited without touching components.
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

export const PRODUCTS = [
  { cat: 'fruit', file: 'orchard.jpg', name: 'Apples', text: 'From our high-density orchard blocks.', msg: "Salaam Welkin Farmstead! I'd like to enquire about apples — availability and rates, please." },
  { cat: 'fruit', file: 'cherries.jpg', name: 'Cherries', text: 'Premium, Cordia and Regina varieties.', msg: "Salaam Welkin Farmstead! I'd like to enquire about cherries (Premium / Cordia / Regina) — availability and rates, please." },
  { cat: 'fruit', file: 'nectarines.jpg', name: 'Ruby Nectarines', text: 'Juicy stone fruit with ruby-red flesh.', msg: "Salaam Welkin Farmstead! I'd like to enquire about Ruby Nectarines — availability and rates, please." },
  { cat: 'fruit', file: 'walnuts.jpg', name: 'Walnuts & kiwi', text: 'Autumn harvest, straight from the farm.', msg: "Salaam Welkin Farmstead! I'd like to enquire about walnuts and kiwi — availability and rates, please." },
  { cat: 'fish', file: 'trout.jpg', name: 'Rainbow trout', text: 'Farm-fresh from Welkin Aquaculture.', msg: "Salaam Welkin Aquaculture! I'd like to order fresh rainbow trout. Please share availability and rates." },
  { cat: 'live', file: 'sheep.jpg', name: 'Dumba sheep', text: 'Hardy fat-tailed sheep. Qurbani bookings open.', msg: "Salaam Welkin Farmstead! I'd like to enquire about Dumba sheep (Qurbani). Please share weights and rates." },
  { cat: 'live', file: 'merino.jpg', name: 'Merino sheep', text: 'Fine-wool breed, raised on the farm.', msg: "Salaam Welkin Farmstead! I'd like to enquire about Merino sheep. Please share details and rates." },
  { cat: 'live', file: 'bull.jpg', name: 'Bulls', text: 'Healthy animals for Qurbani and farm use.', msg: "Salaam Welkin Farmstead! I'd like to enquire about bulls (Qurbani / farm). Please share details and rates." },
];

export const SHOP_FILTERS = [
  { f: 'all', label: 'All' },
  { f: 'fruit', label: 'Fruit & nuts' },
  { f: 'fish', label: 'Fish' },
  { f: 'live', label: 'Livestock' },
];

export const FEATURES = [
  { icon: 'leaf', title: 'Grown in Sopore', text: 'Orchards and tanks in the apple town of Kashmir.' },
  { icon: 'fish', title: 'Farm-fresh trout', text: 'Raised in clean recirculating tanks, a short trip to your kitchen.' },
  { icon: 'hand', title: 'Straight from the farm', text: 'Apples, fish, sheep and milk — sold directly by the people who raise them.' },
  { icon: 'cap', title: 'Open to learn', text: 'Student farm visits: paddy harvest, threshing, winnowing and tours.' },
];

export const TILES = [
  { to: '/orchard', file: 'orchard.jpg', title: 'Orchard', text: 'High-density apples, stone fruit, kiwi and walnuts.' },
  { to: '/aquaculture', file: 'tanks.jpg', title: 'Aquaculture', text: 'Rainbow trout raised in recirculating tanks.' },
  { to: '/livestock', file: 'livestock.jpg', title: 'Livestock', text: 'Dumba & Merino sheep, bulls, milk and Qurbani.' },
  { to: '/visits', file: 'paddy.jpg', title: 'Farm visits', text: 'Hands-on field days for students.' },
];

export const STRIP = {
  words: ['Apples', 'Rainbow Trout', 'Ruby Nectarines', 'Cherries', 'Apricots', 'Kiwi', 'Walnuts', 'Pears', 'Dumba & Merino', 'Fresh Milk'],
  icons: ['apple', 'fish', 'apple', 'cherry', 'apple', 'apple', 'walnut', 'apple', 'sheep', 'wheat'],
};

export const FAQ = [
  { q: 'How do I order?', a: "Tap any Enquire or Order button — WhatsApp opens with your message ready. We reply with availability, price and how you'll receive your order." },
  { q: 'Do you take Qurbani bookings?', a: "Yes. Eid-ul-Adha Qurbani bookings are taken ahead of time. Message us the breed (Dumba, Merino or bull), approximate weight and budget, and we'll share options." },
  { q: 'When is each fruit available?', a: 'See our Seasons page for typical Kashmir timing. It shifts with the weather, so message us for exact availability.' },
  { q: 'Can my school or college visit?', a: 'Yes — student groups are welcome for paddy harvesting, threshing, winnowing and a farm tour. Fill in the form on the Farm visits page.' },
  { q: 'Where are you located?', a: 'Welkin Farmstead is in Sopore, Kashmir 193201. Welkin Aquaculture is expanding in Model Town, Sopore.' },
  { q: 'Are you hiring?', a: 'We hire for farm operations, sales, logistics, maintenance and supervision. See the Careers page and apply on WhatsApp.' },
];

export const GALLERY = [
  { file: 'hero.jpg', cap: 'Aerial view of the farm' }, { file: 'orchard.jpg', cap: 'In the orchard' }, { file: 'harvest.jpg', cap: 'Fresh harvest' },
  { file: 'tanks-wide.jpg', cap: 'Welkin Aquaculture' }, { file: 'livestock.jpg', cap: 'Sheep and cattle' }, { file: 'paddy.jpg', cap: 'Student farm visit' },
  { file: 'cherries.jpg', cap: 'Cherries' }, { file: 'trout.jpg', cap: 'Rainbow trout' }, { file: 'merino.jpg', cap: 'Merino sheep' },
  { file: 'nectarines.jpg', cap: 'Ruby Nectarines' }, { file: 'bull.jpg', cap: 'Bulls' }, { file: 'walnuts.jpg', cap: 'Walnuts & kiwi' },
];

export const ROLES = [
  { t: 'Farm operations', d: 'Orchard, field and herd work.' },
  { t: 'Sales', d: 'Talk to customers and take orders.' },
  { t: 'Logistics', d: 'Get fresh produce where it needs to go.' },
  { t: 'Maintenance', d: 'Keep equipment, tanks and facilities running.' },
  { t: 'Supervision', d: 'Lead and coordinate farm teams.' },
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// [name, note, firstMonth, lastMonth] — months are 0-indexed.
export const CROPS = [
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

export const ORDER_ITEMS = ['Apples', 'Cherries', 'Ruby Nectarines', 'Apricots / Pears', 'Kiwi', 'Walnuts', 'Rainbow trout', 'Fresh milk', 'Dumba sheep', 'Merino sheep', 'Bulls', 'Seedlings', 'A farm visit'];

export const JOURNEY = [
  { icon: 'tree', label: 'Orchards', file: 'orchard.jpg', title: 'Orchards take root', text: 'High-density apple blocks in Sopore — closely planted rows built for early, generous fruit.' },
  { icon: 'apple', label: 'Fruit basket', file: 'harvest.jpg', title: 'A fuller basket', text: 'Pears, Ruby Nectarines, apricots, three cherry varieties, kiwi and walnuts join the apples.' },
  { icon: 'sheep', label: 'Herd', file: 'livestock.jpg', title: 'A herd on the green', text: 'Dumba and Merino sheep, bulls and fresh milk — raised on open pasture, with Qurbani bookings each Eid-ul-Adha.' },
  { icon: 'fish', label: 'Aquaculture', file: 'tanks-wide.jpg', title: 'Welkin Aquaculture', text: 'Rainbow trout in clean recirculating tanks, now expanding in Model Town, Sopore.' },
  { icon: 'wheat', label: 'Fields', file: 'paddy.jpg', title: 'Fields that teach', text: 'Students arrive to harvest, thresh and winnow — the farm becomes a classroom.' },
  { icon: 'sprig', label: 'Team', file: 'hero.jpg', title: 'Growing together', text: 'A growing team across operations, sales, logistics and more — and the next stage still to be written.' },
];

// Edit coordinates here. Both sites currently use the centre of Sopore until exact pins are confirmed.
export const LOCS = [
  { name: 'Welkin Farmstead', lat: 34.301, lng: 74.466, text: 'Orchards, livestock and paddy fields, Sopore, Kashmir 193201. Message us before you visit so we can guide you in.' },
  { name: 'Welkin Aquaculture', lat: 34.301, lng: 74.466, text: 'Rainbow trout in recirculating tanks — expanding in Model Town, Sopore.' },
];

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
