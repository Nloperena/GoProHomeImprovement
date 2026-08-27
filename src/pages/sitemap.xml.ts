import type { APIRoute } from 'astro';

const pages = [
  '',
  'about',
  'work',
  'reviews',
  'estimate',
  'services',
  'services/power-washing',
  'services/interior-exterior-painting',
  'services/demolition',
  'services/trim-crown-molding',
  'services/wallpaper',
  'services/murals',
  'services/tv-mounting',
  'services/movie-rooms',
  'services/drywall',
  'areas',
  'areas/kissimmee',
  'areas/orlando',
  'areas/central-florida',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>https://goprohomeimprovements.com/${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

export const GET: APIRoute = () => {
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
