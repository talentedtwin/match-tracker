"use client";

import React from "react";
import Link from "next/link";
import { useMatches } from "../../hooks/useApi";
import MatchHistory from "../../components/MatchHistory";
import { MatchHistorySkeleton } from "../../components/Skeleton";

// Using the seeded user ID from the database
const USER_ID = "test-user-id";

const HistoryPage = () => {
  const {
    matches,
    loading: matchesLoading,
    error: matchesError,
  } = useMatches(USER_ID);

  // Show loading state
  if (matchesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <MatchHistorySkeleton />
      </div>
    );
  }

  // Show error state
  if (matchesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error</h2>
            <p className="text-red-700">{matchesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            📊 Match History
          </h1>
          <p className="text-center text-gray-600">
            Review your team&apos;s past performances
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No matches played yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start playing matches to see your history here
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Start New Match
            </Link>
          </div>
        ) : (
          <MatchHistory
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
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
