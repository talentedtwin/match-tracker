"use client";

import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  Download,
  X,
  Smartphone,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useOffline } from "../hooks/useOffline";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function UnifiedStatusBar() {
  const { isOnline, pendingCount, lastSync, isSyncing, syncStatus, syncNow } =
    useOffline();

  // PWA Installation state
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Update notification state
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  // UI state
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastSyncFormatted, setLastSyncFormatted] = useState<string>("Never");

  // Format last sync time
  useEffect(() => {
    if (lastSync) {
      const formatLastSync = () => {
        const now = Date.now();
        const diff = now - lastSync;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
      };

      setLastSyncFormatted(formatLastSync());
      const interval = setInterval(() => {
        setLastSyncFormatted(formatLastSync());
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [lastSync]);

  // PWA installation detection
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // PWA update detection
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setRegistration(registration);

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setShowUpdatePrompt(true);
              }
            });
          }
        });
      });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  }, []);

  // Auto-dismiss install prompt
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const dayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < dayInMs) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstallPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleInstallDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  const handleUpdateClick = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      setShowUpdatePrompt(false);
    }
  };

  const handleSyncClick = async () => {
    if (!isSyncing && isOnline) {
      await syncNow();
    }
  };

  const getMainStatus = () => {
    if (showUpdatePrompt) {
      return {
        icon: <RefreshCw className="w-4 h-4 text-blue-600" />,
        text: "Update Available",
        bgColor: "bg-blue-100 border-blue-300 text-blue-800",
        action: "Update Now",
      };
    }

    if (showInstallPrompt && !isInstalled) {
      return {
        icon: <Download className="w-4 h-4 text-green-600" />,
        text: "Install App",
        bgColor: "bg-green-100 border-green-300 text-green-800",
        action: "Install",
      };
    }

    if (isInstalled) {
      return {
        icon: <Smartphone className="w-4 h-4 text-green-600" />,
        text: "App Installed",
        bgColor: "bg-green-100 border-green-300 text-green-800",
      };
    }

    if (isSyncing) {
      return {
        icon: <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />,
        text: "Syncing...",
        bgColor: "bg-blue-100 border-blue-300 text-blue-800",
      };
    }

    if (pendingCount > 0) {
      return {
        icon: <Clock className="w-4 h-4 text-yellow-600" />,
        text: `${pendingCount} pending`,
        bgColor: "bg-yellow-100 border-yellow-300 text-yellow-800",
        action: isOnline ? "Sync Now" : undefined,
      };
    }

    if (!isOnline) {
      return {
        icon: <WifiOff className="w-4 h-4 text-red-600" />,
        text: "Offline",
        bgColor: "bg-red-100 border-red-300 text-red-800",
      };
    }

    if (syncStatus === "success") {
      return {
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        text: "Synced",
        bgColor: "bg-green-100 border-green-300 text-green-800",
      };
    }

    if (syncStatus === "error") {
      return {
        icon: <AlertCircle className="w-4 h-4 text-red-600" />,
        text: "Sync Error",
        bgColor: "bg-red-100 border-red-300 text-red-800",
      };
    }

    return {
      icon: <Wifi className="w-4 h-4 text-green-600" />,
      text: "Online",
      bgColor: "bg-green-100 border-green-300 text-green-800",
    };
  };

  const handleMainAction = () => {
    if (showUpdatePrompt) {
      handleUpdateClick();
    } else if (showInstallPrompt && !isInstalled) {
      handleInstallClick();
    } else if (pendingCount > 0 && isOnline && !isSyncing) {
      handleSyncClick();
    }
  };

  const status = getMainStatus();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div
        className={`border rounded-lg shadow-lg backdrop-blur-sm bg-white/95 ${status.bgColor}`}
      >
        {/* Main Status Bar */}
        <div
          className="px-3 py-2 flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            {status.icon}
            <span className="text-sm font-medium">{status.text}</span>
          </div>

          <div className="flex items-center gap-2">
            {status.action && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMainAction();
                }}
                className="px-2 py-1 bg-white/50 rounded text-xs hover:bg-white/70 transition-colors"
                disabled={isSyncing}
              >
                {status.action}
              </button>
            )}

            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-white/20 px-3 py-3 bg-white/50">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Connection:</span>
                <span className={isOnline ? "text-green-600" : "text-red-600"}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Pending Changes:</span>
                <span
                  className={
                    pendingCount > 0 ? "text-yellow-600" : "text-green-600"
                  }
                >
                  {pendingCount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Last Sync:</span>
                <span className="text-gray-900">{lastSyncFormatted}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">App Status:</span>
                <span
                  className={isInstalled ? "text-green-600" : "text-gray-600"}
                >
                  {isInstalled ? "Installed" : "Web Version"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 space-y-2">
              {showUpdatePrompt && (
                <button
                  onClick={handleUpdateClick}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Update App
                </button>
              )}

              {showInstallPrompt && !isInstalled && (
                <div className="flex gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Install
                  </button>
                  <button
                    onClick={handleInstallDismiss}
                    className="px-3 py-2 text-gray-600 text-sm font-medium hover:text-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isOnline && pendingCount > 0 && (
                <button
                  onClick={handleSyncClick}
                  disabled={isSyncing}
                  className="w-full bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Sync Now
                    </>
                  )}
                </button>
              )}
            </div>

            {!isOnline && pendingCount > 0 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                Changes will sync automatically when you&apos;re back online.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
