import { useState, useEffect, useCallback, useRef } from "react";
import {
  offlineStorage,
  OfflineMatchState,
  PendingMatch,
} from "../lib/offline-storage";

export interface UseOfflineResult {
  isOnline: boolean;
  pendingCount: number;
  lastSync: number | null;
  isSyncing: boolean;
  syncStatus: "idle" | "syncing" | "success" | "error";
  saveOfflineState: (state: OfflineMatchState) => void;
  loadOfflineState: () => OfflineMatchState | null;
  clearOfflineState: () => void;
  addPendingMatch: (
    operation: "create" | "update",
    matchData: PendingMatch["data"]
  ) => void;
  syncNow: () => Promise<void>;
  getSyncStatus: () => {
    pendingCount: number;
    lastSync: number | null;
    hasOfflineState: boolean;
    isOnline: boolean;
  };
}

export function useOffline(): UseOfflineResult {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");

  const syncTimeoutRef = useRef<number | undefined>(undefined);

  // Update sync status
  const updateSyncStatus = useCallback(() => {
    const status = offlineStorage.getSyncStatus();
    setPendingCount(status.pendingCount);
    setLastSync(status.lastSync);
  }, []);

  // Sync pending matches
  const syncNow = useCallback(async () => {
    if (isSyncing || !isOnline) return;

    setIsSyncing(true);
    setSyncStatus("syncing");

    try {
      const result = await offlineStorage.syncPendingMatchesBatch();

      if (result.failed === 0) {
        setSyncStatus("success");
        console.log(`✅ All ${result.success} matches synced successfully`);
      } else {
        setSyncStatus("error");
        console.log(
          `⚠️ Sync completed with errors: ${result.success} success, ${result.failed} failed`
        );
      }

      updateSyncStatus();

      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus("error");
      setTimeout(() => setSyncStatus("idle"), 3000);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, isOnline, updateSyncStatus]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Connection restored");
      setIsOnline(true);

      // Auto-sync after a short delay when coming back online
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = window.setTimeout(() => {
        syncNow();
      }, 2000);
    };

    const handleOffline = () => {
      console.log("📡 Connection lost - entering offline mode");
      setIsOnline(false);
      setSyncStatus("idle");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(syncTimeoutRef.current);
    };
  }, [syncNow]);

  // Update sync status on mount and periodically
  useEffect(() => {
    updateSyncStatus();

    const interval = setInterval(updateSyncStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [updateSyncStatus]);

  // Save offline state
  const saveOfflineState = useCallback(
    (state: OfflineMatchState) => {
      offlineStorage.saveOfflineState(state);
      updateSyncStatus();
    },
    [updateSyncStatus]
  );

  // Load offline state
  const loadOfflineState = useCallback(() => {
    return offlineStorage.loadOfflineState();
  }, []);

  // Clear offline state
  const clearOfflineState = useCallback(() => {
    offlineStorage.clearOfflineState();
    updateSyncStatus();
  }, [updateSyncStatus]);

  // Add pending match
  const addPendingMatch = useCallback(
    (operation: "create" | "update", matchData: PendingMatch["data"]) => {
      offlineStorage.addPendingMatch(operation, matchData);
      updateSyncStatus();
    },
    [updateSyncStatus]
  );

  // Get sync status
  const getSyncStatus = useCallback(() => {
    return offlineStorage.getSyncStatus();
  }, []);

  return {
    isOnline,
    pendingCount,
    lastSync,
    isSyncing,
    syncStatus,
    saveOfflineState,
    loadOfflineState,
    clearOfflineState,
    addPendingMatch,
    syncNow,
    getSyncStatus,
  };
}
