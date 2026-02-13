import Link from "next/link";
import { requireUser } from "@/lib/require-user";
import { prisma } from "@/lib/prisma";

export default async function WorkoutsPage() {
  const user = await requireUser();
  const workouts = await prisma.workout.findMany({ where: { userId: user.id }, orderBy: { date: "desc" } });

  return (
    <main className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Treningsøkter</h1>
        <Link href="/workouts/new" className="rounded border px-3 py-2">Ny</Link>
      </div>
      {workouts.map((w) => (
        <Link key={w.id} href={`/workouts/${w.id}`} className="block rounded-xl border p-3">{w.date.toISOString().slice(0, 10)}</Link>
      ))}
      {!workouts.length && <p className="text-sm text-muted-foreground">Ingen økter registrert.</p>}
    </main>
  );
}
