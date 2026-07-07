const ALLOWED_ORIGINS = [
  'https://zahadadjarif.tech',
  'http://localhost:5173',
];

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Content-Type': 'application/json',
  };

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid request' }), { status: 400, headers });
  }

  // Honeypot — real users never populate this hidden field, bots often do
  if (typeof body?.hp === 'string' && body.hp.trim()) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  const MAX = { name: 100, from: 200, body: 2000 };

  const from = typeof body?.from === 'string' ? body.from.trim() : '';
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const message = typeof body?.body === 'string' ? body.body.trim() : '';

  if (!from || !name || !message) {
    return new Response(JSON.stringify({ ok: false, error: 'missing fields' }), { status: 422, headers });
  }
  if (from.length > MAX.from || name.length > MAX.name || message.length > MAX.body) {
    return new Response(JSON.stringify({ ok: false, error: 'field too long' }), { status: 422, headers });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(from)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid email' }), { status: 422, headers });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'zahadad14@gmail.com',
        reply_to: from,
        subject: `Portfolio message from ${name}`,
        text: `From: ${name} <${from}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error', res.status, err);
      return new Response(JSON.stringify({ ok: false, error: 'send failed' }), { status: 502, headers });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err) {
    console.error('Resend request failed', err);
    return new Response(JSON.stringify({ ok: false, error: 'send failed' }), { status: 502, headers });
  }
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('Origin') || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
