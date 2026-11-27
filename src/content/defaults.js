// The complete, editable content of the website. This is the built-in copy: the admin panel edits a draft of
// this same shape, and publishing replaces it. Anything the admin leaves out falls back to these values.
const P = (f) => `/assets/photos/${f}`;

export const DEFAULTS = {
  site: {
    name: 'Welkin Farmstead',
    tagline: 'Where goodness grows.',
    managedBy: 'Waseem Anayat Hajini',
    whatsapp: '917006901374',
    phone: '+917006901374',
    phoneDisplay: '70069 01374',
    email: 'waseemhajini86@gmail.com',
    addressLine: 'Sopore, Kashmir 193201',
    addressFull: 'Sopore, Jammu & Kashmir 193201',
    instagram: 'https://www.instagram.com/welkinfarmstead/',
    facebook: 'https://www.facebook.com/welkinfarmstead/',
    mapQuery: 'Welkin+Farmstead,+Sopore,+Kashmir+193201',
    announcement: {
      enabled: true,
      text: 'Eid-ul-Adha Qurbani bookings are open',
      cta: 'Book now →',
      msg: "Salaam Welkin Farmstead! I'd like to book an animal for Eid-ul-Adha Qurbani.",
    },
    qurbaniCard: { title: 'Eid-ul-Adha Qurbani bookings are open', text: 'Dumba, Merino and bulls — reserve early.', button: 'Book' },
    helloMsg: "Salaam Welkin Farmstead! I'd like to know more.",
  },

  theme: { green: '#1f5a3a', accent: '#c4382c', dark: '#123d27', lime: '#8dc63f' },

  seo: {
    home: { title: 'Welkin Farmstead — Where Goodness Grows · Sopore, Kashmir', desc: 'Welkin Farmstead in Sopore, Kashmir: apple orchards, rainbow trout, sheep, bulls, milk, Qurbani bookings and student farm visits.' },
    shop: { title: 'Farm shop · Welkin Farmstead', desc: 'Shop apples, cherries, Ruby Nectarines, walnuts, rainbow trout, Dumba and Merino sheep and bulls from Welkin Farmstead, Sopore.' },
    orchard: { title: 'Orchard · Welkin Farmstead', desc: 'High-density apple orchards plus pears, Ruby Nectarines, apricots, cherries, kiwi and walnuts at Welkin Farmstead, Sopore.' },
    aquaculture: { title: 'Aquaculture · Welkin Farmstead', desc: 'Welkin Aquaculture: farm-fresh rainbow trout raised in a Recirculating Aquaculture System in Sopore, Kashmir.' },
    qurbani: { title: 'Book Qurbani · Welkin Farmstead', desc: 'Book your Eid-ul-Adha Qurbani animal at Welkin Farmstead, Sopore: choose the breed and weight, and we confirm on WhatsApp.' },
    livestock: { title: 'Livestock & Qurbani · Welkin Farmstead', desc: 'Dumba and Merino sheep, bulls, fresh milk and Eid-ul-Adha Qurbani bookings at Welkin Farmstead, Sopore.' },
    visits: { title: 'Farm visits · Welkin Farmstead', desc: 'Educational farm visits for students at Welkin Farmstead: paddy harvesting, threshing, winnowing and farm tours.' },
    seasons: { title: 'Seasons · Welkin Farmstead', desc: 'A seasonal guide to what is ready when at Welkin Farmstead in Kashmir: cherries, apricots, nectarines, apples, walnuts, kiwi and more.' },
    careers: { title: 'Careers · Welkin Farmstead', desc: 'Jobs at Welkin Farmstead: farm operations, sales, logistics, maintenance and supervision roles in Sopore.' },
    gallery: { title: 'Gallery · Welkin Farmstead', desc: 'Photos from Welkin Farmstead in Sopore, Kashmir: orchards, fresh harvest, rainbow trout tanks, sheep, cattle and student visits.' },
    contact: { title: 'Contact · Welkin Farmstead', desc: 'Order or enquire at Welkin Farmstead, Sopore, Kashmir. WhatsApp 70069 01374. Find us on the map.' },
    shareImage: P('hero.jpg'),
  },

  home: {
    hero: {
      pill: 'Sopore, Kashmir · 193201',
      title: 'Where goodness grows.',
      lead: 'Welkin Farmstead is an agricultural and aquaculture farm. High-density apple orchards, farm-fresh rainbow trout, sheep, bulls and milk — raised in Sopore, sold directly by us.',
      primary: 'Browse the farm shop',
      secondary: 'Chat on WhatsApp',
      secondaryMsg: "Salaam Welkin Farmstead! I'd like to know more about your farm products.",
      imageMain: P('hero.jpg'), capMain: 'Welkin orchards, Sopore',
      imageB: P('trout.jpg'), capB: 'Rainbow trout',
      imageC: P('sheep.jpg'), capC: 'Dumba sheep',
    },
    // Order and visibility of the home page blocks below the top section.
    layout: [
      { id: 'strip', visible: true }, { id: 'shop', visible: true }, { id: 'why', visible: true }, { id: 'journey', visible: true },
      { id: 'farm', visible: true }, { id: 'seasons', visible: true }, { id: 'visit', visible: true }, { id: 'find', visible: true },
      { id: 'follow', visible: true }, { id: 'band', visible: true },
    ],
    facts: [
      { b: '7', span: 'orchard crops — apples to kiwi' },
      { b: 'RAS', span: 'recirculating-tank rainbow trout' },
      { b: 'Dumba & Merino', span: 'sheep, plus bulls and milk' },
      { b: 'Open farm', span: 'field visits for students' },
    ],
    strip: ['Apples', 'Rainbow Trout', 'Ruby Nectarines', 'Cherries', 'Apricots', 'Kiwi', 'Walnuts', 'Pears', 'Dumba & Merino', 'Fresh Milk'],
    shop: { eyebrow: 'Farm shop', title: 'Fresh from the farm', sub: "A few things we're known for. See everything in the shop.", seeAll: 'See all products →', featured: ['apples', 'cherries', 'trout', 'dumba'] },
    why: {
      eyebrow: 'Why Welkin', title: 'Goodness you can', accent: 'trace.',
      items: [
        { icon: 'leaf', title: 'Grown in Sopore', text: 'Orchards and tanks in the apple town of Kashmir.' },
        { icon: 'fish', title: 'Farm-fresh trout', text: 'Raised in clean recirculating tanks, a short trip to your kitchen.' },
        { icon: 'hand', title: 'Straight from the farm', text: 'Apples, fish, sheep and milk — sold directly by the people who raise them.' },
        { icon: 'cap', title: 'Open to learn', text: 'Student farm visits: paddy harvest, threshing, winnowing and tours.' },
      ],
    },
    journey: {
      eyebrow: 'How Welkin grows', title: 'Six stages, one farm', sub: 'Follow the journey automatically, or tap any stage.',
      stages: [
        { icon: 'tree', label: 'Orchards', image: P('orchard.jpg'), title: 'Orchards take root', text: 'High-density apple blocks in Sopore — closely planted rows built for early, generous fruit.' },
        { icon: 'apple', label: 'Fruit basket', image: P('harvest.jpg'), title: 'A fuller basket', text: 'Pears, Ruby Nectarines, apricots, three cherry varieties, kiwi and walnuts join the apples.' },
        { icon: 'sheep', label: 'Herd', image: P('livestock.jpg'), title: 'A herd on the green', text: 'Dumba and Merino sheep, bulls and fresh milk — raised on open pasture, with Qurbani bookings each Eid-ul-Adha.' },
        { icon: 'fish', label: 'Aquaculture', image: P('tanks-wide.jpg'), title: 'Welkin Aquaculture', text: 'Rainbow trout in clean recirculating tanks, now expanding in Model Town, Sopore.' },
        { icon: 'wheat', label: 'Fields', image: P('paddy.jpg'), title: 'Fields that teach', text: 'Students arrive to harvest, thresh and winnow — the farm becomes a classroom.' },
        { icon: 'sprig', label: 'Team', image: P('hero.jpg'), title: 'Growing together', text: 'A growing team across operations, sales, logistics and more — and the next stage still to be written.' },
      ],
    },
    farm: {
      eyebrow: 'Our farm', title: 'Four ways we farm',
      tiles: [
        { to: '/orchard', image: P('orchard.jpg'), title: 'Orchard', text: 'High-density apples, stone fruit, kiwi and walnuts.' },
        { to: '/aquaculture', image: P('tanks.jpg'), title: 'Aquaculture', text: 'Rainbow trout raised in recirculating tanks.' },
        { to: '/livestock', image: P('livestock.jpg'), title: 'Livestock', text: 'Dumba & Merino sheep, bulls, milk and Qurbani.' },
        { to: '/visits', image: P('paddy.jpg'), title: 'Farm visits', text: 'Hands-on field days for students.' },
      ],
    },
    seasons: { eyebrow: 'Seasons', title: 'In season right now', sub: 'Typical Kashmir timing — message us for exact availability.', link: 'Full season calendar →' },
    visit: {
      eyebrow: 'Farm visits', title: 'A day in the fields',
      sub: 'Schools and colleges are welcome to spend a day with us — harvesting, threshing, winnowing and touring the orchard, herd and trout tanks.',
      button: 'Plan a visit', image: P('paddy.jpg'), cap: 'Students on a Welkin farm visit',
    },
    follow: { title: 'Follow the farm', text: 'Daily updates, harvests and new arrivals on Instagram and Facebook.' },
    band: { title: 'Join the Welkin team', text: "We're hiring for farm operations, sales, logistics, maintenance and supervision.", button: 'See open roles' },
  },

  products: [
    { id: 'apples', cat: 'fruit', image: P('orchard.jpg'), name: 'Apples', text: 'From our high-density orchard blocks.', msg: "Salaam Welkin Farmstead! I'd like to enquire about apples — availability and rates, please.", visible: true },
    { id: 'cherries', cat: 'fruit', image: P('cherries.jpg'), name: 'Cherries', text: 'Premium, Cordia and Regina varieties.', msg: "Salaam Welkin Farmstead! I'd like to enquire about cherries (Premium / Cordia / Regina) — availability and rates, please.", visible: true },
    { id: 'nectarines', cat: 'fruit', image: P('nectarines.jpg'), name: 'Ruby Nectarines', text: 'Juicy stone fruit with ruby-red flesh.', msg: "Salaam Welkin Farmstead! I'd like to enquire about Ruby Nectarines — availability and rates, please.", visible: true },
    { id: 'walnuts', cat: 'fruit', image: P('walnuts.jpg'), name: 'Walnuts & kiwi', text: 'Autumn harvest, straight from the farm.', msg: "Salaam Welkin Farmstead! I'd like to enquire about walnuts and kiwi — availability and rates, please.", visible: true },
    { id: 'trout', cat: 'fish', image: P('trout.jpg'), name: 'Rainbow trout', text: 'Farm-fresh from Welkin Aquaculture.', msg: "Salaam Welkin Aquaculture! I'd like to order fresh rainbow trout. Please share availability and rates.", visible: true },
    { id: 'dumba', cat: 'live', image: P('sheep.jpg'), name: 'Dumba sheep', text: 'Hardy fat-tailed sheep. Qurbani bookings open.', msg: "Salaam Welkin Farmstead! I'd like to enquire about Dumba sheep (Qurbani). Please share weights and rates.", visible: true },
    { id: 'merino', cat: 'live', image: P('merino.jpg'), name: 'Merino sheep', text: 'Fine-wool breed, raised on the farm.', msg: "Salaam Welkin Farmstead! I'd like to enquire about Merino sheep. Please share details and rates.", visible: true },
    { id: 'bulls', cat: 'live', image: P('bull.jpg'), name: 'Bulls', text: 'Healthy animals for Qurbani and farm use.', msg: "Salaam Welkin Farmstead! I'd like to enquire about bulls (Qurbani / farm). Please share details and rates.", visible: true },
  ],

  shop: {
    title: 'Farm shop',
    lead: "Tap Enquire on anything and WhatsApp opens with the message ready — we'll reply with availability and rates.",
    also: 'pears · apricots · fresh milk · vegetable & flower seedlings',
    how: {
      eyebrow: 'How ordering works', title: 'Three easy steps',
      steps: [
        { t: 'Pick what you need', d: "Choose products from the shop, or just tell us what you're after." },
        { t: 'Message us', d: 'Tap Enquire — WhatsApp opens with your message ready to send.' },
        { t: 'We confirm', d: "We reply with availability, price and how you'll receive your order." },
      ],
    },
  },

  orchard: {
    title: 'The Welkin orchard',
    lead: 'High-density apple orchards, plus pears, Ruby Nectarines, apricots, cherries, kiwi and walnuts — grown in Sopore.',
    banner: P('orchard.jpg'),
    cta: 'Order fruit', ctaMsg: "Salaam Welkin Farmstead! I'd like to order fruit from your orchard. Please share what's available and the rates.", ctaSecondary: 'When is it ready?',
    cropsHead: { eyebrow: 'What we grow', title: 'From the orchard' },
    crops: [
      { image: P('harvest.jpg'), title: 'Apples & pears', text: 'Our flagship — apples from high-density blocks, plus pears.' },
      { image: P('cherries.jpg'), title: 'Cherries', text: 'Three varieties: Premium, Cordia and Regina.' },
      { image: P('nectarines.jpg'), title: 'Ruby Nectarines & apricots', text: 'Summer stone fruit, sweet and juicy.' },
      { image: P('walnuts.jpg'), title: 'Walnuts & kiwi', text: 'Autumn harvest to round out the year.' },
    ],
    why: {
      eyebrow: 'Why high-density', title: 'More trees, earlier fruit',
      sub: 'In a high-density orchard, trees are planted close together and trained on supports. That means more fruiting trees per acre, fruit that starts earlier, and care and picking that are easier on the people doing it.',
      ticks: ['More trees per acre', 'Earlier fruit', 'Easier care & picking', 'Seedlings for your garden too'],
      image: P('orchard.jpg'), cap: 'Welkin team working in the orchard',
    },
    seedlings: { eyebrow: 'Also', title: 'Seedlings for your garden', sub: "We raise vegetable and flower seedlings too. Message us to ask what's ready." },
  },

  aquaculture: {
    title: 'Welkin Aquaculture',
    lead: 'Farm-fresh rainbow trout raised in a Recirculating Aquaculture System in Sopore.',
    banner: P('tanks-wide.jpg'),
    cta: 'Order fresh trout', ctaMsg: "Salaam Welkin Aquaculture! I'd like to order fresh rainbow trout. Please share availability and rates.",
    intro: {
      eyebrow: 'Welkin Aquaculture', title: 'Something fresh is making waves',
      sub: "We're bringing farm-fresh rainbow trout straight from our tanks in Model Town, Sopore to your kitchen — raised with care in a closed, clean loop.",
      ticks: ['Raised in a Recirculating Aquaculture System (RAS)', 'Far less water than a traditional pond', 'A short farm-to-table journey', 'Expanding in Model Town, Sopore'],
      image: P('trout.jpg'), cap: 'Rainbow trout in a Welkin tank',
    },
    ras: {
      eyebrow: 'How RAS works', title: 'A loop of clean water', sub: 'A Recirculating Aquaculture System cleans and reuses its water instead of constantly replacing it.',
      steps: [
        { t: 'Fish tanks', d: 'Rainbow trout swim in clean, controlled tanks.' },
        { t: 'Solids filter', d: 'Waste and uneaten feed are filtered out of the water.' },
        { t: 'Biofilter', d: 'Helpful bacteria convert harmful compounds into safer ones.' },
        { t: 'Oxygen & reuse', d: 'Water is re-oxygenated and returned to the tanks to be used again.' },
      ],
    },
  },

  livestock: {
    title: 'Livestock & dairy',
    lead: 'Healthy sheep and bulls raised on the farm, fresh milk, and early Qurbani bookings.',
    banner: P('livestock.jpg'),
    cta: 'Book Qurbani', ctaMsg: "Salaam Welkin Farmstead! I'd like to book an animal for Eid-ul-Adha Qurbani. Please share breeds, weights and rates.",
    breedsHead: { eyebrow: 'Our animals', title: 'Breeds we raise' },
    breeds: [
      { image: P('sheep.jpg'), title: 'Dumba sheep', text: 'Hardy, fat-tailed sheep.' },
      { image: P('merino.jpg'), title: 'Merino sheep', text: 'A fine-wool breed.' },
      { image: P('bull.jpg'), title: 'Bulls', text: 'For Qurbani and farm use.' },
    ],
    milk: 'fresh milk',
    qurbani: {
      eyebrow: 'Eid-ul-Adha Qurbani', title: 'Book your Qurbani early',
      sub: "Qurbani spots fill early. Tell us the animal you prefer and your budget, and we'll come back with options.",
      steps: [
        { t: 'Message us', d: 'Tell us breed, approximate weight and budget.' },
        { t: 'We share options', d: "We reply with what's available and the rates." },
        { t: 'Confirm your booking', d: 'Reserve your animal ahead of Eid.' },
      ],
      image: P('livestock.jpg'), cap: 'Sheep and cattle grazing at Welkin Farmstead',
    },
  },

  qurbaniPage: {
    title: 'Book your Qurbani', lead: 'Choose the animal, the weight and how you want it delivered. We confirm availability and the rate on WhatsApp.',
    banner: P('livestock.jpg'),
    animalsHead: 'Choose your animal', weightHead: 'Approximate weight', detailsHead: 'Your details',
    animals: [
      { image: P('sheep.jpg'), name: 'Dumba sheep', text: 'Hardy, fat-tailed sheep.', weights: ['Up to 25 kg', '25–35 kg', '35–45 kg', '45 kg and above'] },
      { image: P('merino.jpg'), name: 'Merino sheep', text: 'A fine-wool breed.', weights: ['Up to 25 kg', '25–35 kg', '35–45 kg', '45 kg and above'] },
      { image: P('bull.jpg'), name: 'Bull', text: 'Healthy bulls raised on the farm.', weights: ['150–250 kg', '250–350 kg', '350 kg and above'] },
    ],
    deliveries: ['I will collect from the farm', 'Deliver in Sopore', 'Deliver in Srinagar', 'Deliver elsewhere in Kashmir'],
    note: 'Sending this does not charge anything. It reserves your request; we will confirm the animal, the rate and the advance on WhatsApp.',
    button: 'Send booking request',
    doneTitle: 'Booking request sent', doneText: 'Thank you! We have received your request and will confirm on WhatsApp shortly. If WhatsApp did not open, use the button below.',
  },

  visits: {
    title: 'Farm visits for students',
    lead: 'Hands-on field days at Welkin Farmstead — paddy harvesting, threshing, winnowing and farm tours.',
    banner: P('paddy.jpg'),
    cta: 'Request a visit', ctaMsg: "Salaam Welkin Farmstead! We'd like to arrange an educational farm visit for students. Please share dates and details.",
    intro: {
      eyebrow: 'Educational visits', title: 'A real day of agriculture',
      sub: 'Schools and colleges are welcome. Students join us in the paddy fields to harvest, thresh and winnow rice by hand — then see the orchard, herd and trout tanks.',
      ticks: ['Paddy harvesting', 'Threshing & winnowing', 'Orchard & herd tour', 'Student groups welcome'],
      image: P('paddy.jpg'), cap: 'Students on a Welkin farm visit',
    },
    day: {
      eyebrow: 'The day', title: 'What students do',
      steps: [
        { t: 'Harvest', d: 'Cut ripened paddy by hand in the field.' },
        { t: 'Thresh', d: 'Separate the grain from the stalk the traditional way.' },
        { t: 'Winnow', d: 'Let the wind carry the husk away.' },
        { t: 'Tour', d: 'Walk the orchard, meet the herd and see the trout tanks.' },
      ],
    },
    plan: { eyebrow: 'Plan a visit', title: 'Tell us about your group', sub: 'Fill this in and WhatsApp opens with your message ready.' },
  },

  seasonsPage: {
    title: "What's good right now",
    lead: 'Choose a month to see what the valley is offering. Timings are typical for Kashmir and move with the weather — message us for exact availability.',
  },
  crops: [
    { name: 'Cherries', note: 'Premium · Cordia · Regina', from: 4, to: 6 },
    { name: 'Apricots', note: '', from: 5, to: 6 },
    { name: 'Ruby Nectarines', note: '', from: 6, to: 7 },
    { name: 'Pears', note: '', from: 7, to: 9 },
    { name: 'Apples', note: 'High-density orchard', from: 7, to: 10 },
    { name: 'Walnuts', note: '', from: 8, to: 9 },
    { name: 'Kiwi', note: '', from: 9, to: 10 },
    { name: 'Seedlings', note: 'Vegetables & flowers', from: 2, to: 4 },
    { name: 'Paddy field visits', note: 'Student days', from: 8, to: 9 },
    { name: 'Rainbow trout', note: 'Welkin Aquaculture', from: 0, to: 11 },
    { name: 'Fresh milk', note: 'From our herd', from: 0, to: 11 },
  ],

  careersPage: {
    title: 'Join the Welkin team',
    lead: "We're growing. Welkin Farmstead is hiring across farm operations, sales, logistics, maintenance and supervision. Pick a role and apply on WhatsApp.",
    apply: 'Apply',
    applyMsg: 'Salaam Welkin Farmstead! I am interested in the {role} role. My name is ___ and I have ___ experience.',
  },
  roles: [
    { t: 'Farm operations', d: 'Orchard, field and herd work.', open: true },
    { t: 'Sales', d: 'Talk to customers and take orders.', open: true },
    { t: 'Logistics', d: 'Get fresh produce where it needs to go.', open: true },
    { t: 'Maintenance', d: 'Keep equipment, tanks and facilities running.', open: true },
    { t: 'Supervision', d: 'Lead and coordinate farm teams.', open: true },
  ],

  galleryPage: { title: 'Life at Welkin', lead: 'Orchards, harvests, trout tanks, flocks and student days. Tap a photo to view it full size.' },
  gallery: [
    { image: P('hero.jpg'), cap: 'Aerial view of the farm' }, { image: P('orchard.jpg'), cap: 'In the orchard' }, { image: P('harvest.jpg'), cap: 'Fresh harvest' },
    { image: P('tanks-wide.jpg'), cap: 'Welkin Aquaculture' }, { image: P('livestock.jpg'), cap: 'Sheep and cattle' }, { image: P('paddy.jpg'), cap: 'Student farm visit' },
    { image: P('cherries.jpg'), cap: 'Cherries' }, { image: P('trout.jpg'), cap: 'Rainbow trout' }, { image: P('merino.jpg'), cap: 'Merino sheep' },
    { image: P('nectarines.jpg'), cap: 'Ruby Nectarines' }, { image: P('bull.jpg'), cap: 'Bulls' }, { image: P('walnuts.jpg'), cap: 'Walnuts & kiwi' },
  ],

  contactPage: {
    title: 'Order or enquire',
    lead: "Choose what you're after and send. WhatsApp opens with your message ready.",
    faqHead: { eyebrow: 'FAQ', title: 'Good to know' },
  },
  orderItems: ['Apples', 'Cherries', 'Ruby Nectarines', 'Apricots / Pears', 'Kiwi', 'Walnuts', 'Rainbow trout', 'Fresh milk', 'Dumba sheep', 'Merino sheep', 'Bulls', 'Seedlings', 'A farm visit'],
  faq: [
    { q: 'How do I order?', a: "Tap any Enquire or Order button — WhatsApp opens with your message ready. We reply with availability, price and how you'll receive your order." },
    { q: 'Do you take Qurbani bookings?', a: "Yes. Eid-ul-Adha Qurbani bookings are taken ahead of time. Message us the breed (Dumba, Merino or bull), approximate weight and budget, and we'll share options." },
    { q: 'When is each fruit available?', a: 'See our Seasons page for typical Kashmir timing. It shifts with the weather, so message us for exact availability.' },
    { q: 'Can my school or college visit?', a: 'Yes — student groups are welcome for paddy harvesting, threshing, winnowing and a farm tour. Fill in the form on the Farm visits page.' },
    { q: 'Where are you located?', a: 'Welkin Farmstead is in Sopore, Kashmir 193201. Welkin Aquaculture is expanding in Model Town, Sopore.' },
    { q: 'Are you hiring?', a: 'We hire for farm operations, sales, logistics, maintenance and supervision. See the Careers page and apply on WhatsApp.' },
  ],
  locations: [
    { name: 'Welkin Farmstead', lat: 34.301, lng: 74.466, text: 'Orchards, livestock and paddy fields, Sopore, Kashmir 193201. Message us before you visit so we can guide you in.' },
    { name: 'Welkin Aquaculture', lat: 34.301, lng: 74.466, text: 'Rainbow trout in recirculating tanks — expanding in Model Town, Sopore.' },
  ],
  findUs: {
    eyebrow: 'Find us', title: 'Visit Welkin Farmstead',
    sub: "We're in Sopore, Kashmir — the apple town of the valley. Welkin Aquaculture is expanding in Model Town, Sopore. Message us before you come so we can guide you in.",
  },
  enq: { title: 'Ready to order?', text: "Message us on WhatsApp — tell us what you need and we'll reply with availability and rates.", button: 'Order on WhatsApp', msg: "Salaam Welkin Farmstead! I'd like to place an order." },
  notFound: { title: 'This page wandered off.', text: "The page you're looking for isn't here. Let's get you back to the farm." },
};
