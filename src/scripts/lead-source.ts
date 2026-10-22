import {
  LEAD_FIRST_KEY,
  LEAD_LAST_KEY,
  deriveChannel,
  emptyTouch,
  hasCampaignSignal,
  sanitizeSource,
  sanitizeTouch,
  type LeadSource,
  type LeadTouch,
} from '../lib/lead-source';

type WebStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function collectTouch(
  href: string,
  referrer: string,
  timestamp = new Date().toISOString(),
): LeadTouch {
  const url = new URL(href, 'https://goprohomeimprovements.com');
  const query = url.searchParams;
  return sanitizeTouch({
    referrer,
    landingUrl: `${url.origin}${url.pathname}${url.search}`,
    landingPath: url.pathname,
    utm_source: query.get('utm_source') || '',
    utm_medium: query.get('utm_medium') || '',
    utm_campaign: query.get('utm_campaign') || '',
    utm_term: query.get('utm_term') || '',
    utm_content: query.get('utm_content') || '',
    gclid: query.get('gclid') || '',
    fbclid: query.get('fbclid') || '',
    msclkid: query.get('msclkid') || '',
    timestamp,
  });
}

export function isExternalReferrer(referrer: string, pageOrigin: string): boolean {
  if (!referrer) return false;
  try {
    return new URL(referrer).origin !== pageOrigin;
  } catch {
    return false;
  }
}

export function shouldRefreshLastTouch(
  existing: LeadTouch | null,
  next: LeadTouch,
  pageOrigin: string,
): boolean {
  if (!existing) return true;
  if (hasCampaignSignal(next)) return true;
  return isExternalReferrer(next.referrer, pageOrigin);
}

function readTouch(storage: WebStorage | undefined, key: string): LeadTouch | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return sanitizeTouch(parsed);
  } catch {
    return null;
  }
}

function writeTouch(storage: WebStorage | undefined, key: string, touch: LeadTouch): void {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(touch));
  } catch {
    /* private mode / quota */
  }
}

export function captureLeadSource(
  local: WebStorage | undefined = globalThis.localStorage,
  session: WebStorage | undefined = globalThis.sessionStorage,
  href = typeof location !== 'undefined' ? location.href : '',
  referrer = typeof document !== 'undefined' ? document.referrer : '',
  origin = typeof location !== 'undefined' ? location.origin : '',
): { firstTouch: LeadTouch; lastTouch: LeadTouch } {
  const next = href ? collectTouch(href, referrer) : emptyTouch();
  const firstTouch = readTouch(local, LEAD_FIRST_KEY) || next;
  if (!readTouch(local, LEAD_FIRST_KEY)) writeTouch(local, LEAD_FIRST_KEY, firstTouch);

  const existingLast = readTouch(session, LEAD_LAST_KEY);
  const lastTouch = shouldRefreshLastTouch(existingLast, next, origin) ? next : (existingLast || next);
  writeTouch(session, LEAD_LAST_KEY, lastTouch);

  return { firstTouch, lastTouch };
}

export function getSubmitSource(
  local: WebStorage | undefined = globalThis.localStorage,
  session: WebStorage | undefined = globalThis.sessionStorage,
  href = typeof location !== 'undefined' ? location.href : '',
  referrer = typeof document !== 'undefined' ? document.referrer : '',
  userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '',
): LeadSource {
  let origin = typeof location !== 'undefined' ? location.origin : '';
  let submitPath = '/';
  try {
    const url = new URL(href, 'https://goprohomeimprovements.com');
    submitPath = url.pathname;
    origin = origin || url.origin;
  } catch {
    submitPath = '/';
  }

  const { firstTouch, lastTouch } = captureLeadSource(local, session, href, referrer, origin);

  return sanitizeSource({
    firstTouch,
    lastTouch,
    submitPath,
    userAgent,
    channel: deriveChannel(lastTouch),
  });
}
