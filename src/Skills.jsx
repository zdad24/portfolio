import React from 'react'
import { Win, WinHeading } from './Window.jsx'

/* ============================================================
   Skills — theme-aware cards. Same data, three visual treatments.
   ============================================================ */

const LANGS = [
  { name: 'Python',     short: 'PY',  hp: 92, poke: { type: 'SERPENT',  hue: 'var(--poke-green)', moves: ['Quick.Script', 'Async.Coil'] },
    ball: { pos: 'PG',  jersey: 7, line: 'Playmaker · sets up everything' }, neutral: 'Daily driver — scripting, ML, FastAPI' },
  { name: 'JavaScript', short: 'JS',  hp: 88, poke: { type: 'ELECTRIC', hue: 'var(--poke-yellow)', moves: ['Event.Loop', 'Promise.All']  },
    ball: { pos: 'SG',  jersey: 23, line: 'Sharpshooter · runs the web' }, neutral: 'Frontend + Node services' },
  { name: 'TypeScript', short: 'TS',  hp: 90, poke: { type: 'METAL',    hue: 'var(--poke-blue)', moves: ['Strict.Mode', 'Infer.Beam']    },
    ball: { pos: 'SF',  jersey: 33, line: 'Two-way · types + speed' }, neutral: 'Default for anything production' },
  { name: 'Java',       short: 'JV',  hp: 78, poke: { type: 'BREW',     hue: '#b67a35', moves: ['NullPointerException', 'GC.Cycle']    },
    ball: { pos: 'PF',  jersey: 32, line: 'Workhorse · OOP backbone' }, neutral: 'OOP foundation, coursework, Android' },
  { name: 'C / C++',    short: 'C',   hp: 72, poke: { type: 'SYSTEMS',  hue: '#a0414a', moves: ['Manual.Memory', 'Pointer.Strike']  },
    ball: { pos: 'C',   jersey: 50, line: 'Big man · raw performance' }, neutral: 'Systems courses, perf-critical paths' },
  { name: 'SQL',        short: 'SQL', hp: 82, poke: { type: 'DATA',     hue: '#2f7a6a', moves: ['Inner.Join', 'CTE.Bind']           },
    ball: { pos: '6th', jersey: 6, line: 'Sixth man · clutch every game' }, neutral: 'Postgres / MySQL / pgvector' },
];

const MORE_LANGS = ['Java', 'C#', 'Assembly', 'HTML5 / CSS3', 'Bash'];

const FRAMEWORKS = [
  'React', 'Next.js', 'Node.js', 'Express.js', 'FastAPI',
  'Firebase', 'MongoDB', 'MySQL', 'PostgreSQL', 'Supabase',
];

const TOOLS = [
  'Docker', 'Kubernetes', 'Git', 'GitHub Actions', 'CI/CD',
  'Google Cloud', 'Vercel', 'Cloudflare', 'Unix/Linux',
  'Claude Code', 'Cursor', 'Ollama', 'Figma', 'Jira', 'Postman',
];

/* ─────────────  Per-theme card renderers  ────────────── */

function PokeCard({ lang }) {
  const t = lang.poke;
  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '2px solid var(--line)',
        boxShadow: '4px 4px 0 0 var(--line)',
        padding: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header bar — name + HP */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '2px solid var(--line)',
          background: t.hue,
          color: 'var(--paper)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="pixel-sm" style={{ fontSize: 22, lineHeight: 1 }}>{lang.name}</span>
        <span className="label-md" style={{ fontSize: 9 }}>HP {lang.hp}</span>
      </div>

      {/* Sprite well */}
      <div
        style={{
          height: 96,
          background: `repeating-linear-gradient(45deg,
            transparent 0 8px,
            color-mix(in srgb, ${t.hue} 18%, transparent) 8px 16px),
            var(--cream-2)`,
          borderBottom: '2px solid var(--line)',
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
        }}
      >
        {/* big glyph */}
        <div
          className="pixel-lg"
          style={{
            fontSize: 70,
            color: t.hue,
            textShadow: '3px 3px 0 var(--ink)',
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          {lang.short}
        </div>
        <span
          className="label"
          style={{
            position: 'absolute',
            top: 8, right: 10,
            background: 'var(--ink)',
            color: 'var(--paper)',
            padding: '3px 6px',
            fontSize: 8,
          }}
        >
          TYPE · {t.type}
        </span>
      </div>

      {/* Moves */}
      <div style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
        {t.moves.map((m, i) => (
          <div key={i} className="row between" style={{ padding: '3px 0', borderBottom: i === 0 ? '1px dashed var(--ink-mid)' : 'none' }}>
            <span>► {m}</span>
            <span className="muted">{lang.hp - i * 12}</span>
          </div>
        ))}
      </div>

      {/* Stat bar */}
      <div style={{ padding: '0 12px 10px' }}>
        <div className="row between" style={{ marginBottom: 4 }}>
          <span className="label" style={{ fontSize: 7, color: 'var(--ink-mid)' }}>EXP</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mid)' }}>{lang.hp}/100</span>
        </div>
        <div style={{ height: 6, background: 'var(--cream-deep)', border: '1.5px solid var(--line)' }}>
          <div style={{ height: '100%', width: `${lang.hp}%`, background: t.hue }}/>
        </div>
      </div>
    </div>
  );
}

function BallCard({ lang }) {
  const b = lang.ball;
  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '2px solid var(--line)',
        boxShadow: '4px 4px 0 0 var(--line)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Position banner */}
      <div
        style={{
          background: 'var(--ball-navy)',
          color: 'var(--paper)',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid var(--line)',
        }}
      >
        <span className="label-md" style={{ fontSize: 10 }}>
          POS · {b.pos}
        </span>
        <span className="label" style={{ fontSize: 8, color: 'var(--ball-orange)' }}>STARTING_5</span>
      </div>

      {/* Jersey block */}
      <div
        style={{
          background: 'var(--ball-orange)',
          padding: '14px 14px 12px',
          borderBottom: '2px solid var(--line)',
          position: 'relative',
        }}
      >
        {/* faux court stripes */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent 0 6px, rgba(0,0,0,0.06) 6px 7px)',
        }}/>
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '64px minmax(0, 1fr)',
            gap: 14,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: 'var(--paper)',
              border: '2px solid var(--ink)',
              boxShadow: '2px 2px 0 0 var(--ink)',
              padding: '4px 0',
              display: 'grid',
              placeItems: 'center',
              minHeight: 64,
            }}
          >
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 22,
              color: 'var(--ink)',
              lineHeight: 1,
            }}>
              {b.jersey}
            </div>
          </div>
          <div className="col" style={{ minWidth: 0, color: 'var(--paper)' }}>
            <span
              className="pixel-sm"
              style={{
                fontSize: 22,
                lineHeight: 1.05,
                overflowWrap: 'break-word',
              }}
            >
              {lang.name}
            </span>
            <span className="label" style={{ fontSize: 8, opacity: 0.85, marginTop: 8 }}>
              EST. {2020 + Math.floor(lang.hp/12)}
            </span>
          </div>
        </div>
      </div>

      {/* Stat line */}
      <div style={{ padding: '12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
        <p style={{ margin: '0 0 10px', color: 'var(--ink-soft)' }}>
          ► {b.line}
        </p>
        <div className="row between" style={{ gap: 8, fontSize: 11, color: 'var(--ink-mid)', borderTop: '1px dashed var(--ink-mid)', paddingTop: 8 }}>
          <span>PPG <strong style={{ color: 'var(--ink)' }}>{(lang.hp / 4).toFixed(1)}</strong></span>
          <span>AST <strong style={{ color: 'var(--ink)' }}>{(lang.hp / 9).toFixed(1)}</strong></span>
          <span>REB <strong style={{ color: 'var(--ink)' }}>{(lang.hp / 11).toFixed(1)}</strong></span>
          <span>FG% <strong style={{ color: 'var(--ink)' }}>{lang.hp - 30}</strong></span>
        </div>
      </div>
    </div>
  );
}

function NeutralCard({ lang }) {
  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '2px solid var(--line)',
        boxShadow: '4px 4px 0 0 var(--line)',
        padding: 16,
      }}
    >
      <div className="row between center" style={{ marginBottom: 10 }}>
        <span className="pixel-sm" style={{ fontSize: 22 }}>{lang.name}</span>
        <span className="chip chip-solid">{lang.short}</span>
      </div>
      <p className="mono" style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--ink-soft)' }}>
        ► {lang.neutral}
      </p>
      <div className="row between" style={{ marginBottom: 4 }}>
        <span className="label" style={{ fontSize: 8, color: 'var(--ink-mid)' }}>PROFICIENCY</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mid)' }}>{lang.hp}%</span>
      </div>
      <div className="row" style={{ gap: 2 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: 10,
              background: i < Math.round(lang.hp / 5) ? 'var(--accent)' : 'var(--cream-deep)',
              border: '1px solid var(--line)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ChipGrid({ items, title, sub }) {
  return (
    <div className="col gap-3" style={{ marginTop: 28 }}>
      <div className="row between center">
        <div>
          <div className="label" style={{ color: 'var(--accent)' }}>▸ {title}</div>
          {sub && <div className="mono muted" style={{ fontSize: 11, marginTop: 4 }}>{sub}</div>}
        </div>
        <span className="mono muted" style={{ fontSize: 11 }}>{items.length} items</span>
      </div>
      <div className="row wrap" style={{ gap: 8 }}>
        {items.map(it => <span className="chip" key={it}>{it}</span>)}
      </div>
    </div>
  );
}

function Skills({ theme }) {
  const Card = theme === 'pokemon' ? PokeCard : theme === 'basketball' ? BallCard : NeutralCard;
  const title =
    theme === 'pokemon'    ? 'devdex — every language, every type.' :
    theme === 'basketball' ? 'starting five.' :
                             'tech stack.';
  const sub =
    theme === 'pokemon'    ? 'every language is a creature in the dex. hover any card.' :
    theme === 'basketball' ? 'positions, jerseys, season stats.' :
                             'languages, frameworks, and the tools I reach for.';

  return (
    <Win
      title={
        theme === 'pokemon'    ? 'devdex.exe' :
        theme === 'basketball' ? 'roster.csv' :
                                 'skills.json'
      }
      meta={`theme: ${theme}`}
      id="skills"
      status={{ left: '// the stack', right: `${LANGS.length + FRAMEWORKS.length + TOOLS.length} entries` }}
    >
      <WinHeading
        tag={
          theme === 'pokemon'    ? '▸ 03_DEVDEX' :
          theme === 'basketball' ? '▸ 03_ROSTER' :
                                   '▸ 03_SKILLS'
        }
        title={title}
        sub={sub}
      />

      {/* Featured language cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
        }}
      >
        {LANGS.map(l => <Card key={l.name} lang={l}/>)}
      </div>

      <ChipGrid title="ALSO_LANGUAGES" sub="coursework + adjacent fluency" items={MORE_LANGS}/>
      <ChipGrid title="FRAMEWORKS_+_LIBRARIES" items={FRAMEWORKS}/>
      <ChipGrid title="DEVELOPER_TOOLS" items={TOOLS}/>
    </Win>
  );
}

export default Skills
