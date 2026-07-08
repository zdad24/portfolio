import React, { useState } from 'react'
import Snake from './Snake.jsx'
import Pong from './Pong.jsx'
import Tetris from './Tetris.jsx'
import { useDismiss } from './useDismiss.js'

/* ============================================================
   GamesFolder — dock "Games/" folder that opens a launcher
   window with Snake, Pong and Tetris.
   ============================================================ */

function SnakeIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4"  y="14" width="6" height="6" fill="currentColor" />
      <rect x="10" y="14" width="6" height="6" fill="currentColor" />
      <rect x="16" y="14" width="6" height="6" fill="currentColor" />
      <rect x="22" y="14" width="6" height="6" fill="currentColor" />
      <rect x="22" y="8"  width="6" height="6" fill="currentColor" />
      <rect x="6"  y="6"  width="4" height="4" rx="2" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function PongIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3"  y="8"  width="3" height="18" fill="currentColor" />
      <rect x="28" y="8"  width="3" height="18" fill="currentColor" />
      <rect x="15" y="5"  width="2" height="4"  fill="currentColor" opacity="0.5" />
      <rect x="15" y="13" width="2" height="4"  fill="currentColor" opacity="0.5" />
      <rect x="15" y="21" width="2" height="4"  fill="currentColor" opacity="0.5" />
      <rect x="21" y="15" width="4" height="4"  fill="currentColor" />
    </svg>
  );
}

function TetrisIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="6"  width="10" height="10" fill="currentColor" />
      <rect x="10" y="16" width="10" height="10" fill="currentColor" />
      <rect x="20" y="16" width="10" height="10" fill="currentColor" />
    </svg>
  );
}

const GAME_LIST = [
  { id: 'snake',  name: 'Snake',  Icon: SnakeIcon,  sub: 'arrows · classic' },
  { id: 'pong',   name: 'Pong',   Icon: PongIcon,   sub: 'WS · vs AI' },
  { id: 'tetris', name: 'Tetris', Icon: TetrisIcon, sub: '←→↑ · stacker' },
];

function GamesFolder({ onClose, onChirp, sound }) {
  const [active, setActive] = useState(null); // null = launcher, else game id
  const [phase, dismiss] = useDismiss(onClose);

  /* route to the selected game */
  if (active === 'snake')  return <Snake  onClose={() => setActive(null)} onChirp={onChirp} />;
  if (active === 'pong')   return <Pong   onClose={() => setActive(null)} />;
  if (active === 'tetris') return <Tetris onClose={() => setActive(null)} />;

  /* ── launcher picker ─────────────────────── */
  return (
    <div className={`modal-backdrop${phase !== 'open' ? ` is-${phase}` : ''}`} onClick={dismiss}>
      <div
        className="window"
        style={{ width: 'min(340px, 96vw)', marginBottom: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <header className="window-bar">
          <div className="lights"><span></span><span></span><span></span></div>
          <div className="title mono">games/</div>
          <button
            onClick={dismiss}
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
  const { Icon } = game;

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
      <Icon />
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
