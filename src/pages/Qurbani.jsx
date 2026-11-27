import { useState } from 'react';
import { Sec, PageHead } from '../components/Blocks.jsx';
import { Img } from '../components/Img.jsx';
import { useContent } from '../content/ContentContext.jsx';
import { wa } from '../lib/site.js';
import { saveEnquiry } from '../lib/enquiry.js';

export default function Qurbani() {
  const { qurbaniPage: q, site } = useContent();
  const [animal, setAnimal] = useState(0);
  const [weight, setWeight] = useState('');
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(null);
  const [err, setErr] = useState('');
  const a = q.animals[animal] || q.animals[0];

  const pick = (i) => { setAnimal(i); setWeight(''); };

  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const f = e.currentTarget.elements;
    const name = f.name.value.trim();
    const phone = f.phone.value.trim();
    if (!a) return;
    if (!/^[+\d][\d\s-]{6,17}$/.test(phone)) { setErr('Please enter a valid phone number so we can reach you.'); f.phone.focus(); return; }
    setErr('');
    const d = { animal: a.name, weight, qty, phone, city: f.city.value.trim(), delivery: f.delivery ? f.delivery.value : '', date: f.date.value.trim() };
    const note = f.note.value.trim();
    setBusy(true);
    const saved = await saveEnquiry({ type: 'qurbani', name, note, q: d, hp: f.website.value });
    setBusy(false);
    const msg = [
      `Salaam ${site.name}! I'd like to book Qurbani.`,
      `Animal: ${qty} × ${a.name}${weight ? ` (${weight})` : ''}`,
      name && `Name: ${name}`, `Phone: ${phone}`, d.city && `City: ${d.city}`,
      d.delivery && `Delivery: ${d.delivery}`, d.date && `Preferred date: ${d.date}`, note && `Note: ${note}`,
      'Please confirm availability and the rate.',
    ].filter(Boolean).join('\n');
    const link = wa(msg);
    setDone({ link, saved });
    if (!saved) window.open(link, '_blank', 'noopener'); // server unreachable: hand the booking to WhatsApp so it is not lost
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <PageHead trail={[['Home', '/'], ['Livestock', '/livestock'], ['Book Qurbani']]} title={q.title} lead={q.lead} banner={q.banner} bannerAlt={q.title} />
      <Sec>
        {done ? (
          <div className="qdone" role="status">
            <h2>{q.doneTitle}</h2>
            <p>{done.saved ? q.doneText : 'We could not reach our server, so your request was opened in WhatsApp instead. Please press Send there.'}</p>
            <p className="qacts"><a className="btn btn-green" href={done.link} target="_blank" rel="noopener">Chat with us on WhatsApp</a> <button type="button" className="btn btn-ghost" onClick={() => setDone(null)}>Book another</button></p>
          </div>
        ) : (
          <form className="form qform" onSubmit={submit}>
            <h2 className="vh">Booking form</h2>
            <fieldset>
              <legend><b className="qn">1</b> {q.animalsHead}</legend>
              <div className="qpick" role="radiogroup" aria-label={q.animalsHead}>
                {q.animals.map((x, i) => (
                  <label key={x.name + i} className={`qcard${i === animal ? ' on' : ''}`}>
                    <input type="radio" name="animal" checked={i === animal} onChange={() => pick(i)} />
                    <Img file={x.image} alt="" sizes="(min-width:980px) 300px, 50vw" />
                    <span className="qt"><b>{x.name}</b><small>{x.text}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>

            {a && a.weights.length > 0 && (
              <fieldset>
                <legend><b className="qn">2</b> {q.weightHead}</legend>
                <div className="opts">
                  {a.weights.map((w) => (
                    <label className="opt" key={w}><input type="radio" name="weight" value={w} checked={weight === w} onChange={() => setWeight(w)} /><span>{w}</span></label>
                  ))}
                </div>
                <div className="qqty">
                  <span>How many?</span>
                  <button type="button" aria-label="Fewer" onClick={() => setQty((n) => Math.max(1, n - 1))}>−</button>
                  <output aria-live="polite">{qty}</output>
                  <button type="button" aria-label="More" onClick={() => setQty((n) => Math.min(20, n + 1))}>+</button>
                </div>
              </fieldset>
            )}

            <fieldset>
              <legend><b className="qn">3</b> {q.detailsHead}</legend>
              <div className="qgrid">
                <label className="fld"><span>Your name</span><input name="name" type="text" autoComplete="name" placeholder="Your name" /></label>
                <label className="fld"><span>Phone number *</span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" required placeholder="e.g. 70069 01374" /></label>
                <label className="fld"><span>City / area</span><input name="city" type="text" autoComplete="address-level2" placeholder="e.g. Srinagar" /></label>
                {q.deliveries.length > 0 && (
                  <label className="fld"><span>Delivery</span><select name="delivery" defaultValue={q.deliveries[0]}>{q.deliveries.map((d) => <option key={d}>{d}</option>)}</select></label>
                )}
                <label className="fld"><span>Preferred date</span><input name="date" type="text" placeholder="e.g. 2 days before Eid" /></label>
              </div>
              <label className="fld"><span>Anything else? (budget, special request)</span><textarea name="note" rows={3} /></label>
            </fieldset>

            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
            {err && <p className="qerr" role="alert">{err}</p>}
            <p className="qnote">{q.note}</p>
            <button className="btn btn-green wide" type="submit" disabled={busy}>{busy ? 'Sending…' : q.button}</button>
          </form>
        )}
      </Sec>
    </>
  );
}
