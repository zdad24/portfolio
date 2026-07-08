import React, { useEffect, useRef, useState } from 'react'

/* ============================================================
   Dock — bottom app dock with magnetic hover scaling
   ============================================================ */
function Dock({ items, onLaunch }) {
  const dockRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);

  // Auto-hide while scrolling down so the fixed dock never sits on top of a
  // CTA the user is about to click; reappears on scroll-up or near page edges —
  // but a direction-only heuristic still lands the dock on top of a CTA that
  // happens to sit in its clearance zone (e.g. on initial load, or after a
  // down-then-up flick). So on top of the direction guess, check whether any
  // [data-dock-clear] element (Hero's CTA row, each project's source/demo row)
  // currently overlaps the dock's own footprint, and force it hidden if so —
  // this wins regardless of what the direction heuristic decided.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = null;
    function overlapsProtectedCta(shownTop, shownBottom) {
      const targets = document.querySelectorAll('[data-dock-clear]');
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        if (r.bottom > shownTop && r.top < shownBottom) return true;
      }
      return false;
    }
    function evaluate() {
      raf = null;
      const y = window.scrollY;
      const doc = document.documentElement;
      const nearTop = y < 80;
      const nearBottom = y + window.innerHeight > doc.scrollHeight - 140;
      const delta = y - lastY;
      let next;
      if (nearTop || nearBottom) next = false;
      else if (Math.abs(delta) > 2) next = delta > 0;
      else next = hiddenRef.current;
      if (Math.abs(delta) > 2) lastY = y;

      // Check against the dock's SHOWN position (bottom-anchored, fixed height),
      // not its current getBoundingClientRect — that lags behind mid-transition
      // when going from hidden to visible, which would let it flash over a CTA
      // for one frame before the next scroll event corrects it.
      if (!next && dockRef.current) {
        const bottomOffset = window.innerWidth <= 700 ? 8 : 16;
        const shownBottom = window.innerHeight - bottomOffset;
        const shownTop = shownBottom - dockRef.current.offsetHeight;
        if (overlapsProtectedCta(shownTop, shownBottom)) next = true;
      }
      hiddenRef.current = next;
      setHidden(next);
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(evaluate);
    }
    // Run once on mount so a CTA sitting under the dock on initial load
    // (no scroll event fires) is still caught.
    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
