import posthog from "posthog-js"

// Initialize PostHog client with defaults and exception tracking
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  defaults: '2025-05-24',
  capture_exceptions: true, // Enables capturing exceptions via Error Tracking
  debug: process.env.NODE_ENV === "development",
});