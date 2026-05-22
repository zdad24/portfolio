import React, { useEffect, useRef } from 'react'

/* ============================================================
   Dock — bottom app dock with magnetic hover scaling
   ============================================================ */
function Dock({ items, onLaunch }) {
  const dockRef = useRef(null);

  // Magnetic scale: icons near cursor grow more
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    function onMove(e) {
      const icons = dock.querySelectorAll('.dock-icon');
      icons.forEach(ic => {
        const r = ic.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const max = 120;
        const k = Math.max(0, 1 - dist / max);
        const scale = 1 + k * 0.35;
        const lift = k * 8;
        ic.style.transform = `translate(0, ${-lift}px) scale(${scale})`;
      });
    }
    function onLeave() {
      dock.querySelectorAll('.dock-icon').forEach(ic => (ic.style.transform = ''));
    }
    window.addEventListener('mousemove', onMove);
    dock.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      dock.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="dock" ref={dockRef}>
      {items.map((it, i) => (
        it.divider ? (
          <span key={i} className="dock-divider"></span>
        ) : (
          <button
            key={it.id}
            className="dock-icon"
            data-tip={it.tip}
            style={it.style || {}}
            onClick={() => onLaunch(it.target)}
          >
            {it.icon}
          </button>
        )
      ))}
    </div>
  );
}

export default Dock
