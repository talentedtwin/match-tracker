import { clerkClient } from "@clerk/nextjs/server";
import { createUser } from "./userService";
import { prisma, withRetry, checkDatabaseConnection } from "./prisma";

export async function ensureUserExists(userId: string): Promise<void> {
  try {
    // First check if database is reachable
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error("Database connection not available");
      throw new Error("Database connection failed");
    }

    const existingUser = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
      });
    });

    if (!existingUser) {
      console.log(`User ${userId} not found in database, creating...`);

      try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);

        const primaryEmail = clerkUser.emailAddresses.find(
          (email) => email.id === clerkUser.primaryEmailAddressId
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

        console.log(`Successfully created user ${userId} in database`);
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user profile");
      }
    }
  } catch (error) {
    console.error("Error in ensureUserExists:", error);
    // If it's a database connection error, provide a more specific message
    if (
      error instanceof Error &&
      error.message.includes("Can't reach database")
    ) {
      throw new Error(
        "Database connection failed. Please check your database configuration."
      );
    }
    throw error;
  }
}
