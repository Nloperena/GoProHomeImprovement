import { reviewBody, reviews, UNVERIFIED_REVIEW_PHOTOS } from './reviews';

const VICTORIA_TRAILER = [
  '/images/reviews/trailer-960.webp',
  '/images/reviews/trailer-tv-960.webp',
  '/images/reviews/trailer-sofa-960.webp',
];

describe('Google reviews', () => {
  it('does not treat process copy as Nicholas Loperena’s review', () => {
    const nicholas = reviews.find((review) => review.author === 'Nicholas Loperena');
    expect(nicholas?.photos ?? []).toEqual([]);
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

  it('attaches only verified photos to the reviewer who wrote about that work', () => {
    const victoria = reviews.find((review) => review.author === 'Victoria Cruz');
    expect(victoria?.photos).toEqual(VICTORIA_TRAILER);

    const attached = reviews.flatMap((review) => review.photos ?? []);
    expect(attached).toEqual(VICTORIA_TRAILER);
    expect(attached.some((src) => (UNVERIFIED_REVIEW_PHOTOS as readonly string[]).includes(src))).toBe(false);
  });
});
