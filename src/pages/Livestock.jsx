import { Sec, Sh, Split, Steps, EnqBand, PageHead, WaButton } from '../components/Blocks.jsx';
import { Ph } from '../components/Img.jsx';
import { InfoCard } from '../components/Parts.jsx';
import { D } from '../data/content.js';

const BREEDS = [['sheep.jpg', 'Dumba sheep', 'Hardy, fat-tailed sheep.'], ['merino.jpg', 'Merino sheep', 'A fine-wool breed.'], ['bull.jpg', 'Bulls', 'For Qurbani and farm use.']];

export default function Livestock() {
  return (
    <>
      <PageHead
        trail={[['Home', '/'], ['Our farm'], ['Livestock']]} title="Livestock & dairy"
        lead="Healthy sheep and bulls raised on the farm, fresh milk, and early Qurbani bookings."
        banner="livestock.jpg" bannerAlt="Sheep and cattle at Welkin Farmstead"
        ctas={<WaButton msg="Salaam Welkin Farmstead! I'd like to book an animal for Eid-ul-Adha Qurbani. Please share breeds, weights and rates.">Book Qurbani</WaButton>}
      />
      <Sec>
        <Sh eyebrow="Our animals" title="Breeds we raise" />
        <div className="cards c3">{BREEDS.map(([f, t, d]) => <InfoCard key={t} file={f} title={t} text={d} sizes="(min-width:980px) 360px, 50vw" />)}</div>
        <p className="also">We also supply <b>fresh milk</b> from our herd — message us for details.</p>
      </Sec>
      <Sec kind="tint" decos={[D('wheat', 'br', 150, 5, 'bottom:0;right:3%'), D('sheep', 'tl', 190, 0, 'top:20px;left:3%')]}>
        <Split
          left={<>
            <p className="eyebrow">Eid-ul-Adha Qurbani</p>
            <h2>Book your Qurbani early</h2>
            <p className="sub">Qurbani spots fill early. Tell us the animal you prefer and your budget, and we'll come back with options.</p>
            <Steps items={[['Message us', 'Tell us breed, approximate weight and budget.'], ['We share options', "We reply with what's available and the rates."], ['Confirm your booking', 'Reserve your animal ahead of Eid.']]} />
          </>}
          right={<Ph file="livestock.jpg" cap="Sheep and cattle grazing at Welkin Farmstead" sizes="(min-width:980px) 560px, 100vw" />}
        />
      </Sec>
      <EnqBand />
    </>
  );
}
