import { Link } from 'react-router-dom';
import { Sec, Sh, Split, EnqBand, Crumbs } from '../components/Blocks.jsx';
import { FindUs } from '../components/FindUs.jsx';
import { SeasonPicker, Roles, GalleryGrid, FollowBand, OrderForm, Faq } from '../components/Parts.jsx';
import { D } from '../data/content.js';
import { useContent, useSite } from '../content/ContentContext.jsx';

export function Seasons() {
  const { seasonsPage: s } = useContent();
  return (
    <>
      <Sec>
        <Crumbs trail={[['Home', '/'], ['Seasons']]} />
        <h1 className="ph1">{s.title}</h1>
        <p className="lead">{s.lead}</p>
        <SeasonPicker />
      </Sec>
      <EnqBand />
    </>
  );
}

export function Careers() {
  const { careersPage: c } = useContent();
  return (
    <Sec>
      <Crumbs trail={[['Home', '/'], ['Careers']]} />
      <h1 className="ph1">{c.title}</h1>
      <p className="lead">{c.lead}</p>
      <Roles />
    </Sec>
  );
}

export function Gallery() {
  const { galleryPage: g } = useContent();
  return (
    <>
      <Sec>
        <Crumbs trail={[['Home', '/'], ['Gallery']]} />
        <h1 className="ph1">{g.title}</h1>
        <p className="lead">{g.lead}</p>
        <GalleryGrid />
      </Sec>
      <FollowBand />
    </>
  );
}

export function Contact() {
  const { contactPage: c } = useContent();
  const site = useSite();
  const handle = (u) => `@${u.split('/').filter(Boolean).pop() || ''}`;
  return (
    <>
      <Sec>
        <Split
          left={<>
            <Crumbs trail={[['Home', '/'], ['Contact']]} />
            <h1 className="ph1">{c.title}</h1>
            <p className="lead">{c.lead}</p>
            <ul className="clist">
              <li><span>WhatsApp / phone</span><a href={site.phoneTel}>{site.phoneDisplay}</a></li>
              <li><span>Email</span><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><span>Location</span><b>{site.addressLine}</b></li>
              <li><span>Instagram</span><a href={site.instagram} target="_blank" rel="noopener">{handle(site.instagram)}</a></li>
              <li><span>Facebook</span><a href={site.facebook} target="_blank" rel="noopener">{site.name}</a></li>
            </ul>
          </>}
          right={<OrderForm />}
        />
      </Sec>
      <Sec kind="tint" decos={[D('sprig', 'tr', 170, 16, 'top:10px;right:1%'), D('cherries', 'bl', 130, -8, 'bottom:10px;left:2%')]}><FindUs /></Sec>
      <Sec><Sh eyebrow={c.faqHead.eyebrow} title={c.faqHead.title} /><Faq /></Sec>
    </>
  );
}

export function NotFound() {
  const { notFound: n } = useContent();
  return (
    <Sec>
      <div className="nf">
        <p className="eyebrow">404</p>
        <h1 className="ph1">{n.title}</h1>
        <p className="lead">{n.text}</p>
        <p className="actions"><Link className="btn btn-green" to="/">Go home</Link><Link className="btn btn-ghost" to="/shop">Farm shop</Link></p>
      </div>
    </Sec>
  );
}
