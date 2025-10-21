"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { trackUserSignIn } from "../lib/posthog";

// PostHog provider to handle user identification
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

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
