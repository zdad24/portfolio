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
    let raf = null;
    let lastX = 0, lastY = 0;
    function onMove(e) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const icons = Array.from(dock.querySelectorAll('.dock-icon'));
        // batch reads first
        const data = icons.map(ic => {
          const r = ic.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dist = Math.hypot(lastX - cx, lastY - cy);
          const k = Math.max(0, 1 - dist / 120);
          return { ic, scale: 1 + k * 0.35, lift: k * 8 };
        });
        // batch writes
        data.forEach(({ ic, scale, lift }) => {
          ic.style.transform = `translate(0, ${-lift}px) scale(${scale})`;
        });
      });
    }
    function onLeave() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      dock.querySelectorAll('.dock-icon').forEach(ic => (ic.style.transform = ''));
    }
    window.addEventListener('mousemove', onMove);
    dock.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      dock.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
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
