import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  appendSourceLine,
  buildNexrenaPayload,
  deriveChannel,
  emptyTouch,
  formatSourceLine,
  sanitizeSource,
  type LeadTouch,
} from './lead-source';
import {
  captureLeadSource,
  collectTouch,
  getSubmitSource,
  shouldRefreshLastTouch,
} from '../scripts/lead-source';

function source(path: string) {
  return readFileSync(resolve(path), 'utf8');
}

function touch(overrides: Partial<LeadTouch> = {}): LeadTouch {
  return { ...emptyTouch('2026-10-21T21:00:00.000Z'), ...overrides };
}

function memoryStore(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem: (key: string) => (key in data ? data[key] : null),
    setItem: (key: string, value: string) => {
      data[key] = value;
    },
    data,
  };
}

describe('deriveChannel', () => {
  it('labels google ads from gclid before paid or organic signals', () => {
    expect(deriveChannel(touch({
      gclid: 'EAIa',
      utm_medium: 'organic',
      referrer: 'https://www.google.com/',
    }))).toBe('google_ads');
  });

  it('labels paid from cpc, ppc, or paid utm_medium', () => {
    expect(deriveChannel(touch({ utm_medium: 'cpc' }))).toBe('paid');
    expect(deriveChannel(touch({ utm_medium: 'ppc' }))).toBe('paid');
    expect(deriveChannel(touch({ utm_medium: 'paid', utm_campaign: 'gbp' }))).toBe('paid');
  });

  it('accepts utm_source=gbp and the documented GBP campaign', () => {
    expect(deriveChannel(touch({ utm_source: 'gbp' }))).toBe('gbp');
    expect(deriveChannel(touch({
      utm_source: 'google',
      utm_medium: 'organic',
      utm_campaign: 'gbp',
    }))).toBe('gbp');
  });

  it('labels Google Maps referrers and maps UTM as google_maps', () => {
    expect(deriveChannel(touch({ referrer: 'https://maps.google.com/?cid=1' }))).toBe('google_maps');
    expect(deriveChannel(touch({
      referrer: 'https://www.google.com/maps/place/Go+Pro',
    }))).toBe('google_maps');
    expect(deriveChannel(touch({ utm_source: 'google_maps' }))).toBe('google_maps');
  });

  it('labels search-engine referrers organic and social hosts social', () => {
    expect(deriveChannel(touch({ referrer: 'https://www.google.com/' }))).toBe('organic_search');
    expect(deriveChannel(touch({ referrer: 'https://www.bing.com/search?q=painter' }))).toBe('organic_search');
    expect(deriveChannel(touch({ referrer: 'https://www.facebook.com/' }))).toBe('social');
    expect(deriveChannel(touch({ utm_source: 'instagram', utm_medium: 'social' }))).toBe('social');
  });

  it('labels other referrers as referral and empty landings as direct', () => {
    expect(deriveChannel(touch({ referrer: 'https://nextdoor-neighbor.example/' }))).toBe('referral');
    expect(deriveChannel(touch({ referrer: 'https://example.com/blog' }))).toBe('referral');
    expect(deriveChannel(touch())).toBe('direct');
  });
});

describe('first and last touch storage', () => {
  it('collects referrer, landing url/path, UTMs, and click ids', () => {
    const collected = collectTouch(
      'https://go-pro-home-improvements.vercel.app/services/painting?utm_source=google&utm_medium=organic&utm_campaign=gbp&gclid=abc&fbclid=fb&msclkid=ms',
      'https://www.google.com/',
      '2026-10-21T21:00:00.000Z',
    );

    expect(collected).toMatchObject({
      referrer: 'https://www.google.com/',
      landingUrl: 'https://go-pro-home-improvements.vercel.app/services/painting?utm_source=google&utm_medium=organic&utm_campaign=gbp&gclid=abc&fbclid=fb&msclkid=ms',
      landingPath: '/services/painting',
      utm_source: 'google',
      utm_medium: 'organic',
      utm_campaign: 'gbp',
      gclid: 'abc',
      fbclid: 'fb',
      msclkid: 'ms',
      timestamp: '2026-10-21T21:00:00.000Z',
    });
  });

  it('keeps first-touch in localStorage and last-touch in sessionStorage across /estimate', () => {
    const local = memoryStore();
    const session = memoryStore();
    const landing = 'https://goprohomeimprovements.com/services/painting';
    const referrer = 'https://www.google.com/';

    captureLeadSource(local, session, landing, referrer, 'https://goprohomeimprovements.com');
    const later = captureLeadSource(
      local,
      session,
      'https://goprohomeimprovements.com/estimate',
      'https://goprohomeimprovements.com/services/painting',
      'https://goprohomeimprovements.com',
    );

    expect(later.firstTouch.landingPath).toBe('/services/painting');
    expect(later.lastTouch.landingPath).toBe('/services/painting');
    expect(later.lastTouch.referrer).toBe(referrer);
    expect(JSON.parse(local.data['gopro:leadFirst']).landingPath).toBe('/services/painting');
    expect(JSON.parse(session.data['gopro:leadLast']).landingPath).toBe('/services/painting');
  });

  it('refreshes last-touch only for new campaign or external landings', () => {
    const first = collectTouch('https://goprohomeimprovements.com/', 'https://www.google.com/');
    const internal = collectTouch(
      'https://goprohomeimprovements.com/estimate',
      'https://goprohomeimprovements.com/',
    );
    const ads = collectTouch('https://goprohomeimprovements.com/?gclid=1', 'https://www.google.com/');

    expect(shouldRefreshLastTouch(first, internal, 'https://goprohomeimprovements.com')).toBe(false);
    expect(shouldRefreshLastTouch(first, ads, 'https://goprohomeimprovements.com')).toBe(true);
    expect(shouldRefreshLastTouch(null, internal, 'https://goprohomeimprovements.com')).toBe(true);
  });

  it('includes first-touch, last-touch, submit path, user agent, and channel on submit', () => {
    const local = memoryStore();
    const session = memoryStore();
    captureLeadSource(
      local,
      session,
      'https://goprohomeimprovements.com/services/painting',
      'https://www.google.com/',
      'https://goprohomeimprovements.com',
    );

    const payload = getSubmitSource(
      local,
      session,
      'https://goprohomeimprovements.com/estimate',
      'https://goprohomeimprovements.com/services/painting',
      'Mozilla/5.0 Test',
    );

    expect(payload.channel).toBe('organic_search');
    expect(payload.submitPath).toBe('/estimate');
    expect(payload.userAgent).toBe('Mozilla/5.0 Test');
    expect(payload.firstTouch.landingPath).toBe('/services/painting');
    expect(payload.lastTouch.referrer).toBe('https://www.google.com/');
  });
});

describe('Nexrena portal payload', () => {
  const firstTouch = touch({
    referrer: 'https://www.google.com/',
    landingUrl: 'https://goprohomeimprovements.com/services/painting',
    landingPath: '/services/painting',
  });

  it('forwards a structured source field and appends a readable line to the message', () => {
    const payload = buildNexrenaPayload({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Need the living room painted this month.',
      phone: '4072446873',
      service: 'interior-exterior-painting',
      city: 'Kissimmee',
      website: '',
      source: {
        firstTouch,
        lastTouch: firstTouch,
        submitPath: '/estimate',
        userAgent: 'Mozilla/5.0 Test',
      },
    }, 'https://goprohomeimprovements.com/estimate');

    expect(payload).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Need the living room painted this month.\n\nSource: organic_search, google.com, landing /services/painting',
      phone: '4072446873',
      service: 'interior-exterior-painting',
      city: 'Kissimmee',
      formName: 'estimate',
      pageUrl: 'https://goprohomeimprovements.com/estimate',
      website: '',
      source: {
        channel: 'organic_search',
        firstTouch,
        lastTouch: firstTouch,
        submitPath: '/estimate',
        userAgent: 'Mozilla/5.0 Test',
      },
    });
  });

  it('re-derives channel and strips unknown fields', () => {
    const payload = buildNexrenaPayload({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Need the living room painted this month.',
      phone: '4072446873',
      service: 'interior-exterior-painting',
      city: 'Kissimmee',
      source: {
        channel: 'direct',
        extra: 'drop-me',
        firstTouch: { ...firstTouch, gclid: 'EAIa', evil: '<script>' },
        lastTouch: { ...firstTouch, gclid: 'EAIa' },
        submitPath: '/estimate',
        userAgent: 'Mozilla/5.0 Test',
      },
    }, 'https://goprohomeimprovements.com/estimate');

    expect(payload.source.channel).toBe('google_ads');
    expect(payload.source).not.toHaveProperty('extra');
    expect(payload.source.firstTouch).not.toHaveProperty('evil');
    expect(payload.message).toContain('Source: google_ads, google.com, landing /services/painting');
  });

  it('does not duplicate the source line', () => {
    const line = formatSourceLine(sanitizeSource({ firstTouch, lastTouch: firstTouch, submitPath: '/estimate' }));
    expect(appendSourceLine(`Hello world\n\n${line}`, line)).toBe(`Hello world\n\n${line}`);
  });
});

describe('lead source wiring', () => {
  it('captures on every page and posts source from both estimate forms', () => {
    expect(source('src/layouts/BaseLayout.astro')).toContain('captureLeadSource');
    expect(source('src/components/home/EstimateTicket.astro')).toContain('source: getSubmitSource()');
    expect(source('src/pages/estimate.astro')).toContain('getSubmitSource()');
    expect(source('src/pages/api/estimate.ts')).toContain("buildNexrenaPayload");
    expect(source('src/pages/api/estimate.ts')).toContain("X-Site-Key");
    expect(source('src/pages/api/estimate.ts')).toContain("'gopro'");
  });

  it('documents the GBP website link and stays cookie-free', () => {
    const readme = source('README.md');
    expect(readme).toContain('https://go-pro-home-improvements.vercel.app/?utm_source=google&utm_medium=organic&utm_campaign=gbp');
    expect(readme).toContain('utm_source=gbp');
    expect(readme.toLowerCase()).toContain('no cookies');

    const client = [
      source('src/scripts/lead-source.ts'),
      source('src/layouts/BaseLayout.astro'),
      source('src/components/home/EstimateTicket.astro'),
      source('src/pages/estimate.astro'),
    ].join('\n');
    expect(client).not.toMatch(/document\.cookie|gtag\(|fbq\(|googletagmanager/i);
  });
});
