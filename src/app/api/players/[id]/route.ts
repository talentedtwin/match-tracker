import { NextRequest, NextResponse } from "next/server";
import { PlayerService } from "@/lib/playerService";

// GET /api/players/[id] - Get a specific player with decrypted name
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const player = await PlayerService.getPlayer(id);

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

// PUT /api/players/[id] - Update a player with encryption
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, goals, assists } = body;

    const updateData: Partial<{
      name: string;
      goals: number;
      assists: number;
    }> = {};
    if (name !== undefined) updateData.name = name;
    if (goals !== undefined) updateData.goals = goals;
    if (assists !== undefined) updateData.assists = assists;

    const player = await PlayerService.updatePlayer(id, updateData);
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

// DELETE /api/players/[id] - Delete a player (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await PlayerService.deletePlayer(id);

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
