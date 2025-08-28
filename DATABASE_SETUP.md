# Database Setup Guide

This guide will help you set up the Supabase database for the Match Tracker application.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed
3. Prisma CLI installed (already done)

## Step 1: Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Go to Settings > Database
4. Copy the connection details

## Step 2: Update Environment Variables

Update the `.env` file in the project root with your Supabase credentials:

```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
```

Replace the placeholders with your actual Supabase project details.

## Step 3: Run Database Migration

```bash
npx prisma migrate dev --name init
```

This will:

- Create the database tables
- Generate the Prisma client
- Apply the initial migration

## Step 4: Enable Row Level Security

Run the RLS policies in your Supabase SQL editor or via psql:

```bash
psql -f prisma/supabase-rls.sql
```

Or copy and paste the contents of `prisma/supabase-rls.sql` into your Supabase SQL editor.

## Step 5: Generate Prisma Client

```bash
npx prisma generate
```

## Database Schema Overview

### Tables

- **users**: User profiles
- **players**: Player information
- **matches**: Match records
- **player_match_stats**: Individual player performance in matches

### Relationships

- User → Players (1:many)
- User → Matches (1:many)
- Player → PlayerMatchStats (1:many)
- Match → PlayerMatchStats (1:many)

### Security

All tables have Row Level Security (RLS) enabled with policies that ensure:

- Users can only access their own data
- Proper cascading deletes
- Secure data isolation

## Usage in Code

Import the Prisma client in your API routes:

```typescript
import { prisma } from "@/lib/prisma";

// Example: Get all players for the current user
const players = await prisma.player.findMany({
  where: { userId: userId },
});
```

## Troubleshooting

1. **Connection Issues**: Ensure your DATABASE_URL is correct and your IP is whitelisted in Supabase
2. **RLS Errors**: Make sure you've run the RLS policies and have proper authentication set up
3. **Migration Errors**: Check that your database user has the necessary permissions

## Next Steps

After setting up the database:

1. Implement authentication (Supabase Auth recommended)
2. Create API routes for CRUD operations
3. Update the frontend to use the database instead of local state
4. Add proper error handling and loading states
