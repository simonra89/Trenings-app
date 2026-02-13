import Link from "next/link";
import { requireUser } from "@/lib/require-user";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await requireUser();
  const workouts = await prisma.workout.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 5 });

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/workouts/new" className="rounded-xl border p-4 text-center font-medium">+ Ny økt</Link>
        <Link href="/export" className="rounded-xl border p-4 text-center font-medium">Eksporter data</Link>
      </div>
      <Card>
        <h2 className="mb-2 font-semibold">Siste økter</h2>
        {workouts.length === 0 ? <p className="text-sm text-muted-foreground">Ingen økter enda.</p> : (
          <ul className="space-y-2 text-sm">
            {workouts.map((w) => (
              <li key={w.id}><Link className="underline" href={`/workouts/${w.id}`}>{w.date.toISOString().slice(0, 10)}</Link></li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}
