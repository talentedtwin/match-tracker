import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { withDatabaseUserContext } from "@/lib/db-utils";

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

    // Use RLS context to get user's own data
    const user = await withDatabaseUserContext(userId, async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              players: true,
              matches: true,
            },
          },
        },
      });
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (should typically be handled by webhook)
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

    // Use RLS context for database operations
    const user = await withDatabaseUserContext(userId, async () => {
      return await prisma.user.create({
        data: {
          id: userId, // Use the authenticated user's ID from Clerk
          email,
          name: name || null,
          gdprConsentDate: new Date(),
          consentWithdrawn: false,
          isDeleted: false,
        },
      });
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
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
