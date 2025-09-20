import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { EncryptionService } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { createUser } from "@/lib/userService";
import { ensureUserExists } from "@/lib/user-utils";

// GET /api/users - Get authenticated user's profile
export async function GET() {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    await ensureUserExists(userId);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            players: true,
            matches: true,
            teams: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Decrypt sensitive fields before returning
    const decryptedUser = {
      ...user,
      email: EncryptionService.decrypt(user.email),
      name: user.name ? EncryptionService.decrypt(user.name) : null,
    };

    return NextResponse.json(decryptedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (fallback if webhook fails)
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create user directly without RLS context since they don't exist yet
    const user = await createUser({
      id: userId,
      email,
      name: name || "Unknown User",
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
