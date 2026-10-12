/** Production origin. The Vercel preview host is not the canonical host. */
export const SITE_ORIGIN = 'https://goprohomeimprovements.com';

export const SITE_NAME = 'Go Pro Home Improvements';

export const PHONE_DISPLAY = '(407) 244-6873';

export const EMAIL = 'gopro4good@gmail.com';

export const DEFAULT_OG_IMAGE = '/images/trim-navy-wall.jpg';

/**
 * Absolute canonical URL on the production host, without a query string
 * and without a trailing slash (the root keeps its slash).
 */
export function canonicalUrl(input: string | URL): string {
  const raw = typeof input === 'string' ? input : input.href;
  let url: URL;
  try {
    url = new URL(raw, SITE_ORIGIN);
  } catch {
    return `${SITE_ORIGIN}/`;
  }

  const path = url.pathname || '/';
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  return normalized === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalized}`;
}
