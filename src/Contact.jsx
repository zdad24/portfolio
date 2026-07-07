import React, { useState } from 'react'
import { Win, WinHeading } from './Window.jsx'
import { Magnetic } from './Hero.jsx'

const LINKS = [
  { k: 'EMAIL', v: 'zahadad14@gmail.com', href: 'mailto:zahadad14@gmail.com', tag: '@' },
  { k: 'LINKEDIN', v: 'linkedin.com/in/zahadad-jarif', href: 'https://linkedin.com/in/zahadad-jarif', tag: 'in' },
  { k: 'GITHUB', v: 'github.com/zdad24', href: 'https://github.com/zdad24', tag: '</>' },
  { k: 'RESUME', v: 'zahadad-jarif-resume.pdf', href: 'https://drive.google.com/file/d/1Jcn4e-SahYHEHOJXhfstQj9ebaMcdU7v/view', tag: 'pdf' },
];

const MAX = { name: 100, from: 200, body: 2000 };

function Contact() {
  const [copied, setCopied] = useState(null);
  const [form, setForm] = useState({ name: '', from: '', body: '', hp: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  function copy(text, key) {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1400);
  }

  return (
    <Win
      title="contact.app"
      meta="composer"
      id="contact"
      status={{ left: '// reach out', right: sent ? 'message sent' : 'draft' }}
    >
      <WinHeading
        tag="▸ 05_CONTACT"
        title="say hi."
        sub="Recruiter, collaborator, fellow tinkerer — all welcome."
      />

      <div className="contact-grid">
        {/* Left — link list */}
        <div className="col gap-3">
          <div className="label" style={{ color: 'var(--accent-ink)' }}>▸ DIRECT_LINES</div>
          {LINKS.map(l => (
            <a
              key={l.k}
              href={l.href}
              target={l.href?.startsWith('http') ? '_blank' : undefined}
              rel={l.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="row center contact-link"
              style={{
                gap: 14,
                padding: '12px 14px',
                background: 'var(--cream-2)',
                border: '2px solid var(--line)',
                boxShadow: '3px 3px 0 0 var(--line)',
                textDecoration: 'none',
                color: 'var(--ink)',
              }}
              onClick={(e) => {
                if (l.k === 'EMAIL') {
                  e.preventDefault();
                  copy(l.v, l.k);
                }
              }}
            >
              <span
                className="contact-link-icon"
                style={{
                  width: 36, height: 36,
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 11,
                }}
              >
                {l.tag}
              </span>
              <div className="col" style={{ gap: 2, flex: 1 }}>
                <span className="label" style={{ fontSize: 8, color: 'var(--ink-mid)' }}>{l.k}</span>
                <span className="mono" style={{ fontSize: 13 }}>{l.v}</span>
              </div>
              <span
                key={copied === l.k ? 'copied' : 'idle'}
                className={`mono muted ${copied === l.k ? 'contact-link-copied' : ''}`}
                style={{ fontSize: 11 }}
              >
                {copied === l.k ? '✓ copied' : (l.href?.startsWith('http') ? '↗' : '⌘C')}
              </span>
            </a>
          ))}
        </div>

        {/* Right — message composer */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (form.hp) return; // honeypot — bots fill hidden fields
            const name = form.name.trim();
            const from = form.from.trim();
            const body = form.body.trim();
            if (!name || !from || !body) {
              setError('all fields are required');
              return;
            }
            setSending(true);
            setError(null);
            try {
              const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, from, body }),
              });
              const data = await res.json().catch(() => null);
              if (data?.ok) {
                setSent(true);
                setForm({ name: '', from: '', body: '', hp: '' });
                setTimeout(() => setSent(false), 5000);
              } else {
                setError(data?.error || 'something went wrong');
              }
            } catch {
              setError('network error — try emailing directly');
            } finally {
              setSending(false);
            }
          }}
          className="col gap-3"
          style={{
            background: 'var(--paper)',
            border: '2px solid var(--line)',
            boxShadow: '4px 4px 0 0 var(--line)',
            padding: 18,
          }}
        >
          <div className="row between center">
            <span className="label" style={{ color: 'var(--accent-ink)' }}>▸ NEW_MESSAGE</span>
            <span className="mono muted" style={{ fontSize: 10 }}>untitled.txt</span>
          </div>

          {/* Honeypot — hidden from sighted users and keyboard tab order, bots fill it anyway */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={form.hp}
            onChange={e => setForm({ ...form, hp: e.target.value })}
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            aria-hidden="true"
          />

          <Field name="from" type="email" autoComplete="email" label="FROM" value={form.from} onChange={v => setForm({ ...form, from: v })} placeholder="you@company.com" maxLength={MAX.from} required />
          <Field name="name" autoComplete="name" label="NAME" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Jane Recruiter" maxLength={MAX.name} required />
          <Field
            name="body"
            label="BODY"
            value={form.body}
            onChange={v => setForm({ ...form, body: v })}
            placeholder="we have an internship and you'd love it..."
            textarea
            maxLength={MAX.body}
            required
          />

          <div className="row between center" style={{ marginTop: 4 }}>
            <span className="mono muted" style={{ fontSize: 10 }} role="status" aria-live="polite">
              {sent
                ? '✓ sent — I\'ll reply soon :)'
                : error
                  ? `✗ ${error}`
                  : `${form.body.length}/${MAX.body} chars · auto-saved`}
            </span>
            <Magnetic>
              <button type="submit" className="btn btn-primary" disabled={sending || sent}>
                {sending ? '⟳ sending…' : '▸ send mail'}
              </button>
            </Magnetic>
          </div>
        </form>
      </div>

      <hr className="dashed-rule" />
      <div className="row between wrap mono muted" style={{ fontSize: 11, gap: 8 }}>
        <span>© {new Date().getFullYear()} Zahadad Jarif · built with React + Vite · deployed on Cloudflare</span>
        <span>↑↑↓↓←→←→BA</span>
      </div>
    </Win>
  );
}

function Field({ name, label, value, onChange, placeholder, textarea, type = 'text', required, autoComplete, maxLength }) {
  const id = `contact-${name}`;
  const common = {
    background: 'var(--cream-2)',
    border: '2px solid var(--line)',
    padding: '10px 12px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: 'var(--ink)',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'none',
  };
  return (
    <label className="col gap-2" htmlFor={id}>
      <span className="label" style={{ fontSize: 8, color: 'var(--ink-mid)' }}>{label}</span>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          rows={5}
          style={{ ...common, resize: 'vertical', minHeight: 96 }}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
          style={common}
        />
      )}
    </label>
  );
}

export default Contact
