"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewProgramPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<any[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/exercises").then((r) => r.json()).then(setExercises);
  }, []);

  return (
    <main className="space-y-3">
      <h1 className="text-xl font-bold">Nytt program</h1>
      <form className="space-y-2" onSubmit={async (e) => {
        e.preventDefault();
        const chosen = exercises.filter((x) => x._selected);
        const res = await fetch("/api/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, days: [{ name: "Dag 1", exercises: chosen.map((x) => ({ exerciseId: x.id, targetSets: 3, targetReps: 8 })) }] }),
        });
        const data = await res.json();
        router.push(`/programs/${data.id}`);
      }}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Programnavn" required />
        <div className="space-y-2 rounded-xl border p-3">
          {exercises.filter((x) => !x.isArchived).map((x, idx) => (
            <label key={x.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(x._selected)} onChange={(e) => {
                const copy = [...exercises];
                copy[idx]._selected = e.target.checked;
                setExercises(copy);
              }} />
              {x.name}
            </label>
          ))}
        </div>
        <Button className="w-full">Lagre program</Button>
      </form>
    </main>
  );
}
