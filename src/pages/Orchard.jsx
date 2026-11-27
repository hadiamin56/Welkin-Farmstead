import { Link } from 'react-router-dom';
import { Sec, Sh, Split, Ticks, EnqBand, PageHead, WaButton } from '../components/Blocks.jsx';
import { Ph } from '../components/Img.jsx';
import { InfoCard } from '../components/Parts.jsx';
import { D } from '../data/content.js';
import { useContent } from '../content/ContentContext.jsx';

export default function Orchard() {
  const { orchard: o } = useContent();
  return (
    <>
      <PageHead
        trail={[['Home', '/'], ['Our farm'], ['Orchard']]} title={o.title} lead={o.lead}
        banner={o.banner} bannerAlt={o.title}
        ctas={<>
          <WaButton msg={o.ctaMsg}>{o.cta}</WaButton>
          <Link className="btn btn-ghost" to="/seasons">{o.ctaSecondary}</Link>
        </>}
      />
      <Sec>
        <Sh eyebrow={o.cropsHead.eyebrow} title={o.cropsHead.title} />
        <div className="cards">{o.crops.map((c, i) => <InfoCard key={c.title + i} file={c.image} title={c.title} text={c.text} />)}</div>
      </Sec>
      <Sec kind="dark" decos={[D('sprig', 'tl', 260, -8, 'top:-20px;left:-40px'), D('apple-branch', 'br', 480, 0, 'bottom:-50px;right:-60px')]}>
        <Split
          left={<>
            <p className="eyebrow">{o.why.eyebrow}</p>
            <h2>{o.why.title}</h2>
            <p className="sub">{o.why.sub}</p>
            <Ticks items={o.why.ticks} />
          </>}
          right={<Ph file={o.why.image} cap={o.why.cap} sizes="(min-width:980px) 560px, 100vw" />}
        />
      </Sec>
      <Sec><Sh eyebrow={o.seedlings.eyebrow} title={o.seedlings.title} sub={o.seedlings.sub} /></Sec>
      <EnqBand />
    </>
  );
}
