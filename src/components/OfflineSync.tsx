"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
} from "lucide-react";
import { useOffline } from "../hooks/useOffline";

export default function OfflineSync() {
  const { isOnline, pendingCount, lastSync, isSyncing, syncStatus, syncNow } =
    useOffline();

  const [showDetails, setShowDetails] = useState(false);
  const [lastSyncFormatted, setLastSyncFormatted] = useState<string>("Never");

  useEffect(() => {
    if (lastSync) {
      const formatLastSync = () => {
        const now = Date.now();
        const diff = now - lastSync;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
      };

      setLastSyncFormatted(formatLastSync());
      const interval = setInterval(() => {
        setLastSyncFormatted(formatLastSync());
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [lastSync]);

  const handleSyncClick = async () => {
    if (!isSyncing && isOnline) {
      await syncNow();
    }
  };

  const getSyncStatusIcon = () => {
    if (isSyncing) {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }

    switch (syncStatus) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSyncStatusColor = () => {
    if (!isOnline) return "bg-gray-100 text-gray-700 border-gray-300";
    if (pendingCount > 0)
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (syncStatus === "error") return "bg-red-100 text-red-800 border-red-300";
    if (syncStatus === "success")
      return "bg-green-100 text-green-800 border-green-300";
    return "bg-blue-100 text-blue-800 border-blue-300";
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div
        className={`border rounded-lg px-3 py-2 shadow-sm ${getSyncStatusColor()}`}
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          {getSyncStatusIcon()}
          <span className="text-sm font-medium">
            {isSyncing
              ? "Syncing..."
              : pendingCount > 0
              ? `${pendingCount} pending`
              : !isOnline
              ? "Offline"
              : "Synced"}
          </span>
          {pendingCount > 0 && isOnline && !isSyncing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSyncClick();
              }}
              className="ml-2 px-2 py-1 bg-white bg-opacity-50 rounded text-xs hover:bg-opacity-70"
              disabled={isSyncing}
            >
              Sync Now
            </button>
          )}
        </div>

        {showDetails && (
          <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
            <h4 className="font-semibold text-gray-900 mb-2">Sync Status</h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Connection:</span>
                <span className={isOnline ? "text-green-600" : "text-red-600"}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Pending Changes:</span>
                <span
                  className={
                    pendingCount > 0 ? "text-yellow-600" : "text-green-600"
                  }
                >
                  {pendingCount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Last Sync:</span>
                <span className="text-gray-900 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lastSyncFormatted}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={
                    syncStatus === "success"
                      ? "text-green-600"
                      : syncStatus === "error"
                      ? "text-red-600"
                      : syncStatus === "syncing"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }
                >
                  {syncStatus === "success"
                    ? "Success"
                    : syncStatus === "error"
                    ? "Error"
                    : syncStatus === "syncing"
                    ? "Syncing"
                    : "Idle"}
                </span>
              </div>
            </div>

            {isOnline && pendingCount > 0 && (
              <button
                onClick={handleSyncClick}
                disabled={isSyncing}
                className="w-full mt-3 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Sync Now
                  </>
                )}
              </button>
            )}

            {!isOnline && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                Changes will sync automatically when you&apos;re back online.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
