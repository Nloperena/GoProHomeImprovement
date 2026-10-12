import { sitemapIndexXml } from '../lib/seo/routes';

export const prerender = true;

export function GET() {
  return new Response(sitemapIndexXml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
