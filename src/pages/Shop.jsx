import { useState } from 'react';
import { Sec, Sh, Steps, EnqBand, Crumbs } from '../components/Blocks.jsx';
import { ProductCard, ShopFilters } from '../components/Parts.jsx';
import { D } from '../data/content.js';
import { useContent } from '../content/ContentContext.jsx';

export default function Shop() {
  const { shop, products } = useContent();
  const [filter, setFilter] = useState('all');
  const list = products.filter((p) => p.visible);
  return (
    <>
      <Sec>
        <Crumbs trail={[['Home', '/'], ['Shop']]} />
        <h1 className="ph1">{shop.title}</h1>
        <p className="lead">{shop.lead}</p>
        <ShopFilters value={filter} onChange={setFilter} />
        <div className="cards" id="shopGrid">
          {list.map((p) => <ProductCard key={p.id} p={{ ...p, hidden: filter !== 'all' && p.cat !== filter }} />)}
        </div>
        <p className="also">Also from the farm: {shop.also.split('·').map((x, i, a) => <span key={x}><b>{x.trim()}</b>{i < a.length - 1 ? ' · ' : ''}</span>)}</p>
      </Sec>
      <Sec kind="tint" decos={[D('cherries', 'br', 170, 8, 'bottom:-10px;right:4%'), D('sprig', 'tl', 170, -16, 'top:-10px;left:-20px')]}>
        <Sh eyebrow={shop.how.eyebrow} title={shop.how.title} />
        <Steps items={shop.how.steps.map((s) => [s.t, s.d])} />
      </Sec>
      <EnqBand />
    </>
  );
}
