"use client";

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";
import { PostHogTracker } from "../lib/posthog";

interface PostHogSignOutButtonProps {
  children: React.ReactNode;
}

export function PostHogSignOutButton({ children }: PostHogSignOutButtonProps) {
  const handleSignOut = () => {
    // Track user sign out and reset PostHog session
    PostHogTracker.captureEvent("user_signed_out");
    PostHogTracker.reset();
  };

  return (
    <ClerkSignOutButton>
      <div onClick={handleSignOut}>{children}</div>
    </ClerkSignOutButton>
  );
}
