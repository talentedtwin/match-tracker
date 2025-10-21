// Offline storage and sync management for match tracking

export interface PendingMatch {
  id: string;
  data: {
    id?: string;
    opponent?: string;
    date?: string;
    goalsFor?: number;
    goalsAgainst?: number;
    isFinished?: boolean;
    matchType?: string;
    notes?: string;
    selectedPlayerIds?: string[];
    playerStats?: Array<{ playerId: string; goals: number; assists: number }>;
  };
  operation: "create" | "update";
  timestamp: number;
  attempts: number;
}

export interface OfflineMatchState {
  currentMatch: {
    id: string;
    opponent: string;
    date: string;
    goalsFor: number;
    goalsAgainst: number;
    isFinished: boolean;
    matchType: "league" | "cup";
    venue: "home" | "away";
    selectedPlayerIds: string[];
    playerStats: Array<{
      playerId: string;
      playerName: string;
      goals: number;
      assists: number;
    }>;
  } | null;
  teamScore: { for: number; against: number };
  lastSaved: number;
}

class OfflineStorageManager {
  private readonly STORAGE_KEYS = {
    PENDING_MATCHES: "match-tracker-pending-matches",
    OFFLINE_STATE: "match-tracker-offline-state",
    LAST_SYNC: "match-tracker-last-sync",
  };

  private readonly MAX_RETRY_ATTEMPTS = 5;
  private readonly RETRY_DELAY_BASE = 1000; // 1 second base delay
  private syncInProgress = false;
  private saveDebounceTimer: NodeJS.Timeout | null = null;
  private readonly SAVE_DEBOUNCE_MS = 300; // Debounce localStorage writes

  // Debounced save to prevent excessive localStorage writes
  saveOfflineState(state: OfflineMatchState): void {
    // Clear existing timer
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
    }

    // Set new timer
    this.saveDebounceTimer = setTimeout(() => {
      try {
        const stateWithTimestamp = {
          ...state,
          lastSaved: Date.now(),
        };
        localStorage.setItem(
          this.STORAGE_KEYS.OFFLINE_STATE,
          JSON.stringify(stateWithTimestamp)
        );
        console.log(
          "🔄 Match state saved offline:",
          state.currentMatch?.opponent
        );
      } catch (error) {
        console.error("Failed to save offline state:", error);
      }
    }, this.SAVE_DEBOUNCE_MS);
  }

  // Load offline state from local storage
  loadOfflineState(): OfflineMatchState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.OFFLINE_STATE);
      if (!stored) return null;

      const state = JSON.parse(stored) as OfflineMatchState;
      console.log("📱 Loaded offline state:", state.currentMatch?.opponent);
      return state;
    } catch (error) {
      console.error("Failed to load offline state:", error);
      return null;
    }
  }

  // Clear offline state (when match is successfully synced)
  clearOfflineState(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.OFFLINE_STATE);
      console.log("✅ Offline state cleared");
    } catch (error) {
      console.error("Failed to clear offline state:", error);
    }
  }

  // Add a pending operation to sync queue
  addPendingMatch(
    operation: "create" | "update",
    matchData: PendingMatch["data"]
  ): void {
    try {
      const pendingMatches = this.getPendingMatches();
      const newPending: PendingMatch = {
        id: matchData.id || `temp-${Date.now()}`,
        data: matchData,
        operation,
        timestamp: Date.now(),
        attempts: 0,
      };

      // Remove any existing pending operation for the same match
      const filteredPending = pendingMatches.filter(
        (p) => p.id !== newPending.id
      );
      filteredPending.push(newPending);

      localStorage.setItem(
        this.STORAGE_KEYS.PENDING_MATCHES,
        JSON.stringify(filteredPending)
      );

      console.log(
        `📝 Added pending ${operation} for match:`,
        matchData.opponent
      );
    } catch (error) {
      console.error("Failed to add pending match:", error);
    }
  }

  // Get all pending matches
  getPendingMatches(): PendingMatch[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.PENDING_MATCHES);
      if (!stored) return [];
      return JSON.parse(stored) as PendingMatch[];
    } catch (error) {
      console.error("Failed to get pending matches:", error);
      return [];
    }
  }

  // Remove a pending match after successful sync
  removePendingMatch(matchId: string): void {
    try {
      const pendingMatches = this.getPendingMatches();
      const filtered = pendingMatches.filter((p) => p.id !== matchId);

      localStorage.setItem(
        this.STORAGE_KEYS.PENDING_MATCHES,
        JSON.stringify(filtered)
      );

      console.log("✅ Removed pending match:", matchId);
    } catch (error) {
      console.error("Failed to remove pending match:", error);
    }
  }

  // Increment retry attempts for a pending match
  incrementAttempts(matchId: string): void {
    try {
      const pendingMatches = this.getPendingMatches();
      const updated = pendingMatches.map((p) =>
        p.id === matchId ? { ...p, attempts: p.attempts + 1 } : p
      );

      localStorage.setItem(
        this.STORAGE_KEYS.PENDING_MATCHES,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Failed to increment attempts:", error);
    }
  }

  // Check if device is online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Sync all pending matches when connection is restored
  async syncPendingMatches(): Promise<{ success: number; failed: number }> {
    if (this.syncInProgress) {
      console.log("🔄 Sync already in progress...");
      return { success: 0, failed: 0 };
    }

    this.syncInProgress = true;
    const pendingMatches = this.getPendingMatches();

    if (pendingMatches.length === 0) {
      this.syncInProgress = false;
      return { success: 0, failed: 0 };
    }

    console.log(`🔄 Syncing ${pendingMatches.length} pending matches...`);

    let successCount = 0;
    let failedCount = 0;

    for (const pending of pendingMatches) {
      try {
        if (pending.attempts >= this.MAX_RETRY_ATTEMPTS) {
          console.error(`❌ Max retries exceeded for match: ${pending.id}`);
          failedCount++;
          continue;
        }

        const success = await this.syncSingleMatch(pending);

        if (success) {
          this.removePendingMatch(pending.id);
          successCount++;
          console.log(`✅ Synced match: ${pending.data.opponent}`);
        } else {
          this.incrementAttempts(pending.id);
          failedCount++;

          // Exponential backoff delay
          const delay = this.RETRY_DELAY_BASE * Math.pow(2, pending.attempts);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`❌ Failed to sync match ${pending.id}:`, error);
        this.incrementAttempts(pending.id);
        failedCount++;
      }
    }

    // Update last sync timestamp
    localStorage.setItem(this.STORAGE_KEYS.LAST_SYNC, Date.now().toString());

    this.syncInProgress = false;
    console.log(
      `🔄 Sync complete: ${successCount} success, ${failedCount} failed`
    );

    return { success: successCount, failed: failedCount };
  }

  // Sync all pending matches using batch API
  async syncPendingMatchesBatch(): Promise<{
    success: number;
    failed: number;
  }> {
    if (this.syncInProgress) {
      console.log("🔄 Sync already in progress...");
      return { success: 0, failed: 0 };
    }

    this.syncInProgress = true;
    const pendingMatches = this.getPendingMatches();

    if (pendingMatches.length === 0) {
      this.syncInProgress = false;
      return { success: 0, failed: 0 };
    }

    try {
      // Convert to sync operations format
      const operations = pendingMatches.map((pending) => ({
        id: pending.id,
        type: pending.operation === "create" ? "match-create" : "match-update",
        data: pending.data,
        timestamp: pending.timestamp,
      }));

      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operations }),
      });

      if (response.ok) {
        const result = await response.json();

        // Remove successfully synced matches
        result.results.forEach((res: { id: string; success: boolean }) => {
          if (res.success) {
            this.removePendingMatch(res.id);
          }
        });

        // Update last sync timestamp
        localStorage.setItem(
          this.STORAGE_KEYS.LAST_SYNC,
          Date.now().toString()
        );

        console.log(
          `✅ Batch sync completed: ${result.results.length} operations processed`
        );

        return {
          success: result.results.filter((r: { success: boolean }) => r.success)
            .length,
          failed: result.errors.length,
        };
      } else {
        console.error("Batch sync failed:", response.statusText);
        return { success: 0, failed: pendingMatches.length };
      }
    } catch (error) {
      console.error("Batch sync error:", error);
      return { success: 0, failed: pendingMatches.length };
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync a single match (fallback method)
  private async syncSingleMatch(pending: PendingMatch): Promise<boolean> {
    try {
      const url =
        pending.operation === "create"
          ? "/api/matches"
          : `/api/matches/${pending.id}`;

      const method = pending.operation === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending.data),
      });

      return response.ok;
    } catch (error) {
      console.error("Network error during sync:", error);
      return false;
    }
  }

  // Get sync status information
  getSyncStatus(): {
    pendingCount: number;
    lastSync: number | null;
    hasOfflineState: boolean;
    isOnline: boolean;
  } {
    const pending = this.getPendingMatches();
    const lastSyncStr = localStorage.getItem(this.STORAGE_KEYS.LAST_SYNC);
    const lastSync = lastSyncStr ? parseInt(lastSyncStr) : null;
    const hasOfflineState = !!localStorage.getItem(
      this.STORAGE_KEYS.OFFLINE_STATE
    );

    return {
      pendingCount: pending.length,
      lastSync,
      hasOfflineState,
      isOnline: this.isOnline(),
    };
  }

  // Clear all offline data (for testing or reset)
  clearAllOfflineData(): void {
    Object.values(this.STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    console.log("🗑️ All offline data cleared");
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageManager();
