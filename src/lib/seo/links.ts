import { cities, cityForPath, cityServicePath, serviceForPath, services, type ServiceDef } from './catalog';
import { normalizePath } from './breadcrumbs';

export interface RelatedLink {
  href: string;
  label: string;
}

export interface RelatedGroup {
  heading: string;
  links: RelatedLink[];
}

const TOPIC_RULES: { test: RegExp; prefix: string }[] = [
  { test: /power-wash|pressure-wash|soft-wash|pool-deck|garage-driveway|roof-black/, prefix: 'power-washing' },
  { test: /wallpaper/, prefix: 'wallpaper' },
  { test: /mural/, prefix: 'murals' },
  { test: /tv-mount|fireplace-tv/, prefix: 'tv-mounting' },
  { test: /movie-room|home-theater/, prefix: 'movie-rooms' },
  { test: /drywall|popcorn-ceiling/, prefix: 'drywall-repair' },
  { test: /demoli|kitchen-bathroom-demo/, prefix: 'demolition' },
  { test: /trim|crown-mold/, prefix: 'trim-crown-molding' },
  { test: /paint|stucco|cabinet|hoa/, prefix: 'painting' },
];

export function relatedLinks(pathname: string): RelatedGroup[] {
  const path = normalizePath(pathname);
  const match = serviceForPath(path);

  if (match && !match.city) {
    return [cityGroup(match.service)];
  }

  if (match?.city) {
    const { service, city } = match;
    return [
      {
        heading: `${service.name} in other cities`,
        links: cities
          .filter((entry) => entry.slug !== city.slug)
          .map((entry) => ({
            href: cityServicePath(service, entry),
            label: `${service.name} in ${entry.name}`,
          })),
      },
      {
        heading: 'On this service',
        links: [
          { href: service.hub, label: `${service.name} overview` },
          { href: city.areaPath, label: `Home improvement in ${city.name}` },
        ],
      },
    ];
  }

  const city = cityForPath(path);
  if (city) {
    return [
      {
        heading: `Services in ${city.name}`,
        links: services.map((service) => ({
          href: cityServicePath(service, city),
          label: service.name,
        })),
      },
    ];
  }

  if (path.startsWith('/guides/') ) {
    return guideGroups(path);
  }

  if (path === '/areas' || path === '/areas/central-florida') {
    return [
      {
        heading: 'Cities we serve',
        links: cities.map((entry) => ({ href: entry.areaPath, label: entry.name })),
      },
      {
        heading: 'Services',
        links: services.map((service) => ({ href: service.hub, label: service.name })),
      },
    ];
  }

  return [];
}

function cityGroup(service: ServiceDef): RelatedGroup {
  return {
    heading: `${service.name} by city`,
    links: cities.map((city) => ({
      href: cityServicePath(service, city),
      label: `${service.name} in ${city.name}`,
    })),
  };
}

function guideGroups(path: string): RelatedGroup[] {
  const slug = path.split('/').pop() ?? '';
  const matched = TOPIC_RULES.filter((rule) => rule.test.test(slug))
    .map((rule) => services.find((service) => service.cityPrefix === rule.prefix))
    .filter((service): service is ServiceDef => Boolean(service));
  const unique = [...new Map(matched.map((service) => [service.hub, service])).values()];
  const city = cities.find((entry) => slug.includes(entry.slug));
  const links: RelatedLink[] = [];

  for (const service of unique) {
    links.push({ href: service.hub, label: service.name });
    if (city) {
      links.push({
        href: cityServicePath(service, city),
        label: `${service.name} in ${city.name}`,
      });
    }
  }

  if (city) {
    links.push({ href: city.areaPath, label: `${city.name} service area` });
  } else if (links.length > 0) {
    links.push({ href: '/areas/central-florida', label: 'Central Florida service area' });
  }

  if (links.length === 0) return [];
  return [{ heading: 'Related services', links }];
}
