import { SITE_ORIGIN } from './site';

/** Indexable HTML routes, derived from page files so the sitemap cannot drift. */
export function indexablePathnames(): string[] {
  const modules = import.meta.glob('/src/pages/**/*.astro');
  const paths = Object.keys(modules).map(fileToPathname);
  return paths.sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });
}

export function fileToPathname(file: string): string {
  const rel = file.replace(/^\/src\/pages\//, '').replace(/\.astro$/, '');
  if (rel === 'index') return '/';
  if (rel.endsWith('/index')) return `/${rel.slice(0, -'/index'.length)}`;
  return `/${rel}`;
}

export function sitemapXml(pathnames: string[]): string {
  const urls = pathnames
    .map((pathname) => {
      const loc = pathname === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${pathname}`;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function sitemapIndexXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_ORIGIN}/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
