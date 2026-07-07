---
name: zahadadOS
description: A pixel-art desktop OS portfolio — chunky, tactile, nostalgic, and deliberately hand-built.
colors:
  poke-red: "#cf3a2f"
  poke-red-ink: "#a52a1d"
  poke-yellow: "#f2c037"
  poke-blue: "#2d63b5"
  ball-orange: "#d96b2a"
  ball-orange-ink: "#8f3e12"
  ball-navy: "#1c2c4a"
  ball-court: "#c98a4b"
  poke-type-brew: "#b67a35"
  poke-type-systems: "#a0414a"
  poke-type-data: "#2f7a6a"
  terminal-ink: "#15161a"
  soft-ink: "#2a2a30"
  dim-ink: "#4a4a52"
  boot-paper: "#fbf7eb"
  crt-cream: "#f1ead8"
  cartridge-tan: "#e8dec5"
  deep-sand: "#dccfa8"
  win-light-red: "#ff5f57"
  win-light-amber: "#febc2e"
  win-light-green: "#28c840"
  win-light-red-dark: "#c14a40"
  win-light-amber-dark: "#bf8d1e"
  win-light-green-dark: "#1f9430"
typography:
  display:
    fontFamily: "VT323, 'JetBrains Mono', monospace"
    fontSize: "clamp(64px, 11vw, 168px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.5px"
  headline:
    fontFamily: "VT323, 'JetBrains Mono', monospace"
    fontSize: "clamp(48px, 7vw, 96px)"
    fontWeight: 400
    lineHeight: 0.95
  title:
    fontFamily: "VT323, 'JetBrains Mono', monospace"
    fontSize: "clamp(32px, 4vw, 56px)"
    fontWeight: 400
    lineHeight: 0.95
  body:
    fontFamily: "'JetBrains Mono', Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Press Start 2P', VT323, monospace"
    fontSize: "9px"
    fontWeight: 400
    letterSpacing: "1px"
rounded:
  hairline: "1px"
  xs: "2px"
  sm: "3px"
  md: "4px"
  lg: "8px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button:
    backgroundColor: "{colors.boot-paper}"
    textColor: "{colors.terminal-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-hover:
    backgroundColor: "{colors.poke-red}"
    textColor: "{colors.boot-paper}"
  button-primary:
    backgroundColor: "{colors.terminal-ink}"
    textColor: "{colors.boot-paper}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.poke-red}"
    textColor: "{colors.boot-paper}"
  chip:
    backgroundColor: "{colors.cartridge-tan}"
    textColor: "{colors.terminal-ink}"
    rounded: "{rounded.sm}"
    padding: "4px 9px"
  chip-accent:
    backgroundColor: "{colors.poke-red}"
    textColor: "{colors.boot-paper}"
    rounded: "{rounded.sm}"
    padding: "4px 9px"
  input:
    backgroundColor: "{colors.cartridge-tan}"
    textColor: "{colors.terminal-ink}"
    typography: "{typography.body}"
    padding: "10px 12px"
  window:
    backgroundColor: "{colors.boot-paper}"
    textColor: "{colors.terminal-ink}"
    rounded: "{rounded.md}"
  window-bar:
    backgroundColor: "{colors.cartridge-tan}"
    textColor: "{colors.terminal-ink}"
    height: "32px"
  dock-icon:
    backgroundColor: "{colors.boot-paper}"
    textColor: "{colors.terminal-ink}"
    rounded: "{rounded.md}"
    size: "44px"
---

# Design System: zahadadOS

## 1. Overview

**Creative North Star: "The Boot Disk"**

zahadadOS is a portfolio that boots like a beloved retro operating system. You arrive to a BIOS log scrolling to `READY.`, a name that glitches into focus, a draggable-feeling window stack, a dock at the bottom, a menubar with a live clock, chiptune blips, and a games folder hiding behind a Konami code. The OS framing is not decoration laid over a résumé — it *is* the brand. Every surface is a window; every action has a sound; every corner rewards curiosity.

The mood is **nostalgic, playful, and warm**: cream-paper backgrounds with a faint dot-grid like an old desk blotter, a soft CRT scanline in dark mode, bitmap typefaces, and primary-color accents borrowed from a Pokémon cartridge (with a Basketball theme as the alternate). Underneath the fun, the craft is real and precise — the playfulness reads as confidence, not as a gimmick. The visitor should think *"how did they build this?"* not *"which template is this?"*

This system **explicitly rejects** the generic SaaS landing page (Inter font, gradient hero, three identical feature cards, tracked-uppercase eyebrows on every section) and the stiff corporate résumé (a sterile PDF pretending to be a webpage). It also rejects retro that sacrifices legibility — the nostalgia never wins against contrast or speed.

**Key Characteristics:**
- Everything lives inside macOS-meets-DOS **window chrome** — title bar with traffic lights, body, status bar.
- **Hard-offset shadows, never blur** — surfaces read like printed stickers or physical UI tiles.
- **Bitmap + monospace type only** — Press Start 2P, VT323, JetBrains Mono. The mono is literal (this is an OS), not costume.
- **Two themes × two modes** — Pokémon / Basketball, light / dark — driven entirely by CSS custom properties.
- **Chunky, tactile interaction** — 2px ink borders, press-to-collapse-shadow buttons, a custom pixel cursor.

## 2. Colors

A warm cream-and-ink base lit by saturated, cartridge-bright accents; depth comes from solid ink, never from gray gradients. Every value is a CSS custom property in `src/styles.css` and re-binds across `[data-theme]` / `[data-mode]`.

### Primary
- **Poké Red** (`#cf3a2f`): The default accent (`--accent`) under the Pokémon theme. Drives **fills, borders, hover states, the giant hero period, focus rings, and `::selection`** — i.e. anywhere it's a shape or large display, not small body text. In dark mode it brightens to `#ff5b4d` so it keeps glowing against `#1c1d22`.
- **Poké Red Ink** (`#a52a1d`): The text-safe accent (`--accent-ink`) under the Pokémon theme. Used for **accent-coloured small text on light surfaces** — section kickers (`▸ NN_…`), links, inline emphasis like `@ 4D`. The bright Poké Red only manages ~3.8–4.2:1 on cream/tan; this deep step clears 4.5:1. In dark mode `--accent-ink` tracks the bright accent (dark surfaces don't need the deeper value).
- **Court Orange** (`#d96b2a`): The primary accent under the Basketball theme (`--accent`), brightening to `#ff8a3d` in dark mode. Same fill/border/large-display roles as Poké Red — the surface mechanics never change, only the hue.
- **Court Orange Ink** (`#8f3e12`): The text-safe Basketball accent (`--accent-ink`); same role as Poké Red Ink.

### Secondary
- **Pikachu Gold** (`#f2c037`) / **Jersey Navy** (`#1c2c4a`): The `--accent-2` slot per theme. Used sparingly for secondary emphasis and theme-glyph fills.
- **Trainer Blue** (`#2d63b5`) / **Hardwood** (`#c98a4b`): The `--accent-3` slot. Trainer Blue also appears in the hero glitch text-shadow.

### Neutral
- **Terminal Ink** (`#15161a`): The do-everything dark — body text, and crucially **every border and shadow** (`--line`). In dark mode this and the paper swap: ink becomes the cream `#f1ead8`.
- **Dim Ink** (`#4a4a52`): Muted/secondary text (`--ink-mid`) — meta labels, captions, status bars. Verified ≥6:1 on cream and paper; it is *not* a low-contrast gray.
- **Soft Ink** (`#2a2a30`): An intermediate dark for the rare mid-weight text.
- **Boot Paper** (`#fbf7eb`): The lightest surface (`--paper`) — window bodies, buttons, the inside of the ID card.
- **CRT Cream** (`#f1ead8`): The desktop background (`--cream`), carrying the faint dot-grid.
- **Cartridge Tan** (`#e8dec5`): The recessed surface (`--cream-2`) — window title bars, status bars, the dock, the menubar, chips, inputs, link cards.
- **Deep Sand** (`#dccfa8`): The deepest cream (`--cream-deep`), for the occasional extra-recessed panel.

### Pokédex Type-Chart Hues (Skills section only)
Each language card in the Pokémon-flavor Skills view gets a "type" badge (`SERPENT`, `ELECTRIC`, `METAL`, `BREW`, `SYSTEMS`, `DATA`) styled after a real Pokédex type chart. Three types reuse core theme tokens (`--poke-green`, `--poke-yellow`, `--poke-blue`); the other three — **Brew** (`--poke-type-brew`, `#b67a35`), **Systems** (`--poke-type-systems`, `#a0414a`), **Data** (`--poke-type-data`, `#2f7a6a`) — are a small, bounded, named token set reserved *only* for this badge system, the same way real Pokémon types span more hues than a brand's core accent palette. Each has a brightened dark-mode override. **Don't** reuse these tokens outside the Skills type badges — they are not general-purpose accents.

### Window-Control Lights (fixed system colors)
The three macOS-style traffic-light dots on every window bar (and the mini browser-bar on project cards) are **deliberately theme-independent** — a close/minimize/maximize light reads as red/amber/green in any OS skin, so they are NOT re-bound per theme.
- **Light mode**: red `#ff5f57`, amber `#febc2e`, green `#28c840`.
- **Dark mode**: dimmed to red `#c14a40`, amber `#bf8d1e`, green `#1f9430` so they don't glare against the dark chrome.

### Named Rules
**The Ink-Is-The-Line Rule.** Borders and shadows are *always* `--line` (Terminal Ink in light, CRT Cream in dark) at full opacity — never a softened gray, never a tint. The hard ink edge is the signature; weaken it and the OS turns to mush.

**The Theme-Mechanics-Stay-Fixed Rule.** Switching theme or mode re-binds hue and surface tokens only. Layout, border weight, shadow offset, and type never change. A component must look correct in all four combinations (Pokémon/Basketball × light/dark) or it is unfinished.

**The Accent-Ink-For-Text Rule.** The bright `--accent` is for *shapes* — fills, borders, hover states, focus rings, large display glyphs. Accent-coloured **small text on a light surface always uses `--accent-ink`** (the deep step), because the bright accent fails 4.5:1 on cream/tan. The one exception is accent text on a *dark* local surface (the portrait-secret overlay, the terminal, game modals), where the bright accent already passes and is correct.

**The Easter-Egg-Palette Exception.** The `HackOverlay` and `MatrixOverlay` components (`About.jsx`) are full-screen, self-dismissing, fixed-black-background gags — a "system breach" gag and a Matrix rain gag. They intentionally use a standalone hacker-green palette (`#4aff7a`, `#5cff7a`, `#b0ffcb` and their `rgba` translucent steps) that is *not* part of the four-theme token system, because these overlays are meant to look like a foreign terminal breaking into the OS, not like a themed zahadadOS surface. This is a deliberate, scoped exception — don't extend this palette to any other component, and don't re-theme it to `--accent` (that would defeat the gag).

## 3. Typography

**Display Font:** VT323 (with `'JetBrains Mono', monospace` fallback) — a tall, crisp bitmap terminal face for headings.
**Body Font:** JetBrains Mono (with `Menlo, monospace`) — the workhorse for all prose, UI, and the terminal itself, at weights 400 and 600.
**Label/Pixel Font:** Press Start 2P — a chunky 8-bit face reserved for tiny uppercase labels, dock glyphs, and the brand mark.

**Character:** Three monospaced/bitmap voices that read as one coherent machine. This is the rare brief where mono is *literal*, not a "technical" affectation — the product is an operating system. Hierarchy comes from face and size, not from a serif/sans contrast axis.

### Hierarchy
- **Display** (`.pixel-xl`, VT323 400, `clamp(64px, 11vw, 168px)`, line-height 0.95): The hero name only. Pairs with the glitch type-in animation. VT323 is a bitmap face, so its large ceiling reads as pixel-poster, not as shouting.
- **Headline** (`.pixel-lg`, VT323 400, `clamp(48px, 7vw, 96px)`): Major standalone moments.
- **Title** (`.pixel-md`, VT323 400, `clamp(32px, 4vw, 56px)`): Section `<h2>`s inside `WinHeading`.
- **Body** (JetBrains Mono 400, 14px, line-height 1.55): All prose and UI copy. Keep measure at 65–75ch (`max-width` ~460–640px on text blocks).
- **Label** (`.label`, Press Start 2P 400, 9px, letter-spacing 1px, UPPERCASE): Section kickers (`▸ 05_CONTACT`), field labels, status text. `.label-md` is the 11px / 1.5px-tracked variant.

### Named Rules
**The Pixel-Caps-Are-Tiny Rule.** Press Start 2P is only ever used small (8–11px). It is a label and glyph face; setting it large makes blocky text unreadable. Headlines belong to VT323.

**The Functional-Kicker Rule.** The `▸ NN_SECTION` kickers are a *deliberate, named system* (terminal prompt + numbered route), not generic AI eyebrows — they read as OS navigation. Keep them consistent; don't sprinkle unrelated tracked-caps labels elsewhere.

## 4. Elevation

**Hard-offset sticker depth — no blur, ever.** Depth in zahadadOS is a single solid offset shadow in `--line`, with zero blur and zero spread. Surfaces look like printed stickers or physical UI tiles snapped onto the desk, not like floating glass. The whole system is flat-and-stacked, and the only "soft" depth anywhere is the optional CRT scanline overlay in dark mode.

### Shadow Vocabulary
- **Window shadow** (`box-shadow: 6px 6px 0 0 var(--ink)`; `4px 4px` under 480px): The cornerstone elevation, on every window, the dock, and the portrait card. `--win-shadow`.
- **Button rest** (`box-shadow: 3px 3px 0 0 var(--line)`): Default chunky lift on buttons and link cards.
- **Button hover** (`box-shadow: 5px 5px 0 0 var(--line)` + `translate(-2px, -2px)`): The button rises toward the cursor.
- **Button press** (`box-shadow: 0 0 0 0 var(--line)` + `translate(2px, 2px)`): The shadow fully collapses and the button sits down into the desk — the signature tactile click.

### Named Rules
**The No-Blur Rule.** `box-shadow` blur and spread radii are always `0`. A blurred or soft shadow anywhere in this system is a bug. Glassmorphism and ambient drop-shadows are forbidden.

**The Press-Collapses-Depth Rule.** Interactive elements map their shadow to state: larger offset on hover, zero offset on `:active`. The element physically travels the distance the shadow loses. Don't animate a button without moving its shadow to match.

## 5. Components

### Windows (signature component)
The cornerstone. Every section is a `<Win>`: a 2px-ink-bordered card (`border-radius: 4px`) with the `6px 6px 0 0` shadow, made of three parts — a 32px **title bar** (three traffic-light dots, centered mono title, right-aligned meta), a **body** (32px padding; 20px on mobile), and a **status bar** (top-bordered, `--ink-mid` mono text, left/right slots like `// reach out` and `READY`). Always carries the `reveal` class for scroll-in. Windows are the only "container" — do not invent bare cards outside the window metaphor.

### Buttons
- **Shape:** Sharp, barely-rounded (`border-radius: 3px`), 2px `--line` border, `10px 18px` padding, JetBrains Mono 13px/500.
- **Default (`.btn`):** Boot Paper background, ink text, `3px 3px 0 0` shadow.
- **Primary (`.btn-primary`):** Terminal Ink background, paper text — the dominant CTA.
- **Hover:** Fill flips to `--accent` with paper text, rises `translate(-2px,-2px)`, shadow grows to `5px 5px`.
- **Active:** `translate(2px,2px)`, shadow collapses to `0`. Often wrapped in `<Magnetic>` so it leans toward the cursor.

### Chips
- **Style:** Cartridge Tan background, 1.5px `--line` border, `border-radius: 3px`, JetBrains Mono 11px. `.chip-solid` = ink fill / paper text; `.chip-accent` = accent fill / paper text.
- **Use:** Tech tags and inline metadata.

### Inputs / Fields
- **Style:** Cartridge Tan background, 2px `--line` border, no border-radius, `10px 12px` padding, JetBrains Mono 13px. Paired with a tiny Press Start 2P label above (`8px`, `--ink-mid`). Textareas resize vertical, `min-height: 96px`.
- **Focus:** Global `:focus-visible` ring — 2px `--accent` outline, `2–3px` offset. No glow.
- **Cursor:** `cursor: none` (the custom pixel cursor handles it); falls back to `auto` on touch / no-hover devices.

### Navigation
- **Dock** (bottom): Cartridge Tan bar, 2px border, `border-radius: 8px`, window shadow. 44px paper icon tiles (36px on mobile) with Press Start 2P glyphs; hover lifts `translateY(-4px) scale(1.08)`, fills accent, and pops an ink tooltip above.
- **Menu bar** (top, fixed): 36px Cartridge Tan strip with `backdrop-filter: blur(6px)`, a Press Start 2P brand mark + theme glyph, hover-inverting items (ink bg / paper text), and a right-aligned live clock (hidden on mobile).

### Custom Cursor
A fixed 22px pixel SVG cursor (`--z-cursor: 9999`) that swaps arrow→pointer on hover, trailed by a small accent-colored square. Disabled under `@media (hover: none)`. Part of the OS illusion — never replace it with the system cursor on desktop.

## 6. Do's and Don'ts

### Do:
- **Do** wrap every new section in `<Win>` with `id`, `title`, `meta`, and a `status`, and keep the `reveal` class for scroll-in.
- **Do** use `var(--accent)`, `var(--ink)`, `var(--paper)`, `var(--cream-2)`, `var(--line)` etc. — never hardcoded hex — so all four theme×mode combinations stay correct.
- **Do** keep borders and shadows at full-opacity `--line` with **zero blur** (`Npx Npx 0 0 var(--line)`).
- **Do** map interaction to depth: hover grows the offset shadow, `:active` collapses it to `0` and translates the element down.
- **Do** reserve VT323 for headings, Press Start 2P for tiny uppercase labels/glyphs, and JetBrains Mono for everything else.
- **Do** keep `--ink-mid` (#4a4a52) for muted text — it is verified ≥4.5:1 on cream and paper. Test new text colors for contrast before shipping.
- **Do** use `--accent-ink` for accent-coloured small text on light surfaces (kickers, links, inline emphasis), and reserve the bright `--accent` for fills, borders, hover, focus rings, and large display.
- **Do** honor reduced motion: respect both `@media (prefers-reduced-motion)` and the in-app `html[data-motion="reduced"]` toggle (kills reveals, CRT overlay, glitch, tilt).

### Don't:
- **Don't** ship the **generic SaaS landing page** — no Inter/DM Sans, no gradient hero, no three identical icon-heading-text feature cards, no decorative tracked-uppercase eyebrows outside the deliberate `▸ NN_SECTION` system.
- **Don't** ship anything that reads as a **stiff corporate résumé** — keep the voice wry and the OS framing intact; never strip the personality to look "professional."
- **Don't** use blurred, soft, or ambient shadows, or glassmorphism. The only soft effect allowed is the dark-mode CRT scanline overlay.
- **Don't** set Press Start 2P larger than ~11px, or VT323 as body text.
- **Don't** invent bare cards or containers outside the window metaphor; nested cards are forbidden.
- **Don't** let nostalgia beat legibility or performance — no low-contrast gray text on cream, no effects that drop frames.
- **Don't** set the bright `--accent` as small body text on cream/tan — it fails 4.5:1. Use `--accent-ink`.
- **Don't** introduce rounded "soft" UI (large radii, pill buttons) — corners are sharp (2–8px max) and edges are hard.
