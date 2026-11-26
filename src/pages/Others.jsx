import { Link } from 'react-router-dom';
import { Sec, Sh, Split, EnqBand, Crumbs } from '../components/Blocks.jsx';
import { FindUs } from '../components/FindUs.jsx';
import { SeasonPicker, Roles, GalleryGrid, FollowBand, OrderForm, Faq } from '../components/Parts.jsx';
import { D } from '../data/content.js';
import { PHONE_TEL, EMAIL, INSTAGRAM, FACEBOOK } from '../lib/site.js';

export function Seasons() {
  return (
    <>
      <Sec>
        <Crumbs trail={[['Home', '/'], ['Seasons']]} />
        <h1 className="ph1">What's good right now</h1>
        <p className="lead">Choose a month to see what the valley is offering. Timings are typical for Kashmir and move with the weather — message us for exact availability.</p>
        <SeasonPicker />
      </Sec>
      <EnqBand />
    </>
  );
}

export function Careers() {
  return (
    <Sec>
      <Crumbs trail={[['Home', '/'], ['Careers']]} />
      <h1 className="ph1">Join the Welkin team</h1>
      <p className="lead">We're growing. Welkin Farmstead is hiring across farm operations, sales, logistics, maintenance and supervision. Pick a role and apply on WhatsApp.</p>
      <Roles />
    </Sec>
  );
}

export function Gallery() {
  return (
    <>
      <Sec>
        <Crumbs trail={[['Home', '/'], ['Gallery']]} />
        <h1 className="ph1">Life at Welkin</h1>
        <p className="lead">Orchards, harvests, trout tanks, flocks and student days. Tap a photo to view it full size.</p>
        <GalleryGrid />
      </Sec>
      <FollowBand />
    </>
  );
}

export function Contact() {
  return (
    <>
      <Sec>
        <Split
          left={<>
            <Crumbs trail={[['Home', '/'], ['Contact']]} />
            <h1 className="ph1">Order or enquire</h1>
            <p className="lead">Choose what you're after and send. WhatsApp opens with your message ready.</p>
            <ul className="clist">
              <li><span>WhatsApp / phone</span><a href={PHONE_TEL}>70069 01374</a></li>
              <li><span>Email</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><span>Location</span><b>Sopore, Kashmir 193201</b></li>
              <li><span>Instagram</span><a href={INSTAGRAM} target="_blank" rel="noopener">@welkinfarmstead</a></li>
              <li><span>Facebook</span><a href={FACEBOOK} target="_blank" rel="noopener">Welkin Farmstead</a></li>
            </ul>
          </>}
          right={<OrderForm />}
        />
      </Sec>
      <Sec kind="tint" decos={[D('sprig', 'tr', 170, 16, 'top:10px;right:1%'), D('cherries', 'bl', 130, -8, 'bottom:10px;left:2%')]}><FindUs /></Sec>
      <Sec><Sh eyebrow="FAQ" title="Good to know" /><Faq /></Sec>
    </>
  );
}

export function NotFound() {
  return (
    <Sec>
      <div className="nf">
        <p className="eyebrow">404</p>
        <h1 className="ph1">This page wandered off.</h1>
        <p className="lead">The page you're looking for isn't here. Let's get you back to the farm.</p>
        <p className="actions"><Link className="btn btn-green" to="/">Go home</Link><Link className="btn btn-ghost" to="/shop">Farm shop</Link></p>
      </div>
    </Sec>
  );
}
