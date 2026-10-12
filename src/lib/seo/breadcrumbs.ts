import { canonicalUrl } from './site';

export interface Crumb {
  name: string;
  path: string;
}

const LABELS: Record<string, string> = {
  about: 'About',
  work: 'Our Work',
  reviews: 'Reviews',
  estimate: 'Free Estimate',
  services: 'Services',
  areas: 'Service Areas',
  guides: 'Guides',
  'central-florida': 'Central Florida',
  kissimmee: 'Kissimmee',
  orlando: 'Orlando',
  'st-cloud': 'St. Cloud',
  celebration: 'Celebration',
  poinciana: 'Poinciana',
};

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const path = pathname.split('?')[0].split('#')[0];
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

export function breadcrumbsFor(pathname: string): Crumb[] {
  const path = normalizePath(pathname);
  if (path === '/') return [];

  const crumbs: Crumb[] = [{ name: 'Home', path: '/' }];
  let acc = '';
  for (const part of path.split('/').filter(Boolean)) {
    acc += `/${part}`;
    crumbs.push({ name: LABELS[part] ?? labelFromSlug(part), path: acc });
  }
  return crumbs;
}

export function breadcrumbListNode(pathname: string): Record<string, unknown> | null {
  const crumbs = breadcrumbsFor(pathname);
  if (crumbs.length < 2) return null;
  const pageUrl = canonicalUrl(pathname);
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumbs`,
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path),
    })),
  };
}

function labelFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
