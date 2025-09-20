import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { withDatabaseUserContext } from "@/lib/db-utils";
import { ensureUserExists } from "@/lib/user-utils";

interface PlayerStatInput {
  playerId: string;
  goals?: number;
  assists?: number;
}

// GET /api/matches - Get all matches for the authenticated user
export async function GET() {
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

    // Use RLS context to ensure users only see their own data
    const matches = await withDatabaseUserContext(userId, async () => {
      return await prisma.match.findMany({
        include: {
          playerStats: {
            include: {
              player: true,
            },
          },
        },
        orderBy: { date: "desc" },
      });
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

// POST /api/matches - Create a new match for the authenticated user
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
    const {
      opponent,
      date,
      goalsFor,
      goalsAgainst,
      matchType,
      notes,
      selectedPlayerIds,
      isFinished,
      playerStats,
    } = body;

    // Use RLS context for database operations
    const newMatch = await withDatabaseUserContext(userId, async () => {
      if (!opponent) {
        throw new Error("Opponent is required");
      }

      const match = await prisma.match.create({
        data: {
          opponent,
          date: date ? new Date(date) : new Date(),
          goalsFor: goalsFor || 0,
          goalsAgainst: goalsAgainst || 0,
          matchType: matchType || "league",
          notes: notes || null,
          selectedPlayerIds: selectedPlayerIds || [],
          isFinished: isFinished || false,
          userId,
          playerStats: playerStats
            ? {
                create: playerStats.map((stat: PlayerStatInput) => ({
                  playerId: stat.playerId,
                  goals: stat.goals || 0,
                  assists: stat.assists || 0,
                })),
              }
            : undefined,
        },
        include: {
          playerStats: {
            include: {
              player: true,
            },
          },
        },
      });

      return match;
    });

    return NextResponse.json(newMatch, { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    );
  }
}
