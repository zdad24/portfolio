import React, { useRef } from 'react'
import { Win, WinHeading } from './Window.jsx'

/* ============================================================
   Tilt card — 3D tilt on hover
   ============================================================ */
function TiltCard({ children, max = 8, className = '', style = {} }) {
  const ref = useRef(null);

  function onMove(e) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateY(-3px)`;
    const sheen = el.querySelector('.sheen');
    if (sheen) {
      sheen.style.background = `radial-gradient(400px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.18), transparent 50%)`;
    }
  }
  function onLeave() {
    const el = ref.current; if (!el) return;
    el.style.transform = '';
    const sheen = el.querySelector('.sheen');
    if (sheen) sheen.style.background = '';
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
    >
      {children}
      <div
        className="sheen"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay' }}
      />
    </div>
  );
}

const PROJECTS = [
  {
    name: 'EchoAccess',
    file: 'echoaccess.tsx',
    blurb: 'Voice-first accessibility platform that converts Canadian government forms into guided voice conversations for blind / low-vision users.',
    impact: 'Built end-to-end in 72hrs · Hackathon winner',
    tech: ['Next.js', 'OpenAI', 'TypeScript', 'Tailwind', 'Vercel'],
    github: '#',
    demo: '#',
    comingSoon: true,
    art: 'voice',
  },
  {
    name: 'MemoMuse',
    file: 'memomuse.py',
    blurb: 'Music creation platform that transforms voice memos into produced tracks via a 6-stage async AI pipeline (transcribe → analyze → arrange → generate → master → render).',
    impact: '6-stage AI pipeline · async queue · sub-30s render',
    tech: ['FastAPI', 'Python', 'Redis', 'PostgreSQL', 'Docker'],
    github: '#',
    demo: '#',
    comingSoon: true,
    art: 'music',
  },
  {
    name: 'RAG API',
    file: 'rag-api.go',
    blurb: 'Containerized, Kubernetes-deployed retrieval-augmented generation API enabling context-aware Q&A over custom doc collections with sub-2s response times.',
    impact: 'Sub-2s p95 · K8s-native · multi-tenant',
    tech: ['Kubernetes', 'Docker', 'FastAPI', 'pgvector', 'GCP'],
    github: '#',
    demo: '#',
    comingSoon: true,
    art: 'rag',
  },
  {
    name: 'ReRoute',
    file: 'reroute.tsx',
    blurb: "The GTA's first multimodal transit app combining driving, bus, and subway across 5 transit agencies into single optimized trips with real-time delay predictions.",
    impact: '5 agencies · XGBoost delay model · live in GTA',
    tech: ['Next.js', 'FastAPI', 'XGBoost', 'Python', 'GCP'],
    github: null,
    demo: 'https://rerouteapp.ca',
    comingSoon: false,
    art: 'reroute',
  },
];

function ProjectArt({ kind }) {
  // Original, simple pixel-art-style placeholders per project. Stripes + 1-2 shapes max.
  const common = { width: '100%', height: '100%', shapeRendering: 'crispEdges' };
  if (kind === 'voice') {
    return (
      <svg viewBox="0 0 200 100" {...common}>
        <defs>
          <pattern id="stripeV" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="var(--cream-2)"/>
            <rect width="4" height="8" fill="var(--cream-deep)"/>
          </pattern>
        </defs>
        <rect width="200" height="100" fill="url(#stripeV)"/>
        {/* waveform */}
        <g fill="var(--accent)">
          {[10,18,32,12,40,22,50,16,46,28,38,18,30,14,22,36,28].map((h, i) => (
            <rect key={i} x={30 + i * 8} y={50 - h / 2} width="5" height={h}/>
          ))}
        </g>
        <rect x="30" y="20" width="140" height="60" fill="none" stroke="var(--ink)" strokeWidth="2"/>
      </svg>
    );
  }
  if (kind === 'music') {
    return (
      <svg viewBox="0 0 200 100" {...common}>
        <rect width="200" height="100" fill="var(--cream-2)"/>
        {/* tape reels */}
        <g stroke="var(--ink)" strokeWidth="2" fill="var(--paper)">
          <circle cx="60" cy="50" r="22"/>
          <circle cx="140" cy="50" r="22"/>
          <circle cx="60" cy="50" r="6" fill="var(--ink)"/>
          <circle cx="140" cy="50" r="6" fill="var(--ink)"/>
        </g>
        <rect x="50" y="46" width="100" height="8" fill="var(--ink)"/>
        <g fill="var(--accent)">
          <rect x="58" y="48" width="4" height="4"/>
          <rect x="138" y="48" width="4" height="4"/>
        </g>
        {/* level meters */}
        <g fill="var(--ink-mid)">
          {[14,18,22,26,30,34,38].map((y, i) => (
            <rect key={i} x="14" y={y} width="20" height="2"/>
          ))}
        </g>
      </svg>
    );
  }
  // reroute — transit network map
  if (kind === 'reroute') {
    return (
      <svg viewBox="0 0 200 100" {...common}>
        <rect width="200" height="100" fill="var(--cream-2)"/>
        {/* map grid lines */}
        <g stroke="var(--ink-mid)" strokeWidth="0.5" opacity="0.4">
          {[20,40,60,80].map(y => <line key={y} x1="0" y1={y} x2="200" y2={y}/>)}
          {[40,80,120,160].map(x => <line key={x} x1={x} y1="0" x2={x} y2="100"/>)}
        </g>
        {/* transit routes */}
        <polyline points="10,75 40,75 60,50 100,50 140,30 180,30" fill="none" stroke="var(--accent)" strokeWidth="3"/>
        <polyline points="10,85 60,85 80,60 120,60 160,40 190,40" fill="none" stroke="var(--accent-3)" strokeWidth="3"/>
        <polyline points="30,90 50,70 90,70 130,50 170,50 190,55" fill="none" stroke="var(--accent-2)" strokeWidth="3"/>
        {/* stops */}
        <g fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5">
          {[[40,75],[100,50],[140,30],[60,85],[120,60],[50,70],[130,50]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="4"/>
          ))}
        </g>
        {/* "GTA" label */}
        <rect x="76" y="8" width="48" height="14" fill="var(--ink)"/>
        <text x="100" y="19" fontFamily="'Press Start 2P',monospace" fontSize="6" fill="var(--paper)" textAnchor="middle">GTA</text>
      </svg>
    );
  }
  // rag
  return (
    <svg viewBox="0 0 200 100" {...common}>
      <rect width="200" height="100" fill="var(--cream-2)"/>
      {/* nodes & connections */}
      <g stroke="var(--ink)" strokeWidth="2" fill="var(--paper)">
        <rect x="20" y="20" width="40" height="22"/>
        <rect x="20" y="58" width="40" height="22"/>
        <rect x="80" y="40" width="42" height="20" fill="var(--accent)"/>
        <rect x="142" y="20" width="40" height="22"/>
        <rect x="142" y="58" width="40" height="22"/>
        <line x1="60" y1="31" x2="80" y2="48"/>
        <line x1="60" y1="69" x2="80" y2="52"/>
        <line x1="122" y1="50" x2="142" y2="31"/>
        <line x1="122" y1="50" x2="142" y2="69"/>
      </g>
      <g fontFamily="'Press Start 2P', monospace" fontSize="6" fill="var(--ink)">
        <text x="40" y="34" textAnchor="middle">DOC</text>
        <text x="40" y="72" textAnchor="middle">DOC</text>
        <text x="101" y="53" textAnchor="middle" fill="var(--paper)">RAG</text>
        <text x="162" y="34" textAnchor="middle">ANS</text>
        <text x="162" y="72" textAnchor="middle">CITE</text>
      </g>
    </svg>
  );
}

function Projects() {
  return (
    <Win
      title="projects/"
      meta={`${PROJECTS.length} items · sorted by impact`}
      id="projects"
      status={{ left: '// shipping things', right: `${PROJECTS.length} items` }}
    >
      <WinHeading
        tag="▸ 01_PROJECTS"
        title="things I've shipped."
        sub="A sampler. Tilt the cards. Click through for source + live demos."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 22,
        }}
      >
        {PROJECTS.map((p, i) => (
          <TiltCard
            key={p.name}
            style={{
              background: 'var(--paper)',
              border: '2px solid var(--line)',
              boxShadow: '5px 5px 0 0 var(--line)',
              padding: 0,
              position: 'relative',
              transition: 'transform 0.18s ease',
            }}
          >
            {/* mini "browser" bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                background: 'var(--cream-2)',
                borderBottom: '2px solid var(--line)',
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span style={{ display: 'flex', gap: 4 }}>
                <span style={dot('#ff5f57')}/><span style={dot('#febc2e')}/><span style={dot('#28c840')}/>
              </span>
              <span className="muted" style={{ flex: 1, textAlign: 'center' }}>{p.file}</span>
              <span className="muted">#{String(i + 1).padStart(2, '0')}</span>
            </div>
            {/* art */}
            <div style={{ height: 130, borderBottom: '2px solid var(--line)' }}>
              <ProjectArt kind={p.art}/>
            </div>
            {/* body */}
            <div style={{ padding: 18 }}>
              <div className="row between center" style={{ marginBottom: 8 }}>
                <h3 className="pixel-sm" style={{ margin: 0, lineHeight: 1, letterSpacing: 0.5 }}>
                  {p.name}
                </h3>
                <span className="label" style={{ color: 'var(--accent)' }}>OPEN</span>
              </div>
              <p className="mono" style={{ margin: '0 0 12px', fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink-soft)' }}>
                {p.blurb}
              </p>
              <div className="label muted" style={{ marginBottom: 10, fontSize: 8 }}>
                ▸ {p.impact}
              </div>
              <div className="row wrap" style={{ gap: 6, marginBottom: 14 }}>
                {p.tech.map(t => <span className="chip" key={t}>{t}</span>)}
              </div>
              <div className="row gap-3">
                {p.github ? (
                  <a className="btn" href={p.github}>
                    <span style={{ fontFamily: "'JetBrains Mono'" }}>{'</>'}</span> source
                  </a>
                ) : null}
                {p.comingSoon ? (
                  <span className="btn" style={{ opacity: 0.45, cursor: 'default', pointerEvents: 'none' }}>
                    🔒 coming soon
                  </span>
                ) : (
                  <a className="btn btn-primary" href={p.demo} target="_blank" rel="noopener noreferrer">
                    ▸ live demo
                  </a>
                )}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </Win>
  );
}

function dot(c) {
  return { width: 10, height: 10, borderRadius: 50, background: c, display: 'inline-block', border: '1px solid rgba(0,0,0,0.15)' };
}

export default Projects
