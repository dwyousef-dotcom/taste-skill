# sessions-dynamo.com redesign (tasteskill)

A drop-in static replacement for https://sessions-dynamo.com/, redesigned with
`skills/taste-skill/SKILL.md`. No build step: HTML + one CSS file + one JS file.

## Design read

> Redesign-overhaul of a trust-first B2B pilot-offer page for skeptical
> independent pharmacy owners arriving from cold outreach, with a calm,
> plain-spoken, credibility-forward language, leaning toward native CSS,
> self-hosted type, and restrained motion.

Dials: `DESIGN_VARIANCE: 4 / MOTION_INTENSITY: 3 / VISUAL_DENSITY: 5`.
The trust-first row of the dial table overrides the redesign-overhaul "+2"
bumps: cold traffic with zero trust is a quiet constraint that beats aesthetics.

## Audit of the live site (what was retired)

- **6 eyebrow labels across 10 sections** (budget: 4, shipped: 1). The
  templated label-headline-intro rhythm was the loudest tell.
- **Em/en-dashes** in the tracker table, footer signature, and mailto body.
  Now zero across all three files.
- **Fake macOS window chrome** (traffic-light dots, title bar) around the
  tracker. Replaced with an honest, labeled sample `<table>`.
- **The value-exchange proof card was hidden below 1100px**, so mobile
  visitors (most cold-outreach clicks) never saw the strongest trust artifact.
  It now sits on the hero photo at every viewport.
- **Google Fonts `<link>`** replaced with self-hosted OFL woff2 (latin,
  variable) plus preload: no third-party request, no late-swap shift.
- **Two same-family boxed comparison sections back to back**
  ("Our side / yours" + "Never ask / do ask"). The second is now an open
  two-list layout with cross/check marks, no boxes.
- **`·`-chained meta line** under the CTA restructured into a sentence.
- Hand-rolled inline icon paths swapped for Phosphor Icons (MIT) glyphs,
  inlined because the site ships without a build step.

## Preserved (Section 11.C / 11.F)

- All anchor slugs (`#how-it-works`, `#your-part`, `#faq`, `#who`), nav
  labels, page routes (`/blog`, `/privacy`), and form field names
  (`pharmacy, city, website, phone, email`) - nothing downstream breaks.
- Brand: purple `#7A00E6`, Bricolage Grotesque display + Inter body, the
  wordmark dot, pill buttons, both real photos, the copy voice, the cal.com
  link and mailto handoff flow.
- One deliberate CTA-label unification: every booking control now says
  "Book a 15-min call" (the live site mixed "Book a call" / "Book a 15-min
  call", which is a duplicate-intent violation).

## Added

- **Auto dark mode** via CSS variables + `prefers-color-scheme`, tested in
  both modes. Hierarchy and brand purple hold in each.
- **Organization JSON-LD** (founder, address, email) for SEO and legitimacy.
- Reveal-on-scroll via IntersectionObserver only, fully disabled under
  `prefers-reduced-motion` and without JS (`no-js` class).
- Responsive tracker table that collapses to stacked labeled rows on mobile.

## Radius system (documented rule)

Buttons and badges are full pill; panels, cards, and the table are 16px;
inputs are 10px. Applied everywhere, no exceptions.

## Deploying

Copy the contents of this directory to the web root. Image assets are
committed as webp; the OG image still points at the live `/assets/hero.png`
absolute URL. Drop a real headshot at `assets/img/yousef.jpg` and swap the
monogram in the founder block (comment marks the slot) - for a zero-trust
audience, a real face is the single highest-value asset still missing.
