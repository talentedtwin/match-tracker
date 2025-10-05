import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbUtils } from "../../../lib/db-utils";
import { EncryptionService } from "../../../lib/encryption";
import { ensureUserExists } from "../../../lib/user-utils";
import { withRetry } from "../../../lib/prisma";

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Ensure user exists in database using enhanced connection management
    await ensureUserExists(clerkUserId);

    const teams = await withRetry(async () => {
      return await dbUtils.getTeams(clerkUserId);
    });

    // Decrypt team names
    const decryptedTeams = teams.map((team) => ({
      ...team,
      name: EncryptionService.decrypt(team.name),
    }));

    return NextResponse.json(decryptedTeams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    // Check if user already has teams and isn't premium
    const existingTeams = await withRetry(async () => {
      return await dbUtils.getTeams(clerkUserId);
    });

    const user = await withRetry(async () => {
      return await dbUtils.getUser(clerkUserId);
    });

    if (existingTeams.length >= 1 && !user?.isPremium) {
      return NextResponse.json(
        { error: "Premium subscription required for multiple teams" },
        { status: 403 }
      );
    }

    // Encrypt the team name
    const encryptedName = EncryptionService.encrypt(name.trim());

    const team = await withRetry(async () => {
      return await dbUtils.createTeam({
        name: encryptedName,
        userId: clerkUserId,
      });
    });

    // Return with decrypted name
    return NextResponse.json({
      ...team,
      name: name.trim(),
    });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
