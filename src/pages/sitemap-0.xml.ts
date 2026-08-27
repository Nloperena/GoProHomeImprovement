export async function GET() {
  const pages = [
    '',
    'about',
    'work',
    'estimate',
    'reviews',
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
    'areas/st-cloud',
    'areas/celebration',
    'areas/poinciana',
    'areas/central-florida',
  ];

  const lastmod = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>https://goprohomeimprovements.com/${page}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page === '' ? '1.0' : page.startsWith('services/') || page.startsWith('areas/') ? '0.8' : '0.9'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
