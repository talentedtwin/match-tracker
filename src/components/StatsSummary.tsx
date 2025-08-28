"use client";

import React from "react";
import { Target, Users, Award } from "lucide-react";
import { Player, Match } from "../types";

interface StatsSummaryProps {
  currentMatch: Match | null;
  players: Player[];
  matches: Match[];
}

const StatsSummary: React.FC<StatsSummaryProps> = ({
  currentMatch,
  players,
  matches,
}) => {
  const getTotalGoals = () =>
    players.reduce((sum, player) => sum + player.goals, 0);
  const getTotalAssists = () =>
    players.reduce((sum, player) => sum + player.assists, 0);

  const getOverallStats = () => {
    const totalMatches = matches.length;
    const wins = matches.filter((m) => m.goalsFor > m.goalsAgainst).length;
    const draws = matches.filter((m) => m.goalsFor === m.goalsAgainst).length;
    const losses = matches.filter((m) => m.goalsFor < m.goalsAgainst).length;

    return { totalMatches, wins, draws, losses };
  };

  const stats = getOverallStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <Target className="text-blue-500 mx-auto mb-2" size={32} />
        <div className="text-2xl font-bold text-gray-800">
          {currentMatch ? getTotalGoals() : stats.totalMatches}
        </div>
        <div className="text-sm text-gray-600">
          {currentMatch ? "Match Goals" : "Total Matches"}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <Users className="text-green-500 mx-auto mb-2" size={32} />
        <div className="text-2xl font-bold text-gray-800">
          {currentMatch ? getTotalAssists() : stats.wins}
        </div>
        <div className="text-sm text-gray-600">
          {currentMatch ? "Match Assists" : "Wins"}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <Award className="text-yellow-500 mx-auto mb-2" size={32} />
        <div className="text-2xl font-bold text-gray-800">{stats.draws}</div>
        <div className="text-sm text-gray-600">Draws</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <div className="text-red-500 mx-auto mb-2 text-2xl">❌</div>
        <div className="text-2xl font-bold text-gray-800">{stats.losses}</div>
        <div className="text-sm text-gray-600">Losses</div>
      </div>
    </div>
  );
};

export default StatsSummary;
