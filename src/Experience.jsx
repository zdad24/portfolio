/* global React, Win, WinHeading */

const EXPERIENCE = [
  {
    role: 'Innovation Lab Engineer Intern',
    org: '4D',
    where: 'Toronto, ON',
    when: '2025 — Present',
    tag: 'CURRENT',
    bullets: [
      'Prototyping and shipping internal AI tooling demos within 1–2 week sprint cycles.',
      'Benchmarking emerging frameworks for a 40+ person consulting team to guide engagements.',
      'Turning fuzzy client briefs into working tools, then handing off to consulting leads.',
    ],
    tech: ['Python', 'Next.js', 'Claude API', 'Vercel'],
  },
  {
    role: 'Co-Founder',
    org: 'ReRoute',
    where: 'Toronto, ON',
    when: '2025 — Present',
    tag: 'BUILDING',
    bullets: [
      "Building the GTA's first multimodal transit app combining 5 transit agencies into one optimized trip.",
      'Engineering real-time delay predictions and reroute logic on top of fragmented agency feeds.',
      'Owning product, infra, and the not-fun stuff (legal, partnerships, agency data agreements).',
    ],
    tech: ['React Native', 'FastAPI', 'PostgreSQL', 'GCP'],
  },
  {
    role: 'Software Engineer',
    org: 'One Iota Golf',
    where: 'Remote',
    when: '2024',
    tag: 'SHIPPED',
    bullets: [
      'Engineered a TypeScript pipeline generating dynamic performance baselines from 200K+ golf shots.',
      'Outputs powered recommendation engines serving 1000+ active users.',
      'Wrote the type-safe ETL layer that finally let coaches stop trusting spreadsheets.',
    ],
    tech: ['TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    role: 'Software Developer & VP Events',
    org: 'YU Blueprint',
    where: 'York University',
    when: '2024',
    tag: 'OPEN-SOURCE',
    bullets: [
      'Built a full-stack gift-card tracking dashboard for a Toronto nonprofit.',
      'Organized 5+ tech workshops driving student engagement with social-impact software.',
      'Wore two hats — engineering and getting humans into the same room.',
    ],
    tech: ['React', 'Firebase', 'Tailwind'],
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
                <div className="label" style={{ color: 'var(--accent)', marginBottom: 6 }}>
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
                      color: 'var(--accent)',
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

window.Experience = Experience;
