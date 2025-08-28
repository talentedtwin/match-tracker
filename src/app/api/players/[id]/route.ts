import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/players/[id] - Get a specific player
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        matchStats: {
          include: {
            match: true,
          },
        },
      },
    });

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json(
      { error: "Failed to fetch player" },
      { status: 500 }
    );
  }
}

// PUT /api/players/[id] - Update a player
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, goals, assists } = body;

    const player = await prisma.player.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(goals !== undefined && { goals }),
        ...(assists !== undefined && { assists }),
      },
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error("Error updating player:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update player" },
      { status: 500 }
    );
  }
}

// DELETE /api/players/[id] - Delete a player
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.player.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 }
    );
  }
}
