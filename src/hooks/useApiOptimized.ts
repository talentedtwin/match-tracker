import useSWR from "swr";
import { ApiPlayer, ApiMatch, ApiPlayerMatchStat } from "../lib/api";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// SWR-based players hook with caching and revalidation
export function usePlayersOptimized(userId: string) {
  const { data, error, isLoading, mutate } = useSWR<ApiPlayer[]>(
    userId ? `/api/players?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  return {
    players: data || [],
    loading: isLoading,
    error: error?.message,
    mutate,
  };
}

// SWR-based matches hook with caching
export function useMatchesOptimized(userId: string) {
  const { data, error, isLoading, mutate } = useSWR<ApiMatch[]>(
    userId ? `/api/matches?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 3000, // More frequent updates for matches
    }
  );

  return {
    matches: data || [],
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
