/** Records an enquiry for the admin inbox. Fire-and-forget: it never delays or blocks the WhatsApp hand-off. */
export function logEnquiry(payload) {
  try {
    fetch('/api/enquiry', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, page: window.location.pathname }), keepalive: true,
    }).catch(() => {});
  } catch { /* offline: ignore */ }
}
