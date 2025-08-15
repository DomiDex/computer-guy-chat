# Development Setup Guide

## Prerequisites

### Required Software

- **Node.js**: v20.0.0 or higher
- **PNPM**: v8.15.0 or higher
- **Git**: v2.30.0 or higher
- **PostgreSQL**: v15 or higher (or use Neon cloud)
- **Redis**: v7 or higher (or use Upstash cloud)

### Recommended Tools

- **VS Code**: With recommended extensions
- **Docker**: For local services
- **Postman**: For API testing
- **TablePlus**: For database management

## Initial Setup

### 1. Clone Repository

```bash
# Clone with SSH (recommended)
git clone git@github.com:computer-guys/chatbot.git

# Or with HTTPS
git clone https://github.com/computer-guys/chatbot.git

cd computer-guys-chatbot
```

### 2. Install Dependencies

```bash
# Install PNPM globally if not installed
npm install -g pnpm@8.15.1

# Install all dependencies
pnpm install

# If you encounter platform issues (WSL/Windows)
rm -rf node_modules && rm -rf apps/*/node_modules
pnpm install
```

### 3. Environment Configuration

#### Create Environment Files

```bash
# Copy example files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

#### Configure API Environment

Edit `apps/api/.env`:

```env
# Database (Neon - Free Tier)
DATABASE_URL="postgresql://user:pass@project-pooler.neon.tech/computer_guys_dev?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:pass@project.neon.tech/computer_guys_dev?sslmode=require"

# JWT Secrets (Generate secure keys)
JWT_SECRET="your-32-character-minimum-secret-key-here"
JWT_REFRESH_SECRET="another-32-character-minimum-secret-key"

# API Configuration
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001

# Redis (Upstash - Free Tier)
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# OpenRouter AI
OPENROUTER_API_KEY="sk-or-v1-your-key"
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"

# Email (SendGrid)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="SG.your-api-key"
EMAIL_FROM="support@computerguys.com"

# Convex Real-time
CONVEX_DEPLOYMENT="your-deployment"
CONVEX_URL="https://your-deployment.convex.cloud"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=20

# Security
BCRYPT_ROUNDS=12

# Support
SUPPORT_EMAIL=support@computerguys.com
SUPPORT_PHONE=1800-COMP-GUYS
```

#### Configure Web Environment

Edit `apps/web/.env`:

```env
# API Connection
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=false
```

### 4. Database Setup

#### Option A: Local PostgreSQL

```bash
# Create database
createdb computer_guys_dev

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://localhost/computer_guys_dev"
```

#### Option B: Neon (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create project "computer-guys-chatbot"
3. Copy connection strings to `.env`
4. Follow [Neon Setup Guide](./NEON_SETUP.md)

#### Run Migrations

```bash
cd apps/api

# Generate Prisma Client
npx prisma generate

# Create database schema
npx prisma migrate dev --name init

# Seed with test data (optional)
npx prisma db seed
```

### 5. Start Development Servers

#### All Services

```bash
# From root directory
pnpm dev
```

This starts:
- API server: http://localhost:3000
- Web app: http://localhost:3001
- Convex: Local development mode

#### Individual Services

```bash
# API only
pnpm dev --filter=@cg/api

# Web only
pnpm dev --filter=@cg/web

# Convex only
pnpm dev --filter=@cg/convex
```

### 6. Verify Setup

```bash
# Check API health
curl http://localhost:3000/health

# Check database connection
curl http://localhost:3000/ready

# Open web app
open http://localhost:3001
```

## Development Workflow

### Code Structure

```
apps/api/src/
├── routes/          # HTTP endpoints
├── services/        # Business logic
├── middleware/      # Express/Hono middleware
├── utils/          # Helpers
└── types/          # TypeScript types

apps/web/src/
├── app/            # Next.js app router
├── components/     # React components
├── hooks/          # Custom hooks
├── lib/           # Utilities
└── styles/        # CSS/Tailwind
```

### Making Changes

#### 1. Create Feature Branch

```bash
git checkout -b feat/your-feature-name
```

#### 2. Development Loop

```bash
# Make changes
code .

# Run tests
pnpm test

# Check types
pnpm typecheck

# Lint code
pnpm lint

# Format code
pnpm format
```

#### 3. Database Changes

```bash
# Modify schema
code apps/api/prisma/schema.prisma

# Create migration
npx prisma migrate dev --name describe_changes

# Update types
npx prisma generate
```

#### 4. API Development

```typescript
// apps/api/src/routes/example.ts
import { Hono } from 'hono';
import { z } from 'zod';
import { requireAuth } from '@/middleware/auth';
import { rateLimiter } from '@/middleware/rateLimiter';

const router = new Hono();

// Input validation schema
const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional()
});

// Protected endpoint
router.post('/', requireAuth, rateLimiter(), async (c) => {
  // Parse and validate input
  const body = await c.req.json();
  const data = createSchema.parse(body);
  
  // Get user from auth context
  const { userId } = c.get('auth');
  
  // Business logic
  const result = await createExample(userId, data);
  
  // Return response
  return c.json(result, 201);
});

export default router;
```

#### 5. Frontend Development

```tsx
// apps/web/src/app/example/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function ExamplePage() {
  const [name, setName] = useState('');
  
  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ['examples'],
    queryFn: () => api.examples.list()
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: { name: string }) => api.examples.create(data),
    onSuccess: () => {
      // Refresh list
      queryClient.invalidateQueries(['examples']);
    }
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        createMutation.mutate({ name });
      }}>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
      
      <ul>
        {data?.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Testing

#### Unit Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch

# Specific package
pnpm test --filter=@cg/api
```

#### E2E Tests

```bash
# Install Playwright
pnpm exec playwright install

# Run E2E tests
pnpm test:e2e

# Interactive mode
pnpm test:e2e --ui
```

#### Test Examples

```typescript
// apps/api/src/services/__tests__/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TokenGenerator } from '../auth/TokenGenerator';
import { prisma } from '@/utils/database';

describe('TokenGenerator', () => {
  let tokenGenerator: TokenGenerator;
  
  beforeEach(() => {
    tokenGenerator = new TokenGenerator(prisma);
  });
  
  it('should generate valid token pair', async () => {
    const user = await createTestUser();
    const tokens = await tokenGenerator.generateTokenPair(user);
    
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.expiresIn).toBe(900); // 15 minutes
  });
  
  it('should verify valid access token', async () => {
    const user = await createTestUser();
    const { accessToken } = await tokenGenerator.generateTokenPair(user);
    
    const payload = await tokenGenerator.verifyAccessToken(accessToken);
    expect(payload.sub).toBe(user.id);
  });
});
```

### Debugging

#### VS Code Configuration

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev", "--filter=@cg/api"],
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "*"
      }
    },
    {
      "name": "Debug Web",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3001",
      "webRoot": "${workspaceFolder}/apps/web"
    }
  ]
}
```

#### Logging

```typescript
// Use structured logging
import { logger } from '@/utils/logger';

logger.info('User logged in', {
  userId: user.id,
  email: user.email,
  timestamp: new Date()
});

logger.error('Database error', {
  error: err.message,
  stack: err.stack,
  query: 'SELECT * FROM users'
});
```

#### Database Inspection

```bash
# Open Prisma Studio
npx prisma studio

# Direct SQL access
psql $DATABASE_URL

# View migrations
npx prisma migrate status
```

### Performance Optimization

#### API Optimization

```typescript
// Use database transactions
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.update({ ... });
  const log = await tx.auditLog.create({ ... });
  return { user, log };
});

// Use pagination
const conversations = await prisma.conversation.findMany({
  where: { userId },
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' }
});

// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    firstName: true
  }
});
```

#### Frontend Optimization

```tsx
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return data.map(item => expensiveProcess(item));
}, [data]);

// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Image optimization
import Image from 'next/image';
<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
  priority
/>
```

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Reset database
npx prisma migrate reset
```

#### Module Resolution Issues

```bash
# Clear caches
rm -rf node_modules
rm -rf .next
pnpm install
```

#### TypeScript Errors

```bash
# Regenerate types
npx prisma generate
pnpm typecheck
```

## Code Quality

### Linting Rules

- No `any` types
- No unused variables
- Consistent imports
- No console.logs in production
- Proper error handling

### Commit Guidelines

```bash
# Format: type(scope): message

feat(api): add email verification
fix(web): resolve chat scrolling issue
docs: update API documentation
test(api): add auth service tests
refactor(shared): extract validation logic
chore: update dependencies
```

### Code Review Checklist

- [ ] Tests pass
- [ ] Types are correct
- [ ] No security issues
- [ ] Follows project conventions
- [ ] Documentation updated
- [ ] Performance considered
- [ ] Error handling complete

## Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Hono Docs](https://hono.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [Convex Docs](https://docs.convex.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### Tools

- [Regex101](https://regex101.com) - Regex testing
- [JWT.io](https://jwt.io) - JWT debugging
- [Transform](https://transform.tools) - Code converters
- [Bundle Analyzer](https://bundlephobia.com) - Package size

### Support

- Internal Slack: #cg-chatbot-dev
- GitHub Issues: [Issues](https://github.com/computer-guys/chatbot/issues)
- Wiki: [Internal Wiki](https://wiki.computerguys.com/chatbot)