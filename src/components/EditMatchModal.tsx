"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Users, Trophy, FileText } from "lucide-react";
import { ScheduledMatch, Player } from "../types";

interface EditMatchModalProps {
  match: ScheduledMatch | null;
  players: Player[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMatch: Partial<ScheduledMatch>) => void;
}

const EditMatchModal: React.FC<EditMatchModalProps> = ({
  match,
  players,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    opponent: "",
    date: "",
    time: "",
    matchType: "league" as "league" | "cup",
    notes: "",
    selectedPlayerIds: [] as string[],
  });

  // Update form when match changes
  useEffect(() => {
    if (match) {
      const matchDate = new Date(match.date);
      const dateStr = matchDate.toISOString().split("T")[0];
      const timeStr = matchDate.toTimeString().slice(0, 5);

      setFormData({
        opponent: match.opponent,
        date: dateStr,
        time: timeStr,
        matchType: match.matchType as "league" | "cup",
        notes: match.notes || "",
        selectedPlayerIds: [...match.selectedPlayerIds],
      });
    }
  }, [match]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!match) return;

    // Combine date and time
    const combinedDateTime = new Date(`${formData.date}T${formData.time}`);

    const updatedMatch: Partial<ScheduledMatch> = {
      id: match.id,
      opponent: formData.opponent,
      date: combinedDateTime.toISOString(),
      matchType: formData.matchType,
      notes: formData.notes || undefined,
      selectedPlayerIds: formData.selectedPlayerIds,
    };

    onSave(updatedMatch);
    onClose();
  };

  const togglePlayerSelection = (playerId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPlayerIds: prev.selectedPlayerIds.includes(playerId)
        ? prev.selectedPlayerIds.filter((id) => id !== playerId)
        : [...prev.selectedPlayerIds, playerId],
    }));
  };

  if (!isOpen || !match) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Scheduled Match
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Opponent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Trophy className="w-4 h-4 inline mr-1" />
              Opponent Team
            </label>
            <input
              type="text"
              value={formData.opponent}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, opponent: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Enter opponent team name"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Match Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                required
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
                  checked={formData.matchType === "league"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      matchType: e.target.value as "league" | "cup",
                    }))
                  }
                  className="mr-2 text-gray-700"
                />
                League Match
              </label>
              <label className="flex items-center text-gray-700">
                <input
                  type="radio"
                  value="cup"
                  checked={formData.matchType === "cup"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      matchType: e.target.value as "league" | "cup",
                    }))
                  }
                  className="mr-2 text-gray-700"
                />
                Cup Match
              </label>
            </div>
          </div>

          {/* Player Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Select Squad ({formData.selectedPlayerIds.length} players)
            </label>
            <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
              {players.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No players available. Add players first.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {players.map((player) => (
                    <label
                      key={player.id}
                      className="flex items-center text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedPlayerIds.includes(player.id)}
                        onChange={() => togglePlayerSelection(player.id)}
                        className="mr-2 text-gray-700"
                      />
                      {player.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Match Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              rows={3}
              placeholder="Add any notes about this match..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Update Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMatchModal;
