import { Sec, Sh, Split, Ticks, Steps, PageHead, WaButton } from '../components/Blocks.jsx';
import { Ph } from '../components/Img.jsx';
import { VisitForm } from '../components/Parts.jsx';
import { D } from '../data/content.js';
import { useContent } from '../content/ContentContext.jsx';

export default function Visits() {
  const { visits: v } = useContent();
  return (
    <>
      <PageHead
        trail={[['Home', '/'], ['Our farm'], ['Farm visits']]} title={v.title} lead={v.lead}
        banner={v.banner} bannerAlt={v.title}
        ctas={<WaButton msg={v.ctaMsg}>{v.cta}</WaButton>}
      />
      <Sec>
        <Split
          left={<>
            <p className="eyebrow">{v.intro.eyebrow}</p>
            <h2>{v.intro.title}</h2>
            <p className="sub">{v.intro.sub}</p>
            <Ticks items={v.intro.ticks} />
          </>}
          right={<Ph file={v.intro.image} cap={v.intro.cap} sizes="(min-width:980px) 560px, 100vw" />}
        />
      </Sec>
      <Sec kind="dark" decos={[D('wheat', 'tl', 150, -4, 'top:10px;left:2%'), D('wheat', 'tr', 150, 6, 'top:10px;right:2%', { flip: true }), D('sprig', 'br', 220, 10, 'bottom:-30px;right:20%')]}>
        <Sh eyebrow={v.day.eyebrow} title={v.day.title} />
        <Steps items={v.day.steps.map((s) => [s.t, s.d])} />
      </Sec>
      <Sec>
        <Split
          left={<><p className="eyebrow">{v.plan.eyebrow}</p><h2>{v.plan.title}</h2><p className="sub">{v.plan.sub}</p></>}
          right={<VisitForm />}
        />
      </Sec>
    </>
  );
}
