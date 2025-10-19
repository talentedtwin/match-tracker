import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateMatchTeams() {
  try {
    console.log("Starting match-team migration...");

    // Find all matches without teamId
    const matchesWithoutTeam = await prisma.match.findMany({
      where: {
        teamId: null,
      },
      include: {
        user: {
          include: {
            teams: {
              where: {
                isDeleted: false,
              },
              take: 1, // Get the first team for each user
            },
          },
        },
      },
    });

    console.log(
      `Found ${matchesWithoutTeam.length} matches without team association`
    );

    let updatedCount = 0;

    for (const match of matchesWithoutTeam) {
      const userTeam = match.user.teams[0];

      if (userTeam) {
        await prisma.match.update({
          where: { id: match.id },
          data: { teamId: userTeam.id },
        });
        updatedCount++;
        console.log(`Updated match ${match.id} with team ${userTeam.id}`);
      } else {
        console.log(
          `No team found for user ${match.userId}, skipping match ${match.id}`
        );
      }
    }

    console.log(`Migration completed! Updated ${updatedCount} matches.`);
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateMatchTeams().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
