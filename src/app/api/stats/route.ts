import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stats - Get overall statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Get all matches for the user
    const matches = await prisma.match.findMany({
      where: { userId },
      include: {
        playerStats: {
          include: {
            player: true,
          },
        },
      },
    });

    // Calculate statistics
    const totalMatches = matches.length;
    const wins = matches.filter((m) => m.goalsFor > m.goalsAgainst).length;
    const draws = matches.filter((m) => m.goalsFor === m.goalsAgainst).length;
    const losses = matches.filter((m) => m.goalsFor < m.goalsAgainst).length;

    // Get all players for the user
    const players = await prisma.player.findMany({
      where: { userId },
    });

    // Calculate player statistics
    const playerStats = await Promise.all(
      players.map(async (player) => {
        const playerMatchStats = await prisma.playerMatchStat.findMany({
          where: { playerId: player.id },
        });

        const totalGoals = playerMatchStats.reduce(
          (sum, stat) => sum + stat.goals,
          0
        );
        const totalAssists = playerMatchStats.reduce(
          (sum, stat) => sum + stat.assists,
          0
        );
        const matchesPlayed = playerMatchStats.length;

        return {
          playerId: player.id,
          playerName: player.name,
          totalGoals,
          totalAssists,
          matchesPlayed,
          goalsPerMatch:
            matchesPlayed > 0
              ? (totalGoals / matchesPlayed).toFixed(2)
              : "0.00",
          assistsPerMatch:
            matchesPlayed > 0
              ? (totalAssists / matchesPlayed).toFixed(2)
              : "0.00",
        };
      })
    );

    // Get top performers
    const topScorers = [...playerStats]
      .sort((a, b) => b.totalGoals - a.totalGoals)
      .slice(0, 5);

    const topAssists = [...playerStats]
      .sort((a, b) => b.totalAssists - a.totalAssists)
      .slice(0, 5);

    const stats = {
      overview: {
        totalMatches,
        wins,
        draws,
        losses,
        winRate:
          totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : "0.0",
      },
      players: {
        total: players.length,
        stats: playerStats,
      },
      topPerformers: {
        scorers: topScorers,
        assists: topAssists,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
