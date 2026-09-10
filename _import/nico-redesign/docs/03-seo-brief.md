# Go Pro Home Improvements — SEO & Positioning Brief

## Current SEO state (as of audit)

- **Platform:** WordPress (appears to be a free/low-cost theme, possibly Pressive or similar)
- **Title tags:** Pattern is `{Page} | Go Pro` — generic, no location, no service keyword
- **Meta descriptions:** Likely auto-generated or absent (not visible in fetch)
- **H1 usage:** OK — each page has a distinct H1
- **Internal linking:** Weak — nav is the only cross-linking; no in-body contextual links
- **Image alt text:** Missing on most images (generic "Slider Image" and empty alts visible in markup)
- **Schema:** None detected
- **Core Web Vitals:** Likely poor — Smush CDN helps, but WP + slider JS = heavy
- **Content depth:** Every service page is 4 short paragraphs of boilerplate; nothing rank-worthy

## Positioning shift — from "cheap handyman" to "solutions-based home pro"

### Before (current copy tone)
- "Our prices are fair, comparable and we guarantee our workmanship to your satisfaction."
- "GoPro has the skill and expertise to provide you with the right..."
- Emphasizes *availability* and *fairness* — commodity framing. Competes on price and niceness.

### After (target copy tone)
- Lead with **problem framing** ("Faded exterior paint drops curb appeal and home value — here's how we restore it in 3-5 days")
- Emphasize **outcomes** and **process**, not price
- Use **specificity** (neighborhood references, material brands, project durations, before/after metrics)
- Treat the visitor as a buyer researching a decision, not a shopper comparing quotes

### Positioning pillars (use across all rewritten copy)

1. **Owner-operated, 15+ years in Central Florida.** (The truthful differentiator — not "fair pricing")
2. **Scope-clear estimates.** Explicit on what's included and what's not. No "change order" surprises.
3. **Residential + light commercial.** Home theaters, murals, and wallpaper indicate a higher-end clientele than "handyman."
4. **Single-point-of-contact.** The owner is on every job. No subcontractor chain.
5. **Central Florida specialist.** Humid climate, stucco repair, tile roof overspray risks, HOA-compliant exterior color work — local knowledge matters.

## Primary keyword targets (by page)

### Homepage
- Primary: **home improvement contractor Central Florida**
- Secondary: home renovation Orlando, owner operated contractor Orlando, handyman services Kissimmee

### Service pages (head terms + long-tail)

| Page | Primary keyword | Secondary keywords |
|---|---|---|
| Painting | interior exterior painting Orlando | house painters Orlando, exterior painting Kissimmee, residential painters Central Florida |
| Pressure Washing | pressure washing Orlando | soft wash house Orlando, driveway cleaning Kissimmee, paver sealing Central Florida |
| TV Mounting | TV mounting service Orlando | wall mount TV installation Orlando, flat screen installation Central Florida |
| Home Theater | home theater installation Orlando | media room design Orlando, movie room builder Central Florida |
| Drywall | drywall repair Orlando | drywall texture matching Orlando, sheetrock installation Kissimmee |
| Murals | custom mural painter Orlando | commercial mural artist Central Florida, kids room mural Orlando |
| Wallpaper | wallpaper installation Orlando | wallpaper hanger Orlando, commercial wallpaper Central Florida |
| Trim/Molding | crown molding installation Orlando | trim carpentry Orlando, baseboard installation Central Florida |
| Demolition | interior demolition Orlando | selective demolition Orlando, remodel demo Kissimmee |

### Service-area pages (new)
One page per: Orlando, Kissimmee, Winter Park, Altamonte Springs, Sanford, Clermont, Lake Mary, Oviedo, Winter Garden, Windermere

Pattern: `{Service} in {City}, FL — {Differentiator}`
e.g., "Interior Painting in Winter Park, FL — Fast, Clean, Owner-Led Jobs"

### Blog launch targets (3-5 posts)
1. "How Much Does Interior Painting Cost in Central Florida? (2026 Guide)" — price-research intent
2. "Pressure Washing vs. Soft Washing: Which Does Your Florida Home Need?" — decision intent
3. "The Real Cost of DIY TV Mounting (and When to Call a Pro)" — avoidance intent
4. "Home Theater Room Design: 7 Mistakes We See in Central Florida Homes" — inspiration + authority
5. "How to Prep Your Stucco Home for Exterior Painting in Florida's Climate" — technical authority

## Meta tag patterns

### Title tag template
`{Primary Keyword} | Go Pro Home Improvements — Central Florida`

Max 60 chars. Examples:
- Home: `Home Improvement Contractor Orlando, FL | Go Pro` (49 chars)
- Painting: `Interior & Exterior Painting Orlando, FL | Go Pro` (50 chars)
- About: `About Go Pro Home Improvements — Orlando, FL` (45 chars)

### Meta description template
`{Verb} {service} in {area}. {Differentiator in 8-10 words}. {CTA — phone or quote verb}.`

Max 155 chars. Examples:
- Home: `Owner-operated home improvement contractor serving Orlando & Central Florida. 15+ years, painting, demolition, TV mounts. Get a free quote today.` (149 chars)
- Painting: `Professional interior & exterior painting in Orlando & Central Florida. Scope-clear estimates, premium paints, owner on every job. Free quote in 24 hours.` (154 chars)

## Schema markup required

1. **LocalBusiness** (every page) — name, phone, email, areaServed (FL counties), priceRange, openingHours
2. **Service** (each service page) — serviceType, provider (LocalBusiness ref), areaServed
3. **BreadcrumbList** (every non-home page)
4. **Review / AggregateRating** (home + about) — pull from Google reviews if available
5. **FAQPage** (service pages with FAQ section)

## Sitemap & redirects

Generate `/sitemap.xml` via `@astrojs/sitemap` integration.
Generate `/robots.txt` allowing all, pointing to sitemap.

### 301 redirects (config in `astro.config.mjs` via adapter, or `vercel.json`)

```json
{
  "redirects": [
    { "source": "/our-work/", "destination": "/projects/", "statusCode": 301 },
    { "source": "/our-work", "destination": "/projects/", "statusCode": 301 },
    { "source": "/service/power-washing/", "destination": "/services/pressure-washing-central-florida/", "statusCode": 301 },
    { "source": "/service/interior-exterior-painting/", "destination": "/services/painting-orlando/", "statusCode": 301 },
    { "source": "/service/demolition-work/", "destination": "/services/demolition/", "statusCode": 301 },
    { "source": "/service/trim-crown-molding/", "destination": "/services/trim-crown-molding/", "statusCode": 301 },
    { "source": "/service/wallpaper/", "destination": "/services/wallpaper-installation/", "statusCode": 301 },
    { "source": "/service/murals/", "destination": "/services/custom-murals/", "statusCode": 301 },
    { "source": "/service/wall-mount-tv-installations/", "destination": "/services/tv-mounting/", "statusCode": 301 },
    { "source": "/service/movie-room-designs-installations/", "destination": "/services/home-theater-design/", "statusCode": 301 },
    { "source": "/service/drywall-texture-install/", "destination": "/services/drywall-texture/", "statusCode": 301 }
  ]
}
```

## Performance targets (Lighthouse, mobile)

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100
- LCP: <2.0s, CLS: <0.05, INP: <200ms

Astro static output + Vercel edge + next-gen images via `<Image>` component should hit these without optimization work if the build is clean.
