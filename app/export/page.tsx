"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ExportPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const download = (format: "csv" | "xlsx") => {
    const params = new URLSearchParams({ format, from, to });
    window.location.href = `/api/export?${params.toString()}`;
  };

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Eksport</h1>
      <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => download("csv")}>Last ned CSV</Button>
        <Button onClick={() => download("xlsx")}>Last ned XLSX</Button>
      </div>
    </main>
  );
}
