import { NextResponse } from "next/server";
import { withRetry, ensurePrismaConnection } from "@/lib/prisma";
import { dbUtils } from "@/lib/db-utils";

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    connectionStatus: "unknown" as "success" | "error" | "unknown",
    tests: [] as Array<{
      operation: string;
      status: "success" | "error";
      duration: number;
      error?: string;
    }>,
  };

  // Test 1: Basic connection
  const connectionStart = Date.now();
  try {
    await ensurePrismaConnection();
    results.tests.push({
      operation: "ensurePrismaConnection",
      status: "success",
      duration: Date.now() - connectionStart,
    });
    results.connectionStatus = "success";
  } catch (error) {
    results.tests.push({
      operation: "ensurePrismaConnection",
      status: "error",
      duration: Date.now() - connectionStart,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    results.connectionStatus = "error";
  }

  // Test 2: dbUtils.getUser with retry
  const getUserStart = Date.now();
  try {
    await withRetry(async () => {
      // Use a test user ID that doesn't exist to avoid auth issues
      return await dbUtils.getUser("test-user-id");
    });
    results.tests.push({
      operation: "dbUtils.getUser with retry",
      status: "success",
      duration: Date.now() - getUserStart,
    });
  } catch (error) {
    results.tests.push({
      operation: "dbUtils.getUser with retry",
      status: "error",
      duration: Date.now() - getUserStart,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // Test 3: dbUtils.getTeams with retry
  const getTeamsStart = Date.now();
  try {
    await withRetry(async () => {
      // Use a test user ID that doesn't exist to avoid auth issues
      return await dbUtils.getTeams("test-user-id");
    });
    results.tests.push({
      operation: "dbUtils.getTeams with retry",
      status: "success",
      duration: Date.now() - getTeamsStart,
    });
  } catch (error) {
    results.tests.push({
      operation: "dbUtils.getTeams with retry",
      status: "error",
      duration: Date.now() - getTeamsStart,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return NextResponse.json(results);
}
