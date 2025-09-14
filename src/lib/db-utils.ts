import { prisma } from "./prisma";

// =============================================================================
// ROW LEVEL SECURITY (RLS) UTILITIES
// =============================================================================

/**
 * Sets the current user ID in the database session for RLS policies
 * This should be called before any database operations that require user context
 */
export async function setDatabaseUserContext(userId: string): Promise<void> {
  if (!userId) {
    throw new Error("User ID is required for database context");
  }

  try {
    await prisma.$executeRaw`SELECT set_current_user_id(${userId})`;
  } catch (error) {
    console.error("Failed to set database user context:", error);
    throw new Error("Database context setup failed");
  }
}

/**
 * Clears the current user context in the database session
 */
export async function clearDatabaseUserContext(): Promise<void> {
  try {
    await prisma.$executeRaw`SELECT set_config('app.current_user_id', NULL, true)`;
  } catch (error) {
    console.error("Failed to clear database user context:", error);
    // Don't throw here as this is cleanup
  }
}

/**
 * Executes a database operation with user context
 * Automatically sets and clears the user context
 */
export async function withDatabaseUserContext<T>(
  userId: string,
  operation: () => Promise<T>
): Promise<T> {
  if (!userId) {
    throw new Error("User ID is required for database operations");
  }

  await setDatabaseUserContext(userId);

  try {
    const result = await operation();
    return result;
  } finally {
    await clearDatabaseUserContext();
  }
}

/**
 * Enables GDPR export mode for accessing soft-deleted data
 * Should only be used for legitimate data export requests
 */
export async function enableGDPRExportMode(): Promise<void> {
  try {
    await prisma.$executeRaw`SELECT set_config('app.gdpr_export_mode', 'true', true)`;
  } catch (error) {
    console.error("Failed to enable GDPR export mode:", error);
    throw new Error("GDPR export mode setup failed");
  }
}

/**
 * Disables GDPR export mode
 */
export async function disableGDPRExportMode(): Promise<void> {
  try {
    await prisma.$executeRaw`SELECT set_config('app.gdpr_export_mode', 'false', true)`;
  } catch (error) {
    console.error("Failed to disable GDPR export mode:", error);
    // Don't throw here as this is cleanup
  }
}

// =============================================================================
// EXISTING UTILITY FUNCTIONS
// =============================================================================

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
