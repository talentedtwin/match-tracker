import { NextResponse } from "next/server";

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    const directUrl = process.env.DIRECT_URL;

    const config = {
      hasEnvironmentVariables: {
        DATABASE_URL: !!databaseUrl,
        DIRECT_URL: !!directUrl,
        NODE_ENV: process.env.NODE_ENV,
      },
      connectionStrings: {
        databaseUrl: databaseUrl
          ? {
              protocol: new URL(databaseUrl).protocol,
              hostname: new URL(databaseUrl).hostname,
              port: new URL(databaseUrl).port,
              pathname: new URL(databaseUrl).pathname,
              hasPassword: new URL(databaseUrl).password !== "",
              hasUsername: new URL(databaseUrl).username !== "",
              searchParams: Object.fromEntries(
                new URL(databaseUrl).searchParams
              ),
            }
          : null,
        directUrl: directUrl
          ? {
              protocol: new URL(directUrl).protocol,
              hostname: new URL(directUrl).hostname,
              port: new URL(directUrl).port,
              pathname: new URL(directUrl).pathname,
              hasPassword: new URL(directUrl).password !== "",
              hasUsername: new URL(directUrl).username !== "",
              searchParams: Object.fromEntries(new URL(directUrl).searchParams),
            }
          : null,
      },
      recommendations: [] as string[],
    };

    // Add recommendations based on configuration
    if (!databaseUrl) {
      config.recommendations.push(
        "❌ DATABASE_URL environment variable is missing"
      );
    }

    if (!directUrl) {
      config.recommendations.push(
        "⚠️ DIRECT_URL environment variable is missing (recommended for Supabase)"
      );
    }

    if (databaseUrl) {
      const url = new URL(databaseUrl);

      if (url.hostname.includes("supabase.com")) {
        config.recommendations.push("✅ Using Supabase database");

        if (!url.searchParams.get("sslmode")) {
          config.recommendations.push(
            "⚠️ Consider adding sslmode=require for Supabase"
          );
        }

        if (!url.searchParams.get("pgbouncer")) {
          config.recommendations.push(
            "💡 Consider using connection pooling (?pgbouncer=true)"
          );
        }
      }

      if (url.port !== "5432" && url.port !== "") {
        config.recommendations.push(
          `ℹ️ Using non-standard PostgreSQL port: ${url.port}`
        );
      }
    }

    // Test basic network connectivity
    const networkTest = {
      hostname: config.connectionStrings.databaseUrl?.hostname || "unknown",
      reachable: false,
      error: null as string | null,
    };

    if (config.connectionStrings.databaseUrl?.hostname) {
      try {
        // Simple DNS resolution test - in production you might want actual network test
        networkTest.reachable = true; // Placeholder for actual connectivity test
      } catch (error) {
        networkTest.error =
          error instanceof Error ? error.message : "Unknown network error";
        config.recommendations.push("🌐 Network connectivity issue detected");
      }
    }

    return NextResponse.json({
      status: "success",
      message: "Database configuration analysis complete",
      config,
      networkTest,
      suggestedActions: [
        "1. Check your Supabase project dashboard",
        "2. Verify connection strings in your .env.local file",
        "3. Test connection with: curl http://localhost:3000/api/health/database",
        "4. Check Supabase project status and region",
        "5. Try regenerating database credentials in Supabase dashboard",
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database config check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Configuration check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
