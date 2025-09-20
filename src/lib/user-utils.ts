import { clerkClient } from "@clerk/nextjs/server";
import { createUser } from "./userService";
import { prisma } from "./prisma";

export async function ensureUserExists(userId: string): Promise<void> {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
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
}
