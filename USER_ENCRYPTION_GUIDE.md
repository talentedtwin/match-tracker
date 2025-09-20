# User Data Encryption

This document outlines the user data encryption implementation for enhanced privacy protection.

## Overview

User email addresses and names are now encrypted in the database using AES-256-GCM encryption to protect personally identifiable information (PII).

## Encrypted Fields

- **email**: User's email address (required, unique)
- **name**: User's display name (optional)

## Database Schema

```sql
-- User email and name fields are stored as encrypted TEXT
email: String @unique @db.Text  -- Hex-encoded encrypted data
name: String? @db.Text          -- Hex-encoded encrypted data
```

## Implementation Details

### Encryption Process

1. **User Creation**: Email/name encrypted before database storage
2. **API Responses**: Data decrypted before returning to client
3. **Updates**: New data encrypted before database update

### Code Changes

#### UserService (`src/lib/userService.ts`)

- `createUser()`: Encrypts email/name before database insert
- `getUserProfile()`: Decrypts email/name before returning
- Import: Added `EncryptionService`

#### API Routes

- `/api/users`: Decrypts user data in responses
- `/api/users/[id]`: Decrypts user and related player data

#### Database Migration

- Schema updated to use `@db.Text` for encrypted fields
- Migration script created to encrypt existing data

## Migration Script

### Purpose

Encrypts existing unencrypted user data in the database.

### Usage

```bash
# Run the migration
npx ts-node scripts/migrate-encrypt-users.ts

# Verify encryption worked
npx ts-node scripts/migrate-encrypt-users.ts --verify
```

### Script Features

- ✅ **Smart Detection**: Only encrypts unencrypted data
- ✅ **Safe Operation**: Skips already encrypted records
- ✅ **Detailed Logging**: Shows progress and results
- ✅ **Error Handling**: Continues on individual errors
- ✅ **Verification**: Test decryption to ensure success

### Example Output

```
🔐 Starting user data encryption migration...

📊 Found 3 users to check for encryption

👤 Processing user: user_123abc
   🔒 Encrypting email: joh***
   🔒 Encrypting name: Joh***
   ✅ Successfully encrypted user data

👤 Processing user: user_456def
   ✅ Already encrypted - skipping

📈 Migration Summary:
   • Users processed: 3
   • Users encrypted: 1
   • Users skipped (already encrypted): 2
   • Errors: 0

🎉 Migration completed successfully!
```

## Security Benefits

### Data Protection

- **At Rest**: Email/name encrypted in database
- **In Transit**: HTTPS for API communication
- **Access Control**: RLS policies enforce user isolation

### GDPR Compliance

- **Data Minimization**: Only necessary data stored
- **Encryption**: PII protected with strong encryption
- **Right to Erasure**: Encrypted data can be securely deleted

### Privacy Features

- **Unique Constraint**: Works with encrypted emails
- **Search Capability**: Preserved through client-side decryption
- **Audit Trail**: Encryption events logged

## Development Notes

### Testing Encryption

```typescript
// Test encryption/decryption
const original = "test@example.com";
const encrypted = EncryptionService.encrypt(original);
const decrypted = EncryptionService.decrypt(encrypted);
console.log(original === decrypted); // true
```

### API Response Format

```json
{
  "id": "user_123",
  "email": "john@example.com", // Decrypted for client
  "name": "John Doe", // Decrypted for client
  "isPremium": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Database Storage

```sql
-- Database stores encrypted hex strings
email: "a1b2c3d4e5f6..."  -- Encrypted hex representation
name:  "f6e5d4c3b2a1..."  -- Encrypted hex representation
```

## Troubleshooting

### Migration Issues

**Problem**: Import errors when running migration

```
❌ Could not import EncryptionService
```

**Solution**: Ensure project is built

```bash
npm run build
npx ts-node scripts/migrate-encrypt-users.ts
```

**Problem**: Decryption fails after migration

```
❌ Failed to decrypt user data
```

**Solution**: Check encryption key is consistent

- Verify `ENCRYPTION_KEY` environment variable
- Ensure key hasn't changed since encryption

### API Issues

**Problem**: User data appears corrupted

```
email: "a1b2c3d4e5f6..."  // Showing encrypted data
```

**Solution**: Ensure decryption is applied

- Check API routes use `EncryptionService.decrypt()`
- Verify userService methods decrypt data

## Related Files

- `prisma/schema.prisma` - Database schema with encrypted fields
- `src/lib/userService.ts` - User operations with encryption
- `src/lib/encryption.ts` - Encryption service
- `scripts/migrate-encrypt-users.ts` - Migration script
- `src/app/api/users/` - User API endpoints
- `prisma/clerk-rls.sql` - Database security policies

## Security Considerations

1. **Key Management**: Store encryption key securely
2. **Key Rotation**: Plan for periodic key updates
3. **Backup Strategy**: Ensure encrypted backups work
4. **Access Logs**: Monitor decryption operations
5. **Performance**: Monitor encryption/decryption impact
