import React, { useEffect, useState } from 'react'

/* ============================================================
   Menu bar (top) — non-functional menus + working theme toggles
   ============================================================ */
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
      <div className="brand"><span className="glyph"></span> zahadadOS</div>
      <div className="item">File</div>
      <div className="item">Edit</div>
      <div className="item">View</div>
      <div className="item">Window</div>
      <div className="item">Help</div>
      <div className="spacer"></div>
      <div className="right">
        <button
          className="item"
          data-keep
          onClick={onTheme}
          title="Cycle theme"
          style={{ background: 'transparent', border: 'none', font: 'inherit' }}
        >
          🎨 {themeLabel}
        </button>
        <button
          className="item"
          data-keep
          onClick={onSound}
          title="Toggle sounds"
          style={{ background: 'transparent', border: 'none', font: 'inherit' }}
        >
          {sound ? '🔊' : '🔇'}
        </button>
        <button
          className="item"
          data-keep
          onClick={onMode}
          title="Toggle light/dark"
          style={{ background: 'transparent', border: 'none', font: 'inherit' }}
        >
          {mode === 'dark' ? '☾' : '☀'}
        </button>
        <span className="clock mono">{time}</span>
      </div>
    </nav>
  );
}

export default MenuBar
