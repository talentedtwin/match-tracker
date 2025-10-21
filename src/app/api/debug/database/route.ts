import { NextResponse } from "next/server";
import { prisma, ensurePrismaConnection } from "@/lib/prisma";

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    tests: [] as Array<{
      test: string;
      status: "success" | "error";
      result?: object;
      error?: string;
      duration: number;
    }>,
  };

  // Test 1: Basic connection
  const connectionStart = Date.now();
  try {
    await ensurePrismaConnection();
    diagnostics.tests.push({
      test: "Basic Connection",
      status: "success",
      duration: Date.now() - connectionStart,
    });
  } catch (error) {
    diagnostics.tests.push({
      test: "Basic Connection",
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - connectionStart,
    });
  }

  // Test 2: Simple query
  const queryStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1 as test`;
    diagnostics.tests.push({
      test: "Simple Query",
      status: "success",
      duration: Date.now() - queryStart,
    });
  } catch (error) {
    diagnostics.tests.push({
      test: "Simple Query",
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - queryStart,
    });
  }

  // Test 3: User count
  const userStart = Date.now();
  try {
    const userCount = await prisma.user.count();
    diagnostics.tests.push({
      test: "User Count",
      status: "success",
      result: { count: userCount },
      duration: Date.now() - userStart,
    });
  } catch (error) {
    diagnostics.tests.push({
      test: "User Count",
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - userStart,
    });
  }

  // Test 4: Team count
  const teamStart = Date.now();
  try {
    const teamCount = await prisma.team.count();
    diagnostics.tests.push({
      test: "Team Count",
      status: "success",
      result: { count: teamCount },
      duration: Date.now() - teamStart,
    });
  } catch (error) {
    diagnostics.tests.push({
      test: "Team Count",
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - teamStart,
    });
  }

  // Test 5: Player count
  const playerStart = Date.now();
  try {
    const playerCount = await prisma.player.count();
    diagnostics.tests.push({
      test: "Player Count",
      status: "success",
      result: { count: playerCount },
      duration: Date.now() - playerStart,
    });
  } catch (error) {
    diagnostics.tests.push({
      test: "Player Count",
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - playerStart,
    });
  }

  // Test 6: Match count
  const matchStart = Date.now();
  try {
    const matchCount = await prisma.match.count();
    diagnostics.tests.push({
      test: "Match Count",
      status: "success",
      result: { count: matchCount },
      duration: Date.now() - matchStart,
    });
  } catch (error) {
    diagnostics.tests.push({
      test: "Match Count",
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - matchStart,
    });
  }

  // Test 7: Database info
  const dbInfoStart = Date.now();
  try {
    const dbInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port,
        version() as version
    `;
    diagnostics.tests.push({
      test: "Database Info",
      status: "success",
      result: dbInfo as object,
      duration: Date.now() - dbInfoStart,
    });
  } catch (error) {
    diagnostics.tests.push({
      test: "Database Info",
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - dbInfoStart,
    });
  }

  // Summary
  const successCount = diagnostics.tests.filter(
    (t) => t.status === "success"
  ).length;
  const totalTests = diagnostics.tests.length;

  return NextResponse.json({
    ...diagnostics,
    summary: {
      total: totalTests,
      success: successCount,
      failed: totalTests - successCount,
      success_rate: `${Math.round((successCount / totalTests) * 100)}%`,
    },
  });
}
