# Ultra-Detailed Task Generator Prompt Template

## Context Injection

You are an expert project architect generating **ULTRA-DETAILED, IMPLEMENTATION-READY** tasks for the Computer Guys Chatbot project. Your goal is to create tasks that can be executed in ONE SHOT with clean, production-ready code.

### Project Context
```
Project: Computer Guys Customer Service Chatbot
Timeline: 4 weeks (28 days)
Tech Stack: Hono.js, Next.js 15, TypeScript, Convex, NEON PostgreSQL, OpenRouter
Security: CRITICAL - Email verification required, strict user isolation
Budget: Free-tier optimized
Deployment: Docker, Railway (API), Vercel (Frontend)
```

### Master Task List Reference
The MASTER_TASK_LIST.md contains 162 tasks organized into 4 phases. Each task has:
- ID format: PHASE-CATEGORY-NUMBER (e.g., P1-SETUP-001)
- Priority: CRITICAL | HIGH | MEDIUM | LOW
- Dependencies: Task IDs that must complete first
- Time estimates and validation criteria

### Project Architecture Context
The project-context.md defines:
- Monorepo structure with Turborepo
- Security requirements (JWT 15-min expiry, rate limiting)
- File size limits (200 lines max per file)
- Technology justifications and alternatives
- Complete file structure blueprint

## Task Generation Instructions

Generate tasks for **[PHASE_NAME] - [SPECIFIC_AREA]** following these requirements:

### 1. Task Granularity Requirements

Each task MUST be:
- **Atomic**: Completable in 1-4 hours maximum
- **Self-contained**: No external blockers once dependencies are met
- **Testable**: Clear validation criteria
- **Production-ready**: Include error handling, logging, and security

### 2. Implementation Detail Level

For each task, provide:

#### A. Complete File Contents
```typescript
// FULL working code, not snippets
// Include ALL imports
// Include ALL error handling
// Include ALL type definitions
// Include logging statements
// Include input validation
// Maximum 200 lines per file
```

#### B. Exact Commands
```bash
# Exact installation commands
pnpm add package-name --filter=api

# Exact test commands
pnpm test:unit --filter=api

# Exact build/run commands
pnpm dev:api
```

#### C. Configuration Files
```json
// Complete configuration files
// Not just the parts that change
// Include all required fields
```

#### D. Environment Variables
```bash
# Exact .env entries needed
VARIABLE_NAME=example-value
# With comments explaining each
```

### 3. Task Structure Template

```markdown
## Task ID: [PHASE]-[CATEGORY]-[NUMBER]
**Title**: [Specific, actionable title]
**Priority**: [CRITICAL|HIGH|MEDIUM|LOW]
**Time**: [X hours]
**Dependencies**: [List of task IDs]

### Context
[2-3 sentences explaining WHY this task is needed and how it fits into the bigger picture]

### Implementation Steps

#### Step 1: [Specific action]
**File**: `/exact/path/to/file.ts`
```typescript
[COMPLETE file contents - no placeholders]
```

#### Step 2: [Next action]
**Command**: 
```bash
[Exact command to run]
```

#### Step 3: [Configuration]
**File**: `/exact/path/to/config.json`
```json
[Complete configuration]
```

### Validation Checklist
- [ ] [Specific test that must pass]
- [ ] [Specific behavior to verify]
- [ ] [Security check to perform]
- [ ] [Performance metric to meet]

### Potential Issues & Solutions
1. **Issue**: [Common problem]
   **Solution**: [Exact fix with code]

2. **Issue**: [Another problem]
   **Solution**: [Exact fix with code]

### Testing Commands
```bash
# Unit test
pnpm test:unit path/to/test.spec.ts

# Integration test  
pnpm test:integration feature-name

# Manual verification
curl -X POST http://localhost:3000/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Success Criteria
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] No security vulnerabilities
- [ ] Follows project standards (<200 lines/file, <30 lines/function)
- [ ] Proper error handling implemented
- [ ] Logging statements included
- [ ] Documentation comments added
```

### 4. Code Quality Standards

Every code block MUST include:

```typescript
// 1. Proper imports (sorted by convention)
import { builtin } from 'node:module';
import { external } from 'external-package';
import { internal } from '@packages/shared';
import { relative } from './local-file';

// 2. Type definitions
interface RequestBody {
  field: string;
  // No 'any' types allowed
}

// 3. Input validation
const schema = z.object({
  field: z.string().min(1).max(100),
});

// 4. Error handling
try {
  // operation
} catch (error) {
  logger.error('Specific error context', error);
  throw new AppError('User-friendly message', 400);
}

// 5. Logging
logger.info('Operation started', { userId, action });

// 6. Security checks
if (userId !== resource.ownerId) {
  throw new ForbiddenError('Access denied');
}

// 7. Function size limit (30 lines max)
function doSomething() {
  // 30 lines maximum
}
```

### 5. Integration Points

Each task MUST specify:

1. **API Endpoints** (if applicable):
```typescript
// Method, path, request/response types
POST /api/resource
Request: CreateResourceDto
Response: ResourceResponse
Status: 201 Created
```

2. **Database Changes** (if applicable):
```sql
-- Exact migration SQL
ALTER TABLE users ADD COLUMN feature_enabled BOOLEAN DEFAULT false;
CREATE INDEX idx_users_feature ON users(feature_enabled);
```

3. **External Service Calls** (if applicable):
```typescript
// Service configuration
const client = new ServiceClient({
  apiKey: process.env.SERVICE_API_KEY,
  timeout: 5000,
  retries: 3,
});
```

### 6. Special Considerations for Each Phase

#### PHASE 1 (Foundation):
- Focus on robust setup that won't need changes later
- Include all security measures from the start
- Set up proper testing infrastructure
- Create reusable utilities and types

#### PHASE 2 (Core Features):
- Implement with scalability in mind
- Include caching strategies
- Add comprehensive error handling
- Create integration tests for all endpoints

#### PHASE 3 (RAG & Knowledge):
- Optimize for token usage
- Include fallback strategies
- Implement proper context windowing
- Add source citation tracking

#### PHASE 4 (Production):
- Include monitoring and metrics
- Add performance optimizations
- Implement graceful degradation
- Include rollback procedures

### 7. Critical Computer Guys Specific Requirements

#### Business Logic Constraints
```typescript
// NEVER mention these competitors in responses
const BLOCKED_COMPETITORS = ['Dell', 'HP', 'Lenovo', 'Apple', 'ASUS', 'Acer', 'Microsoft Surface'];

// ALWAYS redirect uncertain cases to support
const SUPPORT_NUMBER = '1800-COMP-GUYS';
const SUPPORT_EMAIL = 'support@computerguys.com';

// Product scope boundaries - ONLY discuss these topics
const ALLOWED_TOPICS = [
  'Computer Guys products and services',
  'CG warranties and support plans',
  'CG repair services',
  'Technical support for CG-sold items',
  'CG store locations and hours',
  'CG pricing and promotions'
];

// Competitor mention filter
function filterCompetitorMentions(text: string): string {
  BLOCKED_COMPETITORS.forEach(competitor => {
    const regex = new RegExp(competitor, 'gi');
    text = text.replace(regex, '[Product]');
  });
  return text;
}
```

#### Mandatory Security Patterns
```typescript
// EVERY database query MUST include userId filter
const secureQuery = async (userId: string, queryParams: any) => {
  // NEVER allow queries without userId
  if (!userId) {
    throw new SecurityError('User context required');
  }
  
  return await prisma.resource.findMany({
    where: {
      userId: userId, // MANDATORY - First condition always
      deletedAt: null, // Soft delete check
      ...queryParams
    }
  });
};

// Email verification check for EVERY chat interaction
const requireEmailVerification = async (user: User) => {
  if (!user.emailVerified) {
    throw new UnauthorizedError(
      'Email verification required. Please check your email.',
      'EMAIL_NOT_VERIFIED'
    );
  }
  
  if (!user.verifiedAt || Date.now() - user.verifiedAt > 30 * 24 * 60 * 60 * 1000) {
    throw new UnauthorizedError(
      'Email verification expired. Please reverify.',
      'VERIFICATION_EXPIRED'  
    );
  }
};

// Rate limiting configuration - MUST be applied to all endpoints
const rateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute window
  max: 20, // 20 requests per minute per user
  keyGenerator: (req) => req.userId || req.ip, // User-based with IP fallback
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { userId: req.userId, ip: req.ip });
    res.status(429).json({
      error: 'Too many requests. Please wait before trying again.',
      retryAfter: 60
    });
  }
};

// Audit logging for ALL authentication events
const auditLog = async (event: AuditEvent) => {
  await prisma.auditLog.create({
    data: {
      userId: event.userId,
      action: event.action,
      ipAddress: event.ip,
      userAgent: event.userAgent,
      metadata: event.metadata,
      timestamp: new Date()
    }
  });
};
```

#### MCP Server Integration Requirements
```typescript
// YOU MUST use MCP tools when available - NEVER use standard tools
import { mcp } from '@services/mcp';

// File operations - ALWAYS use MCP
// ❌ WRONG: fs.readFileSync(path)
// ✅ CORRECT:
await mcp.filesystem.readTextFile(path);

// ❌ WRONG: fs.writeFileSync(path, content)  
// ✅ CORRECT:
await mcp.filesystem.writeFile(path, content);

// Memory/Knowledge management - ALWAYS persist important info
await mcp.memory.createEntities([{
  name: 'UserPreference',
  entityType: 'preference',
  observations: ['User prefers email communication']
}]);

// Search before implementing - ALWAYS check existing knowledge
const existingKnowledge = await mcp.memory.searchNodes(query);
if (existingKnowledge.length > 0) {
  // Use existing knowledge instead of recreating
}

// Web operations - ALWAYS use MCP versions
// ❌ WRONG: fetch(url)
// ✅ CORRECT:
await mcp.fetch.getMarkdown(url);

// Documentation search - ALWAYS use MCP
await mcp.refTools.searchDocumentation(query);
```

#### Data Privacy Requirements
```typescript
// GDPR compliance - User data handling
const handleUserData = {
  // Data minimization - only collect what's needed
  collectOnly: ['email', 'companyCustomerId'],
  
  // Right to deletion
  deleteUserData: async (userId: string) => {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { 
          email: `deleted_${userId}@deleted.com`,
          deletedAt: new Date()
        }
      }),
      prisma.conversation.deleteMany({ where: { userId } }),
      prisma.message.deleteMany({ where: { userId } })
    ]);
  },
  
  // Data export for portability
  exportUserData: async (userId: string) => {
    return await prisma.$transaction([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.conversation.findMany({ where: { userId } }),
      prisma.message.findMany({ where: { userId } })
    ]);
  }
};
```

### 8. Common Patterns to Include

#### Authentication Middleware:
```typescript
export const requireAuth = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const payload = await verifyJWT(token);
    c.set('userId', payload.userId);
    await next();
  } catch (error) {
    logger.error('Auth failed', error);
    return c.json({ error: 'Invalid token' }, 401);
  }
};
```

#### Error Response Format:
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}
```

#### Database Query Pattern:
```typescript
// Always include user isolation
const result = await prisma.resource.findMany({
  where: {
    userId: userId, // MANDATORY
    ...otherFilters,
  },
});
```

## Output Format

Generate exactly [NUMBER] tasks for [PHASE_NAME], focusing on [SPECIFIC_AREA].

Each task should be:
1. **Immediately executable** - No research needed
2. **Complete** - All code provided, no TODOs
3. **Tested** - Include test cases
4. **Documented** - Clear comments where needed
5. **Secure** - Following all security requirements
6. **Compliant** - Meeting all project standards

## Example Usage

To generate tasks for PHASE 1 Database Setup:

```
Using this prompt template, generate all 5 tasks (P1-DB-001 through P1-DB-005) for PHASE 1 Database Setup. Include:

1. Complete Prisma schema with all models
2. NEON connection setup with pooling
3. Migration creation and execution
4. Convex schema and configuration  
5. Seed script with test data

Each task should contain working code that can be copied and executed immediately.
```

## Quality Checklist for Generated Tasks

Before finalizing, ensure each task:

- [ ] Has complete, runnable code (no placeholders)
- [ ] Includes all necessary imports
- [ ] Has proper error handling
- [ ] Includes logging statements
- [ ] Follows the 200-line file limit
- [ ] Has functions under 30 lines
- [ ] Includes input validation
- [ ] Has security checks (user isolation)
- [ ] Provides exact file paths
- [ ] Includes testing commands
- [ ] Has clear validation criteria
- [ ] Addresses potential issues
- [ ] Follows project conventions
- [ ] Can be completed in stated time
- [ ] Has all dependencies listed

## Additional Task Requirements

### Package Versions to Use
```json
{
  "hono": "^4.0.0",
  "next": "^15.0.0", 
  "convex": "^1.0.0",
  "@prisma/client": "^5.0.0",
  "zod": "^3.22.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.0",
  "socket.io": "^4.6.0",
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-*": "latest",
  "react-query": "^5.0.0"
}
```

### Docker Base Images
```dockerfile
# Always use these specific versions
FROM node:20-alpine AS builder
FROM nginx:1.25-alpine AS proxy
```

### Free Tier Limits to Consider
```typescript
const FREE_TIER_LIMITS = {
  convex: {
    functionsPerMonth: 1_000_000,
    bandwidthGB: 5
  },
  neon: {
    storageGB: 3,
    computeHoursPerDay: 1
  },
  pinecone: {
    vectors: 100_000,
    namespaces: 1
  },
  upstash: {
    commandsPerDay: 10_000,
    storageKB: 256
  },
  openrouter: {
    costPerMillionTokens: 1.50 // Budget conscious
  }
};
```

### Testing Standards
```typescript
// Every task with code MUST include tests
describe('FeatureName', () => {
  beforeEach(() => {
    // Setup
  });
  
  it('should handle success case', async () => {
    // Test implementation
    expect(result).toBeDefined();
  });
  
  it('should handle error case', async () => {
    // Error scenario
    await expect(operation()).rejects.toThrow('Expected error');
  });
  
  it('should enforce user isolation', async () => {
    // Security test
    const otherUserId = 'different-user';
    await expect(accessResource(otherUserId)).rejects.toThrow('Access denied');
  });
});
```

## Remember

The developer executing these tasks should be able to:
1. Copy the code directly
2. Run the commands exactly as shown
3. Verify success with provided tests
4. Move to the next task immediately

No research, no guessing, no "figure it out" - everything needed is in the task description.

**CRITICAL**: Every generated task must be production-ready, secure, and follow ALL Computer Guys business rules and technical requirements.