import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const programs = await prisma.program.findMany({
    where: { userId: session.user.id },
    include: { days: { include: { exercises: { include: { exercise: true }, orderBy: { order: "asc" } } }, orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(programs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const created = await prisma.program.create({
    data: {
      userId: session.user.id,
      name: body.name,
      description: body.description,
      days: {
        create: (body.days || []).map((d: any, i: number) => ({
          name: d.name,
          order: i,
          exercises: {
            create: (d.exercises || []).map((ex: any, j: number) => ({
              exerciseId: ex.exerciseId,
              order: j,
              targetSets: ex.targetSets ? Number(ex.targetSets) : null,
              targetReps: ex.targetReps ? Number(ex.targetReps) : null,
              notes: ex.notes,
            })),
          },
        })),
      },
    },
  });

  return NextResponse.json(created);
}
