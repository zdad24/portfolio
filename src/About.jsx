import React, { useEffect, useRef, useState } from 'react'
import { Win, WinHeading } from './Window.jsx'

/* ============================================================
   Terminal boot message
   ============================================================ */
const TERMINAL_BOOT = [
  { type: 'sys', text: 'zahadadOS v1.0 — bash shell · type "help" to see what I can do' },
  { type: 'sys', text: '' },
];

// Sep 1, 2020 — start of CS journey at York University
const UPTIME_START = new Date(2020, 8, 1);

/* ============================================================
   Commands registry
   ============================================================ */
const COMMANDS = {
  help: () => ({
    type: 'block',
    lines: [
      'available commands:',
      '',
      '  whoami          ─ a quick intro',
      '  ls              ─ list available "files"',
      '  cat <file>      ─ read a file',
      '  now             ─ what I\'m working on right now',
      '  fun             ─ non-coding life',
      '  hire            ─ for recruiters',
      '  contact         ─ ways to reach me',
      '  skills          ─ tech stack',
      '  git log         ─ commit history',
      '  man zahadad     ─ the manual',
      '  fortune         ─ wisdom',
      '  coffee          ─ essential',
      '  hack            ─ ¯\\_(ツ)_/¯',
      '  matrix          ─ wake up, Neo',
      '  clear           ─ clear the screen',
      '  exit            ─ nope.',
    ],
  }),

  whoami: () => ({
    type: 'block',
    lines: [
      'zahadad jarif.',
      '2nd-year CS @ York (Lassonde, GPA 3.70).',
      'currently: innovation lab engineer intern @ 4D.',
      'side: co-founding ReRoute — multimodal transit for the GTA.',
      'I build at the intersection of AI tooling, accessibility, and infra',
      'that quietly works.',
    ],
  }),

  ls: () => ({
    type: 'block',
    lines: [
      'total 8',
      'drwxr-xr-x  zahadad   projects/',
      'drwxr-xr-x  zahadad   experience/',
      '-rw-r--r--  zahadad   skills.json',
      '-rw-r--r--  zahadad   education.txt',
      '-rw-r--r--  zahadad   contact.app',
      '-rw-------  zahadad   .secrets   ← try `cat .secrets`',
      '-rw-------  zahadad   .archive   ← try `cat .archive`',
    ],
  }),

  now: () => ({
    type: 'block',
    lines: [
      '▸ shipping AI tooling demos at 4D (1–2 wk cycles)',
      '▸ scaling ReRoute beyond MVP → multi-agency live data',
      '▸ learning Rust + distributed systems on the side',
      '▸ open to fall 2026 internships',
    ],
  }),

  fun: () => ({
    type: 'block',
    lines: [
      "things I love when I'm not in vscode:",
      '  ▸ hooping',
      '  ▸ used bookstores',
      '  ▸ convincing friends their side projects are startup-shaped',
      '  ▸ lofi + frank ocean on repeat',
    ],
  }),

  hire: () => ({
    type: 'block',
    lines: [
      '✓ you came to the right place.',
      '',
      '  resume → https://drive.google.com/file/d/1rFlHwtfOZNfZfsOCvwcbA0SYMjDjZ1O9/view',
      '  email  → zahadad14@gmail.com',
      '  linkedin → in/zahadad-jarif',
      '',
      "  I respond fast. Let's talk.",
      '',
      '  (or try: sudo hire zahadad)',
    ],
  }),

  'sudo hire zahadad': () => ({
    type: 'block',
    lines: [
      '[sudo] password for recruiter: ············',
      'Verifying credentials...',
      '',
      '  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 100%',
      '',
      '  ✓ PROFILE_REVIEWED',
      '  ✓ RESUME_DOWNLOADED',
      '  ✓ OFFER_DRAFTED',
      '  ✓ SLACK_INVITE_SENT',
      '  ✓ ONBOARDING_SCHEDULED',
      '',
      '  status: HIRED ✓',
      '',
      '  → zahadad14@gmail.com  ← (for real though)',
    ],
    onRun: () => window.AchievementsUnlock?.('recruiter_magnet'),
  }),

  contact: () => ({
    type: 'block',
    lines: [
      '@  zahadad14@gmail.com',
      'in linkedin.com/in/zahadad-jarif',
      '</> github.com/zdad24',
      '↗  scroll to contact section for the form',
    ],
  }),

  skills: () => ({
    type: 'block',
    lines: [
      'langs:    Python · JS · TS · Java · C/C++ · SQL · Bash',
      'frame:    React · Next.js · FastAPI · Node · Express',
      'data:     Postgres · MongoDB · Supabase · Firebase · Redis',
      'infra:    Docker · K8s · GCP · Vercel · CI/CD',
      'ai:       OpenAI · Claude · Ollama · pgvector',
    ],
  }),

  'cat projects.txt': () => ({
    type: 'block',
    lines: [
      '▸ EchoAccess — voice-first gov form accessibility',
      '▸ MemoMuse  — voice memo → produced track (6-stage AI pipeline)',
      '▸ RAG API   — k8s-native retrieval API · sub-2s p95',
      '▸ ReRoute   — multimodal transit · live at rerouteapp.ca',
    ],
  }),

  'cat experience.log': () => ({
    type: 'block',
    lines: [
      '2025 ─ now    innovation lab engineer intern @ 4D',
      '2025 ─ now    co-founder @ ReRoute',
      '2024          software engineer @ One Iota Golf',
      '2024          software developer & VP events @ YU Blueprint',
    ],
  }),

  'cat skills.json': () => COMMANDS.skills(),

  'cat education.txt': () => ({
    type: 'block',
    lines: [
      'York University · Lassonde School of Engineering',
      'B.Sc. Hons. Computer Science · GPA 3.70/4.00',
      'expected May 2028',
    ],
  }),

  'cat .secrets': () => ({
    type: 'block',
    lines: [
      '🔒 you found the secret file.',
      '',
      "  there's a Snake game hidden on this page.",
      '  ↑↑↓↓←→←→BA from anywhere to open it.',
      '',
      "  there's also something in the portrait. click it.",
      '',
      '  and if you get really bored, try `ssh rerouteapp.ca`',
    ],
    onRun: () => window.AchievementsUnlock?.('curious'),
  }),

  'cat .archive': () => ({
    type: 'block',
    lines: [
      '.archive — personal log',
      '─────────────────────────────────────',
      '2023: wrote my first React component. ugly. shipped it.',
      '2023: joined YU Blueprint. met people who actually build things.',
      '2024: One Iota Golf — first real prod deploy. 3am push. it worked.',
      '2024: started ReRoute in a coffee shop on a napkin.',
      '2025: 4D internship. shipping AI demos on a 1-week cadence.',
      '2025: ReRoute goes live. real users. real transit data.',
      '─────────────────────────────────────',
      'still writing this.',
    ],
  }),

  'man zahadad': () => ({
    type: 'block',
    lines: [
      'ZAHADAD(1)              User Commands              ZAHADAD(1)',
      '',
      'NAME',
      '       zahadad ─ software engineer, builder, intern',
      '',
      'SYNOPSIS',
      '       zahadad [--intern] [--cofounder] [--open-to-work]',
      '',
      'DESCRIPTION',
      '       Builds at the intersection of AI tooling, accessibility,',
      '       and infrastructure. Currently shipping at 4D. Co-founded',
      '       ReRoute. Based in Toronto. GPA 3.70/4.00.',
      '',
      'OPTIONS',
      '       --intern     Available for fall 2026',
      '       --cofounder  Currently scaling ReRoute',
      '       --contact    zahadad14@gmail.com',
      '',
      'BUGS',
      '       Occasionally ships before the README is written.',
      '',
      'SEE ALSO',
      '       hire(1), whoami(1), contact(1)',
    ],
    onRun: () => window.AchievementsUnlock?.('man_page'),
  }),

  'git log': () => ({
    type: 'block',
    lines: [
      'commit a3f7d91 (HEAD → main)',
      'Author: zahadad <zahadad14@gmail.com>',
      'Date:   just now',
      '    feat: ship portfolio v3. it slaps.',
      '',
      'commit 8c2e4b0',
      'Date:   yesterday',
      '    fix: sleep deprivation → null pointer in decision-making',
      '',
      'commit 1d9f33a',
      'Date:   last week',
      '    feat: ReRoute v2 goes live 🚀',
      '',
      'commit 0b7a2c1',
      '    chore: refactor life goals (again)',
      '',
      '... 847 more commits',
    ],
    onRun: () => window.AchievementsUnlock?.('git_historian'),
  }),

  'git status': () => ({
    type: 'block',
    lines: [
      "On branch main · ahead of 'origin/main' by ∞ commits.",
      '',
      'Changes staged:',
      '  new project ideas',
      '  three half-finished side projects',
      '  untold caffeine consumption',
      '',
      'nothing to commit (working tree extremely busy)',
    ],
  }),

  'git blame': () => ({
    type: 'block',
    lines: ['zahadad zahadad zahadad zahadad zahadad', 'all of it. every line. no regrets.'],
  }),

  fortune: () => {
    const fs = [
      '"Ship it and iterate." ─ every good engineer ever',
      '"chmod +x your_dreams.sh"',
      '"Recursion: see recursion."',
      '"It works on my machine." ─ widely accepted answer',
      '"The best time to start was yesterday. Second best: now."',
      '"There is no patch for human stupidity." ─ Kevin Mitnick',
      '"sudo make me a sandwich." ─ xkcd',
      '"rm -rf node_modules && npm install" ─ the prayer',
    ];
    return { type: 'block', lines: [fs[Math.floor(Math.random() * fs.length)]] };
  },

  coffee: () => ({
    type: 'block',
    lines: [
      'brewing...',
      '',
      '   ( (  )  ( )',
      '    ) (  ) (  )',
      '   ( (  )  ( )',
      '  ┌───────────┐',
      '  │  ~~~ ~~~  │╗',
      '  │  zahadad  ║',
      '  │  fuel     ║',
      '  └───────────╝',
      '',
      'coffee.exe finished. caffeine +18. focus +40.',
    ],
  }),

  'ping zahadad14@gmail.com': () => ({
    type: 'block',
    lines: [
      'PING zahadad14@gmail.com (56 bytes of good vibes)',
      '64 bytes from zahadad: icmp_seq=0 ttl=64 time=0.3ms',
      '64 bytes from zahadad: icmp_seq=1 ttl=64 time=0.2ms',
      '',
      '─── ping statistics ───',
      '2 packets transmitted, 2 received, 0% packet loss',
      'response_time: fast. he actually checks his email.',
    ],
  }),

  'ssh rerouteapp.ca': () => ({
    type: 'block',
    lines: [
      "ssh: connecting to rerouteapp.ca...",
      "The authenticity of host 'rerouteapp.ca' can't be established.",
      'ED25519 key fingerprint is SHA256:zahadad/reroute/v2',
      '',
      'Warning: unauthorized access to ReRoute infra is prohibited.',
      '(it\'s just a transit app, chill)',
      '',
      'Connection refused. Visit → rerouteapp.ca',
    ],
    onRun: () => window.AchievementsUnlock?.('ssh_pirate'),
  }),

  date: () => ({
    type: 'block',
    lines: [new Date().toString()],
  }),

  'uname -a': () => ({
    type: 'block',
    lines: ['zahadadOS 1.0.0 zahadad-mbp arm64 JetBrains/Mono POSIX'],
  }),
  uname: () => ({ type: 'block', lines: ['zahadadOS v1.0 arm64'] }),

  pwd: () => ({ type: 'block', lines: ['/home/zahadad'] }),

  uptime: () => {
    const days = Math.floor((Date.now() - UPTIME_START) / 86400000);
    return { type: 'block', lines: [`up ${days} days — still shipping`] };
  },

  'rm -rf /': () => ({ type: 'block', lines: ['nice try.'] }),
  'rm -rf .': () => ({ type: 'block', lines: ['rm: refusing to erase the portfolio.'] }),
  'sudo rm -rf /': () => ({ type: 'block', lines: ['rm: you may not destroy what you cannot comprehend.'] }),
  'help me': () => ({ type: 'block', lines: ['try `help` (one word)'] }),
  exit: () => ({ type: 'block', lines: ["nice try — there's no escape."] }),

  hack: () => ({ type: 'hack' }),
  matrix: () => ({ type: 'matrix' }),
  clear: () => ({ type: 'clear' }),
};

/* ============================================================
   runCommand — resolves input to a result object
   ============================================================ */
function runCommand(input) {
  const raw = (input || '').trim();
  const cmd = raw.toLowerCase();

  if (!cmd) return { type: 'block', lines: [] };

  // Exact match first
  if (COMMANDS[cmd]) {
    const result = COMMANDS[cmd]();
    result.onRun?.();
    return result;
  }

  // Prefix matches
  if (cmd.startsWith('echo ')) return { type: 'block', lines: [raw.slice(5)] };
  if (cmd.startsWith('sudo ') && cmd !== 'sudo hire zahadad') {
    return { type: 'block', lines: [`${raw}: zahadad is not in the sudoers file. This incident will be reported.`] };
  }
  if (cmd.startsWith('cat ')) return { type: 'block', lines: [`cat: ${raw.slice(4)}: No such file or directory`] };
  if (cmd.startsWith('cd ')) return { type: 'block', lines: [`cd: ${raw.slice(3)}: use ls to see available dirs`] };
  if (cmd.startsWith('ls ')) return COMMANDS.ls();
  if (cmd === 'ls -la' || cmd === 'ls -a') return COMMANDS.ls();

  return { type: 'block', lines: [`zsh: command not found: ${cmd}  →  try \`help\``] };
}

/* ============================================================
   Hack overlay
   ============================================================ */
const HACK_LINES = [
  { t: '> INITIATING EXPLOIT SEQUENCE v4.2.0',            c: 'cmd' },
  { t: '> scanning target: recruiter@company.com',         c: 'cmd' },
  { t: '> [████░░░░░░░░░░░░░░░] 25% — FIREWALL DETECTED', c: 'cmd' },
  { t: '> injecting payload.js...',                        c: 'cmd' },
  { t: '> [████████░░░░░░░░░░░] 45% — BYPASSED',          c: 'cmd' },
  { t: '> decrypting credentials...',                      c: 'cmd' },
  { t: '> [████████████░░░░░░░] 65% — MAINFRAME ACCESSED',c: 'cmd' },
  { t: '> deploying zahadad_resume.pdf (v3, compelling)',  c: 'cmd' },
  { t: '> [████████████████░░░] 85% — UPLOAD IN PROGRESS',c: 'cmd' },
  { t: '> triggering recruiter_attractor.exe',             c: 'cmd' },
  { t: '> [█████████████████████] 100% — COMPLETE',        c: 'cmd' },
  { t: '',                                                  c: 'gap' },
  { t: '  TARGET: inbox@company.com',                      c: 'info' },
  { t: '  PAYLOAD: resume.pdf + portfolio link',           c: 'info' },
  { t: '  RESULT:  interview scheduled ✓',                 c: 'info' },
  { t: '',                                                  c: 'gap' },
  { t: '  (this is a portfolio, not actual hacking)',      c: 'muted' },
  { t: '  (but also: zahadad14@gmail.com)',                c: 'muted' },
];

function HackOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), HACK_LINES.length * 130 + 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.94)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13, padding: 32,
      }}
      onClick={onDone}
    >
      <div style={{ maxWidth: 560, width: '100%' }}>
        <div style={{
          fontSize: 9, letterSpacing: 3, color: '#4aff7a',
          fontFamily: "'Press Start 2P', monospace", marginBottom: 20, opacity: 0.6,
        }}>
          SYSTEM BREACH IN PROGRESS
        </div>
        {HACK_LINES.map((l, i) => (
          <div
            key={i}
            style={{
              lineHeight: 1.7,
              color: l.c === 'cmd' ? '#4aff7a' : l.c === 'muted' ? 'rgba(74,255,122,0.45)' : '#b0ffcb',
              marginBottom: l.c === 'gap' ? 8 : 0,
              opacity: 0,
              animation: 'hackLine 0.15s ease forwards',
              animationDelay: `${i * 0.13}s`,
            }}
          >
            {l.t || '\u00a0'}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 24, right: 24, fontSize: 11, opacity: 0.4 }}>
        click anywhere to close
      </div>
      <style>{`@keyframes hackLine { to { opacity: 1; } }`}</style>
    </div>
  );
}

/* ============================================================
   Matrix overlay
   ============================================================ */
function MatrixOverlay({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 14);
    const drops = Array(cols).fill(0).map(() => Math.random() * canvas.height);
    const chars = 'アァイィウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01';
    let raf;
    let frame = 0;
    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#5cff7a';
      ctx.font = '14px monospace';
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 14, y);
        drops[i] = y > canvas.height && Math.random() > 0.975 ? 0 : y + 14;
      });
      frame++;
      if (frame < 280) raf = requestAnimationFrame(draw);
      else onDone?.();
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000, background: '#000',
        pointerEvents: 'none', animation: 'fadeOut 0.6s ease 3.4s forwards',
      }}
    >
      <canvas ref={ref} style={{ display: 'block' }}/>
      <style>{`@keyframes fadeOut { to { opacity: 0; } }`}</style>
    </div>
  );
}

/* ============================================================
   Terminal
   ============================================================ */
function Terminal({ apiRef }) {
  const [history, setHistory] = useState(TERMINAL_BOOT);
  const [input, setInput]     = useState('');
  const [matrix, setMatrix]   = useState(false);
  const [hack, setHack]       = useState(false);
  const [past, setPast]       = useState([]);
  const [pastIdx, setPastIdx] = useState(-1);
  const inputRef  = useRef(null);
  const scrollRef = useRef(null);
  const exploredRef = useRef(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  async function submit(value) {
    const v = (value || '').trim();
    const out = [...history, { type: 'cmd', text: value || '' }];
    const res = runCommand(v);

    // First real command → explorer achievement
    if (v && !exploredRef.current) {
      exploredRef.current = true;
      setTimeout(() => window.AchievementsUnlock?.('explorer'), 400);
    }

    if (res.type === 'clear') {
      setHistory(TERMINAL_BOOT);
    } else if (res.type === 'matrix') {
      setHistory([...out, { type: 'sys', text: 'wake up, neo.' }]);
      setMatrix(true);
      window.AchievementsUnlock?.('matrix_fan');
    } else if (res.type === 'hack') {
      setHistory([...out, { type: 'sys', text: '// good luck' }]);
      setHack(true);
      window.AchievementsUnlock?.('hackerman');
    } else if (res.type === 'async') {
      const thinkId = `think_${Date.now()}`;
      out.push({ type: 'out', text: res.loadingText, _thinkId: thinkId });
      out.push({ type: 'sys', text: '' });
      setHistory(out);
      if (v) { setPast(p => [v, ...p].slice(0, 30)); setPastIdx(-1); }
      setInput('');
      try {
        const answer = await res.promise;
        setHistory(h => h.map(l => l._thinkId === thinkId ? { type: 'out', text: answer } : l));
      } catch {
        setHistory(h => h.map(l => l._thinkId === thinkId ? { type: 'out', text: 'error: ask again?' } : l));
      }
      return;
    } else {
      if (Array.isArray(res.lines)) {
        res.lines.forEach(l => out.push({ type: 'out', text: l }));
      }
      out.push({ type: 'sys', text: '' });
      setHistory(out);
    }
    if (v) { setPast(p => [v, ...p].slice(0, 30)); setPastIdx(-1); }
    setInput('');
  }

  useEffect(() => {
    if (apiRef) {
      apiRef.current = {
        run: (cmd) => { inputRef.current?.focus(); submit(cmd); },
        focus: () => inputRef.current?.focus(),
      };
    }
  });

  function onKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault(); submit(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(past.length - 1, pastIdx + 1);
      if (next >= 0 && past[next]) { setPastIdx(next); setInput(past[next]); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = pastIdx - 1;
      if (next >= 0) { setPastIdx(next); setInput(past[next]); }
      else { setPastIdx(-1); setInput(''); }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); setHistory(TERMINAL_BOOT);
    }
  }

  return (
    <div
      style={{
        background: 'var(--ink)', color: 'var(--paper)',
        border: '2px solid var(--line)', boxShadow: '4px 4px 0 0 var(--line)',
        fontFamily: "'JetBrains Mono', monospace",
        height: 380, display: 'flex', flexDirection: 'column', cursor: 'text',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* titlebar */}
      <div style={{
        padding: '6px 10px', background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 11, color: 'rgba(255,255,255,0.55)',
      }}>
        <span style={{ display: 'flex', gap: 4 }}>
          <span style={{ width: 9, height: 9, borderRadius: 50, background: '#ff5f57' }}/>
          <span style={{ width: 9, height: 9, borderRadius: 50, background: '#febc2e' }}/>
          <span style={{ width: 9, height: 9, borderRadius: 50, background: '#28c840' }}/>
        </span>
        <span style={{ flex: 1, textAlign: 'center' }}>zahadad@os — bash</span>
        <span>80×24</span>
      </div>
      {/* output */}
      <div
        ref={scrollRef}
        style={{ flex: 1, padding: '14px 16px', overflowY: 'auto', fontSize: 13, lineHeight: 1.55 }}
      >
        {history.map((h, i) => <Line key={i} item={h}/>)}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--paper)' }}>
          <Prompt/>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            autoFocus
            spellCheck={false}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--paper)', fontFamily: 'inherit', fontSize: 'inherit',
              caretColor: 'var(--accent)', cursor: 'text',
            }}
          />
        </div>
      </div>
      {matrix && <MatrixOverlay onDone={() => setMatrix(false)}/>}
      {hack   && <HackOverlay   onDone={() => setHack(false)}/>}
    </div>
  );
}

function Prompt() {
  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      <span style={{ color: 'var(--accent)' }}>zahadad@os</span>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>:</span>
      <span style={{ color: 'var(--accent-3)' }}>~</span>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}> $</span>
      <span style={{ display: 'inline-block', width: 6 }}/>
    </span>
  );
}

function Line({ item }) {
  if (item.type === 'cmd') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
        <Prompt/><span>{item.text}</span>
      </div>
    );
  }
  if (item.type === 'sys') {
    return <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>{item.text || '\u00a0'}</div>;
  }
  // loading line
  if (item._thinkId) {
    return (
      <div style={{ marginBottom: 1, color: 'var(--accent-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 10 }}>◌</span>
        {item.text}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  return <div style={{ marginBottom: 1 }}>{item.text}</div>;
}

/* ============================================================
   Live uptime counter — isolated component so its 1s ticks
   don't re-render the entire About section.
   ============================================================ */
const UptimeTicker = React.memo(function UptimeTicker() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = now - UPTIME_START;
  const y = Math.floor(ms / (365.25 * 24 * 3600 * 1000));
  const d = Math.floor((ms % (365.25 * 24 * 3600 * 1000)) / (24 * 3600 * 1000));
  const h = Math.floor((ms / (3600 * 1000)) % 24);
  const m = Math.floor((ms / (60 * 1000)) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return (
    <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {`${y}y ${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
    </span>
  );
});

/* ============================================================
   Rotating now-playing
   ============================================================ */
const NOW_PLAYING = [
  'lofi · for the deep work',
  'frank ocean · blonde',
  'tame impala · currents',
  'kendrick · GNX',
  'silk sonic · leave the door open',
];
function NowPlaying() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % NOW_PLAYING.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        display: 'inline-block', width: 6, height: 6, borderRadius: 50,
        background: 'var(--accent)', animation: 'pulse 1.4s ease-in-out infinite',
      }}/>
      <span key={i} style={{ animation: 'fadeIn 0.4s ease' }}>{NOW_PLAYING[i]}</span>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: none; } }
      `}</style>
    </span>
  );
}

/* ============================================================
   About window
   ============================================================ */
function About() {
  const termApi = useRef(null);

  return (
    <Win
      title="about.app"
      meta="interactive · type to explore"
      id="about"
      status={{ left: '// who is this guy', right: 'tty1' }}
    >
      <WinHeading
        tag="▸ 00_ABOUT"
        title="hi, I'm Zahadad."
        sub="poke around the terminal below — type `help` to start, or jump to `whoami`, `git log`, `man zahadad`."
      />
      <div className="about-grid">
        <Terminal apiRef={termApi}/>
        <aside
          className="col gap-3"
          style={{
            background: 'var(--cream-2)', border: '2px solid var(--line)',
            padding: 18, boxShadow: '4px 4px 0 0 var(--line)',
          }}
        >
          <div className="label" style={{ color: 'var(--accent)' }}>▸ SYSTEM_INFO</div>
          <Row k="UPTIME"    v={<UptimeTicker/>}/>
          <Row k="LOCATION"  v="Toronto, ON"/>
          <Row k="STATUS"    v={<span><span style={{color:'var(--accent)'}}>●</span> available · fall 2026</span>}/>
          <Row k="BUILDING"  v="ReRoute · multimodal transit"/>
          <Row k="LEARNING"  v="Distributed systems · Rust"/>
          <Row k="LISTENING" v={<NowPlaying/>}/>

          <hr className="dashed-rule" style={{ margin: '8px 0' }}/>
          <div className="label muted">▸ FOCUS_METER</div>
          <Bar label="SHIP_VELOCITY" pct={88}/>
          <Bar label="CAFFEINE"      pct={94}/>
          <Bar label="GIT_COMMITS"   pct={71}/>
          <Bar label="SLEEP"         pct={42}/>

          <hr className="dashed-rule" style={{ margin: '8px 0' }}/>
          <div className="label muted">▸ QUICK_CMDS</div>
          <div className="row wrap" style={{ gap: 6 }}>
            {['help','whoami','git log','man zahadad','hack','coffee','matrix'].map(c => (
              <button
                key={c}
                onClick={() => termApi.current?.run(c)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, padding: '3px 8px',
                  background: 'var(--paper)', border: '1.5px solid var(--line)',
                  cursor: 'none', borderRadius: 2,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </Win>
  );
}

function Row({ k, v }) {
  return (
    <div className="row between center" style={{ fontSize: 12, gap: 8 }}>
      <span className="label" style={{ color: 'var(--ink-mid)', whiteSpace: 'nowrap' }}>{k}</span>
      <span className="mono" style={{ textAlign: 'right' }}>{v}</span>
    </div>
  );
}

function Bar({ label, pct }) {
  const cells = 16;
  const filled = Math.round((pct / 100) * cells);
  return (
    <div className="col gap-2">
      <div className="row between">
        <span className="label" style={{ fontSize: 8, color: 'var(--ink-mid)' }}>{label}</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mid)' }}>{pct}%</span>
      </div>
      <div className="row" style={{ gap: 2 }}>
        {Array.from({ length: cells }).map((_, i) => (
          <span
            key={i}
            style={{
              flex: 1, height: 8,
              background: i < filled ? 'var(--accent)' : 'var(--cream-deep)',
              border: '1px solid var(--line)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default About
