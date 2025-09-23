import useSWR from "swr";
import { ApiPlayer, ApiMatch, ApiPlayerMatchStat, ApiTeam } from "../lib/api";

// Enhanced fetcher function with error handling
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

// Optimized configuration for different data types
const playerConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 10000, // 10 seconds - players don't change frequently
  focusThrottleInterval: 30000, // 30 seconds
};

const matchConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // 5 seconds - matches update more frequently
  focusThrottleInterval: 15000, // 15 seconds
};

const teamConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 15000, // 15 seconds - teams rarely change
  focusThrottleInterval: 60000, // 1 minute
};

// Enhanced SWR-based players hook with optimized caching
export function usePlayersOptimized() {
  const { data, error, isLoading, mutate } = useSWR<ApiPlayer[]>(
    `/api/players`,
    fetcher,
    playerConfig
  );

  return {
    players: data || [],
    loading: isLoading,
    error: error?.message,
    mutate,
  };
}

// Enhanced SWR-based matches hook with optimized caching
export function useMatchesOptimized() {
  const { data, error, isLoading, mutate } = useSWR<ApiMatch[]>(
    `/api/matches`,
    fetcher,
    matchConfig
  );

  return {
    matches: data || [],
    loading: isLoading,
    error: error?.message,
    mutate,
  };
}

// Enhanced SWR-based teams hook with optimized caching
export function useTeamsOptimized() {
  const { data, error, isLoading, mutate } = useSWR<ApiTeam[]>(
    `/api/teams`,
    fetcher,
    teamConfig
  );

  return {
    teams: data || [],
    loading: isLoading,
    error: error?.message,
    mutate,
  };
}

// Optimized player stats hook with caching
export function usePlayerStatsOptimized(userId: string) {
  const { data, error, isLoading } = useSWR<ApiPlayerMatchStat[]>(
    userId ? `/api/player-match-stats?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // Stats change less frequently
    }
  );

  return {
    stats: data || [],
    loading: isLoading,
    error: error?.message,
  };
}
