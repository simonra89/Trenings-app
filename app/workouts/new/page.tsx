"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewWorkoutPage() {
  const router = useRouter();

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Ny treningsøkt</h1>
      <Button
        onClick={async () => {
          const res = await fetch("/api/workouts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: new Date() }) });
          const data = await res.json();
          router.push(`/workouts/${data.id}`);
        }}
      >
        Opprett tom økt
      </Button>
    </main>
  );
}
