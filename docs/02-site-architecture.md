# Go Pro Home Improvements — Site Architecture & Existing Copy

## Current site inventory (13 pages)

### Core pages
1. `/` — Home
2. `/about/` — About Us
3. `/our-work/` — Portfolio gallery
4. `/contact/` — Contact + form

### Service pages (9)
5. `/service/power-washing/`
6. `/service/interior-exterior-painting/`
7. `/service/demolition-work/`
8. `/service/trim-crown-molding/`
9. `/service/wallpaper/`
10. `/service/murals/`
11. `/service/wall-mount-tv-installations/`
12. `/service/movie-room-designs-installations/`
13. `/service/drywall-texture-install/`

## Contact block (global — header + footer on every page)

- **Phone:** (407) 244-6873
- **Email:** gopro4good@gmail.com
- **Service area:** Serving All of Central Florida
- **Company name:** GoPro Home Improvement (singular, not "Improvements")
- **Copyright line:** "Copyright © GOPRO. All rights reserved."

> **Anomaly to fix:** The domain says "Improvements" (plural). The logo and body copy say "GoPro Home Improvement" (singular). Confirm with stakeholder which is the canonical brand name before launch. Recommend using plural to match domain and avoid redirect ambiguity.

## Existing homepage copy

### Hero slides (two-slide carousel)

**Slide 1**
> Choose us for 100% Quality Work.
> GoPro Home Improvement does it all. We offer a variety of services to better accommodate you.
> [Learn More → /about/]

**Slide 2**
> Get The Movie Room You Always Dreamed of Today!
> GoPro Home Improvement does it all. We offer a variety of services to better accommodate you.
> [Learn More → /about/]

### Why Choose Us section

> Simple…"You" want the best quality of service, and "We" provide it.

Six cards — three are **placeholder text that was never filled in** (flag these for rewrite):
- **Always Available** — "We are available to answer any of your questions or concerns. Whether it is questions on pricing, estimates or suggestions on options or ideas, we are here to help."
- **Our Agents** — "Our agents are extremely knowledgeable and skilled at their craft."
- **Our Prices** — "Our prices are fair, comparable and we guarantee our workmanship to your satisfaction."
- **Best Offers** — `( Need Offers information)` ← PLACEHOLDER
- **Materials** — `( Need information on some of the materials used, such as quality of paint of brand that applies)` ← PLACEHOLDER
- **Quick Efficiency** — `( Information on what time expectancy or estimated for different services)` ← PLACEHOLDER

### About snippet (on home + About page)

> GoPro Home Improvement is an owner operated company with over 15 years of experience. Our growing company has provided services much of the Central Florida region and we are continuing to expand. The services we provide include, but are not limited to lighting, mounting, remodeling, flooring, painting, repairs, installations and more. We offer an all-around home handyman work for almost every fix or renovation you need for your home.

### Mission / Vision / Goal (tabbed on About)

- **Mission:** "Our mission is to understand the needs of our clients and to be able to share our ideas in order to bring about the best fixes and improvements that are needed for their home."
- **Vision:** "Our vision is to be set apart in the industry, known by the excellence and quality of services we provide when it comes to enhancing the look and feel of every home. Growing and expanding our clientele regionally by our trusted reputation."
- **Goal:** "Our goal is to be able to complete every task at hand with our very best efforts, to ensure the standards we uphold are met and exceed the expectation of every one of our clients."

## Existing service page copy (painting — representative sample)

> GoPro has the skill and expertise to provide you with the right interior and exterior painting solutions for your home or office. You spend a great deal of time in your home, and a high-quality interior paint job can contribute to a bright and vibrant atmosphere.
>
> Whether you want to freshen up a room with a fresh coat of paint or re-paint the entire interior of your home, GoPro will deliver outstanding results and get the job done on time and on budget.
>
> GoPro has provided thousands of proud residential and commercial customers, just like you for high-quality interior and exterior painting services! We have kept our promise to deliver what every customer wants.
>
> At GoPro, our goal is to satisfy all your needs and offer a variety of residential and commercial services. We use only premium paints and supplies, in order to assure success and a quality painting experience.

### Service Overview bullets (reused across service pages)
- We offer a complete, accurate, and rock-solid up-front estimate.
- We work quickly and carefully while accommodating your scheduling needs.
- We treat you, your property, and your belongings with the utmost care and respect.
- We do the job right, it's as simple as that!

## What the current site is missing (rewrite should add)

1. **No location pages.** "Central Florida" is too broad for local SEO. Should have dedicated pages or schema for key metros: Orlando, Kissimmee, Winter Park, Altamonte Springs, Sanford, Clermont, Lake Mary.
2. **No testimonials or reviews** despite 15 years in business.
3. **No pricing transparency or quote flow** beyond "call us."
4. **No blog / resource content.** Zero topical authority signals.
5. **No service-area schema markup** (LocalBusiness, Service, Review).
6. **No project case studies** — "Our Work" is just an image grid with no narrative, no before/afters, no outcomes.
7. **No trust signals** — no licensing info, insurance, BBB, Google review count/rating.
8. **Placeholder copy** in Why Choose Us (see above).
9. **Dead social icons** in footer (section exists, no links populated).
10. **Weak CTAs** — "Read More" and "Learn More" everywhere. Should be action-specific ("Get a Free Quote," "See Painting Projects").

## URL → new URL mapping (preserve SEO, add specificity)

| Old | New | Notes |
|---|---|---|
| `/` | `/` | Homepage |
| `/about/` | `/about/` | Keep |
| `/our-work/` | `/projects/` | Rename for clarity, add 301 |
| `/contact/` | `/contact/` | Keep |
| `/service/power-washing/` | `/services/pressure-washing-central-florida/` | Industry term is "pressure washing" (higher search volume); add geo |
| `/service/interior-exterior-painting/` | `/services/painting-orlando/` | Split into /interior and /exterior later if warranted |
| `/service/demolition-work/` | `/services/demolition/` | |
| `/service/trim-crown-molding/` | `/services/trim-crown-molding/` | Keep |
| `/service/wallpaper/` | `/services/wallpaper-installation/` | |
| `/service/murals/` | `/services/custom-murals/` | |
| `/service/wall-mount-tv-installations/` | `/services/tv-mounting/` | |
| `/service/movie-room-designs-installations/` | `/services/home-theater-design/` | Industry term |
| `/service/drywall-texture-install/` | `/services/drywall-texture/` | |

**All old URLs get 301 redirects to new URLs.** `astro.config.mjs` redirects block goes in the Cursor prompt.

## New pages to add (SEO-solutions approach)

- `/services/` — Services hub (currently missing; services only accessible via dropdown)
- `/projects/{slug}/` — Individual project case studies (3-5 at launch, not just a gallery)
- `/service-areas/orlando/`, `/service-areas/kissimmee/`, `/service-areas/winter-park/` etc. — Geo landing pages
- `/blog/` + 3-5 launch posts ("How Much Does Interior Painting Cost in Central Florida?", "When to Pressure Wash vs Soft Wash Your Home," etc.) — Topical authority seeds
- `/quote/` — Dedicated multi-step quote form (not just a contact form)
- `/reviews/` — Pulls in Google reviews via schema or embed
