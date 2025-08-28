"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";
import { Player } from "../types";

interface PlayerStatsProps {
  players: Player[];
  onUpdatePlayerStat: (
    playerId: string,
    stat: "goals" | "assists",
    increment: number
  ) => void;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({
  players,
  onUpdatePlayerStat,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Player Stats (Current Match)
      </h2>
      {players.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No players added yet</p>
      ) : (
        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{player.name}</h3>
              </div>

              <div className="flex items-center gap-6">
                {/* Goals */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-12">Goals:</span>
                  <button
                    onClick={() => onUpdatePlayerStat(player.id, "goals", -1)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-gray-700 font-medium">
                    {player.goals}
                  </span>
                  <button
                    onClick={() => onUpdatePlayerStat(player.id, "goals", 1)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-1"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Assists */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-12">Assists:</span>
                  <button
                    onClick={() => onUpdatePlayerStat(player.id, "assists", -1)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium text-gray-700">
                    {player.assists}
                  </span>
                  <button
                    onClick={() => onUpdatePlayerStat(player.id, "assists", 1)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-1"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
