import React, { useEffect, useRef } from 'react'

/* ============================================================
   On-screen touch controls for Snake / Pong / Tetris.
   CSS-gated to `pointer: coarse` — desktop keeps keyboard-only
   chrome, touch devices get a d-pad + action buttons instead.
   ============================================================ */
function TouchButton({ children, onDown, onUp, repeatMs, ariaLabel, style }) {
  const timerRef = useRef(null);

  function start(e) {
    e.preventDefault();
    onDown?.();
    if (repeatMs) timerRef.current = setInterval(() => onDown?.(), repeatMs);
  }
  function stop() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    onUp?.();
  }

  useEffect(() => () => stop(), []);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="game-touch-btn"
      style={style}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
    >
      {children}
    </button>
  );
}

function DPad({ onUp, onDown, onLeft, onRight }) {
  return (
    <div className="game-dpad">
      <TouchButton ariaLabel="Move up" onDown={onUp} style={{ gridArea: 'up' }}>▲</TouchButton>
      <TouchButton ariaLabel="Move left" onDown={onLeft} style={{ gridArea: 'left' }}>◀</TouchButton>
      <TouchButton ariaLabel="Move right" onDown={onRight} style={{ gridArea: 'right' }}>▶</TouchButton>
      <TouchButton ariaLabel="Move down" onDown={onDown} style={{ gridArea: 'down' }}>▼</TouchButton>
    </div>
  );
}

export { TouchButton, DPad }
