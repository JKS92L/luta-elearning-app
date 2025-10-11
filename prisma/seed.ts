import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create subjects
  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        name: "Mathematics",
        description: "Advanced mathematics courses",
        category: "SCIENCE",
      },
    }),
    prisma.subject.create({
      data: {
        name: "Physics",
        description: "Physics and related sciences",
        category: "SCIENCE",
      },
    }),
    prisma.subject.create({
      data: {
        name: "Programming",
        description: "Computer programming courses",
        category: "TECHNOLOGY",
      },
    }),
  ]);

  console.log("Seeded database with subjects");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
