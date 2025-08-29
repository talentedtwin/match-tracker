import { prisma } from "./prisma";
import { EncryptionService } from "./encryption";

export interface EncryptedPlayer {
  id: string;
  name: string; // This will be decrypted for display
  goals: number;
  assists: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export class PlayerService {
  /**
   * Create a new player with encrypted name
   */
  static async createPlayer(
    userId: string,
    name: string
  ): Promise<EncryptedPlayer> {
    const encryptedName = EncryptionService.encrypt(name);

    const player = await prisma.player.create({
      data: {
        name: encryptedName,
        userId,
      },
    });

    return {
      ...player,
      name, // Return original name for immediate use
    };
  }

  /**
   * Get all players for a user with decrypted names
   */
  static async getPlayersForUser(userId: string): Promise<EncryptedPlayer[]> {
    const players = await prisma.player.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        name: "asc",
      },
    });

    return players.map((player) => ({
      ...player,
      name: this.decryptPlayerName(player.name),
    }));
  }

  /**
   * Get a single player with decrypted name
   */
  static async getPlayer(playerId: string): Promise<EncryptedPlayer | null> {
    const player = await prisma.player.findUnique({
      where: {
        id: playerId,
        isDeleted: false,
      },
    });

    if (!player) return null;

    return {
      ...player,
      name: this.decryptPlayerName(player.name),
    };
  }

  /**
   * Update a player's name (with encryption)
   */
  static async updatePlayer(
    playerId: string,
    updates: Partial<{ name: string; goals: number; assists: number }>
  ): Promise<EncryptedPlayer> {
    const updateData: Partial<{
      name: string;
      goals: number;
      assists: number;
    }> = { ...updates };

    if (updates.name) {
      updateData.name = EncryptionService.encrypt(updates.name);
    }

    const player = await prisma.player.update({
      where: { id: playerId },
      data: updateData,
    });

    return {
      ...player,
      name: updates.name || this.decryptPlayerName(player.name),
    };
  }

  /**
   * Soft delete a player
   */
  static async deletePlayer(playerId: string): Promise<void> {
    await prisma.player.update({
      where: { id: playerId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Update player stats
   */
  static async updatePlayerStats(
    playerId: string,
    goals: number,
    assists: number
  ): Promise<EncryptedPlayer> {
    const player = await prisma.player.update({
      where: { id: playerId },
      data: { goals, assists },
    });

    return {
      ...player,
      name: this.decryptPlayerName(player.name),
    };
  }

  /**
   * Search players by name (searches decrypted names)
   */
  static async searchPlayers(
    userId: string,
    searchTerm: string
  ): Promise<EncryptedPlayer[]> {
    // Get all players first, then filter by decrypted names
    // This is not the most efficient but necessary for encrypted data
    const allPlayers = await this.getPlayersForUser(userId);

    return allPlayers.filter((player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Get top scorers for a user
   */
  static async getTopScorers(
    userId: string,
    limit: number = 10
  ): Promise<EncryptedPlayer[]> {
    const players = await prisma.player.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        goals: "desc",
      },
      take: limit,
    });

    return players.map((player) => ({
      ...player,
      name: this.decryptPlayerName(player.name),
    }));
  }

  /**
   * Get players with most assists
   */
  static async getTopAssistProviders(
    userId: string,
    limit: number = 10
  ): Promise<EncryptedPlayer[]> {
    const players = await prisma.player.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        assists: "desc",
      },
      take: limit,
    });

    return players.map((player) => ({
      ...player,
      name: this.decryptPlayerName(player.name),
    }));
  }

  /**
   * Decrypt a player name safely
   */
  private static decryptPlayerName(encryptedName: string): string {
    try {
      return EncryptionService.decrypt(encryptedName);
    } catch (error) {
      console.error("Failed to decrypt player name:", error);
      return "Unknown Player"; // Fallback for corrupted data
    }
  }

  /**
   * Re-encrypt all player names (for key rotation)
   */
  static async reencryptAllPlayers(): Promise<void> {
    const players = await prisma.player.findMany({
      where: { isDeleted: false },
    });

    for (const player of players) {
      try {
        // Decrypt with old key, encrypt with new key
        const decryptedName = EncryptionService.decrypt(player.name);
        const reencryptedName = EncryptionService.encrypt(decryptedName);

        await prisma.player.update({
          where: { id: player.id },
          data: { name: reencryptedName },
        });
      } catch (error) {
        console.error(`Failed to re-encrypt player ${player.id}:`, error);
      }
    }
  }
}
