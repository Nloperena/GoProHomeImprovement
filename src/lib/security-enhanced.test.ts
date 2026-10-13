import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateFormToken,
  verifyFormToken,
  performSecurityCheck,
  isDisposableEmail,
  containsSpamKeywords,
  countLinks,
  hasGibberishPattern,
  checkPayloadSize,
} from './security-enhanced';

describe('Security Enhanced', () => {
  describe('Form Token Management', () => {
    it('should generate valid tokens', () => {
      const token = generateFormToken();
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('should verify valid tokens after minimum time', async () => {
      const token = generateFormToken();
      
      // Wait for minimum form time
      await new Promise(resolve => setTimeout(resolve, 2600));
      
      const result = verifyFormToken(token);
      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should reject tokens submitted too quickly', () => {
      const token = generateFormToken();
      const result = verifyFormToken(token);
      
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Form submitted too quickly');
    });

    it('should reject malformed tokens', () => {
      const result = verifyFormToken('invalid-token');
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Malformed token');
    });
  });

  describe('Disposable Email Detection', () => {
    it('should detect disposable email domains', () => {
      expect(isDisposableEmail('test@mailinator.com')).toBe(true);
      expect(isDisposableEmail('user@guerrillamail.com')).toBe(true);
      expect(isDisposableEmail('spam@10minutemail.com')).toBe(true);
    });

    it('should allow legitimate email domains', () => {
      expect(isDisposableEmail('john@gmail.com')).toBe(false);
      expect(isDisposableEmail('jane@company.com')).toBe(false);
      expect(isDisposableEmail('contact@business.org')).toBe(false);
    });
  });

  describe('Spam Keyword Detection', () => {
    it('should detect spam keywords', () => {
      expect(containsSpamKeywords('Buy viagra now')).toBe(true);
      expect(containsSpamKeywords('Best casino offers')).toBe(true);
      expect(containsSpamKeywords('Crypto investment opportunity')).toBe(true);
      expect(containsSpamKeywords('SEO service backlink')).toBe(true);
    });

    it('should allow legitimate content', () => {
      expect(containsSpamKeywords('I need painting services for my home')).toBe(false);
      expect(containsSpamKeywords('Can you help with drywall repair?')).toBe(false);
      expect(containsSpamKeywords('Looking for interior painting estimate')).toBe(false);
    });
  });

  describe('Link Counting', () => {
    it('should count URLs in text', () => {
      expect(countLinks('Check out https://example.com')).toBe(1);
      expect(countLinks('Visit www.site1.com and www.site2.com')).toBe(2);
      expect(countLinks('https://a.com https://b.com https://c.com')).toBe(3);
    });

    it('should return 0 for text without links', () => {
      expect(countLinks('Just regular text here')).toBe(0);
      expect(countLinks('No links in this message')).toBe(0);
    });
  });

  describe('Gibberish Detection', () => {
    it('should detect gibberish patterns', () => {
      expect(hasGibberishPattern('asdfghjklzxcvbnm')).toBe(true);
      expect(hasGibberishPattern('contactMeForServicesNow')).toBe(true);
      expect(hasGibberishPattern('bcdfghjklmnp')).toBe(true);
    });

    it('should allow legitimate text', () => {
      expect(hasGibberishPattern('John Smith')).toBe(false);
      expect(hasGibberishPattern('Looking for painting services')).toBe(false);
      expect(hasGibberishPattern('Can you help me?')).toBe(false);
    });
  });

  describe('Payload Size Check', () => {
    it('should accept normal-sized payloads', () => {
      const normalData = {
        name: 'John Smith',
        email: 'john@example.com',
        message: 'I need painting services for my home',
      };
      expect(checkPayloadSize(normalData)).toBe(true);
    });

    it('should reject oversized payloads', () => {
      const largeData = {
        message: 'x'.repeat(15000),
      };
      expect(checkPayloadSize(largeData)).toBe(false);
    });
  });

  describe('Complete Security Check - Legitimate Leads', () => {
    it('should pass legitimate lead through all checks', async () => {
      const token = generateFormToken();
      await new Promise(resolve => setTimeout(resolve, 2600));

      const legitimateLead = {
        formToken: token,
        name: 'John Smith',
        email: 'john@gmail.com',
        phone: '555-123-4567',
        city: 'Boston',
        service: 'interior-exterior-painting',
        message: 'I need to get my living room painted. Can you provide an estimate?',
        website: '', // Honeypot should be empty
      };

      const mockRequest = new Request('http://localhost/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '203.0.113.1',
        },
        body: JSON.stringify(legitimateLead),
      });

      const result = await performSecurityCheck(legitimateLead, mockRequest);
      expect(result.passed).toBe(true);
    });

    it('should pass another legitimate lead with different details', async () => {
      const token = generateFormToken();
      await new Promise(resolve => setTimeout(resolve, 2600));

      const legitimateLead = {
        formToken: token,
        name: 'Jane Doe',
        email: 'jane.doe@company.com',
        phone: '617-555-9876',
        city: 'Cambridge',
        service: 'drywall',
        message: 'Need drywall repair in my kitchen after water damage. When are you available?',
        website: '',
      };

      const mockRequest = new Request('http://localhost/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '203.0.113.2',
        },
        body: JSON.stringify(legitimateLead),
      });

      const result = await performSecurityCheck(legitimateLead, mockRequest);
      expect(result.passed).toBe(true);
    });
  });

  describe('Complete Security Check - Spam Detection', () => {
    it('should block honeypot spam', async () => {
      const token = generateFormToken();
      await new Promise(resolve => setTimeout(resolve, 2600));

      const spamData = {
        formToken: token,
        name: 'Spammer',
        email: 'spam@example.com',
        message: 'Spam message',
        website: 'http://spam-site.com', // Honeypot filled
      };

      const mockRequest = new Request('http://localhost/api/estimate', {
        method: 'POST',
        headers: { 'x-forwarded-for': '203.0.113.3' },
      });

      const result = await performSecurityCheck(spamData, mockRequest);
      expect(result.passed).toBe(false);
      expect(result.logTag).toBe('HONEYPOT');
    });

    it('should block disposable email addresses', async () => {
      const token = generateFormToken();
      await new Promise(resolve => setTimeout(resolve, 2600));

      const spamData = {
        formToken: token,
        name: 'Test User',
        email: 'test@mailinator.com',
        message: 'Test message',
        website: '',
      };

      const mockRequest = new Request('http://localhost/api/estimate', {
        method: 'POST',
        headers: { 'x-forwarded-for': '203.0.113.4' },
      });

      const result = await performSecurityCheck(spamData, mockRequest);
      expect(result.passed).toBe(false);
      expect(result.logTag).toBe('DISPOSABLE_EMAIL');
    });

    it('should block spam keywords', async () => {
      const token = generateFormToken();
      await new Promise(resolve => setTimeout(resolve, 2600));

      const spamData = {
        formToken: token,
        name: 'Marketing',
        email: 'real@gmail.com',
        message: 'Buy viagra now! Best casino offers and crypto investment!',
        website: '',
      };

      const mockRequest = new Request('http://localhost/api/estimate', {
        method: 'POST',
        headers: { 'x-forwarded-for': '203.0.113.5' },
      });

      const result = await performSecurityCheck(spamData, mockRequest);
      expect(result.passed).toBe(false);
      expect(result.logTag).toBe('SPAM_KEYWORDS');
    });

    it('should block excessive links', async () => {
      const token = generateFormToken();
      await new Promise(resolve => setTimeout(resolve, 2600));

      const spamData = {
        formToken: token,
        name: 'Link Spammer',
        email: 'real@gmail.com',
        message: 'Visit https://site1.com and https://site2.com and https://site3.com for more',
        website: '',
      };

      const mockRequest = new Request('http://localhost/api/estimate', {
        method: 'POST',
        headers: { 'x-forwarded-for': '203.0.113.6' },
      });

      const result = await performSecurityCheck(spamData, mockRequest);
      expect(result.passed).toBe(false);
      expect(result.logTag).toBe('EXCESSIVE_LINKS');
    });

    it('should block gibberish names', async () => {
      const token = generateFormToken();
      await new Promise(resolve => setTimeout(resolve, 2600));

      const spamData = {
        formToken: token,
        name: 'asdfghjklzxcvbnm',
        email: 'real@gmail.com',
        message: 'Need painting service',
        website: '',
      };

      const mockRequest = new Request('http://localhost/api/estimate', {
        method: 'POST',
        headers: { 'x-forwarded-for': '203.0.113.7' },
      });

      const result = await performSecurityCheck(spamData, mockRequest);
      expect(result.passed).toBe(false);
      expect(result.logTag).toBe('GIBBERISH_NAME');
    });

    it('should block submissions without token', async () => {
      const spamData = {
        name: 'Test User',
        email: 'test@gmail.com',
        message: 'Test message',
        website: '',
      };

      const mockRequest = new Request('http://localhost/api/estimate', {
        method: 'POST',
        headers: { 'x-forwarded-for': '203.0.113.8' },
      });

      const result = await performSecurityCheck(spamData, mockRequest);
      expect(result.passed).toBe(false);
      expect(result.logTag).toBe('TOKEN_MISSING');
    });

    it('should block submissions that are too quick', async () => {
      const token = generateFormToken();
      // Don't wait - submit immediately

      const spamData = {
        formToken: token,
        name: 'Bot User',
        email: 'bot@gmail.com',
        message: 'Quick bot message',
        website: '',
      };

      const mockRequest = new Request('http://localhost/api/estimate', {
        method: 'POST',
        headers: { 'x-forwarded-for': '203.0.113.9' },
      });

      const result = await performSecurityCheck(spamData, mockRequest);
      expect(result.passed).toBe(false);
      expect(result.logTag).toBe('TOKEN_INVALID');
    });
  });
});
