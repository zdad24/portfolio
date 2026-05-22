import React, { useEffect, useRef, useState } from 'react'

/* ============================================================
   Pong — canvas-based 1P vs AI.
   W / S or Arrow Up / Down to move.
   ============================================================ */
function Pong({ onClose }) {
  const canvasRef  = useRef(null);
  const stateRef   = useRef(null);
  const rafRef     = useRef(null);
  const pausedRef  = useRef(true);   // starts paused until SPACE
  const keysRef    = useRef({});

  const [score,   setScore]   = useState([0, 0]);
  const [started, setStarted] = useState(false);
  const [paused,  setPaused]  = useState(false);

  const W = 460, H = 280;
  const PAD_W = 10, PAD_H = 58;
  const BALL  = 10;
  const P_SPD = 4.2;
  const AI_SPD = 3.4;

  function mkBall(dir = 1) {
    return {
      x: W / 2, y: H / 2,
      vx: (3.8 + Math.random() * 0.8) * dir,
      vy: (2.5 + Math.random() * 1.2) * (Math.random() > .5 ? 1 : -1),
    };
  }

  function initState() {
    return {
      ball: mkBall(),
      p1:   { y: H / 2 - PAD_H / 2 },
      p2:   { y: H / 2 - PAD_H / 2 },
      score:[0, 0],
    };
  }

  /* ── canvas loop ───────────────────────────── */
  useEffect(() => {
    stateRef.current = initState();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function getVar(name, fallback) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(name).trim() || fallback;
    }

    function draw(s) {
      const ink    = getVar('--ink', '#15161a');
      const cream2 = getVar('--cream-2', '#e8dec5');
      const accent = getVar('--accent', '#cf3a2f');
      const acc2   = getVar('--accent-2', '#f2c037');

      ctx.fillStyle = ink;
      ctx.fillRect(0, 0, W, H);

      /* centre dashed line */
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 9]);
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.restore();

      /* paddles */
      ctx.fillStyle = accent;
      ctx.fillRect(14, s.p1.y, PAD_W, PAD_H);
      ctx.fillStyle = acc2;
      ctx.fillRect(W - 14 - PAD_W, s.p2.y, PAD_W, PAD_H);

      /* ball */
      ctx.fillStyle = cream2;
      ctx.fillRect(s.ball.x - BALL / 2, s.ball.y - BALL / 2, BALL, BALL);
    }

    function update(s) {
      const keys = keysRef.current;

      /* player paddle */
      if (keys['ArrowUp']   || keys['w'] || keys['W'])
        s.p1.y = Math.max(0, s.p1.y - P_SPD);
      if (keys['ArrowDown'] || keys['s'] || keys['S'])
        s.p1.y = Math.min(H - PAD_H, s.p1.y + P_SPD);

      /* AI paddle — simple proportional tracker with speed cap */
      const aiMid = s.p2.y + PAD_H / 2;
      const diff  = s.ball.y - aiMid;
      const move  = Math.sign(diff) * Math.min(Math.abs(diff) * 0.08, AI_SPD);
      s.p2.y = Math.max(0, Math.min(H - PAD_H, s.p2.y + move));

      /* ball */
      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;

      /* top / bottom wall */
      if (s.ball.y - BALL / 2 <= 0)     { s.ball.y = BALL / 2;     s.ball.vy = Math.abs(s.ball.vy); }
      if (s.ball.y + BALL / 2 >= H)     { s.ball.y = H - BALL / 2; s.ball.vy = -Math.abs(s.ball.vy); }

      /* p1 paddle collision (left) */
      const p1x = 14;
      if (
        s.ball.vx < 0 &&
        s.ball.x - BALL / 2 <= p1x + PAD_W &&
        s.ball.x + BALL / 2 >= p1x &&
        s.ball.y + BALL / 2 >= s.p1.y &&
        s.ball.y - BALL / 2 <= s.p1.y + PAD_H
      ) {
        s.ball.x  = p1x + PAD_W + BALL / 2;
        const rel = (s.ball.y - (s.p1.y + PAD_H / 2)) / (PAD_H / 2);
        s.ball.vx = Math.min(Math.abs(s.ball.vx) * 1.05, 11);
        s.ball.vy = rel * 5.5;
      }

      /* p2 paddle collision (right) */
      const p2x = W - 14 - PAD_W;
      if (
        s.ball.vx > 0 &&
        s.ball.x + BALL / 2 >= p2x &&
        s.ball.x - BALL / 2 <= p2x + PAD_W &&
        s.ball.y + BALL / 2 >= s.p2.y &&
        s.ball.y - BALL / 2 <= s.p2.y + PAD_H
      ) {
        s.ball.x  = p2x - BALL / 2;
        const rel = (s.ball.y - (s.p2.y + PAD_H / 2)) / (PAD_H / 2);
        s.ball.vx = -Math.min(Math.abs(s.ball.vx) * 1.05, 11);
        s.ball.vy = rel * 5.5;
      }

      /* scoring */
      if (s.ball.x < -BALL) {
        s.score[1]++;
        setScore([...s.score]);
        s.ball = mkBall(1);
        s.p1 = { y: H / 2 - PAD_H / 2 };
        s.p2 = { y: H / 2 - PAD_H / 2 };
      }
      if (s.ball.x > W + BALL) {
        s.score[0]++;
        setScore([...s.score]);
        s.ball = mkBall(-1);
        s.p1 = { y: H / 2 - PAD_H / 2 };
        s.p2 = { y: H / 2 - PAD_H / 2 };
      }
    }

    function loop() {
      if (!pausedRef.current) update(stateRef.current);
      draw(stateRef.current);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── keyboard ──────────────────────────────── */
  useEffect(() => {
    function onDown(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === ' ') {
        if (!started) {
          pausedRef.current = false;
          setStarted(true);
          setPaused(false);
        } else {
          pausedRef.current = !pausedRef.current;
          setPaused(p => !p);
        }
        e.preventDefault();
        return;
      }
      keysRef.current[e.key] = true;
      e.preventDefault();
    }
    function onUp(e) { delete keysRef.current[e.key]; }

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup',   onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup',   onUp);
    };
  }, [started, onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="window"
        style={{ width: 'min(500px, 96vw)', marginBottom: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <header className="window-bar">
          <div className="lights"><span></span><span></span><span></span></div>
          <div className="title mono">pong.exe</div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', font: 'inherit', cursor: 'none', color: 'var(--ink)' }}
          >✕</button>
        </header>

        <div className="window-body" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="label" style={{ color: 'var(--accent)' }}>YOU {score[0]}</span>
            <span className="mono muted" style={{ fontSize: 10 }}>
              {started ? (paused ? 'SPACE resume · ESC close' : '↑↓ / WS move · SPACE pause · ESC close') : 'SPACE to start · ESC close'}
            </span>
            <span className="label" style={{ color: 'var(--accent-2)' }}>{score[1]} CPU</span>
          </div>

          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            style={{
              display: 'block',
              margin: '0 auto',
              width: '100%',
              maxWidth: W,
              imageRendering: 'pixelated',
              border: '2px solid var(--line)',
            }}
          />

          {!started && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <span className="mono muted" style={{ fontSize: 11 }}>press SPACE to serve</span>
            </div>
          )}
          {started && paused && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <div className="pixel-sm" style={{ fontSize: 18, color: 'var(--accent)' }}>PAUSED</div>
              <div className="mono muted" style={{ fontSize: 11, marginTop: 4 }}>SPACE to resume</div>
            </div>
          )}
        </div>

        <footer className="window-statusbar mono">
          <span>// player vs ai</span>
          <span>v1.0</span>
        </footer>
      </div>
    </div>
  );
}

export default Pong
