import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { withDatabaseUserContext } from "@/lib/db-utils";

// GET /api/stats - Get overall statistics for authenticated user
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

    // Use RLS context to ensure users only see their own data
    const statsData = await withDatabaseUserContext(userId, async () => {
      // Get all matches for the user
      const matches = await prisma.match.findMany({
        include: {
          playerStats: {
            include: {
              player: true,
            },
          },
        },
      });

      // Filter to only include finished matches
      const finishedMatches = matches.filter((m) => m.isFinished);

      // Calculate statistics
      const totalMatches = finishedMatches.length;
      const wins = finishedMatches.filter(
        (m) => m.goalsFor > m.goalsAgainst
      ).length;
      const draws = finishedMatches.filter(
        (m) => m.goalsFor === m.goalsAgainst
      ).length;
      const losses = finishedMatches.filter(
        (m) => m.goalsFor < m.goalsAgainst
      ).length;

      // Get all players for the user
      const players = await prisma.player.findMany({});

      // Calculate player statistics
      const playerStats = await Promise.all(
        players.map(async (player) => {
          // Get player match stats for goals/assists
          const playerMatchStats = await prisma.playerMatchStat.findMany({
            where: {
              playerId: player.id,
              match: {
                isFinished: true, // Only include stats from finished matches
              },
            },
            include: {
              match: true,
            },
          });

          const totalGoals = playerMatchStats.reduce(
            (sum, stat) => sum + stat.goals,
            0
          );
          const totalAssists = playerMatchStats.reduce(
            (sum, stat) => sum + stat.assists,
            0
          );

          // Count matches played by checking finished matches where player was in selectedPlayerIds
          const matchesPlayed = finishedMatches.filter((match) =>
            match.selectedPlayerIds.includes(player.id)
          ).length;

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

      return {
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
    });

    return NextResponse.json(statsData);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
