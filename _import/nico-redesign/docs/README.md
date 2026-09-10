# Go Pro Home Improvements — Rebuild Package

Everything needed to rebuild `goprohomeimprovements.com` on Astro + Vercel, via Cursor.

## What's in this package

| File | Purpose |
|---|---|
| `docs/00-cursor-prompt.md` | **The main deliverable.** Paste this into Cursor as the build brief. |
| `docs/01-asset-manifest.md` | Every image URL on the source site, categorized and mapped to target paths |
| `docs/02-site-architecture.md` | Full page inventory, existing copy, URL → new URL mapping, gaps to fill |
| `docs/03-seo-brief.md` | Keyword targets, positioning shift, meta tag patterns, schema requirements, 301 redirects |
| `scrape-assets.sh` | Bash script to pull all media and HTML from the live site |

## How to use this

1. Create the new Astro project directory locally (`gopro-homeimprovements/` or whatever you want to name it)
2. Drop `scrape-assets.sh` into the project root, `chmod +x` it, run it. You'll get a `scrape/` folder with reference HTML and `public/images/gallery/` with every image.
3. Open the project in Cursor
4. Drop the four docs into the project as context files (or paste into `.cursor/rules/` for persistent context)
5. Paste `docs/00-cursor-prompt.md` as your initial message to Cursor
6. Cursor executes the build; you review at the checkpoints listed in Step 10 of the prompt

## A few judgment calls to make before launch

### Brand name disambiguation
Domain says "Improvements" (plural), logo and body copy say "Improvement" (singular). Pick one for the new build. Recommended: plural, matching domain.

### Pricing transparency
The repositioning away from "fair prices" creates a question: do we show any pricing at all? Three options:
- **(a) None** — "Get a quote" only. Traditional, keeps flexibility, but hurts SEO for "cost" queries.
- **(b) Starting prices** — "Interior painting from $X/sq ft" — builds trust, filters tire-kickers.
- **(c) Range on blog only** — "Typical Central Florida interior paint job runs $X-$Y" in the blog post, not service pages.

Recommend (c) for launch. It earns blog traffic for pricing queries without forcing a pricing commitment on service pages.

### Logo
The existing `SiteLogo.png` is the old mark. Per prior brand work, the updated identity is a bold-italic wordmark with angled orange tagline bar. **Drop the final SVG into `/public/images/logos/logo-wordmark.svg` before Cursor starts**, or Cursor will use the old PNG. The prompt flags this but the asset handoff is yours.

### Testimonial sourcing
The current site has zero testimonials despite 15 years in business. If there are existing Google reviews, grab the top 3-5 before the build and add them to `src/content/testimonials.json`. If none exist, the launch site will have a placeholder section — not ideal, but honest. Add a "Reviews will populate as we collect them" note in-PR.

### Owner bio / photo
About page rewrite wants an owner-led narrative. Need: 2-3 paragraphs of owner backstory (how/why started, what specialty is, why Central Florida), plus one good headshot or on-job photo. If not available, the About page will fall back to a generic narrative, which is a missed positioning opportunity.

## Open question: Service area list

I defaulted to 10 Central Florida cities in the SEO brief (Orlando, Kissimmee, Winter Park, Altamonte Springs, Sanford, Clermont, Lake Mary, Oviedo, Winter Garden, Windermere). These are the right mix of population, search volume, and likely service-reach. If the owner only actually services a tighter radius (say, 30 min from home base), trim the list — false service-area pages hurt trust and create review-mismatch issues on Google Business Profile.

## Estimated timeline

- **Scrape + asset sort:** 30 min
- **Scaffold + design system + Header/Footer/SEO component:** 2-3 hours
- **Homepage + 9 service pages + content:** 4-6 hours (most of the work is writing good copy; Cursor handles code fast)
- **About, Contact, Quote form:** 2 hours
- **Projects (3-5 case studies):** 2-3 hours (bottleneck: writing, not code)
- **Service-area pages (10, templated):** 1 hour
- **Blog (3 posts):** 4-6 hours (writing-heavy)
- **Schema, sitemap, redirects, polish:** 1-2 hours
- **Lighthouse + a11y pass + deploy:** 1-2 hours

**Total: ~20-25 hours of focused work, mostly copywriting.** The Astro build itself is maybe 4 hours of Cursor time.

## Next time we iterate

If this process works, I'd recommend:
1. A `CONTENT_BRIEF.md` template per client that forces you to answer the "judgment calls" list above *before* starting Cursor — saves midway-through redirects
2. A shared Nexrena boilerplate repo (Astro + Tailwind + Header/Footer/SEO components pre-built) that you fork for each client — shaves 2-3 hours off every rebuild
3. A standard schema helper library (`@nexrena/schema-helpers` or just a copy-paste file) so you're not rewriting LocalBusiness JSON-LD each time
