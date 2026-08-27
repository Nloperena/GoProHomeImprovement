import type { APIRoute } from 'astro';

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

    // Log the submission (in production, this would send to a database or email service)
    console.log('Estimate Request Received:', {
      timestamp: new Date().toISOString(),
      name: data.name,
      phone: data.phone,
      email: data.email,
      service: data.service,
      city: data.city,
      message: data.message,
    });

    // In production, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with CRM
    // 4. Send autoresponder to customer
    
    // For now, return success
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
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
