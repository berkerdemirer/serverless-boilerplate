import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
// import { api, internal } from './_generated/api';

/**
 * HTTP Actions (Webhooks & API Endpoints)
 *
 * HTTP actions allow you to create custom HTTP endpoints for:
 * - Receiving webhooks from external services
 * - Creating REST-like API endpoints
 * - Handling OAuth callbacks
 * - Serving custom responses
 *
 * All HTTP actions receive a standard Request object and must return a Response.
 */

const http = httpRouter();

/**
 * Health check endpoint
 * GET /health
 */
http.route({
  path: '/health',
  method: 'GET',
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),
});

/**
 * Generic webhook receiver
 * POST /webhooks/:provider
 *
 * Example: Receive webhooks from various services.
 * In production, add signature verification for security.
 */
http.route({
  pathPrefix: '/webhooks/',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Extract provider from URL path
    const url = new URL(request.url);
    const provider = url.pathname.replace('/webhooks/', '');

    // Get the webhook payload
    const payload = await request.json();

    console.log(`Received webhook from ${provider}:`, JSON.stringify(payload, null, 2));

    // Example: Verify webhook signature (important for security!)
    // const signature = request.headers.get('x-webhook-signature');
    // if (!verifySignature(payload, signature, webhookSecret)) {
    //   return new Response('Invalid signature', { status: 401 });
    // }

    // Process webhook based on provider
    // switch (provider) {
    //   case 'stripe':
    //     await ctx.runMutation(internal.webhooks.handleStripe, { payload });
    //     break;
    //   case 'github':
    //     await ctx.runMutation(internal.webhooks.handleGithub, { payload });
    //     break;
    //   default:
    //     console.log(`Unknown webhook provider: ${provider}`);
    // }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
});

/**
 * Example: Stripe webhook handler
 * POST /stripe-webhook
 *
 * Dedicated endpoint for Stripe webhooks with signature verification.
 */
http.route({
  path: '/stripe-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return new Response('Missing signature', { status: 400 });
    }

    const body = await request.text();

    // In production, verify the signature using Stripe's library:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // For now, just parse the JSON
    const event = JSON.parse(body);

    console.log('Stripe event:', event.type);

    // Handle different event types
    // switch (event.type) {
    //   case 'checkout.session.completed':
    //     await ctx.runMutation(internal.payments.handleCheckoutComplete, {
    //       session: event.data.object,
    //     });
    //     break;
    //   case 'customer.subscription.updated':
    //     await ctx.runMutation(internal.subscriptions.handleUpdate, {
    //       subscription: event.data.object,
    //     });
    //     break;
    // }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
});

/**
 * Example: Public API endpoint
 * GET /api/stats
 *
 * Returns public statistics that don't require authentication.
 */
http.route({
  path: '/api/stats',
  method: 'GET',
  handler: httpAction(async () => {
    // Query public statistics
    // const stats = await ctx.runQuery(api.stats.getPublicStats);

    const stats = {
      totalUsers: 0,
      totalFiles: 0,
      updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      },
    });
  }),
});

/**
 * CORS preflight handler
 * OPTIONS /*
 *
 * Handle CORS preflight requests for all routes.
 */
http.route({
  pathPrefix: '/',
  method: 'OPTIONS',
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }),
});

// Export the router - Convex expects this as the default export
export default http;
