"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ExerciseProgressPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/progress/exercise/${params.id}`).then((r) => r.json()).then(setData);
  }, [params.id]);

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Progresjon</h1>
      {!data.length ? <p className="text-sm text-muted-foreground">Ingen historikk enda.</p> : (
        <>
          <div className="h-64 w-full rounded-xl border p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="date" tickFormatter={(v) => String(v).slice(5, 10)} />
                <YAxis />
                <Tooltip />
                <Line dataKey="bestEstimated1RM" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border p-3">
            <table className="w-full text-sm">
              <thead><tr><th className="text-left">Dato</th><th>1RM</th><th>Volum</th></tr></thead>
              <tbody>{data.map((r) => <tr key={r.date}><td>{String(r.date).slice(0,10)}</td><td className="text-center">{r.bestEstimated1RM}</td><td className="text-center">{r.volume}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
