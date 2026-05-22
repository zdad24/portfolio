export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const allowed = [
    'https://zahadadjarif.tech',
    'http://localhost:5173',
  ];
  const corsOrigin = allowed.includes(origin) ? origin : allowed[0];

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

  const { from, name, body: message } = body ?? {};
  if (!from || !name || !message) {
    return new Response(JSON.stringify({ ok: false, error: 'missing fields' }), { status: 422, headers });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(from)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid email' }), { status: 422, headers });
  }

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
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('Origin') || '';
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
