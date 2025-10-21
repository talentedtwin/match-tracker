import posthog from "posthog-js";

// PostHog property types
type UserProperties = Record<string, string | number | boolean | Date>;
type EventProperties = Record<string, string | number | boolean | Date>;

// PostHog utility functions for tracking user events and identification
export class PostHogTracker {
  // Identify user when they sign in
  static identifyUser(userId: string, userProperties?: UserProperties) {
    if (typeof window !== "undefined" && posthog) {
      posthog.identify(userId, userProperties);
    }
  }

  // Capture custom events
  static captureEvent(eventName: string, properties?: EventProperties) {
    if (typeof window !== "undefined" && posthog) {
      posthog.capture(eventName, properties);
    }
  }

  // Reset user session (for sign out)
  static reset() {
    if (typeof window !== "undefined" && posthog) {
      posthog.reset();
    }
  }

  // Set user properties without identifying
  static setPersonProperties(properties: UserProperties) {
    if (typeof window !== "undefined" && posthog) {
      posthog.setPersonProperties(properties);
    }
  }
}

// Specific event tracking functions for match tracker
export const trackUserSignIn = (
  userId: string,
  email?: string,
  teamCount?: number
) => {
  const userProperties: UserProperties = {
    signInAt: new Date().toISOString(),
  };

  if (email) userProperties.email = email;
  if (teamCount !== undefined) userProperties.teamCount = teamCount;

  PostHogTracker.identifyUser(userId, userProperties);

  const eventProperties: EventProperties = { userId };
  if (email) eventProperties.email = email;
  if (teamCount !== undefined) eventProperties.teamCount = teamCount;

  PostHogTracker.captureEvent("user_signed_in", eventProperties);
};

export const trackUserSignUp = (userId: string, email?: string) => {
  const userProperties: UserProperties = {
    signUpAt: new Date().toISOString(),
    isNewUser: true,
  };

  if (email) userProperties.email = email;

  PostHogTracker.identifyUser(userId, userProperties);

  const eventProperties: EventProperties = { userId };
  if (email) eventProperties.email = email;

  PostHogTracker.captureEvent("user_signed_up", eventProperties);
};

export const trackMatchEvent = (
  eventName: string,
  matchData?: EventProperties
) => {
  const properties: EventProperties = {
    timestamp: new Date().toISOString(),
    ...matchData,
  };

  PostHogTracker.captureEvent(eventName, properties);
};

export const trackTeamEvent = (
  eventName: string,
  teamData?: EventProperties
) => {
  const properties: EventProperties = {
    timestamp: new Date().toISOString(),
    ...teamData,
  };

  PostHogTracker.captureEvent(eventName, properties);
};
