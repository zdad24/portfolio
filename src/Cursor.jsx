/* global React */
const { useEffect, useRef } = React;

/* ============================================================
   Custom pixel cursor with subtle trail
   ============================================================ */
function Cursor() {
  const dot = useRef(null);
  const trails = useRef([]);

  useEffect(() => {
    let raf;
    let mx = -100, my = -100;
    let pts = Array.from({ length: 5 }, () => ({ x: -100, y: -100 }));

    function handle(e) {
      mx = e.clientX;
      my = e.clientY;
      const el = e.target;
      const interactive =
        el.closest('a, button, .btn, .dock-icon, .menu-bar .item, .tilt, .glitchable, [data-interactive]');
      if (dot.current) {
        dot.current.classList.toggle('hover', !!interactive);
      }
    }

    function frame() {
      // Lead dot snaps to pointer
      if (dot.current) {
        dot.current.style.transform = `translate(${mx - 2}px, ${my - 2}px)`;
      }
      // Trail eases towards previous positions
      for (let i = pts.length - 1; i > 0; i--) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.35;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.35;
      }
      pts[0].x = mx; pts[0].y = my;
      trails.current.forEach((t, i) => {
        if (!t) return;
        t.style.transform = `translate(${pts[i + 1].x}px, ${pts[i + 1].y}px)`;
        t.style.opacity = 0.6 - i * 0.12;
      });
      raf = requestAnimationFrame(frame);
    }
    window.addEventListener('mousemove', handle);
    raf = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener('mousemove', handle);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          ref={el => (trails.current[i] = el)}
          className="cursor-trail"
          style={{ width: 6 - i, height: 6 - i }}
        />
      ))}
      <div className="cursor" ref={dot}>
        {/* Arrow (default) */}
        <svg className="arrow" width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges">
          {/* black outline */}
          <path d="M2 2 L2 16 L6 12 L8 18 L11 18 L9 12 L14 12 Z"
                fill="var(--ink)" stroke="var(--paper)" strokeWidth="1.5" strokeLinejoin="miter"/>
        </svg>
        {/* Pointer hand (hover) */}
        <svg className="pointer" width="22" height="26" viewBox="0 0 22 26" shapeRendering="crispEdges">
          <path
            d="M5 8 L5 16 L4 16 L4 14 L3 14 L3 16 L4 18 L4 22 L13 22 L13 20 L14 20 L14 18 L15 18 L15 14 L16 14 L16 12 L15 12 L15 10 L14 10 L14 8 L13 8 L13 10 L12 10 L12 4 L11 4 L11 2 L10 2 L10 4 L9 4 L9 10 L8 10 L8 6 L7 6 L7 4 L6 4 L6 6 L5 6 L5 8 Z"
            transform="translate(-1,-1)"
            fill="var(--accent)"
            stroke="var(--ink)"
            strokeWidth="1.2"
            strokeLinejoin="miter"
          />
        </svg>
      </div>
    </>
  );
}

window.Cursor = Cursor;
