---
target: full site (src/main.jsx)
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-07-08T13-57-10Z
slug: src-main-jsx-full-site
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Contact send/error states are clear; dock's scroll-direction auto-hide has no visible logic to the user, feels twitchy |
| 2 | Match System / Real World | 3 | Terminal/OS metaphor stays coherent and legible to the target audience |
| 3 | User Control and Freedom | 3 | No modal traps found; games folder and portrait-secret both close cleanly |
| 4 | Consistency and Standards | 3 | Button/shadow language is now consistently applied (Quick_cmds fixed) — undercut by dock chrome re-occluding content it promised not to |
| 5 | Error Prevention | 3 | Honeypot + required fields + maxLength on Contact; no client-side email-format check beyond `type="email"` |
| 6 | Recognition Rather Than Recall | 3 | Quick_cmds + always-visible dock captions reduce recall burden well |
| 7 | Flexibility and Efficiency | 3 | Konami code, command history, magnetic buttons serve power users without gating base content |
| 8 | Aesthetic and Minimalist Design | 2 | Dense but organized layout; undercut by a real production contrast failure on 3 of 6 Skills type-badges (see below) |
| 9 | Error Recovery | 2 | Contact shows a generic `✗ {error}` line with no per-field `aria-invalid`/`aria-describedby` or focus-jump to the empty field |
| 10 | Help and Documentation | 3 | `help` command, kbd hints in Hero/About are strong, in-voice, discoverable |
| **Total** | | **28/40** | **Good — solid foundation, two real regressions/misses since the last pass** |

## Anti-Patterns Verdict

**Does this look AI-generated? No.** Both assessments agree: the retro-OS chrome, terminal Easter eggs (`sudo hire zahadad`, `.secrets`), hard-offset shadows, and DESIGN.md's own named rules (Ink-Is-The-Line, Pixel-Caps-Are-Tiny, Functional-Kicker, Accent-Ink-For-Text) hold up under inspection. No gradient hero, no Inter, no tracked-eyebrow spam, no generic feature triad.

**Deterministic scan** (`detect.mjs`, exit code 2, 81 findings): 59/81 (73%) are in `src/tweaks-panel.jsx`, which CLAUDE.md confirms is dev-only and tree-shaken from production — false positives for the shipped experience. Production findings (~22) are mostly literal-color/radius advisories scattered across `About.jsx` (9), `Tetris.jsx` (6, justified — game piece colors need distinct hues), `Hero.jsx` (3), one each in `Achievements.jsx`, `main.jsx`, `Projects.jsx`, `Skills.jsx` — low priority, a token-cleanup pass, not a design failure.

**Browser evidence** (live `detect.js` injection, 48 anti-patterns flagged) surfaced things the design review missed:
- **Confirmed real, high-confidence**: three low-contrast pairs — `#4ea54a` on `#e8dec5` (2.3:1), `#f2c037` on `#e8dec5` (1.3:1), `#b67a35` on `#e8dec5` (2.7:1). I traced these to `Skills.jsx:53-66` — the language-card header bar sets `background: t.hue` with `color: 'var(--paper)'` for the SERPENT (green), ELECTRIC (yellow), and BREW (brown) Pokédex type badges. Paper-white text on a bright yellow or mid-green fill fails AA badly; this is a genuine production bug the LLM review's spot-checks (hero, contact, dock) never reached because it didn't look at Skills.
- **`repeated-section-kickers`** (6× `▸ NN_SECTION`): a false positive per the project's own DESIGN.md — this is documented as the deliberate "Functional-Kicker Rule," not AI-eyebrow scaffolding.
- **`all-caps-body`** and **`line-length`** (~91-153 chars/line, several 37-55 char all-caps spans): plausible in the monospace terminal/About prose blocks where DESIGN.md's 65-75ch measure isn't being enforced — worth a manual look but not independently confirmed against specific elements.
- **`nested-cards`**: flagged multiple times; DESIGN.md explicitly forbids this ("do not invent bare cards outside the window metaphor... nested cards are forbidden"). Not independently traced to a file/line by either assessment — needs verification before treating as confirmed.
- **`tiny-text`** (11px/10px): likely a mix of the intentional 9-11px Press Start 2P label system (correct per DESIGN.md's "Pixel-Caps-Are-Tiny" rule) and possibly other unintended small text — not disambiguated.

The two assessments **partly disagree** on dock occlusion. The design reviewer reproduced it directly via measured element rects (mobile 380×800: Hero's `resume.pdf` button at y:700-744 sits under the dock at y:733-792, on initial load, no scroll needed) and again after a down-then-up scroll gesture over the Projects section. The browser-evidence pass took its screenshot at a different scroll position and saw no overlap there — this isn't a contradiction, it's two different scroll states; the bug is real and was captured with exact coordinates by the design review, just not independently reproduced at the same instant by the second assessment.

## Overall Impression

The five commits since yesterday's critique (contact hardening, reveal "armed" states, layout margins, dock auto-hide) closed three of the last pass's four confirmed issues cleanly — contact form labeling/validation, dock tooltip visibility on mobile, and Quick_cmds' tactile-button opt-out are all genuinely fixed. The dock-occlusion fix, though, swapped one collision pattern for a narrower one: scroll-direction auto-hide still re-shows the dock on top of CTAs at predictable points (mobile load, up-scroll over Projects). And the site picked up a new, unrelated, high-confidence accessibility bug along the way — the Skills type-badge contrast failure — that nobody had looked at before because prior passes focused on Hero/Contact/dock. The throughline across three critiques now: the site's craft is real, but changes to one recruiter-facing surface keep leaving a sibling surface unchecked.

## What's Working

1. **The Hero boot/glitch sequence** — still the strongest single moment on the site, sets tone instantly for all three named audiences.
2. **Contact form hardening** — proper `id`/`name`/`htmlFor`/`required` on every real field, honeypot for spam, disabled-while-sending state. This was last pass's P2 and it's done right, not just patched.
3. **Tactile button system now fully consistent** — Quick_cmds, dock, and primary CTAs all share the same hover-lift/press-collapse contract; no more quiet opt-outs.

## Priority Issues

**[P1] Skills type-badge text fails contrast on 3 of 6 language cards**
Why it matters: `Skills.jsx:53-66` sets `color: 'var(--paper)'` (near-white) as the header-bar text over `background: t.hue` for SERPENT/ELECTRIC/BREW types — measured at 2.3:1, 1.3:1, and 2.7:1 against the DESIGN.md-documented `--poke-green`/`--poke-yellow`/`--poke-type-brew` values, all well under the 4.5:1 AA floor DESIGN.md itself commits to. This is the language name on every card — not decorative, core content.
Fix: swap header-bar text to `var(--ink)` (or a badge-specific dark ink) for the light-hue types, or darken the header fill toward each type's existing "-ink" pattern the way `--accent-ink` already handles this exact problem for the main theme accent.
Suggested command: `/impeccable audit` (or a direct fix — narrowly scoped, same shape as last pass's Hero contrast fix)

**[P1] Dock still occludes CTA content, now via a narrower trigger**
Why it matters: the scroll-direction auto-hide (`Dock.jsx`) fixed the "always visible" version of this bug but reintroduces it at two reproduced points: mobile initial load, where the dock covers Hero's `resume.pdf ↗` button before any user action (y:700-744 vs dock y:733-792 at 380×800), and after any down-then-up scroll gesture over Projects, where the dock lands on the featured card's description text. The auto-hide logic reacts to scroll direction, not to what's underneath it.
Fix: add a proximity/intersection check against known interactive targets (CTA buttons, form submit) before re-showing the dock, or default the dock to hidden-until-first-scroll-up rather than visible-on-load.
Suggested command: `/impeccable layout`

**[P2] Contact error state isn't field-specific**
Why it matters: a failed submit shows a single generic `✗ {error}` line (`Contact.jsx:104-107`) with no `aria-invalid`/`aria-describedby` linking the message to the actual empty field, and no focus jump. Persona Sam (screen-reader) hears "there's an error" with no way to know which of three fields caused it.
Fix: set `aria-invalid` on the offending field(s), point `aria-describedby` at the error text, and move focus to the first invalid field on submit failure.
Suggested command: `/impeccable harden`

**[P2] Quick_cmds presents 7 choices at once**
Why it matters: `About.jsx:803` renders 7 Quick_cmds buttons simultaneously, exceeding the ≤4-items-per-decision-point guideline for a "sampler" UI (the dock's 8 icons are more defensible as persistent global nav, this is a discovery aid competing for the same attention).
Fix: trim to 3-4 curated starter commands, with `help` (already present) as the disclosure path to the rest.
Suggested command: `/impeccable distill`

**[P3] Contact ends the site on its quietest note**
Why it matters: the site's peak (Hero boot/glitch) has no closing counterpart — Contact's success state is a plain inline `✓ sent` line (`Contact.jsx:170-171`) after Education's static content, ending the strongest opening beat on the whole site's weakest visual moment (peak-end rule miss).
Fix: give the send-confirmation a small ceremony consistent with the OS metaphor (a one-line "shutdown"/log-off animation, a terminal-style confirmation), not a scope change to the form itself.
Suggested command: `/impeccable delight`

## Persona Red Flags

**Recruiter (fast skim, needs signal in seconds)**: On mobile, the fastest path to the artifact they came for — `resume.pdf` — is physically covered by dock chrome on first paint, no scroll required (P1 dock).

**Sam (accessibility-dependent, screen reader / keyboard-only)**: Reaches the Skills section and gets three language cards whose names render at ~1.3-2.7:1 contrast (P1 badge) — a low-vision user, not just a screen-reader user, is directly affected here, which is a step beyond last pass's screen-reader-only Contact gap. Separately, a failed Contact submit gives no `aria-invalid` routing (P2), so Sam can't locate the problem field without trial and error.

**Riley (deliberate stress tester)**: The down-then-up scroll gesture over Projects that re-triggers dock occlusion (P1) is exactly the kind of "poke at the edges" interaction this persona tries first, and it reproduces the site's most persistent bug for a third pass in a row.

## Minor Observations

- `line-length`/`all-caps-body` detector flags in About/terminal prose blocks are plausible but unconfirmed against a specific element — worth a manual pass rather than a blind fix.
- `nested-cards` detector flag (DESIGN.md explicitly forbids this) wasn't traced to a location by either assessment this run — flag for the next audit rather than acting on it blind.
- Tetris piece colors and the small scattered `design-system-color` advisories outside `tweaks-panel.jsx` remain low-priority token cleanup, consistent with last pass's assessment.
- Email format isn't validated beyond `type="email"` on Contact — minor, `type="email"` already gets most of the value natively.
