"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ minHeight: "1rem" }}
    />
  );
};

// Dashboard Header Skeleton
export const DashboardHeaderSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <Skeleton className="h-8 w-64 mx-auto mb-2" />
      <Skeleton className="h-4 w-48 mx-auto" />
    </div>
  );
};

// Match Scheduler Skeleton
export const MatchSchedulerSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <Skeleton className="h-6 w-40 mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="mb-4">
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      <div className="mb-4">
        <Skeleton className="h-4 w-28 mb-2" />
        <div className="border border-gray-300 rounded-lg p-3 max-h-40">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>

      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-20 w-full mb-4" />

      <Skeleton className="h-10 w-full" />
    </div>
  );
};

// Scheduled Matches Skeleton
export const ScheduledMatchesSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <Skeleton className="h-6 w-48 mb-4" />

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>

            <div className="mb-3">
              <Skeleton className="h-4 w-20 mb-2" />
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-6 w-16" />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Match Setup Skeleton
export const MatchSetupSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <Skeleton className="h-6 w-32 mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="mb-4">
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      <div className="mb-4">
        <Skeleton className="h-4 w-28 mb-2" />
        <div className="border border-gray-300 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>

      <Skeleton className="h-10 w-full" />
    </div>
  );
};

// Stats Summary Skeleton
export const StatsSummarySkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <Skeleton className="h-6 w-40 mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
            <Skeleton className="h-8 w-12 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Current Match Header Skeleton
export const CurrentMatchHeaderSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-20" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <Skeleton className="h-4 w-16 mx-auto mb-2" />
          <Skeleton className="h-8 w-12 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-6 w-8 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-4 w-20 mx-auto mb-2" />
          <Skeleton className="h-8 w-12 mx-auto" />
        </div>
      </div>
    </div>
  );
};

// Player Stats Skeleton
export const PlayerStatsSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <Skeleton className="h-6 w-32 mb-4" />

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-4">
              <div className="text-center">
                <Skeleton className="h-4 w-12 mb-1" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6" />
                </div>
              </div>
              <div className="text-center">
                <Skeleton className="h-4 w-12 mb-1" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Player Management Skeleton
export const PlayerManagementSkeleton: React.FC = () => {
  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-6 w-8 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Squad Management */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Skeleton className="h-6 w-40 mb-4" />

          {/* Add Player Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Players List */}
          <div>
            <Skeleton className="h-5 w-36 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Page Skeleton
export const StatsPageSkeleton: React.FC = () => {
  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <Skeleton className="h-8 w-56 mx-auto mb-2" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>

        {/* Overall Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Player Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <Skeleton className="h-5 w-28" />
                <div className="flex gap-8">
                  <div className="text-center">
                    <Skeleton className="h-6 w-8 mx-auto mb-1" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-6 w-8 mx-auto mb-1" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Match History Skeleton
export const MatchHistorySkeleton: React.FC = () => {
  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <Skeleton className="h-4 w-16 mx-auto mb-1" />
                  <Skeleton className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-6 w-6 mx-auto" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-4 w-20 mx-auto mb-1" />
                  <Skeleton className="h-8 w-8 mx-auto" />
                </div>
              </div>

              {/* Player stats in match */}
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-full" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Full Dashboard Skeleton
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <DashboardHeaderSkeleton />
        <MatchSchedulerSkeleton />
        <ScheduledMatchesSkeleton />
        <MatchSetupSkeleton />
        <StatsSummarySkeleton />
      </div>
    </div>
  );
};

// Individual Component Skeletons with optional loading props
interface ComponentSkeletonProps {
  loading?: boolean;
  children?: React.ReactNode;
}

export const SkeletonWrapper: React.FC<
  ComponentSkeletonProps & { skeleton: React.ReactNode }
> = ({ loading = false, children, skeleton }) => {
  if (loading) {
    return <>{skeleton}</>;
  }
  return <>{children}</>;
};

// Quick Match Scheduler Skeleton (compact version)
export const QuickMatchSchedulerSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <Skeleton className="h-5 w-32 mb-3" />
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  );
};

// Quick Scheduled Matches Skeleton (compact version)
export const QuickScheduledMatchesSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <Skeleton className="h-5 w-36 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded p-3">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Form Loading Skeleton (for modals/forms while submitting)
export const FormLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-10 w-full" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      <div>
        <Skeleton className="h-4 w-28 mb-2" />
        <div className="border border-gray-200 rounded p-3 max-h-32">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>

      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-16 w-full" />
      </div>

      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
};

// Button Loading Skeleton
export const ButtonLoadingSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      <span>Saving...</span>
    </div>
  );
};

export default Skeleton;
