import { NextRequest, NextResponse } from "next/server";
import GDPRService from "@/lib/gdpr";

// POST /api/gdpr/consent - Update user consent status
export async function POST(request: NextRequest) {
  try {
    const { userId, hasConsent } = await request.json();

    if (!userId || typeof hasConsent !== "boolean") {
      return NextResponse.json(
        { error: "User ID and consent status are required" },
        { status: 400 }
      );
    }

    if (hasConsent) {
      await GDPRService.recordConsent(userId);
    } else {
      await GDPRService.withdrawConsent(userId);
    }

    return NextResponse.json(
      {
        message: hasConsent
          ? "Consent granted successfully"
          : "Consent withdrawn successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating consent:", error);
    return NextResponse.json(
      { error: "Failed to update consent" },
      { status: 500 }
    );
  }
}
