import { prisma, ensurePrismaConnection } from "./prisma";
import { EncryptionService } from "./encryption";
import {
  withDatabaseUserContext,
  enableGDPRExportMode,
  disableGDPRExportMode,
} from "./db-utils";

export class UserService {
  /**
   * Get user profile with GDPR compliance info
   */
  static async getUserProfile(userId: string) {
    return await withDatabaseUserContext(userId, async () => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          gdprConsentDate: true,
          consentWithdrawn: true,
          dataRetentionUntil: true,
          lastLoginAt: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) return null;

      // Decrypt sensitive fields
      return {
        ...user,
        email: EncryptionService.decrypt(user.email),
        name: user.name ? EncryptionService.decrypt(user.name) : null,
      };
    });
  }

  /**
   * Update user's last login timestamp
   */
  static async updateLastLogin(userId: string) {
    return await withDatabaseUserContext(userId, async () => {
      return await prisma.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() },
      });
    });
  }

  /**
   * Withdraw GDPR consent and initiate data deletion process
   */
  static async withdrawConsent(userId: string) {
    return await withDatabaseUserContext(userId, async () => {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          consentWithdrawn: true,
          // Set data retention to 30 days as per GDPR
          dataRetentionUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    });
  }

  /**
   * Export all user data for GDPR compliance
   */
  static async exportUserData(userId: string) {
    return await withDatabaseUserContext(userId, async () => {
      // Enable GDPR export mode to access soft-deleted data
      await enableGDPRExportMode();

      try {
        // Get user profile
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        // Get all players (including soft-deleted)
        const players = await prisma.player.findMany({
          where: { userId },
        });

        // Get all matches
        const matches = await prisma.match.findMany({
          where: { userId },
          include: {
            playerStats: {
              include: {
                player: true,
              },
            },
          },
        });

        // Get all player match stats
        const playerMatchStats = await prisma.playerMatchStat.findMany({
          where: {
            player: { userId },
          },
          include: {
            player: true,
            match: true,
          },
        });

        return {
          user,
          players,
          matches,
          playerMatchStats,
          exportedAt: new Date().toISOString(),
          exportReason: "GDPR Data Export Request",
        };
      } finally {
        await disableGDPRExportMode();
      }
    });
  }

  /**
   * Get users whose data retention period has expired
   */
  static async getUsersForDeletion() {
    return await prisma.user.findMany({
      where: {
        dataRetentionUntil: {
          lte: new Date(),
        },
        isDeleted: false, // Not already deleted
      },
      select: {
        id: true,
        email: true,
        dataRetentionUntil: true,
        consentWithdrawn: true,
      },
    });
  }

  /**
   * Permanently delete user data (hard deletion for GDPR compliance)
   * This should only be called after the retention period has expired
   */
  static async permanentlyDeleteUser(userId: string) {
    return await withDatabaseUserContext(userId, async () => {
      // Delete in order to respect foreign key constraints

      // 1. Delete player match stats
      await prisma.playerMatchStat.deleteMany({
        where: {
          player: { userId },
        },
      });

      // 2. Delete players
      await prisma.player.deleteMany({
        where: { userId },
      });

      // 3. Delete matches
      await prisma.match.deleteMany({
        where: { userId },
      });

      // 4. Finally delete user
      await prisma.user.delete({
        where: { id: userId },
      });

      console.log(`Permanently deleted all data for user: ${userId}`);
    });
  }

  /**
   * Clean up expired user data (should be run as a scheduled job)
   */
  static async cleanupExpiredUserData() {
    const expiredUsers = await this.getUsersForDeletion();

    const results = [];
    for (const user of expiredUsers) {
      try {
        await this.permanentlyDeleteUser(user.id);
        results.push({ userId: user.id, status: "deleted", email: user.email });
      } catch (error) {
        console.error(`Failed to delete user ${user.id}:`, error);
        results.push({
          userId: user.id,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          email: user.email,
        });
      }
    }

    return results;
  }

  /**
   * Update user profile information
   */
  static async updateProfile(
    userId: string,
    data: { name?: string; email?: string }
  ) {
    return await withDatabaseUserContext(userId, async () => {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    });
  }

  /**
   * Check if user has given GDPR consent and it's still valid
   */
  static async checkGDPRConsent(userId: string) {
    return await withDatabaseUserContext(userId, async () => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          gdprConsentDate: true,
          consentWithdrawn: true,
          dataRetentionUntil: true,
          isDeleted: true,
        },
      });

      if (!user) return { hasConsent: false, reason: "User not found" };
      if (user.isDeleted) return { hasConsent: false, reason: "User deleted" };
      if (user.consentWithdrawn)
        return { hasConsent: false, reason: "Consent withdrawn" };
      if (!user.gdprConsentDate)
        return { hasConsent: false, reason: "No consent date" };

      const now = new Date();
      const retentionExpired =
        user.dataRetentionUntil && user.dataRetentionUntil < now;

      if (retentionExpired) {
        return { hasConsent: false, reason: "Data retention period expired" };
      }

      return {
        hasConsent: true,
        consentDate: user.gdprConsentDate,
        retentionUntil: user.dataRetentionUntil,
      };
    });
  }
}

// Convenience functions for webhook usage
export async function createUser(userData: {
  id: string;
  email: string;
  name: string;
}) {
  try {
    // Ensure Prisma connection is established first
    await ensurePrismaConnection();

    // Encrypt sensitive data before storing
    const encryptedEmail = EncryptionService.encrypt(userData.email);
    const encryptedName = userData.name
      ? EncryptionService.encrypt(userData.name)
      : null;

    // Don't use RLS context when creating a user since they don't exist yet
    return await prisma.user.create({
      data: {
        id: userData.id,
        email: encryptedEmail,
        name: encryptedName,
        gdprConsentDate: new Date(),
        consentWithdrawn: false,
        isDeleted: false,
        lastLoginAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    // If user already exists, try to update their last login
    if (error instanceof Error && error.message.includes("unique constraint")) {
      console.log(`User ${userData.id} already exists, updating last login`);

      // Ensure connection for the update as well
      await ensurePrismaConnection();

      return await prisma.user.update({
        where: { id: userData.id },
        data: { lastLoginAt: new Date() },
      });
    }
    throw error;
  }
}

export async function updateUser(
  userId: string,
  userData: { email?: string; name?: string }
) {
  return UserService.updateProfile(userId, userData);
}

export async function softDeleteUser(userId: string) {
  return await withDatabaseUserContext(userId, async () => {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        consentWithdrawn: true,
        dataRetentionUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  });
}
