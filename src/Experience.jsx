import React from 'react'
import { Win, WinHeading } from './Window.jsx'

const EXPERIENCE = [
  {
    role: 'Innovation Lab Engineer Intern',
    org: '4D',
    where: 'Toronto, ON',
    when: 'May 2026 — Aug 2026',
    tag: 'CURRENT',
    bullets: [
      'Built an AI recruiting platform screening 500+ candidates per role — saved the hiring team 10+ hrs/week.',
      'Replaced deterministic scoring with LLM-judged per-criterion verdicts, returning structured evidence per candidate.',
      'Architected an async Celery + ElasticMQ pipeline that cuts full 500-candidate rescores to under 10 minutes.',
    ],
    tech: ['Next.js', 'FastAPI', 'Celery', 'ElasticMQ', 'OpenAI', 'MongoDB', 'Azure'],
  },
  {
    role: 'Co-Founder',
    org: 'ReRoute',
    where: 'Toronto, ON',
    when: 'Feb 2026 — Present',
    tag: 'BUILDING',
    bullets: [
      "Built the GTA's first multimodal transit router across 5 agencies using modified A* over a unified GTFS graph.",
      'Trained an XGBoost model on TTC + GO delay data to surface real-time reroutes in the Next.js client.',
      'Demoed to 400+ attendees at Shopify Builder Sunday · placed 2nd at CTRL HACK DEL 2.0.',
    ],
    tech: ['FastAPI', 'Next.js', 'XGBoost', 'PostgreSQL', 'GTFS'],
  },
  {
    role: 'Software Engineer',
    org: 'One Iota Golf',
    where: 'Remote',
    when: 'Jan 2026 — Mar 2026',
    tag: 'SHIPPED',
    bullets: [
      'Engineered a TypeScript algorithm computing dynamic performance baselines over 200,000+ shots in MySQL.',
      'Built data pipelines applying statistical significance testing to power dashboards served to 1,000+ active users.',
    ],
    tech: ['TypeScript', 'GCP MySQL', 'Docker'],
  },
  {
    role: 'Software Developer & VP Events',
    org: 'YU Blueprint',
    where: 'York University',
    when: 'Jan 2026 — Present',
    tag: 'OPEN-SOURCE',
    bullets: [
      'Built a full-stack gift-card dashboard for a Toronto nonprofit automating balance tracking across 50+ brands.',
      'Organized and led 5+ tech workshops and networking events, growing attendance by 60%.',
    ],
    tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
  },
];

function Experience() {
  return (
    <Win
      title="experience.log"
      meta={`${EXPERIENCE.length} entries · most recent first`}
      id="experience"
      status={{ left: '// where I\'ve been', right: 'tail -f' }}
    >
      <WinHeading
        tag="▸ 02_EXPERIENCE"
        title="receipts."
        sub="Roles where I've shipped things people actually depend on."
      />

      <div
        style={{
          position: 'relative',
          paddingLeft: 28,
        }}
      >
        {/* Vertical timeline rail */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 7,
            top: 8,
            bottom: 8,
            width: 2,
            background: 'repeating-linear-gradient(to bottom, var(--ink) 0 6px, transparent 6px 12px)',
          }}
        />

        {EXPERIENCE.map((e, i) => (
          <article
            key={i}
            style={{
              position: 'relative',
              marginBottom: 28,
              background: 'var(--cream-2)',
              border: '2px solid var(--line)',
              boxShadow: '4px 4px 0 0 var(--line)',
              padding: 20,
            }}
          >
            {/* Node */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: -27,
                top: 22,
                width: 16,
                height: 16,
                background: 'var(--accent)',
                border: '2px solid var(--line)',
              }}
            />

            <header
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                gap: 16,
                alignItems: 'start',
                marginBottom: 14,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div className="label" style={{ color: 'var(--accent-ink)', marginBottom: 6 }}>
                  ▸ {e.tag}
                </div>
                <h3
                  className="pixel-sm"
                  style={{
                    margin: 0,
                    lineHeight: 1.1,
                    overflowWrap: 'break-word',
                  }}
                >
                  {e.role} <span style={{ color: 'var(--ink-mid)' }}>@</span> {e.org}
                </h3>
                <div className="mono muted" style={{ marginTop: 8, fontSize: 12 }}>
                  {e.where} · {e.when}
                </div>
              </div>
              <span className="chip chip-solid" style={{ whiteSpace: 'nowrap', marginTop: 4 }}>{e.when.split(' — ')[0]}</span>
            </header>

            <ul className="mono" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {e.bullets.map((b, j) => (
                <li
                  key={j}
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    paddingLeft: 22,
                    position: 'relative',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      color: 'var(--accent-ink)',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 8,
                    }}
                  >
                    ►
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="row wrap" style={{ gap: 6, marginTop: 14 }}>
              {e.tech.map(t => <span className="chip" key={t}>{t}</span>)}
            </div>
          </article>
        ))}
      </div>
    </Win>
  );
}

export default Experience
