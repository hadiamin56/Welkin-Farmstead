import { useState } from 'react';
import { Sec, Sh, Steps, EnqBand, Crumbs, Fade } from '../components/Blocks.jsx';
import { ProductCard, ShopFilters } from '../components/Parts.jsx';
import { PRODUCTS, D } from '../data/content.js';

export default function Shop() {
  const [filter, setFilter] = useState('all');
  return (
    <>
      <Sec>
        <Crumbs trail={[['Home', '/'], ['Shop']]} />
        <h1 className="ph1">Farm shop</h1>
        <p className="lead">Tap Enquire on anything and WhatsApp opens with the message ready — we'll reply with availability and rates.</p>
        <ShopFilters value={filter} onChange={setFilter} />
        <div className="cards" id="shopGrid">
          {PRODUCTS.map((p) => <ProductCard key={p.name} p={{ ...p, hidden: filter !== 'all' && p.cat !== filter }} />)}
        </div>
        <p className="also">Also from the farm: <b>pears</b> · <b>apricots</b> · <b>fresh milk</b> · <b>vegetable &amp; flower seedlings</b></p>
      </Sec>
      <Sec kind="tint" decos={[D('cherries', 'br', 170, 8, 'bottom:-10px;right:4%'), D('sprig', 'tl', 170, -16, 'top:-10px;left:-20px')]}>
        <Sh eyebrow="How ordering works" title="Three easy steps" />
        <Steps items={[
          ['Pick what you need', "Choose products from the shop, or just tell us what you're after."],
          ['Message us', 'Tap Enquire — WhatsApp opens with your message ready to send.'],
          ['We confirm', "We reply with availability, price and how you'll receive your order."],
        ]} />
      </Sec>
      <EnqBand />
    </>
  );
}
