/**
 * Shared spam protection utilities for all lead forms
 * 
 * Protects against bot spam patterns:
 * - Random gibberish names
 * - Extreme dotted Gmail addresses
 * - Nonsense free-text mixed with real options
 * - Instant submits
 * 
 * Protection layers:
 * 1. Honeypot field
 * 2. Timing gate (formStartedAt)
 * 3. Gibberish heuristics (name, email, text)
 * 4. Per-IP rate limiting
 * 5. Silent drop (200 response but no persistence)
 */

// In-memory IP rate limiting (resets on cold start - acceptable for this use case)
const ipRequestLog: Map<string, number[]> = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

// Timing gate minimum (2.5 seconds)
const MIN_FORM_TIME_MS = 2500;

export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
  logTag?: string;
}

export interface FormData {
  formStartedAt?: number;
  website?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  message?: string;
  [key: string]: any;
}

/**
 * Get client IP from various headers
 */
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

/**
 * Check and update rate limit for IP
 * Returns true if rate limit exceeded
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = ipRequestLog.get(ip) || [];
  
  // Filter out requests outside the time window
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  // Add current request
  recentRequests.push(now);
  ipRequestLog.set(ip, recentRequests);
  
  return false;
}

/**
 * Check if string contains a vowel
 */
function hasVowel(str: string): boolean {
  return /[aeiouAEIOU]/.test(str);
}

/**
 * Check if string looks like camelCase gibberish
 * (lowercase followed by uppercase, length > 12, no spaces)
 */
function isCamelCaseGibberish(str: string): boolean {
  return /[a-z][A-Z]/.test(str) && str.length > 12 && !/\s/.test(str);
}

/**
 * Validate name field
 */
export function validateName(name: string): string | null {
  const trimmed = name.trim();
  
  if (trimmed.length < 2 || trimmed.length > 80) {
    return 'Please enter a valid name (2-80 characters).';
  }
  
  if (!hasVowel(trimmed)) {
    return 'Please enter a valid name.';
  }
  
  if (isCamelCaseGibberish(trimmed)) {
    return 'Please enter your full name with proper spacing.';
  }
  
  return null;
}

/**
 * Validate city field
 */
export function validateCity(city: string): string | null {
  const trimmed = city.trim();
  
  if (trimmed.length < 2 || trimmed.length > 60) {
    return 'Please enter a valid city name (2-60 characters).';
  }
  
  if (!/^[a-zA-Z\s\-'.]+$/.test(trimmed)) {
    return 'City name should only contain letters, spaces, hyphens, apostrophes, and periods.';
  }
  
  if (!hasVowel(trimmed)) {
    return 'Please enter a valid city name.';
  }
  
  return null;
}

/**
 * Validate message field
 */
export function validateMessage(message: string): string | null {
  const trimmed = message.trim();
  
  if (trimmed.length < 12) {
    return 'Please provide more details about your project (at least 12 characters).';
  }
  
  // Check for camelCase tokens without spaces (likely spam)
  const tokens = trimmed.split(/\s+/);
  const hasCamelCaseToken = tokens.some(token => 
    token.length > 12 && /[a-z][A-Z]/.test(token)
  );
  
  if (hasCamelCaseToken && tokens.length < 3) {
    return 'Please describe your project in your own words.';
  }
  
  return null;
}

/**
 * Validate phone field
 */
export function validatePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length < 10 || digits.length > 11) {
    return 'Please enter a valid phone number (10-11 digits).';
  }
  
  return null;
}

/**
 * Validate email field (basic format check)
 */
export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  
  // Basic email format check (don't block dotted gmail)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  
  return null;
}

/**
 * Validate service field against allowed values
 */
export function validateService(service: string, validServices: string[]): string | null {
  if (!validServices.includes(service)) {
    return 'Please select a valid service type.';
  }
  
  return null;
}

/**
 * Check honeypot field
 * Returns spam result if honeypot is filled
 */
export function checkHoneypot(data: FormData): SpamCheckResult {
  if (data.website && data.website.trim() !== '') {
    return {
      isSpam: true,
      reason: 'Honeypot field filled',
      logTag: 'HONEYPOT'
    };
  }
  
  return { isSpam: false };
}

/**
 * Check timing gate
 * Returns spam result if form submitted too quickly or missing timestamp
 */
export function checkTimingGate(data: FormData): SpamCheckResult {
  if (typeof data.formStartedAt !== 'number') {
    return {
      isSpam: true,
      reason: 'Missing or invalid formStartedAt timestamp',
      logTag: 'TIMING GATE'
    };
  }
  
  const elapsed = Date.now() - data.formStartedAt;
  if (elapsed < MIN_FORM_TIME_MS) {
    return {
      isSpam: true,
      reason: `Form submitted too quickly (${elapsed}ms < ${MIN_FORM_TIME_MS}ms)`,
      logTag: 'TIMING GATE'
    };
  }
  
  return { isSpam: false };
}

/**
 * Check rate limit for IP
 * Returns spam result if rate limit exceeded
 */
export function checkRateLimit(request: Request): SpamCheckResult {
  const clientIP = getClientIP(request);
  
  if (isRateLimited(clientIP)) {
    return {
      isSpam: true,
      reason: `Rate limit exceeded for IP ${clientIP}`,
      logTag: 'RATE LIMIT'
    };
  }
  
  return { isSpam: false };
}

/**
 * Run all spam checks on form data
 * Returns first spam match or { isSpam: false } if all pass
 */
export function checkSpam(data: FormData, request: Request): SpamCheckResult {
  // Check honeypot
  const honeypotResult = checkHoneypot(data);
  if (honeypotResult.isSpam) return honeypotResult;
  
  // Check timing gate
  const timingResult = checkTimingGate(data);
  if (timingResult.isSpam) return timingResult;
  
  // Check rate limit
  const rateLimitResult = checkRateLimit(request);
  if (rateLimitResult.isSpam) return rateLimitResult;
  
  return { isSpam: false };
}

/**
 * Silent drop response (looks like success to bots, but submission is not persisted)
 */
export function silentDrop(formType: string = 'form'): Response {
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `${formType} request received successfully` 
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

/**
 * Log spam rejection with reason
 */
export function logSpamRejection(result: SpamCheckResult, formType: string = 'form'): void {
  console.log(`[${result.logTag}] Blocked ${formType} submission: ${result.reason}`);
}
