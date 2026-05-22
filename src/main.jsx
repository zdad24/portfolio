import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

import { SFX } from './sfx.js'
import Cursor from './Cursor.jsx'
import MenuBar from './MenuBar.jsx'
import Dock from './Dock.jsx'
import Hero from './Hero.jsx'
import About from './About.jsx'
import Projects from './Projects.jsx'
import Experience from './Experience.jsx'
import Skills from './Skills.jsx'
import Education from './Education.jsx'
import Contact from './Contact.jsx'
import GamesFolder from './Games.jsx'
import { AchievementsSystem } from './Achievements.jsx'
import { useTweaks } from './use-tweaks.js'

// TweaksPanel is only loaded in dev so it's excluded from the production bundle
const { TweaksPanel, TweakSection, TweakRadio, TweakToggle } = import.meta.env.DEV
  ? await import('./tweaks-panel.jsx')
  : {};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "pokemon",
  "mode": "light",
  "sound": true,
  "crt": true,
  "motion": "full"
}/*EDITMODE-END*/;

const THEMES = ['pokemon', 'basketball'];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [bootShake, setBootShake] = useState(false);
  const konami = useRef([]);

  /* ───────── always start at top ───────── */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ───────── apply data-theme / data-mode / data-motion on <html> ───────── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
    document.documentElement.setAttribute('data-mode', t.mode);
    document.documentElement.setAttribute('data-motion', t.motion);
  }, [t.theme, t.mode, t.motion]);

  /* ───────── konami code easter egg ───────── */
  useEffect(() => {
    const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    function onKey(e) {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      konami.current = [...konami.current, k].slice(-SEQ.length);
      if (konami.current.join(',') === SEQ.join(',')) {
        konami.current = [];
        setGamesOpen(true);
        if (t.sound) SFX.win();
        window.AchievementsUnlock?.('konami_master');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [t.sound]);

  /* ───────── IntersectionObserver — reveal sections ───────── */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ───────── Sound — bind to interactive hover/click ───────── */
  useEffect(() => {
    if (!t.sound) return;
    function onClick(e) {
      const el = e.target.closest('a, button, .btn, .dock-icon, .menu-bar .item');
      if (el) SFX.click();
    }
    let last = 0;
    function onMove(e) {
      const now = performance.now();
      if (now - last < 90) return;
      const el = e.target.closest('a, button, .btn, .dock-icon');
      if (el && !el.dataset.h) {
        SFX.hover();
        el.dataset.h = '1';
        setTimeout(() => delete el.dataset.h, 250);
        last = now;
      }
    }
    window.addEventListener('click', onClick);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('mousemove', onMove);
    };
  }, [t.sound]);

  /* ───────── helpers ───────── */
  const cycleTheme = () => {
    const idx = THEMES.indexOf(t.theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTweak('theme', next);
    if (t.sound) SFX.theme();
  };
  const toggleMode = () => {
    setTweak('mode', t.mode === 'dark' ? 'light' : 'dark');
    if (t.sound) SFX.mode();
  };
  const toggleSound = () => setTweak('sound', !t.sound);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  /* ───────── dock items ───────── */
  const dockItems = [
    { id: 'home',        icon: '⌂',    tip: 'home',             target: '__home', style: { fontSize: 22 } },
    { id: 'about',       icon: 'ME',   tip: 'about.md',         target: 'about' },
    { id: 'projects',    icon: '⌘P',   tip: 'projects/',        target: 'projects' },
    { id: 'experience',  icon: 'EX',   tip: 'experience.log',   target: 'experience' },
    { id: 'skills',      icon: t.theme === 'pokemon' ? 'DEX' : 'ROS', tip: 'skills', target: 'skills' },
    { id: 'education',   icon: 'EDU',  tip: 'education.txt',    target: 'education' },
    { id: 'contact',     icon: '@',    tip: 'contact.app',      target: 'contact' },
    { divider: true },
    { id: 'games',       icon: '🎮',   tip: 'games/',           target: '__games' },
  ];

  function onLaunch(target) {
    if (target === '__home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (target === '__games') { setGamesOpen(true); if (t.sound) SFX.win(); }
    else scrollTo(target);
  }

  return (
    <>
      <Cursor/>
      <div className="crt-overlay"></div>

      <MenuBar
        theme={t.theme}
        mode={t.mode}
        sound={t.sound}
        onTheme={cycleTheme}
        onMode={toggleMode}
        onSound={toggleSound}
      />

      <main id="desktop">
        <Hero theme={t.theme} onScrollTo={scrollTo}/>
        <About/>
        <Projects/>
        <Experience/>
        <Skills theme={t.theme}/>
        <Education/>
        <Contact/>
      </main>

      <Dock items={dockItems} onLaunch={onLaunch}/>

      {gamesOpen && (
        <GamesFolder
          onClose={() => setGamesOpen(false)}
          onChirp={() => t.sound && SFX.pickup()}
          sound={t.sound}
        />
      )}

      <AchievementsSystem/>

      {import.meta.env.DEV && (
        <TweaksPanel title="Tweaks">
          <TweakSection label="Theme"/>
          <TweakRadio
            label="Skin"
            value={t.theme}
            options={['pokemon', 'basketball']}
            onChange={(v) => setTweak('theme', v)}
          />
          <TweakRadio
            label="Mode"
            value={t.mode}
            options={['light', 'dark']}
            onChange={(v) => setTweak('mode', v)}
          />
          <TweakSection label="Vibes"/>
          <TweakToggle
            label="Sound effects"
            value={t.sound}
            onChange={(v) => setTweak('sound', v)}
          />
          <TweakToggle
            label="CRT scanlines (dark)"
            value={t.crt}
            onChange={(v) => setTweak('crt', v)}
          />
          <TweakRadio
            label="Motion"
            value={t.motion}
            options={['full', 'reduced']}
            onChange={(v) => setTweak('motion', v)}
          />
          <TweakSection label="Tip"/>
          <div style={{ fontSize: 11, color: 'rgba(41,38,27,.72)', lineHeight: 1.5 }}>
            Try the Konami code anywhere on the page — <code style={{ fontFamily: 'ui-monospace, monospace' }}>↑↑↓↓←→←→BA</code>.
          </div>
        </TweaksPanel>
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App/>)
