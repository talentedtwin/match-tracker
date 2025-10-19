"use client";

import React, { useState } from "react";
import { Player } from "../types";
import { Calendar, Users, Trophy, Target, Plus, X } from "lucide-react";

interface MatchSchedulerProps {
  onScheduleMatch: (matchData: {
    opponent: string;
    date: string;
    matchType: "league" | "cup";
    notes?: string;
    selectedPlayerIds: string[];
    isFinished?: boolean;
    goalsFor?: number;
    goalsAgainst?: number;
    playerStats?: Array<{
      playerId: string;
      goals?: number;
      assists?: number;
    }>;
  }) => void;
  players: Player[];
}

const MatchScheduler: React.FC<MatchSchedulerProps> = ({
  onScheduleMatch,
  players,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [opponent, setOpponent] = useState("");
  const [date, setDate] = useState("");
  const [matchType, setMatchType] = useState<"league" | "cup">("league");
  const [notes, setNotes] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [goalsFor, setGoalsFor] = useState<number | "">("");
  const [goalsAgainst, setGoalsAgainst] = useState<number | "">("");
  const [playerStats, setPlayerStats] = useState<
    Record<string, { goals: number; assists: number }>
  >({});
  const [errors, setErrors] = useState<string[]>([]);

  const validateAndSchedule = () => {
    const validationErrors: string[] = [];

    if (!opponent.trim()) {
      validationErrors.push("Please enter an opponent team name");
    }

    if (!date) {
      validationErrors.push("Please select a match date");
    }

    if (players.length === 0) {
      validationErrors.push(
        "Please add at least one player to your squad before scheduling a match"
      );
    }

    if (selectedPlayers.length === 0) {
      validationErrors.push("Please select at least one player for this match");
    }

    // Check if date is in the future for scheduled matches
    if (date && new Date(date) < new Date() && !isFinished) {
      validationErrors.push(
        "Match date must be in the future for scheduled matches"
      );
    }

    // Validate goals for finished matches
    if (isFinished) {
      if (goalsFor === "" || goalsFor < 0) {
        validationErrors.push("Please enter valid goals scored (0 or more)");
      }
      if (goalsAgainst === "" || goalsAgainst < 0) {
        validationErrors.push("Please enter valid goals conceded (0 or more)");
      }

      // Validate player goals don't exceed team total
      if (selectedPlayers.length > 0 && goalsFor !== "") {
        const totalPlayerGoals = selectedPlayers.reduce((total, playerId) => {
          return total + (playerStats[playerId]?.goals || 0);
        }, 0);

        if (totalPlayerGoals > Number(goalsFor)) {
          validationErrors.push(
            `Total player goals (${totalPlayerGoals}) cannot exceed team goals (${goalsFor})`
          );
        }
      }
    }

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      const playerStatsArray = isFinished
        ? selectedPlayers.map((playerId) => ({
            playerId,
            goals: playerStats[playerId]?.goals || 0,
            assists: playerStats[playerId]?.assists || 0,
          }))
        : undefined;

      onScheduleMatch({
        opponent: opponent.trim(),
        date,
        matchType,
        notes: notes.trim() || undefined,
        selectedPlayerIds: selectedPlayers,
        isFinished,
        goalsFor: isFinished ? Number(goalsFor) : undefined,
        goalsAgainst: isFinished ? Number(goalsAgainst) : undefined,
        playerStats: playerStatsArray,
      });

      // Reset form
      setOpponent("");
      setDate("");
      setMatchType("league");
      setNotes("");
      setSelectedPlayers([]);
      setIsFinished(false);
      setGoalsFor("");
      setGoalsAgainst("");
      setPlayerStats({});
      setErrors([]);
      setIsOpen(false);
    }
  };

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers((prev) => {
      const newSelection = prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId];

      // Initialize or remove player stats based on selection
      setPlayerStats((prevStats) => {
        const newStats = { ...prevStats };
        if (newSelection.includes(playerId) && !prevStats[playerId]) {
          newStats[playerId] = { goals: 0, assists: 0 };
        } else if (!newSelection.includes(playerId)) {
          delete newStats[playerId];
        }
        return newStats;
      });

      return newSelection;
    });
  };

  const updatePlayerStats = (
    playerId: string,
    field: "goals" | "assists",
    value: number
  ) => {
    setPlayerStats((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: Math.max(0, value),
      },
    }));
  };

  const selectAllPlayers = () => {
    const allPlayerIds = players.map((p) => p.id);
    setSelectedPlayers(allPlayerIds);

    // Initialize stats for all players
    const newStats: Record<string, { goals: number; assists: number }> = {};
    allPlayerIds.forEach((id) => {
      newStats[id] = { goals: 0, assists: 0 };
    });
    setPlayerStats(newStats);
  };

  const clearSelection = () => {
    setSelectedPlayers([]);
    setPlayerStats({});
  };

  const getMinDate = () => {
    if (isFinished) {
      // Allow any past date for historic matches
      return "2020-01-01";
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (!isOpen) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Match
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          Add Match
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-600 mb-2">
            <Target className="w-4 h-4 mr-2" />
            <span className="font-medium">
              Please fix the following issues:
            </span>
          </div>
          <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {/* Opponent and Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opponent Team
            </label>
            <input
              type="text"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="Enter opponent team name"
              className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getMinDate()}
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Match Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Match Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center text-gray-700">
              <input
                type="radio"
                value="league"
                checked={matchType === "league"}
                onChange={(e) =>
                  setMatchType(e.target.value as "league" | "cup")
                }
                className="mr-2"
              />
              <Trophy className="w-4 h-4 mr-1 text-blue-500" />
              League Match
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="radio"
                value="cup"
                checked={matchType === "cup"}
                onChange={(e) =>
                  setMatchType(e.target.value as "league" | "cup")
                }
                className="mr-2"
              />
              <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
              Cup Match
            </label>
          </div>
        </div>

        {/* Match Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Match Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center text-gray-700">
              <input
                type="radio"
                value="scheduled"
                checked={!isFinished}
                onChange={() => setIsFinished(false)}
                className="mr-2"
              />
              <Calendar className="w-4 h-4 mr-1 text-blue-500" />
              Scheduled Match
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="radio"
                value="finished"
                checked={isFinished}
                onChange={() => setIsFinished(true)}
                className="mr-2"
              />
              <Target className="w-4 h-4 mr-1 text-green-500" />
              Historic Match (Finished)
            </label>
          </div>
        </div>

        {/* Goals (only show for finished matches) */}
        {isFinished && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goals Scored
              </label>
              <input
                type="number"
                value={goalsFor}
                onChange={(e) =>
                  setGoalsFor(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goals Conceded
              </label>
              <input
                type="number"
                value={goalsAgainst}
                onChange={(e) =>
                  setGoalsAgainst(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Match Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this match..."
            rows={3}
            className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Player Selection */}
        {players.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Players for Match
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllPlayers}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
              {players.map((player) => (
                <label
                  key={player.id}
                  className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlayers.includes(player.id)}
                    onChange={() => togglePlayerSelection(player.id)}
                    className="mr-3"
                  />
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {player.name}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">
                    {player.goals}G {player.assists}A
                  </span>
                </label>
              ))}
            </div>

            {selectedPlayers.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {selectedPlayers.length} player
                {selectedPlayers.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>
        )}

        {/* Player Stats (only show for finished matches with selected players) */}
        {isFinished && selectedPlayers.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2 text-blue-500" />
              Player Performance
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedPlayers.map((playerId) => {
                const player = players.find((p) => p.id === playerId);
                if (!player) return null;

                const stats = playerStats[playerId] || { goals: 0, assists: 0 };

                return (
                  <div
                    key={playerId}
                    className="bg-white rounded-lg p-3 border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">
                        {player.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Goals
                        </label>
                        <input
                          type="number"
                          value={stats.goals}
                          onChange={(e) =>
                            updatePlayerStats(
                              playerId,
                              "goals",
                              Number(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          min="0"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Assists
                        </label>
                        <input
                          type="number"
                          value={stats.assists}
                          onChange={(e) =>
                            updatePlayerStats(
                              playerId,
                              "assists",
                              Number(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          min="0"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              Add individual goals and assists for each player in this match
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={validateAndSchedule}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-white ${
              isFinished
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isFinished ? (
              <>
                <Target className="w-4 h-4" />
                Add Historic Match
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                Schedule Match
              </>
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchScheduler;
