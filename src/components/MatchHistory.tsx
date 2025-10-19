"use client";

import React from "react";
import { Match } from "../types";
import { formatDateTime } from "../utils/dateUtils";
import { Share2Icon } from "lucide-react";

interface MatchHistoryProps {
  matches: Match[];
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ matches }) => {
  // Filter to only show finished matches for history
  const finishedMatches = matches.filter((match) => match.isFinished);

  const shareMatchResult = (match: Match) => {
    const matchDate = formatDateTime(match.date);
    const result =
      match.goalsFor > match.goalsAgainst
        ? "WIN"
        : match.goalsFor === match.goalsAgainst
        ? "DRAW"
        : "LOSS";

    // Create shareable text
    const teamName = match.team?.name || "Our Team";
    const venueText = match.venue === "home" ? "🏠" : "✈️";
    let shareText = `🏆 Match Result - ${matchDate}\n\n`;
    shareText += `📊 ${teamName} ${match.goalsFor} - ${match.goalsAgainst} ${match.opponent}\n`;
    shareText += `Result: ${result}\n`;
    shareText += `Venue: ${venueText}\n`;
    shareText += `Competition: ${
      match.matchType.charAt(0).toUpperCase() + match.matchType.slice(1)
    }\n\n`;

    if (match.playerStats && match.playerStats.length > 0) {
      const performingPlayers = match.playerStats.filter(
        (stat) => stat.goals > 0 || stat.assists > 0
      );
      if (performingPlayers.length > 0) {
        shareText += `👥 Player Performance:\n`;
        performingPlayers.forEach((player) => {
          shareText += `• ${player.playerName}: ${player.goals}G, ${player.assists}A\n`;
        });
        shareText += "\n";
      }
    }

    if (match.notes) {
      shareText += `📝 Notes: ${match.notes}\n`;
    }

    shareText += `\n⚽ Shared from Match Tracker`;

    // Try to use Web Share API if available, otherwise copy to clipboard
    if (navigator.share) {
      navigator
        .share({
          title: `Match Result: ${teamName} vs ${match.opponent}`,
          text: shareText,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      // Fallback to clipboard
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          alert("Match result copied to clipboard!");
        })
        .catch((err) => {
          console.log("Error copying to clipboard:", err);
          // Final fallback - show the text in an alert
          alert(`Match result:\n\n${shareText}`);
        });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Match History
      </h2>
      {finishedMatches.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No completed matches yet.</p>
          <p className="text-sm mt-1">
            Scheduled matches will appear here after they finish.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {finishedMatches.map((match) => (
            <div
              key={match.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">
                      {match.team?.name || "Our Team"} vs {match.opponent}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {match.venue === "home" ? "🏠 Home" : "✈️ Away"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(match.date)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      <span
                        className={
                          match.goalsFor > match.goalsAgainst
                            ? "text-green-600"
                            : match.goalsFor === match.goalsAgainst
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {match.goalsFor} - {match.goalsAgainst}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {match.goalsFor > match.goalsAgainst
                        ? "WIN"
                        : match.goalsFor === match.goalsAgainst
                        ? "DRAW"
                        : "LOSS"}
                    </div>

                    <button
                      onClick={() => shareMatchResult(match)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1 mt-2"
                      title="Share match result"
                    >
                      <Share2Icon className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Player stats for this match */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Player Performance:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {match.playerStats
                    .filter((stat) => stat.goals > 0 || stat.assists > 0)
                    .map((stat) => (
                      <div key={stat.playerId}>
                        {stat.playerName}: {stat.goals}G, {stat.assists}A
                      </div>
                    ))}
                  {match.playerStats.filter(
                    (stat) => stat.goals > 0 || stat.assists > 0
                  ).length === 0 && (
                    <div className="col-span-2 text-gray-500">
                      No goals or assists recorded
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchHistory;
