"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  History,
  Users,
  BarChart3,
  LogOut,
  User,
} from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import UnifiedStatusBar from "./UnifiedStatusBar";

interface NavigationProps {
  children: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const navigationItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      description: "Main dashboard and current match",
    },
    {
      href: "/history",
      label: "Match History",
      icon: History,
      description: "View past matches and results",
    },
    {
      href: "/players",
      label: "Teams",
      icon: Users,
      description: "Manage teams and assign players",
    },
    {
      href: "/stats",
      label: "Statistics",
      icon: BarChart3,
      description: "Team and player analytics",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">⚽</span>
                <span className="text-xl font-bold text-gray-800">
                  Match Tracker
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex space-x-8">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Info and Logout */}
              {isLoaded && user && (
                <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {user.firstName || user.emailAddresses[0]?.emailAddress}
                    </span>
                  </div>
                  <SignOutButton>
                    <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </SignOutButton>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {/* User avatar for mobile header */}
              {isLoaded && user && (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-green-600" />
                </div>
              )}
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {/* User Info for Mobile */}
              {isLoaded && user && (
                <div className="px-3 py-3 border-b border-gray-200 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName || "User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.emailAddresses[0]?.emailAddress}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Logout Button for Mobile */}
              {isLoaded && user && (
                <div className="border-t border-gray-200 pt-2">
                  <SignOutButton>
                    <button
                      className="flex items-center space-x-3 px-3 py-3 w-full text-left rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={closeMenu}
                    >
                      <LogOut className="w-5 h-5" />
                      <div>
                        <div>Logout</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Sign out of your account
                        </div>
                      </div>
                    </button>
                  </SignOutButton>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Unified Status Bar */}
      <UnifiedStatusBar />
    </div>
  );
};

export default Navigation;
