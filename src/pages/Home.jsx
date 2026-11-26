import { Link } from 'react-router-dom';
import { Sec, Sh, Split, Band, WaButton, Fade } from '../components/Blocks.jsx';
import { Ph } from '../components/Img.jsx';
import { DecoWrap } from '../components/Deco.jsx';
import { FindUs } from '../components/FindUs.jsx';
import { Journey } from '../components/Journey.jsx';
import { ProductCard, Features, Tiles, Strip, SeasonList, FollowBand } from '../components/Parts.jsx';
import { PRODUCTS, HERO_DECO, D } from '../data/content.js';

const FEATURED = [0, 1, 4, 5].map((i) => PRODUCTS[i]);

export default function Home() {
  return (
    <>
      <section className="hero">
        <DecoWrap items={HERO_DECO}><span className="blob b1" /><span className="blob b2" /></DecoWrap>
        <div className="wrap hero-in">
          <div className="hero-copy">
            <p className="pill"><span /> Sopore, Kashmir · 193201</p>
            <h1>Where goodness grows.</h1>
            <p className="lead">Welkin Farmstead is an agricultural and aquaculture farm. High-density apple orchards, farm-fresh rainbow trout, sheep, bulls and milk — raised in Sopore, sold directly by us.</p>
            <div className="actions">
              <Link className="btn btn-green" to="/shop">Browse the farm shop</Link>
              <WaButton cls="btn btn-ghost" msg="Salaam Welkin Farmstead! I'd like to know more about your farm products.">Chat on WhatsApp</WaButton>
            </div>
          </div>
          <div className="collage">
            <Ph file="hero.jpg" alt="Welkin orchards, Sopore" cap="Welkin orchards, Sopore" cls="a" sizes="(min-width:980px) 520px, 100vw" eager />
            <Ph file="trout.jpg" cap="Rainbow trout" cls="b" sizes="(min-width:980px) 260px, 50vw" />
            <Ph file="sheep.jpg" cap="Dumba sheep" cls="c" sizes="(min-width:980px) 260px, 50vw" />
          </div>
        </div>
        <Fade className="wrap facts">
          <div><b>7</b><span>orchard crops — apples to kiwi</span></div>
          <div><b>RAS</b><span>recirculating-tank rainbow trout</span></div>
          <div><b>Dumba &amp; Merino</b><span>sheep, plus bulls and milk</span></div>
          <div><b>Open farm</b><span>field visits for students</span></div>
        </Fade>
      </section>

      <div className="wrap qb">
        <div className="qb-card">
          <div><b>Eid-ul-Adha Qurbani bookings are open</b><span>Dumba, Merino and bulls — reserve early.</span></div>
          <WaButton cls="btn btn-sm btn-green" msg="Salaam Welkin Farmstead! I'd like to book an animal for Eid-ul-Adha Qurbani.">Book</WaButton>
        </div>
      </div>

      <Strip />

      <Sec>
        <Sh eyebrow="Farm shop" title="Fresh from the farm" sub="A few things we're known for. See everything in the shop." />
        <div className="cards">{FEATURED.map((p) => <ProductCard key={p.name} p={p} />)}</div>
        <p className="more"><Link className="btn btn-ghost" to="/shop">See all products →</Link></p>
      </Sec>

      <Sec kind="dark" decos={[D('sprig', 'tl', 280, -6, 'top:-20px;left:-40px'), D('apple-branch', 'br', 520, 0, 'bottom:-60px;right:-60px')]}>
        <Sh eyebrow="Why Welkin" title={<>Goodness you can <em>trace.</em></>} />
        <Features />
      </Sec>

      <Journey />

      <Sec kind="tint" decos={[D('wheat', 'br', 190, 6, 'bottom:-10px;right:2%'), D('cherries', 'tr', 130, 10, 'top:30px;right:5%')]}>
        <Sh eyebrow="Our farm" title="Four ways we farm" />
        <Tiles />
      </Sec>

      <Sec decos={[D('sprig', 'tr', 200, 14, 'top:10px;right:0')]}>
        <Sh eyebrow="Seasons" title="In season right now" sub="Typical Kashmir timing — message us for exact availability." />
        <SeasonList />
        <p className="more"><Link className="btn btn-ghost" to="/seasons">Full season calendar →</Link></p>
      </Sec>

      <Sec kind="tint" decos={[D('tree', 'bl', 150, 0, 'bottom:10px;left:2%'), D('wheat', 'tr', 110, 8, 'top:20px;right:3%')]}>
        <Split
          left={<>
            <p className="eyebrow">Farm visits</p>
            <h2>A day in the fields</h2>
            <p className="sub">Schools and colleges are welcome to spend a day with us — harvesting, threshing, winnowing and touring the orchard, herd and trout tanks.</p>
            <p><Link className="btn btn-green" to="/visits">Plan a visit</Link></p>
          </>}
          right={<Ph file="paddy.jpg" cap="Students on a Welkin farm visit" sizes="(min-width:980px) 560px, 100vw" />}
        />
      </Sec>

      <Sec><FindUs /></Sec>
      <FollowBand />
      <Band title="Join the Welkin team" text="We're hiring for farm operations, sales, logistics, maintenance and supervision." action={<Link className="btn btn-light" to="/careers">See open roles</Link>} />
    </>
  );
}
