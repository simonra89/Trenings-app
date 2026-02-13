import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { dayId } = await req.json();

  const day = await prisma.programDay.findFirst({
    where: { id: dayId, programId: params.id, program: { userId: session.user.id } },
    include: { exercises: { orderBy: { order: "asc" } } },
  });

  if (!day) return NextResponse.json({ error: "Day not found" }, { status: 404 });

  const workout = await prisma.workout.create({
    data: {
      userId: session.user.id,
      date: new Date(),
      notes: `Fra programøkt: ${day.name}`,
      exercises: {
        create: day.exercises.map((ex, idx) => ({
          exerciseId: ex.exerciseId,
          order: idx,
        })),
      },
    },
  });

  return NextResponse.json(workout);
}
