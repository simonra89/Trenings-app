import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/require-user";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function ProgramDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const program = await prisma.program.findFirst({
    where: { id: params.id, userId: user.id },
    include: { days: { include: { exercises: { include: { exercise: true }, orderBy: { order: "asc" } } }, orderBy: { order: "asc" } } },
  });
  if (!program) notFound();

  async function start(dayId: string) {
    "use server";
    const day = await prisma.programDay.findFirst({
      where: { id: dayId, programId: params.id, program: { userId: user.id } },
      include: { exercises: true },
    });
    if (!day) return;
    await prisma.workout.create({
      data: {
        userId: user.id,
        date: new Date(),
        notes: `Fra programøkt: ${day.name}`,
        exercises: { create: day.exercises.map((ex, idx) => ({ exerciseId: ex.exerciseId, order: idx })) },
      },
    });
    redirect("/workouts");
  }

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">{program.name}</h1>
      {program.days.map((d) => (
        <div key={d.id} className="rounded-xl border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">{d.name}</p>
            <form action={start.bind(null, d.id)}><Button>Start økt</Button></form>
          </div>
          {d.exercises.map((e) => <p key={e.id} className="text-sm">{e.exercise.name} ({e.targetSets || '-'}x{e.targetReps || '-'})</p>)}
        </div>
      ))}
    </main>
  );
}
