"use client";

import React from "react";
import { usePlayers } from "../../hooks/useApi";
import { useMatches } from "../../hooks/useApi";
import { StatsPageSkeleton } from "../../components/Skeleton";
import { TrendingUp, Users, Target, Award, BarChart3 } from "lucide-react";

const StatsPage: React.FC = () => {
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = usePlayers();
  const {
    matches,
    loading: matchesLoading,
    error: matchesError,
  } = useMatches();

  const loading = playersLoading || matchesLoading;
  const error = playersError || matchesError;

  // Calculate team statistics
  const teamStats = React.useMemo(() => {
    if (!matches || matches.length === 0) {
      return {
        totalMatches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        winPercentage: 0,
        avgGoalsFor: 0,
        avgGoalsAgainst: 0,
      };
    }

    // Filter to only include finished matches
    const finishedMatches = matches.filter((match) => match.isFinished);
    const totalMatches = finishedMatches.length;

    if (totalMatches === 0) {
      return {
        totalMatches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        winPercentage: 0,
        avgGoalsFor: 0,
        avgGoalsAgainst: 0,
      };
    }

    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    finishedMatches.forEach((match) => {
      goalsFor += match.goalsFor;
      goalsAgainst += match.goalsAgainst;

      if (match.goalsFor > match.goalsAgainst) {
        wins++;
      } else if (match.goalsFor === match.goalsAgainst) {
        draws++;
      } else {
        losses++;
      }
    });

    const goalDifference = goalsFor - goalsAgainst;
    const winPercentage = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
    const avgGoalsFor = totalMatches > 0 ? goalsFor / totalMatches : 0;
    const avgGoalsAgainst = totalMatches > 0 ? goalsAgainst / totalMatches : 0;

    return {
      totalMatches,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference,
      winPercentage,
      avgGoalsFor,
      avgGoalsAgainst,
    };
  }, [matches]);

  // Calculate player statistics
  const playerStats = React.useMemo(() => {
    if (!players || !matches || matches.length === 0) {
      return [];
    }

    // Filter to only include finished matches
    const finishedMatches = matches.filter((match) => match.isFinished);

    return players
      .map((player) => {
        let totalGoals = 0;
        let totalAssists = 0;
        let matchesPlayed = 0;

        finishedMatches.forEach((match) => {
          // Check if player was in the squad for this match
          if (
            match.selectedPlayerIds &&
            match.selectedPlayerIds.includes(player.id)
          ) {
            matchesPlayed++;

            // Add goals and assists if the player has stats for this match
            const playerStat = match.playerStats?.find(
              (stat) => stat.playerId === player.id
            );
            if (playerStat) {
              totalGoals += playerStat.goals || 0;
              totalAssists += playerStat.assists || 0;
            }
          }
        });

        return {
          ...player,
          totalGoals,
          totalAssists,
          matchesPlayed,
          avgGoalsPerMatch: matchesPlayed > 0 ? totalGoals / matchesPlayed : 0,
          avgAssistsPerMatch:
            matchesPlayed > 0 ? totalAssists / matchesPlayed : 0,
        };
      })
      .sort((a, b) => b.totalGoals - a.totalGoals);
  }, [players, matches]);

  if (loading) {
    return <StatsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">
              Error Loading Statistics
            </div>
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (teamStats.totalMatches === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-500" />
            Team Statistics
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Statistics Available
            </h3>
            <p className="text-gray-500 mb-6">
              Play some matches to see your team statistics and performance
              analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-blue-500" />
          Team Statistics
        </h1>

        {/* Team Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Matches
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {teamStats.totalMatches}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Win Rate
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {teamStats.winPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Goals Scored
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {teamStats.goalsFor}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Goal Difference
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    teamStats.goalDifference >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {teamStats.goalDifference > 0 ? "+" : ""}
                  {teamStats.goalDifference}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  teamStats.goalDifference >= 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <TrendingUp
                  className={`w-6 h-6 ${
                    teamStats.goalDifference >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Match Record */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Match Record
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {teamStats.wins}
              </div>
              <div className="text-sm text-gray-500">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {teamStats.draws}
              </div>
              <div className="text-sm text-gray-500">Draws</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {teamStats.losses}
              </div>
              <div className="text-sm text-gray-500">Losses</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Average Goals Scored
              </h3>
              <div className="text-2xl font-bold text-blue-600">
                {teamStats.avgGoalsFor.toFixed(1)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Average Goals Conceded
              </h3>
              <div className="text-2xl font-bold text-red-600">
                {teamStats.avgGoalsAgainst.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Top Players */}
        {playerStats.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Top Performers
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Player
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">
                      Matches
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">
                      Goals
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">
                      Assists
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">
                      Avg Goals
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">
                      Avg Assists
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.slice(0, 10).map((player) => (
                    <tr
                      key={player.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">
                          {player.name}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">
                        {player.matchesPlayed}
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {player.totalGoals}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {player.totalAssists}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">
                        {player.avgGoalsPerMatch.toFixed(1)}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">
                        {player.avgAssistsPerMatch.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
