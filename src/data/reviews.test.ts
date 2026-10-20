import { reviewBody, reviews } from './reviews';

describe('Google reviews', () => {
  it('does not treat process copy as Nicholas Loperena’s review', () => {
    const nicholas = reviews.find((review) => review.author === 'Nicholas Loperena');
    expect(nicholas?.photos?.length).toBeGreaterThan(0);
    expect(nicholas?.rating).toBe(5);
    const body = reviewBody(nicholas?.text);
    expect(body ?? '').not.toMatch(/call and you get mike/i);
    expect(reviewBody('Call and you get Mike. Monday through Friday, 7 AM to 5 PM.')).toBeNull();
    if (body) {
      expect(body).toBe(nicholas?.text.trim());
    }
  });
});
