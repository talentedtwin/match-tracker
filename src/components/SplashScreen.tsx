"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SplashScreenProps {
  isLoaded: boolean;
  onComplete: () => void;
  message?: string;
  minDuration?: number;
}

export default function SplashScreen({
  isLoaded,
  onComplete,
  message = "Initializing...",
  minDuration = 2000,
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90 && !isLoaded) return prev; // Wait for loading to complete
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [isLoaded]);

  useEffect(() => {
    // Complete when loaded and progress is at 100%
    if (isLoaded && progress >= 100) {
      setShowComplete(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 500); // Small delay to show completion

      return () => clearTimeout(timer);
    }
  }, [isLoaded, progress, onComplete]);

  useEffect(() => {
    // Minimum duration safety net
    const minTimer = setTimeout(() => {
      if (isLoaded) {
        setProgress(100);
      }
    }, minDuration);

    return () => clearTimeout(minTimer);
  }, [isLoaded, minDuration]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 z-50">
      <div className="text-center max-w-md w-full">
        {/* App Logo/Icon */}
        <div className="mb-12">
          <div className="mb-6 flex justify-center">
            <Image
              src="/match-tracker.webp"
              alt="Match Tracker"
              width={128}
              height={128}
              className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 animate-fade-in">
            Match Tracker
          </h1>
          <p className="text-xl text-gray-600 animate-fade-in-delay">
            Track your grassroots football team&apos;s performance
          </p>
        </div>

        {/* Loading Section */}
        <div className="space-y-6">
          {/* Animated Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse delay-150"></div>
            <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse delay-300"></div>
          </div>

          {/* Status Message */}
          <p className="text-sm text-gray-500 h-6 transition-all duration-300">
            {showComplete ? "Ready!" : message}
          </p>

          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Branding */}
        {/* <div className="mt-12 text-xs text-gray-400 animate-fade-in-late">
          Grassroots Football Management
        </div> */}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          60% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-late {
          0% {
            opacity: 0;
          }
          80% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 2s ease-out;
        }

        .animate-fade-in-late {
          animation: fade-in-late 3s ease-out;
        }
      `}</style>
    </div>
  );
}
