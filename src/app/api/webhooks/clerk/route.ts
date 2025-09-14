import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser } from "@/lib/userService";
import { withDatabaseUserContext } from "@/lib/db-utils";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  try {
    switch (evt.type) {
      case "user.created":
        await handleUserCreated(evt);
        break;
      case "user.updated":
        await handleUserUpdated(evt);
        break;
      case "user.deleted":
        await handleUserDeleted(evt);
        break;
      default:
        console.log(`Unhandled webhook event type: ${evt.type}`);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleUserCreated(evt: WebhookEvent) {
  if (evt.type !== "user.created") return;

  const { id, email_addresses, first_name, last_name } = evt.data;

  if (!id) {
    throw new Error("User ID is missing in user.created event data");
  }

  const primaryEmail = email_addresses.find(
    (email) => email.id === evt.data.primary_email_address_id
  );

  if (!primaryEmail?.email_address) {
    throw new Error("Primary email address is missing for user creation");
  }

  const fullName = [first_name, last_name].filter(Boolean).join(" ").trim();

  // Create user in database
  await createUser({
    id,
    email: primaryEmail.email_address,
    name: fullName || "Unknown User",
  });

  console.log(`Created user: ${id} (${primaryEmail.email_address})`);
}

async function handleUserUpdated(evt: WebhookEvent) {
  if (evt.type !== "user.updated") return;

  const { id, email_addresses, first_name, last_name } = evt.data;

  if (!id) {
    throw new Error("User ID is missing in user.updated event data");
  }

  const primaryEmail = email_addresses.find(
    (email) => email.id === evt.data.primary_email_address_id
  );

  if (!primaryEmail?.email_address) {
    throw new Error("Primary email address is missing for user update");
  }

  const fullName = [first_name, last_name].filter(Boolean).join(" ").trim();

  // Update user in database with upsert pattern
  await withDatabaseUserContext(id, async () => {
    await prisma.user.upsert({
      where: { id },
      update: {
        email: primaryEmail.email_address,
        name: fullName,
        lastLoginAt: new Date(),
      },
      create: {
        id,
        email: primaryEmail.email_address,
        name: fullName,
        gdprConsentDate: new Date(),
        consentWithdrawn: false,
        isDeleted: false,
        lastLoginAt: new Date(),
      },
    });
  });

  console.log(`Updated user: ${id} (${primaryEmail.email_address})`);
}

async function handleUserDeleted(evt: WebhookEvent) {
  if (evt.type !== "user.deleted") return;

  const { id } = evt.data;

  if (!id) {
    throw new Error("User ID is missing in user.deleted event data");
  }

  // Soft delete the user and all related data
  await withDatabaseUserContext(id, async () => {
    // Soft delete user
    await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        consentWithdrawn: true,
        // Set data retention to 30 days for compliance
        dataRetentionUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Soft delete all players
    await prisma.player.updateMany({
      where: { userId: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Note: Matches and PlayerMatchStats will be handled by CASCADE constraints
    // or you can add explicit soft deletion here if needed
  });

  console.log(`Soft deleted user and related data for ID: ${id}`);
}
