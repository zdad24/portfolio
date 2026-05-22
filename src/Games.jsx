import React, { useState } from 'react'
import Snake from './Snake.jsx'
import Pong from './Pong.jsx'
import Tetris from './Tetris.jsx'

/* ============================================================
   GamesFolder — dock "Games/" folder that opens a launcher
   window with Snake, Pong and Tetris.
   ============================================================ */

const GAME_LIST = [
  {
    id:   'snake',
    name: 'Snake',
    icon: '🐍',
    sub:  'arrows · classic',
  },
  {
    id:   'pong',
    name: 'Pong',
    icon: '🏓',
    sub:  'WS · vs AI',
  },
  {
    id:   'tetris',
    name: 'Tetris',
    icon: '🟦',
    sub:  '←→↑ · stacker',
  },
];

function GamesFolder({ onClose, onChirp, sound }) {
  const [active, setActive] = useState(null); // null = launcher, else game id

  /* route to the selected game */
  if (active === 'snake')  return <Snake  onClose={() => setActive(null)} onChirp={onChirp} />;
  if (active === 'pong')   return <Pong   onClose={() => setActive(null)} />;
  if (active === 'tetris') return <Tetris onClose={() => setActive(null)} />;

  /* ── launcher picker ─────────────────────── */
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="window"
        style={{ width: 'min(340px, 96vw)', marginBottom: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <header className="window-bar">
          <div className="lights"><span></span><span></span><span></span></div>
          <div className="title mono">games/</div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', font: 'inherit', cursor: 'none', color: 'var(--ink)' }}
          >✕</button>
        </header>

        <div className="window-body" style={{ padding: 20 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
            }}
          >
            {GAME_LIST.map(g => (
              <GameIcon
                key={g.id}
                game={g}
                onLaunch={() => {
                  setActive(g.id);
                  if (sound && window.SFX) window.SFX.click();
                }}
              />
            ))}
          </div>
        </div>

        <footer className="window-statusbar mono">
          <span>{'// '}{GAME_LIST.length}{' games installed'}</span>
          <span>v1.0</span>
        </footer>
      </div>
    </div>
  );
}

/* ── individual icon tile ──────────────────────── */
function GameIcon({ game, onLaunch }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onLaunch}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        all: 'unset',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        padding: '14px 8px 10px',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'background 0.12s, transform 0.12s',
        background: hover ? 'var(--cream-2)' : 'transparent',
        transform: hover ? 'translateY(-2px)' : 'none',
        border: `1px solid ${hover ? 'var(--line)' : 'transparent'}`,
      }}
    >
      <span style={{ fontSize: 34, lineHeight: 1 }}>{game.icon}</span>
      <span
        className="mono"
        style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)' }}
      >
        {game.name}
      </span>
      <span
        className="mono muted"
        style={{ fontSize: 9, textAlign: 'center', lineHeight: 1.4 }}
      >
        {game.sub}
      </span>
    </button>
  );
}

export default GamesFolder
