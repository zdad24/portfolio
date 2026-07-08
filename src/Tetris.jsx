import React, { useEffect, useRef, useState } from 'react'
import { useFitCell } from './useFitCell.js'
import { useDismiss } from './useDismiss.js'
import { DPad, TouchButton } from './GameTouchControls.jsx'

/* ============================================================
   Tetris — classic 10×20 grid stacker.
   ← → move · ↑ / X rotate CW · Z rotate CCW
   ↓ soft drop · C hard drop · P / SPACE pause
   ============================================================ */

const COLS = 10, ROWS = 20, CELL_MAX = 22;

const PIECES = [
  { shape: [[1,1,1,1]],               color: '#38c8c8' }, // I
  { shape: [[1,1],[1,1]],             color: '#f2c037' }, // O
  { shape: [[0,1,0],[1,1,1]],         color: '#cf3a2f' }, // T
  { shape: [[1,0,0],[1,1,1]],         color: '#5a8fff' }, // J
  { shape: [[0,0,1],[1,1,1]],         color: '#f06a00' }, // L
  { shape: [[0,1,1],[1,1,0]],         color: '#4ea54a' }, // S
  { shape: [[1,1,0],[0,1,1]],         color: '#d84a8a' }, // Z
];

const SCORE_TABLE = [0, 100, 300, 500, 800];

function randPiece() {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return {
    shape: p.shape.map(r => [...r]),
    color: p.color,
    x: Math.floor(COLS / 2) - Math.floor(p.shape[0].length / 2),
    y: -1,
  };
}

function rotateCW(shape) {
  const R = shape.length, C = shape[0].length;
  const out = Array.from({ length: C }, () => Array(R).fill(0));
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      out[c][R - 1 - r] = shape[r][c];
  return out;
}

function rotateCCW(shape) { return rotateCW(rotateCW(rotateCW(shape))); }

function fits(board, piece, dx = 0, dy = 0, shapeOverride) {
  const sh = shapeOverride || piece.shape;
  for (let r = 0; r < sh.length; r++)
    for (let c = 0; c < sh[r].length; c++)
      if (sh[r][c]) {
        const nx = piece.x + c + dx, ny = piece.y + r + dy;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
        if (ny >= 0 && board[ny][nx]) return false;
      }
  return true;
}

function mergeBoard(board, piece) {
  const b = board.map(r => [...r]);
  piece.shape.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v && piece.y + r >= 0) b[piece.y + r][piece.x + c] = piece.color;
    })
  );
  return b;
}

function clearLines(board) {
  const kept = board.filter(row => row.some(v => !v));
  const n = ROWS - kept.length;
  return {
    board: [...Array.from({ length: n }, () => Array(COLS).fill(null)), ...kept],
    cleared: n,
  };
}

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function initGame() {
  return {
    board:  emptyBoard(),
    piece:  randPiece(),
    next:   randPiece(),
    score:  0,
    lines:  0,
    level:  1,
    over:   false,
  };
}

function lockPiece(gs) {
  const merged             = mergeBoard(gs.board, gs.piece);
  const { board, cleared } = clearLines(merged);
  const lines  = gs.lines + cleared;
  const level  = Math.floor(lines / 10) + 1;
  const score  = gs.score + (SCORE_TABLE[Math.min(cleared, 4)] || 0) * gs.level;
  const piece  = gs.next;
  const next   = randPiece();
  if (!fits(board, piece)) return { ...gs, board, lines, level, score, over: true };
  return { board, piece, next, lines, level, score, over: false };
}

/* ── ghost (hard-drop preview) ── */
function ghostY(board, piece) {
  let dy = 0;
  while (fits(board, piece, 0, dy + 1)) dy++;
  return piece.y + dy;
}

/* ── Tetris component ──────────────────────────── */
function Tetris({ onClose }) {
  const [phase, dismiss]    = useDismiss(onClose);
  const [gs, setGs]         = useState(initGame);
  const [paused, setPaused] = useState(false);
  const pausedRef           = useRef(false);
  const tickRef             = useRef(null);
  const [boardWrapRef, CELL] = useFitCell(COLS, CELL_MAX, 12);

  /* always-fresh tick fn — updated via effect so the interval always gets latest state */
  useEffect(() => {
    tickRef.current = () => {
      setGs(g => {
        if (g.over || pausedRef.current) return g;
        if (fits(g.board, g.piece, 0, 1)) return { ...g, piece: { ...g.piece, y: g.piece.y + 1 } };
        return lockPiece(g);
      });
    };
  });

  /* gravity interval — resets when level changes */
  useEffect(() => {
    if (gs.over) return;
    const ms = Math.max(80, 550 - (gs.level - 1) * 48);
    const id = setInterval(() => tickRef.current(), ms);
    return () => clearInterval(id);
  }, [gs.level, gs.over]);

  /* movement — shared by keyboard and touch controls */
  function moveLeft() {
    setGs(g => {
      if (g.over || pausedRef.current) return g;
      const p = g.piece, b = g.board;
      return fits(b, p, -1, 0) ? { ...g, piece: { ...p, x: p.x - 1 } } : g;
    });
  }
  function moveRight() {
    setGs(g => {
      if (g.over || pausedRef.current) return g;
      const p = g.piece, b = g.board;
      return fits(b, p, 1, 0) ? { ...g, piece: { ...p, x: p.x + 1 } } : g;
    });
  }
  function softDrop() {
    setGs(g => {
      if (g.over || pausedRef.current) return g;
      const p = g.piece, b = g.board;
      if (fits(b, p, 0, 1)) return { ...g, piece: { ...p, y: p.y + 1 } };
      return lockPiece(g);
    });
  }
  function rotate(cw = true) {
    setGs(g => {
      if (g.over || pausedRef.current) return g;
      const p = g.piece, b = g.board;
      const sh = cw ? rotateCW(p.shape) : rotateCCW(p.shape);
      return fits(b, p, 0, 0, sh) ? { ...g, piece: { ...p, shape: sh } } : g;
    });
  }
  function hardDrop() {
    setGs(g => {
      if (g.over || pausedRef.current) return g;
      const p = g.piece, b = g.board;
      let dy = 0;
      while (fits(b, p, 0, dy + 1)) dy++;
      return lockPiece({ ...g, piece: { ...p, y: p.y + dy } });
    });
  }
  function togglePause() {
    setGs(g => (g.over ? initGame() : g)); // restart on game-over
    setGs(g => {
      if (!g.over) {
        pausedRef.current = !pausedRef.current;
        setPaused(pausedRef.current);
      }
      return g;
    });
  }

  /* keyboard */
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { dismiss(); return; }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') { togglePause(); e.preventDefault(); return; }

      if (pausedRef.current) return;

      switch (e.key) {
        case 'ArrowLeft':  moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowDown':  softDrop(); break;
        case 'ArrowUp': case 'x': case 'X': rotate(true); break;
        case 'z': case 'Z': rotate(false); break;
        case 'c': case 'C': hardDrop(); break;
        default: return;
      }
      e.preventDefault();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismiss]);

  /* ── build display board ─────────────── */
  const display = gs.board.map(r => [...r]);
  const gy = ghostY(gs.board, gs.piece);

  /* ghost */
  gs.piece.shape.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v) {
        const ny = gy + r, nx = gs.piece.x + c;
        if (ny >= 0 && ny < ROWS && !display[ny][nx]) display[ny][nx] = 'ghost';
      }
    })
  );
  /* active piece */
  gs.piece.shape.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v) {
        const ny = gs.piece.y + r, nx = gs.piece.x + c;
        if (ny >= 0 && ny < ROWS) display[ny][nx] = gs.piece.color;
      }
    })
  );

  /* ── next-piece preview (centred in 4×4) ── */
  const nsh = gs.next.shape;
  const nOffR = Math.floor((4 - nsh.length) / 2);
  const nOffC = Math.floor((4 - nsh[0].length) / 2);

  return (
    <div className={`modal-backdrop${phase !== 'open' ? ` is-${phase}` : ''}`} onClick={dismiss}>
      <div
        className="window"
        style={{ width: 'min(440px, 96vw)', marginBottom: 0, position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <header className="window-bar">
          <div className="lights"><span></span><span></span><span></span></div>
          <div className="title mono">tetris.exe</div>
          <button
            onClick={dismiss}
            style={{ background: 'transparent', border: 'none', font: 'inherit', cursor: 'none', color: 'var(--ink)' }}
          >✕</button>
        </header>

        <div className="window-body" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {/* board — flex-basis 0 so its measured width reflects space left
              after the sidebar, independent of the grid's own pixel size */}
          <div ref={boardWrapRef} style={{ flex: '1 1 0', minWidth: 0 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
                gridTemplateRows:    `repeat(${ROWS}, ${CELL}px)`,
                gap: 1,
                background: 'var(--ink)',
                border: '2px solid var(--line)',
                padding: 1,
                width: 'fit-content',
              }}
            >
              {display.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    style={{
                      background: cell === 'ghost'
                        ? 'rgba(255,255,255,0.09)'
                        : (cell || 'var(--cream-2)'),
                      outline: cell && cell !== 'ghost'
                        ? '1px solid rgba(255,255,255,0.18)' : 'none',
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 2 }}>
            {/* next */}
            <div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', marginBottom: 5, letterSpacing: 1 }}>NEXT</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 16px)',
                  gridTemplateRows:    'repeat(4, 16px)',
                  gap: 1,
                  background: 'var(--ink)',
                  border: '1px solid var(--line)',
                  padding: 2,
                }}
              >
                {Array.from({ length: 4 }, (_, r) =>
                  Array.from({ length: 4 }, (_, c) => {
                    const sr = r - nOffR, sc = c - nOffC;
                    const filled = sr >= 0 && sr < nsh.length && sc >= 0 && sc < nsh[0].length && nsh[sr][sc];
                    return (
                      <div
                        key={`${r}-${c}`}
                        style={{ background: filled ? gs.next.color : 'var(--cream-2)' }}
                      />
                    );
                  })
                )}
              </div>
            </div>

            {[['SCORE', gs.score], ['LINES', gs.lines], ['LVL', gs.level]].map(([label, val]) => (
              <div key={label}>
                <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: 1 }}>{label}</div>
                <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{val}</div>
              </div>
            ))}

            <div className="mono muted" style={{ fontSize: 9, lineHeight: 1.8, marginTop: 'auto' }}>
              ←→ move<br />↑/X rotate↻<br />Z rotate↺<br />↓ soft drop<br />C hard drop<br />SP/P pause
            </div>
          </div>
        </div>

        <div className="game-touch-controls" style={{ padding: '0 16px 16px' }}>
          <DPad
            onUp={() => rotate(true)}
            onDown={() => softDrop()}
            onLeft={() => moveLeft()}
            onRight={() => moveRight()}
          />
          <div className="game-action-row">
            <TouchButton ariaLabel="Hard drop" onDown={hardDrop} style={{ width: 'auto', padding: '0 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 0.5 }}>DROP</TouchButton>
            <TouchButton ariaLabel={gs.over ? 'Restart' : paused ? 'Resume' : 'Pause'} onDown={togglePause} style={{ width: 'auto', padding: '0 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 0.5 }}>
              {gs.over ? 'RESTART' : paused ? 'RESUME' : 'PAUSE'}
            </TouchButton>
          </div>
          <span className="mono muted" style={{ fontSize: 9 }}>▲ rotate · ◀▶ move · ▼ soft drop</span>
        </div>

        {/* overlay for pause / game-over — tap to resume/restart on touch */}
        {(gs.over || paused) && (
          <div
            onClick={togglePause}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.72)',
              borderRadius: 'inherit',
              cursor: 'pointer',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div className="pixel-sm" style={{ fontSize: 22, color: 'var(--accent)' }}>
                {gs.over ? 'GAME OVER' : 'PAUSED'}
              </div>
              <div className="mono muted" style={{ fontSize: 11, marginTop: 6 }}>
                {gs.over
                  ? `Score: ${gs.score}  ·  press SPACE or tap to restart`
                  : 'SPACE, P, or tap to resume'}
              </div>
            </div>
          </div>
        )}

        <footer className="window-statusbar mono">
          <span>{'// ←→↑↓ · X/Z rotate · C hard-drop'}</span>
          <span>v1.0</span>
        </footer>
      </div>
    </div>
  );
}

export default Tetris
