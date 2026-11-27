// Describes every editable field. The admin panel builds its forms from this, and the server uses it to
// validate and clean whatever is saved. Types: text | area | url | image | select | toggle | number | list | group.
const T = (k, label, o = {}) => ({ k, t: 'text', label, max: 200, ...o });
const A = (k, label, o = {}) => ({ k, t: 'area', label, max: 1500, ...o });
const U = (k, label, o = {}) => ({ k, t: 'url', label, max: 300, ...o });
const I = (k, label, o = {}) => ({ k, t: 'image', label, ...o });
const S = (k, label, options, o = {}) => ({ k, t: 'select', label, options, ...o });
const B = (k, label, o = {}) => ({ k, t: 'toggle', label, ...o });
const C = (k, label, o = {}) => ({ k, t: 'color', label, ...o });
const N = (k, label, min, max, o = {}) => ({ k, t: 'number', label, min, max, ...o });
const G = (k, label, fields, o = {}) => ({ k, t: 'group', label, fields, ...o });
const L = (k, label, item, o = {}) => ({ k, t: 'list', label, item, max: 40, ...o });       // list of objects
const LS = (k, label, o = {}) => ({ k, t: 'list', label, scalar: 'text', max: 40, itemMax: 160, ...o }); // list of strings

export const HOME_BLOCKS = [['strip', 'Scrolling ticker'], ['shop', 'Farm shop teaser'], ['why', 'Why Welkin (dark panel)'], ['journey', 'Journey'], ['farm', 'Four ways we farm'], ['seasons', 'In season now'], ['visit', 'Farm visits teaser'], ['find', 'Find us & map'], ['follow', 'Follow the farm'], ['band', 'Hiring band']];
export const ICONS_ART = ['tree', 'apple', 'sheep', 'fish', 'wheat', 'sprig', 'cherries', 'apple-branch'];
export const ICONS_UI = ['leaf', 'fish', 'hand', 'cap'];
export const PAGES_TO = ['/qurbani', '/orchard', '/aquaculture', '/livestock', '/visits', '/shop', '/seasons', '/gallery', '/careers', '/contact'];
export const CATEGORIES = [['fruit', 'Fruit & nuts'], ['fish', 'Fish'], ['live', 'Livestock']];
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const seoPage = (k, label) => G(k, label, [T('title', 'Page title (shown in search results)', { max: 90 }), A('desc', 'Description (search results & link previews)', { max: 200, rows: 3 })]);
const steps = (k, label = 'Steps') => L(k, label, [T('t', 'Title', { max: 80 }), T('d', 'Description', { max: 220 })], { itemLabel: 't', max: 12 });
const ctaFields = [T('cta', 'Button label', { max: 40 }), A('ctaMsg', 'WhatsApp message the button sends', { max: 400, rows: 3 })];

export const ROOT = [
  G('site', 'Site & contact', [
    T('name', 'Farm name'), T('tagline', 'Tagline'), T('managedBy', 'Managed by'),
    T('whatsapp', 'WhatsApp number (digits only, with country code)', { pattern: 'digits', max: 15, hint: 'e.g. 917006901374' }),
    T('phone', 'Phone for call buttons', { pattern: 'phone', max: 20, hint: 'e.g. +917006901374' }),
    T('phoneDisplay', 'Phone as shown on the site'), T('email', 'Email', { pattern: 'email' }), T('addressLine', 'Address (short, shown in the footer and contact page)'), T('addressFull', 'Full address (shown in the Find us section)'),
    U('instagram', 'Instagram link'), U('facebook', 'Facebook link'),
    T('mapQuery', 'Google Maps search text (use + for spaces)', { hint: 'Used by the "Get directions" button' }),
    A('helloMsg', 'Default WhatsApp greeting', { max: 300, rows: 2 }),
    G('announcement', 'Announcement bar (top of every page)', [
      B('enabled', 'Show the announcement bar'), T('text', 'Text'), T('cta', 'Link label', { max: 40 }), A('msg', 'WhatsApp message the link sends', { max: 400, rows: 2 }),
    ]),
    G('qurbaniCard', 'Qurbani card (phone home page)', [T('title', 'Title'), T('text', 'Text'), T('button', 'Button label', { max: 20 })]),
  ]),

  G('theme', 'Brand colours', [
    C('green', 'Main brand colour (buttons, links, headings accents)'), C('accent', 'Accent colour (small highlights)'),
    C('dark', 'Dark panel colour'), C('lime', 'Highlight colour on dark panels'),
  ]),

  G('seo', 'Search & sharing', [
    seoPage('home', 'Home'), seoPage('shop', 'Farm shop'), seoPage('orchard', 'Orchard'), seoPage('aquaculture', 'Aquaculture'),
    seoPage('qurbani', 'Qurbani booking'), seoPage('livestock', 'Livestock'), seoPage('visits', 'Farm visits'), seoPage('seasons', 'Seasons'), seoPage('careers', 'Careers'),
    seoPage('gallery', 'Gallery'), seoPage('contact', 'Contact'), I('shareImage', 'Image shown when a link is shared'),
  ]),

  G('home', 'Home page', [
    G('hero', 'Top section', [
      T('pill', 'Small label above the title'), T('title', 'Title', { max: 80 }), A('lead', 'Intro paragraph', { rows: 3 }),
      T('primary', 'Main button label', { max: 40 }), T('secondary', 'WhatsApp button label', { max: 40 }), A('secondaryMsg', 'WhatsApp message', { max: 400, rows: 2 }),
      I('imageMain', 'Large photo'), T('capMain', 'Large photo caption'), I('imageB', 'Small photo 1'), T('capB', 'Small photo 1 caption'), I('imageC', 'Small photo 2'), T('capC', 'Small photo 2 caption'),
    ]),
    L('layout', 'Page order & visibility', [S('id', 'Block', HOME_BLOCKS.map((b) => b[0]), { labels: HOME_BLOCKS.map((b) => b[1]) }), B('visible', 'Show on the page')], { itemLabel: 'id', max: 10 }),
    L('facts', 'Quick facts (4 works best)', [T('b', 'Big text', { max: 40 }), T('span', 'Small text', { max: 80 })], { itemLabel: 'b', max: 4 }),
    LS('strip', 'Scrolling ticker words', { max: 20, itemMax: 40 }),
    G('shop', 'Farm shop teaser', [
      T('eyebrow', 'Small label'), T('title', 'Title'), A('sub', 'Sub-heading', { rows: 2 }), T('seeAll', 'Button label', { max: 40 }),
      { k: 'featured', t: 'productPicks', label: 'Featured products (pick up to 4)', max: 4 },
    ]),
    G('why', 'Why Welkin (dark section)', [
      T('eyebrow', 'Small label'), T('title', 'Title'), T('accent', 'Highlighted last word(s)', { max: 40 }),
      L('items', 'Cards', [S('icon', 'Icon', ICONS_UI), T('title', 'Title', { max: 60 }), A('text', 'Text', { max: 220, rows: 2 })], { itemLabel: 'title', max: 6 }),
    ]),
    G('journey', 'Journey', [
      T('eyebrow', 'Small label'), T('title', 'Title'), T('sub', 'Sub-heading'),
      L('stages', 'Stages', [S('icon', 'Icon', ICONS_ART), T('label', 'Step label', { max: 20 }), I('image', 'Photo'), T('title', 'Title', { max: 80 }), A('text', 'Text', { max: 300, rows: 3 })], { itemLabel: 'title', max: 8, min: 2 }),
    ]),
    G('farm', 'Four ways we farm', [
      T('eyebrow', 'Small label'), T('title', 'Title'),
      L('tiles', 'Tiles', [S('to', 'Links to page', PAGES_TO), I('image', 'Photo'), T('title', 'Title', { max: 40 }), T('text', 'Text', { max: 120 })], { itemLabel: 'title', max: 8 }),
    ]),
    G('seasons', 'Seasons teaser', [T('eyebrow', 'Small label'), T('title', 'Title'), T('sub', 'Sub-heading'), T('link', 'Link label', { max: 40 })]),
    G('visit', 'Farm visits teaser', [T('eyebrow', 'Small label'), T('title', 'Title'), A('sub', 'Text', { rows: 3 }), T('button', 'Button label', { max: 40 }), I('image', 'Photo'), T('cap', 'Photo caption')]),
    G('follow', 'Follow band', [T('title', 'Title'), T('text', 'Text')]),
    G('band', 'Hiring band', [T('title', 'Title'), T('text', 'Text'), T('button', 'Button label', { max: 40 })]),
  ]),

  L('products', 'Products', [
    T('id', 'Product ID', { pattern: 'slug', max: 40 }), S('cat', 'Category', CATEGORIES.map((c) => c[0])), I('image', 'Photo'), T('name', 'Name', { max: 60 }),
    T('text', 'Short description', { max: 140 }), A('msg', 'WhatsApp message when someone taps Enquire', { max: 400, rows: 3 }), B('visible', 'Show on the website'),
  ], { itemLabel: 'name', max: 60 }),

  G('shop', 'Farm shop page', [
    T('title', 'Title', { max: 80 }), A('lead', 'Intro', { rows: 3 }), T('also', 'Also from the farm (separate with · )', { max: 200 }),
    G('how', 'How ordering works', [T('eyebrow', 'Small label'), T('title', 'Title'), steps('steps')]),
  ]),

  G('orchard', 'Orchard page', [
    T('title', 'Title', { max: 80 }), A('lead', 'Intro', { rows: 3 }), I('banner', 'Banner photo'), ...ctaFields, T('ctaSecondary', 'Second button label', { max: 40 }),
    G('cropsHead', 'Crops heading', [T('eyebrow', 'Small label'), T('title', 'Title')]),
    L('crops', 'Crop cards', [I('image', 'Photo'), T('title', 'Title', { max: 60 }), T('text', 'Text', { max: 140 })], { itemLabel: 'title', max: 12 }),
    G('why', 'Why high-density', [T('eyebrow', 'Small label'), T('title', 'Title'), A('sub', 'Text', { rows: 4 }), LS('ticks', 'Bullet points', { max: 8 }), I('image', 'Photo'), T('cap', 'Photo caption')]),
    G('seedlings', 'Seedlings block', [T('eyebrow', 'Small label'), T('title', 'Title'), A('sub', 'Text', { rows: 2 })]),
  ]),

  G('aquaculture', 'Aquaculture page', [
    T('title', 'Title', { max: 80 }), A('lead', 'Intro', { rows: 3 }), I('banner', 'Banner photo'), ...ctaFields,
    G('intro', 'Intro block', [T('eyebrow', 'Small label'), T('title', 'Title'), A('sub', 'Text', { rows: 4 }), LS('ticks', 'Bullet points', { max: 8 }), I('image', 'Photo'), T('cap', 'Photo caption')]),
    G('ras', 'How RAS works (dark section)', [T('eyebrow', 'Small label'), T('title', 'Title'), A('sub', 'Text', { rows: 2 }), steps('steps')]),
  ]),

  G('livestock', 'Livestock page', [
    T('title', 'Title', { max: 80 }), A('lead', 'Intro', { rows: 3 }), I('banner', 'Banner photo'), ...ctaFields,
    G('breedsHead', 'Breeds heading', [T('eyebrow', 'Small label'), T('title', 'Title')]),
    L('breeds', 'Breed cards', [I('image', 'Photo'), T('title', 'Title', { max: 60 }), T('text', 'Text', { max: 140 })], { itemLabel: 'title', max: 9 }),
    T('milk', 'Dairy line (bold word)', { max: 60 }),
    G('qurbani', 'Qurbani booking', [T('eyebrow', 'Small label'), T('title', 'Title'), A('sub', 'Text', { rows: 3 }), steps('steps'), I('image', 'Photo'), T('cap', 'Photo caption')]),
  ]),

  G('qurbaniPage', 'Qurbani booking page', [
    T('title', 'Title', { max: 80 }), A('lead', 'Intro', { rows: 3 }), I('banner', 'Banner photo'),
    T('animalsHead', 'Step 1 heading', { max: 60 }), T('weightHead', 'Step 2 heading', { max: 60 }), T('detailsHead', 'Step 3 heading', { max: 60 }),
    L('animals', 'Animals people can choose', [I('image', 'Photo'), T('name', 'Name', { max: 60 }), T('text', 'Short text', { max: 100 }), LS('weights', 'Weight choices (e.g. 25–35 kg)', { max: 10, itemMax: 40 })], { itemLabel: 'name', max: 8 }),
    LS('deliveries', 'Delivery choices', { max: 8, itemMax: 60 }),
    A('note', 'Small note above the button', { max: 300, rows: 2 }), T('button', 'Button label', { max: 40 }),
    T('doneTitle', 'After sending: title', { max: 60 }), A('doneText', 'After sending: text', { max: 300, rows: 2 }),
  ]),

  G('visits', 'Farm visits page', [
    T('title', 'Title', { max: 80 }), A('lead', 'Intro', { rows: 3 }), I('banner', 'Banner photo'), ...ctaFields,
    G('intro', 'Intro block', [T('eyebrow', 'Small label'), T('title', 'Title'), A('sub', 'Text', { rows: 4 }), LS('ticks', 'Bullet points', { max: 8 }), I('image', 'Photo'), T('cap', 'Photo caption')]),
    G('day', 'The day (dark section)', [T('eyebrow', 'Small label'), T('title', 'Title'), steps('steps')]),
    G('plan', 'Visit request form heading', [T('eyebrow', 'Small label'), T('title', 'Title'), A('sub', 'Text', { rows: 2 })]),
  ]),

  G('seasonsPage', 'Seasons page', [T('title', 'Title', { max: 80 }), A('lead', 'Intro', { rows: 3 })]),
  L('crops', 'Season calendar', [
    T('name', 'Name', { max: 60 }), T('note', 'Note', { max: 80 }),
    S('from', 'First month', MONTH_NAMES.map((_, i) => i), { labels: MONTH_NAMES, numeric: true }),
    S('to', 'Last month', MONTH_NAMES.map((_, i) => i), { labels: MONTH_NAMES, numeric: true }),
  ], { itemLabel: 'name', max: 40 }),

  G('careersPage', 'Careers page', [T('title', 'Title', { max: 80 }), A('lead', 'Intro', { rows: 3 }), T('apply', 'Apply button label', { max: 20 }), A('applyMsg', 'WhatsApp message ({role} = job title)', { max: 300, rows: 2 })]),
  L('roles', 'Open roles', [T('t', 'Role', { max: 60 }), T('d', 'Description', { max: 160 }), B('open', 'Currently hiring')], { itemLabel: 't', max: 30 }),

  G('galleryPage', 'Gallery page', [T('title', 'Title', { max: 80 }), A('lead', 'Intro', { rows: 3 })]),
  L('gallery', 'Photos', [I('image', 'Photo'), T('cap', 'Caption', { max: 80 })], { itemLabel: 'cap', max: 80 }),

  G('contactPage', 'Contact page', [T('title', 'Title', { max: 80 }), A('lead', 'Intro', { rows: 3 }), G('faqHead', 'FAQ heading', [T('eyebrow', 'Small label'), T('title', 'Title')])]),
  LS('orderItems', 'Order form choices', { max: 30, itemMax: 40 }),
  L('faq', 'FAQ', [T('q', 'Question', { max: 140 }), A('a', 'Answer', { max: 600, rows: 3 })], { itemLabel: 'q', max: 30 }),
  L('locations', 'Map locations (2 shown as tabs)', [T('name', 'Name', { max: 60 }), N('lat', 'Latitude', -90, 90, { float: true }), N('lng', 'Longitude', -180, 180, { float: true }), A('text', 'Description', { max: 300, rows: 2 })], { itemLabel: 'name', max: 6, min: 1 }),
  G('findUs', 'Find us heading', [T('eyebrow', 'Small label'), T('title', 'Title'), A('sub', 'Text', { rows: 3 })]),

  G('enq', '"Ready to order?" band (bottom of several pages)', [T('title', 'Title'), A('text', 'Text', { rows: 2 }), T('button', 'Button label', { max: 40 }), A('msg', 'WhatsApp message', { max: 300, rows: 2 })]),
  G('notFound', '404 page', [T('title', 'Title'), A('text', 'Text', { rows: 2 })]),
];

// How the admin sidebar groups the root fields.
export const SECTIONS = [
  { id: 'site', title: 'Site & contact', icon: 'settings', keys: ['site'], desc: 'Name, phone, WhatsApp number, social links and the announcement bar.' },
  { id: 'home', title: 'Home page', icon: 'home', keys: ['home'], desc: 'Hero, facts, journey, tiles and teasers on the home page.' },
  { id: 'design', title: 'Design & colours', icon: 'layers', keys: ['theme'], desc: 'Brand colours used across the website.' },
  { id: 'products', title: 'Products', icon: 'bag', keys: ['products'], desc: 'Everything in the farm shop.', custom: 'products' },
  { id: 'shop', title: 'Farm shop page', icon: 'store', keys: ['shop'], desc: 'Text on the shop page.' },
  { id: 'orchard', title: 'Orchard', icon: 'leaf', keys: ['orchard'], desc: 'The orchard page.' },
  { id: 'aquaculture', title: 'Aquaculture', icon: 'fish', keys: ['aquaculture'], desc: 'The aquaculture page.' },
  { id: 'livestock', title: 'Livestock', icon: 'paw', keys: ['livestock'], desc: 'The livestock & Qurbani page.' },
  { id: 'qurbani', title: 'Qurbani booking', icon: 'paw', keys: ['qurbaniPage'], desc: 'The Qurbani booking page: animals, weights and delivery choices.' },
  { id: 'visits', title: 'Farm visits', icon: 'cap', keys: ['visits'], desc: 'The student visits page.' },
  { id: 'seasons', title: 'Seasons', icon: 'calendar', keys: ['seasonsPage', 'crops'], desc: 'The seasons page and the calendar of what is ready when.' },
  { id: 'gallery', title: 'Gallery', icon: 'image', keys: ['galleryPage', 'gallery'], desc: 'The photo gallery.' },
  { id: 'careers', title: 'Careers', icon: 'briefcase', keys: ['careersPage', 'roles'], desc: 'Job roles and the careers page.' },
  { id: 'contact', title: 'Contact, FAQ & map', icon: 'mail', keys: ['contactPage', 'orderItems', 'faq', 'locations', 'findUs'], desc: 'Contact page text, FAQ, order choices and map pins.' },
  { id: 'global', title: 'Shared bands & 404', icon: 'layers', keys: ['enq', 'notFound'], desc: 'The "Ready to order?" band and the 404 page.' },
  { id: 'seo', title: 'Search & sharing', icon: 'search', keys: ['seo'], desc: 'Titles and descriptions for Google and link previews.' },
];

export const rootField = (k) => ROOT.find((f) => f.k === k);

/**
 * Finds the schema field for a content path, e.g. ['products', 2, 'name'].
 * Returns the field, a readable trail ("Products › #3 › Name") and, when the path is inside a list item,
 * the item's path and fields so the editor can show the whole card at once.
 */
export function resolveField(path) {
  let fields = ROOT; let f = null; const trail = []; let item = null;
  for (let i = 0; i < path.length; i += 1) {
    const k = path[i];
    if (typeof k === 'number') {
      if (!f || f.t !== 'list') return null;
      trail.push(`#${k + 1}`);
      if (f.scalar) return { field: { k, t: 'text', label: f.label.replace(/ \(.*$/, ''), max: f.itemMax }, trail, item: null };
      item = { path: path.slice(0, i + 1), fields: f.item, label: f.label };
      fields = f.item; f = null;
      continue;
    }
    f = fields.find((x) => x.k === k);
    if (!f) return null;
    trail.push(f.label.replace(/ \(.*$/, ''));
    if (f.t === 'group') fields = f.fields;
    else if (f.t === 'list') fields = f.item || [];
  }
  return f ? { field: f, trail, item } : null;
}
