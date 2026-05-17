# zahadadOS · Portfolio

> Zahadad Jarif's retro-OS-flavoured personal portfolio.

A single-page portfolio styled as a pixel-art desktop OS — complete with a functional bash-like terminal, 4 switchable themes, dark/light modes, chiptune sound effects, a konami-code Snake game, and unlockable achievements.

**Live →** [zahadadjarif.tech](https://zahadadjarif.tech)

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)

---

## Quick start

```bash
npm install
npm run dev     # → http://localhost:5173
```

## Build & deploy

```bash
npm run build   # production build → dist/
npm run deploy  # build + wrangler deploy to Cloudflare Workers
```

> Requires `wrangler login` before first deploy.

## Contact form setup

The `/api/contact` endpoint uses [Resend](https://resend.com) for email. After deploying:

```bash
npx wrangler secret put RESEND_API_KEY
```

Paste your Resend API key when prompted. The worker sends messages to `zahadad14@gmail.com`.

## Terminal commands

Type `help` in the terminal to see all commands. Highlights: `whoami`, `git log`, `man zahadad`, `hack`, `matrix`, `coffee`, `ssh rerouteapp.ca`.

## Easter eggs

- **Konami code** (`↑↑↓↓←→←→BA`) — Snake game
- **5 clicks** on the pixel portrait — secret overlay
- 12 unlockable achievements (persisted in localStorage)
- `cat .secrets` — start here

## Stack

| Layer | Tech |
|-------|------|
| UI | React 18 + JSX |
| Build | Vite 8 |
| Styling | Plain CSS (custom properties, 4 theme palettes) |
| Deploy | Cloudflare Workers (with static assets) |
| Email | Cloudflare Pages Functions + Resend |
| Fonts | Press Start 2P, VT323, JetBrains Mono |

## License

MIT © 2026 [Zahadad Jarif](https://zahadad.dev)
