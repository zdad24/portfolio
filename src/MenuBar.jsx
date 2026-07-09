import React, { useEffect, useState } from 'react'

/* ============================================================
   Menu bar (top) — non-functional menus + working theme toggles
   ============================================================ */

const iconStyle = { verticalAlign: 'middle', display: 'inline-block', position: 'relative', top: -1 };

function SpeakerOnIcon() {
  return (
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={iconStyle}>
      <path d="M0 4 L3 4 L6 1 L6 11 L3 8 L0 8 Z" fill="currentColor" />
      <path d="M8 3 Q10.5 6 8 9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9.5 1.5 Q13 6 9.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={iconStyle}>
      <path d="M0 4 L3 4 L6 1 L6 11 L3 8 L0 8 Z" fill="currentColor" />
      <line x1="8.5" y1="4"   x2="12"  y2="8"   stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12"  y1="4"   x2="8.5" y2="8"   stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function fmtTime(d) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}  ${h}:${m} ${ap}`;
}

function MenuBar({ theme, mode, onTheme, onMode, sound, onSound }) {
  const [time, setTime] = useState(() => fmtTime(new Date()));

  useEffect(() => {
    const t = setInterval(() => setTime(fmtTime(new Date())), 30_000);
    return () => clearInterval(t);
  }, []);

  const themeLabel = { pokemon: 'POKÉ', basketball: 'HOOPS' }[theme] || theme;

  return (
    <nav className="menu-bar">
      <div className="brand"><span className="glyph" aria-hidden="true"></span> zahadadOS</div>
      <div className="item" aria-hidden="true">File</div>
      <div className="item" aria-hidden="true">Edit</div>
      <div className="item" aria-hidden="true">View</div>
      <div className="item" aria-hidden="true">Window</div>
      <div className="item" aria-hidden="true">Help</div>
      <div className="spacer"></div>
      <div className="right">
        <button
          className="item"
          data-keep
          onClick={onTheme}
          title="Cycle theme"
          aria-label={`Cycle theme (current: ${themeLabel})`}
        >
          {themeLabel}
        </button>
        <button
          className="item"
          data-keep
          onClick={onSound}
          title="Toggle sounds"
          aria-label={sound ? 'Sound on — turn off' : 'Sound off — turn on'}
          aria-pressed={sound}
        >
          {sound ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
        </button>
        <button
          className="item"
          data-keep
          onClick={onMode}
          title="Toggle light/dark"
          aria-label={mode === 'dark' ? 'Dark mode — switch to light' : 'Light mode — switch to dark'}
          aria-pressed={mode === 'dark'}
          style={{ fontSize: 14 }}
        >
          {mode === 'dark' ? '☾' : '☀'}
        </button>
        <span className="clock mono">{time}</span>
      </div>
    </nav>
  );
}

export default MenuBar
