import React, { useEffect, useRef, useState } from 'react'

/* ============================================================
   Snake — easter-egg mini game inside a window modal.
   Triggered by Konami code. Original 8x8-ish grid snake.
   ============================================================ */
function Snake({ onClose, onChirp }) {
  const COLS = 18, ROWS = 12;
  const [snake, setSnake] = useState(() => [[8, 6], [7, 6], [6, 6]]);
  const [dir, setDir] = useState([1, 0]);
  const [food, setFood] = useState([12, 6]);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  function placeFood(s) {
    while (true) {
      const f = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)];
      if (!s.some(([x, y]) => x === f[0] && y === f[1])) return f;
    }
  }

  function restart() {
    const s = [[8, 6], [7, 6], [6, 6]];
    setSnake(s);
    setDir([1, 0]);
    setFood(placeFood(s));
    setScore(0);
    setOver(false);
    setPaused(false);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === ' ')      { setPaused(p => !p); e.preventDefault(); return; }
      if (e.key === 'r' && over) { restart(); return; }
      const map = {
        ArrowUp:    [0, -1], w: [0, -1],
        ArrowDown:  [0,  1], s: [0,  1],
        ArrowLeft:  [-1, 0], a: [-1, 0],
        ArrowRight: [1,  0], d: [1,  0],
      };
      const nd = map[e.key];
      if (!nd) return;
      const cd = dirRef.current;
      if (cd[0] + nd[0] === 0 && cd[1] + nd[1] === 0) return; // no 180
      setDir(nd);
      e.preventDefault();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [over, onClose]);

  useEffect(() => {
    if (over || paused) return;
    const tick = setInterval(() => {
      setSnake(s => {
        const head = s[0];
        const nh = [(head[0] + dirRef.current[0] + COLS) % COLS, (head[1] + dirRef.current[1] + ROWS) % ROWS];
        if (s.some(([x, y]) => x === nh[0] && y === nh[1])) {
          setOver(true);
          return s;
        }
        const ate = nh[0] === food[0] && nh[1] === food[1];
        if (ate) {
          setScore(v => v + 1);
          setFood(placeFood([nh, ...s]));
          onChirp?.();
        }
        return [nh, ...(ate ? s : s.slice(0, -1))];
      });
    }, 120);
    return () => clearInterval(tick);
  }, [food, over, paused]);

  const CELL = 22;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="window"
        style={{ width: 'min(640px, 96vw)', marginBottom: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <header className="window-bar">
          <div className="lights"><span></span><span></span><span></span></div>
          <div className="title mono">snake.exe — easter_egg</div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', font: 'inherit', cursor: 'none', color: 'var(--ink)' }}
          >
            ✕
          </button>
        </header>
        <div className="window-body" style={{ padding: 18 }}>
          <div className="row between center" style={{ marginBottom: 12 }}>
            <span className="label" style={{ color: 'var(--accent)' }}>▸ SCORE {String(score).padStart(3, '0')}</span>
            <span className="mono muted" style={{ fontSize: 11 }}>
              ↑↓←→ move · SPACE pause · ESC close · R restart
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
              gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
              gap: 1,
              background: 'var(--ink)',
              border: '2px solid var(--line)',
              padding: 1,
              width: 'fit-content',
              margin: '0 auto',
            }}
          >
            {Array.from({ length: ROWS }).map((_, y) =>
              Array.from({ length: COLS }).map((_, x) => {
                const isHead = snake[0][0] === x && snake[0][1] === y;
                const isBody = !isHead && snake.some(([sx, sy]) => sx === x && sy === y);
                const isFood = food[0] === x && food[1] === y;
                let bg = 'var(--cream-2)';
                if (isHead) bg = 'var(--accent)';
                else if (isBody) bg = 'var(--ink-soft)';
                else if (isFood) bg = 'var(--accent-2)';
                return <div key={`${x}-${y}`} style={{ background: bg }}/>;
              })
            )}
          </div>
          {(over || paused) && (
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <div className="pixel-sm" style={{ fontSize: 24, color: 'var(--accent)' }}>
                {over ? 'GAME OVER' : 'PAUSED'}
              </div>
              <div className="mono muted" style={{ fontSize: 12, marginTop: 4 }}>
                {over ? `final score: ${score} · press R to restart` : 'SPACE to resume'}
              </div>
            </div>
          )}
        </div>
        <footer className="window-statusbar mono">
          <span>// hidden as a thank-you for typing the code</span>
          <span>v1.0</span>
        </footer>
      </div>
    </div>
  );
}

export default Snake
