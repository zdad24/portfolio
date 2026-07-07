import { useEffect, useRef, useState } from 'react'

/* Shrinks a fixed-cell game grid (Snake, Tetris) to fit whatever
   width its container actually has, instead of a fixed px size that
   overflows the modal on narrow phones. */
export function useFitCell(cols, max = 22, min = 12, gap = 1) {
  const ref = useRef(null);
  const [cell, setCell] = useState(max);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth;
      if (!width) return;
      const fit = Math.floor((width - gap * (cols - 1)) / cols);
      setCell(Math.max(min, Math.min(max, fit)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cols, max, min, gap]);

  return [ref, cell];
}
