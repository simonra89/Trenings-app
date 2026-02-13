import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recomputeWorkoutStats } from "@/lib/workout-stats";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workout = await prisma.workout.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { exercises: { include: { exercise: true, sets: true }, orderBy: { order: "asc" } } },
  });

  if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(workout);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const workout = await prisma.workout.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    await tx.workout.update({ where: { id: params.id }, data: { notes: body.notes, date: new Date(body.date) } });
    await tx.set.deleteMany({ where: { workoutExercise: { workoutId: params.id } } });
    await tx.workoutExercise.deleteMany({ where: { workoutId: params.id } });

    for (const [i, ex] of body.exercises.entries()) {
      const workoutExercise = await tx.workoutExercise.create({
        data: { workoutId: params.id, exerciseId: ex.exerciseId, order: i },
      });

      for (const [j, set] of ex.sets.entries()) {
        await tx.set.create({
          data: {
            workoutExerciseId: workoutExercise.id,
            order: j,
            weightKg: Number(set.weightKg),
            reps: Number(set.reps),
            rir: set.rir ? Number(set.rir) : null,
            note: set.note || null,
          },
        });
      }
    }
  });

  await recomputeWorkoutStats(params.id, session.user.id);
  return NextResponse.json({ ok: true });
}
