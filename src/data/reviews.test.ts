import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  MIKE_FIGUEROA_PHOTOS,
  NO_PHOTO_REVIEWERS,
  reviewBody,
  reviews,
  UNVERIFIED_REVIEW_PHOTOS,
} from './reviews';

const VICTORIA_PHOTOS = [
  '/images/reviews/victoria-cruz-1-960.webp',
  '/images/reviews/victoria-cruz-2-960.webp',
  '/images/reviews/victoria-cruz-3-960.webp',
  '/images/reviews/victoria-cruz-4-960.webp',
  '/images/reviews/victoria-cruz-5-960.webp',
  '/images/reviews/victoria-cruz-6-960.webp',
];

const NICHOLAS_PHOTOS = [
  '/images/reviews/nicholas-loperena-2-960.webp',
  '/images/reviews/nicholas-loperena-3-960.webp',
  '/images/reviews/nicholas-loperena-4-960.webp',
  '/images/reviews/nicholas-loperena-5-960.webp',
];

describe('Google reviews', () => {
  it('does not treat process copy as Nicholas Loperena’s review', () => {
    const nicholas = reviews.find((review) => review.author === 'Nicholas Loperena');
    expect(nicholas?.rating).toBe(5);
    const body = reviewBody(nicholas?.text);
    expect(body ?? '').not.toMatch(/call and you get mike/i);
    expect(reviewBody('Call and you get Mike. Monday through Friday, 7 AM to 5 PM.')).toBeNull();
    if (body) {
      expect(body).toBe(nicholas?.text.trim());
    }
  });

  it('keeps each review text verbatim and does not invent ratings', () => {
    for (const review of reviews) {
      expect(review.rating).toBe(5);
      expect(review.source).toBe('Google');
      const body = reviewBody(review.text);
      if (body) expect(body).toBe(review.text.trim());
    }
  });

  it('attaches only that reviewer’s own Google photos to their card', () => {
    const victoria = reviews.find((review) => review.author === 'Victoria Cruz');
    const nicholas = reviews.find((review) => review.author === 'Nicholas Loperena');
    expect(victoria?.photos).toEqual(VICTORIA_PHOTOS);
    expect(nicholas?.photos).toEqual(NICHOLAS_PHOTOS);

    for (const name of NO_PHOTO_REVIEWERS) {
      const review = reviews.find((entry) => entry.author === name);
      expect(review?.photos ?? []).toEqual([]);
    }

    const attached = reviews.flatMap((review) => review.photos ?? []);
    expect(attached).toEqual([...VICTORIA_PHOTOS, ...NICHOLAS_PHOTOS]);
    expect(attached.some((src) => (UNVERIFIED_REVIEW_PHOTOS as readonly string[]).includes(src))).toBe(false);
    expect(attached.some((src) => (MIKE_FIGUEROA_PHOTOS as readonly string[]).includes(src))).toBe(false);
  });

  it('ships 480 and 960 webp files for every attached review photo', () => {
    const attached = reviews.flatMap((review) => review.photos ?? []);
    for (const src of attached) {
      expect(existsSync(resolve(`public${src}`))).toBe(true);
      expect(existsSync(resolve(`public${src.replace('-960.webp', '-480.webp')}`))).toBe(true);
    }
  });
});
