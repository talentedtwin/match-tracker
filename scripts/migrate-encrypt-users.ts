#!/usr/bin/env node

/**
 * Migration script to encrypt existing user email and name fields
 *
 * This script:
 * 1. Finds all users with unencrypted email/name fields
 * 2. Encrypts the data using the EncryptionService
 * 3. Updates the database with encrypted values
 * 4. Provides detailed logging and error handling
 *
 * Run with: npx ts-node scripts/migrate-encrypt-users.ts
 */

import { prisma } from "../src/lib/prisma";
import { EncryptionService } from "../src/lib/encryption";

async function isEncrypted(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    // Try to decrypt - if it fails, it's probably not encrypted
    EncryptionService.decrypt(text);
    return true;
  } catch {
    // If decryption fails, it's likely plain text
    return false;
  }
}

async function migrateUserEncryption() {
  console.log("🔐 Starting user data encryption migration...\n");

  try {
    // Get all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    console.log(`📊 Found ${users.length} users to check for encryption\n`);

    let encryptedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        console.log(`👤 Processing user: ${user.id}`);

        const needsEncryption = {
          email: !(await isEncrypted(user.email)),
          name: user.name ? !(await isEncrypted(user.name)) : false,
        };

        if (!needsEncryption.email && !needsEncryption.name) {
          console.log(`   ✅ Already encrypted - skipping`);
          skippedCount++;
          continue;
        }

        const updateData: { email?: string; name?: string | null } = {};

        if (needsEncryption.email) {
          console.log(
            `   🔒 Encrypting email: ${user.email.substring(0, 3)}***`
          );
          updateData.email = EncryptionService.encrypt(user.email);
        }

        if (needsEncryption.name && user.name) {
          console.log(`   🔒 Encrypting name: ${user.name.substring(0, 3)}***`);
          updateData.name = EncryptionService.encrypt(user.name);
        }

        // Update the user with encrypted data
        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });

        console.log(`   ✅ Successfully encrypted user data`);
        encryptedCount++;
      } catch (error) {
        console.error(`   ❌ Error processing user ${user.id}:`, error);
        errorCount++;
      }

      console.log(); // Add blank line for readability
    }

    console.log("📈 Migration Summary:");
    console.log(`   • Users processed: ${users.length}`);
    console.log(`   • Users encrypted: ${encryptedCount}`);
    console.log(`   • Users skipped (already encrypted): ${skippedCount}`);
    console.log(`   • Errors: ${errorCount}`);

    if (errorCount === 0) {
      console.log("\n🎉 Migration completed successfully!");
    } else {
      console.log(`\n⚠️  Migration completed with ${errorCount} errors`);
    }
  } catch (error) {
    console.error("❌ Fatal error during migration:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Verification function to test decryption works
async function verifyEncryption() {
  console.log("\n🔍 Verifying encryption by testing decryption...\n");

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
      take: 3, // Just test a few users
    });

    for (const user of users) {
      try {
        const decryptedEmail = EncryptionService.decrypt(user.email);
        const decryptedName = user.name
          ? EncryptionService.decrypt(user.name)
          : null;

        console.log(`✅ User ${user.id}:`);
        console.log(`   Email: ${decryptedEmail.substring(0, 3)}***@***`);
        console.log(
          `   Name: ${
            decryptedName ? decryptedName.substring(0, 3) + "***" : "null"
          }`
        );
      } catch (error) {
        console.error(`❌ Failed to decrypt user ${user.id}:`, error);
      }
    }

    console.log("\n🎉 Verification completed!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--verify")) {
    await verifyEncryption();
  } else {
    await migrateUserEncryption();

    // Ask if user wants to verify
    console.log("\nTo verify the encryption worked, run:");
    console.log("npx ts-node scripts/migrate-encrypt-users.ts --verify");
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
