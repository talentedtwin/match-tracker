"use client";

import React, { useState } from "react";
import MatchSetup from "../components/MatchSetup";
import CurrentMatchHeader from "../components/CurrentMatchHeader";
import TeamScore from "../components/TeamScore";
import StatsSummary from "../components/StatsSummary";
import SquadManagement from "../components/SquadManagement";
import PlayerStats from "../components/PlayerStats";
import { usePlayers, useMatches } from "../hooks/useApi";
import { Player } from "../types";

// Using the seeded user ID from the database
const USER_ID = "test-user-id";

const FootballTracker = () => {
  // API-based state management
  const {
    players,
    loading: playersLoading,
    error: playersError,
    addPlayer,
    removePlayer,
  } = usePlayers(USER_ID);

  const {
    matches,
    loading: matchesLoading,
    error: matchesError,
    addMatch,
  } = useMatches(USER_ID);

  // Local state for current match (not stored in DB until finished)
  const [currentMatch, setCurrentMatch] = useState<{
    id: string;
    opponent: string;
    date: string;
    goalsFor: number;
    goalsAgainst: number;
    playerStats: Array<{
      playerId: string;
      playerName: string;
      goals: number;
      assists: number;
    }>;
  } | null>(null);

  const [teamScore, setTeamScore] = useState({ for: 0, against: 0 });

  // Handle adding a new player
  const handleAddPlayer = async (name: string) => {
    try {
      await addPlayer(name);
    } catch (error) {
      console.error("Failed to add player:", error);
    }
  };

  // Handle removing a player
  const handleRemovePlayer = async (playerId: string) => {
    try {
      await removePlayer(playerId);
    } catch (error) {
      console.error("Failed to remove player:", error);
    }
  };

  // Handle updating player stats during a match
  const handleUpdatePlayerStat = async (
    playerId: string,
    stat: "goals" | "assists",
    increment: number
  ) => {
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
  };

  // Handle updating team score
  const handleUpdateTeamScore = (
    type: "for" | "against",
    increment: number
  ) => {
    setTeamScore((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment),
    }));
  };

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

    try {
      const finalMatch = {
        ...currentMatch,
        goalsFor: teamScore.for,
        goalsAgainst: teamScore.against,
        isFinished: true,
        playerStats: currentMatch.playerStats.map((stat) => ({
          playerId: stat.playerId,
          goals: stat.goals,
          assists: stat.assists,
        })),
      };

      await addMatch(finalMatch);
      setCurrentMatch(null);
      setTeamScore({ for: 0, against: 0 });
    } catch (error) {
      console.error("Failed to finish match:", error);
    }
  };

  // Show loading state
  if (playersLoading || matchesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (playersError || matchesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error</h2>
            <p className="text-red-700">{playersError || matchesError}</p>
          </div>
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
            playerStats: match.playerStats.map((stat) => ({
              playerId: stat.playerId,
              playerName: stat.player?.name || "Unknown Player",
              goals: stat.goals,
              assists: stat.assists,
            })),
          }))}
        />

        {/* Squad Management */}
        <SquadManagement
          players={players}
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
        />

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
