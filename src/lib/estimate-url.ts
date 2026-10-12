const CITIES: Record<string, string> = {
  kissimmee: 'Kissimmee',
  orlando: 'Orlando',
  'st-cloud': 'St. Cloud',
  celebration: 'Celebration',
  poinciana: 'Poinciana',
};

const SERVICE_FROM_SLUG: Record<string, string> = {
  'power-washing': 'power-washing',
  'interior-exterior-painting': 'interior-exterior-painting',
  painting: 'interior-exterior-painting',
  demolition: 'demolition',
  'trim-crown-molding': 'trim-crown-molding',
  wallpaper: 'wallpaper',
  murals: 'murals',
  'tv-mounting': 'tv-mounting',
  'movie-rooms': 'movie-rooms',
  drywall: 'drywall',
  'drywall-repair': 'drywall',
};

const GUIDE_RULES: Array<{ token: string; service: string }> = [
  { token: 'power-wash', service: 'power-washing' },
  { token: 'roof-black', service: 'power-washing' },
  { token: 'pressure-wash', service: 'power-washing' },
  { token: 'soft-wash', service: 'power-washing' },
  { token: 'wallpaper', service: 'wallpaper' },
  { token: 'mural', service: 'murals' },
  { token: 'movie-room', service: 'movie-rooms' },
  { token: 'home-theater', service: 'movie-rooms' },
  { token: 'tv-mount', service: 'tv-mounting' },
  { token: 'tv-wire', service: 'tv-mounting' },
  { token: 'hiding-tv', service: 'tv-mounting' },
  { token: 'drywall', service: 'drywall' },
  { token: 'popcorn-ceiling', service: 'drywall' },
  { token: 'demolition', service: 'demolition' },
  { token: 'kitchen-bathroom-demo', service: 'demolition' },
  { token: 'crown-molding', service: 'trim-crown-molding' },
  { token: 'trim', service: 'trim-crown-molding' },
  { token: 'paint', service: 'interior-exterior-painting' },
  { token: 'stucco', service: 'interior-exterior-painting' },
];

function cityFromSlug(slug: string): string {
  const cityKey = Object.keys(CITIES)
    .sort((a, b) => b.length - a.length)
    .find((key) => slug === key || slug.endsWith(`-${key}`) || slug.includes(key));
  return cityKey ? CITIES[cityKey] : '';
}

function serviceFromGuide(slug: string): string {
  const hits = GUIDE_RULES
    .map((rule) => ({ ...rule, index: slug.indexOf(rule.token) }))
    .filter((rule) => rule.index >= 0)
    .sort((a, b) => a.index - b.index);

  const unique = [...new Set(hits.map((hit) => hit.service))];
  if (unique.length === 0) return '';
  return hits[0].service;
}

function serviceFromPageSlug(slug: string): string {
  const cityKey = Object.keys(CITIES)
    .sort((a, b) => b.length - a.length)
    .find((key) => slug.endsWith(`-${key}`));
  const serviceSlug = cityKey ? slug.slice(0, -(cityKey.length + 1)) : slug;
  return SERVICE_FROM_SLUG[serviceSlug] ?? '';
}

export function estimateHrefFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  let service = '';
  let city = '';

  if (parts[0] === 'services' && parts[1]) {
    service = serviceFromPageSlug(parts[1]);
    city = cityFromSlug(parts[1]);
  } else if (parts[0] === 'areas' && parts[1]) {
    city = CITIES[parts[1]] ?? '';
  } else if (parts[0] === 'guides' && parts[1]) {
    service = serviceFromGuide(parts[1]);
    city = cityFromSlug(parts[1]);
  }

  const params = new URLSearchParams();
  if (service) params.set('service', service);
  if (city) params.set('city', city);
  const query = params.toString();
  return query ? `/estimate?${query}` : '/estimate';
}
