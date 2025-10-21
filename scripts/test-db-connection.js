// Independent Supabase connection test
// Run with: node scripts/test-db-connection.js

const { PrismaClient } = require("@prisma/client");

async function testConnection() {
  console.log("🔍 Testing Supabase database connection...\n");

  // Check environment variables
  console.log("📋 Environment Check:");
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log("DIRECT_URL exists:", !!process.env.DIRECT_URL);
  console.log("NODE_ENV:", process.env.NODE_ENV);

  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      console.log("Database host:", url.hostname);
      console.log("Database port:", url.port || "5432");
      console.log("Database name:", url.pathname.substring(1));
      console.log("Has SSL params:", url.searchParams.has("sslmode"));
    } catch (e) {
      console.log("❌ Invalid DATABASE_URL format");
    }
  }

  console.log("\n🔌 Connection Test:");

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  try {
    // Test 1: Basic connection
    console.log("1. Testing basic connection...");
    await prisma.$connect();
    console.log("✅ Connected to database");

    // Test 2: Simple query
    console.log("2. Testing simple query...");
    const result = await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`;
    console.log("✅ Query successful:", result);

    // Test 3: Check if users table exists
    console.log("3. Testing table access...");
    const userCount = await prisma.user.count();
    console.log("✅ Users table accessible, count:", userCount);

    console.log("\n🎉 All tests passed! Database connection is working.");
  } catch (error) {
    console.log("\n❌ Connection test failed:");
    console.error(error);

    // Provide specific troubleshooting
    if (error.message.includes("Can't reach database server")) {
      console.log("\n🔧 Troubleshooting suggestions:");
      console.log("1. Check if your Supabase project is active");
      console.log("2. Verify the connection string is correct");
      console.log("3. Check your internet connection");
      console.log("4. Try using DIRECT_URL instead of DATABASE_URL");
      console.log("5. Check Supabase status: https://status.supabase.com/");
    }

    if (error.message.includes("authentication")) {
      console.log("\n🔧 Authentication issue:");
      console.log("1. Check your database password");
      console.log("2. Regenerate database credentials in Supabase dashboard");
      console.log("3. Make sure the user has proper permissions");
    }
  } finally {
    await prisma.$disconnect();
    console.log("\n🔒 Disconnected from database");
  }
}

// Run the test
testConnection().catch(console.error);
