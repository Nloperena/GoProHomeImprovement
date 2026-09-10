# Go Pro Home Improvements

Astro + TypeScript + Tailwind + Vercel static site for [goprohomeimprovements.com](https://goprohomeimprovements.com).

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Dev server at `http://localhost:4321` |
| `npm run build` | Production build to `dist/` and Vercel output |
| `npm run preview` | Preview the build |
| `npm run check` | Typecheck (Astro + TS) |
| `npm run format` | Prettier |

## Docs

Build briefs and references live in [`docs/`](./docs/) (cursor prompt, asset manifest, architecture, SEO). On Windows, run `scrape-assets.sh` via Git Bash or WSL after placing it in the project root.

## Stack

- Astro 6, `output: 'static'`, `@astrojs/vercel`
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `@astrojs/sitemap`, self-hosted fonts (`@fontsource-variable/inter`, `@fontsource/fraunces`)
