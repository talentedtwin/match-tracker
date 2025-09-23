// Lazy-loaded component wrappers for performance optimization
import { lazy } from "react";

// Heavy components that benefit from code splitting
export const LazyTeamManagement = lazy(() => import("./TeamManagement"));
export const LazyMatchScheduler = lazy(() => import("./MatchScheduler"));
export const LazyPrivacyPolicy = lazy(() => import("./PrivacyPolicy"));
export const LazyPrivacyDashboard = lazy(() => import("./PrivacyDashboard"));
export const LazyScheduledMatches = lazy(() => import("./ScheduledMatches"));
export const LazyEditMatchModal = lazy(() => import("./EditMatchModal"));

// Medium-sized components that could benefit from lazy loading in specific scenarios
export const LazyPlayerStats = lazy(() => import("./PlayerStats"));
export const LazyMatchHistory = lazy(() => import("./MatchHistory"));

// Keep frequently used/small components as regular imports
export { default as Navigation } from "./Navigation";
export { default as TeamScore } from "./TeamScore";
export { default as StatsSummary } from "./StatsSummary";
export { default as CurrentMatchHeader } from "./CurrentMatchHeader";
export { default as OfflineStatus } from "./OfflineStatus";
export { default as CreateTeamPrompt } from "./CreateTeamPrompt";
export * from "./Skeleton";
