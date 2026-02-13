import Link from "next/link";
import { requireUser } from "@/lib/require-user";
import { prisma } from "@/lib/prisma";

export default async function ProgramsPage() {
  const user = await requireUser();
  const programs = await prisma.program.findMany({ where: { userId: user.id }, include: { days: true } });

  return (
    <main className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Programmer</h1>
        <Link href="/programs/new" className="rounded border px-3 py-2">Nytt</Link>
      </div>
      {programs.map((p) => (
        <Link key={p.id} href={`/programs/${p.id}`} className="block rounded-xl border p-3">
          <p className="font-medium">{p.name}</p>
          <p className="text-sm text-muted-foreground">{p.days.length} dager</p>
        </Link>
      ))}
      {!programs.length && <p className="text-sm text-muted-foreground">Ingen programmer enda.</p>}
    </main>
  );
}
