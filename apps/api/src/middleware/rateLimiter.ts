import type { Context, Next } from 'hono';

import { prisma } from '../utils/database';

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (c: Context) => string;
}

export function rateLimiter(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs || 60000; // 1 minute default
  const maxRequests = options.maxRequests || 20; // 20 requests default
  const keyGenerator =
    options.keyGenerator ||
    ((c: Context) => {
      const auth = c.get('auth');
      return auth?.userId || c.req.header('x-forwarded-for') || 'unknown';
    });

  return async (c: Context, next: Next): Promise<Response | void> => {
    const key = keyGenerator(c);
    const endpoint = c.req.path;
    const now = new Date();
    const windowEnd = new Date(now.getTime() + windowMs);

    try {
      // Check existing rate limit record
      const record = await prisma.rateLimitRecord.findFirst({
        where: {
          OR: [{ userId: key }, { ipAddress: key }],
          endpoint,
          windowEnd: { gte: now },
        },
        orderBy: { windowStart: 'desc' },
      });

      if (record) {
        if (record.blocked || record.attempts >= maxRequests) {
          return c.json(
            {
              error: {
                message: 'Too many requests. Please try again later.',
                code: 'RATE_LIMIT_EXCEEDED',
                retryAfter: Math.ceil((record.windowEnd.getTime() - now.getTime()) / 1000),
                requestId: c.req.header('X-Request-ID'),
                timestamp: new Date().toISOString(),
              },
            },
            429
          );
        }

        // Increment attempts
        await prisma.rateLimitRecord.update({
          where: { id: record.id },
          data: {
            attempts: { increment: 1 },
            blocked: record.attempts + 1 >= maxRequests,
            blockedAt: record.attempts + 1 >= maxRequests ? now : null,
          },
        });
      } else {
        // Create new rate limit record
        const auth = c.get('auth');
        await prisma.rateLimitRecord.create({
          data: {
            userId: auth?.userId,
            ipAddress: c.req.header('x-forwarded-for') || 'unknown',
            endpoint,
            attempts: 1,
            windowStart: now,
            windowEnd,
          },
        });
      }

      await next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Don't block on rate limiter errors
      await next();
    }
  };
}
