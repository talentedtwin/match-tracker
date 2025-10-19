// Test script to verify offline functionality
import { offlineStorage } from "./src/lib/offline-storage";

// Test 1: Save and load offline state
console.log("Testing offline state save/load...");

const testMatchState = {
  currentMatch: {
    id: "test-match-1",
    opponent: "Test Opponent",
    date: "2024-01-15T10:00:00Z",
    goalsFor: 2,
    goalsAgainst: 1,
    isFinished: false,
    matchType: "league" as const,
    venue: "home" as const,
    selectedPlayerIds: ["player1", "player2"],
    playerStats: [
      {
        playerId: "player1",
        playerName: "John Doe",
        goals: 1,
        assists: 0,
      },
      {
        playerId: "player2",
        playerName: "Jane Smith",
        goals: 1,
        assists: 1,
      },
    ],
  },
  teamScore: { for: 2, against: 1 },
  lastSaved: Date.now(),
};

offlineStorage.saveOfflineState(testMatchState);
const loaded = offlineStorage.loadOfflineState();
console.log("Saved and loaded match state:", loaded);

// Test 2: Add pending match
console.log("\nTesting pending match operations...");

offlineStorage.addPendingMatch("update", {
  id: "test-match-1",
  goalsFor: 3,
  goalsAgainst: 1,
  isFinished: true,
  playerStats: [
    { playerId: "player1", goals: 2, assists: 0 },
    { playerId: "player2", goals: 1, assists: 1 },
  ],
});

console.log("Pending matches:", offlineStorage.getPendingMatches());

// Test 3: Get sync status
console.log("\nTesting sync status...");
console.log("Sync status:", offlineStorage.getSyncStatus());

console.log("\nAll tests completed!");
