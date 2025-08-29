"use client";

import React, { useState } from "react";
import { Player } from "../types";
import { Users, Play, AlertCircle } from "lucide-react";

interface MatchSetupProps {
  onStartNewMatch: (opponent: string, selectedPlayers: Player[]) => void;
  players: Player[];
}

const MatchSetup: React.FC<MatchSetupProps> = ({
  onStartNewMatch,
  players,
}) => {
  const [newOpponent, setNewOpponent] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateAndStartMatch = () => {
    const validationErrors: string[] = [];

    if (!newOpponent.trim()) {
      validationErrors.push("Please enter an opponent team name");
    }

    if (players.length === 0) {
      validationErrors.push(
        "Please add at least one player to your squad before starting a match"
      );
    }

    if (selectedPlayers.length === 0) {
      validationErrors.push("Please select at least one player for this match");
    }

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      const matchPlayers = players.filter((player) =>
        selectedPlayers.includes(player.id)
      );
      onStartNewMatch(newOpponent.trim(), matchPlayers);
      setNewOpponent("");
      setSelectedPlayers([]);
      setErrors([]);
    }
  };

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const selectAllPlayers = () => {
    setSelectedPlayers(players.map((p) => p.id));
  };

  const clearSelection = () => {
    setSelectedPlayers([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Play className="w-5 h-5 mr-2 text-green-500" />
        Start New Match
      </h2>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Please fix the following issues:
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Opponent Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opponent Team
        </label>
        <input
          type="text"
          value={newOpponent}
          onChange={(e) => setNewOpponent(e.target.value)}
          placeholder="Enter opponent team name"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-700 ${
            errors.some((error) => error.includes("opponent"))
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-green-500"
          }`}
          onKeyPress={(e) => e.key === "Enter" && validateAndStartMatch()}
        />
      </div>

      {/* Player Selection */}
      {players.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Select Squad for this Match ({selectedPlayers.length}/
              {players.length})
            </label>
            <div className="space-x-2">
              <button
                onClick={selectAllPlayers}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-1 gap-2">
              {players.map((player) => (
                <label
                  key={player.id}
                  className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                    selectedPlayers.includes(player.id)
                      ? "bg-green-50 border border-green-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlayers.includes(player.id)}
                    onChange={() => togglePlayerSelection(player.id)}
                    className="mr-3 text-green-500 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">
                      {player.name}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({player.goals}G, {player.assists}A)
                    </span>
                  </div>
                  {selectedPlayers.includes(player.id) && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Start Match Button */}
      <button
        onClick={validateAndStartMatch}
        className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        disabled={players.length === 0}
      >
        <Play className="w-4 h-4" />
        Start Match
      </button>

      {/* Squad Status */}
      <div className="mt-4 flex items-center text-sm text-gray-600">
        <Users className="w-4 h-4 mr-2" />
        Total squad: {players.length} player{players.length !== 1 ? "s" : ""} •
        Selected: {selectedPlayers.length} player
        {selectedPlayers.length !== 1 ? "s" : ""}
        {players.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default MatchSetup;
