import React, { useEffect, useRef, useState } from 'react'

/* ============================================================
   Dock — bottom app dock with magnetic hover scaling
   ============================================================ */
function Dock({ items, onLaunch }) {
  const dockRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  // Auto-hide while scrolling down so the fixed dock never sits on top of a
  // CTA the user is about to click; reappears on scroll-up or near page edges.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const y = window.scrollY;
        const doc = document.documentElement;
        const nearTop = y < 80;
        const nearBottom = y + window.innerHeight > doc.scrollHeight - 140;
        const delta = y - lastY;
        if (nearTop || nearBottom) setHidden(false);
        else if (Math.abs(delta) > 2) setHidden(delta > 0);
        if (Math.abs(delta) > 2) lastY = y;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
    <div className={`dock${hidden ? ' dock-hidden' : ''}`} ref={dockRef}>
      {items.map((it, i) => (
        it.divider ? (
          <span key={i} className="dock-divider"></span>
        ) : (
          <button
            key={it.id}
            className="dock-icon"
            data-tip={it.tip}
            aria-label={it.tip}
            style={it.style || {}}
            onClick={() => onLaunch(it.target)}
          >
            <span className="dock-icon-glyph">{it.icon}</span>
            <span className="dock-icon-caption" aria-hidden="true">{it.shortLabel}</span>
          </button>
        )
      ))}
    </div>
  );
}

export default Dock
