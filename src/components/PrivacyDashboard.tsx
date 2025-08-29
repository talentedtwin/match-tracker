"use client";

import React, { useState } from "react";
import {
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

interface PrivacyDashboardProps {
  userId: string;
  userEmail: string;
  consentDate?: string;
  hasConsent: boolean;
}

const PrivacyDashboard: React.FC<PrivacyDashboardProps> = ({
  userId,
  userEmail,
  consentDate,
  hasConsent,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [consentStatus, setConsentStatus] = useState(hasConsent);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/gdpr/export?userId=${userId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `user-data-${userId}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
    }
    setIsExporting(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/gdpr/export", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert(
          "Your account has been marked for deletion. You will be logged out."
        );
        // Redirect to logout or home page
        window.location.href = "/";
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const handleConsentChange = async (newConsent: boolean) => {
    try {
      const response = await fetch("/api/gdpr/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, hasConsent: newConsent }),
      });

      if (response.ok) {
        setConsentStatus(newConsent);
        alert(
          newConsent
            ? "Consent granted successfully"
            : "Consent withdrawn successfully"
        );
      } else {
        throw new Error("Failed to update consent");
      }
    } catch (error) {
      console.error("Error updating consent:", error);
      alert("Failed to update consent. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Shield className="w-6 h-6 mr-3 text-blue-500" />
        Privacy & Data Management
      </h2>

      {/* Current Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          Your Data Status
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Email:</strong> {userEmail}
          </p>
          <p>
            <strong>User ID:</strong> {userId}
          </p>
          {consentDate && (
            <p>
              <strong>Consent Given:</strong>{" "}
              {new Date(consentDate).toLocaleDateString()}
            </p>
          )}
          <div className="flex items-center mt-2">
            {consentStatus ? (
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
            )}
            <span className={consentStatus ? "text-green-600" : "text-red-600"}>
              {consentStatus
                ? "Data processing consent active"
                : "Data processing consent withdrawn"}
            </span>
          </div>
        </div>
      </div>

      {/* GDPR Rights */}
      <div className="space-y-4">
        {/* Right to Access */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center">
            <Download className="w-4 h-4 mr-2 text-blue-500" />
            Right to Access Your Data
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Download a copy of all data we have stored about you, including your
            profile, players, and match history.
          </p>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Export My Data"}
          </button>
        </div>

        {/* Consent Management */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Consent Management
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            You can withdraw your consent for data processing at any time. This
            will restrict how we process your data but won&apos;t delete your
            account.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleConsentChange(true)}
              disabled={consentStatus}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Grant Consent
            </button>
            <button
              onClick={() => handleConsentChange(false)}
              disabled={!consentStatus}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Withdraw Consent
            </button>
          </div>
        </div>

        {/* Right to Erasure */}
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center">
            <Trash2 className="w-4 h-4 mr-2 text-red-500" />
            Right to Erasure (Delete Account)
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-red-100 border border-red-200 rounded">
                <div className="flex items-center text-red-800 mb-2">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="font-medium">Confirm Account Deletion</span>
                </div>
                <p className="text-sm text-red-700">
                  This will permanently delete your account, all players, and
                  match history. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Your Privacy Rights</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            • <strong>Right to Access:</strong> Get a copy of your personal data
          </p>
          <p>
            • <strong>Right to Rectification:</strong> Correct inaccurate data
          </p>
          <p>
            • <strong>Right to Erasure:</strong> Delete your personal data
          </p>
          <p>
            • <strong>Right to Restrict Processing:</strong> Limit how we use
            your data
          </p>
          <p>
            • <strong>Right to Data Portability:</strong> Transfer your data to
            another service
          </p>
          <p>
            • <strong>Right to Object:</strong> Object to certain types of
            processing
          </p>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          For questions about your privacy rights, contact us at
          privacy@yourapp.com
        </p>
      </div>
    </div>
  );
};

export default PrivacyDashboard;
