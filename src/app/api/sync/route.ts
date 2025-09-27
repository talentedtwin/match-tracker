import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Lazy initialize Prisma to avoid build-time issues
let prismaInstance: import("@prisma/client").PrismaClient | null = null;

const getPrisma = async () => {
  if (!prismaInstance) {
    const { PrismaClient } = await import("@prisma/client");
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
};

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { operations } = await request.json();

    if (!operations || !Array.isArray(operations)) {
      return NextResponse.json(
        { error: "Invalid operations data" },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();
    const results = [];
    const errors = [];

    // Process each operation in sequence to maintain data consistency
    for (const operation of operations) {
      try {
        const { id, type, data, timestamp } = operation;

        switch (type) {
          case "match-create":
            const newMatch = await prisma.match.create({
              data: {
                ...data,
                userId,
                createdAt: new Date(timestamp),
              },
            });
            results.push({ id, success: true, result: newMatch });
            break;

          case "match-update":
            const updatedMatch = await prisma.match.update({
              where: {
                id: data.id,
                userId, // Ensure user owns this match
              },
              data: {
                ...data,
                updatedAt: new Date(timestamp),
              },
            });
            results.push({ id, success: true, result: updatedMatch });
            break;

          case "player-stats-update":
            // Handle player stats updates
            const { matchId, playerStats } = data;

            // Delete existing stats for this match
            await prisma.playerMatchStats.deleteMany({
              where: { matchId },
            });

            // Create new stats
            const statsPromises = playerStats.map(
              (stats: { playerId: string; goals: number; assists: number }) =>
                prisma.playerMatchStats.create({
                  data: {
                    ...stats,
                    matchId,
                    createdAt: new Date(timestamp),
                  },
                })
            );

            const newStats = await Promise.all(statsPromises);
            results.push({ id, success: true, result: newStats });
            break;

          default:
            errors.push({ id, error: `Unknown operation type: ${type}` });
        }
      } catch (error) {
        console.error(`Sync operation failed for ${operation.id}:`, error);
        errors.push({
          id: operation.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Update last sync timestamp
    const lastSync = Date.now();

    return NextResponse.json({
      success: true,
      results,
      errors,
      lastSync,
      processedCount: operations.length,
    });
  } catch (error) {
    console.error("Sync endpoint error:", error);
    return NextResponse.json(
      {
        error: "Failed to process sync operations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get sync status and pending operations count
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = await getPrisma();

    // Get recent matches for conflict detection
    const recentMatches = await prisma.match.findMany({
      where: {
        userId,
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      lastServerSync: Date.now(),
      recentMatches,
    });
  } catch (error) {
    console.error("Sync status error:", error);
    return NextResponse.json(
      { error: "Failed to get sync status" },
      { status: 500 }
    );
  }
}
