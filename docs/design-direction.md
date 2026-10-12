# Design direction

Go Pro Home Improvements, Kissimmee. Owner-operated painting, drywall, power washing, trim, and the jobs around them. The marketing copy stays plain and specific. The design has to feel as considered as the finished rooms, without pretending the company is a design studio or inventing reviews, stats, awards, or licenses.

## What the research pointed to

Award-level architecture and home sites in 2026 (Awwwards write-ups on Telha Clarke and MERSI, Codrops on motion systems, Godly and Land-book editorial portfolios, plus luxury-service case studies) keep landing on the same ideas:

- One visual idea, carried with discipline. Generic dark heroes, card grids, and loud buttons read as a template.
- Editorial type. A high-contrast or soft serif at display size, a quiet grotesque for text, letterspaced labels instead of bold condensed shouting.
- Warm, limited color. Plaster, ink, and one accent. Cool gray SaaS palettes and primary orange are fading on premium home brands.
- Photography is the material. Full frames, real crops, almost no interface on top of the picture.
- Motion is pacing. Slow settles and reveals, not bounce. It has to still look finished when it does not move.
- Print artifacts are showing up again: crop marks, baseline rules, plate numbers. Used once, they feel authored. Used everywhere, they feel like a kit.

Glassmorphism, gradient orbs, and autoplay carousels are the things these sites are leaving behind.

## The idea: measured rooms

The line we already say is “priced before we start.” The site behaves like a field book laid out as a magazine: the room is photographed, then marked the way a job is marked before a price is written. Plate numbers, a dimension rule, and crop marks sit on the hero only, plus one portrait on About. Everywhere else the system is type, hairlines, and the photographs.

That fits a premium local contractor better than a cold architecture clone. The work is physical and the promise is a written price. The marks make that promise visible without a new claim.

## Type

- Display: Fraunces, self-hosted, optical size on. Sentence case. Weight about 560. One italic in copper for the words we want remembered (`priced before`).
- Text: Outfit, self-hosted. 17px body, generous line height.
- Labels: Outfit, 12px, weight 500, tracking about 0.16em, uppercase. Used for plate numbers, kickers, and nav. Never for headlines.

Old pages still using uppercase utilities inherit Fraunces, so they sit in the same family until they are rewritten.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| Ink | `#1A1612` | Text, footer, index rail |
| Plaster | `#F3EEE6` | Hero and quiet sections |
| Paper | `#F8F5EF` | Page background |
| Stone | `#E6DFD4` | Rules, process band |
| Copper | `#C4622D` | Large italic, dimension rule. Large text only (about 3.5:1 on plaster) |
| Copper deep | `#8C3B16` | Buttons, small labels, links. About 7:1 on plaster with paper text |

The old `#FF5C28` stays in the logo file. On screen it becomes this deeper copper so white and plaster text stay readable. No second accent.

## Motion

CSS only, transform and opacity, so a mobile Lighthouse score in the 90s stays realistic. No animation library.

- Headline lines rise into their crop, staggered.
- The hero photograph settles from a slight scale.
- The dimension rule draws once.
- Crop marks fade in.
- Hovers are a short image scale or a color change.

`prefers-reduced-motion: reduce` collapses those to a near-instant end state. Nothing loops.

## Imagery

Real job photos already on the site. The hero is the navy paneled wall because it is the most finished room we have; a movie-room inset shows the other end of the work. Low-resolution files (the van, small wash and drywall shots) stay small. No stock, no generated rooms, no fake before-and-afters.

Grain is a tiny tiled SVG on the hero only, low opacity, so the plaster does not look like flat software gray.

## What we will not add

Review counts, star ratings, license numbers, years-of-experience claims beyond the 2014 founding already published, awards, or city rankings. If it is not already on the site, it is not a graphic.
