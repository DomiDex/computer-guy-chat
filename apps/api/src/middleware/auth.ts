import type { Context, Next, MiddlewareHandler } from 'hono';

import { TokenGenerator } from '../services/auth/TokenGenerator';
import { prisma } from '../utils/database';

const tokenGenerator = new TokenGenerator(prisma);

export interface AuthContext {
  userId: string;
  email: string;
  sessionId?: string;
}

// Extend the Hono context to include our auth property
declare module 'hono' {
  interface ContextVariableMap {
    auth: AuthContext;
  }
}

export const requireAuth: MiddlewareHandler = async (
  c: Context,
  next: Next
): Promise<Response | void> => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json(
        {
          error: {
            message: 'Missing or invalid authorization header',
            code: 'UNAUTHORIZED',
            requestId: c.req.header('X-Request-ID') || undefined,
            timestamp: new Date().toISOString(),
          },
        },
        401
      );
    }

    const token = authHeader.substring(7);
    const payload = tokenGenerator.verifyAccessToken(token);

    // Check if user still exists and is verified
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, verified: true, deletedAt: true },
    });

    if (!user || user.deletedAt) {
      return c.json(
        {
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND',
            requestId: c.req.header('X-Request-ID') || undefined,
            timestamp: new Date().toISOString(),
          },
        },
        401
      );
    }

    if (!user.verified) {
      return c.json(
        {
          error: {
            message: 'Email verification required',
            code: 'EMAIL_NOT_VERIFIED',
            requestId: c.req.header('X-Request-ID') || undefined,
            timestamp: new Date().toISOString(),
          },
        },
        403
      );
    }

    // Set auth context
    const authContext: AuthContext = {
      userId: user.id,
      email: user.email,
      sessionId: payload.sessionId,
    };
    c.set('auth', authContext);

    await next();
  } catch (error) {
    return c.json(
      {
        error: {
          message: 'Invalid or expired token',
          code: 'INVALID_TOKEN',
          requestId: c.req.header('X-Request-ID') || undefined,
          timestamp: new Date().toISOString(),
        },
      },
      401
    );
  }
};

export const optionalAuth: MiddlewareHandler = async (c: Context, next: Next): Promise<void> => {
  try {
    const authHeader = c.req.header('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = tokenGenerator.verifyAccessToken(token);

      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, verified: true, deletedAt: true },
      });

      if (user && !user.deletedAt && user.verified) {
        const authContext: AuthContext = {
          userId: user.id,
          email: user.email,
          sessionId: payload.sessionId,
        };
        c.set('auth', authContext);
      }
    }

    await next();
  } catch {
    // Silent fail for optional auth
    await next();
  }
};
