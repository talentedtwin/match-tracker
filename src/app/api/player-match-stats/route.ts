import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { withDatabaseUserContext } from "@/lib/db-utils";
import { ensureUserExists } from "@/lib/user-utils";
import { EncryptionService } from "@/lib/encryption";

// GET /api/player-match-stats - Get all player match stats for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    await ensureUserExists(userId);

    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");
    const playerId = searchParams.get("playerId");

    // Use RLS context to ensure users only see their own data
    const stats = await withDatabaseUserContext(userId, async () => {
      const where: { matchId?: string; playerId?: string } = {};
      if (matchId) where.matchId = matchId;
      if (playerId) where.playerId = playerId;

      return await prisma.playerMatchStat.findMany({
        where,
        include: {
          player: true,
          match: true,
        },
        orderBy: { match: { date: "desc" } },
      });
    });

    // Decrypt player names before returning
    const statsWithDecryptedNames = stats.map((stat) => ({
      ...stat,
      player: stat.player
        ? {
            ...stat.player,
            name: EncryptionService.decrypt(stat.player.name),
          }
        : null,
    }));

    return NextResponse.json(statsWithDecryptedNames);
  } catch (error) {
    console.error("Error fetching player match stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch player match stats" },
      { status: 500 }
    );
  }
}

// POST /api/player-match-stats - Create player match stats for authenticated user
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    await ensureUserExists(userId);

    const body = await request.json();
    const { playerId, matchId, goals, assists } = body;

    if (!playerId || !matchId) {
      return NextResponse.json(
        { error: "playerId and matchId are required" },
        { status: 400 }
      );
    }

    // Use RLS context for database operations
    const stat = await withDatabaseUserContext(userId, async () => {
      return await prisma.playerMatchStat.create({
        data: {
          playerId,
          matchId,
          goals: goals || 0,
          assists: assists || 0,
        },
        include: {
          player: true,
          match: true,
        },
      });
    });

    // Decrypt player names before returning
    const statWithDecryptedNames = {
      ...stat,
      player: stat.player
        ? {
            ...stat.player,
            name: EncryptionService.decrypt(stat.player.name),
          }
        : null,
    };

    return NextResponse.json(statWithDecryptedNames, { status: 201 });
  } catch (error) {
    console.error("Error creating player match stat:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Player match stat already exists for this player and match" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create player match stat" },
      { status: 500 }
    );
  }
}
