"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mx-auto mt-10 w-full max-w-sm space-y-3 rounded-xl border p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const res = await signIn("credentials", {
          email: fd.get("email"),
          password: fd.get("password"),
          redirect: false,
        });
        if (res?.error) setError("Feil e-post eller passord");
        else router.push("/dashboard");
      }}
    >
      <h1 className="text-xl font-semibold">Logg inn</h1>
      <Input name="email" type="email" placeholder="E-post" required />
      <Input name="password" type="password" placeholder="Passord" required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full">Logg inn</Button>
      <p className="text-sm">Ingen bruker? <Link className="underline" href="/register">Registrer</Link></p>
    </form>
  );
}
