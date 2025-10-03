import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Ensure connection is established
let isConnected = false;

export async function ensurePrismaConnection(): Promise<void> {
  if (!isConnected) {
    try {
      await prisma.$connect();
      isConnected = true;
      console.log("✅ Prisma connected to database");
    } catch (error) {
      console.error("❌ Failed to connect Prisma to database:", error);
      throw error;
    }
  }
}

// Connection health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Ensure connection is established first
    await ensurePrismaConnection();

    // Then try a simple query
    await prisma.$queryRaw`SELECT 1 as test`;

    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection check failed:", error);

    // Reset connection status on failure
    isConnected = false;

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
      } else if (error.message.includes("Engine is not yet connected")) {
        console.error("🔗 Prisma engine connection issue - will retry");
      }
    }

    return false;
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
