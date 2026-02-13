import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stats = await prisma.exerciseStat.findMany({
    where: { userId: session.user.id, exerciseId: params.id },
    include: { workout: true },
    orderBy: { workout: { date: "asc" } },
  });

  return NextResponse.json(
    stats.map((s) => ({
      date: s.workout.date,
      bestEstimated1RM: s.bestEstimated1RM,
      volume: s.volume,
    })),
  );
}
