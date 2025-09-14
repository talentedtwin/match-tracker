import React from "react";
import {
  Wifi,
  WifiOff,
  RotateCw,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface OfflineStatusProps {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  syncStatus: "idle" | "syncing" | "success" | "error";
  lastSync: number | null;
  onSyncNow?: () => void;
}

const OfflineStatus: React.FC<OfflineStatusProps> = ({
  isOnline,
  pendingCount,
  isSyncing,
  syncStatus,
  lastSync,
  onSyncNow,
}) => {
  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return "Never";

    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <RotateCw className="w-4 h-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Syncing...";
      case "success":
        return "Synced";
      case "error":
        return "Sync failed";
      default:
        return "";
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg border mb-4 ${
        isOnline
          ? "bg-green-50 border-green-200"
          : "bg-orange-50 border-orange-200"
      }`}
    >
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-600" />
        ) : (
          <WifiOff className="w-4 h-4 text-orange-600" />
        )}
        <span
          className={`text-sm font-medium ${
            isOnline ? "text-green-700" : "text-orange-700"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* Pending Count */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-sm text-gray-600">{pendingCount} pending</span>
        </div>
      )}

      {/* Sync Status */}
      {(syncStatus !== "idle" || lastSync) && (
        <div className="flex items-center gap-2">
          {getSyncStatusIcon()}
          <span className="text-sm text-gray-600">
            {getSyncStatusText() || `Last sync: ${formatLastSync(lastSync)}`}
          </span>
        </div>
      )}

      {/* Manual Sync Button */}
      {isOnline && pendingCount > 0 && !isSyncing && onSyncNow && (
        <button
          onClick={onSyncNow}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
        >
          <RotateCw className="w-3 h-3" />
          Sync Now
        </button>
      )}

      {/* Offline Mode Indicator */}
      {!isOnline && (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="text-sm text-orange-700">Changes saved locally</span>
        </div>
      )}
    </div>
  );
};

export default OfflineStatus;
