"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type WorkoutExercise = { exerciseId: string; name: string; sets: { weightKg: number; reps: number; rir?: number | null; note?: string | null }[] };

export default function WorkoutDetailPage() {
  const params = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<any>(null);
  const [allExercises, setAllExercises] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/workouts/${params.id}`).then((r) => r.json()).then((w) => setWorkout({
      ...w,
      exercises: w.exercises.map((x: any) => ({
        exerciseId: x.exerciseId,
        name: x.exercise.name,
        sets: x.sets,
      })),
    }));
    fetch("/api/exercises").then((r) => r.json()).then(setAllExercises);
  }, [params.id]);

  const save = async () => {
    await fetch(`/api/workouts/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    });
  };

  useEffect(() => {
    if (!workout) return;
    const t = setTimeout(save, 1200);
    return () => clearTimeout(t);
  }, [workout]);

  if (!workout) return <p>Laster…</p>;

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Loggfør økt</h1>
      <Input type="date" value={new Date(workout.date).toISOString().slice(0, 10)} onChange={(e) => setWorkout({ ...workout, date: e.target.value })} />
      {workout.exercises.map((ex: WorkoutExercise, exIdx: number) => (
        <div key={`${ex.exerciseId}-${exIdx}`} className="rounded-xl border p-3 space-y-2">
          <p className="font-medium">{ex.name}</p>
          {ex.sets.map((s, sIdx) => (
            <div className="grid grid-cols-4 gap-2" key={sIdx}>
              <Input type="number" placeholder="kg" value={s.weightKg} onChange={(e) => { const copy=[...workout.exercises]; copy[exIdx].sets[sIdx].weightKg=Number(e.target.value); setWorkout({...workout, exercises: copy}); }} />
              <Input type="number" placeholder="reps" value={s.reps} onChange={(e) => { const copy=[...workout.exercises]; copy[exIdx].sets[sIdx].reps=Number(e.target.value); setWorkout({...workout, exercises: copy}); }} />
              <Input type="number" placeholder="RIR" value={s.rir ?? ""} onChange={(e) => { const copy=[...workout.exercises]; copy[exIdx].sets[sIdx].rir=e.target.value ? Number(e.target.value) : null; setWorkout({...workout, exercises: copy}); }} />
              <Button type="button" onClick={() => { const copy=[...workout.exercises]; copy[exIdx].sets.splice(sIdx,1); setWorkout({...workout, exercises: copy}); }}>Slett</Button>
            </div>
          ))}
          <Button type="button" className="w-full" onClick={() => { const copy=[...workout.exercises]; copy[exIdx].sets.push({weightKg:0,reps:0}); setWorkout({...workout, exercises: copy}); }}>+ Sett</Button>
        </div>
      ))}
      <select className="h-10 w-full rounded-md border px-3" onChange={(e) => {
        const found = allExercises.find((x) => x.id === e.target.value);
        if (!found) return;
        setWorkout({ ...workout, exercises: [...workout.exercises, { exerciseId: found.id, name: found.name, sets: [] }] });
      }}>
        <option>Legg til øvelse…</option>
        {allExercises.filter((x) => !x.isArchived).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
      </select>
      <Button onClick={save} className="w-full">Ferdig / lagre</Button>
    </main>
  );
}
