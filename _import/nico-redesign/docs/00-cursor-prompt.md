# Cursor Build Prompt — Go Pro Home Improvements Astro Rebuild

> Paste this into Cursor as the initial project brief. Attach the three companion docs (`01-asset-manifest.md`, `02-site-architecture.md`, `03-seo-brief.md`) and `scrape-assets.sh` to the same workspace before starting.

---

## Role & objective

You are the senior full-stack developer executing a complete rebuild of **goprohomeimprovements.com**, an owner-operated home improvement contractor serving Central Florida. The current site is a dated WordPress build with placeholder copy, weak SEO, and a commodity-contractor positioning ("we're fair and available"). We are replacing it with a fast, Astro-based static site that repositions Go Pro as a **solutions-focused home improvement specialist** — competing on outcomes, process clarity, and local expertise, **not on price**.

The rebuild ships on **Vercel** with the **Forza stack pattern** (Astro + TypeScript + Tailwind + Vercel adapter). The transition must be seamless: preserve every existing URL's link equity via 301 redirects, match or exceed current image quality, and launch with a complete sitemap. No broken links, no missing assets, no placeholder copy.

## Non-negotiables

1. **Astro static output + Vercel adapter.** Not SSR. Not Next.js. Not WordPress headless.
2. **TypeScript everywhere** (`strict: true`).
3. **Tailwind CSS** — no CSS-in-JS, no vanilla CSS except `global.css` for resets and design tokens.
4. **Every existing URL 301-redirects** to its new equivalent (map in `03-seo-brief.md`).
5. **Every page has:** unique title, meta description, canonical URL, OpenGraph tags, JSON-LD schema where applicable, and H1.
6. **No placeholder copy.** The existing site has `( Need information on...)` in three places — do not replicate. Write finished copy.
7. **Accessibility:** WCAG 2.1 AA. Semantic HTML, alt text on every image, keyboard-navigable, color contrast checked.
8. **Mobile-first.** Design at 375px, scale up. The majority of home-services search traffic is mobile.
9. **Images:** use Astro's `<Image>` component with `format="webp"` and explicit `width`/`height`. No raw `<img>` tags except for the logo in the header.
10. **No client-side JavaScript for anything that doesn't need it.** Astro islands only where interactive (mobile nav, quote form, image lightbox).

## Step 1 — Scaffold the project

```bash
npm create astro@latest -- --template minimal --typescript strict --no-install
cd gopro-homeimprovements
npm install
npx astro add tailwind
npx astro add sitemap
npx astro add vercel
npm install -D @astrojs/check prettier prettier-plugin-astro prettier-plugin-tailwindcss
```

`astro.config.mjs` should:
- Set `site: 'https://goprohomeimprovements.com'`
- Configure `@astrojs/sitemap`
- Configure `@astrojs/vercel/static` (not serverless)
- Add the 301 redirect block from `03-seo-brief.md`

## Step 2 — Scrape existing assets

Run `./scrape-assets.sh` (included in project root). This downloads:
- All 13 page HTML files into `./scrape/` for reference
- All images into `./public/images/gallery/`
- Logos into `./public/images/logos/`
- Favicon into `./public/favicon.ico`

After it runs, manually sort `./public/images/gallery/` into:
- `/public/images/hero/` — slider-*, IMG_6439*
- `/public/images/services/` — match by keyword (IMG_7777* → painting, WallMount* → tv-mount, etc. — see `01-asset-manifest.md` for explicit mapping)
- `/public/images/work/` — OurWork1/2/3
- `/public/images/about/` — VAN.png

Delete the originals from `/gallery/` once sorted.

## Step 3 — Design system

### Brand colors (from existing identity work)
```ts
// src/styles/tokens.ts
export const colors = {
  ink: '#0F1419',         // body text, headlines
  paper: '#FAF9F6',       // background
  orange: '#E85D1F',      // primary accent (matches bold-italic wordmark with angled orange bar)
  orangeDeep: '#C94A15',  // hover/pressed state
  slate: '#5A6470',       // secondary text
  line: '#E5E2DC',        // borders, dividers
  cream: '#F3EFE6',       // surface alt
} as const;
```

### Typography
- **Headings:** Recoleta or Canela (buy/license) — or fallback to Fraunces (Google Fonts, free, serif-display). This echoes the editorial feel from recent Nexrena work without being identical.
- **Body:** Inter (Google Fonts)
- **UI / small caps:** Inter with `letter-spacing: 0.08em; text-transform: uppercase; font-size: 12px`

### Voice & tone
- **Direct and specific.** "Interior painting in 3-5 days for a typical 2,000 sq ft home" beats "prompt and reliable service."
- **Owner-led language.** "I've painted over 1,200 homes in Central Florida" beats "our agents are knowledgeable."
- **No superlatives.** Cut "best," "premier," "leading." Replace with verifiable claims.
- **CTAs are specific.** "Get a Free Painting Quote" not "Learn More."

### Layout conventions
- Max content width: 1200px
- Section vertical padding: 96px desktop / 64px mobile
- Generous whitespace — the site should feel like it breathes
- Grid: 12-column, 24px gutters

## Step 4 — File structure

```
src/
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── ServiceCard.astro
│   ├── ProjectCard.astro
│   ├── QuoteForm.astro          (React island, interactive)
│   ├── MobileNav.astro          (Alpine.js or tiny vanilla JS island)
│   ├── Breadcrumbs.astro
│   ├── TrustBar.astro           (phone, hours, service area, review count)
│   ├── Testimonials.astro
│   ├── FAQ.astro
│   └── SEO.astro                (handles title/meta/canonical/og/schema)
├── layouts/
│   ├── Base.astro               (wraps Header/Footer)
│   ├── Service.astro            (extends Base, adds service-specific schema)
│   └── Post.astro               (for blog)
├── content/
│   ├── config.ts                (collection definitions for services, projects, posts, areas)
│   ├── services/
│   │   ├── painting.md
│   │   ├── pressure-washing.md
│   │   ├── ...
│   ├── projects/
│   │   ├── winter-park-exterior-repaint.md
│   │   ├── ...
│   ├── service-areas/
│   │   ├── orlando.md
│   │   ├── kissimmee.md
│   │   ├── ...
│   └── posts/
│       ├── interior-painting-cost-central-florida.md
│       └── ...
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── contact.astro
│   ├── quote.astro
│   ├── projects/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── services/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── service-areas/
│   │   └── [slug].astro
│   └── blog/
│       ├── index.astro
│       └── [slug].astro
├── styles/
│   ├── global.css
│   └── tokens.ts
└── lib/
    ├── schema.ts                (JSON-LD builders)
    └── seo.ts                   (title/desc helpers)
```

## Step 5 — Content collections

Define Zod schemas in `src/content/config.ts` for `services`, `projects`, `serviceAreas`, and `posts`. Each service frontmatter must include:

```yaml
title: "Interior & Exterior Painting in Orlando, FL"
slug: painting-orlando
shortTitle: "Painting"                    # for nav
excerpt: "Professional interior and exterior painting in Orlando and Central Florida..."
heroImage: "/images/services/painting.jpg"
heroAlt: "Freshly painted Craftsman-style home exterior in Winter Park, Florida"
primaryKeyword: "interior exterior painting Orlando"
metaTitle: "Interior & Exterior Painting Orlando, FL | Go Pro"
metaDescription: "Professional interior and exterior painting..."  # <=155 chars
processSteps:
  - title: "On-site consultation"
    body: "I walk the property with you..."
  - title: "..."
includes: [...]                           # What's included
excludes: [...]                           # What's not (sets expectations, builds trust)
startingPrice: "From $X per square foot" # OR null — optional, only if we want price transparency
typicalDuration: "3-5 days for a 2,000 sq ft home"
faq:
  - question: "..."
    answer: "..."
relatedServices: [drywall-texture, pressure-washing-central-florida]
ogImage: "/images/services/painting-og.jpg"
```

Write **full content** for all 9 services. Use `03-seo-brief.md` keyword targets. The body of each service page (markdown content below frontmatter) should be 600-900 words — enough for topical depth, not stuffed.

## Step 6 — Pages to build (in this order)

1. **Layout + Header + Footer + SEO component** — get the chrome right before any page
2. **Homepage** — new hero, service grid, process section, testimonials placeholder, service areas strip, CTA
3. **Services hub** (`/services/`) — grid of all 9 services with 2-sentence excerpts
4. **9 service detail pages** — generated via `[slug].astro` + content collection
5. **About page** — rewrite mission/vision/goal into a single narrative; add owner photo/bio
6. **Contact page** — full contact info, embedded map of service area, simple form
7. **Quote page** (`/quote/`) — multi-step form (service → scope → contact → submit). Use React island. Submit to Formspree or Resend for MVP.
8. **Projects hub + 3-5 project detail pages** — case study format: challenge, approach, outcome, gallery
9. **Service-area pages** (`/service-areas/{city}/`) — programmatically generated from a content collection. Each page pulls service list, dedupes by area, adds local copy block.
10. **Blog hub + 3 launch posts** — per `03-seo-brief.md`
11. **Reviews page** (optional MVP) — or embed on home
12. **404 + robots.txt + sitemap.xml** — handled by config, verify output

## Step 7 — Homepage composition (specific)

Above the fold:
- Sticky header: logo left, nav center (Services / Projects / Service Areas / About / Blog / Contact), "Get Free Quote" button right (orange)
- Thin trust bar directly beneath header: `📍 Orlando, FL · 📞 (407) 244-6873 · ⏱️ Replies within 1 business day`
- Hero: large serif headline (48px mobile / 72px desktop), subhead, two buttons (`Get a Free Quote` primary / `See Our Work` secondary), supporting image on right (desktop) or below (mobile)

Headline to use (lead the repositioning):
> **Central Florida's owner-operated home improvement specialist.**
> *Fifteen years. One point of contact. Every job.*

Subhead:
> Painting, pressure washing, TV mounts, home theaters, drywall, and more — across Orlando, Kissimmee, and greater Central Florida. Scope-clear quotes, no surprises.

Below the fold, in order:
1. **Services grid** — 9 cards, 3×3 desktop / 1 col mobile. Each card: image, service name, one-sentence outcome, "Learn more →"
2. **How we work** — 4 steps (Site walk → Scope & quote → Schedule → Build). Echoes the Nexrena process section but reframed for home services.
3. **Featured projects** — 3 cards with image, location, one-line summary. Links to `/projects/{slug}/`.
4. **Service areas** — simple list or map of 10 cities, each linking to its `/service-areas/{slug}/` page. Heavy local SEO value.
5. **Testimonials** — 3 Google review quotes with name + city. If none available yet, placeholder with note: "Pulling Google reviews — add `reviewsSource` env var."
6. **FAQ** — 6-8 common questions (licensed? insured? service area? typical project length? payment? warranty?). Render with schema.
7. **Final CTA** — full-bleed orange section: "Your next project starts with one conversation. — Get a Free Quote →"

## Step 8 — SEO implementation

- `<SEO />` component accepts `{ title, description, canonical, ogImage, schema }` and renders all head tags
- JSON-LD helpers in `src/lib/schema.ts`:
  - `localBusinessSchema()` — injected globally in Base layout
  - `serviceSchema(service)` — on each service page
  - `breadcrumbSchema(crumbs)` — on every non-home page
  - `faqSchema(faqs)` — on pages with FAQ sections
- Sitemap auto-generated by `@astrojs/sitemap`. Exclude `/thanks/` and any `/admin/` if added.
- `robots.txt` in `/public/`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://goprohomeimprovements.com/sitemap-index.xml
  ```

## Step 9 — Performance

- All images through `<Image>` with `loading="lazy"` (except hero: `loading="eager" fetchpriority="high"`)
- Font loading: `@fontsource-variable/inter` and `@fontsource/fraunces` self-hosted, `font-display: swap`
- No third-party JS except:
  - Google Analytics 4 (gtag), loaded with `afterInteractive` via partytown if noticeable LCP impact
  - Formspree/Resend for form submit
- Run Lighthouse before first deploy. Target: 95+ mobile on every page. If below, stop and fix before shipping.

## Step 10 — Deployment

1. `vercel link` → connect to the existing Vercel project (or create new)
2. Set env vars in Vercel dashboard: `PUBLIC_SITE_URL`, `FORMSPREE_ENDPOINT` or `RESEND_API_KEY`, `PUBLIC_GA4_ID`
3. `vercel --prod` for first deploy to preview URL; verify before pointing DNS
4. After DNS cutover, run: `curl -I` on every old URL in `02-site-architecture.md` to confirm 301s resolve correctly
5. Submit new `sitemap-index.xml` to Google Search Console, request reindex
6. Monitor Search Console for crawl errors over the first 7 days

## Deliverables checklist

- [ ] Every page in `02-site-architecture.md` has a new equivalent with 301 from old
- [ ] All images sourced from old site are on new site, webp-optimized, properly alt-texted
- [ ] Logo + favicon in place
- [ ] No placeholder copy (search codebase for `Need information`, `TODO`, `Lorem`)
- [ ] Lighthouse 95+ on mobile for `/`, one service page, one project page
- [ ] Schema validates via Google Rich Results Test for: homepage (LocalBusiness), a service page (Service + Breadcrumb), FAQ section
- [ ] All 10 service-area pages generated and linked from homepage + footer
- [ ] 3+ launch blog posts, 900+ words each, with internal links to relevant services
- [ ] Quote form submits successfully to configured endpoint
- [ ] `robots.txt` and `sitemap-index.xml` live and correct
- [ ] 404 page exists and is styled
- [ ] Accessibility: axe-devtools shows zero violations on homepage + one service page

## What I'll review before you deploy

1. The homepage in a preview deploy
2. One service page (painting) in a preview deploy
3. The 301 redirect map output from `curl -I` on five old URLs
4. Lighthouse mobile report for homepage
5. The content of `src/content/services/painting.md` — because if you nail the voice there, the other 8 follow

## If you get stuck

Do not invent content. If you need a fact that isn't in the companion docs (pricing, project counts, warranty terms, specific brand names of paint used), add a `<!-- TODO(nico): confirm -->` comment in the markdown and flag it in the PR description. Ship the build with the TODO visible rather than hallucinated copy.

---

**Go.**
