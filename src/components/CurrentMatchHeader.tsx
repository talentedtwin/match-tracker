"use client";

import React from "react";
import { Match } from "../types";
import { formatDateTime } from "../utils/dateUtils";

interface CurrentMatchHeaderProps {
  currentMatch: Match;
  onFinishMatch: () => void;
}

const CurrentMatchHeader: React.FC<CurrentMatchHeaderProps> = ({
  currentMatch,
  onFinishMatch,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Current Match vs {currentMatch.opponent}
        </h2>
        <button
          onClick={onFinishMatch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Finish Match
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Match Date: {formatDateTime(currentMatch.date)}
      </p>
    </div>
  );
};

export default CurrentMatchHeader;
