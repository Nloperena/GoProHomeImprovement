import type { APIRoute } from 'astro';
import { GOOGLE_REVIEW_URL } from '../data/reviews';

/** Short link for review requests. Not a page, and not listed in the sitemap. */
export const prerender = false;

export const GET: APIRoute = ({ redirect }) => redirect(GOOGLE_REVIEW_URL, 302);
