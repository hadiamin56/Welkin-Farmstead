import { Sec, Sh, Split, Ticks, Steps, PageHead, WaButton } from '../components/Blocks.jsx';
import { Ph } from '../components/Img.jsx';
import { VisitForm } from '../components/Parts.jsx';
import { D } from '../data/content.js';

export default function Visits() {
  return (
    <>
      <PageHead
        trail={[['Home', '/'], ['Our farm'], ['Farm visits']]} title="Farm visits for students"
        lead="Hands-on field days at Welkin Farmstead — paddy harvesting, threshing, winnowing and farm tours."
        banner="paddy.jpg" bannerAlt="Students on a farm visit at Welkin Farmstead"
        ctas={<WaButton msg="Salaam Welkin Farmstead! We'd like to arrange an educational farm visit for students. Please share dates and details.">Request a visit</WaButton>}
      />
      <Sec>
        <Split
          left={<>
            <p className="eyebrow">Educational visits</p>
            <h2>A real day of agriculture</h2>
            <p className="sub">Schools and colleges are welcome. Students join us in the paddy fields to harvest, thresh and winnow rice by hand — then see the orchard, herd and trout tanks.</p>
            <Ticks items={['Paddy harvesting', 'Threshing & winnowing', 'Orchard & herd tour', 'Student groups welcome']} />
          </>}
          right={<Ph file="paddy.jpg" cap="Students on a Welkin farm visit" sizes="(min-width:980px) 560px, 100vw" />}
        />
      </Sec>
      <Sec kind="dark" decos={[D('wheat', 'tl', 150, -4, 'top:10px;left:2%'), D('wheat', 'tr', 150, 6, 'top:10px;right:2%', { flip: true }), D('sprig', 'br', 220, 10, 'bottom:-30px;right:20%')]}>
        <Sh eyebrow="The day" title="What students do" />
        <Steps items={[['Harvest', 'Cut ripened paddy by hand in the field.'], ['Thresh', 'Separate the grain from the stalk the traditional way.'], ['Winnow', 'Let the wind carry the husk away.'], ['Tour', 'Walk the orchard, meet the herd and see the trout tanks.']]} />
      </Sec>
      <Sec>
        <Split
          left={<><p className="eyebrow">Plan a visit</p><h2>Tell us about your group</h2><p className="sub">Fill this in and WhatsApp opens with your message ready.</p></>}
          right={<VisitForm />}
        />
      </Sec>
    </>
  );
}
