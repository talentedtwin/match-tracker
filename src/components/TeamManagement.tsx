"use client";

import React, { useState } from "react";
import { Plus, Users, Edit2, Trash2, Crown, AlertCircle } from "lucide-react";
import { Team, Player } from "../types";

interface TeamManagementProps {
  teams: Team[];
  players: Player[];
  isPremium: boolean;
  onAddTeam: (name: string) => Promise<void>;
  onUpdateTeam: (id: string, name: string) => Promise<void>;
  onRemoveTeam: (id: string) => Promise<void>;
  onAddPlayer: (name: string, teamId?: string) => Promise<void>;
  onRemovePlayer: (id: string) => Promise<void>;
  onAssignPlayerToTeam: (
    playerId: string,
    teamId: string | null
  ) => Promise<void>;
}

const TeamManagement: React.FC<TeamManagementProps> = ({
  teams,
  players,
  isPremium,
  onAddTeam,
  onUpdateTeam,
  onRemoveTeam,
  onAddPlayer,
  onRemovePlayer,
  onAssignPlayerToTeam,
}) => {
  const [newTeamName, setNewTeamName] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] =
    useState<string>("");
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editTeamName, setEditTeamName] = useState("");
  const [showPremiumWarning, setShowPremiumWarning] = useState(false);

  const addTeam = async () => {
    if (newTeamName.trim()) {
      // Check if user can add more teams
      if (teams.length >= 1 && !isPremium) {
        setShowPremiumWarning(true);
        return;
      }

      try {
        await onAddTeam(newTeamName.trim());
        setNewTeamName("");
        setShowPremiumWarning(false);
      } catch (error) {
        console.error("Failed to add team:", error);
      }
    }
  };

  const addPlayer = async () => {
    if (newPlayerName.trim()) {
      try {
        await onAddPlayer(
          newPlayerName.trim(),
          selectedTeamForPlayer || undefined
        );
        setNewPlayerName("");
        setSelectedTeamForPlayer("");
      } catch (error) {
        console.error("Failed to add player:", error);
      }
    }
  };

  const startEditingTeam = (team: Team) => {
    setEditingTeam(team.id);
    setEditTeamName(team.name);
  };

  const saveTeamEdit = async () => {
    if (editingTeam && editTeamName.trim()) {
      try {
        await onUpdateTeam(editingTeam, editTeamName.trim());
        setEditingTeam(null);
        setEditTeamName("");
      } catch (error) {
        console.error("Failed to update team:", error);
      }
    }
  };

  const cancelTeamEdit = () => {
    setEditingTeam(null);
    setEditTeamName("");
  };

  const unassignedPlayers = players.filter((player) => !player.teamId);

  return (
    <div className="space-y-6">
      {/* Premium Warning Modal */}
      {showPremiumWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <Crown className="w-8 h-8 text-yellow-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                Premium Feature
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Multiple teams are only available with a premium subscription.
              Free users can manage one team with unlimited players.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPremiumWarning(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Continue with Free
              </button>
              <button
                onClick={() => {
                  setShowPremiumWarning(false);
                  // TODO: Implement premium upgrade flow
                }}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Team */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          Team Management
        </h2>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Create New Team
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Enter team name"
              className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && addTeam()}
            />
            <button
              onClick={addTeam}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Add Team
            </button>
          </div>

          {teams.length >= 1 && !isPremium && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-700">
                  You&apos;ve reached the free limit of 1 team.
                  <button
                    onClick={() => setShowPremiumWarning(true)}
                    className="ml-1 underline hover:text-yellow-800"
                  >
                    Upgrade to Premium
                  </button>{" "}
                  for unlimited teams.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Existing Teams */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Your Teams ({teams.length})
          </h3>
          {teams.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No teams created yet. Create your first team above!
            </p>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex-1">
                    {editingTeam === team.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editTeamName}
                          onChange={(e) => setEditTeamName(e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded"
                          onKeyPress={(e) =>
                            e.key === "Enter" && saveTeamEdit()
                          }
                        />
                        <button
                          onClick={saveTeamEdit}
                          className="text-green-600 hover:text-green-700 px-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelTeamEdit}
                          className="text-gray-600 hover:text-gray-700 px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {team.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {players.filter((p) => p.teamId === team.id).length}{" "}
                          players
                        </p>
                      </div>
                    )}
                  </div>

                  {editingTeam !== team.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditingTeam(team)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit team"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onRemoveTeam(team.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete team"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add New Player */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Add New Player
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && addPlayer()}
          />

          <select
            value={selectedTeamForPlayer}
            onChange={(e) => setSelectedTeamForPlayer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No team (unassigned)</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <button
            onClick={addPlayer}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Player
          </button>
        </div>
      </div>

      {/* Players by Team */}
      {teams.map((team) => {
        const teamPlayers = players.filter((p) => p.teamId === team.id);
        return (
          <div key={team.id} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              {team.name} Players ({teamPlayers.length})
            </h3>
            {teamPlayers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No players assigned to this team yet
              </p>
            ) : (
              <div className="space-y-2">
                {teamPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {player.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {player.goals} goals, {player.assists} assists
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={player.teamId || ""}
                        onChange={(e) =>
                          onAssignPlayerToTeam(
                            player.id,
                            e.target.value || null
                          )
                        }
                        className="text-sm px-2 py-1 border border-gray-300 text-gray-700 rounded"
                      >
                        <option value="">No team</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => onRemovePlayer(player.id)}
                        className="text-red-500 hover:text-red-700 px-3 py-1 rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Unassigned Players */}
      {unassignedPlayers.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Unassigned Players ({unassignedPlayers.length})
          </h3>
          <div className="space-y-2">
            {unassignedPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{player.name}</h4>
                  <p className="text-sm text-gray-600">
                    {player.goals} goals, {player.assists} assists
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value=""
                    onChange={(e) =>
                      onAssignPlayerToTeam(player.id, e.target.value || null)
                    }
                    className="text-sm px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="">Assign to team...</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="text-red-500 hover:text-red-700 px-3 py-1 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
