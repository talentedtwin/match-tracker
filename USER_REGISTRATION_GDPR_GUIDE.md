# User Registration & GDPR Implementation Guide

## 🔑 **User ID Strategy: Clerk ID as Primary Key**

✅ **Decision**: Use Clerk user ID directly as the database primary key

- No separate CUIDs needed
- Single source of truth for user identity
- Simplified relationships and RLS policies
- Direct integration with authentication

## 📊 **Database Schema Changes**

```prisma
model User {
  id String @id // Clerk user ID (no @default)
  // ... other fields remain the same
}
```

## 🔄 **Automatic User Registration via Webhooks**

### Webhook Endpoint: `/api/webhooks/clerk`

**Events Handled:**

- `user.created` → Creates User record with GDPR consent
- `user.updated` → Syncs profile changes and tracks login
- `user.deleted` → Soft deletes user and initiates data cleanup

**GDPR Fields Set on Registration:**

```typescript
{
  id: clerkUserId,
  email: primaryEmail,
  name: fullName,
  gdprConsentDate: new Date(), // Consent given on registration
  consentWithdrawn: false,
  dataRetentionUntil: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000), // 7 years
  lastLoginAt: new Date(),
  isDeleted: false,
}
```

## 🛡️ **GDPR Compliance Features**

### 1. **User Service** (`src/lib/userService.ts`)

- `getUserProfile()` - Get user info with GDPR details
- `withdrawConsent()` - Initiate deletion process (30 days)
- `exportUserData()` - Complete data export for GDPR Article 15
- `checkGDPRConsent()` - Verify consent validity
- `cleanupExpiredUserData()` - Permanent deletion after retention period

### 2. **API Endpoints**

#### GET `/api/gdpr/consent` - Check consent status

```json
{
  "hasConsent": true,
  "consentDate": "2024-01-01T00:00:00Z",
  "retentionUntil": "2031-01-01T00:00:00Z"
}
```

#### POST `/api/gdpr/consent` - Withdraw consent

```json
{
  "action": "withdraw"
}
```

#### GET `/api/gdpr/export` - Export all user data

- Downloads complete JSON file with all user data
- Includes players, matches, stats, and metadata
- Filename: `user-data-export-{userId}-{date}.json`

#### DELETE `/api/gdpr/export` - Request account deletion

- Marks account for deletion
- Sets 30-day retention period
- Withdraws consent automatically

## 🔧 **Setup Instructions**

### 1. **Update Environment Variables**

```bash
# Add to .env.local
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2. **Configure Clerk Webhook**

1. Go to Clerk Dashboard → Webhooks
2. Add webhook endpoint: `https://yourapp.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy webhook secret to environment

### 3. **Database Migration**

```bash
# Generate and apply Prisma migration
npx prisma migrate dev --name "clerk-user-id-and-gdpr"

# Apply RLS policies
psql -d your_database -f prisma/clerk-rls.sql
```

### 4. **Test Webhook**

```bash
# Use Clerk's webhook testing tool or ngrok for local development
ngrok http 3000
# Then update webhook URL in Clerk dashboard
```

## 📋 **GDPR Compliance Checklist**

✅ **Lawful Basis (Article 6)**: Consent recorded on registration
✅ **Right to Access (Article 15)**: Data export endpoint
✅ **Right to Erasure (Article 17)**: Account deletion with 30-day grace
✅ **Data Minimization**: Only collect necessary data
✅ **Storage Limitation**: 7-year retention with automatic cleanup
✅ **Accountability**: Audit trail of consent and data operations
✅ **Security**: RLS policies prevent unauthorized access

## 🔄 **User Lifecycle**

1. **Registration** → Webhook creates User record with consent
2. **Usage** → All operations respect RLS and consent status
3. **Consent Withdrawal** → 30-day deletion countdown starts
4. **Data Export** → Users can download complete data anytime
5. **Account Deletion** → Automatic cleanup after retention period

## 🚨 **Important Notes**

- **Webhook Secret**: Must be configured for production security
- **Data Retention**: Customize retention periods per your requirements
- **Backup Strategy**: Consider GDPR-compliant backup procedures
- **Monitoring**: Set up alerts for failed webhook deliveries
- **Documentation**: Keep records of data processing activities

## 🎯 **Benefits**

- **Automatic Compliance**: GDPR requirements handled automatically
- **Security First**: RLS ensures data isolation
- **User Control**: Users can manage their data and consent
- **Audit Ready**: Complete trail of data operations
- **Scalable**: Webhook-based approach scales with user growth

Your application now has enterprise-grade user management with full GDPR compliance! 🎉
