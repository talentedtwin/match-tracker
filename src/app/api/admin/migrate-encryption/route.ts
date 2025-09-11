import { NextResponse } from "next/server";
import { PlayerService } from "@/lib/playerService";
import { prisma } from "@/lib/prisma";

// POST /api/admin/migrate-encryption - Encrypt all plaintext player names
export async function POST() {
  try {
    // Security check - only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Migration endpoint disabled in production" },
        { status: 403 }
      );
    }

    console.log("Starting player name encryption migration...");

    // Get all players
    const players = await prisma.player.findMany({
      where: {
        isDeleted: false,
      },
    });

    console.log(`Found ${players.length} players to check.`);

    let encryptedCount = 0;
    let alreadyEncryptedCount = 0;
    let errorCount = 0;

    for (const player of players) {
      try {
        // Check if name is already encrypted (contains ':' and is long enough)
        if (player.name.includes(":") && player.name.length > 32) {
          console.log(`Player ${player.id} already encrypted`);
          alreadyEncryptedCount++;
        } else {
          // Encrypt the plaintext name
          await PlayerService.encryptPlayerNameIfNeeded(player.id, player.name);
          encryptedCount++;
        }
      } catch (error) {
        console.error(`Error processing player ${player.id}:`, error);
        errorCount++;
      }
    }

    const result = {
      total: players.length,
      encrypted: encryptedCount,
      alreadyEncrypted: alreadyEncryptedCount,
      errors: errorCount,
      message: "Migration completed successfully!",
    };

    console.log("Migration result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json(
      {
        error: "Migration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
