import { PrismaClient, ExerciseCategory } from "@prisma/client";

const prisma = new PrismaClient();

const defaults: { name: string; category: ExerciseCategory }[] = [
  { name: "Benkpress", category: "push" },
  { name: "Knebøy", category: "legs" },
  { name: "Markløft", category: "pull" },
  { name: "Skulderpress", category: "upper" },
  { name: "Nedtrekk", category: "pull" },
];

async function main() {
  for (const exercise of defaults) {
    await prisma.exercise.upsert({
      where: { userId_name: { userId: null, name: exercise.name } },
      update: {},
      create: { ...exercise, userId: null },
    });
  }
}

main().finally(async () => prisma.$disconnect());
