# Neon Database Setup Guide for Computer Guys Chatbot

## Step 1: Create Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Verify your email

## Step 2: Create New Project
1. Click "Create a project"
2. Configure:
   - **Project name**: `computer-guys-chatbot`
   - **Database name**: `computer_guys_dev`
   - **Region**: Choose closest to your location (e.g., US East)
   - **Postgres version**: 16 (latest)

## Step 3: Get Connection Strings
After project creation, you'll see two connection strings:

1. **Direct connection** (for migrations):
   ```
   postgresql://[username]:[password]@[project].neon.tech/computer_guys_dev?sslmode=require
   ```

2. **Pooled connection** (for app queries):
   ```
   postgresql://[username]:[password]@[project]-pooler.neon.tech/computer_guys_dev?sslmode=require&pgbouncer=true
   ```

## Step 4: Update Your .env File
Edit `/apps/api/.env` and add BOTH connection strings:

```bash
# Pooled connection for app queries (main DATABASE_URL)
DATABASE_URL="postgresql://[username]:[password]@[project]-pooler.neon.tech/computer_guys_dev?sslmode=require&pgbouncer=true&connect_timeout=15"

# Direct connection for migrations (DIRECT_URL)
DIRECT_URL="postgresql://[username]:[password]@[project].neon.tech/computer_guys_dev?sslmode=require"
```

**Important**: 
- Use the pooled connection for `DATABASE_URL` (better for serverless)
- Use the direct connection for `DIRECT_URL` (required for migrations)

## Step 5: Test Connection
```bash
cd apps/api
npx prisma db pull
```

If successful, you should see:
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "computer_guys_dev"
```

## Step 6: Run Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init
```

## Step 7: Verify Database
```bash
# Open Prisma Studio to view your database
npx prisma studio
```

## Troubleshooting

### Connection timeout
If you get timeout errors, add `?connect_timeout=10` to your connection string.

### SSL errors
Make sure `?sslmode=require` is in your connection string.

### Migration errors
Use the DIRECT_URL (non-pooled) connection for migrations.

### Free Tier Limits
- **Storage**: 3 GB
- **Compute**: 1 compute hour per day
- **Branches**: 10
- Perfect for development!

## Security Notes
1. **Never commit .env files** to git
2. **Use environment variables** in production
3. **Enable IP allowlisting** in Neon console for production
4. **Use connection pooling** for better performance

## Next Steps
After database setup:
1. Test the API server: `pnpm dev --filter=@cg/api`
2. Check health endpoint: `http://localhost:3000/health`
3. Check ready endpoint: `http://localhost:3000/ready`