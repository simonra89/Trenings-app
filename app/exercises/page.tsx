"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ExercisesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("push");

  const load = () => fetch("/api/exercises").then((r) => r.json()).then(setItems);
  useEffect(load, []);

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Øvelser</h1>
      <form className="space-y-2 rounded-xl border p-3" onSubmit={async (e) => {
        e.preventDefault();
        await fetch("/api/exercises", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, category }) });
        setName("");
        load();
      }}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ny øvelse" required />
        <select className="h-10 w-full rounded-md border px-3" value={category} onChange={(e) => setCategory(e.target.value)}>
          {['push','pull','legs','upper','lower','annet'].map((c)=><option key={c}>{c}</option>)}
        </select>
        <Button className="w-full">Legg til</Button>
      </form>
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-xl border p-3">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.category} {item.isArchived ? '(arkivert)' : ''}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/progress/exercise/${item.id}`} className="rounded border px-2 py-1 text-xs">Progresjon</Link>
            <Button type="button" className="h-8 px-2 text-xs" onClick={async () => {
              await fetch('/api/exercises', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, isArchived: !item.isArchived }) });
              load();
            }}>{item.isArchived ? 'Aktiver' : 'Arkiver'}</Button>
          </div>
        </div>
      ))}
    </main>
  );
}
