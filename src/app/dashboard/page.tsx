"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import MatchSetup from "../../components/MatchSetup";
import MatchScheduler from "../../components/MatchScheduler";
import ScheduledMatches from "../../components/ScheduledMatches";
import CurrentMatchHeader from "../../components/CurrentMatchHeader";
import TeamScore from "../../components/TeamScore";
import StatsSummary from "../../components/StatsSummary";
import PlayerStats from "../../components/PlayerStats";
import OfflineStatus from "../../components/OfflineStatus";
import CreateTeamPrompt from "../../components/CreateTeamPrompt";
import { DashboardSkeleton } from "../../components/Skeleton";
import { usePlayers, useMatches, useTeams } from "../../hooks/useApi";
import { useOffline } from "../../hooks/useOffline";
import { Player, ScheduledMatch } from "../../types";

const FootballTracker = () => {
  // API-based state management
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = usePlayers();

  const {
    matches,
    loading: matchesLoading,
    error: matchesError,
    addMatch,
    updateMatch,
    removeMatch,
    refetch: refetchMatches,
  } = useMatches();

  const { teams, loading: teamsLoading, error: teamsError } = useTeams();

  // Offline functionality
  const {
    isOnline,
    isSyncing,
    syncStatus,
    pendingCount,
    lastSync,
    syncNow,
    saveOfflineState,
    loadOfflineState,
    addPendingMatch,
  } = useOffline();

  // Local state for current match (not stored in DB until finished)
  const [currentMatch, setCurrentMatch] = useState<{
    id: string;
    opponent: string;
    date: string;
    goalsFor: number;
    goalsAgainst: number;
    isFinished: boolean;
    matchType: "league" | "cup";
    selectedPlayerIds: string[];
    playerStats: Array<{
      playerId: string;
      playerName: string;
      goals: number;
      assists: number;
    }>;
  } | null>(null);

  const [teamScore, setTeamScore] = useState({ for: 0, against: 0 });

  // Load offline state on mount
  useEffect(() => {
    const offlineState = loadOfflineState();
    if (offlineState && offlineState.currentMatch) {
      setCurrentMatch(offlineState.currentMatch);
      setTeamScore(offlineState.teamScore);
    }
  }, [loadOfflineState]);

  // Save offline state whenever current match or score changes
  useEffect(() => {
    if (currentMatch) {
      saveOfflineState({
        currentMatch: {
          id: currentMatch.id,
          opponent: currentMatch.opponent,
          date: currentMatch.date,
          goalsFor: teamScore.for,
          goalsAgainst: teamScore.against,
          isFinished: currentMatch.isFinished,
          matchType: currentMatch.matchType,
          selectedPlayerIds: currentMatch.selectedPlayerIds,
          playerStats: currentMatch.playerStats,
        },
        teamScore: teamScore,
        lastSaved: Date.now(),
      });
    }
  }, [currentMatch, teamScore, saveOfflineState]);

  // Handle updating player stats during a match - memoized to prevent re-renders
  const handleUpdatePlayerStat = useCallback(
    async (playerId: string, stat: "goals" | "assists", increment: number) => {
      if (!currentMatch) return;

      // Update local current match state
      setCurrentMatch((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          playerStats: prev.playerStats.map((playerStat) =>
            playerStat.playerId === playerId
              ? {
                  ...playerStat,
                  [stat]: Math.max(0, playerStat[stat] + increment),
                }
              : playerStat
          ),
        };
      });

      // Automatically update team score when goals are added/removed
      if (stat === "goals") {
        setTeamScore((prev) => ({
          ...prev,
          for: Math.max(0, prev.for + increment),
        }));
      }
    },
    [currentMatch]
  );

  // Handle updating team score
  // Handle team score updates - memoized to prevent re-renders
  const handleUpdateTeamScore = useCallback(
    (type: "for" | "against", increment: number) => {
      setTeamScore((prev) => ({
        ...prev,
        [type]: Math.max(0, prev[type] + increment),
      }));
    },
    []
  );

  // Handle starting a new match
  const handleStartNewMatch = async (
    opponent: string,
    selectedPlayers: Player[]
  ) => {
    if (selectedPlayers.length === 0) {
      alert("Please select at least one player for this match");
      return;
    }

    const matchId = `match-${Date.now()}`;
    const newMatch = {
      id: matchId,
      opponent,
      date: new Date().toISOString(),
      goalsFor: 0,
      goalsAgainst: 0,
      isFinished: false,
      matchType: "league" as const,
      selectedPlayerIds: selectedPlayers.map((p) => p.id),
      playerStats: selectedPlayers.map((player) => ({
        playerId: player.id,
        playerName: player.name,
        goals: 0,
        assists: 0,
      })),
    };

    setCurrentMatch(newMatch);
    setTeamScore({ for: 0, against: 0 });
  };

  // Handle finishing a match
  const handleFinishMatch = async () => {
    if (!currentMatch) return;

    const matchData = {
      goalsFor: teamScore.for,
      goalsAgainst: teamScore.against,
      isFinished: true,
      playerStats: currentMatch.playerStats.map((stat) => ({
        playerId: stat.playerId,
        goals: stat.goals,
        assists: stat.assists,
      })),
    };

    try {
      if (!isOnline) {
        // Save match completion for later sync - pass only the essential data
        addPendingMatch("update", {
          id: currentMatch.id,
          goalsFor: teamScore.for,
          goalsAgainst: teamScore.against,
          isFinished: true,
          playerStats: currentMatch.playerStats.map((stat) => ({
            playerId: stat.playerId,
            goals: stat.goals,
            assists: stat.assists,
          })),
        });

        // Clear local state immediately to show match is "finished"
        setCurrentMatch(null);
        setTeamScore({ for: 0, against: 0 });
        return;
      }

      // Make direct API call to update the match with all data including playerStats
      const response = await fetch(`/api/matches/${currentMatch.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        throw new Error("Failed to finish match");
      }

      // Trigger a refetch of matches to update the UI
      await refetchMatches();

      setCurrentMatch(null);
      setTeamScore({ for: 0, against: 0 });
    } catch (error) {
      console.error("Failed to finish match:", error);

      // If online but API failed, save for later sync
      if (isOnline) {
        addPendingMatch("update", {
          id: currentMatch.id,
          goalsFor: teamScore.for,
          goalsAgainst: teamScore.against,
          isFinished: true,
          playerStats: currentMatch.playerStats.map((stat) => ({
            playerId: stat.playerId,
            goals: stat.goals,
            assists: stat.assists,
          })),
        });

        // Still clear local state to show match is "finished"
        setCurrentMatch(null);
        setTeamScore({ for: 0, against: 0 });
      }
    }
  };

  // Handle scheduling a new match
  const handleScheduleMatch = async (matchData: {
    opponent: string;
    date: string;
    matchType: "league" | "cup";
    notes?: string;
    selectedPlayerIds: string[];
    isFinished?: boolean;
    goalsFor?: number;
    goalsAgainst?: number;
  }) => {
    try {
      await addMatch({
        ...matchData,
        isFinished: matchData.isFinished || false,
        goalsFor: matchData.goalsFor || 0,
        goalsAgainst: matchData.goalsAgainst || 0,
      });
    } catch (error) {
      console.error("Failed to add match:", error);
    }
  };

  // Handle starting a scheduled match
  const handleStartScheduledMatch = (scheduledMatch: ScheduledMatch) => {
    const selectedPlayers = players.filter((player) =>
      scheduledMatch.selectedPlayerIds.includes(player.id)
    );

    // Use the existing scheduled match but mark it as started
    const startedMatch = {
      id: scheduledMatch.id, // Keep the same ID
      opponent: scheduledMatch.opponent,
      date: new Date().toISOString(), // Update to current time when match actually starts
      goalsFor: 0,
      goalsAgainst: 0,
      isFinished: false,
      matchType: scheduledMatch.matchType,
      selectedPlayerIds: scheduledMatch.selectedPlayerIds,
      playerStats: selectedPlayers.map((player) => ({
        playerId: player.id,
        playerName: player.name,
        goals: 0,
        assists: 0,
      })),
    };

    setCurrentMatch(startedMatch);
    setTeamScore({ for: 0, against: 0 });
  };

  // Handle deleting a scheduled match
  const handleDeleteScheduledMatch = async (matchId: string) => {
    try {
      await removeMatch(matchId);
      console.log("Match deleted successfully:", matchId);
    } catch (error) {
      console.error("Failed to delete match:", error);
    }
  };

  // Handle editing a scheduled match
  const handleEditScheduledMatch = async (updatedMatch: ScheduledMatch) => {
    try {
      // Use the updateMatch function from the hook to update local state
      await updateMatch(updatedMatch.id, {
        opponent: updatedMatch.opponent,
        date: updatedMatch.date,
        matchType: updatedMatch.matchType,
        notes: updatedMatch.notes,
        selectedPlayerIds: updatedMatch.selectedPlayerIds,
      });
      console.log("Match updated successfully:", updatedMatch);
    } catch (error) {
      console.error("Failed to update match:", error);
    }
  };

  // Get scheduled matches (not yet started)
  const scheduledMatches: ScheduledMatch[] = useMemo(() => {
    return matches
      .filter((match) => !match.isFinished)
      .map((match) => ({
        id: match.id,
        opponent: match.opponent,
        date: match.date,
        matchType: match.matchType as "league" | "cup",
        notes: match.notes,
        selectedPlayerIds: match.selectedPlayerIds || [],
        isFinished: match.isFinished,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [matches]);

  // Show loading state
  if (playersLoading || matchesLoading || teamsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <DashboardSkeleton />
      </div>
    );
  }

  // Show error state
  if (playersError || matchesError || teamsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error</h2>
            <p className="text-red-700">
              {playersError || matchesError || teamsError}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show create team prompt if no teams exist
  if (!teams || teams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              ⚽ Football Tracker Dashboard
            </h1>
            <p className="text-center text-gray-600">
              Welcome! Let&apos;s get you started
            </p>
          </div>

          <CreateTeamPrompt
            title="Welcome to Football Tracker!"
            message="Create your first team to start tracking matches, players, and statistics."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            ⚽ Grassroots Match Tracker
          </h1>
          <p className="text-center text-gray-600">
            Track your team&apos;s performance
          </p>
        </div>

        {/* Offline Status */}
        <OfflineStatus
          isOnline={isOnline}
          isSyncing={isSyncing}
          syncStatus={syncStatus}
          pendingCount={pendingCount}
          lastSync={lastSync}
          onSyncNow={syncNow}
        />

        {/* Match Scheduler - only show when no current match */}
        {!currentMatch && (
          <MatchScheduler
            onScheduleMatch={handleScheduleMatch}
            players={players}
          />
        )}

        {/* Scheduled Matches - only show when no current match */}
        {!currentMatch && scheduledMatches.length > 0 && (
          <ScheduledMatches
            scheduledMatches={scheduledMatches}
            players={players}
            onStartMatch={handleStartScheduledMatch}
            onDeleteMatch={handleDeleteScheduledMatch}
            onEditMatch={handleEditScheduledMatch}
          />
        )}

        {/* Current Match or Match Setup */}
        {!currentMatch ? (
          <MatchSetup onStartNewMatch={handleStartNewMatch} players={players} />
        ) : (
          <CurrentMatchHeader
            currentMatch={currentMatch}
            onFinishMatch={handleFinishMatch}
          />
        )}

        {/* Team Score */}
        {currentMatch && (
          <TeamScore
            teamScore={teamScore}
            opponent={currentMatch.opponent}
            onUpdateTeamScore={handleUpdateTeamScore}
          />
        )}

        {/* Stats Summary */}
        <StatsSummary
          currentMatch={currentMatch}
          players={players}
          matches={matches.map((match) => ({
            ...match,
            matchType: match.matchType as "league" | "cup",
            playerStats: match.playerStats.map((stat) => ({
              playerId: stat.playerId,
              playerName: stat.player?.name || "Unknown Player",
              goals: stat.goals,
              assists: stat.assists,
            })),
          }))}
        />

        {/* Squad Management */}

        {/* Players List */}
        {currentMatch && (
          <PlayerStats
            players={currentMatch.playerStats.map((stat) => ({
              id: stat.playerId,
              name: stat.playerName,
              goals: stat.goals,
              assists: stat.assists,
            }))}
            onUpdatePlayerStat={handleUpdatePlayerStat}
          />
        )}
      </div>
    </div>
  );
};

export default FootballTracker;
