"use client";

import React from "react";
import {
  Shield,
  Info,
  Database,
  Lock,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "October 10, 2025";
  const effectiveDate = "October 10, 2025";

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="border-b border-gray-300 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          PRIVACY POLICY
        </h1>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Effective Date:</strong> {effectiveDate}
          </p>
          <p>
            <strong>Last Updated:</strong> {lastUpdated}
          </p>
          <p>
            <strong>Document Version:</strong> 1.0
          </p>
        </div>
      </div>

      {/* Preamble */}
      <section className="mb-8">
        <div className="bg-white border border-gray-200 p-6 mb-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2 text-gray-600" />
            INTRODUCTION AND SCOPE
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy (&quot;Policy&quot;) governs the collection,
            processing, storage, and disclosure of personal information by Match
            Tracker (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or
            &quot;the Service&quot;) in accordance with applicable data
            protection laws, including but not limited to the General Data
            Protection Regulation (EU) 2016/679 (&quot;GDPR&quot;), the
            California Consumer Privacy Act (&quot;CCPA&quot;), and other
            relevant privacy legislation.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            By accessing or using our services, you (&quot;User,&quot;
            &quot;you,&quot; or &quot;your&quot;) acknowledge that you have
            read, understood, and agree to be bound by this Policy.
          </p>
        </div>
      </section>

      <div className="space-y-10">
        {/* Section 1: Information We Collect */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
            <Database className="w-6 h-6 mr-3 text-gray-600" />
            1. INFORMATION WE COLLECT
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                1.1 Personal Data Categories
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Identity and Contact Information:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 ml-4 space-y-1">
                      <li>
                        Email address (required for account creation and
                        authentication)
                      </li>
                      <li>Display name (optional, user-provided)</li>
                      <li>User-generated team and player names</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Sports Performance Data:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 ml-4 space-y-1">
                      <li>Match results, scores, and statistics</li>
                      <li>
                        Player performance metrics (goals, assists, match
                        participation)
                      </li>
                      <li>
                        Team management information and match scheduling data
                      </li>
                      <li>User-generated notes and match commentary</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Technical and Usage Data:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 ml-4 space-y-1">
                      <li>IP address, browser type, and device information</li>
                      <li>
                        Session data, login timestamps, and access patterns
                      </li>
                      <li>Application performance metrics and error logs</li>
                      <li>
                        Anonymized usage analytics and feature interaction data
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                1.2 Data Collection Methods
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Direct Collection
                  </h4>
                  <p className="text-sm text-gray-700">
                    Information you provide when creating an account, entering
                    match data, or contacting support.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Automatic Collection
                  </h4>
                  <p className="text-sm text-gray-700">
                    Technical data collected through your use of the application
                    and standard web technologies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Legal Basis */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
            <FileText className="w-6 h-6 mr-3 text-gray-600" />
            2. LEGAL BASIS FOR PROCESSING
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              In accordance with Article 6 of the GDPR, we process personal data
              under the following legal bases:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Consent (Article 6(1)(a))
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>Scope:</strong> Account creation, match data
                    processing, and team management features
                  </p>
                  <p>
                    <strong>Withdrawal:</strong> You may withdraw consent at any
                    time by deleting your account
                  </p>
                  <p>
                    <strong>Effect:</strong> Withdrawal will not affect the
                    lawfulness of processing prior to withdrawal
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Legitimate Interests (Article 6(1)(f))
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>Scope:</strong> Service improvement, security
                    monitoring, and technical maintenance
                  </p>
                  <p>
                    <strong>Balancing Test:</strong> Our interests do not
                    override your fundamental rights and freedoms
                  </p>
                  <p>
                    <strong>Right to Object:</strong> You may object to
                    processing under this basis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How We Use Information */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
            <CheckCircle className="w-6 h-6 mr-3 text-gray-600" />
            3. PURPOSES OF PROCESSING
          </h2>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-800 mb-4">
                We process your personal data for the following purposes:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Primary Functions
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      • Providing core match tracking and team management
                      services
                    </li>
                    <li>• Maintaining user accounts and authentication</li>
                    <li>• Storing and organizing sports performance data</li>
                    <li>• Generating statistics and performance analytics</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Secondary Functions
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      • Improving application functionality and user experience
                    </li>
                    <li>
                      • Ensuring platform security and preventing unauthorized
                      access
                    </li>
                    <li>
                      • Providing customer support and resolving technical
                      issues
                    </li>
                    <li>• Analyzing usage patterns for service optimization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Your Rights */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
            <Shield className="w-6 h-6 mr-3 text-gray-600" />
            4. YOUR DATA PROTECTION RIGHTS
          </h2>

          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Under applicable data protection laws, including the GDPR, you
              have the following rights regarding your personal data:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Right of Access (Article 15)
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Obtain confirmation of processing and access to your personal
                  data.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Response Time:</strong> Within 30 days of request
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Right to Rectification (Article 16)
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Correction of inaccurate or incomplete personal data.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Process:</strong> Available through account settings
                  or by request
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Right to Erasure (Article 17)
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Deletion of personal data under specific circumstances.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> Subject to legal and technical
                  limitations
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Right to Restrict Processing (Article 18)
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Limitation of processing under specific conditions.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Effect:</strong> Data stored but not actively
                  processed
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Right to Data Portability (Article 20)
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Transfer of data to another service provider.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Format:</strong> Structured, machine-readable format
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Right to Object (Article 21)
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Object to processing based on legitimate interests.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Result:</strong> Processing will cease unless
                  compelling grounds exist
                </p>
              </div>
            </div>

            <div className="bg-white border-l-4 border-blue-500 p-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Exercising Your Rights
              </h4>
              <p className="text-sm text-gray-700">
                To exercise any of these rights, contact us at{" "}
                <strong>info@matchtracker.co.uk</strong>. We will respond within
                30 days and may require verification of your identity for
                security purposes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Data Security and Retention */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
            <Lock className="w-6 h-6 mr-3 text-gray-600" />
            5. DATA SECURITY AND RETENTION
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                5.1 Security Measures
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">
                      Technical Safeguards:
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>
                        • End-to-end encryption for data in transit (TLS 1.3)
                      </li>
                      <li>
                        • Encryption at rest using industry-standard algorithms
                      </li>
                      <li>
                        • Multi-factor authentication and secure session
                        management
                      </li>
                      <li>
                        • Regular security audits and vulnerability assessments
                      </li>
                      <li>• Automated backup systems with encryption</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">
                      Organizational Measures:
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>
                        • Access controls and principle of least privilege
                      </li>
                      <li>
                        • Staff training on data protection and security
                        protocols
                      </li>
                      <li>
                        • Incident response and data breach notification
                        procedures
                      </li>
                      <li>• Regular review and update of security policies</li>
                      <li>
                        • Vendor security assessments and contractual safeguards
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                5.2 Data Retention Periods
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Active Account Data:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>
                          • Account information: Retained until account deletion
                        </li>
                        <li>
                          • Match and player data: Retained until user deletion
                        </li>
                        <li>
                          • User preferences: Retained until account deletion
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        System Data:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Security logs: 90 days maximum</li>
                        <li>• Performance analytics: 2 years maximum</li>
                        <li>• Error logs: 30 days maximum</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-3">
                    <p className="text-sm text-gray-800">
                      <strong>Account Deletion:</strong> Upon account deletion
                      request, personal data is permanently removed within 30
                      days, except where retention is required by law or for
                      legitimate business purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Third-Party Services */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
            <AlertCircle className="w-6 h-6 mr-3 text-gray-600" />
            6. THIRD-PARTY SERVICE PROVIDERS
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We engage certain third-party service providers to support our
              operations. These providers are contractually bound to protect
              your personal data and process it only as instructed.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-800 mb-4">
                Current Service Providers:
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-300 rounded p-3">
                    <h4 className="font-medium text-gray-800 mb-1">
                      Supabase Inc.
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Service:</strong> Database hosting and
                      authentication
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      <strong>Location:</strong> United States
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Safeguards:</strong> Standard Contractual Clauses
                      (SCCs)
                    </p>
                  </div>

                  <div className="bg-white border border-gray-300 rounded p-3">
                    <h4 className="font-medium text-gray-800 mb-1">
                      Vercel Inc.
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Service:</strong> Application hosting and CDN
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      <strong>Location:</strong> United States
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Safeguards:</strong> Standard Contractual Clauses
                      (SCCs)
                    </p>
                  </div>

                  <div className="bg-white border border-gray-300 rounded p-3">
                    <h4 className="font-medium text-gray-800 mb-1">
                      Clerk Dev Inc.
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Service:</strong> Authentication and user
                      management
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      <strong>Location:</strong> United States
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Safeguards:</strong> Standard Contractual Clauses
                      (SCCs)
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-800">
                    All third-party providers maintain industry-standard
                    security certifications (SOC 2, ISO 27001) and comply with
                    applicable data protection regulations including GDPR.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: International Transfers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
            <Database className="w-6 h-6 mr-3 text-gray-600" />
            7. INTERNATIONAL DATA TRANSFERS
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Your personal data may be transferred to and processed in
              countries outside your jurisdiction. We ensure appropriate
              safeguards are in place for all international transfers.
            </p>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">
                Transfer Safeguards:
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • European Commission Standard Contractual Clauses (SCCs)
                </li>
                <li>• Adequacy decisions where applicable</li>
                <li>• Additional security measures and impact assessments</li>
                <li>
                  • Regular review of transfer arrangements and safeguards
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 8: Contact and Complaints */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
            <FileText className="w-6 h-6 mr-3 text-gray-600" />
            8. CONTACT INFORMATION AND COMPLAINTS
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Data Controller Contact
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>Privacy Inquiries:</strong> info@matchtracker.co.uk
                  </p>
                  <p>
                    <strong>Data Protection Officer:</strong>{" "}
                    info@matchtracker.co.uk
                  </p>
                  <p>
                    <strong>General Support:</strong> support@matchtracker.co.uk
                  </p>
                  <p>
                    <strong>Response Time:</strong> Within 30 days of receipt
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Supervisory Authority
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    You have the right to lodge a complaint with your local data
                    protection authority if you believe your rights have been
                    violated.
                  </p>
                  <p>
                    <strong>EU Residents:</strong> Contact your national data
                    protection authority
                  </p>
                  <p>
                    <strong>UK Residents:</strong> Information
                    Commissioner&apos;s Office (ICO)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Policy Updates */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
            <Info className="w-6 h-6 mr-3 text-gray-600" />
            9. POLICY UPDATES AND CHANGES
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, technology, legal requirements, or other
              factors.
            </p>

            <div className="bg-white border-l-4 border-blue-500 p-4">
              <h3 className="font-medium text-gray-800 mb-2">
                Notification Process:
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • Material changes will be communicated via email or in-app
                  notification
                </li>
                <li>
                  • Updated policies will be posted on this page with revision
                  date
                </li>
                <li>
                  • Continued use of the service constitutes acceptance of
                  changes
                </li>
                <li>
                  • For significant changes, we may seek explicit consent where
                  required by law
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t-2 border-gray-300">
        <div className="bg-white rounded-lg p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">DOCUMENT INFORMATION</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Document Version:</strong> 1.0
            </p>
            <p>
              <strong>Effective Date:</strong> {effectiveDate}
            </p>
            <p>
              <strong>Last Reviewed:</strong> {lastUpdated}
            </p>
            <p>
              <strong>Next Review Date:</strong> October 10, 2026
            </p>
            <p>
              <strong>Governing Law:</strong> This policy is governed by
              applicable data protection laws
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              This Privacy Policy complies with the EU General Data Protection
              Regulation (GDPR), California Consumer Privacy Act (CCPA), and
              other applicable privacy laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
