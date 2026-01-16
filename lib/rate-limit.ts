/**
 * Rate limiting using Upstash Ratelimit.
 *
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.
 * Get free credentials at https://upstash.com
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

type Duration = Parameters<typeof Ratelimit.slidingWindow>[1];

// Singleton Redis instance
let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

// Ephemeral cache to reduce Redis calls
const cache = new Map();

/**
 * Create a rate limiter with sliding window algorithm
 */
export function createRateLimiter(limit: number, window: Duration) {
  const ratelimit = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
    prefix: 'ratelimit',
    ephemeralCache: cache,
  });

  return async (identifier: string): Promise<RateLimitResult> => {
    const result = await ratelimit.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  };
}

/**
 * Rate limit headers to include in responses
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
    ...(result.success ? {} : { 'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString() }),
  };
}

/**
 * Preset rate limiters for common use cases
 */
export const rateLimiters = {
  /** Strict: 10 requests per minute (for sensitive operations) */
  strict: createRateLimiter(10, '1m'),

  /** Standard: 60 requests per minute */
  standard: createRateLimiter(60, '1m'),

  /** Relaxed: 200 requests per minute */
  relaxed: createRateLimiter(200, '1m'),

  /** Auth: 5 attempts per 15 minutes (for login/signup) */
  auth: createRateLimiter(5, '15m'),
};

export type { Duration as RateLimitWindow };
