import { breadcrumbListNode } from './breadcrumbs';
import { cities, counties, services } from './catalog';
import { EMAIL, PHONE_DISPLAY, SITE_NAME, SITE_ORIGIN, canonicalUrl } from './site';

type JsonLd = Record<string, unknown>;

const BUSINESS_ID = `${SITE_ORIGIN}/#business`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

const BUSINESS_TYPES = new Set([
  'HomeAndConstructionBusiness',
  'LocalBusiness',
  'GeneralContractor',
]);

const COMPANY_NAMES = new Set(['GO PRO HOME IMPROVEMENTS INC.', 'Go Pro Home Improvements']);

const florida = { '@type': 'State', name: 'Florida' };

export function buildStructuredData(input: {
  pathname: string;
  title: string;
  description: string;
  image: string;
  extra?: object;
}): JsonLd {
  const pageUrl = canonicalUrl(input.pathname);
  const extras = nodesFrom(input.extra)
    .filter((node) => !isBusinessNode(node))
    .map((node) => normalizeNode(node, pageUrl));

  const graph: JsonLd[] = [businessNode(), websiteNode(), webPageNode(input, pageUrl)];
  const list = collectionList(input.pathname);
  if (list) graph.push(list);
  graph.push(...extras);
  if (!extras.some((node) => typesOf(node).includes('BreadcrumbList'))) {
    const crumbs = breadcrumbListNode(input.pathname);
    if (crumbs) graph.push(crumbs);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function jsonLdScript(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function businessNode(): JsonLd {
  return {
    '@type': ['HomeAndConstructionBusiness', 'LocalBusiness'],
    '@id': BUSINESS_ID,
    name: SITE_NAME,
    legalName: 'GO PRO HOME IMPROVEMENTS INC.',
    url: `${SITE_ORIGIN}/`,
    telephone: PHONE_DISPLAY,
    email: EMAIL,
    foundingDate: '2014',
    image: `${SITE_ORIGIN}/images/logo.png`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_ORIGIN}/images/logo.png`,
    },
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kissimmee',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    areaServed: [
      ...cities.map((city) => ({
        '@type': 'City',
        name: city.name,
        containedInPlace: florida,
      })),
      ...counties.map((name) => ({
        '@type': 'AdministrativeArea',
        name,
        containedInPlace: florida,
      })),
      { '@type': 'Place', name: 'Central Florida' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '17:00',
      },
    ],
    knowsAbout: [
      'Power Washing',
      'Interior Painting',
      'Exterior Painting',
      'Demolition',
      'Trim Installation',
      'Crown Molding',
      'Wallpaper Installation',
      'Custom Murals',
      'TV Mounting',
      'Home Theater Installation',
      'Drywall Installation',
      'Drywall Repair',
    ],
    sameAs: [
      'https://www.instagram.com/gopro4good/',
      'https://share.google/mxf7aR650uFCQUTab',
      'https://www.google.com/maps?cid=11832173553199565594',
    ],
  };
}

function websiteNode(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_ORIGIN}/`,
    name: SITE_NAME,
    publisher: { '@id': BUSINESS_ID },
    inLanguage: 'en-US',
  };
}

function webPageNode(
  input: { title: string; description: string; image: string },
  pageUrl: string,
): JsonLd {
  return {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: input.title,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': BUSINESS_ID },
    inLanguage: 'en-US',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: input.image,
    },
  };
}

function collectionList(pathname: string): JsonLd | null {
  if (pathname === '/services') {
    return itemList(
      `${SITE_ORIGIN}/services#services`,
      'Home improvement services',
      services.map((service) => ({ name: service.name, url: `${SITE_ORIGIN}${service.hub}` })),
    );
  }
  if (pathname === '/areas') {
    const areas = [
      ...cities.map((city) => ({ name: city.name, url: `${SITE_ORIGIN}${city.areaPath}` })),
      { name: 'Central Florida', url: `${SITE_ORIGIN}/areas/central-florida` },
    ];
    return itemList(`${SITE_ORIGIN}/areas#areas`, 'Service areas', areas);
  }
  return null;
}

function itemList(id: string, name: string, items: { name: string; url: string }[]): JsonLd {
  return {
    '@type': 'ItemList',
    '@id': id,
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

function nodesFrom(schema: object | undefined): JsonLd[] {
  if (!schema) return [];
  const record = schema as JsonLd;
  if (Array.isArray(record['@graph'])) return record['@graph'] as JsonLd[];
  if (record['@type']) {
    const { ['@context']: _context, ...node } = record;
    return [node];
  }
  return [];
}

function isBusinessNode(node: JsonLd): boolean {
  if (node['@id'] === BUSINESS_ID) return true;
  return typesOf(node).some((type) => BUSINESS_TYPES.has(type));
}

function isCompanyOrg(node: JsonLd): boolean {
  return typesOf(node).includes('Organization') && COMPANY_NAMES.has(String(node.name ?? ''));
}

function typesOf(node: JsonLd): string[] {
  const value = node['@type'];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.filter((type): type is string => typeof type === 'string');
  return [];
}

function normalizeNode(node: JsonLd, pageUrl: string): JsonLd {
  return walk(node, pageUrl) as JsonLd;
}

function walk(value: unknown, pageUrl: string): unknown {
  if (Array.isArray(value)) return value.map((entry) => walk(entry, pageUrl));
  if (!value || typeof value !== 'object') return value;

  const source = value as JsonLd;
  if (isCompanyOrg(source)) return { '@id': BUSINESS_ID };

  const next: JsonLd = {};
  for (const [key, child] of Object.entries(source)) {
    if (key === 'containedIn' && typeof child === 'string') {
      next.containedInPlace = { '@type': 'State', name: child };
      continue;
    }
    if (key === 'item' && child === SITE_ORIGIN) {
      next[key] = `${SITE_ORIGIN}/`;
      continue;
    }
    next[key] = walk(child, pageUrl);
  }

  const types = typesOf(next);
  if (types.includes('Article') || types.includes('BlogPosting')) {
    next.mainEntityOfPage ??= { '@id': `${pageUrl}#webpage` };
    next.isPartOf ??= { '@id': WEBSITE_ID };
    next.author ??= { '@id': BUSINESS_ID };
    next.publisher ??= { '@id': BUSINESS_ID };
  }
  if (types.includes('Service')) {
    next.provider ??= { '@id': BUSINESS_ID };
    next.url ??= pageUrl;
  }
  return next;
}
