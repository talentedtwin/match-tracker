// Migration script to encrypt existing player names
// Run this once to encrypt all existing plaintext player names in the database

import { prisma } from "../src/lib/prisma";
import { EncryptionService } from "../src/lib/encryption";

async function migratePlayerNames() {
  console.log("Starting player name encryption migration...");

  try {
    // Get all players with potentially unencrypted names
    const players = await prisma.player.findMany({
      where: {
        isDeleted: false,
      },
    });

    console.log(`Found ${players.length} players to check.`);

    for (const player of players) {
      try {
        // Try to decrypt the name to see if it's already encrypted
        const decrypted = EncryptionService.decrypt(player.name);
        console.log(
          `Player ${player.id} already encrypted: ${player.name.substring(
            0,
            20
          )}...`
        );
      } catch (error) {
        // If decryption fails, the name is probably plaintext
        console.log(`Encrypting player ${player.id}: "${player.name}"`);

        const encryptedName = EncryptionService.encrypt(player.name);

        await prisma.player.update({
          where: { id: player.id },
          data: { name: encryptedName },
        });

        console.log(`✓ Encrypted player ${player.id}`);
      }
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  migratePlayerNames();
}

export { migratePlayerNames };
