import { useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

interface AuthSyncOptions {
  onLogin?: () => void;
  onLogout?: () => void;
  preserveMatchState?: boolean;
}

/**
 * Hook to detect authentication state changes and trigger data refreshes
 * Ensures fresh data is fetched on login while preserving ongoing match state
 */
export function useAuthSync(options: AuthSyncOptions = {}) {
  const { user, isLoaded } = useUser();
  const previousAuthState = useRef<{
    isAuthenticated: boolean;
    userId: string | null;
    initialized: boolean;
  }>({
    isAuthenticated: false,
    userId: null,
    initialized: false,
  });

  // Check if there's an ongoing match in localStorage
  const hasOngoingMatch = useCallback(() => {
    if (typeof window === "undefined") return false;

    try {
      const currentMatch = localStorage.getItem("currentMatch");
      const matchState = localStorage.getItem("matchState");
      return !!(currentMatch && matchState);
    } catch {
      return false;
    }
  }, []);

  // Clear cache data but preserve match state if needed
  const clearCacheData = useCallback((preserveMatch = false) => {
    if (typeof window === "undefined") return;

    try {
      // Get ongoing match data before clearing
      const currentMatch = preserveMatch
        ? localStorage.getItem("currentMatch")
        : null;
      const matchState = preserveMatch
        ? localStorage.getItem("matchState")
        : null;

      // Clear all SWR cache
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            if (name.includes("swr") || name.includes("api")) {
              caches.delete(name);
            }
          });
        });
      }

      // Clear localStorage cache entries (but preserve auth and match if needed)
      const keysToPreserve = [
        "clerk-db-jwt",
        ...(preserveMatch && currentMatch
          ? ["currentMatch", "matchState"]
          : []),
      ];

      Object.keys(localStorage).forEach((key) => {
        if (
          (key.startsWith("swr") ||
            key.startsWith("api-cache") ||
            key.startsWith("players-") ||
            key.startsWith("matches-") ||
            key.startsWith("teams-")) &&
          !keysToPreserve.includes(key)
        ) {
          localStorage.removeItem(key);
        }
      });

      // Restore match state if it was preserved
      if (preserveMatch && currentMatch) {
        localStorage.setItem("currentMatch", currentMatch);
        if (matchState) {
          localStorage.setItem("matchState", matchState);
        }
      }

      console.log(
        "🧹 Cache cleared on login",
        preserveMatch ? "(match state preserved)" : ""
      );
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }, []);

  // Add cache-busting headers for API requests
  const addCacheBustingHeaders = useCallback(() => {
    if (typeof window === "undefined") return;

    // Add timestamp to prevent caching
    const timestamp = Date.now();

    // Store login timestamp for cache-busting
    localStorage.setItem("lastLoginTime", timestamp.toString());

    // Add event listener for fetch requests to add cache-busting headers
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const [resource, config] = args;

      // Only modify API calls
      if (typeof resource === "string" && resource.startsWith("/api/")) {
        const modifiedConfig = {
          ...config,
          headers: {
            ...config?.headers,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            "X-Login-Time": timestamp.toString(),
          },
        };
        return originalFetch(resource, modifiedConfig);
      }

      return originalFetch(...args);
    };

    // Restore original fetch after 5 minutes
    setTimeout(() => {
      window.fetch = originalFetch;
    }, 5 * 60 * 1000);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const currentState = {
      isAuthenticated: !!user,
      userId: user?.id || null,
      initialized: true,
    };

    // Check if this is a login event (was not authenticated, now is)
    const isLoginEvent =
      previousAuthState.current.initialized &&
      !previousAuthState.current.isAuthenticated &&
      currentState.isAuthenticated;

    // Check if this is a logout event
    const isLogoutEvent =
      previousAuthState.current.initialized &&
      previousAuthState.current.isAuthenticated &&
      !currentState.isAuthenticated;

    // Check if user changed (different user logged in)
    const isUserChange =
      previousAuthState.current.initialized &&
      previousAuthState.current.userId !== currentState.userId &&
      currentState.isAuthenticated;

    if (isLoginEvent || isUserChange) {
      console.log("🔑 Login detected, refreshing data...");

      // Check if we should preserve match state
      const hasMatch = hasOngoingMatch();
      const shouldPreserve = options.preserveMatchState !== false && hasMatch;

      // Clear cache data
      clearCacheData(shouldPreserve);

      // Add cache-busting headers for immediate requests
      addCacheBustingHeaders();

      // Trigger refresh callback
      if (options.onLogin) {
        // Small delay to ensure auth is fully processed
        setTimeout(() => {
          options.onLogin!();
        }, 100);
      }

      if (shouldPreserve) {
        console.log("🏃‍♂️ Ongoing match detected - preserving match state");
      }
    }

    if (isLogoutEvent) {
      console.log("🚪 Logout detected");

      // Clear all cache data on logout
      clearCacheData(false);

      if (options.onLogout) {
        options.onLogout();
      }
    }

    // Update previous state
    previousAuthState.current = currentState;
  }, [
    user,
    isLoaded,
    options,
    hasOngoingMatch,
    clearCacheData,
    addCacheBustingHeaders,
  ]);

  return {
    isAuthenticated: !!user,
    userId: user?.id || null,
    isLoaded,
    clearCache: clearCacheData,
    hasOngoingMatch: hasOngoingMatch(),
  };
}
