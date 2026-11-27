import { Link } from 'react-router-dom';
import { Sec, Sh, Split, Band, WaButton, Fade } from '../components/Blocks.jsx';
import { Ph } from '../components/Img.jsx';
import { DecoWrap } from '../components/Deco.jsx';
import { FindUs } from '../components/FindUs.jsx';
import { Journey } from '../components/Journey.jsx';
import { ProductCard, Features, Tiles, Strip, SeasonList, FollowBand } from '../components/Parts.jsx';
import { HERO_DECO, D } from '../data/content.js';
import { useContent } from '../content/ContentContext.jsx';

export default function Home() {
  const { home: h, products, site } = useContent();
  const featured = h.shop.featured.map((id) => products.find((p) => p.id === id)).filter((p) => p && p.visible);
  return (
    <>
      <section className="hero">
        <DecoWrap items={HERO_DECO}><span className="blob b1" /><span className="blob b2" /></DecoWrap>
        <div className="wrap hero-in">
          <div className="hero-copy">
            <p className="pill"><span /> {h.hero.pill}</p>
            <h1>{h.hero.title}</h1>
            <p className="lead">{h.hero.lead}</p>
            <div className="actions">
              <Link className="btn btn-green" to="/shop">{h.hero.primary}</Link>
              <WaButton cls="btn btn-ghost" msg={h.hero.secondaryMsg}>{h.hero.secondary}</WaButton>
            </div>
          </div>
          <div className="collage">
            <Ph file={h.hero.imageMain} alt={h.hero.capMain} cap={h.hero.capMain} cls="a" sizes="(min-width:980px) 520px, 100vw" eager />
            <Ph file={h.hero.imageB} cap={h.hero.capB} cls="b" sizes="(min-width:980px) 260px, 50vw" />
            <Ph file={h.hero.imageC} cap={h.hero.capC} cls="c" sizes="(min-width:980px) 260px, 50vw" />
          </div>
        </div>
        <Fade className="wrap facts">
          {h.facts.map((f) => <div key={f.b + f.span}><b>{f.b}</b><span>{f.span}</span></div>)}
        </Fade>
      </section>

      <div className="wrap qb">
        <div className="qb-card">
          <div><b>{site.qurbaniCard.title}</b><span>{site.qurbaniCard.text}</span></div>
          <WaButton cls="btn btn-sm btn-green" msg={site.announcement.msg}>{site.qurbaniCard.button}</WaButton>
        </div>
      </div>

      <Strip />

      <Sec>
        <Sh eyebrow={h.shop.eyebrow} title={h.shop.title} sub={h.shop.sub} />
        <div className="cards">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        <p className="more"><Link className="btn btn-ghost" to="/shop">{h.shop.seeAll}</Link></p>
      </Sec>

      <Sec kind="dark" decos={[D('sprig', 'tl', 280, -6, 'top:-20px;left:-40px'), D('apple-branch', 'br', 520, 0, 'bottom:-60px;right:-60px')]}>
        <Sh eyebrow={h.why.eyebrow} title={<>{h.why.title} <em>{h.why.accent}</em></>} />
        <Features />
      </Sec>

      <Journey />

      <Sec kind="tint" decos={[D('wheat', 'br', 190, 6, 'bottom:-10px;right:2%'), D('cherries', 'tr', 130, 10, 'top:30px;right:5%')]}>
        <Sh eyebrow={h.farm.eyebrow} title={h.farm.title} />
        <Tiles />
      </Sec>

      <Sec decos={[D('sprig', 'tr', 200, 14, 'top:10px;right:0')]}>
        <Sh eyebrow={h.seasons.eyebrow} title={h.seasons.title} sub={h.seasons.sub} />
        <SeasonList />
        <p className="more"><Link className="btn btn-ghost" to="/seasons">{h.seasons.link}</Link></p>
      </Sec>

      <Sec kind="tint" decos={[D('tree', 'bl', 150, 0, 'bottom:10px;left:2%'), D('wheat', 'tr', 110, 8, 'top:20px;right:3%')]}>
        <Split
          left={<>
            <p className="eyebrow">{h.visit.eyebrow}</p>
            <h2>{h.visit.title}</h2>
            <p className="sub">{h.visit.sub}</p>
            <p><Link className="btn btn-green" to="/visits">{h.visit.button}</Link></p>
          </>}
          right={<Ph file={h.visit.image} cap={h.visit.cap} sizes="(min-width:980px) 560px, 100vw" />}
        />
      </Sec>

      <Sec><FindUs /></Sec>
      <FollowBand />
      <Band title={h.band.title} text={h.band.text} action={<Link className="btn btn-light" to="/careers">{h.band.button}</Link>} />
    </>
  );
}
