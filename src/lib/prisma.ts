import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "info"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Ensure connection is established
let isConnected = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

export async function ensurePrismaConnection(): Promise<void> {
  if (!isConnected) {
    connectionAttempts++;
    try {
      console.log(
        `🔗 Attempting to connect to database (attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})`
      );

      // Test the connection with a simple query
      await prisma.$queryRaw`SELECT 1`;

      isConnected = true;
      connectionAttempts = 0; // Reset on success
      console.log("✅ Prisma connected to database successfully");
    } catch (error) {
      console.error(
        `❌ Failed to connect Prisma to database (attempt ${connectionAttempts}):`,
        error
      );

      if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
        console.error(
          "🚫 Max connection attempts reached. Resetting connection state."
        );
        isConnected = false;
        connectionAttempts = 0;

        // Try to disconnect and reconnect
        try {
          await prisma.$disconnect();
        } catch (disconnectError) {
          console.warn("Warning during disconnect:", disconnectError);
        }
      }

      throw error;
    }
  }
}

// Enhanced connection cleanup
export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
    isConnected = false;
    connectionAttempts = 0;
    console.log("🔌 Disconnected from database");
  } catch (error) {
    console.warn("Warning during disconnect:", error);
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

// Retry wrapper for database operations with Supabase-specific handling
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Ensure connection before each attempt
      await ensurePrismaConnection();
      return await operation();
    } catch (error) {
      lastError = error as Error;

      const isConnectionError =
        lastError.message.includes("Can't reach database server") ||
        lastError.message.includes("timeout") ||
        lastError.message.includes("connection") ||
        lastError.message.includes("ECONNREFUSED");

      console.warn(
        `Database operation failed (attempt ${attempt}/${maxRetries}):`,
        {
          error: lastError.message,
          isConnectionError,
          willRetry: attempt < maxRetries,
        }
      );

      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        console.error("🚫 All retry attempts exhausted");
        throw lastError;
      }

      // For connection errors, reset connection state and wait longer
      if (isConnectionError) {
        isConnected = false;
        connectionAttempts = 0;

        // Exponential backoff for connection errors
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(
          `⏳ Connection error detected. Waiting ${delay}ms before retry...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // Shorter delay for non-connection errors
        await new Promise((resolve) => setTimeout(resolve, baseDelay));
      }
    }
  }

  throw lastError!;
}
