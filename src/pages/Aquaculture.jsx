import { Sec, Sh, Split, Ticks, Steps, EnqBand, PageHead, WaButton } from '../components/Blocks.jsx';
import { Ph } from '../components/Img.jsx';
import { D } from '../data/content.js';
import { useContent } from '../content/ContentContext.jsx';

export default function Aquaculture() {
  const { aquaculture: a } = useContent();
  return (
    <>
      <PageHead
        trail={[['Home', '/'], ['Our farm'], ['Aquaculture']]} title={a.title} lead={a.lead}
        banner={a.banner} bannerAlt={a.title}
        ctas={<WaButton msg={a.ctaMsg}>{a.cta}</WaButton>}
      />
      <Sec>
        <Split
          left={<>
            <p className="eyebrow">{a.intro.eyebrow}</p>
            <h2>{a.intro.title}</h2>
            <p className="sub">{a.intro.sub}</p>
            <Ticks items={a.intro.ticks} />
          </>}
          right={<Ph file={a.intro.image} cap={a.intro.cap} sizes="(min-width:980px) 560px, 100vw" />}
        />
      </Sec>
      <Sec kind="aqua" decos={[
        D('fish', 'tr', 220, 2, 'top:40px;right:6%', { cls: 'swim' }), D('fish', 'tl', 150, 0, 'top:120px;left:3%', { flip: true, cls: 'swim s2' }),
        D('waves', 'br', 460, 0, 'bottom:10px;right:-20px'), D('waves', 'bl', 360, 0, 'bottom:60px;left:-20px'),
      ]}>
        <Sh eyebrow={a.ras.eyebrow} title={a.ras.title} sub={a.ras.sub} />
        <Steps items={a.ras.steps.map((s) => [s.t, s.d])} />
      </Sec>
      <EnqBand />
    </>
  );
}
