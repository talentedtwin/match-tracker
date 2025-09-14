"use client";

import React from "react";
import { usePlayers } from "../../hooks/useApi";
import SquadManagement from "../../components/SquadManagement";
import { PlayerManagementSkeleton } from "../../components/Skeleton";
import { User, Trophy, Target, Calendar } from "lucide-react";

const PlayersPage = () => {
  const {
    players,
    loading: playersLoading,
    error: playersError,
    addPlayer,
    removePlayer,
  } = usePlayers();

  // Show loading state
  if (playersLoading) {
    return <PlayerManagementSkeleton />;
  }

  // Show error state
  if (playersError) {
    return (
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error</h2>
            <p className="text-red-700">{playersError}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddPlayer = async (name: string) => {
    try {
      await addPlayer(name);
    } catch (error) {
      console.error("Failed to add player:", error);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      await removePlayer(playerId);
    } catch (error) {
      console.error("Failed to remove player:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            👥 Squad Management
          </h1>
          <p className="text-center text-gray-600">
            Manage your team roster and player information
          </p>
        </div>

        {/* Squad Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Players</p>
                <p className="text-2xl font-bold text-gray-800">
                  {players.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-800">
                  {players.reduce((sum, player) => sum + player.goals, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Assists</p>
                <p className="text-2xl font-bold text-gray-800">
                  {players.reduce((sum, player) => sum + player.assists, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Squad Size</p>
                <p className="text-2xl font-bold text-gray-800">
                  {players.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Squad Management Component */}
        <SquadManagement
          players={players}
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
        />

        {/* Player Statistics Table */}
        {players.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Player Statistics
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-gray-600 font-medium">Player</th>
                    <th className="pb-3 text-gray-600 font-medium text-center">
                      Goals
                    </th>
                    <th className="pb-3 text-gray-600 font-medium text-center">
                      Assists
                    </th>
                    <th className="pb-3 text-gray-600 font-medium text-center">
                      Total Points
                    </th>
                    <th className="pb-3 text-gray-600 font-medium text-center">
                      Goals per Game
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players
                    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))
                    .map((player, index) => (
                      <tr
                        key={player.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 font-semibold text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">
                              {player.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {player.goals}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {player.assists}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-semibold text-gray-800">
                            {player.goals + player.assists}
                          </span>
                        </td>
                        <td className="py-3 text-center text-gray-600">
                          {/* This would need match data to calculate properly */}
                          <span className="text-sm">-</span>
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

export default PlayersPage;
