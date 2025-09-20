"use client";

import React from "react";
import Link from "next/link";
import { Users, Plus, ArrowRight } from "lucide-react";

interface CreateTeamPromptProps {
  title?: string;
  message?: string;
  className?: string;
}

const CreateTeamPrompt: React.FC<CreateTeamPromptProps> = ({
  title = "No Team Found",
  message = "You need to create a team first to start tracking matches and player statistics.",
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-8 text-center ${className}`}
    >
      <div className="flex justify-center mb-6">
        <div className="bg-blue-100 p-4 rounded-full">
          <Users className="w-12 h-12 text-blue-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

      <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>

      <div className="space-y-4">
        <Link
          href="/players"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Your First Team
          <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="text-sm text-gray-500">
          Set up your team and add players to get started
        </p>
      </div>
    </div>
  );
};

export default CreateTeamPrompt;
