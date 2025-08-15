import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

// Health check endpoint
app.get('/health', (c) =>
  c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  })
);

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
        timestamp: new Date().toISOString(),
      },
    },
    404
  )
);

// Start server
const port = parseInt(process.env.PORT || '3000', 10);

console.log(`🚀 Server starting on http://localhost:${port}`);
console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`✅ Server is running on http://localhost:${info.port}`);
  }
);
