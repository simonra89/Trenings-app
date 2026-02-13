import { prisma } from "@/lib/prisma";
import { estimate1RM } from "@/lib/utils";

export async function recomputeWorkoutStats(workoutId: string, userId: string) {
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId, userId },
    include: { exercises: { include: { sets: true } } },
  });
  if (!workout) return;

  await prisma.exerciseStat.deleteMany({ where: { workoutId } });

  for (const ex of workout.exercises) {
    const oneRMs = ex.sets.map((s) => estimate1RM(s.weightKg, s.reps));
    const volume = ex.sets.reduce((acc, s) => acc + s.weightKg * s.reps, 0);
    if (!oneRMs.length) continue;
    await prisma.exerciseStat.create({
      data: {
        userId,
        workoutId,
        exerciseId: ex.exerciseId,
        bestEstimated1RM: Math.max(...oneRMs),
        volume,
      },
    });
  }
}
