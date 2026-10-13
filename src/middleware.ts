import { defineMiddleware } from 'astro:middleware';

/**
 * Security Headers Middleware
 * 
 * Applies comprehensive security headers to all responses:
 * - Content Security Policy (CSP)
 * - X-Frame-Options / frame-ancestors
 * - Referrer-Policy
 * - Permissions-Policy
 * - X-Content-Type-Options
 */

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // Clone response to modify headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
  
  // Content Security Policy
  // Allows the site to function while blocking common attack vectors
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://challenges.cloudflare.com https://api.nexrena.com",
    "frame-src https://challenges.cloudflare.com",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
  
  newResponse.headers.set('Content-Security-Policy', csp);
  
  // Prevent clickjacking attacks
  newResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // Control referrer information
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Disable browser features that aren't needed
  const permissionsPolicy = [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()',
  ].join(', ');
  
  newResponse.headers.set('Permissions-Policy', permissionsPolicy);
  
  // Prevent MIME type sniffing
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Additional security headers
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  return newResponse;
});
