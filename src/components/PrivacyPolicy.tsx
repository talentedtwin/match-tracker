"use client";

import React from "react";
import { Shield, Eye, Database, Lock, FileText } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
          <Shield className="w-8 h-8 mr-3 text-blue-500" />
          Privacy Policy
        </h1>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8">
        {/* What We Collect */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-500" />
            What Information We Collect
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Personal Information:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Email address (for account creation and communication)</li>
              <li>Name (optional, for personalization)</li>
              <li>Player names and statistics (for match tracking)</li>
              <li>Match data (scores, dates, opponent teams)</li>
            </ul>

            <h3 className="font-medium mb-2 mt-4">Technical Information:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>IP address and browser information</li>
              <li>Usage analytics and app performance data</li>
              <li>Login timestamps and session data</li>
            </ul>
          </div>
        </section>

        {/* Legal Basis */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-green-500" />
            Legal Basis for Processing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">
                Consent (Article 6(1)(a))
              </h3>
              <p className="text-sm text-green-700">
                For creating your account and processing match data for your
                team management.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">
                Legitimate Interest (Article 6(1)(f))
              </h3>
              <p className="text-sm text-blue-700">
                For app improvement, security, and providing core functionality.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Data */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-purple-500" />
            How We Use Your Information
          </h2>
          <div className="bg-purple-50 p-4 rounded-lg">
            <ul className="list-disc list-inside text-sm text-purple-700 space-y-2">
              <li>
                <strong>Core Functionality:</strong> Track players, matches, and
                team statistics
              </li>
              <li>
                <strong>Account Management:</strong> Create and maintain your
                user account
              </li>
              <li>
                <strong>Communication:</strong> Send important updates about
                your account
              </li>
              <li>
                <strong>Improvement:</strong> Analyze usage patterns to improve
                the app
              </li>
              <li>
                <strong>Security:</strong> Detect and prevent unauthorized
                access
              </li>
            </ul>
          </div>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-orange-500" />
            Your Privacy Rights (GDPR)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <h3 className="font-medium text-orange-800">Right to Access</h3>
                <p className="text-xs text-orange-700">
                  Get a copy of your personal data
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <h3 className="font-medium text-orange-800">
                  Right to Rectification
                </h3>
                <p className="text-xs text-orange-700">
                  Correct inaccurate information
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <h3 className="font-medium text-orange-800">
                  Right to Erasure
                </h3>
                <p className="text-xs text-orange-700">
                  Delete your personal data
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <h3 className="font-medium text-orange-800">
                  Right to Restrict Processing
                </h3>
                <p className="text-xs text-orange-700">
                  Limit how we use your data
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <h3 className="font-medium text-orange-800">
                  Right to Data Portability
                </h3>
                <p className="text-xs text-orange-700">
                  Transfer data to another service
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <h3 className="font-medium text-orange-800">Right to Object</h3>
                <p className="text-xs text-orange-700">
                  Object to certain processing
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-red-500" />
            Data Security & Retention
          </h2>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-red-800 mb-2">
                  Security Measures:
                </h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Encryption in transit and at rest</li>
                  <li>• Regular security audits</li>
                  <li>• Access controls and authentication</li>
                  <li>• Secure hosting infrastructure</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-800 mb-2">
                  Data Retention:
                </h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Account data: Until deletion requested</li>
                  <li>• Match data: 2 years from last activity</li>
                  <li>• Logs: 30 days maximum</li>
                  <li>• Deleted data: 30-day grace period</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Third Parties */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Third-Party Services
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              We use the following third-party services that may process your
              data:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>
                <strong>Supabase:</strong> Database hosting and authentication
              </li>
              <li>
                <strong>Vercel:</strong> Application hosting and deployment
              </li>
              <li>
                <strong>Analytics:</strong> Anonymous usage statistics (if
                enabled)
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              All third parties are GDPR compliant and have appropriate data
              processing agreements.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Contact & Complaints
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-2">
              For privacy-related questions or to exercise your rights:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                <strong>Email:</strong> privacy@matchtracker.app
              </li>
              <li>
                <strong>Data Protection Officer:</strong> dpo@matchtracker.app
              </li>
              <li>
                <strong>Response Time:</strong> Within 30 days
              </li>
            </ul>
            <p className="text-xs text-blue-600 mt-2">
              You also have the right to lodge a complaint with your local data
              protection authority.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          This privacy policy was last updated on{" "}
          {new Date().toLocaleDateString()} and complies with GDPR requirements.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
