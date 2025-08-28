"use client";

import React from "react";
import { Match } from "../types";

interface MatchHistoryProps {
  matches: Match[];
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ matches }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Match History
      </h2>
      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-800">
                  vs {match.opponent}
                </h3>
                <p className="text-sm text-gray-600">{match.date}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  <span
                    className={
                      match.goalsFor > match.goalsAgainst
                        ? "text-green-600"
                        : match.goalsFor === match.goalsAgainst
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {match.goalsFor} - {match.goalsAgainst}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {match.goalsFor > match.goalsAgainst
                    ? "WIN"
                    : match.goalsFor === match.goalsAgainst
                    ? "DRAW"
                    : "LOSS"}
                </div>
              </div>
            </div>

            {/* Player stats for this match */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Player Performance:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                {match.playerStats
                  .filter((stat) => stat.goals > 0 || stat.assists > 0)
                  .map((stat) => (
                    <div key={stat.playerId}>
                      {stat.playerName}: {stat.goals}G, {stat.assists}A
                    </div>
                  ))}
                {match.playerStats.filter(
                  (stat) => stat.goals > 0 || stat.assists > 0
                ).length === 0 && (
                  <div className="col-span-2 text-gray-500">
                    No goals or assists recorded
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;
