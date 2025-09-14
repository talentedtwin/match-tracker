import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UserService } from "@/lib/userService";

// POST /api/gdpr/consent - Update user consent status
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === "withdraw") {
      // Withdraw consent and initiate data deletion process
      const result = await UserService.withdrawConsent(userId);

      return NextResponse.json({
        message: "Consent withdrawn successfully",
        dataRetentionUntil: result.dataRetentionUntil,
        notice:
          "Your data will be deleted within 30 days as per GDPR requirements",
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'withdraw' to withdraw consent." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing consent request:", error);
    return NextResponse.json(
      { error: "Failed to process consent request" },
      { status: 500 }
    );
  }
}

// GET /api/gdpr/consent - Check current consent status
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    const consentStatus = await UserService.checkGDPRConsent(userId);

    return NextResponse.json(consentStatus);
  } catch (error) {
    console.error("Error checking consent status:", error);
    return NextResponse.json(
      { error: "Failed to check consent status" },
      { status: 500 }
    );
  }
}
