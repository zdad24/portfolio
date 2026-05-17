/* ============================================================
   Tiny Web Audio chirps — chiptune feel without assets.
   ============================================================ */
export const SFX = (() => {
  let ctx = null;
  function ac() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch { ctx = null; }
    }
    return ctx;
  }
  function beep(freq, dur = 0.08, type = 'square', gain = 0.06) {
    const a = ac(); if (!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g); g.connect(a.destination);
    const t = a.currentTime;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t);
    o.stop(t + dur);
  }
  function chord(freqs, dur = 0.12) {
    freqs.forEach(f => beep(f, dur, 'square', 0.04));
  }
  return {
    hover() { beep(660, 0.04, 'square', 0.025); },
    click() { beep(880, 0.06, 'square', 0.045); beep(440, 0.06, 'square', 0.03); },
    theme() { chord([523, 659, 784], 0.18); },
    mode()  { chord([392, 523], 0.14); },
    win()   { chord([523, 659, 784, 1046], 0.28); },
    pickup(){ beep(1320, 0.05, 'square', 0.05); },
    boot()  { chord([262, 392, 523], 0.5); },
  };
})();
