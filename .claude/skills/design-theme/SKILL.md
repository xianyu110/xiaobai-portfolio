---
name: design-theme
description: Give the site a distinctive visual identity — palette, typography, and a signature element derived from the product brief. Use for EVERY new website build (as part of the quick-start flow) and whenever the user asks to restyle, 美化, 换风格, or complains the site looks generic/templated. Never ship the template's default look.
---

# Design Theme — make it unmistakable

You are the design lead. The template's stock look (warm cream background,
high-contrast serif display, terracotta accent) is a PLACEHOLDER, not a
design. Shipping it unchanged — or lightly tinted — is a failure, no matter
how clean it looks. Every site you build must have a visual identity derived
from ITS OWN product, audience, and brief.

## 1. Ground the direction in the subject

Before touching code, decide and state (in the user's language):

- **Subject & audience** — what is this product, who uses it?
- **One-line direction** — e.g. "AI 视频站 → 影院暗场:近黑底、荧光青点缀、宽银幕比例的卡片" not "modern and clean".
- If the brief specifies style ("深色 + 紫色渐变"), that wording WINS —
  follow it exactly and completely (dark means `:root` defaults to the dark
  palette, not just a toggle).

The subject's own world (film, music, code, food, finance…) is where
distinctive choices come from.

**Banned clichés** (the tells of AI-generated design — never use unless the
brief literally asks for them):

- Gradient-filled headline text, especially cyan→purple/pink
- Neon-glow pill buttons on a near-black background
- Purple/violet as the default accent for anything "AI"
- Cream background + high-contrast serif + terracotta accent (the stock look)
- Near-black + one acid green/vermilion accent as the whole identity
- Ambient gradient orbs / light beams as hero background filler
- Emoji as decoration in hero badges or headings
- Inter for display type, or keeping the default Inter + Libre Baskerville pair

## Direction library — pick ONE that fits, then adapt

Don't invent from a blank page (free-form invention converges to the clichés
above). Choose the direction that best fits the product, then push it with
subject-specific details:

1. **Cinematic still** (video/film/photo tools) — near-black, letterboxed
   full-bleed imagery, warm single highlight; display `Bebas Neue` or
   `Anton`, body `Inter Tight`. Signature: the hero IS a frame — 21:9 media
   with burned-in captions, not a headline over glow.
2. **Terminal / mono** (dev & AI infra) — paper or #0c0f0c, `JetBrains Mono`
   accents, prompt-style typed hero, blinking caret; borders not shadows.
3. **Soft brutalism** (creative tools, indie) — one solid saturated bg,
   2px borders, hard offset shadows, zero gradients; `Space Grotesk` +
   `IBM Plex Sans`. Signature: chunky bordered cards that overlap the grid.
4. **Editorial magazine** (content, blogs, agencies) — ink on warm white,
   exposed grid rules, drop caps or oversized serif; `Fraunces` +
   `Source Sans 3`. Signature: headline typography as the artwork.
5. **Product-first light** (SaaS dashboards) — white, tinted large shadows,
   the product screenshot IS the hero thesis; `Plus Jakarta Sans`.
6. **Swiss data** (analytics, finance) — white, visible 12-col grid, one red
   or cobalt accent, huge tabular numbers; `Inter Tight` + `IBM Plex Mono`
   for figures. Signature: a real data visual, not an illustration.
7. **Playful geometric** (consumer, education) — 2–3 bright solid blocks,
   XXL radius, sticker-like cards; `Baloo 2` or `Nunito` display.
8. **Luxury dark** (premium, jewelry, pro tools) — charcoal (not black),
   hairline gold/brass rules, generous letter-spacing; `Cormorant Garamond`
   display used sparingly + `Inter Tight` body.
9. **Organic / natural** (health, food, lifestyle) — earthy oklch palette,
   humanist serif `Lora`, soft irregular shapes or real photography.

All display fonts above are installable as `@fontsource/*` packages. Mixing
two directions is fine; landing on none of them and reinventing "dark +
gradient + glow" is not.

## 2. Plan tokens before editing

Write a compact plan first:

- **Palette**: 4–6 named colors with oklch values (背景 / 前景 / 主色 /
  强调 / 静音)。Light AND dark variants — or commit to one mode if the brief
  demands it.
- **Type pairing**: a characterful display face + a complementary body face
  (NOT the default Inter + Libre Baskerville pair). Pick from Google Fonts
  available via `@fontsource-*` packages; check availability with
  `pnpm add @fontsource-variable/<name>` or `@fontsource/<name>`.
- **Signature**: ONE memorable element that embodies the brief (a hero
  treatment, an ambient motion, a distinctive card geometry, a type moment).
  Spend your boldness there; keep everything else quiet.

Critique the plan once: if any part would appear for ANY similar brief, it's
a default, not a choice — revise it.

## 3. Apply — where things live

- **Colors**: `src/styles/globals.css` — all tokens are oklch CSS variables
  in `:root` (light) and `.dark`. Update BOTH blocks coherently:
  `--background --foreground --card --popover --primary --secondary --muted
  --accent --border --input --ring --radius` and the `--sidebar-*` family.
  Dark-by-default briefs: put the dark palette in `:root` and set
  `defaultTheme="dark"` on the ThemeProvider in `src/routes/__root.tsx`.
- **Fonts**: install via `pnpm add @fontsource-variable/<font>`, import in
  `src/routes/__root.tsx`, update `--font-sans` / `--font-serif-display` in
  `globals.css`. Remove imports of fonts you no longer use.
- **Blocks**: rewrite `src/blocks/*` (hero, features, pricing, header,
  footer) to carry the direction — hero is the thesis, open with the most
  characteristic thing in the product's world. Blocks are disposable; the
  primitives in `src/components/` are not.
- **Radius / density / motion**: `--radius`, section spacing, and at most a
  couple of deliberate animations. Respect `prefers-reduced-motion`.

## 3.5 Deep reference — references/anti-slop.md (MANDATORY reads)

`references/anti-slop.md` (vendored "tasteskill", battle-tested on real LLM
landing-page output) is the authority on what reads as AI-generated. At
minimum:

- Before planning: read its **Section 0** (brief inference — declare a
  one-line Design Read: "Reading this as: <page kind> for <audience>, with a
  <vibe> language") and **Section 1** (the three dials).
- Before writing blocks: read its **Section 9 "AI TELLS"** in full — dozens
  of banned patterns (gradient headline text, glow buttons, decorative
  status dots, section-number eyebrows, em-dash ban, fake div screenshots,
  filler verbs like "Elevate/Seamless/Unleash", generic names/numbers…).
- Before declaring done: run its **Section 14 Pre-Flight Check** and fix
  every failing box.

Note the adaptation header at the top of that file: its design-system /
Next.js sections do NOT apply to this template.

## 4. Verify

- Load the homepage in BOTH light and dark (or confirm the single committed
  mode) — no unreadable text, no default-cream leftovers.
- Check text contrast on primary buttons and muted text.
- Screenshot-level self-critique: would this be mistaken for the stock
  template — or for any item on the banned-cliché list? If yes, iterate once
  more before telling the user it's done.
