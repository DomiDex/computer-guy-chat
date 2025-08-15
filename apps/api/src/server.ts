import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';

const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', compress());

// CORS configuration
app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposeHeaders: ['X-Request-ID'],
    maxAge: 86400,
  })
);

// Pretty JSON in development
if (process.env.NODE_ENV === 'development') {
  app.use('*', prettyJSON());
}

// Error handling middleware
app.onError((err, c) => {
  const requestId = c.req.header('X-Request-ID') || 'unknown';
  console.error(`[${requestId}] Error:`, err);

  if (err instanceof Error) {
    return c.json(
      {
        error: {
          message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
          code: 'INTERNAL_ERROR',
          requestId,
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }

  return c.json(
    {
      error: {
        message: 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
        requestId,
        timestamp: new Date().toISOString(),
      },
    },
    500
  );
});

// Health check endpoint
app.get('/health', (c) =>
  c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  })
);

// Ready check endpoint (checks database connection)
app.get('/ready', (c) => {
  try {
    // TODO: Add database connection check
    return c.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
      },
    });
  } catch (error) {
    return c.json(
      {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        error: 'Service dependencies not available',
      },
      503
    );
  }
});

// API version info
app.get('/version', (c) =>
  c.json({
    version: '1.0.0',
    api: 'Computer Guys Chatbot API',
    build: process.env.BUILD_ID || 'development',
  })
);

// 404 handler
app.notFound((c) =>
  c.json(
    {
      error: {
        message: 'Endpoint not found',
        code: 'NOT_FOUND',
        path: c.req.path,
        method: c.req.method,
        requestId: c.req.header('X-Request-ID'),
        timestamp: new Date().toISOString(),
      },
    },
    404
  )
);

// Start server
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`🚀 Server starting on http://${hostname}:${port}`);
console.log(`📝 Environment: ${process.env.NODE_ENV}`);
console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3001'}`);

serve(
  {
    fetch: app.fetch,
    port,
    hostname,
  },
  (info) => {
    console.log(`✅ Server is running on http://${info.address}:${info.port}`);
  }
);
