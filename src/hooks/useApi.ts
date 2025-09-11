import { useState, useEffect, useCallback } from "react";
import {
  playerApi,
  matchApi,
  playerMatchStatsApi,
  statsApi,
  ApiPlayer,
  ApiMatch,
  ApiPlayerMatchStat,
} from "../lib/api";

// Hook for managing players
export function usePlayers(userId: string) {
  const [players, setPlayers] = useState<ApiPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await playerApi.getAll(userId);
      setPlayers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch players");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addPlayer = useCallback(
    async (name: string) => {
      try {
        const newPlayer = await playerApi.create(name, userId);
        setPlayers((prev) => [...prev, newPlayer]);
        return newPlayer;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add player");
        throw err;
      }
    },
    [userId]
  );

  const updatePlayer = useCallback(
    async (id: string, data: Partial<ApiPlayer>) => {
      try {
        const updatedPlayer = await playerApi.update(id, data);
        setPlayers((prev) =>
          prev.map((player) => (player.id === id ? updatedPlayer : player))
        );
        return updatedPlayer;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update player"
        );
        throw err;
      }
    },
    []
  );

  const removePlayer = useCallback(async (id: string) => {
    try {
      await playerApi.delete(id);
      setPlayers((prev) => prev.filter((player) => player.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove player");
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return {
    players,
    loading,
    error,
    addPlayer,
    updatePlayer,
    removePlayer,
    refetch: fetchPlayers,
  };
}

// Hook for managing matches
export function useMatches(userId: string) {
  const [matches, setMatches] = useState<ApiMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchApi.getAll();
      // Filter matches by userId if needed
      const userMatches = data.filter(
        (match: ApiMatch) => match.userId === userId
      );
      setMatches(userMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addMatch = useCallback(
    async (matchData: {
      opponent: string;
      date?: string;
      goalsFor?: number;
      goalsAgainst?: number;
      matchType?: string;
      notes?: string;
      selectedPlayerIds?: string[];
      isFinished?: boolean;
      playerStats?: Array<{
        playerId: string;
        goals?: number;
        assists?: number;
      }>;
    }) => {
      try {
        const newMatch = await matchApi.create({ ...matchData, userId });
        setMatches((prev) => [newMatch, ...prev]);
        return newMatch;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add match");
        throw err;
      }
    },
    [userId]
  );

  const updateMatch = useCallback(
    async (id: string, data: Partial<ApiMatch>) => {
      try {
        const updatedMatch = await matchApi.update(id, data);
        setMatches((prev) =>
          prev.map((match) => (match.id === id ? updatedMatch : match))
        );
        return updatedMatch;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update match");
        throw err;
      }
    },
    []
  );

  const removeMatch = useCallback(async (id: string) => {
    try {
      await matchApi.delete(id);
      setMatches((prev) => prev.filter((match) => match.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove match");
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    matches,
    loading,
    error,
    addMatch,
    updateMatch,
    removeMatch,
    refetch: fetchMatches,
  };
}

// Hook for managing player match statistics
export function usePlayerMatchStats(matchId?: string, playerId?: string) {
  const [stats, setStats] = useState<ApiPlayerMatchStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await playerMatchStatsApi.getAll(matchId, playerId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }, [matchId, playerId]);

  const addStat = useCallback(
    async (statData: {
      playerId: string;
      matchId: string;
      goals?: number;
      assists?: number;
    }) => {
      try {
        const newStat = await playerMatchStatsApi.create(statData);
        setStats((prev) => [...prev, newStat]);
        return newStat;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add stat");
        throw err;
      }
    },
    []
  );

  const updateStat = useCallback(
    async (id: string, data: { goals?: number; assists?: number }) => {
      try {
        const updatedStat = await playerMatchStatsApi.update(id, data);
        setStats((prev) =>
          prev.map((stat) => (stat.id === id ? updatedStat : stat))
        );
        return updatedStat;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update stat");
        throw err;
      }
    },
    []
  );

  const removeStat = useCallback(async (id: string) => {
    try {
      await playerMatchStatsApi.delete(id);
      setStats((prev) => prev.filter((stat) => stat.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove stat");
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    addStat,
    updateStat,
    removeStat,
    refetch: fetchStats,
  };
}

// Hook for managing statistics
export function useStats(userId: string) {
  const [stats, setStats] = useState<{
    overview: {
      totalMatches: number;
      wins: number;
      draws: number;
      losses: number;
      winRate: string;
    };
    players: {
      total: number;
      stats: Array<{
        playerId: string;
        playerName: string;
        totalGoals: number;
        totalAssists: number;
        matchesPlayed: number;
        goalsPerMatch: string;
        assistsPerMatch: string;
      }>;
    };
    topPerformers: {
      scorers: Array<{
        playerId: string;
        playerName: string;
        totalGoals: number;
        totalAssists: number;
        matchesPlayed: number;
        goalsPerMatch: string;
        assistsPerMatch: string;
      }>;
      assists: Array<{
        playerId: string;
        playerName: string;
        totalGoals: number;
        totalAssists: number;
        matchesPlayed: number;
        goalsPerMatch: string;
        assistsPerMatch: string;
      }>;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statsApi.getUserStats(userId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
