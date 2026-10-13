import type { APIRoute } from 'astro';
import { generateFormToken } from '../../lib/security-enhanced';

export const prerender = false;

/**
 * Generate a signed form token for client-side forms
 * Called when a form page loads to initialize the form
 */
export const GET: APIRoute = async () => {
  try {
    const token = generateFormToken();
    
    return new Response(
      JSON.stringify({ token }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        } 
      }
    );
  } catch (error) {
    console.error('Error generating form token:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate token' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
