export interface City {
  slug: string;
  name: string;
  areaPath: string;
}

export interface ServiceDef {
  hub: string;
  name: string;
  serviceType: string;
  cityPrefix: string;
}

/** Cities with their own area page and city-service pages. */
export const cities: City[] = [
  { slug: 'kissimmee', name: 'Kissimmee', areaPath: '/areas/kissimmee' },
  { slug: 'orlando', name: 'Orlando', areaPath: '/areas/orlando' },
  { slug: 'st-cloud', name: 'St. Cloud', areaPath: '/areas/st-cloud' },
  { slug: 'celebration', name: 'Celebration', areaPath: '/areas/celebration' },
  { slug: 'poinciana', name: 'Poinciana', areaPath: '/areas/poinciana' },
];

/** Counties named in page copy, not offered as their own city pages. */
export const counties = ['Osceola County', 'Orange County'];

export const services: ServiceDef[] = [
  {
    hub: '/services/power-washing',
    name: 'Power Washing',
    serviceType: 'Power Washing',
    cityPrefix: 'power-washing',
  },
  {
    hub: '/services/interior-exterior-painting',
    name: 'Interior & Exterior Painting',
    serviceType: 'Interior and Exterior Painting',
    cityPrefix: 'painting',
  },
  {
    hub: '/services/demolition',
    name: 'Demolition',
    serviceType: 'Demolition',
    cityPrefix: 'demolition',
  },
  {
    hub: '/services/trim-crown-molding',
    name: 'Trim & Crown Molding',
    serviceType: 'Trim and Crown Molding Installation',
    cityPrefix: 'trim-crown-molding',
  },
  {
    hub: '/services/wallpaper',
    name: 'Wallpaper',
    serviceType: 'Wallpaper Installation and Removal',
    cityPrefix: 'wallpaper',
  },
  {
    hub: '/services/murals',
    name: 'Custom Murals',
    serviceType: 'Custom Wall Murals',
    cityPrefix: 'murals',
  },
  {
    hub: '/services/tv-mounting',
    name: 'TV Mounting',
    serviceType: 'TV Mounting',
    cityPrefix: 'tv-mounting',
  },
  {
    hub: '/services/movie-rooms',
    name: 'Home Theaters',
    serviceType: 'Home Theater Installation',
    cityPrefix: 'movie-rooms',
  },
  {
    hub: '/services/drywall',
    name: 'Drywall',
    serviceType: 'Drywall Repair and Installation',
    cityPrefix: 'drywall-repair',
  },
];

export function cityServicePath(service: ServiceDef, city: City): string {
  return `/services/${service.cityPrefix}-${city.slug}`;
}

export function serviceForPath(pathname: string): { service: ServiceDef; city?: City } | undefined {
  const service = services.find((entry) => entry.hub === pathname);
  if (service) return { service };

  for (const entry of services) {
    for (const city of cities) {
      if (cityServicePath(entry, city) === pathname) return { service: entry, city };
    }
  }
  return undefined;
}

export function cityForPath(pathname: string): City | undefined {
  return cities.find((city) => city.areaPath === pathname);
}
