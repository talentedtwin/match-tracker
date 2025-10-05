"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [showSplash, setShowSplash] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // Check if user has visited before (within this session)
    const visited = sessionStorage.getItem("app_visited");
    if (visited) {
      setHasVisited(true);
      // If already visited this session and loaded, redirect immediately
      if (isLoaded) {
        if (isSignedIn) {
          router.push("/dashboard");
        } else {
          router.push("/sign-in");
        }
        return;
      }
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSplashComplete = () => {
    setShowSplash(false);

    // Mark as visited for this session
    sessionStorage.setItem("app_visited", "true");

    // Redirect based on authentication status
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  // Get appropriate loading message
  const getLoadingMessage = () => {
    if (!isLoaded) return "Initializing...";
    if (isSignedIn) return "Welcome back!";
    return "Getting started...";
  };

  // If already visited and loaded, show minimal loading while redirecting
  if (hasVisited && isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!showSplash) {
    // Show a minimal loading state while transitioning
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <SplashScreen
      isLoaded={isLoaded}
      onComplete={handleSplashComplete}
      message={getLoadingMessage()}
      minDuration={2500}
    />
  );
}
