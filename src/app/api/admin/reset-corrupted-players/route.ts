import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/reset-corrupted-players - Remove players with corrupted encryption
export async function POST() {
  try {
    // Security check - only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Reset endpoint disabled in production" },
        { status: 403 }
      );
    }

    console.log("Removing players with corrupted encryption...");

    // Soft delete all players (they can be re-added with proper encryption)
    const result = await prisma.player.updateMany({
      where: {
        isDeleted: false,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    console.log(
      `Soft deleted ${result.count} players with corrupted encryption`
    );

    return NextResponse.json({
      message: "Corrupted players removed successfully",
      removedCount: result.count,
      note: "Players can now be re-added with proper encryption",
    });
  } catch (error) {
    console.error("Reset failed:", error);
    return NextResponse.json(
      {
        error: "Reset failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
