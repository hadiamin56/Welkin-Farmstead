// Sends the shop owner a WhatsApp alert in the background when a booking or enquiry arrives.
// Providers are chosen by environment variables; with none set, alerts are simply off (the record is still saved).
//   A) CallMeBot (free, owner-only):  CALLMEBOT_PHONE (digits, with country code) + CALLMEBOT_APIKEY
//   B) WhatsApp Cloud API (Meta):     WA_CLOUD_TOKEN + WA_PHONE_NUMBER_ID + WA_NOTIFY_TO (+ optional WA_TEMPLATE, WA_TEMPLATE_LANG)

export function alertProvider() {
  const e = process.env;
  if (e.WA_CLOUD_TOKEN && e.WA_PHONE_NUMBER_ID && e.WA_NOTIFY_TO) return 'cloud';
  if (e.CALLMEBOT_PHONE && e.CALLMEBOT_APIKEY) return 'callmebot';
  return 'off';
}

export function alertText(r) {
  const L = [];
  if (r.type === 'qurbani' && r.q) {
    L.push('*New Qurbani booking*', `${r.q.qty} x ${r.q.animal}${r.q.weight ? ` (${r.q.weight})` : ''}`);
    if (r.name) L.push(`Name: ${r.name}`);
    L.push(`Phone: ${r.q.phone}`);
    if (r.q.city) L.push(`City: ${r.q.city}`);
    if (r.q.delivery) L.push(`Delivery: ${r.q.delivery}`);
    if (r.q.date) L.push(`Preferred date: ${r.q.date}`);
  } else if (r.type === 'visit') {
    L.push('*New farm-visit request*', [r.org, r.students && `${r.students} students`, r.date].filter(Boolean).join(' · '));
    if (r.name) L.push(`Contact: ${r.name}`);
  } else {
    L.push('*New enquiry*');
    if (r.name) L.push(`Name: ${r.name}`);
    if (r.items && r.items.length) L.push(`Wants: ${r.items.join(', ')}`);
  }
  if (r.note) L.push(`Note: ${r.note}`);
  L.push('Open the admin panel > Enquiries for details.');
  return L.filter(Boolean).join('\n');
}

const withTimeout = (ms) => AbortSignal.timeout(ms);

/** Returns 'sent' | 'failed' | 'off'. Never throws. */
export async function sendAlert(rec) {
  const provider = alertProvider();
  if (provider === 'off') return 'off';
  const text = alertText(rec);
  try {
    if (provider === 'callmebot') {
      const u = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(process.env.CALLMEBOT_PHONE.replace(/\D/g, ''))}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(process.env.CALLMEBOT_APIKEY)}`;
      const r = await fetch(u, { signal: withTimeout(6000) });
      return r.ok ? 'sent' : 'failed';
    }
    const body = process.env.WA_TEMPLATE
      ? { messaging_product: 'whatsapp', to: process.env.WA_NOTIFY_TO.replace(/\D/g, ''), type: 'template', template: { name: process.env.WA_TEMPLATE, language: { code: process.env.WA_TEMPLATE_LANG || 'en' }, components: [{ type: 'body', parameters: [{ type: 'text', text: text.replace(/\n/g, ' | ').slice(0, 900) }] }] } }
      : { messaging_product: 'whatsapp', to: process.env.WA_NOTIFY_TO.replace(/\D/g, ''), type: 'text', text: { body: text } };
    const r = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(process.env.WA_PHONE_NUMBER_ID)}/messages`, {
      method: 'POST', headers: { authorization: `Bearer ${process.env.WA_CLOUD_TOKEN}`, 'content-type': 'application/json' }, body: JSON.stringify(body), signal: withTimeout(6000),
    });
    return r.ok ? 'sent' : 'failed';
  } catch { return 'failed'; }
}
