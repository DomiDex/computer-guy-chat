# Claude Code Instructions for Computer Guys Chatbot

## Project Overview

You are working on a customer service chatbot for Computer Guys (CG). This is a 4-week project with strict security requirements and a free-tier budget constraint.

## Critical Business Rules

1. **MANDATORY**: Email verification required before any chat interaction
2. **SECURITY**: Strict user isolation - no cross-user data access EVER
3. **SCOPE**: Only discuss CG products and services
4. **COMPETITORS**: Never mention Dell, HP, Lenovo, Apple, or other competitors
5. **SUPPORT**: When uncertain, direct to: 1800-COMP-GUYS

## Project Structure

- **Monorepo** using Turborepo and PNPM workspaces
- **Backend**: `apps/api/` - Dockerized Hono.js API
- **Frontend**: `apps/web/` - Next.js 15 with App Router
- **Shared**: `packages/` - Common types and validators
- **Real-time**: `convex/` - Convex backend functions

## Current Phase

[UPDATE THIS SECTION AS YOU PROGRESS]

- Week: 1 of 4
- Current Focus: Database schema and authentication
- Completed: Project setup, environment configuration
- Next: Email verification implementation

## Code Standards

- **File Size**: Maximum 200 lines per file
- **Function Size**: Maximum 30 lines per function
- **DRY Principle**: If written twice, extract to function
- **Type Safety**: No 'any' types, use Zod for validation
- **Testing**: Minimum 80% coverage

## Security Requirements

- All database queries MUST filter by userId
- JWT tokens expire in 15 minutes
- Rate limiting: 20 requests/minute per user
- Input validation on EVERY endpoint
- Audit logging for all authentication events

## Technology Stack

- **API**: Hono.js, TypeScript, Zod
- **Database**: NEON PostgreSQL (free tier)
- **Cache**: Upstash Redis (serverless)
- **Real-time**: Convex
- **LLM**: OpenRouter API
- **Vector DB**: Pinecone/Supabase Vector
- **Deployment**: Railway (API), Vercel (Frontend)

## File Naming Conventions

- Services: `PascalCase` (e.g., `EmailVerifier.ts`)
- Routes: `kebab-case` (e.g., `auth.routes.ts`)
- Tests: `*.test.ts` or `*.spec.ts`
- Components: `PascalCase` (e.g., `ChatInterface.tsx`)

## Import Order

1. Node built-ins
2. External packages
3. Internal packages (@packages/\*)
4. Relative imports (services, utils, types)

## Git Commit Format

- `feat(scope):` New features
- `fix(scope):` Bug fixes
- `refactor(scope):` Code refactoring
- `test(scope):` Test additions/changes
- `docs(scope):` Documentation updates
- `chore(scope):` Maintenance tasks

## Testing Requirements

- Unit tests for all services
- Integration tests for API endpoints
- E2E tests for critical user flows
- Security tests for authentication
- Load tests before deployment

## Common Pitfalls to Avoid

1. Using localStorage/sessionStorage in artifacts
2. Forgetting user isolation in queries
3. Mentioning competitor products
4. Files exceeding 200 lines
5. Missing input validation
6. Hardcoding secrets

## Useful Commands

```bash
# Development
pnpm dev              # Start all services
pnpm dev:api         # Start API only
pnpm dev:web         # Start frontend only

# Testing
pnpm test            # Run all tests
pnpm test:unit       # Unit tests only
pnpm test:e2e        # E2E tests
pnpm test:security   # Security audit

# Database
pnpm db:migrate      # Run migrations
pnpm db:seed         # Seed test data
pnpm db:reset        # Reset database

# Deployment
pnpm build           # Build all apps
pnpm deploy:api      # Deploy API to Railway
pnpm deploy:web      # Deploy frontend to Vercel
```

## Questions to Ask Before Implementation

1. Does this maintain user isolation?
2. Is the input validated?
3. Are errors handled gracefully?
4. Is it within CG's scope?
5. Does it follow the file size limits?
6. Is it tested?

## Related Documentation

- "YOU MUST" Architecture: `/claude/project-context.md`
- "YOU MUST" Code Standards: `/claude/code-standards.md`
- "YOU MUST" Security: `/claude/security-rules.md`
- "YOU MUST" API Patterns: `/claude/api-patterns.md`
