# Design direction

Go Pro Home Improvements, Kissimmee. Owner-operated painting, drywall, power washing, trim, and the jobs around them. The marketing copy stays plain and specific. The design has to be noticed in the first second, without inventing reviews, stats, awards, or licenses.

## What the research pointed to

Award-level architecture and home sites in 2026 (Awwwards Site of the Day, Godly, Land-book, and studio case studies such as Telha Clarke and MERSI) are not quiet templates. The ones that win are cinematic:

- A full-bleed first screen. The photograph or film is the page, edge to edge, at least one viewport tall.
- Display type at a size that overlaps the picture. Tight leading. One italic or one color does the remembering.
- Motion you can name: a staggered reveal, a wipe, a slow scroll scale. It still has to look finished when it does not move.
- The rest of the page changes temperature. Night, then bone, then night again. Large photographs, not card grids.
- A horizontal reel or a bento for the work, oversized numerals for a process, and a closing band that is as loud as the hero.

The earlier measured-rooms pass (crop marks, a split hero, plaster and a quiet copper) read as a refined brochure. It was too close to the old site to feel like a break.

## The idea: one spray pass

The line we already say is “priced before we start.” The hero is the finished room, full bleed, with the sentence set on top of it at display size. A lacquer bar wipes across once, the way a spray pass crosses a wall, then leaves. When Nico has footage of the owner painting, that film replaces the still. Until then the navy trim photograph holds the frame.

That fits a painting contractor better than another split layout. The work is physical, the first screen is a room, and the promise stays the sentence we already use.

## Type

- Display: Fraunces, self-hosted. On the hero, `clamp(3.15rem, 12.4vw, 11.4rem)`, line-height 0.82, tracking about -0.055em. The words `priced before` are italic lacquer.
- Elsewhere, headlines stay in Fraunces but come down from that peak. Section titles are still large enough to change the page.
- Text: Outfit, self-hosted.
- Labels: Outfit, 12px, weight 500, tracking about 0.16em, uppercase.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| Night | `#0C0B09` | Hero scrim, gallery, process, header, footer |
| Bone | `#E6DED2` | Light sections, logo plate |
| Paper | `#F4EFE8` | Forms and quiet copy blocks |
| Lacquer | `#FF4D1A` | Hero italic, giant numerals, buttons, the wipe. About 5.9:1 on night |
| Lacquer deep | `#9A2E0E` | Small labels and numerals on bone. About 5.7:1 |

Lacquer is not used for small text on bone. The logo file still contains the old orange; it sits on a bone plate so the black wordmark reads on night photography.

## Motion

CSS only. No animation library.

- Headline lines rise into their crop, staggered.
- A lacquer wipe crosses the hero once and ends off-screen. It does not cover the poster at rest, so the photograph can paint immediately.
- The headline drifts up slightly as the page scrolls (`animation-timeline: scroll()`), where the browser supports it. The photograph itself does not animate, so it can paint as the first image.
- The hero video, once a file is present, fades in over the poster. It does not load during the first paint.

`prefers-reduced-motion: reduce` finishes the type reveal immediately, skips the wipe and the scroll scale, and does not start the video.

## Hero video

The poster is the existing navy trim photograph (`public/images/trim-navy-wall.jpg` and the 840 / 1400 derivatives).

To run footage of the owner spray painting, put one file here:

`public/video/hero.mp4`

H.264. Audio is optional; the page sets `muted`, `loop`, and `playsinline`. The `<video>` has no `src` in the HTML. After the window loads, the homepage checks that path and attaches it only if the file is there. A note with the same path is in `public/video/PUT-HERO-MP4-HERE.txt`, and the comment sits on the video element in `src/components/HeroHome.astro`.

## Imagery

Real job photos already on the site. The hero poster is the navy paneled wall. The project reel and the closing band use the mural, theaters, bedroom, and floor photographs. Low-resolution files stay small. No stock, no generated rooms, no fake before-and-afters.

## What we will not add

Review counts, star ratings, license numbers, years-of-experience claims beyond the 2014 founding already published, awards, or city rankings. If it is not already on the site, it is not a graphic.
