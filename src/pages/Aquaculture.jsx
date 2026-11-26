import { Sec, Sh, Split, Ticks, Steps, EnqBand, PageHead, WaButton } from '../components/Blocks.jsx';
import { Ph } from '../components/Img.jsx';
import { D } from '../data/content.js';

export default function Aquaculture() {
  return (
    <>
      <PageHead
        trail={[['Home', '/'], ['Our farm'], ['Aquaculture']]} title="Welkin Aquaculture"
        lead="Farm-fresh rainbow trout raised in a Recirculating Aquaculture System in Sopore."
        banner="tanks-wide.jpg" bannerAlt="Welkin Aquaculture trout tanks"
        ctas={<WaButton msg="Salaam Welkin Aquaculture! I'd like to order fresh rainbow trout. Please share availability and rates.">Order fresh trout</WaButton>}
      />
      <Sec>
        <Split
          left={<>
            <p className="eyebrow">Welkin Aquaculture</p>
            <h2>Something fresh is making waves</h2>
            <p className="sub">We're bringing farm-fresh rainbow trout straight from our tanks in Model Town, Sopore to your kitchen — raised with care in a closed, clean loop.</p>
            <Ticks items={['Raised in a Recirculating Aquaculture System (RAS)', 'Far less water than a traditional pond', 'A short farm-to-table journey', 'Expanding in Model Town, Sopore']} />
          </>}
          right={<Ph file="trout.jpg" cap="Rainbow trout in a Welkin tank" sizes="(min-width:980px) 560px, 100vw" />}
        />
      </Sec>
      <Sec kind="aqua" decos={[
        D('fish', 'tr', 220, 2, 'top:40px;right:6%', { cls: 'swim' }), D('fish', 'tl', 150, 0, 'top:120px;left:3%', { flip: true, cls: 'swim s2' }),
        D('waves', 'br', 460, 0, 'bottom:10px;right:-20px'), D('waves', 'bl', 360, 0, 'bottom:60px;left:-20px'),
      ]}>
        <Sh eyebrow="How RAS works" title="A loop of clean water" sub="A Recirculating Aquaculture System cleans and reuses its water instead of constantly replacing it." />
        <Steps items={[
          ['Fish tanks', 'Rainbow trout swim in clean, controlled tanks.'],
          ['Solids filter', 'Waste and uneaten feed are filtered out of the water.'],
          ['Biofilter', 'Helpful bacteria convert harmful compounds into safer ones.'],
          ['Oxygen & reuse', 'Water is re-oxygenated and returned to the tanks to be used again.'],
        ]} />
      </Sec>
      <EnqBand />
    </>
  );
}
