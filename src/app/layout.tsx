import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import PWAUpdateNotification from "../components/PWAUpdateNotification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  shrinkToFit: false,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  title: "Match Tracker",
  description: "Track your grassroots football team's performance",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Match Tracker",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Match Tracker",
    "application-name": "Match Tracker",
    "msapplication-TileColor": "#3b82f6",
    "msapplication-tap-highlight": "no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en">
        <head>
          <link rel="icon" type="image/svg+xml" href="/icons/favicon.ico" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.webp" />
          <meta name="theme-color" content="#3b82f6" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navigation>{children}</Navigation>
          <PWAUpdateNotification />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
