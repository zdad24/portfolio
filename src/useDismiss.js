import { useCallback, useEffect, useRef, useState } from 'react'

const EXIT_MS = 180;

/* Mirrors the .reveal armed→in mount-transition trick for modals: they
   render hidden on the first frame, flip to visible next frame (so the
   entrance actually transitions instead of painting pre-shown), and
   delay unmount by EXIT_MS on close so the exit transition can play
   before the parent removes the modal from the tree. See the
   .modal-backdrop rules in styles.css. */
export function useDismiss(onClose) {
  const [phase, setPhase] = useState('entering'); // entering -> open -> closing
  const timer = useRef(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('open'));
    return () => cancelAnimationFrame(raf);
  }, []);

  const dismiss = useCallback(() => {
    if (timer.current) return;
    setPhase('closing');
    timer.current = setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return [phase, dismiss];
}
