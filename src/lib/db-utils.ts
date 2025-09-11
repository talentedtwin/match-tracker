import { prisma } from "./prisma";

// Utility function to retry database operations
export async function retryDbOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Check if it's a connection error
      if (
        error instanceof Error &&
        (error.message.includes("Can't reach database server") ||
          error.message.includes("Connection timeout"))
      ) {
        console.log(
          `Database connection attempt ${attempt} failed, retrying in ${delay}ms...`
        );

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }
      }

      // If it's not a connection error, throw immediately
      throw error;
    }
  }

  throw lastError!;
}

// Wrapper function for common database operations
export const dbOperations = {
  async getMatches(userId: string) {
    return retryDbOperation(() =>
      prisma.match.findMany({
        where: { userId },
        include: {
          playerStats: {
            include: {
              player: true,
            },
          },
        },
        orderBy: { date: "desc" },
      })
    );
  },

  async getPlayers(userId: string) {
    return retryDbOperation(() =>
      prisma.player.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        orderBy: { name: "asc" },
      })
    );
  },

  async getStats(userId: string) {
    return retryDbOperation(() =>
      prisma.match.findMany({
        where: { userId },
        include: {
          playerStats: {
            include: {
              player: true,
            },
          },
        },
      })
    );
  },
};
