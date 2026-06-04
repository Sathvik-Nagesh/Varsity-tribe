/**
 * In-memory stub for Rate Limiting.
 * 
 * This uses a simple token bucket / request counter algorithm stored in a JavaScript Map.
 * Note: In a production serverless or multi-instance environment (like Vercel),
 * this should be replaced with a distributed store like Redis (e.g., Upstash).
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store: IP/Identifier -> RateLimitRecord
const store = new Map<string, RateLimitRecord>();

const CONFIGS = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  xp_endpoints: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 requests per minute
  community_posting: { maxRequests: 10, windowMs: 5 * 60 * 1000 }, // 10 posts per 5 minutes
};

type RateLimitContext = keyof typeof CONFIGS;

export function rateLimit(identifier: string, context: RateLimitContext): boolean {
  const config = CONFIGS[context];
  const now = Date.now();
  const key = `${context}:${identifier}`;

  const record = store.get(key);

  if (!record) {
    store.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return true; // Allowed
  }

  // Check if window has expired
  if (now > record.resetTime) {
    store.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return true; // Allowed
  }

  // Still within the window, check request count
  if (record.count >= config.maxRequests) {
    return false; // Rate limit exceeded
  }

  // Increment counter
  record.count += 1;
  return true; // Allowed
}

// Cleanup function to prevent memory leaks in long-running processes
export function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}
