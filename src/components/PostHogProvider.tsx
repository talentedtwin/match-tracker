"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import { trackUserSignIn } from "../lib/posthog";

// PostHog provider to handle user identification
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Initialize PostHog on the client side
    if (typeof window !== "undefined") {
      // Check if PostHog is already initialized
      if (!posthog.__loaded && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
          ui_host: "https://eu.posthog.com",
          capture_exceptions: true,
          debug: process.env.NODE_ENV === "development",
          disable_session_recording: true,
          // Ensure we're sending to the correct endpoint
          person_profiles: "identified_only",
          loaded: function () {
            if (process.env.NODE_ENV === "development") {
              console.log(
                "PostHog initialized successfully with host:",
                process.env.NEXT_PUBLIC_POSTHOG_HOST
              );
            }
          },
        });
      } else if (process.env.NODE_ENV === "development") {
        console.log("PostHog already loaded or no API key provided");
      }
    }
  }, []);

  useEffect(() => {
    // Only identify user after Clerk has loaded and user is authenticated
    if (isLoaded && user) {
      const userId = user.id;
      const email = user.primaryEmailAddress?.emailAddress;

      // Track user sign in with PostHog identify
      trackUserSignIn(userId, email);
    }
  }, [isLoaded, user]);

  return <>{children}</>;
}
