import useSWR from "swr";
import { ApiPlayer, ApiMatch, ApiPlayerMatchStat, ApiTeam } from "../lib/api";

// Enhanced fetcher function with error handling and cache-busting
const fetcher = async (url: string) => {
  // Add cache-busting parameters for fresh login data
  const loginTime = localStorage.getItem("lastLoginTime");
  const separator = url.includes("?") ? "&" : "?";
  const cacheBustUrl = loginTime ? `${url}${separator}_t=${loginTime}` : url;

  const res = await fetch(cacheBustUrl, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

// Check if we're in a fresh login state (within 2 minutes of login)
const isFreshLogin = () => {
  const loginTime = localStorage.getItem("lastLoginTime");
  if (!loginTime) return false;
  const timeSinceLogin = Date.now() - parseInt(loginTime);
  return timeSinceLogin < 2 * 60 * 1000; // 2 minutes
};

// Dynamic configuration based on login state
const getPlayerConfig = () => ({
  revalidateOnFocus: isFreshLogin(), // Revalidate on focus after fresh login
  revalidateOnReconnect: true,
  dedupingInterval: isFreshLogin() ? 1000 : 10000, // More aggressive after login
  focusThrottleInterval: isFreshLogin() ? 5000 : 30000,
  refreshInterval: isFreshLogin() ? 10000 : 0, // Auto-refresh for 10s after login
});

const getMatchConfig = () => ({
  revalidateOnFocus: isFreshLogin(),
  revalidateOnReconnect: true,
  dedupingInterval: isFreshLogin() ? 500 : 5000,
  focusThrottleInterval: isFreshLogin() ? 2000 : 15000,
  refreshInterval: isFreshLogin() ? 5000 : 0, // More frequent refresh for matches
});

const getTeamConfig = () => ({
  revalidateOnFocus: isFreshLogin(),
  revalidateOnReconnect: true,
  dedupingInterval: isFreshLogin() ? 1000 : 15000,
  focusThrottleInterval: isFreshLogin() ? 10000 : 60000,
  refreshInterval: isFreshLogin() ? 15000 : 0,
});

// Enhanced SWR-based players hook with login-aware caching
export function usePlayersOptimized() {
  const { data, error, isLoading, mutate } = useSWR<ApiPlayer[]>(
    `/api/players`,
    fetcher,
    getPlayerConfig()
  );

  return {
    players: data || [],
    loading: isLoading,
    error: error?.message,
    mutate,
    refresh: () => mutate(), // Manual refresh function
  };
}

// Enhanced SWR-based matches hook with login-aware caching
export function useMatchesOptimized() {
  const { data, error, isLoading, mutate } = useSWR<ApiMatch[]>(
    `/api/matches`,
    fetcher,
    getMatchConfig()
  );

  return {
    matches: data || [],
    loading: isLoading,
    error: error?.message,
    mutate,
    refresh: () => mutate(),
  };
}

// Enhanced SWR-based teams hook with login-aware caching
export function useTeamsOptimized() {
  const { data, error, isLoading, mutate } = useSWR<ApiTeam[]>(
    `/api/teams`,
    fetcher,
    getTeamConfig()
  );

  return {
    teams: data || [],
    loading: isLoading,
    error: error?.message,
    mutate,
    refresh: () => mutate(),
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
