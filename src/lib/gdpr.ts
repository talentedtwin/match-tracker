import { prisma } from "./prisma";

export interface GDPRExportData {
  user: {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
    gdprConsentDate?: string;
  };
  players: Array<{
    id: string;
    name: string;
    goals: number;
    assists: number;
    createdAt: string;
  }>;
  matches: Array<{
    id: string;
    opponent: string;
    date: string;
    goalsFor: number;
    goalsAgainst: number;
    matchType: string;
    notes?: string;
    createdAt: string;
  }>;
}

class GDPRService {
  /**
   * Export all user data for GDPR Article 15 (Right of Access)
   */
  static async exportUserData(userId: string): Promise<GDPRExportData> {
    const user = await prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
      include: {
        players: {
          where: { isDeleted: false },
        },
        matches: {
          where: { isFinished: true }, // Only export completed matches
        },
      },
    });

    if (!user) {
      throw new Error("User not found or account deleted");
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        createdAt: user.createdAt.toISOString(),
        gdprConsentDate: user.gdprConsentDate?.toISOString(),
      },
      players: user.players.map((player) => ({
        id: player.id,
        name: player.name,
        goals: player.goals,
        assists: player.assists,
        createdAt: player.createdAt.toISOString(),
      })),
      matches: user.matches.map((match) => ({
        id: match.id,
        opponent: match.opponent,
        date: match.date.toISOString(),
        goalsFor: match.goalsFor,
        goalsAgainst: match.goalsAgainst,
        matchType: match.matchType,
        notes: match.notes || undefined,
        createdAt: match.createdAt.toISOString(),
      })),
    };
  }

  /**
   * Record user consent for GDPR compliance
   */
  static async recordConsent(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        gdprConsentDate: new Date(),
        consentWithdrawn: false,
      },
    });
  }

  /**
   * Withdraw user consent (GDPR Article 7)
   */
  static async withdrawConsent(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        consentWithdrawn: true,
        dataRetentionUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
  }

  /**
   * Delete user account and all related data (GDPR Article 17 - Right to Erasure)
   */
  static async deleteUserAccount(userId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Soft delete all players
      await tx.player.updateMany({
        where: { userId, isDeleted: false },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      // Delete player match stats (hard delete as they're derived data)
      await tx.playerMatchStat.deleteMany({
        where: {
          player: { userId },
        },
      });

      // Delete matches (hard delete)
      await tx.match.deleteMany({
        where: { userId },
      });

      // Soft delete user
      await tx.user.update({
        where: { id: userId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          email: `deleted-${userId}@deleted.local`, // Anonymize email
          name: null,
        },
      });
    });
  }

  /**
   * Clean up old deleted data beyond retention period
   */
  static async cleanupExpiredData(): Promise<void> {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    await prisma.$transaction(async (tx) => {
      // Find users marked for deletion beyond retention period
      const expiredUsers = await tx.user.findMany({
        where: {
          isDeleted: true,
          deletedAt: { lt: cutoffDate },
        },
      });

      for (const user of expiredUsers) {
        // Hard delete all related data
        await tx.playerMatchStat.deleteMany({
          where: { player: { userId: user.id } },
        });

        await tx.player.deleteMany({
          where: { userId: user.id },
        });

        await tx.match.deleteMany({
          where: { userId: user.id },
        });

        await tx.user.delete({
          where: { id: user.id },
        });
      }
    });
  }

  /**
   * Get user consent status
   */
  static async getConsentStatus(userId: string): Promise<{
    hasConsent: boolean;
    consentDate?: Date;
    isWithdrawn: boolean;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
      select: {
        gdprConsentDate: true,
        consentWithdrawn: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      hasConsent: !!user.gdprConsentDate && !user.consentWithdrawn,
      consentDate: user.gdprConsentDate || undefined,
      isWithdrawn: user.consentWithdrawn,
    };
  }

  /**
   * Update data retention period for a user
   */
  static async updateDataRetention(
    userId: string,
    retentionDays: number
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        dataRetentionUntil: new Date(
          Date.now() + retentionDays * 24 * 60 * 60 * 1000
        ),
      },
    });
  }

  /**
   * Get users whose data should be cleaned up
   */
  static async getUsersForCleanup(): Promise<string[]> {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          // Users who withdrew consent and retention period expired
          {
            consentWithdrawn: true,
            dataRetentionUntil: { lt: new Date() },
          },
          // Inactive users (haven't logged in for a year)
          {
            lastLoginAt: {
              lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            },
          },
        ],
        isDeleted: false,
      },
      select: { id: true },
    });

    return users.map((user) => user.id);
  }
}

// Export as default
export default GDPRService;

// Also export as named export for flexibility
export { GDPRService };
