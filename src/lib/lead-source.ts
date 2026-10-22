export const LEAD_FIRST_KEY = 'gopro:leadFirst';
export const LEAD_LAST_KEY = 'gopro:leadLast';

export type LeadChannel =
  | 'google_ads'
  | 'paid'
  | 'google_maps'
  | 'gbp'
  | 'organic_search'
  | 'social'
  | 'referral'
  | 'direct';

export interface LeadTouch {
  referrer: string;
  landingUrl: string;
  landingPath: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  fbclid: string;
  msclkid: string;
  timestamp: string;
}

export interface LeadSource {
  channel: LeadChannel;
  firstTouch: LeadTouch;
  lastTouch: LeadTouch;
  submitPath: string;
  userAgent: string;
}

export interface NexrenaEstimatePayload {
  name: string;
  email: string;
  message: string;
  phone: string;
  service: string;
  city: string;
  formName: 'estimate';
  pageUrl: string;
  website: string;
  source: LeadSource;
}

const PAID_MEDIUMS = new Set(['cpc', 'ppc', 'paid']);
const SEARCH_HOSTS = [
  'google.', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'baidu.com',
  'yandex.', 'ecosia.org', 'search.brave.com', 'aol.com',
];
const SOCIAL_HOSTS = [
  'facebook.com', 'fb.com', 'instagram.com', 'twitter.com', 'x.com', 't.co',
  'linkedin.com', 'pinterest.com', 'tiktok.com', 'youtube.com', 'youtu.be',
  'reddit.com', 'threads.net', 'snapchat.com', 'whatsapp.com', 'nextdoor.com',
];

const CLIP = {
  url: 500,
  path: 200,
  param: 200,
  ua: 400,
};

export function emptyTouch(timestamp = new Date().toISOString()): LeadTouch {
  return {
    referrer: '',
    landingUrl: '',
    landingPath: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
    gclid: '',
    fbclid: '',
    msclkid: '',
    timestamp,
  };
}

export function clip(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export function hasCampaignSignal(touch: LeadTouch): boolean {
  return Boolean(
    touch.utm_source ||
    touch.utm_medium ||
    touch.utm_campaign ||
    touch.utm_term ||
    touch.utm_content ||
    touch.gclid ||
    touch.fbclid ||
    touch.msclkid,
  );
}

export function hasAttribution(touch: LeadTouch): boolean {
  return hasCampaignSignal(touch) || Boolean(touch.referrer);
}

function hostOf(value: string): string {
  if (!value) return '';
  try {
    return new URL(value).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return value.replace(/^www\./, '').toLowerCase();
  }
}

function pathOf(value: string): string {
  try {
    return new URL(value).pathname.toLowerCase();
  } catch {
    return '';
  }
}

function matchesHost(host: string, needles: string[]): boolean {
  return needles.some((needle) => host === needle || host.endsWith(needle) || host.includes(needle));
}

function utmValues(touch: LeadTouch): string[] {
  return [touch.utm_source, touch.utm_medium, touch.utm_campaign, touch.utm_term, touch.utm_content]
    .map((value) => value.toLowerCase());
}

export function isGbpTouch(touch: LeadTouch): boolean {
  const utms = utmValues(touch);
  if (utms.some((value) => value === 'gbp' || value === 'google_business' || value.includes('business_profile') || value.includes('googlebusiness'))) {
    return true;
  }
  const host = hostOf(touch.referrer);
  return host === 'business.google.com' || host === 'g.page' || host.endsWith('.g.page');
}

export function isMapsTouch(touch: LeadTouch): boolean {
  const source = touch.utm_source.toLowerCase();
  if (source === 'google_maps' || source === 'maps') return true;
  const host = hostOf(touch.referrer);
  const path = pathOf(touch.referrer);
  if (host.startsWith('maps.google.')) return true;
  return (host === 'google.com' || host.endsWith('.google.com')) && path.startsWith('/maps');
}

export function deriveChannel(touch: LeadTouch): LeadChannel {
  if (touch.gclid) return 'google_ads';
  if (PAID_MEDIUMS.has(touch.utm_medium.toLowerCase())) return 'paid';
  if (isGbpTouch(touch)) return 'gbp';
  if (isMapsTouch(touch)) return 'google_maps';

  const host = hostOf(touch.referrer);
  const source = touch.utm_source.toLowerCase();
  const medium = touch.utm_medium.toLowerCase();

  if (host && matchesHost(host, SEARCH_HOSTS) && !isMapsTouch(touch)) return 'organic_search';
  if ((medium === 'organic' || medium === 'seo') && matchesHost(source, SEARCH_HOSTS)) return 'organic_search';

  if (host && matchesHost(host, SOCIAL_HOSTS)) return 'social';
  if (matchesHost(source, SOCIAL_HOSTS) || medium === 'social') return 'social';

  if (host || hasCampaignSignal(touch)) return 'referral';
  return 'direct';
}

export function sourceHost(touch: LeadTouch): string {
  const host = hostOf(touch.referrer);
  if (host) return host;
  if (touch.utm_source) return touch.utm_source;
  return 'direct';
}

export function formatSourceLine(source: LeadSource): string {
  const touch = hasAttribution(source.lastTouch) ? source.lastTouch : source.firstTouch;
  const path = touch.landingPath || source.submitPath || '/';
  return `Source: ${source.channel}, ${sourceHost(touch)}, landing ${path}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function sanitizeTouch(raw: unknown): LeadTouch {
  const obj = isRecord(raw) ? raw : {};
  return {
    referrer: clip(obj.referrer, CLIP.url),
    landingUrl: clip(obj.landingUrl, CLIP.url),
    landingPath: clip(obj.landingPath, CLIP.path),
    utm_source: clip(obj.utm_source, CLIP.param),
    utm_medium: clip(obj.utm_medium, CLIP.param),
    utm_campaign: clip(obj.utm_campaign, CLIP.param),
    utm_term: clip(obj.utm_term, CLIP.param),
    utm_content: clip(obj.utm_content, CLIP.param),
    gclid: clip(obj.gclid, CLIP.param),
    fbclid: clip(obj.fbclid, CLIP.param),
    msclkid: clip(obj.msclkid, CLIP.param),
    timestamp: clip(obj.timestamp, 40) || new Date().toISOString(),
  };
}

export function sanitizeSource(
  raw: unknown,
  fallbacks: { submitPath?: string; userAgent?: string } = {},
): LeadSource {
  const obj = isRecord(raw) ? raw : {};
  const firstTouch = sanitizeTouch(obj.firstTouch);
  const lastTouch = isRecord(obj.lastTouch) ? sanitizeTouch(obj.lastTouch) : firstTouch;
  const primary = hasAttribution(lastTouch) ? lastTouch : firstTouch;
  return {
    channel: deriveChannel(primary),
    firstTouch,
    lastTouch,
    submitPath: clip(typeof obj.submitPath === 'string' ? obj.submitPath : fallbacks.submitPath, CLIP.path),
    userAgent: clip(typeof obj.userAgent === 'string' ? obj.userAgent : fallbacks.userAgent, CLIP.ua),
  };
}

export function appendSourceLine(message: string, line: string): string {
  const trimmed = message.trim();
  if (trimmed.includes(line)) return trimmed;
  return `${trimmed}\n\n${line}`;
}

export function buildNexrenaPayload(
  data: {
    name: string;
    email: string;
    message: string;
    phone: string;
    service: string;
    city: string;
    website?: string;
    source?: unknown;
  },
  pageUrl: string,
): NexrenaEstimatePayload {
  let submitPath = '';
  try {
    submitPath = new URL(pageUrl).pathname;
  } catch {
    submitPath = '';
  }

  const source = sanitizeSource(data.source, { submitPath });
  return {
    name: data.name,
    email: data.email,
    message: appendSourceLine(data.message, formatSourceLine(source)),
    phone: data.phone,
    service: data.service,
    city: data.city,
    formName: 'estimate',
    pageUrl,
    website: data.website || '',
    source,
  };
}
