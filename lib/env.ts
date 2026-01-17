import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Shared environment variables (available on client and server).
   */
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },

  /**
   * Server-side environment variables (not available on the client).
   * Accessing these on the client will throw an error.
   */
  server: {
    WORKOS_CLIENT_ID: z
      .string()
      .min(1, 'WORKOS_CLIENT_ID is required')
      .startsWith('client_', "WORKOS_CLIENT_ID must start with 'client_'"),
    WORKOS_API_KEY: z.string().min(1, 'WORKOS_API_KEY is required'),
    WORKOS_COOKIE_PASSWORD: z.string().min(32, 'WORKOS_COOKIE_PASSWORD must be at least 32 characters'),
    RESEND_API_KEY: z
      .string()
      .min(1, 'RESEND_API_KEY is required')
      .startsWith('re_', "RESEND_API_KEY must start with 're_'"),
    // Optional: Site URL for sitemap generation
    SITE_URL: z.url().optional(),

    // Sentry (optional - for source map uploads)
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
  },

  /**
   * Client-side environment variables (available on client and server).
   * Must be prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.url({
      message: 'NEXT_PUBLIC_CONVEX_URL must be a valid URL',
    }),
    NEXT_PUBLIC_WORKOS_REDIRECT_URI: z.url({
      message: 'NEXT_PUBLIC_WORKOS_REDIRECT_URI must be a valid URL',
    }),
    // Sentry DSN (optional - errors captured when set)
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
    // Plausible Analytics (optional - tracking enabled when domain is set)
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
    NEXT_PUBLIC_PLAUSIBLE_HOST: z.url().optional(),
  },

  /**
   * For Next.js >= 13.4.4, only client-side variables need to be specified.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_WORKOS_REDIRECT_URI: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    NEXT_PUBLIC_PLAUSIBLE_HOST: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST,
  },

  /**
   * Skip validation during Docker builds, CI, or when explicitly requested.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION || process.env.npm_lifecycle_event === 'lint',

  /**
   * Treat empty strings as undefined (recommended for optional vars).
   */
  emptyStringAsUndefined: true,

  /**
   * Custom error handler for validation failures.
   */
  onValidationError: (issues) => {
    console.error('❌ Invalid environment variables:');
    for (const issue of issues) {
      const path = issue.path?.join('.') ?? 'unknown';
      console.error(`  → ${path}: ${issue.message}`);
    }
    throw new Error('Invalid environment variables. See above for details.');
  },

  /**
   * Custom handler when server variables are accessed on the client.
   */
  onInvalidAccess: (variable) => {
    throw new Error(
      `❌ Attempted to access server-side variable "${variable}" on the client. ` + 'This is a security violation.',
    );
  },
});
