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

    // Check if date is in the future
    if (date && new Date(date) < new Date()) {
      validationErrors.push("Match date must be in the future");
    }

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      onScheduleMatch({
        opponent: opponent.trim(),
        date,
        matchType,
        notes: notes.trim() || undefined,
        selectedPlayerIds: selectedPlayers,
      });

      // Reset form
      setOpponent("");
      setDate("");
      setMatchType("league");
      setNotes("");
      setSelectedPlayers([]);
      setErrors([]);
      setIsOpen(false);
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

  const getMinDate = () => {
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
          Schedule New Match
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          Schedule New Match
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

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={validateAndSchedule}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule Match
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
