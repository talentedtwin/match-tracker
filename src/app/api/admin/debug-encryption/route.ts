import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EncryptionService } from "@/lib/encryption";

// GET /api/admin/debug-encryption - Debug encryption issues
export async function GET() {
  try {
    // Security check - only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Debug endpoint disabled in production" },
        { status: 403 }
      );
    }

    // Get a sample player to check encryption
    const samplePlayer = await prisma.player.findFirst({
      where: { isDeleted: false },
    });

    if (!samplePlayer) {
      return NextResponse.json({ message: "No players found" });
    }

    const debugInfo: {
      playerId: string;
      rawName: string;
      nameLength: number;
      hasColon: boolean;
      namePreview: string;
      encryptionKeySet: boolean;
      encryptionKeyLength: number;
      decryptionResult?: string;
      decryptedName?: string;
      decryptionError?: string;
      encryptionTest?: {
        original?: string;
        encrypted?: string;
        decrypted?: string;
        success: boolean;
        error?: string;
      };
    } = {
      playerId: samplePlayer.id,
      rawName: samplePlayer.name,
      nameLength: samplePlayer.name.length,
      hasColon: samplePlayer.name.includes(":"),
      namePreview: samplePlayer.name.substring(0, 50) + "...",
      encryptionKeySet: !!process.env.ENCRYPTION_KEY,
      encryptionKeyLength: process.env.ENCRYPTION_KEY?.length || 0,
    };

    // Try to decrypt
    try {
      const decrypted = EncryptionService.decrypt(samplePlayer.name);
      debugInfo.decryptionResult = "SUCCESS";
      debugInfo.decryptedName = decrypted;
    } catch (error) {
      debugInfo.decryptionResult = "FAILED";
      debugInfo.decryptionError =
        error instanceof Error ? error.message : "Unknown error";
    }

    // Test encryption/decryption with a known string
    try {
      const testString = "Test Player";
      const encrypted = EncryptionService.encrypt(testString);
      const decrypted = EncryptionService.decrypt(encrypted);

      debugInfo.encryptionTest = {
        original: testString,
        encrypted: encrypted.substring(0, 50) + "...",
        decrypted: decrypted,
        success: testString === decrypted,
      };
    } catch (error) {
      debugInfo.encryptionTest = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error("Debug failed:", error);
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
