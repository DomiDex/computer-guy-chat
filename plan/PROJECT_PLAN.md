# Computer Guys Chatbot - Master Project Plan

## 🎯 Project Overview

**Goal**: Build a customer service chatbot for Computer Guys (CG) in 4 weeks
**Budget**: Free-tier services only
**Team**: 1 developer with Claude Code agents

## 📋 Executive Summary

### Key Requirements
- ✅ Email verification before chat access
- ✅ Strict user data isolation
- ✅ CG products/services only (no competitors)
- ✅ Support fallback: 1800-COMP-GUYS
- ✅ 80% test coverage minimum

### Tech Stack
- **Backend**: Hono.js, TypeScript, NEON PostgreSQL
- **Frontend**: Next.js 15, Tailwind CSS, Shadcn/ui
- **Real-time**: Convex, Socket.io
- **AI/LLM**: OpenRouter API
- **Vector DB**: Pinecone/Supabase Vector
- **Deployment**: Railway (API), Vercel (Frontend)

## 📅 4-Week Timeline

### Week 1: Foundation (Days 1-7)
**Lead Agent**: Backend Development
**Status**: CURRENT WEEK

#### Day 1-2: Project Setup
- [x] Initialize monorepo with Turborepo
- [x] Setup PNPM workspaces
- [x] Create project structure
- [x] Configure TypeScript
- [x] Setup Docker environment
- [ ] Initialize Git repository

#### Day 3-4: Database & Auth
- [ ] Design database schema (Prisma)
- [ ] Setup NEON PostgreSQL
- [ ] Implement JWT authentication
- [ ] Create email verification system
- [ ] Setup Upstash Redis for sessions

#### Day 5-6: Core API
- [ ] Create Hono.js API structure
- [ ] Implement user routes
- [ ] Build conversation management
- [ ] Add message endpoints
- [ ] Setup rate limiting

#### Day 7: Integration & Testing
- [ ] Write unit tests for services
- [ ] Test user isolation
- [ ] Verify JWT flow
- [ ] Document API endpoints

**Deliverables**:
- Working authentication system
- Database schema deployed
- Basic API with user management
- Docker development environment

### Week 2: Core Features (Days 8-14)
**Lead Agents**: AI/RAG + Frontend

#### Day 8-9: AI Integration
- [ ] Setup OpenRouter connection
- [ ] Design prompt templates
- [ ] Implement response filtering
- [ ] Create semantic caching layer
- [ ] Build token usage monitoring

#### Day 10-11: RAG Pipeline
- [ ] Configure vector database (Pinecone)
- [ ] Index CG product catalog
- [ ] Build retrieval system
- [ ] Implement context injection
- [ ] Create fallback responses

#### Day 12-13: Chat Interface
- [ ] Build Next.js app structure
- [ ] Create chat UI components
- [ ] Implement message threading
- [ ] Add typing indicators
- [ ] Setup Socket.io client

#### Day 14: Real-time Features
- [ ] Configure Convex backend
- [ ] Implement WebSocket fallback
- [ ] Add presence detection
- [ ] Build notification system

**Deliverables**:
- LLM integration complete
- RAG pipeline operational
- Chat interface functional
- Real-time messaging working

### Week 3: Integration & Testing (Days 15-21)
**Lead Agent**: Testing & Security

#### Day 15-16: Integration
- [ ] Connect frontend to API
- [ ] Wire up LLM responses
- [ ] Test end-to-end flow
- [ ] Fix integration issues

#### Day 17-18: Testing Suite
- [ ] Write comprehensive unit tests
- [ ] Create integration tests
- [ ] Build E2E test suite
- [ ] Achieve 80% coverage

#### Day 19-20: Security Audit
- [ ] Run security scanning
- [ ] Test user isolation
- [ ] Verify JWT security
- [ ] Check for vulnerabilities
- [ ] Implement fixes

#### Day 21: Performance
- [ ] Load testing (100 users)
- [ ] Optimize database queries
- [ ] Implement caching strategies
- [ ] Bundle size optimization

**Deliverables**:
- All components integrated
- 80%+ test coverage
- Security audit passed
- Performance benchmarks met

### Week 4: Deployment & Polish (Days 22-28)
**Lead Agents**: DevOps + Documentation

#### Day 22-23: Deployment Prep
- [ ] Setup CI/CD pipelines
- [ ] Configure environments
- [ ] Prepare production configs
- [ ] Setup monitoring (Sentry)

#### Day 24-25: Production Deploy
- [ ] Deploy API to Railway
- [ ] Deploy frontend to Vercel
- [ ] Configure custom domains
- [ ] Setup SSL certificates
- [ ] Verify production systems

#### Day 26-27: Final Testing
- [ ] Production smoke tests
- [ ] User acceptance testing
- [ ] Fix critical bugs
- [ ] Performance validation

#### Day 28: Handover
- [ ] Complete documentation
- [ ] Create admin guide
- [ ] Prepare support materials
- [ ] Final project delivery

**Deliverables**:
- Production deployment live
- Monitoring configured
- Complete documentation
- Project handover package

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│              Next.js Frontend               │
│         (Vercel - Edge Functions)           │
└─────────────┬──────────────┬────────────────┘
              │              │
      WebSocket          REST API
              │              │
┌─────────────▼──────────────▼────────────────┐
│           Hono.js API Gateway               │
│         (Railway - Dockerized)              │
├──────────────────────────────────────────────┤
│  Auth │ Rate Limit │ Validation │ Logging   │
└─────────────┬──────────────┬────────────────┘
              │              │
    ┌─────────▼──────┐  ┌───▼──────────┐
    │  PostgreSQL    │  │   Redis       │
    │    (NEON)      │  │  (Upstash)    │
    └────────────────┘  └───────────────┘
              │
    ┌─────────▼──────────────┐
    │    Convex Backend      │
    │  (Real-time + Vector)  │
    └─────────┬──────────────┘
              │
    ┌─────────▼──────────────┐
    │   OpenRouter LLM       │
    │   (GPT-4/Claude)       │
    └────────────────────────┘
```

## 🔐 Security Checklist

- [ ] Email verification enforced
- [ ] User data isolation verified
- [ ] JWT tokens expire in 15 minutes
- [ ] Rate limiting active (20 req/min)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CORS properly configured
- [ ] Secrets in environment variables
- [ ] Audit logging implemented

## 📊 Success Metrics

### Week 1 Targets
- Database schema complete ✓
- Authentication working ✓
- 5+ API endpoints ✓
- 50% test coverage ✓

### Week 2 Targets
- LLM responding accurately
- <2s response time
- RAG retrieving context
- Chat UI functional

### Week 3 Targets
- 80% test coverage
- 0 critical vulnerabilities
- <500ms API response
- 100 concurrent users supported

### Week 4 Targets
- 99.9% uptime
- Complete documentation
- Production deployment
- Successful handover

## 🚨 Risk Management

### High Priority Risks

1. **LLM Cost Overrun**
   - Mitigation: Aggressive caching, smaller models
   - Fallback: Static responses for common queries

2. **Timeline Slippage**
   - Mitigation: MVP focus, cut non-essential features
   - Fallback: Extend by 3 days max

3. **Integration Failures**
   - Mitigation: Early integration testing
   - Fallback: Simplified architecture

4. **Security Vulnerabilities**
   - Mitigation: Continuous scanning
   - Fallback: Delay launch for fixes

## 📁 Project Structure

```
computer-guy-chat/
├── apps/
│   ├── api/              # Hono.js backend
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   └── Dockerfile
│   └── web/              # Next.js frontend
│       ├── app/
│       ├── components/
│       └── hooks/
├── packages/
│   ├── types/           # Shared TypeScript types
│   ├── validators/      # Zod schemas
│   └── utils/           # Common utilities
├── convex/              # Convex backend
│   ├── ai/             # LLM integration
│   └── messages/       # Real-time messaging
├── claude/             # Agent architecture
│   └── agents/         # Agent definitions
├── prisma/             # Database schema
└── docker-compose.yml  # Dev environment
```

## 🎯 Daily Checklist

### Morning (9:00 AM)
- [ ] Review overnight builds
- [ ] Check agent status
- [ ] Assign daily tasks
- [ ] Clear blockers

### Midday (12:00 PM)
- [ ] Progress check
- [ ] Test completed features
- [ ] Update todo list

### Evening (5:00 PM)
- [ ] Commit changes
- [ ] Update documentation
- [ ] Plan next day

## 📝 Key Decisions Log

| Date | Decision | Rationale | Impact |
|------|----------|-----------|--------|
| Day 1 | Use Hono.js over Express | Better TypeScript support, smaller bundle | Positive |
| Day 1 | NEON over Supabase | Better free tier for PostgreSQL | Neutral |
| Day 1 | Monorepo with Turborepo | Easier dependency management | Positive |

## 🔗 Quick Links

- [Agent Architecture](/claude/agents/AGENT_ARCHITECTURE.md)
- [API Patterns](/claude/api-patterns.md)
- [Security Rules](/claude/security-rules.md)
- [Code Standards](/claude/code-standards.md)

## 📞 Support & Escalation

- **Technical Issues**: Create GitHub issue
- **Security Concerns**: Immediate escalation
- **Business Questions**: Refer to requirements
- **Customer Support**: 1800-COMP-GUYS

---

**Last Updated**: Week 1, Day 1
**Next Review**: End of Day 2
**Project Status**: 🟢 ON TRACK