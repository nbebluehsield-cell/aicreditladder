# Brand — the A, the ladder

The mark is a **ladder-frame A**: each leg is **two parallel strokes** (outer + inner rails) meeting at a sharp apex; one horizontal rung in **International Orange** (`#e04e2f`) bridges **only the inner rails** — the Golden Gate hue. The rung is drawn first so the rails cap its ends flush at the channel. It reads as engineered structure, not a generic triangle-with-a-line: wide stance at the feet, one vermillion beat at the climb.

Read `BLUEPRINT.md` for tone and positioning. This document is the visual-system reference.

---

## Palette

One ground, one ink, one accent. A second accent is a tell that something else is wrong — reach for weight, scale, or rule density instead.

| Token              | Hex       | Use                                              |
|--------------------|-----------|--------------------------------------------------|
| `--background`     | `#0c0b0a` | Page ground. Warm near-black, never pure `#000`. |
| `--background-2`   | `#141210` | Lifted sections and stage bands.                 |
| `--foreground`     | `#f2ece0` | Body type and mark legs. Warm bone-white.        |
| `--foreground-dim` | `#c9c0ad` | Secondary text.                                  |
| `--muted`          | `#8a8273` | Eyebrows, datelines, meta.                       |
| `--muted-2`        | `#5a5347` | Quaternary, deliberately low.                    |
| `--gold` / `--bridge` | `#e04e2f` | **The ladder rung.** All CTAs, live indicators, editorial accents. |
| `--gold-bright`    | `#ed6a4c` | Hover state only.                                |
| `--gold-deep`      | `#b83a1f` | Pressed state, deep rules.                       |
| `--teal`           | `#7fb679` | Verification "fresh" signal. Used exclusively on freshness stamps. |
| `--rule`           | `#2a2622` | Primary hairline dividers.                       |
| `--rule-2`         | `#3a332c` | Secondary dividers, softer.                      |

Historical note: `--gold` is a legacy token name. The color is, and has always been, a red-orange signal — first coral-vermilion (`#ff5a3c`), now shifted to the richer Golden Gate International Orange (`#e04e2f`). Keep both token names (`--gold`, `--bridge`) pointing at the same hex so existing class names keep working.

---

## Typography

- **Display**: Instrument Serif, regular + italic. Headlines, masthead, wordmark.
- **Sans**: Inter. Body copy, meta lines, UI.
- **Mono**: JetBrains Mono. Section numbers, chip labels, tabular amounts, button labels.

Pair the italic of Instrument Serif only with the roman of Instrument Serif on the same line ("Free AI credits. _For builders._"). Never italicize Inter or JetBrains Mono.

Mono is uppercase with `letter-spacing: 0.22em` for eyebrows and section numbers. Everywhere else — ledger meta, freshness stamps, fit sentences — use sentence case at a human reading size (≥ 12.5px).

---

## The mark

Canonical geometry on a 24×24 grid:

```
       ▲                 apex (12, 3)
      ▲ ▲                outer + inner rails per leg
     ▲   ▲
    ▲  ═  ▲              rung at y=14 — International Orange,
   ▲       ▲             only between inner rails; ends capped by rails
  ▲         ▲
 ▲           ▲           outer feet (~3.25, 21.75) (~20.75, 21.75)
                          inner feet (~7.85, 21.75) (~16.15, 21.75)
```

| Element       | Spec                                                                 |
|---------------|----------------------------------------------------------------------|
| Rails         | Four segments: apex to each foot (two outers, two inners).        |
| Leg stroke    | `strokeWidth: 2.35` · `linecap: butt`                               |
| Leg color     | `currentColor` — inherits from parent.                              |
| Rung          | Horizontal at `y=14` between inner rails (~9.57 → ~14.43 on x).     |
| Rung stroke   | `strokeWidth: 2.35` · `linecap: butt`                               |
| Rung color    | `#e04e2f` — always. Never themed, never inverted.                    |
| Stacking      | Rung is drawn **first**; inner then outer rails **over** its ends.   |

The rung sits in the channel between inner rails only; outers frame the silhouette so the mark reads as a ladder even before you read the letter.

### Source of truth

| File                                  | Role                                                    |
|---------------------------------------|---------------------------------------------------------|
| `src/components/BrandMark.tsx`        | Inline React SVG. Exports `BRIDGE_COLOR`.               |
| `src/app/icon.svg`                    | 32×32 favicon. Next auto-serves at all sizes.           |
| `src/app/apple-icon.tsx`              | 180×180 iOS home-screen icon (PNG via ImageResponse).   |
| `src/app/opengraph-image.tsx`         | 1200×630 share card (PNG).                              |
| `public/email-signature.html`         | Copy-paste email signature template.                    |

All five files must carry the same geometry and color. If you change the mark, change all five in the same commit.

### Sizing

| Context                    | Size  |
|----------------------------|-------|
| Favicon (browser tab)      | 16 px |
| Masthead (mobile)          | 22 px |
| Masthead (desktop)         | 26 px |
| Inline body reference      | 14 px (hard floor — don't go smaller) |
| iOS home screen            | 180 px (132 px mark on 180 px canvas) |
| OG card (unfurl)           | 200 px (on 1200×630 canvas)           |

### Do

- Keep the rung color (`#e04e2f`) locked. Even in print, even in monochrome layouts, the rung stays orange. It is the single brand beat.
- Let the A legs inherit `currentColor` so the mark works on any ground (dark app, cream letterhead, white email).
- Maintain at least a 2 px padding around the mark in any container.

### Don't

- Don't animate the mark on page load. It is punctuation, not a mascot.
- Don't put a box, a ring, or a tile around the mark. No brand tickets. The mark is the shape.
- Don't add labels, a dot on the apex, or decorative flourishes to the rung. Every addition is a subtraction from the silhouette.
- Don't rotate or skew.
- Don't place the mark on a busy photo. If you must, lay a solid 24 px `#0c0b0a` plate behind it first.
- Don't use the mark without the wordmark on first-impression surfaces (web masthead, email signature, letterhead). The mark supports the wordmark; it replaces it only on favicon/app-icon surfaces where space forbids.

---

## Wordmark

"AI Credit Ladder" set in Instrument Serif, roman, tracking `-0.025em`, 24 px in the masthead. No italics on the wordmark — italic is reserved for editorial flourish ("_For builders._").

Pairing with the mark:

```
[▲] AI Credit Ladder
```

- Gap: 10–12 px at 24 px cap height, scales with mark size.
- Never hyphenate. If space is tight, drop the wordmark and show only the mark.

---

## Email signature & OG share card

Email signature template: `public/email-signature.html`. Open in a browser, select everything between the `<!-- START -->` and `<!-- END -->` markers, paste into your email client. The mark is inline SVG — recipients who block remote content still see it.

OG card: `src/app/opengraph-image.tsx`. Every URL inherits the default card. Per-route overrides go in `src/app/<route>/opengraph-image.tsx` using the same API. The card loads Instrument Serif and JetBrains Mono from Google Fonts at build time so typography matches on-site exactly.
