import { NextResponse } from "next/server";
import { checkDatabaseConnection, prisma, ensurePrismaConnection } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();

  try {
    // Environment variable checks
    const databaseUrl = process.env.DATABASE_URL;
    const directUrl = process.env.DIRECT_URL;

    const diagnostics = {
      environment: {
        hasDatabaseUrl: !!databaseUrl,
        hasDirectUrl: !!directUrl,
        databaseUrlHost: databaseUrl
          ? new URL(databaseUrl).hostname
          : "not set",
        nodeEnv: process.env.NODE_ENV,
      },
      connection: {
        status: "unknown",
        responseTime: 0,
        error: null as string | null,
      },
      query: {
        status: "unknown",
        userCount: null as number | null,
        error: null as string | null,
      },
    };

    // Test basic connection
    const connectionStart = Date.now();
    try {
      const isConnected = await checkDatabaseConnection();
      diagnostics.connection.responseTime = Date.now() - connectionStart;

      if (isConnected) {
        diagnostics.connection.status = "connected";
      } else {
        diagnostics.connection.status = "failed";
        diagnostics.connection.error = "Connection check returned false";
      }
    } catch (error) {
      diagnostics.connection.status = "error";
      diagnostics.connection.responseTime = Date.now() - connectionStart;
      diagnostics.connection.error =
        error instanceof Error ? error.message : "Unknown connection error";
    }

    // Test query if connection is successful
    if (diagnostics.connection.status === "connected") {
      try {
        // Ensure connection before running query
        await ensurePrismaConnection();
        
        const userCount = await prisma.user.count();
        diagnostics.query.status = "success";
        diagnostics.query.userCount = userCount;
      } catch (error) {
        diagnostics.query.status = "error";
        diagnostics.query.error =
          error instanceof Error ? error.message : "Unknown query error";
      }
    }

    const totalTime = Date.now() - startTime;

    // Determine overall status
    const isHealthy =
      diagnostics.connection.status === "connected" &&
      diagnostics.query.status === "success";

    if (isHealthy) {
      return NextResponse.json({
        status: "healthy",
        message: "Database connection successful",
        totalResponseTime: totalTime,
        diagnostics,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Database connection issues detected",
          totalResponseTime: totalTime,
          diagnostics,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Database health check failed:", error);

    const totalTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown database error",
        totalResponseTime: totalTime,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
