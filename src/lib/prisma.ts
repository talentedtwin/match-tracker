import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Connection health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // First try a simple connection test
    await prisma.$connect();

    // Then try a simple query
    await prisma.$queryRaw`SELECT 1 as test`;

    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection check failed:", error);

    // Try to provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes("Can't reach database server")) {
        console.error(
          "🔌 Network connectivity issue - database server unreachable"
        );
      } else if (error.message.includes("timeout")) {
        console.error("⏱️ Connection timeout - database may be overloaded");
      } else if (error.message.includes("authentication")) {
        console.error("🔐 Authentication failed - check credentials");
      } else if (error.message.includes("database does not exist")) {
        console.error("🗄️ Database not found - check database name");
      }
    }

    return false;
  } finally {
    // Always disconnect after health check to prevent connection leaks
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.warn(
        "Warning: Failed to disconnect from database:",
        disconnectError
      );
    }
  }
}

// Retry wrapper for database operations
export async function withRetry<T>(
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
      console.warn(
        `Database operation failed (attempt ${attempt}/${maxRetries}):`,
        error
      );

      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}
