import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UserService } from "@/lib/userService";

// GET /api/gdpr/export - Export user data (Article 15: Right of Access)
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    // Check if user has valid consent
    const consentStatus = await UserService.checkGDPRConsent(userId);
    if (!consentStatus.hasConsent) {
      return NextResponse.json(
        { error: `Cannot export data: ${consentStatus.reason}` },
        { status: 403 }
      );
    }

    // Export all user data
    const userData = await UserService.exportUserData(userId);

    // Set headers for file download
    const filename = `user-data-export-${userId}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    return new NextResponse(JSON.stringify(userData, null, 2), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json(
      { error: "Failed to export user data" },
      { status: 500 }
    );
  }
}

// DELETE /api/gdpr/export - Delete user account (Article 17: Right to Erasure)
export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    // Withdraw consent and mark for deletion
    await UserService.withdrawConsent(userId);

    return NextResponse.json(
      {
        message: "Account marked for deletion",
        notice:
          "Your data will be permanently deleted within 30 days as per GDPR requirements",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { error: "Failed to delete user account" },
      { status: 500 }
    );
  }
}
