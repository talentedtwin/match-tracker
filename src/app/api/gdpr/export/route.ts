import { NextRequest, NextResponse } from "next/server";
import GDPRService from "@/lib/gdpr";

// GET /api/gdpr/export - Export user data (Article 15: Right of Access)
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userData = await GDPRService.exportUserData(userId);

    // Set headers for file download
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set(
      "Content-Disposition",
      `attachment; filename="user-data-${userId}.json"`
    );

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
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await GDPRService.deleteUserAccount(userId);

    return NextResponse.json(
      { message: "User account marked for deletion" },
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
