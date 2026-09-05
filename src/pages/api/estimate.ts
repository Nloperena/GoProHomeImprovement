import type { APIRoute } from 'astro';

export const prerender = false;

const NEXRENA_API_URL = 'https://api.nexrena.com/api/forms/submit';
const SITE_KEY = 'gopro';

// Valid service values from the form
const VALID_SERVICES = [
  'power-washing',
  'interior-exterior-painting',
  'demolition',
  'trim-crown-molding',
  'wallpaper',
  'murals',
  'tv-mounting',
  'movie-rooms',
  'drywall',
  'other',
];

// In-memory IP rate limiting (resets on cold start - acceptable for this use case)
const ipRequestLog: Map<string, number[]> = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

// Timing gate minimum (2.5 seconds)
const MIN_FORM_TIME_MS = 2500;

/**
 * Get client IP from various headers
 */
function getClientIP(request: Request): string {
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
function isRateLimited(ip: string): boolean {
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
function validateName(name: string): string | null {
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
function validateCity(city: string): string | null {
  const trimmed = city.trim();
  
  if (trimmed.length < 2 || trimmed.length > 60) {
    return 'Please enter a valid city name (2-60 characters).';
  }
  
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
    return 'City name should only contain letters, spaces, hyphens, and apostrophes.';
  }
  
  if (!hasVowel(trimmed)) {
    return 'Please enter a valid city name.';
  }
  
  return null;
}

/**
 * Validate message field
 */
function validateMessage(message: string): string | null {
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
function validatePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length < 10 || digits.length > 11) {
    return 'Please enter a valid phone number (10-11 digits).';
  }
  
  return null;
}

/**
 * Validate service field
 */
function validateService(service: string): string | null {
  if (!VALID_SERVICES.includes(service)) {
    return 'Please select a valid service type.';
  }
  
  return null;
}

/**
 * Validate email field (basic format check)
 */
function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  
  // Basic email format check (don't block dotted gmail)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  
  return null;
}

/**
 * Silent drop response (looks like success to bots)
 */
function silentDrop(): Response {
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Estimate request received successfully' 
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // === HONEYPOT CHECK ===
    // If website field is filled, silent drop (bot trap)
    if (data.website && data.website.trim() !== '') {
      console.log('[HONEYPOT] Blocked submission with filled website field');
      return silentDrop();
    }
    
    // === TIMING GATE CHECK ===
    // If form submitted too quickly, silent drop (likely bot)
    if (typeof data.formStartedAt === 'number') {
      const elapsed = Date.now() - data.formStartedAt;
      if (elapsed < MIN_FORM_TIME_MS) {
        console.log(`[TIMING GATE] Blocked submission (${elapsed}ms < ${MIN_FORM_TIME_MS}ms)`);
        return silentDrop();
      }
    } else {
      // Missing or invalid formStartedAt - silent drop
      console.log('[TIMING GATE] Blocked submission with missing/invalid formStartedAt');
      return silentDrop();
    }
    
    // === RATE LIMITING ===
    const clientIP = getClientIP(request);
    if (isRateLimited(clientIP)) {
      console.log(`[RATE LIMIT] Blocked submission from ${clientIP}`);
      return silentDrop();
    }
    
    // === FIELD VALIDATION ===
    // Validate required fields exist
    const requiredFields = ['name', 'phone', 'email', 'service', 'city', 'message'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Validate each field with friendly error messages
    let error = validateName(data.name);
    if (error) {
      return new Response(
        JSON.stringify({ error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    error = validateEmail(data.email);
    if (error) {
      return new Response(
        JSON.stringify({ error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    error = validatePhone(data.phone);
    if (error) {
      return new Response(
        JSON.stringify({ error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    error = validateCity(data.city);
    if (error) {
      return new Response(
        JSON.stringify({ error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    error = validateService(data.service);
    if (error) {
      return new Response(
        JSON.stringify({ error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    error = validateMessage(data.message);
    if (error) {
      return new Response(
        JSON.stringify({ error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get form secret from environment
    const formSecret = import.meta.env.GOPRO_FORM_SECRET || import.meta.env.FORM_SECRET;
    
    // Check if we're in development mode
    const isDev = import.meta.env.DEV;
    
    if (!formSecret) {
      if (isDev) {
        // In development, log but allow the request to succeed locally
        console.log('[LOCAL DEV MODE] Estimate Request (not sent to Nexrena):', {
          timestamp: new Date().toISOString(),
          name: data.name,
          phone: data.phone,
          email: data.email,
          service: data.service,
          city: data.city,
          message: data.message,
        });
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Estimate request received (local dev mode - not sent to Nexrena)',
            dev: true
          }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      } else {
        // In production, fail if secret is missing
        console.error('GOPRO_FORM_SECRET or FORM_SECRET environment variable is not configured');
        return new Response(
          JSON.stringify({ 
            error: 'Form submission service is not configured. Please contact support.' 
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Prepare the payload for Nexrena
    const nexrenaPayload = {
      name: data.name,
      email: data.email,
      message: data.message,
      phone: data.phone,
      service: data.service,
      city: data.city,
      formName: 'estimate',
      pageUrl: request.headers.get('referer') || 'https://goprohomeimprovements.com/estimate',
      website: data.website || '',
    };

    // Submit to Nexrena API
    const nexrenaResponse = await fetch(NEXRENA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Site-Key': SITE_KEY,
        'X-Form-Secret': formSecret,
      },
      body: JSON.stringify(nexrenaPayload),
    });

    // Log the submission for debugging
    console.log('Nexrena submission status:', nexrenaResponse.status);

    if (!nexrenaResponse.ok) {
      const errorText = await nexrenaResponse.text();
      console.error('Nexrena API error:', {
        status: nexrenaResponse.status,
        statusText: nexrenaResponse.statusText,
        body: errorText,
      });

      // Map Nexrena errors to client-friendly messages
      if (nexrenaResponse.status === 400) {
        return new Response(
          JSON.stringify({ error: 'Invalid form data. Please check your inputs and try again.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (nexrenaResponse.status === 403) {
        return new Response(
          JSON.stringify({ error: 'Form submission authorization failed. Please contact support.' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'Unable to submit form. Please try again later or contact us directly.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Estimate request received successfully' 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error processing estimate request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again or contact us directly.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
