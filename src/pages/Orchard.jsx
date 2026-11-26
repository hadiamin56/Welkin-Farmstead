import { Link } from 'react-router-dom';
import { Sec, Sh, Split, Ticks, EnqBand, PageHead, WaButton } from '../components/Blocks.jsx';
import { Ph } from '../components/Img.jsx';
import { InfoCard } from '../components/Parts.jsx';
import { D } from '../data/content.js';

const CROPS = [
  ['harvest.jpg', 'Apples & pears', 'Our flagship — apples from high-density blocks, plus pears.'],
  ['cherries.jpg', 'Cherries', 'Three varieties: Premium, Cordia and Regina.'],
  ['nectarines.jpg', 'Ruby Nectarines & apricots', 'Summer stone fruit, sweet and juicy.'],
  ['walnuts.jpg', 'Walnuts & kiwi', 'Autumn harvest to round out the year.'],
];

export default function Orchard() {
  return (
    <>
      <PageHead
        trail={[['Home', '/'], ['Our farm'], ['Orchard']]} title="The Welkin orchard"
        lead="High-density apple orchards, plus pears, Ruby Nectarines, apricots, cherries, kiwi and walnuts — grown in Sopore."
        banner="orchard.jpg" bannerAlt="Welkin orchard in Sopore"
        ctas={<>
          <WaButton msg="Salaam Welkin Farmstead! I'd like to order fruit from your orchard. Please share what's available and the rates.">Order fruit</WaButton>
          <Link className="btn btn-ghost" to="/seasons">When is it ready?</Link>
        </>}
      />
      <Sec>
        <Sh eyebrow="What we grow" title="From the orchard" />
        <div className="cards">{CROPS.map(([f, t, d]) => <InfoCard key={t} file={f} title={t} text={d} />)}</div>
      </Sec>
      <Sec kind="dark" decos={[D('sprig', 'tl', 260, -8, 'top:-20px;left:-40px'), D('apple-branch', 'br', 480, 0, 'bottom:-50px;right:-60px')]}>
        <Split
          left={<>
            <p className="eyebrow">Why high-density</p>
            <h2>More trees, earlier fruit</h2>
            <p className="sub">In a high-density orchard, trees are planted close together and trained on supports. That means more fruiting trees per acre, fruit that starts earlier, and care and picking that are easier on the people doing it.</p>
            <Ticks items={['More trees per acre', 'Earlier fruit', 'Easier care & picking', 'Seedlings for your garden too']} />
          </>}
          right={<Ph file="orchard.jpg" cap="Welkin team working in the orchard" sizes="(min-width:980px) 560px, 100vw" />}
        />
      </Sec>
      <Sec><Sh eyebrow="Also" title="Seedlings for your garden" sub="We raise vegetable and flower seedlings too. Message us to ask what's ready." /></Sec>
      <EnqBand />
    </>
  );
}
