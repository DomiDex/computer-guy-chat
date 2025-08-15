# API Documentation

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://api.computerguys.com`

## Authentication

The API uses JWT Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens expire after 15 minutes. Use the refresh endpoint to get new tokens.

## Rate Limiting

- **Default**: 20 requests per minute per user
- **Auth endpoints**: 5 requests per minute per IP
- **Public endpoints**: 100 requests per minute per IP

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}, // Optional additional details
    "requestId": "uuid",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

Common error codes:
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Endpoints

### Authentication

#### `POST /api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890", // Optional
  "companyCustomerId": "CG123456" // Optional
}
```

**Validation:**
- Email: Valid email format, max 255 chars
- First name: 1-100 characters
- Last name: 1-100 characters
- Phone: Valid international format
- Customer ID: Alphanumeric, 6-20 chars

**Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent to user@example.com",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Errors:**
- `409 CONFLICT`: Email already registered
- `400 BAD_REQUEST`: Invalid input data
- `429 TOO_MANY_REQUESTS`: Rate limit exceeded

---

#### `POST /api/auth/verify-email`

Verify email address with 6-digit code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "rt_abc123...",
  "expiresIn": 900,
  "refreshExpiresIn": 604800,
  "tokenType": "Bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Errors:**
- `401 UNAUTHORIZED`: Invalid or expired code
- `404 NOT_FOUND`: Email not found
- `429 TOO_MANY_REQUESTS`: Too many attempts

---

#### `POST /api/auth/login`

Login with email verification code (passwordless).

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login code sent to user@example.com"
}
```

---

#### `POST /api/auth/refresh`

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "rt_abc123..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "rt_xyz789...",
  "expiresIn": 900,
  "tokenType": "Bearer"
}
```

**Errors:**
- `401 UNAUTHORIZED`: Invalid or revoked token
- `403 FORBIDDEN`: Token family compromised

---

#### `POST /api/auth/logout`

Logout and revoke tokens.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "refreshToken": "rt_abc123..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### `POST /api/auth/revoke-all`

Revoke all tokens for security.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "All sessions revoked",
  "revokedCount": 5
}
```

---

### User Management

#### `GET /api/users/me`

Get current user profile.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "companyCustomerId": "CG123456",
  "subscriptionTier": "premium",
  "verified": true,
  "verifiedAt": "2024-01-01T00:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

#### `PATCH /api/users/me`

Update user profile.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+0987654321",
  "timezone": "America/New_York",
  "locale": "en-US"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { /* Updated user object */ }
}
```

---

#### `DELETE /api/users/me`

Delete user account (GDPR compliance).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "confirmEmail": "user@example.com",
  "reason": "No longer need account" // Optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account scheduled for deletion",
  "deletionDate": "2024-01-31T00:00:00Z"
}
```

---

### Conversations

#### `GET /api/conversations`

List user's conversations.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (active|archived|closed)
- `search` (string): Search in titles and summaries
- `sortBy` (string): Sort field (createdAt|updatedAt)
- `sortOrder` (string): Sort order (asc|desc)

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Product warranty inquiry",
      "summary": "Customer asking about warranty options",
      "status": "active",
      "lastMessage": {
        "content": "The standard warranty is...",
        "role": "assistant",
        "createdAt": "2024-01-01T00:00:00Z"
      },
      "messageCount": 5,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

#### `POST /api/conversations`

Create a new conversation.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "title": "Need help with laptop",
  "initialMessage": "My laptop won't turn on",
  "metadata": {
    "source": "web",
    "category": "technical_support"
  }
}
```

**Response (201):**
```json
{
  "conversation": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Need help with laptop",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "role": "assistant",
    "content": "I'm sorry to hear about your laptop issue. Let me help you troubleshoot...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

#### `GET /api/conversations/:id`

Get conversation details with messages.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `includeMessages` (boolean): Include messages (default: true)
- `messageLimit` (number): Number of messages (default: 50)
- `messageOffset` (number): Skip messages (default: 0)

**Response (200):**
```json
{
  "conversation": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Need help with laptop",
    "status": "active",
    "summary": "Customer experiencing laptop power issues",
    "tags": ["technical_support", "hardware"],
    "metadata": {
      "source": "web",
      "category": "technical_support",
      "resolved": false
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "messages": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "role": "user",
      "content": "My laptop won't turn on",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "role": "assistant",
      "content": "I'm sorry to hear about your laptop issue...",
      "tokenCount": 45,
      "modelUsed": "gpt-4",
      "createdAt": "2024-01-01T00:00:01Z"
    }
  ],
  "hasMore": false
}
```

---

#### `POST /api/conversations/:id/messages`

Send a message in conversation.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "content": "I tried charging it but the light doesn't come on",
  "attachments": [
    {
      "type": "image",
      "url": "https://example.com/image.jpg",
      "name": "laptop_photo.jpg"
    }
  ]
}
```

**Response (201):**
```json
{
  "userMessage": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "role": "user",
    "content": "I tried charging it but the light doesn't come on",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "assistantMessage": {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "role": "assistant",
    "content": "The charging light not coming on could indicate...",
    "tokenCount": 67,
    "modelUsed": "gpt-4",
    "createdAt": "2024-01-01T00:00:01Z"
  }
}
```

---

#### `PATCH /api/conversations/:id`

Update conversation metadata.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "title": "Laptop power issue - RESOLVED",
  "status": "closed",
  "tags": ["technical_support", "hardware", "resolved"],
  "metadata": {
    "resolved": true,
    "resolution": "Bad power adapter"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "conversation": { /* Updated conversation */ }
}
```

---

#### `DELETE /api/conversations/:id`

Delete a conversation (soft delete).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Conversation archived"
}
```

---

### Search

#### `GET /api/search/conversations`

Search across user's conversations.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `q` (string): Search query (required)
- `limit` (number): Results limit (default: 10)
- `includeArchived` (boolean): Include archived (default: false)

**Response (200):**
```json
{
  "results": [
    {
      "conversationId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Laptop warranty question",
      "excerpt": "...wondering about the warranty coverage for...",
      "relevanceScore": 0.95,
      "messageCount": 3,
      "lastActivity": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 5,
  "query": "warranty"
}
```

---

### Health & Monitoring

#### `GET /health`

Basic health check.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "uptime": 3600,
  "environment": "production"
}
```

---

#### `GET /ready`

Readiness check with dependencies.

**Response (200):**
```json
{
  "status": "ready",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "openrouter": "available",
    "convex": "connected"
  }
}
```

**Response (503):**
```json
{
  "status": "not ready",
  "timestamp": "2024-01-01T00:00:00Z",
  "error": "Database connection failed"
}
```

---

#### `GET /metrics`

Prometheus-compatible metrics.

**Response (200):**
```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 1234

# HELP http_request_duration_seconds HTTP request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 1000
```

---

## WebSocket Events (via Convex)

### Connection

```javascript
const client = new ConvexClient(CONVEX_URL);
client.setAuth(accessToken);
```

### Subscribe to Conversation

```javascript
// Subscribe to real-time updates
const subscription = client.subscribe(
  "conversations:updates",
  { conversationId },
  (update) => {
    console.log("New message:", update);
  }
);
```

### Events

#### `message:new`
```json
{
  "type": "message:new",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "message": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "role": "assistant",
    "content": "I can help with that...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### `typing:start` / `typing:stop`
```json
{
  "type": "typing:start",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "role": "assistant"
}
```

#### `conversation:updated`
```json
{
  "type": "conversation:updated",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "changes": {
    "status": "closed",
    "closedAt": "2024-01-01T00:00:00Z"
  }
}
```

## SDKs & Examples

### JavaScript/TypeScript

```typescript
import { ComputerGuysAPI } from '@cg/sdk';

const api = new ComputerGuysAPI({
  baseURL: 'https://api.computerguys.com',
  apiKey: process.env.CG_API_KEY
});

// Register user
const { userId } = await api.auth.register({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe'
});

// Verify email
const { accessToken } = await api.auth.verifyEmail({
  email: 'user@example.com',
  code: '123456'
});

// Create conversation
api.setToken(accessToken);
const { conversation, message } = await api.conversations.create({
  title: 'Help needed',
  initialMessage: 'My computer is slow'
});

// Send message
const response = await api.conversations.sendMessage(
  conversation.id,
  { content: 'It started yesterday' }
);
```

### cURL Examples

```bash
# Register user
curl -X POST https://api.computerguys.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","firstName":"John","lastName":"Doe"}'

# Verify email
curl -X POST https://api.computerguys.com/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","code":"123456"}'

# Get conversations
curl -X GET https://api.computerguys.com/api/conversations \
  -H "Authorization: Bearer <token>"

# Send message
curl -X POST https://api.computerguys.com/api/conversations/<id>/messages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello, I need help"}'
```

## Testing

### Postman Collection

Import the Postman collection from `/docs/postman/computer-guys-api.json`

### Test Credentials

For development/staging only:
- Email: `test@computerguys.com`
- Verification code: `000000` (always valid in dev)

## Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Email verification authentication
- Conversation management
- Real-time messaging via Convex
- Rate limiting and audit logging

## Support

For API support:
- 📧 Email: api-support@computerguys.com
- 📚 Docs: https://docs.computerguys.com/api
- 🐛 Issues: https://github.com/computer-guys/chatbot/issues