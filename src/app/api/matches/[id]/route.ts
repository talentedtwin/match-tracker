import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PlayerStatInput {
  playerId: string;
  goals?: number;
  assists?: number;
}

// GET /api/matches/[id] - Get a specific match
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        playerStats: {
          include: {
            player: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Error fetching match:", error);
    return NextResponse.json(
      { error: "Failed to fetch match" },
      { status: 500 }
    );
  }
}

// PUT /api/matches/[id] - Update a match
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      opponent,
      date,
      goalsFor,
      goalsAgainst,
      isFinished,
      matchType,
      notes,
      selectedPlayerIds,
      playerStats,
    } = body;

    const match = await prisma.match.update({
      where: { id },
      data: {
        ...(opponent && { opponent }),
        ...(date && { date: new Date(date) }),
        ...(goalsFor !== undefined && { goalsFor }),
        ...(goalsAgainst !== undefined && { goalsAgainst }),
        ...(isFinished !== undefined && { isFinished }),
        ...(matchType && { matchType }),
        ...(notes !== undefined && { notes }),
        ...(selectedPlayerIds && { selectedPlayerIds }),
        ...(playerStats && {
          playerStats: {
            deleteMany: {},
            create: playerStats.map((stat: PlayerStatInput) => ({
              playerId: stat.playerId,
              goals: stat.goals || 0,
              assists: stat.assists || 0,
            })),
          },
        }),
      },
      include: {
        playerStats: {
          include: {
            player: true,
          },
        },
      },
    });

    return NextResponse.json(match);
  } catch (error) {
    console.error("Error updating match:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
}

// DELETE /api/matches/[id] - Delete a match
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.match.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error("Error deleting match:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete match" },
      { status: 500 }
    );
  }
}
