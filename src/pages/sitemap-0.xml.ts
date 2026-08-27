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
    'guides',
    'guides/power-washing-before-painting-florida',
    'guides/kissimmee-vacation-rental-refresh',
    'guides/tv-mounting-vs-home-theater',
    'guides/how-much-does-painting-cost-kissimmee',
    'guides/choosing-a-home-improvement-contractor-kissimmee',
    'guides/stucco-and-humidity-central-florida',
    'guides/hiding-tv-wires-without-cutting-drywall',
    'guides/kids-room-mural-ideas-kissimmee',
    'guides/hoa-and-exterior-paint-osceola',
    'guides/pressure-washing-cost-kissimmee',
    'guides/soft-wash-vs-pressure-wash-kissimmee',
    'guides/fireplace-tv-mounting-orlando',
    'guides/tv-mounting-cost-orlando',
    'guides/popcorn-ceiling-removal-kissimmee',
    'guides/cabinet-painting-vs-replacement-kissimmee',
    'guides/roof-black-streaks-osceola',
    'guides/kitchen-bathroom-demo-kissimmee',
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
    <priority>${page === '' ? '1.0' : page.startsWith('services/') || page.startsWith('areas/') || page.startsWith('guides/') ? '0.8' : '0.9'}</priority>
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
