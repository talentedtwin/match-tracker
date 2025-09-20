import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PlayerService } from "@/lib/playerService";
import { ensureUserExists } from "@/lib/user-utils";

// GET /api/players - Get all players for the authenticated user
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

    // Get players for the user
    const players = await PlayerService.getPlayersForUser(userId);

    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

// POST /api/players - Create a new player for the authenticated user
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId: authUserId } = await auth();

    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    await ensureUserExists(authUserId);

    const body = await request.json();
    const { name, teamId } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    // Create player
    const player = await PlayerService.createPlayer(name, authUserId, teamId);

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}
