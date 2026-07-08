import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
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

function ControllerIcon() {
  return (
    <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="2.5" width="21" height="11" rx="3" stroke="currentColor" strokeWidth="1" />
      <rect x="3"   y="6"   width="5"  height="2"   fill="currentColor" />
      <rect x="4.5" y="4.5" width="2"  height="5"   fill="currentColor" />
      <circle cx="15.5" cy="7.5" r="1.5" fill="currentColor" />
      <circle cx="18.5" cy="7.5" r="1.5" fill="currentColor" />
      <rect x="9.5" y="6.5" width="3" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

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
  const isDesktop = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

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

  /* ───────── IntersectionObserver — reveal sections ─────────
     .reveal ships visible by default so no-JS/crawler/headless-capture
     paths never show blank content. Only elements JS can confirm it will
     animate get armed hidden, and a timeout guarantees eventual visibility
     even if the observer never fires (e.g. full-page screenshot tools that
     resize without dispatching a real scroll).

     The fallback only fires if the page never scrolls. A real visitor
     routinely takes longer than the timeout to scroll from the hero down
     to lower sections — an unconditional timeout would force those
     sections into their final "revealed" state off-screen before the
     visitor ever sees them, silently killing every scroll reveal on the
     page. The first scroll event is proof a real, scrolling visitor is
     driving the page, so it cancels the safety net and hands reveals
     back to the observer for the rest of the session. */
  useLayoutEffect(() => {
    const els = document.querySelectorAll('.reveal');
    els.forEach(el => el.classList.add('armed'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));

    let scrolled = false;
    const onScroll = () => { scrolled = true; clearTimeout(fallback); };
    window.addEventListener('scroll', onScroll, { once: true, passive: true });

    const fallback = setTimeout(() => {
      if (!scrolled) els.forEach(el => el.classList.add('in'));
    }, 2000);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
      window.removeEventListener('scroll', onScroll);
    };
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
    { id: 'home',        icon: <span style={{ fontSize: 22, position: 'relative', top: '-5px', lineHeight: 1 }}>⌂</span>, tip: 'home', shortLabel: 'home', target: '__home' },
    { id: 'about',       icon: 'ME',   tip: 'about.md',         shortLabel: 'about',   target: 'about' },
    { id: 'projects',    icon: '⌘P',   tip: 'projects/',        shortLabel: 'work',    target: 'projects' },
    { id: 'experience',  icon: 'EX',   tip: 'experience.log',   shortLabel: 'exp',     target: 'experience' },
    { id: 'skills',      icon: t.theme === 'pokemon' ? 'DEX' : 'ROS', tip: 'skills', shortLabel: 'skills', target: 'skills' },
    { id: 'education',   icon: 'EDU',  tip: 'education.txt',    shortLabel: 'edu',     target: 'education' },
    { id: 'contact',     icon: '@',    tip: 'contact.app',      shortLabel: 'contact', target: 'contact' },
    { divider: true },
    { id: 'games',       icon: <ControllerIcon />, tip: 'games/', shortLabel: 'games', target: '__games' },
  ];

  function onLaunch(target) {
    if (target === '__home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (target === '__games') { setGamesOpen(true); if (t.sound) SFX.win(); }
    else scrollTo(target);
  }

  return (
    <>
      {isDesktop && <Cursor/>}
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
