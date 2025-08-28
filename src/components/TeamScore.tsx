"use client";

import React from "react";
import { Plus, Minus, Award } from "lucide-react";
import { TeamScore as TeamScoreType } from "../types";

interface TeamScoreProps {
  teamScore: TeamScoreType;
  opponent: string;
  onUpdateTeamScore: (type: "for" | "against", increment: number) => void;
}

const TeamScore: React.FC<TeamScoreProps> = ({
  teamScore,
  opponent,
  onUpdateTeamScore,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Award className="text-yellow-500" size={24} />
        Live Score vs {opponent}
      </h2>
      <div className="flex justify-center items-center gap-8">
        <div className="text-center">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => onUpdateTeamScore("for", -1)}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
            >
              <Minus size={16} />
            </button>
            <span className="text-3xl font-bold text-green-600 mx-4">
              {teamScore.for}
            </span>
            <button
              onClick={() => onUpdateTeamScore("for", 1)}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-1"
            >
              <Plus size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-600">Your Team</p>
        </div>
        <div className="text-2xl font-bold text-gray-400">-</div>
        <div className="text-center">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => onUpdateTeamScore("against", -1)}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
            >
              <Minus size={16} />
            </button>
            <span className="text-3xl font-bold text-red-600 mx-4">
              {teamScore.against}
            </span>
            <button
              onClick={() => onUpdateTeamScore("against", 1)}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-1"
            >
              <Plus size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-600">{opponent}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamScore;
