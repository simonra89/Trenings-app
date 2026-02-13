import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = new Date(searchParams.get("from") || "2000-01-01");
  const to = new Date(searchParams.get("to") || new Date().toISOString());
  const format = searchParams.get("format") || "csv";

  const workouts = await prisma.workout.findMany({
    where: { userId: session.user.id, date: { gte: from, lte: to } },
    include: { exercises: { include: { exercise: true, sets: true } } },
    orderBy: { date: "asc" },
  });

  const rows = workouts.flatMap((w) =>
    w.exercises.flatMap((we) =>
      we.sets.map((s) => ({
        date: w.date.toISOString().slice(0, 10),
        workoutId: w.id,
        exercise: we.exercise.name,
        setOrder: s.order + 1,
        weightKg: s.weightKg,
        reps: s.reps,
        rir: s.rir ?? "",
        note: s.note ?? "",
      })),
    ),
  );

  if (format === "xlsx") {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Workout Sets");
    ws.columns = Object.keys(rows[0] || { date: "", workoutId: "", exercise: "", setOrder: "", weightKg: "", reps: "", rir: "", note: "" }).map((k) => ({ header: k, key: k, width: 16 }));
    ws.addRows(rows);
    const buffer = await wb.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=treningsdata.xlsx",
      },
    });
  }

  const header = "date,workoutId,exercise,setOrder,weightKg,reps,rir,note";
  const csv = [header, ...rows.map((r) => Object.values(r).map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=treningsdata.csv",
    },
  });
}
