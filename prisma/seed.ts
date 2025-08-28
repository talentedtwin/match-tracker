import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      id: "test-user-id",
      email: "test@example.com",
      name: "Test User",
    },
  });

  console.log("✅ Created test user:", user.email);

  // Create some sample players
  const players = await Promise.all([
    prisma.player.upsert({
      where: { id: "player-1" },
      update: {},
      create: {
        id: "player-1",
        name: "John Smith",
        goals: 0,
        assists: 0,
        userId: user.id,
      },
    }),
    prisma.player.upsert({
      where: { id: "player-2" },
      update: {},
      create: {
        id: "player-2",
        name: "Mike Johnson",
        goals: 0,
        assists: 0,
        userId: user.id,
      },
    }),
    prisma.player.upsert({
      where: { id: "player-3" },
      update: {},
      create: {
        id: "player-3",
        name: "David Wilson",
        goals: 0,
        assists: 0,
        userId: user.id,
      },
    }),
  ]);

  console.log(
    "✅ Created sample players:",
    players.map((p) => p.name)
  );

  // Create a sample match
  const match = await prisma.match.upsert({
    where: { id: "match-1" },
    update: {},
    create: {
      id: "match-1",
      opponent: "Rival FC",
      date: new Date("2024-01-15"),
      goalsFor: 3,
      goalsAgainst: 1,
      isFinished: true,
      userId: user.id,
    },
  });

  console.log("✅ Created sample match vs", match.opponent);

  // Create player match stats
  await Promise.all([
    prisma.playerMatchStat.upsert({
      where: {
        playerId_matchId: {
          playerId: players[0].id,
          matchId: match.id,
        },
      },
      update: {},
      create: {
        playerId: players[0].id,
        matchId: match.id,
        goals: 2,
        assists: 1,
      },
    }),
    prisma.playerMatchStat.upsert({
      where: {
        playerId_matchId: {
          playerId: players[1].id,
          matchId: match.id,
        },
      },
      update: {},
      create: {
        playerId: players[1].id,
        matchId: match.id,
        goals: 1,
        assists: 0,
      },
    }),
    prisma.playerMatchStat.upsert({
      where: {
        playerId_matchId: {
          playerId: players[2].id,
          matchId: match.id,
        },
      },
      update: {},
      create: {
        playerId: players[2].id,
        matchId: match.id,
        goals: 0,
        assists: 2,
      },
    }),
  ]);

  console.log("✅ Created player match statistics");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
