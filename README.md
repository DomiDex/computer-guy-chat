# 🤖 Computer Guys Customer Service Chatbot

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Hono](https://img.shields.io/badge/Hono-4.0-orange)](https://hono.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5.9-green)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

An enterprise-grade customer service chatbot for Computer Guys (CG), featuring secure authentication, RAG capabilities, and real-time support. Built with a focus on security, scalability, and user experience.

## 🎯 Project Overview

This chatbot provides 24/7 customer support for Computer Guys customers, handling inquiries about products, services, warranties, and technical support. The system enforces strict security measures including email verification, user isolation, and comprehensive audit logging.

### Key Features

- 🔐 **Secure Authentication**: JWT-based auth with 15-minute token expiry
- ✉️ **Email Verification**: Required before any chat interaction
- 💬 **Real-time Chat**: Powered by Convex for instant messaging
- 🧠 **RAG Integration**: Context-aware responses using vector search
- 📊 **Rate Limiting**: 20 requests/minute per user
- 🔍 **Audit Logging**: Complete security event tracking
- 🏢 **Multi-tenant**: User isolation at database level
- 📱 **Responsive UI**: Works on all devices

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
│                   Tailwind CSS + Radix UI                │
└────────────┬────────────────────────┬───────────────────┘
             │                        │
             ▼                        ▼
┌──────────────────────┐  ┌──────────────────────┐
│   API Server (Hono)  │  │  Real-time (Convex)  │
│   - Authentication   │  │  - WebSocket         │
│   - Business Logic   │  │  - Live Updates      │
│   - Rate Limiting    │  │  - Presence          │
└──────────┬───────────┘  └──────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────┐
│           Database (Neon PostgreSQL)         │
│         - User Management                    │
│         - Conversations & Messages           │
│         - Audit Logs                        │
└──────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────┐
│        External Services                     │
│  - OpenRouter (LLM)                         │
│  - Pinecone (Vector DB)                     │
│  - Upstash Redis (Cache)                    │
│  - SendGrid (Email)                         │
└──────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and PNPM 8.15+
- PostgreSQL database (Neon recommended)
- Redis instance (Upstash recommended)
- OpenRouter API key

### Installation

```bash
# Clone the repository
git clone https://github.com/computer-guys/chatbot.git
cd computer-guys-chatbot

# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Set up database
cd apps/api
npx prisma generate
npx prisma migrate dev --name init

# Start development servers
pnpm dev
```

### Environment Setup

Create `.env` files in both `apps/api` and `apps/web`:

**apps/api/.env**
```env
# Database (Neon)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
JWT_SECRET="minimum-32-character-secret-key"
JWT_REFRESH_SECRET="another-32-character-secret-key"

# Services
OPENROUTER_API_KEY="sk-or-v1-..."
UPSTASH_REDIS_REST_URL="https://..."
CONVEX_DEPLOYMENT="..."

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_USER="apikey"
SMTP_PASS="SG...."
```

**apps/web/.env**
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_CONVEX_URL="https://..."
```

## 📁 Project Structure

```
computer-guys-chatbot/
├── apps/
│   ├── api/                 # Hono.js API server
│   │   ├── prisma/          # Database schema & migrations
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── services/    # Business logic
│   │   │   ├── middleware/  # Auth, rate limiting, etc.
│   │   │   └── utils/       # Helpers & utilities
│   │   └── tests/           # API tests
│   │
│   └── web/                 # Next.js frontend
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/  # React components
│       │   ├── hooks/       # Custom hooks
│       │   └── lib/         # Utilities
│       └── tests/           # Frontend tests
│
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── validators/          # Zod validation schemas
│   └── config/              # Shared configurations
│
├── convex/                  # Real-time backend functions
├── docs/                    # Documentation
└── tasks/                   # Project tasks & planning
```

## 🔐 Security Features

### Authentication Flow
1. User registers with email
2. Email verification required
3. JWT access token (15 min) + refresh token (7 days)
4. Token rotation on refresh
5. Device fingerprinting

### Security Measures
- **User Isolation**: All queries filtered by userId
- **Rate Limiting**: 20 requests/minute per user
- **Input Validation**: Zod schemas on all endpoints
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **XSS Protection**: Content Security Policy headers
- **CORS**: Strict origin validation
- **Audit Logging**: All authentication events tracked
- **Password Security**: Bcrypt with 12 rounds

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "companyCustomerId": "CG123456" // Optional
}
```

**Response:**
```json
{
  "message": "Verification email sent",
  "userId": "uuid"
}
```

#### POST /api/auth/verify-email
Verify email with 6-digit code.

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "accessToken": "jwt...",
  "refreshToken": "token...",
  "expiresIn": 900,
  "tokenType": "Bearer"
}
```

#### POST /api/auth/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "token..."
}
```

**Response:**
```json
{
  "accessToken": "jwt...",
  "refreshToken": "new-token...",
  "expiresIn": 900
}
```

### Chat Endpoints

#### POST /api/conversations
Create a new conversation.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Product inquiry",
  "initialMessage": "What warranty options are available?"
}
```

**Response:**
```json
{
  "conversationId": "uuid",
  "message": {
    "id": "uuid",
    "role": "assistant",
    "content": "I can help you with warranty options..."
  }
}
```

#### POST /api/conversations/:id/messages
Send a message in conversation.

**Request:**
```json
{
  "content": "Tell me more about extended warranty"
}
```

#### GET /api/conversations
List user's conversations.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (active|archived|closed)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Unit tests only
pnpm test:unit

# E2E tests
pnpm test:e2e

# Security audit
pnpm test:security

# Coverage report
pnpm test:coverage
```

## 📦 Deployment

### Production Build

```bash
# Build all packages
pnpm build

# Build specific app
pnpm build --filter=@cg/api
pnpm build --filter=@cg/web
```

### Docker Deployment

```bash
# Build Docker images
docker-compose build

# Run with Docker
docker-compose up -d
```

### Environment-Specific Deployments

- **API**: Railway or Fly.io
- **Frontend**: Vercel or Netlify
- **Database**: Neon (production branch)
- **Real-time**: Convex Cloud

## 🛠️ Development

### Available Scripts

```bash
pnpm dev              # Start all services
pnpm dev:api         # Start API only
pnpm dev:web         # Start frontend only
pnpm lint            # Run ESLint
pnpm format          # Format with Prettier
pnpm typecheck       # TypeScript checking
pnpm db:migrate      # Run migrations
pnpm db:seed         # Seed database
pnpm db:studio       # Open Prisma Studio
```

### Code Standards

- **Max file size**: 200 lines
- **Max function size**: 30 lines
- **No `any` types**: Use proper TypeScript
- **DRY principle**: Extract repeated code
- **Test coverage**: Minimum 80%

### Git Workflow

```bash
# Feature branch
git checkout -b feat/feature-name

# Commit with conventional commits
git commit -m "feat(api): add email verification"
git commit -m "fix(web): resolve chat scrolling issue"
git commit -m "docs: update API documentation"

# Push and create PR
git push origin feat/feature-name
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Setup

1. Fork the repository
2. Create your feature branch
3. Follow code standards
4. Write tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📊 Monitoring

### Health Checks

- **API Health**: `GET /health`
- **Database**: `GET /ready`
- **Metrics**: `GET /metrics`

### Logging

All logs follow structured format:
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "info",
  "requestId": "uuid",
  "userId": "uuid",
  "action": "auth.login",
  "metadata": {}
}
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Failed
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify network connectivity

#### JWT Token Invalid
- Check JWT_SECRET matches across environments
- Verify token hasn't expired (15 min)
- Ensure proper Bearer token format

#### Rate Limit Exceeded
- Wait 60 seconds before retry
- Check for infinite loops in code
- Consider implementing exponential backoff

## 📄 License

This project is proprietary software owned by Computer Guys. All rights reserved.

## 📞 Support

For technical support:
- 📧 Email: support@computerguys.com
- 📱 Phone: 1800-COMP-GUYS
- 💬 Chat: Available 24/7 at computerguys.com

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Hono](https://hono.dev/) - Web framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Convex](https://www.convex.dev/) - Real-time backend
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components

---

© 2024 Computer Guys. All rights reserved.