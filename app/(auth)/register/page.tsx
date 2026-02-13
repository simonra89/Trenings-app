"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mx-auto mt-10 w-full max-w-sm space-y-3 rounded-xl border p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
        });
        if (!res.ok) {
          setError("Kunne ikke registrere bruker");
          return;
        }
        router.push("/login");
      }}
    >
      <h1 className="text-xl font-semibold">Registrer</h1>
      <Input name="email" type="email" placeholder="E-post" required />
      <Input name="password" type="password" placeholder="Passord (min 8 tegn)" required minLength={8} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full">Opprett bruker</Button>
      <p className="text-sm">Har bruker? <Link className="underline" href="/login">Logg inn</Link></p>
    </form>
  );
}
