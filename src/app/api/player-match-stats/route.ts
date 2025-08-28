import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/player-match-stats - Get all player match stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");
    const playerId = searchParams.get("playerId");

    const where: any = {};
    if (matchId) where.matchId = matchId;
    if (playerId) where.playerId = playerId;

    const stats = await prisma.playerMatchStat.findMany({
      where,
      include: {
        player: true,
        match: true,
      },
      orderBy: { match: { date: "desc" } },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching player match stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch player match stats" },
      { status: 500 }
    );
  }
}

// POST /api/player-match-stats - Create player match stats
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, matchId, goals, assists } = body;

    if (!playerId || !matchId) {
      return NextResponse.json(
        { error: "playerId and matchId are required" },
        { status: 400 }
      );
    }

    const stat = await prisma.playerMatchStat.create({
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

    return NextResponse.json(stat, { status: 201 });
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
