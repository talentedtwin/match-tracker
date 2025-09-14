"use client";

import React, { useState } from "react";
import { ScheduledMatch, Player } from "../types";
import {
  Calendar,
  Users,
  Trophy,
  Play,
  FileText,
  Clock,
  Edit,
} from "lucide-react";
import EditMatchModal from "./EditMatchModal";
import { formatDate, formatTime } from "../utils/dateUtils";

interface ScheduledMatchesProps {
  scheduledMatches: ScheduledMatch[];
  players: Player[];
  onStartMatch: (match: ScheduledMatch) => void;
  onDeleteMatch?: (matchId: string) => void;
  onEditMatch?: (match: ScheduledMatch) => void;
}

const ScheduledMatches: React.FC<ScheduledMatchesProps> = ({
  scheduledMatches,
  players,
  onStartMatch,
  onDeleteMatch,
  onEditMatch,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<ScheduledMatch | null>(
    null
  );

  const handleEditClick = (match: ScheduledMatch) => {
    setSelectedMatch(match);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedMatch: Partial<ScheduledMatch>) => {
    try {
      // Convert the partial match to a full ScheduledMatch for the parent handler
      if (selectedMatch && updatedMatch.id) {
        const fullUpdatedMatch: ScheduledMatch = {
          ...selectedMatch,
          ...updatedMatch,
          id: updatedMatch.id,
          opponent: updatedMatch.opponent || selectedMatch.opponent,
          date: updatedMatch.date || selectedMatch.date,
          matchType: updatedMatch.matchType || selectedMatch.matchType,
          notes:
            updatedMatch.notes !== undefined
              ? updatedMatch.notes
              : selectedMatch.notes,
          selectedPlayerIds:
            updatedMatch.selectedPlayerIds || selectedMatch.selectedPlayerIds,
          isFinished: selectedMatch.isFinished,
        };

        // Let the parent component handle the API call and state update
        await onEditMatch?.(fullUpdatedMatch);
        setEditModalOpen(false);
        setSelectedMatch(null);
      }
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  const getSelectedPlayerNames = (selectedPlayerIds: string[]) => {
    return players
      .filter((player) => selectedPlayerIds.includes(player.id))
      .map((player) => player.name);
  };

  const isMatchToday = (dateString: string) => {
    const matchDate = new Date(dateString);
    const today = new Date();
    return matchDate.toDateString() === today.toDateString();
  };

  const isMatchSoon = (dateString: string) => {
    const matchDate = new Date(dateString);
    const now = new Date();
    const hoursDiff = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24 && hoursDiff > 0;
  };

  if (scheduledMatches.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          Scheduled Matches
        </h2>
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Scheduled Matches
          </h3>
          <p className="text-gray-500">
            Schedule a match to see it appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
        Scheduled Matches ({scheduledMatches.length})
      </h2>

      <div className="space-y-4">
        {scheduledMatches.map((match) => {
          const selectedPlayerNames = getSelectedPlayerNames(
            match.selectedPlayerIds
          );
          const isToday = isMatchToday(match.date);
          const isSoon = isMatchSoon(match.date);

          return (
            <div
              key={match.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                isToday
                  ? "border-green-300 bg-green-50"
                  : isSoon
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Match Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      vs {match.opponent}
                    </h3>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        match.matchType === "cup"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <Trophy className="w-3 h-3 mr-1" />
                      {match.matchType === "cup" ? "Cup" : "League"}
                    </div>
                    {isToday && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Today
                      </div>
                    )}
                    {isSoon && !isToday && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Soon
                      </div>
                    )}
                  </div>

                  {/* Match Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {formatDate(match.date)} at {formatTime(match.date)}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {selectedPlayerNames.length} player
                        {selectedPlayerNames.length !== 1 ? "s" : ""} selected
                      </span>
                    </div>
                  </div>

                  {/* Selected Players */}
                  {selectedPlayerNames.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {selectedPlayerNames
                          .slice(0, 5)
                          .map((playerName, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {playerName}
                            </span>
                          ))}
                        {selectedPlayerNames.length > 5 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{selectedPlayerNames.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Match Notes */}
                  {match.notes && (
                    <div className="flex items-start text-gray-600 mb-3">
                      <FileText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{match.notes}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => onStartMatch(match)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      isToday || isSoon
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    Start Match
                  </button>

                  {onEditMatch && (
                    <button
                      onClick={() => handleEditClick(match)}
                      className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}

                  {onDeleteMatch && (
                    <button
                      onClick={() => onDeleteMatch(match.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EditMatchModal
        match={selectedMatch}
        players={players}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedMatch(null);
        }}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default ScheduledMatches;
