# Product

## Register

brand

## Users

Anyone who lands on zahadadjarif.tech — but three audiences matter most, and the design has to reward all of them on the same surface:

- **Recruiters & hiring managers**, skimming fast, deciding in seconds whether Zahadad is worth a closer look. They need the signal — SWE intern @ 4D, CS @ York, open to Fall 2026 internships, real projects, a resume — to surface without digging.
- **Engineers & eng managers**, who will judge the craft itself. The site has to *be* the proof: clean React, thoughtful interaction, no broken edges. The medium is the portfolio piece.
- **Peers & community**, who explore, find the easter eggs, play a round of Tetris, and remember it. Word-of-mouth and "you have to see this site" are wins.

The job to be done is the same for all of them: leave convinced this person can build delightful, well-made software — and enjoy the few minutes it took to find that out.

## Product Purpose

A personal portfolio reimagined as **zahadadOS** — a single-page site styled as a pixel-art desktop operating system. Boot sequence, bash-like terminal, a dock, switchable themes (Pokémon / Basketball), light/dark modes, chiptune SFX, a games folder (Snake, Pong, Tetris), and unlockable achievements.

It exists because a generic portfolio is forgettable, and Zahadad would rather build something only he would build. Success is dual: the substance (who he is, what he's shipped, how to reach him) lands fast for a skimming recruiter, *and* the experience is memorable enough that someone shares it. The site is simultaneously the message and the demo.

## Brand Personality

**Playful, credible, crafted.** Fun is the hook; competence is the payload. The retro-OS whimsy — glitch type-in, BIOS boot log, playable games, secret overlays — is what makes it memorable, but underneath every gag the work reads as genuinely skilled. Voice is confident and a little wry ("five clicks on my face — either determination or you need a better hobby"), never trying too hard, never corporate.

The bar: a visitor should think *"how did they build this?"*, not *"which template is this?"* Delight and rigor are not in tension here — the polish is part of the joke landing.

## Anti-references

- **Generic SaaS / startup template.** Inter font, gradient hero, three identical feature cards, tracked-uppercase eyebrows on every section, "AI made that" at a glance. The whole point of zahadadOS is to be the opposite of this.
- **Stiff corporate résumé.** A PDF pretending to be a webpage — sterile, voiceless, personality stripped out. The retro-OS framing exists precisely so the content never reads as a dry CV.
- Retro that sacrifices legibility, and effects that hurt performance, are the failure modes to avoid *while* leaning into the theme.

## Design Principles

1. **The site is the proof.** Don't claim craft — demonstrate it. Every interaction, transition, and edge case is a sample of the work. A broken hover state undercuts the whole pitch.
2. **Fun is the hook, signal is the payload.** Whimsy earns attention; substance has to be one glance away the moment attention lands. Never bury "what he does / how to reach him" behind the bit.
3. **Reward depth without gating value.** A 5-second skim gets the recruiter everything they need; exploration unlocks games, achievements, and easter eggs. The bonus is for the curious, never a tax on the busy.
4. **Commit to the bit.** A retro OS done halfway reads as a gimmick; done thoroughly it reads as voice. Consistency of the zahadadOS world — chrome, cursor, sound, type — is what sells it.
5. **Legible and fast, always.** The theme never wins against readability or performance. Pixel aesthetics with real contrast, real responsiveness, and motion that respects the user.

## Accessibility & Inclusion

Target **WCAG 2.1 AA** and hold the line on what's already shipping — don't regress it:

- Body text meets ≥4.5:1 contrast against its surface (watch muted ink on cream/paper); large text ≥3:1.
- Full keyboard navigability with the existing `:focus-visible` rings intact.
- `prefers-reduced-motion` honored, plus the in-app motion toggle (`data-motion="reduced"`) that disables reveals, CRT overlay, glitch, and tilt.
- The custom pixel cursor must never trap or confuse — `cursor: auto` fallback exists for touch / no-hover devices; keep it.
- Light and dark modes both maintain their contrast contracts.
