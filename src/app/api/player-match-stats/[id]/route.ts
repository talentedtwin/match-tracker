import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/player-match-stats/[id] - Get a specific player match stat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stat = await prisma.playerMatchStat.findUnique({
      where: { id },
      include: {
        player: true,
        match: true,
      },
    });

    if (!stat) {
      return NextResponse.json(
        { error: "Player match stat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error fetching player match stat:", error);
    return NextResponse.json(
      { error: "Failed to fetch player match stat" },
      { status: 500 }
    );
  }
}

// PUT /api/player-match-stats/[id] - Update a player match stat
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { goals, assists } = body;

    const stat = await prisma.playerMatchStat.update({
      where: { id },
      data: {
        ...(goals !== undefined && { goals }),
        ...(assists !== undefined && { assists }),
      },
      include: {
        player: true,
        match: true,
      },
    });

    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error updating player match stat:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Player match stat not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update player match stat" },
      { status: 500 }
    );
  }
}

// DELETE /api/player-match-stats/[id] - Delete a player match stat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.playerMatchStat.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Player match stat deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting player match stat:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Player match stat not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete player match stat" },
      { status: 500 }
    );
  }
}
