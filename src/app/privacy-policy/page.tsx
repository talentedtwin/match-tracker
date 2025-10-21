"use client";

import React from "react";
import { Shield, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import PrivacyPolicy from "../../components/PrivacyPolicy";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {/* <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link> */}
              <Link
                href="/dashboard"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to App
              </Link>
            </div>
          </div>
          <p className="text-gray-600">
            Learn how Match Tracker protects your privacy and handles your data
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <PrivacyPolicy />
        </div>
      </div>
    </div>
  );
}
