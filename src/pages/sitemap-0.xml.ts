import { indexablePathnames, sitemapXml } from '../lib/seo/routes';

export const prerender = true;

export function GET() {
  return new Response(sitemapXml(indexablePathnames()), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
