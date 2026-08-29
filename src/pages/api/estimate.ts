import type { APIRoute } from 'astro';

const NEXRENA_API_URL = 'https://api.nexrena.com/api/forms/submit';
const SITE_KEY = 'gopro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'email', 'service', 'city', 'message'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
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
      pageUrl: request.headers.get('referer') || 'https://go-pro-home-improvements.vercel.app/estimate',
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
