import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { dbUtils } from "../../../lib/db-utils";
import { EncryptionService } from "../../../lib/encryption";
import { createUser } from "../../../lib/userService";
import { prisma } from "../../../lib/prisma";

// Helper function to ensure user exists in database
async function ensureUserExists(userId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    console.log(`User ${userId} not found, creating...`);

    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);

      const primaryEmail = clerkUser.emailAddresses.find(
        (email: { id: string; emailAddress: string }) =>
          email.id === clerkUser.primaryEmailAddressId
      );

      if (!primaryEmail) {
        throw new Error("No primary email address found");
      }

      const fullName = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      await createUser({
        id: userId,
        email: primaryEmail.emailAddress,
        name: fullName || "Unknown User",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user profile");
    }
  }
}

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    await ensureUserExists(clerkUserId);

    const teams = await dbUtils.getTeams(clerkUserId);

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
    const existingTeams = await dbUtils.getTeams(clerkUserId);
    const user = await dbUtils.getUser(clerkUserId);

    if (existingTeams.length >= 1 && !user?.isPremium) {
      return NextResponse.json(
        { error: "Premium subscription required for multiple teams" },
        { status: 403 }
      );
    }

    // Encrypt the team name
    const encryptedName = EncryptionService.encrypt(name.trim());

    const team = await dbUtils.createTeam({
      name: encryptedName,
      userId: clerkUserId,
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
