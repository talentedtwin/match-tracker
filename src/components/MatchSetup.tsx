"use client";

import React, { useState } from "react";
import { Player } from "../types";

interface MatchSetupProps {
  onStartNewMatch: (opponent: string) => void;
  players: Player[];
}

const MatchSetup: React.FC<MatchSetupProps> = ({
  onStartNewMatch,
  players,
}) => {
  const [newOpponent, setNewOpponent] = useState("");
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

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      onStartNewMatch(newOpponent.trim());
      setNewOpponent("");
      setErrors([]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Start New Match
      </h2>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following issues:
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newOpponent}
          onChange={(e) => setNewOpponent(e.target.value)}
          placeholder="Enter opponent team name"
          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-700 ${
            errors.some((error) => error.includes("opponent"))
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-green-500"
          }`}
          onKeyPress={(e) => e.key === "Enter" && validateAndStartMatch()}
        />
        <button
          onClick={validateAndStartMatch}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={players.length === 0}
        >
          ⚽ Start Match
        </button>
      </div>

      {/* Squad Status */}
      <div className="mt-3 text-sm text-gray-600">
        Current squad: {players.length} player
        {players.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default MatchSetup;
