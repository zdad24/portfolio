# zahadadOS · Portfolio

> Zahadad Jarif's retro-OS-flavoured personal portfolio.

A single-page portfolio styled as a pixel-art desktop OS — complete with a bash-like terminal, 2 switchable themes (Pokémon / Basketball), dark/light modes, chiptune sound effects, a games folder (Snake, Pong, Tetris), and unlockable achievements.

**Live →** [zahadadjarif.tech](https://zahadadjarif.tech)

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)

---

## Quick start

```bash
npm install
npm run dev     # → http://localhost:5173
```

## Build & deploy

```bash
npm run build     # production build → dist/
npm run preview   # build + wrangler pages dev (Cloudflare Pages emulation)
npm run lint      # ESLint (src/**/*.{js,jsx})
npm run format    # Prettier (writes in place)
npm run gen-og    # rasterise public/og.svg + apple-touch-icon.svg → PNG
```

Deployed on Cloudflare Pages. Push to `master` triggers an automatic deploy via the Pages Git integration.

## Contact form setup

The `/api/contact` endpoint uses [Resend](https://resend.com) for email via a Cloudflare Pages Function. After deploying:

```bash
npx wrangler secret put RESEND_API_KEY
```

Paste your Resend API key when prompted. Sends messages to `zahadad14@gmail.com`.

## Terminal commands

Scroll to the **About** section and type into the terminal. Type `help` to list all commands. Highlights: `whoami`, `git log`, `man zahadad`, `hack`, `matrix`, `coffee`, `ssh rerouteapp.ca`.

## Easter eggs

- **Konami code** (`↑↑↓↓←→←→BA`) — opens the games folder (Snake, Pong, Tetris)
- **Dock** — controller icon also opens the games folder directly
- **5 clicks** on the pixel portrait — secret overlay
- 12 unlockable achievements (persisted in `localStorage` under key `zj_ach`)
- `cat .secrets` in the terminal — start here

## Stack

| Layer | Tech |
|-------|------|
| UI | React 18 + JSX |
| Build | Vite 8 |
| Styling | Plain CSS (custom properties, 2 theme palettes) |
| Deploy | Cloudflare Pages |
| Email | Cloudflare Pages Functions + Resend |
| Fonts | Press Start 2P, VT323, JetBrains Mono |

## License

MIT © 2026 [Zahadad Jarif](https://zahadadjarif.tech)
