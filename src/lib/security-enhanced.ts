/**
 * Enhanced Security Layer for Forms and API Routes
 * 
 * Complete protection suite including:
 * - Signed time-to-submit tokens (HMAC-based)
 * - Optional Cloudflare Turnstile verification
 * - Per-IP and per-email rate limiting
 * - Disposable domain blocklist
 * - Link and keyword spam filters
 * - Gibberish detection
 * - Payload size limits
 * - Strict validation with generic responses
 */

import crypto from 'node:crypto';

// ============================================================================
// Configuration
// ============================================================================

const TOKEN_SECRET = process.env.FORM_TOKEN_SECRET || 'default-dev-secret-change-in-production';
const TOKEN_MAX_AGE_MS = 3600000; // 1 hour
const MIN_FORM_TIME_MS = 2500; // 2.5 seconds minimum
const MAX_PAYLOAD_SIZE = 10000; // 10KB

// Rate limiting windows
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_IP_MAX = 5;
const RATE_LIMIT_EMAIL_MAX = 3;

// Cloudflare Turnstile
const TURNSTILE_ENABLED = process.env.TURNSTILE_ENABLED === 'true';
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '';

// In-memory stores (reset on cold start - acceptable for serverless)
const ipRequestLog = new Map<string, number[]>();
const emailRequestLog = new Map<string, number[]>();

// ============================================================================
// Disposable Email Domains Blocklist
// ============================================================================

const DISPOSABLE_DOMAINS = new Set([
  // Common disposable email providers
  '10minutemail.com', '10minutemail.net', '10minutemail.org',
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'mailinator.com', 'maildrop.cc', 'tempmail.com', 'temp-mail.org',
  'throwaway.email', 'getnada.com', 'trashmail.com', 'yopmail.com',
  'fakeinbox.com', 'dispostable.com', 'emailondeck.com', 'sharklasers.com',
  'grr.la', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
  'mailnesia.com', 'mintemail.com', 'mytemp.email', 'emailfake.com',
  'mohmal.com', '33mail.com', 'jetable.org', 'mailcatch.com',
  'temp-mail.ru', '临时邮箱.com', 'moakt.com', 'rootfest.net',
]);

// ============================================================================
// Spam Keywords
// ============================================================================

const SPAM_KEYWORDS = [
  'viagra', 'cialis', 'casino', 'poker', 'lottery', 'bitcoin',
  'crypto', 'loan', 'credit', 'investment', 'seo service', 'backlink',
  'click here', 'buy now', 'limited time', 'act now', 'free money',
  'work from home', 'make money', 'get paid', 'passive income',
];

// ============================================================================
// Token Management (HMAC-based signed tokens)
// ============================================================================

export interface FormToken {
  timestamp: number;
  nonce: string;
}

/**
 * Generate a signed token for form initialization
 */
export function generateFormToken(): string {
  const token: FormToken = {
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  
  const payload = JSON.stringify(token);
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(payload)
    .digest('hex');
  
  return Buffer.from(JSON.stringify({ payload, signature })).toString('base64');
}

/**
 * Verify and decode a signed token
 */
export function verifyFormToken(token: string): { valid: boolean; reason?: string } {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    const { payload, signature } = decoded;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return { valid: false, reason: 'Invalid token signature' };
    }
    
    // Verify token age
    const tokenData: FormToken = JSON.parse(payload);
    const age = Date.now() - tokenData.timestamp;
    
    if (age > TOKEN_MAX_AGE_MS) {
      return { valid: false, reason: 'Token expired' };
    }
    
    if (age < MIN_FORM_TIME_MS) {
      return { valid: false, reason: 'Form submitted too quickly' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, reason: 'Malformed token' };
  }
}

// ============================================================================
// Cloudflare Turnstile Verification
// ============================================================================

export async function verifyTurnstile(token: string, remoteIP: string): Promise<boolean> {
  if (!TURNSTILE_ENABLED) {
    return true; // Pass through if not enabled
  }
  
  if (!TURNSTILE_SECRET) {
    console.error('[TURNSTILE] Secret key not configured');
    return false;
  }
  
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: remoteIP,
      }),
    });
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('[TURNSTILE] Verification error:', error);
    return false;
  }
}

// ============================================================================
// Rate Limiting
// ============================================================================

export function getClientIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

export function isIPRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = ipRequestLog.get(ip) || [];
  const recentRequests = requests.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (recentRequests.length >= RATE_LIMIT_IP_MAX) {
    return true;
  }
  
  recentRequests.push(now);
  ipRequestLog.set(ip, recentRequests);
  return false;
}

export function isEmailRateLimited(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  const now = Date.now();
  const requests = emailRequestLog.get(normalized) || [];
  const recentRequests = requests.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (recentRequests.length >= RATE_LIMIT_EMAIL_MAX) {
    return true;
  }
  
  recentRequests.push(now);
  emailRequestLog.set(normalized, recentRequests);
  return false;
}

// ============================================================================
// Content Validation
// ============================================================================

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}

export function containsSpamKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lower.includes(keyword));
}

export function countLinks(text: string): number {
  const urlPattern = /(https?:\/\/|www\.)[^\s]+/gi;
  const matches = text.match(urlPattern);
  return matches ? matches.length : 0;
}

export function hasGibberishPattern(text: string): boolean {
  // Check for vowel-less text
  if (!/[aeiouAEIOU]/.test(text)) {
    return true;
  }
  
  // Check for camelCase spam (e.g., "contactMeForServices")
  if (/[a-z][A-Z]/.test(text) && text.length > 12 && !/\s/.test(text)) {
    return true;
  }
  
  // Check for excessive consonant clusters
  if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{6,}/.test(text)) {
    return true;
  }
  
  return false;
}

export function checkPayloadSize(data: any): boolean {
  const size = JSON.stringify(data).length;
  return size <= MAX_PAYLOAD_SIZE;
}

// ============================================================================
// Comprehensive Security Check
// ============================================================================

export interface SecurityCheckResult {
  passed: boolean;
  reason?: string;
  logTag?: string;
}

export interface FormSubmission {
  formToken?: string;
  turnstileToken?: string;
  website?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  [key: string]: any;
}

export async function performSecurityCheck(
  data: FormSubmission,
  request: Request
): Promise<SecurityCheckResult> {
  // 1. Payload size check
  if (!checkPayloadSize(data)) {
    return { passed: false, reason: 'Payload too large', logTag: 'PAYLOAD_SIZE' };
  }
  
  // 2. Honeypot check
  if (data.website && data.website.trim() !== '') {
    return { passed: false, reason: 'Honeypot triggered', logTag: 'HONEYPOT' };
  }
  
  // 3. Token verification
  if (!data.formToken) {
    return { passed: false, reason: 'Missing form token', logTag: 'TOKEN_MISSING' };
  }
  
  const tokenCheck = verifyFormToken(data.formToken);
  if (!tokenCheck.valid) {
    return { passed: false, reason: tokenCheck.reason, logTag: 'TOKEN_INVALID' };
  }
  
  // 4. Cloudflare Turnstile (if enabled)
  if (TURNSTILE_ENABLED) {
    if (!data.turnstileToken) {
      return { passed: false, reason: 'Missing verification', logTag: 'TURNSTILE_MISSING' };
    }
    
    const clientIP = getClientIP(request);
    const turnstileValid = await verifyTurnstile(data.turnstileToken, clientIP);
    if (!turnstileValid) {
      return { passed: false, reason: 'Verification failed', logTag: 'TURNSTILE_FAILED' };
    }
  }
  
  // 5. IP rate limiting
  const clientIP = getClientIP(request);
  if (isIPRateLimited(clientIP)) {
    return { passed: false, reason: 'Rate limit exceeded', logTag: 'RATE_LIMIT_IP' };
  }
  
  // 6. Email validation and rate limiting
  if (data.email) {
    if (isDisposableEmail(data.email)) {
      return { passed: false, reason: 'Invalid email domain', logTag: 'DISPOSABLE_EMAIL' };
    }
    
    if (isEmailRateLimited(data.email)) {
      return { passed: false, reason: 'Rate limit exceeded', logTag: 'RATE_LIMIT_EMAIL' };
    }
  }
  
  // 7. Content spam detection
  const textContent = [data.name, data.message].filter(Boolean).join(' ');
  
  if (containsSpamKeywords(textContent)) {
    return { passed: false, reason: 'Suspicious content detected', logTag: 'SPAM_KEYWORDS' };
  }
  
  if (data.message && countLinks(data.message) > 2) {
    return { passed: false, reason: 'Too many links', logTag: 'EXCESSIVE_LINKS' };
  }
  
  if (data.name && hasGibberishPattern(data.name)) {
    return { passed: false, reason: 'Invalid input format', logTag: 'GIBBERISH_NAME' };
  }
  
  if (data.message && hasGibberishPattern(data.message)) {
    return { passed: false, reason: 'Invalid input format', logTag: 'GIBBERISH_MESSAGE' };
  }
  
  return { passed: true };
}

// ============================================================================
// Generic Response Helpers
// ============================================================================

export function createGenericErrorResponse(): Response {
  return new Response(
    JSON.stringify({ 
      error: 'Unable to process your request. Please try again or contact us directly.' 
    }),
    { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

export function createSuccessResponse(): Response {
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Request received successfully' 
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

export function logSecurityRejection(result: SecurityCheckResult, formType: string = 'form'): void {
  console.log(`[SECURITY:${result.logTag}] Blocked ${formType}: ${result.reason}`);
}
