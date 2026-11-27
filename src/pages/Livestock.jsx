import { Sec, Sh, Split, Steps, EnqBand, PageHead, WaButton } from '../components/Blocks.jsx';
import { Ph } from '../components/Img.jsx';
import { InfoCard } from '../components/Parts.jsx';
import { D } from '../data/content.js';
import { useContent } from '../content/ContentContext.jsx';

export default function Livestock() {
  const { livestock: l } = useContent();
  return (
    <>
      <PageHead
        trail={[['Home', '/'], ['Our farm'], ['Livestock']]} title={l.title} lead={l.lead}
        banner={l.banner} bannerAlt={l.title}
        ctas={<WaButton msg={l.ctaMsg}>{l.cta}</WaButton>}
      />
      <Sec>
        <Sh eyebrow={l.breedsHead.eyebrow} title={l.breedsHead.title} />
        <div className="cards c3" tabIndex={0} role="region" aria-label={l.breedsHead.title}>{l.breeds.map((b, i) => <InfoCard key={b.title + i} file={b.image} title={b.title} text={b.text} sizes="(min-width:980px) 360px, 50vw" />)}</div>
        <p className="also">We also supply <b>{l.milk}</b> from our herd — message us for details.</p>
      </Sec>
      <Sec kind="tint" decos={[D('wheat', 'br', 150, 5, 'bottom:0;right:3%'), D('sheep', 'tl', 190, 0, 'top:20px;left:3%')]}>
        <Split
          left={<>
            <p className="eyebrow">{l.qurbani.eyebrow}</p>
            <h2>{l.qurbani.title}</h2>
            <p className="sub">{l.qurbani.sub}</p>
            <Steps items={l.qurbani.steps.map((s) => [s.t, s.d])} />
          </>}
          right={<Ph file={l.qurbani.image} cap={l.qurbani.cap} sizes="(min-width:980px) 560px, 100vw" />}
        />
      </Sec>
      <EnqBand />
    </>
  );
}
