export async function GET() {
  const pages = [
    '',
    'about',
    'work',
    'estimate',
    'reviews',
    'services',
    'services/power-washing',
    'services/power-washing-kissimmee',
    'services/power-washing-orlando',
    'services/power-washing-celebration',
    'services/power-washing-st-cloud',
    'services/power-washing-poinciana',
    'services/interior-exterior-painting',
    'services/painting-kissimmee',
    'services/painting-orlando',
    'services/painting-st-cloud',
    'services/painting-celebration',
    'services/painting-poinciana',
    'services/demolition',
    'services/demolition-kissimmee',
    'services/demolition-orlando',
    'services/trim-crown-molding',
    'services/trim-crown-molding-kissimmee',
    'services/trim-crown-molding-orlando',
    'services/trim-crown-molding-st-cloud',
    'services/wallpaper',
    'services/wallpaper-kissimmee',
    'services/murals',
    'services/murals-kissimmee',
    'services/tv-mounting',
    'services/tv-mounting-kissimmee',
    'services/tv-mounting-orlando',
    'services/movie-rooms',
    'services/drywall',
    'services/drywall-repair-kissimmee',
    'services/drywall-repair-orlando',
    'services/drywall-repair-st-cloud',
    'services/drywall-repair-celebration',
    'services/drywall-repair-poinciana',
    'services/demolition-st-cloud',
    'services/demolition-celebration',
    'services/demolition-poinciana',
    'services/trim-crown-molding-celebration',
    'services/trim-crown-molding-poinciana',
    'services/tv-mounting-st-cloud',
    'services/tv-mounting-celebration',
    'services/tv-mounting-poinciana',
    'services/movie-rooms-kissimmee',
    'services/movie-rooms-orlando',
    'areas',
    'areas/kissimmee',
    'areas/orlando',
    'areas/st-cloud',
    'areas/celebration',
    'areas/poinciana',
    'areas/central-florida',
    'guides',
    'guides/water-damage-drywall-repair-central-florida',
    'guides/exterior-painting-florida-humidity',
    'guides/wallpaper-installation-cost-kissimmee',
    'guides/movie-room-setup-cost-orlando',
    'guides/demolition-permits-osceola-county',
    'guides/wallpaper-removal-vs-paint-kissimmee',
    'guides/drywall-repair-cost-kissimmee',
    'guides/crown-molding-cost-kissimmee',
    'guides/exterior-paint-colors-florida-sun',
    'guides/pool-deck-power-washing-kissimmee',
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
    'guides/interior-painting-timeline-occupied-homes-florida',
    'guides/garage-driveway-power-washing-kissimmee',
    'guides/disney-area-rental-turnover-punch-list-kissimmee',
    'guides/drywall-texture-matching-central-florida',
    'guides/outdoor-tv-mounting-florida-heat-humidity',
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
