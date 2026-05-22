# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server (localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Build + serve via Wrangler (Cloudflare Pages emulation)
npm run lint       # ESLint (src/**/*.{js,jsx})
npm run format     # Prettier (writes in place)
npm run gen-og     # Rasterise public/og.svg + public/apple-touch-icon.svg → PNG
```

No test suite exists.

## Architecture

Single-page React 18 + Vite app. All top-level state lives in `App` (`src/main.jsx`):

- **Tweaks** (`useTweaks` + `TWEAK_DEFAULTS`) — holds `theme`, `mode`, `sound`, `crt`, `motion`. Props are drilled down to children that need them.
- **Theming** — applied via `data-theme` / `data-mode` / `data-motion` attributes on `<html>`. CSS custom properties in `src/styles.css` cascade from those selectors (`[data-theme="pokemon"]`, `[data-mode="dark"]`, etc.). Adding a new theme means adding a CSS block there and registering the string in the `THEMES` array in `main.jsx`.
- **Window chrome** (`src/Window.jsx`) — `<Win>` is the macOS-style wrapper used by every section component. Always add `reveal` class for scroll-in animation (already included). `<WinHeading>` renders the section label + h2 inside a window.
- **Sections** — `Hero`, `About`, `Projects`, `Experience`, `Skills`, `Education`, `Contact` are all flat components imported into `main.jsx`. Each wraps its content in `<Win>` with an `id` that the Dock scrolls to.
- **Dock** (`src/Dock.jsx`) — drives navigation. Items with `target: '__games'` or `target: '__home'` get special-cased in `onLaunch`; all other targets are section IDs passed to `scrollTo`.
- **Games** (`src/Games.jsx`) — modal folder opened via Konami code or the Dock. Routes to `Snake`, `Pong`, or `Tetris` components by swapping `active` state.
- **Achievements** (`src/Achievements.jsx`) — registered via `window.AchievementsUnlock(id)` from anywhere in the app. State persisted to `localStorage` key `zj_ach`. The system auto-unlocks `night_owl` on mount if the hour is 0–4.
- **SFX** (`src/sfx.js`) — singleton Web Audio API synth, no audio assets. Always gate calls behind the `t.sound` flag.
- **TweaksPanel** (`src/tweaks-panel.jsx`) — dev-only floating panel, tree-shaken from prod via a top-level `import.meta.env.DEV` conditional await. ESLint ignores this file.

## Deployment

Deployed to Cloudflare Pages. `npm run preview` runs `wrangler pages dev dist` for local emulation. No `wrangler.toml` is required for Pages projects.

## Design tokens

All colours and spacing live in CSS custom properties defined in `src/styles.css`. Use `var(--accent)`, `var(--ink)`, `var(--paper)`, etc. rather than hardcoded hex values so components respect theme switching automatically.
