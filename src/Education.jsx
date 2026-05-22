import React from 'react'
import { Win, WinHeading } from './Window.jsx'

function Education() {
  return (
    <Win
      title="education.txt"
      meta="2 records"
      id="education"
      status={{ left: '// study + credentials', right: 'EOF' }}
    >
      <WinHeading
        tag="▸ 04_EDUCATION"
        title="school & papers."
      />

      <div className="edu-grid">
        {/* Education card */}
        <article
          style={{
            background: 'var(--cream-2)',
            border: '2px solid var(--line)',
            boxShadow: '4px 4px 0 0 var(--line)',
            padding: 20,
            position: 'relative',
          }}
        >
          <div className="label" style={{ color: 'var(--accent)' }}>▸ DEGREE</div>
          <h3 className="pixel-sm" style={{ margin: '8px 0 4px', fontSize: 24 }}>
            York University
          </h3>
          <div className="mono" style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 14 }}>
            Lassonde School of Engineering · Toronto, ON<br/>
            B.Sc. Hons. Computer Science (Co-op) · exp. May 2028
          </div>

          <div className="col gap-2 mono" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
            <Line k="GPA"        v="3.70 / 4.00"/>
            <Line k="FOCUS"      v="Systems, AI, distributed computing"/>
            <Line k="COURSEWORK" v="Data Structures & Algorithms · Advanced OOP · Computer Organization · Software Tools · Theory of Computation"/>
          </div>

          {/* faux ID barcode */}
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px dashed var(--ink-mid)', paddingTop: 12 }}>
            <Barcode/>
            <span className="mono muted" style={{ fontSize: 10 }}>YORK-CS-2028-ZJ</span>
          </div>
        </article>

        {/* Certifications card */}
        <article
          style={{
            background: 'var(--paper)',
            border: '2px solid var(--line)',
            boxShadow: '4px 4px 0 0 var(--line)',
            padding: 20,
          }}
        >
          <div className="label" style={{ color: 'var(--accent)' }}>▸ CERTIFICATIONS</div>
          <h3 className="pixel-sm" style={{ margin: '8px 0 14px', fontSize: 24 }}>
            Stamped & shipped.
          </h3>

          <Stamp
            title="Responsive Web Design"
            org="freeCodeCamp"
            year="2026"
            hours="300 hrs"
          />
          <Stamp
            title="JavaScript Algorithms & Data Structures"
            org="freeCodeCamp"
            year="2026"
            hours="300 hrs"
          />

          <div className="mono muted" style={{ fontSize: 11, marginTop: 12 }}>
            ▌ always learning — next up: AWS Solutions Architect.
          </div>
        </article>
      </div>
    </Win>
  );
}

function Line({ k, v }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8, alignItems: 'baseline' }}>
      <span className="label" style={{ fontSize: 8, color: 'var(--ink-mid)' }}>{k}</span>
      <span>{v}</span>
    </div>
  );
}

function Stamp({ title, org, year, hours }) {
  return (
    <div
      style={{
        border: '2px dashed var(--ink-mid)',
        padding: 12,
        marginBottom: 10,
        position: 'relative',
        background: 'color-mix(in srgb, var(--cream-2) 50%, transparent)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: -10, right: 10,
          background: 'var(--accent)',
          color: 'var(--paper)',
          padding: '2px 8px',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          letterSpacing: 1,
          border: '1.5px solid var(--line)',
        }}
      >
        ✓ {year}
      </span>
      <div className="pixel-sm" style={{ fontSize: 18, margin: 0, lineHeight: 1.1 }}>{title}</div>
      <div className="mono muted" style={{ fontSize: 11, marginTop: 6 }}>
        {org} · {hours}
      </div>
    </div>
  );
}

function Barcode() {
  const widths = [3,1,2,1,3,2,1,1,3,1,2,1,2,3,1,2,1,3,2,1,3,1,2,1];
  let x = 0;
  return (
    <svg width="120" height="28" viewBox="0 0 120 28" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="120" height="28" fill="var(--paper)"/>
      {widths.map((w, i) => {
        const b = i % 2 === 0;
        const r = <rect key={i} x={x} y="2" width={w} height="24" fill={b ? 'var(--ink)' : 'transparent'}/>;
        x += w + 1;
        return r;
      })}
    </svg>
  );
}

export default Education
