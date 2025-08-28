"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Player } from "../types";

interface SquadManagementProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
}

const SquadManagement: React.FC<SquadManagementProps> = ({
  players,
  onAddPlayer,
  onRemovePlayer,
}) => {
  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Squad Management
      </h2>

      {/* Add Player */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Add New Player
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && addPlayer()}
          />
          <button
            onClick={addPlayer}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Squad List */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Current Squad
        </h3>
        {players.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No players in squad yet
          </p>
        ) : (
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{player.name}</h4>
                </div>
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="text-red-500 hover:text-red-700 px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SquadManagement;
