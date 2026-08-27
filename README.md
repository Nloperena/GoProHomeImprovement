# Go Pro Home Improvements

Production-quality marketing website for Go Pro Home Improvements, a home improvement contractor serving Central Florida.

## Tech Stack

- **Framework:** Astro 4.x with TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Static site (ready for Vercel, Netlify, etc.)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Site Structure

### Pages

- `/` - Homepage
- `/about` - About Go Pro
- `/services` - Services hub
- `/services/*` - Individual service pages (9 total)
- `/work` - Portfolio gallery
- `/areas` - Service areas hub
- `/areas/*` - Area pages (Kissimmee, Orlando, Central Florida)
- `/reviews` - Reviews and testimonials
- `/estimate` - Free estimate request form

### API Routes

- `/api/estimate` - Form submission endpoint (currently logs to console in dev)

## Brand

- **Colors:** Orange (#FF6B35) and Black (#1A1A1A)
- **Contact:** (407) 244-6873, gopro4good@gmail.com
- **Service Area:** Central Florida (Kissimmee, Orlando, surrounding areas)

## What's Still Needed from Client

These items are not included in the build and should be provided by the client:

1. **Physical Address** (if they want it public)
2. **License Number** (if applicable and they want to display it)
3. **Insurance Badge/Certification** (if they have one)
4. **Business Hours** (if they want to display them)
5. **Facebook URL** (if they have a page)
6. **YouTube URL** (if they have a channel)
7. **Customer Testimonials/Reviews** (real ones)
8. **Google Reviews Integration** (need to set up Google My Business API)
9. **Job Photos** (need to download from current site and add to gallery)
10. **Logo Files** (download from current site for higher quality version)
11. **Form Backend** (currently just logs to console - needs email service or CRM integration)

## Production Deployment Checklist

- [ ] Set up form submission backend (email service, database, or CRM)
- [ ] Add real job photos to gallery
- [ ] Download and optimize logo files
- [ ] Set up Google Analytics or other analytics
- [ ] Configure DNS records to point to new site
- [ ] Set up SSL certificate (automatic with most hosts)
- [ ] Test form submissions
- [ ] Test all links and navigation
- [ ] Verify mobile responsiveness
- [ ] Run Lighthouse audit
- [ ] Submit sitemap to Google Search Console

## SEO

- Unique titles and meta descriptions on all pages
- LocalBusiness JSON-LD schema markup
- Sitemap at `/sitemap.xml`
- Robots.txt configured
- Mobile-first responsive design
- Fast page loads (static site)

## License

Proprietary - © Go Pro Home Improvements
