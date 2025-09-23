"use client";

import React, { Suspense, lazy } from "react";
import { usePlayers, useTeams } from "../../hooks/useApi";
import { PlayerManagementSkeleton } from "../../components/Skeleton";
import { Users, Crown, Target, Trophy } from "lucide-react";

// Lazy load the heavy TeamManagement component
const TeamManagement = lazy(() => import("../../components/TeamManagement"));

const TeamManagementPage = () => {
  const {
    players,
    loading: playersLoading,
    error: playersError,
    addPlayer,
    removePlayer,
    updatePlayer,
  } = usePlayers();

  const {
    teams,
    loading: teamsLoading,
    error: teamsError,
    addTeam,
    updateTeam,
    removeTeam,
  } = useTeams();

  const loading = playersLoading || teamsLoading;
  const error = playersError || teamsError;

  // Mock premium status - in real app, this would come from user subscription data
  const isPremium = false; // TODO: Replace with actual premium status from user data

  // Show loading state
  if (loading) {
    return <PlayerManagementSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddTeam = async (name: string) => {
    try {
      await addTeam(name);
    } catch (error) {
      console.error("Failed to add team:", error);
    }
  };

  const handleUpdateTeam = async (id: string, name: string) => {
    try {
      await updateTeam(id, { name });
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };

  const handleRemoveTeam = async (id: string) => {
    try {
      await removeTeam(id);
    } catch (error) {
      console.error("Failed to remove team:", error);
    }
  };

  const handleAddPlayer = async (name: string, teamId?: string) => {
    try {
      await addPlayer(name, teamId);
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

  const handleAssignPlayerToTeam = async (
    playerId: string,
    teamId: string | null
  ) => {
    try {
      await updatePlayer(playerId, { teamId: teamId || undefined });
    } catch (error) {
      console.error("Failed to assign player to team:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                <Users className="w-8 h-8 mr-3 text-blue-500" />
                Team Management
              </h1>
              <p className="text-gray-600">
                Manage your teams and assign players to create organized squads
              </p>
            </div>
            {!isPremium && (
              <div className="text-right">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 mb-2">
                  <Crown className="w-4 h-4 mr-1" />
                  Free Plan
                </div>
                <p className="text-xs text-gray-500">1 team limit</p>
              </div>
            )}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Teams Created</p>
                <p className="text-2xl font-bold text-gray-800">
                  {teams.length}
                  {!isPremium && (
                    <span className="text-sm text-gray-500"> / 1</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-500 mr-3" />
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
              <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-800">
                  {players.reduce((sum, player) => sum + player.goals, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Management Component */}
        <Suspense fallback={<PlayerManagementSkeleton />}>
          <TeamManagement
            teams={teams}
            players={players}
            isPremium={isPremium}
            onAddTeam={handleAddTeam}
            onUpdateTeam={handleUpdateTeam}
            onRemoveTeam={handleRemoveTeam}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            onAssignPlayerToTeam={handleAssignPlayerToTeam}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default TeamManagementPage;
