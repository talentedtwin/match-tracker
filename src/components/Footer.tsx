"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Heart } from "lucide-react";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on authentication pages
  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) {
    return null;
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200 flex-shrink-0">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Links Section */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <Link
              href="/privacy-policy"
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Shield className="w-4 h-4 mr-1" />
              Privacy Policy
            </Link>
            {/* <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
             <a
              href="mailto:support@matchtracker.app"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact Support
            </a> 
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>*/}
          </div>

          {/* Copyright Section */}
          <div className="flex items-center text-sm text-gray-500">
            <span className="border-r pr-2">© {currentYear} Match Tracker</span>
            {/* <Heart className="w-4 h-4 mx-2 text-red-500" /> */}
            <span className="hidden sm:inline pl-2">
              Made for grassroots football
            </span>
            <span className="sm:hidden pl-2">For grassroots ⚽</span>
          </div>
        </div>

        {/* Optional App Version/Build Info for PWA */}
        {/* <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            <span className="hidden sm:inline">Progressive Web App • Install for offline access</span>
            <span className="sm:hidden">PWA • Install for offline use</span>
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
