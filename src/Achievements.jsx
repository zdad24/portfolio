/* global React */
const { useEffect, useState, useRef } = React;

/* ============================================================
   Achievement registry
   ============================================================ */
const ACHIEVEMENTS = {
  explorer: {
    icon: '◈',
    title: 'EXPLORER',
    desc: 'First terminal command. Curiosity detected.',
  },
  hackerman: {
    icon: '▓',
    title: 'HACKERMAN',
    desc: 'Initiated exploit sequence. Nice moves.',
  },
  recruiter_magnet: {
    icon: '✦',
    title: 'RECRUITER_MAGNET',
    desc: '`sudo hire zahadad` — offer extended.',
  },
  curious: {
    icon: '◉',
    title: 'CURIOUS',
    desc: 'Found the secret file. Most don\'t.',
  },
  night_owl: {
    icon: '◑',
    title: 'NIGHT_OWL',
    desc: 'Browsing portfolios past midnight? Relatable.',
  },
  konami_master: {
    icon: '◆',
    title: 'KONAMI_MASTER',
    desc: '↑↑↓↓←→←→BA. You\'ve done this before.',
  },
  portrait_clicker: {
    icon: '◎',
    title: 'PORTRAIT_CLICKER',
    desc: 'Five clicks on my face. Respect the commitment.',
  },
  ai_whisperer: {
    icon: '◐',
    title: 'AI_WHISPERER',
    desc: 'Asked me a question. Got an answer.',
  },
  matrix_fan: {
    icon: '▒',
    title: 'MATRIX_FAN',
    desc: 'Wake up, Neo. You followed the white rabbit.',
  },
  ssh_pirate: {
    icon: '◊',
    title: 'SSH_PIRATE',
    desc: 'Tried to SSH into my server. Audacious.',
  },
  git_historian: {
    icon: '▸',
    title: 'GIT_HISTORIAN',
    desc: 'Checked the commit log. Code is a paper trail.',
  },
  man_page: {
    icon: '□',
    title: 'RTFM',
    desc: 'Read the manual. Old school. Appreciated.',
  },
};

/* ============================================================
   Single toast
   ============================================================ */
function AchievementToast({ achievement, index, onDone }) {
  const [phase, setPhase] = useState('enter'); // enter → stay → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('stay'),  50);
    const t2 = setTimeout(() => setPhase('exit'),  3600);
    const t3 = setTimeout(() => onDone(),          4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const visible = phase === 'stay';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 88 + index * 84,
        right: 20,
        zIndex: 9998,
        background: 'var(--ink)',
        color: 'var(--paper)',
        border: '2px solid var(--accent)',
        padding: '10px 14px',
        boxShadow: '4px 4px 0 0 var(--accent)',
        fontFamily: "'JetBrains Mono', monospace",
        minWidth: 270,
        maxWidth: 320,
        opacity:   phase === 'enter' ? 0 : phase === 'exit' ? 0 : 1,
        transform: phase === 'enter'
          ? 'translateX(20px)'
          : phase === 'exit'
            ? 'translateX(20px)'
            : 'translateX(0)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontSize: 7,
          letterSpacing: 2,
          color: 'var(--accent)',
          fontFamily: "'Press Start 2P', monospace",
          marginBottom: 7,
        }}
      >
        ★ ACHIEVEMENT UNLOCKED
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            fontSize: 22,
            fontFamily: "'Press Start 2P', monospace",
            color: 'var(--accent)',
            lineHeight: 1,
          }}
        >
          {achievement.icon}
        </span>
        <div>
          <div
            style={{
              fontSize: 9,
              fontFamily: "'Press Start 2P', monospace",
              letterSpacing: 1,
              marginBottom: 3,
            }}
          >
            {achievement.title}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
            {achievement.desc}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   System — renders all active toasts + exposes global unlock fn
   ============================================================ */
function AchievementsSystem() {
  const [toasts, setToasts] = useState([]);
  const unlocked = useRef(new Set(JSON.parse(localStorage.getItem('zj_ach') || '[]')));
  const nextId = useRef(0);

  useEffect(() => {
    // Check night owl on mount
    const h = new Date().getHours();
    if (h >= 0 && h < 5) {
      setTimeout(() => window.AchievementsUnlock?.('night_owl'), 2000);
    }

    window.AchievementsUnlock = (id) => {
      if (unlocked.current.has(id)) return;
      const a = ACHIEVEMENTS[id];
      if (!a) return;
      unlocked.current.add(id);
      localStorage.setItem('zj_ach', JSON.stringify([...unlocked.current]));
      const uid = nextId.current++;
      setToasts(ts => [...ts, { uid, achievement: a }]);
    };

    return () => { delete window.AchievementsUnlock; };
  }, []);

  function dismiss(uid) {
    setToasts(ts => ts.filter(t => t.uid !== uid));
  }

  return (
    <>
      {toasts.map((t, i) => (
        <AchievementToast
          key={t.uid}
          achievement={t.achievement}
          index={i}
          onDone={() => dismiss(t.uid)}
        />
      ))}
    </>
  );
}

window.AchievementsSystem = AchievementsSystem;
