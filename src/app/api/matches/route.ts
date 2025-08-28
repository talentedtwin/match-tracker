import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PlayerStatInput {
  playerId: string;
  goals?: number;
  assists?: number;
}

// GET /api/matches - Get all matches
export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        playerStats: {
          include: {
            player: true,
          },
        },
      },
      orderBy: { date: "desc" },
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

// POST /api/matches - Create a new match
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { opponent, date, goalsFor, goalsAgainst, userId, playerStats } =
      body;

    if (!opponent || !userId) {
      return NextResponse.json(
        { error: "Opponent and userId are required" },
        { status: 400 }
      );
    }

    const match = await prisma.match.create({
      data: {
        opponent,
        date: date ? new Date(date) : new Date(),
        goalsFor: goalsFor || 0,
        goalsAgainst: goalsAgainst || 0,
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

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    );
  }
}
