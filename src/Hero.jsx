import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Win } from './Window.jsx'
import portraitUrl from './portrait.webp'

/* ============================================================
   Magnetic button — follows cursor within a radius
   ============================================================ */
function Magnetic({ children, strength = 0.35, className = '', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = null;
    let lastX = 0, lastY = 0;
    function onMove(e) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const r = el.getBoundingClientRect();
        const dx = lastX - (r.left + r.width / 2);
        const dy = lastY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
        } else {
          el.style.transform = '';
        }
      });
    }
    function reset() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      el.style.transform = '';
    }
    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', reset);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);
  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', transition: 'transform 0.18s ease' }} {...rest}>
      {children}
    </span>
  );
}

/* ============================================================
   Dramatic BIOS-style boot sequence
   ============================================================ */
function BootLog({ onDone }) {
  const lines = [
    '> zahadadOS v1.0 — initializing...',
    '> mounting /home/zahadad ............ [ok]',
    '> loading projects.dll ............... [ok]',
    '> spawning recruiter_attractor.exe ... [ok]',
    '> verifying caffeine levels .......... [ok]',
    '> READY.',
  ];
  const [shown, setShown] = useState([]);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setShown(s => [...s, lines[i]]);
      i++;
      if (i >= lines.length) {
        clearInterval(t);
        setTimeout(() => onDone?.(), 400);
      }
    }, 200);
    return () => clearInterval(t);
  }, []);

  return (
    <pre
      className="mono"
      style={{
        margin: 0,
        padding: 0,
        fontSize: 13,
        color: 'var(--ink-mid)',
        lineHeight: 1.55,
        minHeight: lines.length * 1.55 * 13,
        whiteSpace: 'pre-wrap',
      }}
    >
      {shown.join('\n')}
      {shown.length < lines.length && <span className="caret">█</span>}
    </pre>
  );
}

/* ============================================================
   Glitch → type-in animation for the hero name
   ============================================================ */
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
function rnd(s) { return Array.from(s).map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]).join(''); }

function GlitchName({ target = 'ZAHADAD JARIF', active }) {
  const [display, setDisplay] = useState(target);
  const [revealed, setRevealed] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    if (!active) return;
    let tick = 0;
    function step() {
      tick++;
      // First 8 ticks: full scramble
      if (tick < 8) {
        setDisplay(rnd(target));
        frame.current = setTimeout(step, 60);
        return;
      }
      // Then resolve left-to-right, one char per tick
      const idx = tick - 8;
      if (idx >= target.length) {
        setDisplay(target);
        setRevealed(target.length);
        return;
      }
      setRevealed(idx + 1);
      setDisplay(target.slice(0, idx + 1) + rnd(target.slice(idx + 1)));
      frame.current = setTimeout(step, 55);
    }
    frame.current = setTimeout(step, 60);
    return () => clearTimeout(frame.current);
  }, [active, target]);

  return (
    <span>
      {display.split('').map((ch, i) => (
        <span key={i} style={{ color: i < revealed ? 'inherit' : 'var(--accent)', opacity: i < revealed ? 1 : 0.7 }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/* ============================================================
   Portrait secret overlay — shows after 5 clicks
   ============================================================ */
function PortraitSecret({ onClose }) {
  const [phase, setPhase] = useState('enter');
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 40);
    return () => clearTimeout(t1);
  }, []);
  function close() {
    setPhase('exit');
    setTimeout(onClose, 400);
  }
  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 9500,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: phase === 'show' ? 1 : 0,
        transition: 'opacity 0.35s ease',
        cursor: 'none',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div
        style={{
          background: 'var(--ink)',
          border: '2px solid var(--accent)',
          boxShadow: '6px 6px 0 0 var(--accent)',
          padding: '32px 40px',
          maxWidth: 420,
          textAlign: 'center',
          transform: phase === 'show' ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(16px)',
          transition: 'transform 0.35s ease',
          color: 'var(--paper)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8, letterSpacing: 2,
          color: 'var(--accent)', marginBottom: 20,
        }}>
          ★ YOU FOUND ME
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
          five clicks on my face.<br/>
          that&apos;s either determination<br/>
          or you need a better hobby.<br/>
          <br/>
          <span style={{ color: 'var(--accent)' }}>either way — respect.</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
          now try the Konami code → ↑↑↓↓←→←→BA
        </div>
        <button
          onClick={close}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8, letterSpacing: 1,
            background: 'var(--accent)', color: 'var(--paper)',
            border: 'none', padding: '10px 20px', cursor: 'none',
          }}
        >
          OK COOL
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Hero
   ============================================================ */
function Hero({ theme, onScrollTo }) {
  const [booted, setBooted] = useState(false);
  const [portraitClicks, setPortraitClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  function handlePortraitClick() {
    setPortraitClicks(n => {
      const next = n + 1;
      if (next >= 5) {
        setShowSecret(true);
        window.AchievementsUnlock?.('portrait_clicker');
        return 0;
      }
      return next;
    });
  }

  return (
    <>
    <Win
      title="~/zahadad — login.sh"
      meta="zsh — 80×24"
      id="hero"
      className="hero-window"
      bodyStyle={{ padding: 0 }}
      status={{ left: '// session started', right: 'CONNECTED · 1 user' }}
    >
      <div className="hero-grid">
        {/* LEFT — boot log → headline */}
        <div style={{ padding: '36px 32px 32px', borderRight: '2px solid var(--line)' }}>
          <div style={{ marginBottom: 24 }}>
            <BootLog onDone={() => setBooted(true)} />
          </div>

          <div
            style={{
              opacity: booted ? 1 : 0,
              transform: booted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            <div className="label" style={{ color: 'var(--accent)', marginBottom: 10 }}>
              ▸ HELLO_WORLD
            </div>
            <h1
              className="pixel-xl"
              style={{ margin: '0 0 4px', lineHeight: 0.88, letterSpacing: '-1px' }}
            >
              <GlitchName target="ZAHADAD" active={booted}/>
              <br/>
              <GlitchName target="JARIF" active={booted}/>
              <span style={{ color: 'var(--accent)' }}>.</span>
            </h1>
            <p className="mono" style={{ margin: '18px 0 22px', maxWidth: 460 }}>
              SWE Intern <span style={{ color: 'var(--accent)' }}>@ 4D</span> · Computer Science{' '}
              <span style={{ color: 'var(--accent)' }}>@ York University</span>. I prototype
              AI tools, ship dev infra, and build things that wouldn&apos;t exist otherwise.
            </p>
            <div className="row gap-3 wrap">
              <Magnetic>
                <a className="btn btn-primary" href="#projects" onClick={(e) => { e.preventDefault(); onScrollTo('projects'); }}>
                  ▸ view projects
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn" href="#contact" onClick={(e) => { e.preventDefault(); onScrollTo('contact'); }}>
                  contact.exe
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn" href="https://drive.google.com/file/d/1Jcn4e-SahYHEHOJXhfstQj9ebaMcdU7v/view" target="_blank" rel="noopener noreferrer">
                  resume.pdf ↗
                </a>
              </Magnetic>
            </div>
            <div className="row gap-4 wrap" style={{ marginTop: 24, opacity: 0.7 }}>
              <span className="label">▸ STATUS</span>
              <span className="mono" style={{ fontSize: 12 }}>
                <span style={{ color: 'var(--accent)' }}>●</span> open to fall 2026 internships
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — pixel portrait ID card */}
        <aside style={{ padding: 24, background: 'var(--cream-2)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="row between center">
            <span className="label">ID_CARD.PNG</span>
            <span className="mono muted" style={{ fontSize: 11 }}>v2.0</span>
          </div>

          <div
            className="tilt"
            style={{
              background: 'var(--paper)',
              border: '2px solid var(--line)',
              padding: 14,
              boxShadow: '4px 4px 0 0 var(--line)',
            }}
          >
            {/* Pixel portrait */}
            <div
              style={{
                background: 'var(--cream-2)',
                border: '2px solid var(--line)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                overflow: 'hidden',
              }}
            >
              <img
                src={portraitUrl}
                alt="Zahadad Jarif — pixel portrait"
                onClick={handlePortraitClick}
                style={{
                  width: '100%', height: 'auto', display: 'block',
                  imageRendering: 'pixelated',
                  cursor: 'none',
                  transition: 'transform 0.1s ease',
                  transform: portraitClicks > 0 ? `scale(${1 + portraitClicks * 0.02})` : 'none',
                }}
              />
            </div>
            <div style={{ paddingTop: 12 }}>
              <div className="label-md" style={{ marginBottom: 6 }}>ZAHADAD JARIF</div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink-mid)' }}>
                CLASS &nbsp; SWE / INTERN<br/>
                LVL &nbsp;&nbsp;&nbsp; 19 · YORK U<br/>
                TYPE &nbsp;&nbsp; FULL-STACK · AI
              </div>
            </div>
          </div>

          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-mid)', lineHeight: 1.5 }}>
            ▌ press <kbd style={kbdStyle}>↑↑↓↓←→←→BA</kbd><br/>
            ▌ try the dock ↘
          </div>
        </aside>
      </div>
    </Win>
    {showSecret && <PortraitSecret onClose={() => setShowSecret(false)}/>}
  </>
  );
}

const kbdStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  background: 'var(--ink)',
  color: 'var(--paper)',
  padding: '2px 5px',
  borderRadius: 2,
  letterSpacing: '0.5px',
};

export default Hero
export { Magnetic }
