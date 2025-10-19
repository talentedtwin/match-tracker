# Database Connection Troubleshooting

## Error: Can't reach database server at `aws-1-eu-west-2.pooler.supabase.com:5432`

This error indicates that the application cannot connect to your Supabase database. Here are the solutions:

### 🔍 **Immediate Checks**

1. **Check Database Health**

   ```
   Visit: http://localhost:3000/api/health/database
   ```

   This endpoint will tell you if the database is reachable.

2. **Verify Environment Variables**
   Make sure your `.env.local` file contains:

   ```
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   ```

3. **Check Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Check if the database is running
   - Verify connection strings in Settings > Database

### 🛠️ **Solutions Implemented**

1. **Connection Retry Logic**

   - Added automatic retry for failed database operations
   - 3 retry attempts with exponential backoff
   - Better error messages for connection failures

2. **Database Health Monitoring**

   - New health check endpoint: `/api/health/database`
   - Connection validation before operations
   - Detailed error reporting

3. **Improved Error Handling**
   - Graceful degradation when database is unavailable
   - Better user-facing error messages
   - Logging for debugging

### 🔧 **Common Fixes**

1. **Regenerate Database Connection**

   ```bash
   npm run db:generate
   ```

2. **Reset Database Connection**

   ```bash
   npx prisma db push
   ```

3. **Check Network/Firewall**

   - Ensure port 5432 is accessible
   - Check if VPN/proxy is interfering
   - Verify Supabase isn't experiencing downtime

4. **Connection String Format**
   Make sure your DATABASE_URL follows this format:
   ```
   postgresql://[user]:[password]@[host]:[port]/[database]?[params]
   ```

### 📊 **Testing Connection**

After implementing fixes, test with:

```bash
curl http://localhost:3000/api/health/database
```

Expected response when healthy:

```json
{
  "status": "healthy",
  "message": "Database connection successful",
  "userCount": 5,
  "timestamp": "2025-10-03T18:00:00.000Z"
}
```

### 🚨 **If Problem Persists**

1. Check Supabase status page
2. Verify your Supabase project is active
3. Try connecting with a different tool (like pgAdmin)
4. Contact Supabase support if needed

The retry logic should help with temporary connection issues, but persistent failures may indicate configuration problems.
